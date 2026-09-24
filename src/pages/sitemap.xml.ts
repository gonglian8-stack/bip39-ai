import { SITE } from '../site';
import { indexable } from '../lib/indexable';

// Only canonical, indexable 200 pages.
export function GET() {
  const body = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    indexable().map((u) => `  <url><loc>${SITE.url}${u.href}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
