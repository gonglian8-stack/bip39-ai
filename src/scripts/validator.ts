import { analyzeMnemonic, normalizeMnemonic, WORD_COUNTS } from '../lib/bip39';
import { VECTORS } from '../data/vectors';
import { esc } from '../lib/render';
import { announce, onWipe, qs } from './ui';

const VALID_EXAMPLE = VECTORS[0].mnemonic;
const INVALID_EXAMPLE = VECTORS[0].mnemonic.replace(/about$/, 'abandon');
const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>';
const ICON_BAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg>';

for (const root of document.querySelectorAll<HTMLElement>('[data-tool="validator"]')) init(root);

function init(root: HTMLElement) {
  const input = qs<HTMLTextAreaElement>(root, '#val-input');
  const count = qs(root, '[data-count]');
  const idle = qs(root, '[data-idle]');
  const result = qs(root, '[data-result]');

  const updateCount = () => {
    const n = normalizeMnemonic(input.value).length;
    count.textContent = `${n} word${n === 1 ? '' : 's'}`;
  };
  const reset = () => { result.hidden = true; result.innerHTML = ''; result.className = 'result'; idle.hidden = false; };

  function validate() {
    const a = analyzeMnemonic(input.value);
    if (!a.count) {
      reset();
      input.focus();
      announce('Enter a mnemonic first');
      return;
    }
    const ok = a.checksumValid === true;
    const items: string[] = [];
    const row = (st: 'pass' | 'fail' | 'skip', text: string) =>
      items.push(`<li class="${st}"><span class="st" aria-hidden="true">${st === 'pass' ? '✓' : st === 'fail' ? '✗' : '–'}</span><span><span class="visually-hidden">${st === 'pass' ? 'Passed: ' : st === 'fail' ? 'Failed: ' : 'Not checked: '}</span>${text}</span></li>`);

    row(a.countValid ? 'pass' : 'fail', a.countValid
      ? `Word count: ${a.count}`
      : `Word count: ${a.count} is not valid. BIP39 uses ${WORD_COUNTS.join(', ')} words.`);
    if (a.unknown.length) {
      const list = a.unknown.slice(0, 8).map((u) =>
        `<li>Word ${u.position}: “${esc(u.word)}”${u.suggestions.length ? ` — did you mean ${u.suggestions.map((s) => `<code>${s}</code>`).join(', ')}?` : ''}</li>`).join('');
      const more = a.unknown.length > 8 ? `<li>…and ${a.unknown.length - 8} more</li>` : '';
      row('fail', `${a.unknown.length} word${a.unknown.length > 1 ? 's are' : ' is'} not in the English BIP39 wordlist:<ul>${list}${more}</ul>`);
    } else {
      row('pass', 'All words are in the English BIP39 wordlist');
    }
    if (a.checksumValid === null) row('skip', 'Checksum not checked until the words and count are valid');
    else if (a.checksumValid) row('pass', `Checksum matches (<code>${a.actualChecksum}</code>)`);
    else row('fail', `Checksum mismatch: the phrase ends in <code>${a.actualChecksum}</code>, but the entropy requires <code>${a.expectedChecksum}</code>. The words exist, but this combination is not a valid BIP39 mnemonic — often one word is wrong or two are swapped.`);

    result.className = `result ${ok ? 'valid' : 'invalid'}`;
    result.setAttribute('role', ok ? 'status' : 'alert');
    result.innerHTML =
      `<p class="r-title">${ok ? ICON_OK : ICON_BAD}${ok ? 'Valid BIP39 mnemonic' : 'Not a valid BIP39 mnemonic'}</p>` +
      `<ul class="checklist">${items.join('')}</ul>` +
      (ok ? '<p class="disclaimer"><strong>Valid structure only.</strong> This does not mean a wallet exists, holds funds, belongs to you, or is safe to use.</p>' : '');
    idle.hidden = true;
    result.hidden = false;
    announce(ok ? 'Valid BIP39 mnemonic' : 'Not a valid BIP39 mnemonic');
  }

  input.addEventListener('input', () => { updateCount(); if (!result.hidden) reset(); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); validate(); } });
  qs(root, '[data-validate]').addEventListener('click', validate);
  root.querySelectorAll<HTMLButtonElement>('[data-load]').forEach((b) => b.addEventListener('click', () => {
    input.value = b.dataset.load === 'valid' ? VALID_EXAMPLE : INVALID_EXAMPLE;
    updateCount();
    reset();
    announce(`Loaded ${b.dataset.load} example (test vector 1). Press Validate.`);
  }));
  qs<HTMLInputElement>(root, '[data-mask]').addEventListener('change', (e) =>
    input.classList.toggle('masked', (e.target as HTMLInputElement).checked));
  const clear = () => { input.value = ''; updateCount(); reset(); };
  qs(root, '[data-clear]').addEventListener('click', () => { clear(); input.focus(); announce('Input cleared'); });
  onWipe(clear);
}
