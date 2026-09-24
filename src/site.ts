// Site-wide facts. Anything not yet true is null and rendered as "Not yet available" / TODO.
import { execSync } from 'node:child_process';
import pkg from '../package.json';

function gitCommit(): string | null {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

export const SITE = {
  name: 'BIP39.ai',
  url: 'https://bip39.ai',
  version: pkg.version,
  commit: gitCommit(),
  license: 'MIT',
  repoUrl: 'https://github.com/gonglian8-stack/bip39-ai' as string | null,
  maintainer: { name: 'gonglian8-stack', url: 'https://github.com/gonglian8-stack' } as { name: string; url: string } | null,
  specUrl: 'https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki',
  wordlistUrl: 'https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt',
  vectorsUrl: 'https://github.com/trezor/python-mnemonic/blob/master/vectors.json',
  lastReviewed: '2026-09-24',
  offlineFile: `bip39-ai-offline-v${pkg.version}.html`,
};

export interface NavItem { href: string; title: string; desc: string }

export const TOOLS: NavItem[] = [
  { href: '/bip39-generator/', title: 'Generator', desc: 'Create 12–24 word test mnemonics' },
  { href: '/bip39-validator/', title: 'Validator', desc: 'Check words, word count and checksum' },
  { href: '/bip39-converter/', title: 'Converter', desc: 'Entropy ↔ mnemonic, mnemonic → seed' },
  { href: '/bip39-checksum/', title: 'Checksum', desc: 'See the checksum built step by step' },
];

export const LEARN: NavItem[] = [
  { href: '/what-is-bip39/', title: 'What Is BIP39?', desc: 'The standard in plain language' },
  { href: '/bip39-passphrase/', title: 'Passphrase', desc: 'The optional “25th word” explained' },
  { href: '/bip39-checksum/#how-it-works', title: 'Checksum explained', desc: 'Why the last word is not random' },
  { href: '/guides/', title: 'Guides', desc: 'In-depth articles on seed phrases' },
];

export const PAGES = {
  home: { href: '/', title: 'Home' },
  generator: { href: '/bip39-generator/', title: 'BIP39 Generator', desc: 'Generate 12–24 word test mnemonics and see their entropy and checksum.' },
  validator: { href: '/bip39-validator/', title: 'BIP39 Validator', desc: 'Check a test mnemonic’s word count, words and checksum.' },
  converter: { href: '/bip39-converter/', title: 'BIP39 Converter', desc: 'Convert between entropy, mnemonic and seed with test data.' },
  checksum: { href: '/bip39-checksum/', title: 'BIP39 Checksum', desc: 'Follow each step from entropy to the final checksum word.' },
  wordlist: { href: '/bip39-word-list/', title: 'BIP39 Word List', desc: 'Search and download the official 2048 English words.' },
  passphrase: { href: '/bip39-passphrase/', title: 'BIP39 Passphrase', desc: 'See how an optional passphrase changes the seed.' },
  offline: { href: '/bip39-offline/', title: 'Offline Tool', desc: 'Download the standalone HTML and run it without a network.' },
  what: { href: '/what-is-bip39/', title: 'What Is BIP39?', desc: 'Entropy, mnemonic and seed explained in plain language.' },
  security: { href: '/security/', title: 'Security Model', desc: 'What this site protects against and what it cannot.' },
  privacy: { href: '/privacy/', title: 'Privacy', desc: 'What is and is not collected.' },
  openSource: { href: '/open-source/', title: 'Open Source', desc: 'Source, license, dependencies and test evidence.' },
  guides: { href: '/guides/', title: 'Guides', desc: 'In-depth articles on BIP39 and seed phrases.' },
  changelog: { href: '/changelog/', title: 'Changelog', desc: 'What changed in each release.' },
} as const;

export type PageKey = keyof typeof PAGES;
