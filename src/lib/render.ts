// HTML string renderers shared by server-side pages and client scripts, so the
// initial HTML and later updates look identical. Inputs are escaped.
import type { ChecksumSteps } from './bip39';

export const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const wordsHtml = (words: string[]): string =>
  words.map((w, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="w">${esc(w)}</span></li>`).join('');

export const hexHtml = (hex: string, group = 8): string => {
  const out: string[] = [];
  for (let i = 0; i < hex.length; i += group) out.push(`<span>${esc(hex.slice(i, i + group))}</span>`);
  return out.join('');
};

/** Bits coloured as entropy (e) or checksum (c); `csFrom` is the index where checksum bits start. */
export const bitsHtml = (bits: string, csFrom = Infinity, offset = 0): string => {
  const ent = bits.slice(0, Math.max(0, csFrom - offset));
  const cs = bits.slice(Math.max(0, csFrom - offset));
  return (ent ? `<span class="e">${ent}</span>` : '') + (cs ? `<span class="c">${cs}</span>` : '');
};

export const bitGroupsHtml = (s: ChecksumSteps): string =>
  s.groups.map((g, i) => {
    const csNote = g.checksumBits ? `, last ${g.checksumBits} bits are checksum` : '';
    return `<li aria-label="Group ${i + 1}: bits ${g.bits}${csNote}, index ${g.index}, word ${g.word}">` +
      `<span class="gno" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>` +
      `<span class="bits" aria-hidden="true">${bitsHtml(g.bits, s.ent, i * 11)}</span>` +
      `<span class="map" aria-hidden="true">= ${g.index} → <b>${g.word}</b></span></li>`;
  }).join('');

/** Bit string split into 11-bit chunks separated by spaces, checksum bits highlighted. */
export const bitStreamHtml = (s: ChecksumSteps): string =>
  s.groups.map((g, i) => bitsHtml(g.bits, s.ent, i * 11)).join(' ');

export const hashHtml = (s: ChecksumSteps): string => {
  const nibbles = Math.ceil(s.cs / 4);
  const head = s.hashHex.slice(0, nibbles);
  return `<span class="c">${head}</span>${s.hashHex.slice(nibbles)}`;
};

/** Checksum bits shown against the first hex digits of the hash. */
export const hashBitsHtml = (s: ChecksumSteps): string => {
  const nibbles = Math.ceil(s.cs / 4);
  const bits = s.hashHex.slice(0, nibbles).split('').map((h) => parseInt(h, 16).toString(2).padStart(4, '0')).join('');
  return `<span class="c">${bits.slice(0, s.cs)}</span><span class="muted">${bits.slice(s.cs)}</span>`;
};

/** Full step-by-step checksum walkthrough. */
export function checksumStepsHtml(s: ChecksumSteps): string {
  const words = s.groups.length;
  return `
<li><h3>Entropy: ${s.ent} random bits</h3>
  <div class="output"><div class="output-head"><span class="label">Hex</span></div><div class="hex">${hexHtml(s.entropyHex)}</div></div>
  <div class="bitstream" aria-label="Entropy bits"><span class="e">${s.entropyBits.replace(/(.{8})/g, '$1 ').trim()}</span></div>
  <details><summary>Explain</summary><p>BIP39 starts from ${s.ent} bits of entropy (ENT). Allowed sizes are 128 to 256 bits in steps of 32. Here the ${s.ent / 4} hex characters are shown as ${s.ent} bits, 8 per byte.</p></details>
</li>
<li><h3>Hash the entropy with SHA-256</h3>
  <div class="output"><div class="output-head"><span class="label">SHA-256(entropy)</span></div><div class="hex bits">${hashHtml(s)}</div></div>
  <p class="small">First ${s.cs} bits of the hash: <span class="bits">${hashBitsHtml(s)}</span> → checksum <code>${s.checksumBits}</code></p>
  <details><summary>Explain</summary><p>The checksum length is CS = ENT / 32 = ${s.ent} / 32 = <strong>${s.cs} bits</strong>. They are the first ${s.cs} bits of the SHA-256 hash of the raw entropy bytes (not of the hex text).</p></details>
</li>
<li><h3>Append the ${s.cs} checksum bits</h3>
  <div class="bitstream bits" aria-label="Entropy plus checksum bits, grouped by 11">${bitStreamHtml(s)}</div>
  <p class="legend"><span><span class="sw sw-ent"></span>Entropy (${s.ent} bits)</span><span><span class="sw sw-cs"></span>Checksum (${s.cs} bits)</span></p>
  <details><summary>Explain</summary><p>Entropy + checksum = ${s.ent} + ${s.cs} = ${s.ent + s.cs} bits, which divides exactly into 11-bit groups: (ENT + CS) / 11 = ${words} words.</p></details>
</li>
<li><h3>Split into ${words} groups of 11 bits</h3>
  <ol class="bitgroups">${bitGroupsHtml(s)}</ol>
  <details><summary>Explain</summary><p>Each 11-bit group is a number from 0 to 2047 — an index into the 2048-word list. Only the last group contains checksum bits, which is why the last word cannot be chosen freely.</p></details>
</li>
<li><h3>Map each index to a word</h3>
  <div class="output"><div class="output-head"><span class="label">Mnemonic · ${words} words</span></div><ol class="words">${wordsHtml(s.mnemonic.split(' '))}</ol></div>
  <details><summary>Explain</summary><p>Index 0 is <code>abandon</code> and index 2047 is <code>zoo</code>. The words are joined with a single space to form the mnemonic.</p></details>
</li>`;
}
