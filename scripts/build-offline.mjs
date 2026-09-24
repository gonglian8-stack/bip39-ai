// Turns dist/offline-app/index.html into a single self-contained file:
//   - all CSS inlined into one <style>, all JS bundled by esbuild into one IIFE <script>
//   - a CSP meta tag that allows only those two hashed blocks and forbids all connections
// Then publishes it under dist/downloads/, writes its SHA-256 and size into the
// Offline page, and removes the intermediate page from the public site.
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const FILE = `bip39-ai-offline-v${pkg.version}.html`;
const SITE_URL = 'https://bip39.ai';
const sha = (s, enc = 'hex') => createHash('sha256').update(s).digest(enc);

let html = readFileSync('dist/offline-app/index.html', 'utf8');

// CSS: inline every stylesheet Astro linked.
let css = '';
html = html.replace(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"[^>]*>/g, (_, href) => {
  css += readFileSync(`dist${href}`, 'utf8');
  return '';
});
// JS: drop Astro's module scripts and bundle our own single entry instead.
html = html.replace(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/g, '');
if (/<script(?![^>]*application\/ld\+json)[^>]*src=/.test(html)) throw new Error('unexpected external script left in offline page');

const out = await build({
  entryPoints: ['src/scripts/offline-entry.ts'],
  bundle: true, write: false, format: 'iife', platform: 'browser', target: 'es2020',
  minify: true, legalComments: 'eof', charset: 'utf8',
});
const js = out.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
css = css.replace(/<\/style/gi, '<\\/style');

// Links to site pages become absolute (the file is opened from disk).
html = html.replace(/(href)="\/(?!\/)/g, `$1="${SITE_URL}/`);

const csp = [
  "default-src 'none'",
  `script-src 'sha256-${sha(js, 'base64')}'`,
  `style-src 'sha256-${sha(css, 'base64')}'`,
  "img-src data:",
  "connect-src 'none'",
  "font-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');
html = html
  .replace('__OFFLINE_CSP__', csp)
  .replace('</head>', `<style>${css}</style></head>`)
  .replace('</body>', `<script>${js}</script></body>`);

// Self-checks: nothing may reference another resource.
const bad = html.match(/<(?:script|link|img|iframe|source|video|audio)[^>]+(?:src|href)=["'](?!data:|#)[^"']+/gi);
if (bad) throw new Error(`offline file references external resources: ${bad.join(', ')}`);
if (/\bimport\(|fetch\(|XMLHttpRequest|WebSocket|sendBeacon/.test(js)) throw new Error('offline bundle contains network or dynamic-import code');

mkdirSync('dist/downloads', { recursive: true });
writeFileSync(`dist/downloads/${FILE}`, html);
const hash = sha(html);
const size = `${(Buffer.byteLength(html) / 1024).toFixed(1)} KB (${Buffer.byteLength(html).toLocaleString('en-US')} bytes)`;
rmSync('dist/offline-app', { recursive: true, force: true });

const page = 'dist/bip39-offline/index.html';
const date = new Date().toISOString().slice(0, 10);
const patched = readFileSync(page, 'utf8')
  .replaceAll('__OFFLINE_SHA256__', hash)
  .replaceAll('__OFFLINE_SIZE__', size)
  .replaceAll('__OFFLINE_DATE__', date);
if (/__OFFLINE_/.test(patched)) throw new Error('unreplaced placeholder in offline page');
writeFileSync(page, patched);
writeFileSync(`dist/downloads/${FILE}.sha256`, `${hash}  ${FILE}\n`);
console.log(`offline: ${FILE}  ${size}\nsha256: ${hash}`);
