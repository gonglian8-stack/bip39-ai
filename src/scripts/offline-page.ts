import { copyText } from './ui';

const btn = document.querySelector<HTMLButtonElement>('[data-copy-sha]');
const sha = document.querySelector('[data-sha]')?.textContent?.trim();
if (btn && sha) btn.addEventListener('click', () => copyText(btn, sha, 'SHA-256 copied'));
