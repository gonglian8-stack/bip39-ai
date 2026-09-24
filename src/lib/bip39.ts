// BIP39 core used by every tool. Encoding/decoding and seed derivation are
// delegated to @scure/bip39; this module adds the step-by-step diagnostics the
// UI needs (bit groups, checksum bits, unknown-word positions).
import { entropyToMnemonic, mnemonicToEntropy, mnemonicToSeed } from '@scure/bip39';
import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils.js';
import { WORDLIST } from '../data/wordlist-english';

export { bytesToHex, hexToBytes };

export const WORD_COUNTS = [12, 15, 18, 21, 24] as const;
export type WordCount = (typeof WORD_COUNTS)[number];

const WORD_INDEX = new Map(WORDLIST.map((w, i) => [w, i]));
const wordlist = WORDLIST as string[];

/** ENT, CS and MS for a word count (BIP39: CS = ENT / 32, MS = (ENT + CS) / 11). */
export function sizes(words: number) {
  const total = words * 11;
  const ent = (total * 32) / 33;
  return { words, ent, cs: ent / 32, total, bytes: ent / 8, hexChars: ent / 4 };
}

export const hasSecureRandom = (): boolean =>
  typeof globalThis.crypto?.getRandomValues === 'function';

export function randomEntropy(words: WordCount): Uint8Array {
  if (!hasSecureRandom()) throw new Error('secure-random-unavailable');
  const bytes = new Uint8Array(sizes(words).bytes);
  globalThis.crypto.getRandomValues(bytes);
  return bytes;
}

export const toMnemonic = (entropy: Uint8Array): string => entropyToMnemonic(entropy, wordlist);
export const toEntropy = (mnemonic: string): Uint8Array =>
  mnemonicToEntropy(normalizeMnemonic(mnemonic).join(' '), wordlist);

export async function toSeed(mnemonic: string, passphrase = ''): Promise<Uint8Array> {
  return mnemonicToSeed(normalizeMnemonic(mnemonic).join(' '), passphrase);
}

/** Short, non-reversible label for comparing seeds on screen: first 4 bytes of SHA-256(seed). */
export const seedFingerprint = (seed: Uint8Array): string => bytesToHex(sha256(seed).slice(0, 4));

export function normalizeMnemonic(input: string): string[] {
  const s = input.normalize('NFKD').trim().toLowerCase();
  return s ? s.split(/\s+/) : [];
}

const bitsOf = (bytes: Uint8Array): string =>
  Array.from(bytes, (b) => b.toString(2).padStart(8, '0')).join('');

export interface BitGroup { bits: string; index: number; word: string; checksumBits: number }
export interface ChecksumSteps {
  ent: number; cs: number;
  entropyHex: string; entropyBits: string;
  hashHex: string; checksumBits: string;
  groups: BitGroup[]; mnemonic: string;
}

/** Every intermediate value of entropy → mnemonic, for the checksum visualisation. */
export function checksumSteps(entropy: Uint8Array): ChecksumSteps {
  const ent = entropy.length * 8;
  if (ent < 128 || ent > 256 || ent % 32) throw new Error('invalid-entropy-length');
  const cs = ent / 32;
  const hash = sha256(entropy);
  const entropyBits = bitsOf(entropy);
  const checksumBits = bitsOf(hash).slice(0, cs);
  const all = entropyBits + checksumBits;
  const groups: BitGroup[] = [];
  for (let i = 0; i < all.length; i += 11) {
    const bits = all.slice(i, i + 11);
    const index = parseInt(bits, 2);
    groups.push({ bits, index, word: WORDLIST[index], checksumBits: Math.max(0, i + 11 - ent) });
  }
  return {
    ent, cs, entropyHex: bytesToHex(entropy), entropyBits, hashHex: bytesToHex(hash),
    checksumBits, groups, mnemonic: groups.map((g) => g.word).join(' '),
  };
}

export type EntropyError = 'empty' | 'not-hex' | 'bad-length';
export function parseEntropyHex(input: string): { bytes: Uint8Array } | { error: EntropyError } {
  const hex = input.replace(/\s+/g, '').replace(/^0x/i, '').toLowerCase();
  if (!hex) return { error: 'empty' };
  if (!/^[0-9a-f]+$/.test(hex)) return { error: 'not-hex' };
  if (![32, 40, 48, 56, 64].includes(hex.length)) return { error: 'bad-length' };
  return { bytes: hexToBytes(hex) };
}

export interface UnknownWord { position: number; word: string; suggestions: string[] }
export interface MnemonicAnalysis {
  words: string[];
  count: number;
  countValid: boolean;
  unknown: UnknownWord[];
  /** null when it could not be evaluated (bad count or unknown words). */
  checksumValid: boolean | null;
  expectedChecksum?: string;
  actualChecksum?: string;
}

export function analyzeMnemonic(input: string): MnemonicAnalysis {
  const words = normalizeMnemonic(input);
  const count = words.length;
  const countValid = (WORD_COUNTS as readonly number[]).includes(count);
  const unknown: UnknownWord[] = [];
  words.forEach((word, i) => {
    if (!WORD_INDEX.has(word)) unknown.push({ position: i + 1, word, suggestions: suggest(word) });
  });
  const result: MnemonicAnalysis = { words, count, countValid, unknown, checksumValid: null };
  if (!countValid || unknown.length) return result;

  const bits = words.map((w) => WORD_INDEX.get(w)!.toString(2).padStart(11, '0')).join('');
  const { ent, cs } = sizes(count);
  const entropy = new Uint8Array(ent / 8);
  for (let i = 0; i < entropy.length; i++) entropy[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  result.actualChecksum = bits.slice(ent);
  result.expectedChecksum = bitsOf(sha256(entropy)).slice(0, cs);
  result.checksumValid = result.actualChecksum === result.expectedChecksum;
  return result;
}

/** Up to 3 wordlist entries close to an unknown word: same first 4 letters first, then edit distance ≤ 2. */
export function suggest(word: string): string[] {
  if (word.length >= 4) {
    const prefix = WORDLIST.filter((w) => w.startsWith(word.slice(0, 4)));
    if (prefix.length) return prefix.slice(0, 3);
  }
  return WORDLIST.map((w) => [w, distance(word, w)] as const)
    .filter(([, d]) => d <= 2)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([w]) => w);
}

function distance(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}
