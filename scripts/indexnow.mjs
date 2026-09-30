// Submits every URL in dist/sitemap.xml to IndexNow (Bing, Yandex, Seznam, Naver…).
// Bing's index also feeds ChatGPT search. The key file lives at /<key>.txt (public/).
// Run after a production deploy: `node scripts/indexnow.mjs`.
import { readdirSync, readFileSync } from 'node:fs';

const HOST = 'bip39.ai';
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('IndexNow key file (public/<32 hex>.txt) not found');
const key = keyFile.slice(0, -4);

const urlList = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urlList.length) throw new Error('no URLs in dist/sitemap.xml');

// The key file must be live before submitting, or the submission is rejected.
// A real User-Agent: the zone blocks UAs shorter than 10 chars (Node's default is "node").
const UA = 'bip39-ai-deploy/1.0 (+https://github.com/gonglian8-stack/bip39-ai)';
const live = await fetch(`https://${HOST}/${keyFile}`, { headers: { 'User-Agent': UA } }).then((r) => r.ok && r.text());
if (live !== key) throw new Error(`key file not live at https://${HOST}/${keyFile} — deploy first`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'User-Agent': UA },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
if (res.status >= 300) { console.log(await res.text()); process.exit(1); }
