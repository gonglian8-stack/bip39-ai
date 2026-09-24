import { WORDLIST } from '../data/wordlist-english';
import { esc } from '../lib/render';
import { copyText, qs } from './ui';

for (const root of document.querySelectorAll<HTMLElement>('[data-tool="wordlist"]')) init(root);

function init(root: HTMLElement) {
  const search = qs<HTMLInputElement>(root, '#wl-search');
  const list = qs(root, '[data-list]');
  const status = qs(root, '[data-status]');
  const none = qs(root, '[data-none]');
  // List items are in index order: item i is WORDLIST[i].
  const items = Array.from(list.children) as HTMLLIElement[];
  const defaultStatus = status.textContent;
  let detailed = false;

  function filter() {
    const q = search.value.trim().toLowerCase();
    let shown = 0;
    const num = /^\d+$/.test(q) ? Number(q) : null;
    items.forEach((li, i) => {
      const match = !q || (num !== null ? i === num || i + 1 === num : WORDLIST[i].startsWith(q));
      li.hidden = !match;
      if (match) shown++;
    });
    none.hidden = shown > 0;
    if (!shown) {
      none.innerHTML = num !== null
        ? `No word has number ${num}. Numbers run from 1 to 2048 (index 0 to 2047).`
        : `No word starts with “${esc(q)}”. BIP39 words are uniquely identified by their first 4 letters.`;
    }
    status.textContent = !q ? defaultStatus
      : num !== null ? `${shown} match${shown === 1 ? '' : 'es'} for number ${num} (as 1-based number or 0-based index).`
      : `${shown} word${shown === 1 ? '' : 's'} starting with “${q}”.`;
  }

  /** Adds the 0-based index and 11-bit binary columns the first time List view is used. */
  function addDetails() {
    if (detailed) return;
    detailed = true;
    items.forEach((li, i) => {
      li.querySelector('.w')!.insertAdjacentHTML('beforebegin',
        `<span class="i0">idx ${i}</span><span class="bin">${i.toString(2).padStart(11, '0')}</span>`);
    });
  }

  search.addEventListener('input', filter);
  root.querySelectorAll<HTMLInputElement>('input[name="wl-view"]').forEach((r) =>
    r.addEventListener('change', () => {
      if (r.value === 'list') addDetails();
      list.classList.toggle('as-list', r.value === 'list' && r.checked);
    }));
  list.addEventListener('click', (e) => {
    const btn = (e.target as Element).closest('button');
    if (!btn) return;
    const word = btn.querySelector('.w')!.textContent!;
    copyText(btn, word, `“${word}” copied`);
  });
}
