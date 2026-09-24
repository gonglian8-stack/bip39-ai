import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { wordlist as scureEnglish } from '@scure/bip39/wordlists/english.js';
import {
  analyzeMnemonic, bytesToHex, checksumSteps, hexToBytes, parseEntropyHex, randomEntropy,
  seedFingerprint, sizes, suggest, toEntropy, toMnemonic, toSeed, WORD_COUNTS,
} from '../src/lib/bip39';
import { VECTORS, VECTOR_PASSPHRASE } from '../src/data/vectors';
import { WORDLIST } from '../src/data/wordlist-english';

describe('wordlist', () => {
  it('matches the pinned upstream file and the @scure/bip39 copy', () => {
    const upstream = readFileSync('data/upstream/english.txt', 'utf8').trim().split('\n');
    expect(WORDLIST).toEqual(upstream);
    expect(WORDLIST).toEqual(scureEnglish);
  });
  it('has unique 4-letter prefixes', () => {
    expect(new Set(WORDLIST.map((w) => w.slice(0, 4))).size).toBe(2048);
  });
});

describe('sizes', () => {
  it('follows CS = ENT/32 and MS = (ENT+CS)/11', () => {
    expect(WORD_COUNTS.map((n) => [sizes(n).ent, sizes(n).cs])).toEqual([
      [128, 4], [160, 5], [192, 6], [224, 7], [256, 8],
    ]);
  });
});

describe('official test vectors', () => {
  it.each(VECTORS)('vector $id', async (v) => {
    expect(toMnemonic(hexToBytes(v.entropy))).toBe(v.mnemonic);
    expect(bytesToHex(toEntropy(v.mnemonic))).toBe(v.entropy);
    expect(bytesToHex(await toSeed(v.mnemonic, VECTOR_PASSPHRASE))).toBe(v.seed);
    expect(checksumSteps(hexToBytes(v.entropy)).mnemonic).toBe(v.mnemonic);
    expect(analyzeMnemonic(v.mnemonic).checksumValid).toBe(true);
  });
});

describe('cross-check against python-mnemonic', () => {
  const fx = JSON.parse(readFileSync('tests/fixtures/crosscheck.json', 'utf8'));
  it('has fixtures', () => expect(fx.valid.length).toBeGreaterThan(100));
  it.each(fx.valid as any[])('$entropy', async (c) => {
    expect(toMnemonic(hexToBytes(c.entropy))).toBe(c.mnemonic);
    expect(checksumSteps(hexToBytes(c.entropy)).hashHex).toBe(c.checksum_hash);
    expect(bytesToHex(await toSeed(c.mnemonic, c.passphrase))).toBe(c.seed);
  });
  it('rejects every invalid-checksum fixture', () => {
    for (const m of fx.invalid) {
      const a = analyzeMnemonic(m);
      expect(a.unknown).toEqual([]);
      expect(a.checksumValid).toBe(false);
    }
  });
});

describe('analyzeMnemonic', () => {
  const v1 = VECTORS[0].mnemonic;
  it('normalizes whitespace and case', () => {
    expect(analyzeMnemonic(`  ${v1.toUpperCase().replace(/ /g, '  \n')} `).checksumValid).toBe(true);
  });
  it('reports bad word counts without evaluating the checksum', () => {
    const a = analyzeMnemonic('abandon abandon abandon');
    expect(a).toMatchObject({ count: 3, countValid: false, checksumValid: null });
  });
  it('reports unknown word positions with suggestions', () => {
    const a = analyzeMnemonic(v1.replace(/^abandon/, 'abandn'));
    expect(a.unknown).toEqual([{ position: 1, word: 'abandn', suggestions: ['abandon'] }]);
    expect(a.checksumValid).toBeNull();
  });
  it('detects a checksum mismatch', () => {
    const a = analyzeMnemonic(v1.replace(/about$/, 'abandon'));
    expect(a).toMatchObject({ checksumValid: false, expectedChecksum: '0011', actualChecksum: '0000' });
  });
});

describe('helpers', () => {
  it('parses entropy hex', () => {
    expect(parseEntropyHex('')).toEqual({ error: 'empty' });
    expect(parseEntropyHex('zz')).toEqual({ error: 'not-hex' });
    expect(parseEntropyHex('00ff')).toEqual({ error: 'bad-length' });
    expect('bytes' in parseEntropyHex('0x' + '7f'.repeat(16))).toBe(true);
  });
  it('generates entropy of the right size', () => {
    for (const n of WORD_COUNTS) {
      const e = randomEntropy(n);
      expect(e.length * 8).toBe(sizes(n).ent);
      expect(analyzeMnemonic(toMnemonic(e)).checksumValid).toBe(true);
    }
  });
  it('marks checksum bits in the last group only', () => {
    const s = checksumSteps(hexToBytes(VECTORS[0].entropy));
    expect(s.groups.map((g) => g.checksumBits)).toEqual([...Array(11).fill(0), 4]);
    expect(s.groups[11]).toMatchObject({ bits: '00000000011', index: 3, word: 'about' });
  });
  it('suggests near words', () => {
    expect(suggest('zoo')).toContain('zoo');
    expect(suggest('abandom')).toEqual(['abandon']);
  });
  it('fingerprints are 8 hex chars', async () => {
    expect(seedFingerprint(await toSeed(VECTORS[0].mnemonic, 'TREZOR'))).toMatch(/^[0-9a-f]{8}$/);
  });
});
