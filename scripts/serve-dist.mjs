// Local static server for dist/ that applies the "/*" headers from public/_headers,
// so the production CSP can be tested before deploying to Cloudflare Pages.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const PORT = Number(process.env.PORT) || 4400;
const headers = {};
let block = null;
for (const line of readFileSync('public/_headers', 'utf8').split('\n')) {
  if (!line.trim()) continue;
  if (!/^\s/.test(line)) block = line.trim();
  else if (block === '/*') { const [k, ...v] = line.trim().split(':'); headers[k] = v.join(':').trim(); }
}
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8', '.xml': 'application/xml' };

createServer((req, res) => {
  let p = join('dist', decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  const found = existsSync(p);
  if (!found) p = 'dist/404.html';
  res.writeHead(found ? 200 : 404, { ...headers, 'Content-Type': TYPES[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(PORT, () => console.log(`dist on http://localhost:${PORT}`));
