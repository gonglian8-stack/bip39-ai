import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://bip39.ai',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  // No inline scripts or styles: the CSP in public/_headers only allows 'self'.
  vite: { build: { assetsInlineLimit: 0 } },
  // Shiki would emit inline style attributes, which the CSP forbids.
  markdown: { syntaxHighlight: false },
  devToolbar: { enabled: false },
  server: { port: Number(process.env.PORT) || 4321 },
});
