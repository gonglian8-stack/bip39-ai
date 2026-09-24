// Theme toggle and popover housekeeping (close on outside click / Escape).
const root = document.documentElement;
const systemDark = () => matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark());

function syncThemeButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(isDark()));
    b.classList.toggle('is-dark', isDark());
  });
}
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) =>
  b.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable: theme lasts this page only */ }
    syncThemeButtons();
  }),
);
syncThemeButtons();

const popovers = () => document.querySelectorAll<HTMLDetailsElement>('details[data-popover][open]');
document.addEventListener('click', (e) => {
  popovers().forEach((d) => { if (!d.contains(e.target as Node)) d.open = false; });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  popovers().forEach((d) => { d.open = false; d.querySelector('summary')?.focus(); });
});
