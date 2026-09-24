import { checksumSteps, hasSecureRandom, hexToBytes, randomEntropy, type WordCount } from '../lib/bip39';
import { VECTORS } from '../data/vectors';
import { checksumStepsHtml } from '../lib/render';
import { announce, qs } from './ui';

for (const root of document.querySelectorAll<HTMLElement>('[data-tool="checksum"]')) init(root);

function init(root: HTMLElement) {
  const sel = qs<HTMLSelectElement>(root, '#cs-vector');
  const src = qs(root, '[data-src]');
  const steps = qs(root, '[data-steps]');
  const rand = qs<HTMLButtonElement>(root, '[data-random]');
  rand.disabled = !hasSecureRandom();

  const render = (entropy: Uint8Array, label: string, vector: boolean) => {
    const s = checksumSteps(entropy);
    steps.innerHTML = checksumStepsHtml(s);
    src.textContent = label;
    src.className = `tag ${vector ? 'vector' : 'generated'}`;
    announce(`Showing ${label}: ${s.groups.length} words, checksum ${s.checksumBits}`);
  };
  sel.addEventListener('change', () => {
    const v = VECTORS.find((x) => String(x.id) === sel.value)!;
    render(hexToBytes(v.entropy), `Test vector #${v.id}`, true);
  });
  rand.addEventListener('click', () => {
    const n = Number(qs<HTMLSelectElement>(root, '[data-rand-words]').value) as WordCount;
    render(randomEntropy(n), 'Random test entropy', false);
  });
}
