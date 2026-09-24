// Small DOM helpers shared by the tool scripts.

export function qs<T extends Element = HTMLElement>(root: ParentNode, sel: string): T {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing ${sel}`);
  return el;
}

export function announce(msg: string) {
  const live = document.getElementById('live');
  if (!live) return;
  live.textContent = '';
  // Re-set on the next frame so repeated identical messages are still announced.
  requestAnimationFrame(() => { live.textContent = msg; });
}

export async function copyText(btn: HTMLButtonElement, text: string, what = 'Copied') {
  const label = btn.dataset.label ?? btn.innerHTML;
  btn.dataset.label = label;
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = 'Copied';
    announce(`${what} to clipboard`);
  } catch {
    btn.textContent = 'Copy failed';
    announce('Copy failed. Select the text and copy it manually.');
  }
  setTimeout(() => { btn.innerHTML = label; }, 2000);
}

export function setFieldError(field: HTMLInputElement | HTMLTextAreaElement, msg: string | null) {
  const err = document.getElementById(`${field.id}-error`);
  field.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (err) { err.textContent = msg ?? ''; err.hidden = !msg; }
}

const wipers: (() => void)[] = [];
/** Register a function that clears sensitive state. Runs when the page is hidden/unloaded
 *  (including before it enters the back/forward cache). This resets the UI; it cannot
 *  guarantee the browser has erased every copy from memory. */
export function onWipe(fn: () => void) { wipers.push(fn); }
addEventListener('pagehide', () => wipers.forEach((fn) => fn()));

export function busy(btn: HTMLButtonElement, on: boolean, text = 'Working…') {
  if (on) {
    btn.dataset.idle = btn.innerHTML;
    btn.innerHTML = `<span class="spinner" aria-hidden="true"></span>${text}`;
    btn.setAttribute('aria-disabled', 'true');
    btn.disabled = true;
  } else if (btn.dataset.idle) {
    btn.innerHTML = btn.dataset.idle;
    btn.removeAttribute('aria-disabled');
    btn.disabled = false;
  }
}
