import { seedFingerprint, toSeed } from '../lib/bip39';
import { VECTORS } from '../data/vectors';
import { onWipe, qs } from './ui';

const root = document.querySelector<HTMLElement>('[data-tool="passphrase"]');
if (root) {
  const input = qs<HTMLInputElement>(root, '#pp-try');
  const out = qs(root, '[data-fp]');
  let seq = 0;
  let timer: ReturnType<typeof setTimeout>;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      const mine = ++seq;
      const fp = seedFingerprint(await toSeed(VECTORS[0].mnemonic, input.value));
      if (mine === seq) out.textContent = fp;
    }, 250);
  });
  onWipe(() => { input.value = ''; out.textContent = '—'; });
  // Show the empty-passphrase fingerprint initially so the column is never blank.
  toSeed(VECTORS[0].mnemonic, '').then((s) => { if (!input.value) out.textContent = seedFingerprint(s); });
}
