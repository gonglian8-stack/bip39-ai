// Every indexable URL, used by sitemap.xml and llms.txt.
import { PAGES, SITE } from '../site';
import { allGuides } from './guides';

export interface IndexEntry { href: string; title: string; desc: string; lastmod: string }

export function indexable(): IndexEntry[] {
  const pages = Object.values(PAGES).map((p) => ({
    href: p.href, title: p.title, desc: 'desc' in p ? p.desc : 'BIP39 mnemonic tools and learning center.', lastmod: SITE.lastReviewed,
  }));
  const guides = allGuides().map((g) => ({ href: g.href, title: g.h1, desc: g.summary, lastmod: g.updated ?? g.published }));
  return [...pages, ...guides];
}
