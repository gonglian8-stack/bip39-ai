// llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants and
// AI search, with the facts we want quoted accurately. Generated from the page registry.
import { PAGES, SITE } from '../site';
import { allGuides } from '../lib/guides';
import { UPSTREAM_SHA256 } from '../data/wordlist-english';

const link = (href: string, title: string, desc?: string) => `- [${title}](${SITE.url}${href})${desc ? `: ${desc}` : ''}`;

export function GET() {
  const p = PAGES;
  const body = `# ${SITE.name}

> Free, open-source BIP39 mnemonic tools and explanations. All tools run in the browser with network access blocked by Content Security Policy, and are also available as a single offline HTML file. Version ${SITE.version}.

Key facts:

- BIP39 encodes 128–256 bits of entropy as 12–24 words from a 2048-word list, and derives a 512-bit seed with PBKDF2-HMAC-SHA512 (2048 iterations, salt "mnemonic" + optional passphrase).
- Checksum length is ENT/32 bits (4 bits for 12 words, 8 bits for 24 words), taken from SHA-256 of the entropy and stored in the last word.
- A valid checksum only means the phrase is well-formed. It does not mean a wallet exists, holds funds, or is safe.
- Users should never enter a real recovery phrase into any website. ${SITE.name} recommends test data online and its verified offline file for real phrases.
- ${SITE.name} does not derive private keys or addresses, check balances, recover wallets or guess missing words.
- English word list SHA-256: ${UPSTREAM_SHA256} (identical to bitcoin/bips bip-0039/english.txt).

## Tools

${[p.generator, p.validator, p.converter, p.checksum, p.wordlist].map((x) => link(x.href, x.title, x.desc)).join('\n')}

## Learn

${[p.what, p.passphrase].map((x) => link(x.href, x.title, x.desc)).join('\n')}
${allGuides().map((g) => link(g.href, g.h1, g.summary)).join('\n')}

## Offline and trust

${[p.offline, p.security, p.privacy, p.openSource, p.changelog].map((x) => link(x.href, x.title, x.desc)).join('\n')}

## Optional

- [BIP39 specification](${SITE.specUrl})
- [Official test vectors](${SITE.vectorsUrl})
- [Word list download (TXT)](${SITE.url}/wordlist/english.txt)
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
