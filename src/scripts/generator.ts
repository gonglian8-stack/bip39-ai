import { checksumSteps, hasSecureRandom, hexToBytes, randomEntropy, sizes, type WordCount } from '../lib/bip39';
import { VECTORS } from '../data/vectors';
import { hexHtml, wordsHtml } from '../lib/render';
import { announce, copyText, onWipe, qs } from './ui';

for (const root of document.querySelectorAll<HTMLElement>('[data-tool="generator"]')) init(root);

function init(root: HTMLElement) {
  const noRandom = qs(root, '#gen-norandom');
  const genBtn = qs<HTMLButtonElement>(root, '[data-generate]');
  const vecBtn = qs<HTMLButtonElement>(root, '[data-vector]');
  const vecNote = qs(root, '[data-vector-note]');
  const empty = qs(root, '[data-empty]');
  const result = qs(root, '[data-result]');
  let current: { mnemonic: string; entropy: string } | null = null;

  const count = (): WordCount =>
    Number(qs<HTMLInputElement>(root, 'input[name="gen-words"]:checked').value) as WordCount;
  const vectorFor = (n: number) => VECTORS.find((v) => v.entropy.length * 4 === sizes(n).ent);

  const canRandom = hasSecureRandom();
  noRandom.hidden = canRandom;
  genBtn.disabled = !canRandom;
  qs<HTMLButtonElement>(root, '[data-regen]').disabled = !canRandom;

  function syncSpecs() {
    const s = sizes(count());
    qs(root, '[data-ent]').textContent = `${s.ent} bits`;
    qs(root, '[data-cs]').textContent = `${s.cs} bits`;
    qs(root, '[data-ms]').textContent = String(s.words);
    const hasVector = !!vectorFor(s.words);
    vecBtn.disabled = !hasVector;
    vecNote.hidden = hasVector;
  }

  function show(entropy: Uint8Array, source: 'Generated' | 'Test vector') {
    const steps = checksumSteps(entropy);
    const words = steps.mnemonic.split(' ');
    current = { mnemonic: steps.mnemonic, entropy: steps.entropyHex };
    qs(root, '[data-mn-label]').textContent = `Mnemonic · ${words.length} words`;
    const tag = qs(root, '[data-source]');
    tag.textContent = source === 'Test vector' ? `Test vector #${VECTORS.find((v) => v.entropy === steps.entropyHex)?.id}` : 'Generated';
    tag.className = `tag ${source === 'Test vector' ? 'vector' : 'generated'}`;
    qs(root, '[data-words]').innerHTML = wordsHtml(words);
    qs(root, '[data-ent-label]').textContent = `Entropy · ${steps.ent} bits (hex)`;
    qs(root, '[data-entropy]').innerHTML = hexHtml(steps.entropyHex);
    const last = steps.groups[steps.groups.length - 1];
    qs(root, '[data-cs-line]').innerHTML =
      `Checksum: <code>${steps.checksumBits}</code> (${steps.cs} bits) — the last ${steps.cs} bits of word ${words.length}, <strong>${last.word}</strong>.`;
    empty.hidden = true;
    result.hidden = false;
    announce(`${source === 'Generated' ? 'Generated' : 'Loaded'} a ${words.length}-word mnemonic`);
  }

  function clear() {
    current = null;
    qs(root, '[data-words]').innerHTML = '';
    qs(root, '[data-entropy]').innerHTML = '';
    result.hidden = true;
    empty.hidden = false;
  }

  const generate = () => show(randomEntropy(count()), 'Generated');
  root.querySelectorAll('input[name="gen-words"]').forEach((r) => r.addEventListener('change', () => { syncSpecs(); if (current) clear(); }));
  genBtn.addEventListener('click', generate);
  qs(root, '[data-regen]').addEventListener('click', generate);
  vecBtn.addEventListener('click', () => { const v = vectorFor(count()); if (v) show(hexToBytes(v.entropy), 'Test vector'); });
  qs(root, '[data-copy-mn]').addEventListener('click', (e) => current && copyText(e.currentTarget as HTMLButtonElement, current.mnemonic, 'Mnemonic copied'));
  qs(root, '[data-copy-ent]').addEventListener('click', (e) => current && copyText(e.currentTarget as HTMLButtonElement, current.entropy, 'Entropy copied'));
  qs(root, '[data-clear]').addEventListener('click', () => { clear(); announce('Cleared'); genBtn.focus(); });
  onWipe(clear);
  syncSpecs();
}
