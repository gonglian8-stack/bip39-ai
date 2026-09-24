// Static checks on the built site (run after `npm run build`):
//  - CSP compatibility: no inline scripts (except JSON-LD), no inline styles or style attributes
//  - no third-party resources
//  - SEO basics: one <h1>, unique <title>/description, canonical with trailing slash
//  - every internal link and asset resolves; sitemap lists only real pages
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const errors = [];
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const pages = walk(DIST).filter((f) => f.endsWith('.html') && !f.startsWith(join(DIST, 'downloads')));
const seen = { title: new Map(), desc: new Map() };

const resolves = (url) => {
  const path = decodeURI(url.split('#')[0].split('?')[0]);
  if (!path) return true;
  const p = join(DIST, path);
  return existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')));
};

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const err = (m) => errors.push(`${file}: ${m}`);
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    if (/src=/.test(attrs)) { if (!/src="\/(?!\/)/.test(attrs)) err(`external script ${attrs}`); }
    else if (!/application\/ld\+json/.test(attrs)) err('inline script');
  }
  if (/<style[\s>]/.test(html)) err('inline <style>');
  if (/\sstyle="/.test(html)) err('style attribute');
  for (const m of html.matchAll(/<(?:link|img|source|iframe)\b[^>]*(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^https?:/.test(u) && !/rel="canonical"/.test(m[0])) err(`third-party resource ${u}`);
  }
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"]*)"/g)) {
    if (!resolves(m[1])) err(`broken link ${m[1]}`);
    else if (!/(\/|\.\w+)$/.test(m[1].split('#')[0])) err(`link without trailing slash ${m[1]}`);
  }
  for (const m of html.matchAll(/(?:src|href)="(\/(?:_astro|wordlist|downloads)[^"]*)"/g)) if (!resolves(m[1])) err(`missing asset ${m[1]}`);
  if (file.endsWith('404.html')) continue;
  const h1 = html.match(/<h1\b/g)?.length ?? 0;
  if (h1 !== 1) err(`${h1} <h1> elements`);
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  if (!title || title.length > 65) err(`title missing or too long (${title?.length})`);
  if (!desc || desc.length < 70 || desc.length > 170) err(`description length ${desc?.length}`);
  if (!canon || !canon.endsWith('/')) err(`bad canonical ${canon}`);
  for (const [k, v] of [['title', title], ['desc', desc]]) {
    if (seen[k].has(v)) err(`duplicate ${k} with ${seen[k].get(v)}`);
    seen[k].set(v, file);
  }
}

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>https:\/\/bip39\.ai([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const l of locs) if (!existsSync(join(DIST, l, 'index.html'))) errors.push(`sitemap: missing ${l}`);
const indexable = pages.filter((f) => !f.endsWith('404.html')).length;
if (locs.length !== indexable) errors.push(`sitemap has ${locs.length} urls, site has ${indexable} indexable pages`);
if (existsSync(join(DIST, 'offline-app'))) errors.push('offline-app source page left in dist');

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`check-dist: ${pages.length} pages OK, ${locs.length} sitemap URLs`);
