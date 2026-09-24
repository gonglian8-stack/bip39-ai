// Release notes, newest first. Add an entry for every deploy that changes behaviour or content.
export interface Release { version: string; date: string; changes: string[] }

export const CHANGELOG: Release[] = [
  {
    version: '0.1.0',
    date: '2026-09-24',
    changes: [
      'First release: Generator, Validator, Converter, Checksum and Word List tools.',
      'Learning pages: What Is BIP39, Passphrase, and the first two guides.',
      'Standalone offline HTML file with published SHA-256.',
      'Security, Privacy and Open Source pages.',
      'All 24 official English test vectors and 120 python-mnemonic cross-checks run on every build.',
    ],
  },
];
