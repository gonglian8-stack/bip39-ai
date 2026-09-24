// Guide articles are Markdown files in src/pages/guides/. Adding a file publishes it:
// it appears on /guides/, in the sitemap and in llms.txt.
import type { PageKey } from '../site';

export interface GuideFrontmatter {
  title: string;        // <title>, ≤ 60 characters
  description: string;  // meta description, 70–160 characters
  h1: string;
  summary: string;      // 1–2 sentence answer shown under the H1 and on /guides/
  published: string;    // YYYY-MM-DD
  updated?: string;     // YYYY-MM-DD
  related?: PageKey[];
}
export interface Guide extends GuideFrontmatter { href: string }

export function allGuides(): Guide[] {
  const mods = import.meta.glob<{ frontmatter: GuideFrontmatter; url: string }>('../pages/guides/*.md', { eager: true });
  return Object.entries(mods)
    .map(([path, m]) => ({ ...m.frontmatter, href: `/guides/${path.split('/').pop()!.replace(/\.md$/, '')}/` }))
    .sort((a, b) => (b.updated ?? b.published).localeCompare(a.updated ?? a.published));
}
