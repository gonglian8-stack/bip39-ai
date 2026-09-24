// Entry for the standalone offline file: tab switching and environment warnings.
// The tool scripts are imported by their components.
import { qs } from './ui';

const app = document.querySelector<HTMLElement>('[data-offline-app]');
if (app) {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>('[data-tab]'));
  document.querySelectorAll<HTMLInputElement>('input[name="offline-tab"]').forEach((r) =>
    r.addEventListener('change', () => tabs.forEach((t) => { t.hidden = t.dataset.tab !== r.value; })));

  const envOnline = qs(document, '[data-env-online]');
  const syncOnline = () => { envOnline.hidden = !navigator.onLine; };
  addEventListener('online', syncOnline);
  addEventListener('offline', syncOnline);
  syncOnline();
  qs(document, '[data-env-http]').hidden = !/^https?:$/.test(location.protocol);
}
