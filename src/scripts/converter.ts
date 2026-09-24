import { analyzeMnemonic, bytesToHex, parseEntropyHex, seedFingerprint, toEntropy, toMnemonic, toSeed } from '../lib/bip39';
import { VECTORS, VECTOR_PASSPHRASE } from '../data/vectors';
import { hexHtml, wordsHtml } from '../lib/render';
import { announce, busy, copyText, onWipe, qs, setFieldError } from './ui';

type Mode = 'entropy-to-mnemonic' | 'mnemonic-to-entropy' | 'mnemonic-to-seed';
const MODES: Mode[] = ['entropy-to-mnemonic', 'mnemonic-to-entropy', 'mnemonic-to-seed'];
const V = VECTORS[0];

for (const root of document.querySelectorAll<HTMLElement>('[data-tool="converter"]')) init(root);

/** Returns an error message for a mnemonic that cannot be converted, or null. */
function mnemonicProblem(text: string): string | null {
  const a = analyzeMnemonic(text);
  if (!a.count) return 'Enter a mnemonic.';
  if (!a.countValid) return `${a.count} words is not a valid BIP39 length (12, 15, 18, 21 or 24).`;
  if (a.unknown.length) return `Word ${a.unknown[0].position} (“${a.unknown[0].word}”) is not in the English wordlist.`;
  if (!a.checksumValid) return 'Checksum mismatch: this is not a valid BIP39 mnemonic.';
  return null;
}

function init(root: HTMLElement) {
  const panel = (m: Mode) => qs(root, `[data-panel="${m}"]`);
  const copyVal: Partial<Record<Mode, string>> = {};

  function clearPanel(m: Mode) {
    const p = panel(m);
    p.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-sensitive]').forEach((f) => { f.value = ''; setFieldError(f, null); });
    qs(p, '[data-out]').hidden = true;
    p.querySelectorAll('[data-words],[data-hex],[data-fp]').forEach((el) => { el.innerHTML = ''; });
    delete copyVal[m];
  }

  function setMode(m: Mode, fromHash = false) {
    MODES.forEach((x) => {
      if (x !== m) clearPanel(x);
      panel(x).hidden = x !== m;
    });
    qs<HTMLInputElement>(root, `input[name="conv-mode"][value="${m}"]`).checked = true;
    if (!fromHash && location.hash.slice(1) !== m && root.closest('[data-offline-app]') === null) {
      history.replaceState(null, '', `#${m}`);
    }
  }

  root.querySelectorAll<HTMLInputElement>('input[name="conv-mode"]').forEach((r) =>
    r.addEventListener('change', () => setMode(r.value as Mode)));
  const fromHash = () => { const h = location.hash.slice(1) as Mode; if (MODES.includes(h)) setMode(h, true); };
  addEventListener('hashchange', fromHash);
  fromHash();

  // Entropy → mnemonic
  {
    const m: Mode = 'entropy-to-mnemonic';
    const p = panel(m);
    const input = qs<HTMLInputElement>(p, '#conv-ent');
    const run = () => {
      const r = parseEntropyHex(input.value);
      if ('error' in r) {
        setFieldError(input, r.error === 'empty' ? 'Enter entropy as hex.'
          : r.error === 'not-hex' ? 'Only hex characters 0–9 and a–f are allowed.'
          : 'Entropy must be 32, 40, 48, 56 or 64 hex characters (128–256 bits).');
        qs(p, '[data-out]').hidden = true;
        return;
      }
      setFieldError(input, null);
      const words = toMnemonic(r.bytes).split(' ');
      copyVal[m] = words.join(' ');
      qs(p, '[data-out-label]').textContent = `Mnemonic · ${words.length} words`;
      qs(p, '[data-words]').innerHTML = wordsHtml(words);
      qs(p, '[data-out]').hidden = false;
      announce(`Converted to a ${words.length}-word mnemonic`);
    };
    qs(p, '[data-run]').addEventListener('click', run);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') run(); });
    qs(p, '[data-vector]').addEventListener('click', () => { input.value = V.entropy; run(); });
  }

  // Mnemonic → entropy
  {
    const m: Mode = 'mnemonic-to-entropy';
    const p = panel(m);
    const input = qs<HTMLTextAreaElement>(p, '#conv-mn');
    const run = () => {
      const problem = mnemonicProblem(input.value);
      setFieldError(input, problem);
      if (problem) { qs(p, '[data-out]').hidden = true; return; }
      const hex = bytesToHex(toEntropy(input.value));
      copyVal[m] = hex;
      qs(p, '[data-out-label]').textContent = `Entropy · ${hex.length * 4} bits (hex)`;
      qs(p, '[data-hex]').innerHTML = hexHtml(hex);
      qs(p, '[data-out]').hidden = false;
      announce('Converted to entropy');
    };
    qs(p, '[data-run]').addEventListener('click', run);
    qs(p, '[data-vector]').addEventListener('click', () => { input.value = V.mnemonic; run(); });
  }

  // Mnemonic (+ passphrase) → seed
  {
    const m: Mode = 'mnemonic-to-seed';
    const p = panel(m);
    const input = qs<HTMLTextAreaElement>(p, '#conv-seed-mn');
    const pp = qs<HTMLInputElement>(p, '#conv-pp');
    const btn = qs<HTMLButtonElement>(p, '[data-run]');
    const run = async () => {
      const problem = mnemonicProblem(input.value);
      setFieldError(input, problem);
      if (problem) { qs(p, '[data-out]').hidden = true; return; }
      busy(btn, true, 'Deriving…');
      try {
        const seed = await toSeed(input.value, pp.value.normalize('NFKD'));
        const hex = bytesToHex(seed);
        copyVal[m] = hex;
        qs(p, '[data-hex]').innerHTML = hexHtml(hex);
        qs(p, '[data-fp]').textContent = seedFingerprint(seed);
        qs(p, '[data-pp-state]').textContent = pp.value ? `${[...pp.value].length} characters` : 'none';
        qs(p, '[data-out]').hidden = false;
        announce('Seed derived');
      } finally {
        busy(btn, false);
      }
    };
    btn.addEventListener('click', run);
    qs(p, '[data-vector]').addEventListener('click', () => { input.value = V.mnemonic; pp.value = VECTOR_PASSPHRASE; run(); });
    qs<HTMLInputElement>(p, '[data-show-pp]').addEventListener('change', (e) => {
      pp.type = (e.target as HTMLInputElement).checked ? 'text' : 'password';
    });
  }

  MODES.forEach((m) => {
    const p = panel(m);
    qs(p, '[data-clear]').addEventListener('click', () => { clearPanel(m); p.querySelector<HTMLElement>('[data-sensitive]')?.focus(); announce('Cleared'); });
    qs(p, '[data-copy]').addEventListener('click', (e) => { const v = copyVal[m]; if (v) copyText(e.currentTarget as HTMLButtonElement, v); });
  });
  onWipe(() => MODES.forEach(clearPanel));
}
