# 部署（Cloudflare Workers 静态资源）

与 27app 相同的方式：Workers Static Assets，只提供 `dist/` 静态文件，不运行服务端代码（`wrangler.jsonc` 没有 `main`）。安全头来自 `dist/_headers`。

```bash
npm run deploy     # = build（含测试）→ check:dist → wrangler deploy
```

- 需要 Node ≥ 22（`.nvmrc` 为 24）。
- 认证：`wrangler login`，或通过 `--env-file` 提供 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`。
- 认证方式（与 27app 相同）：`npx wrangler deploy --env-file /Users/xiaoxiao/SeoGeo/27app/.env`。
- 域名：`bip39.ai` 由本 Worker 提供（custom domain）；`www.bip39.ai` 由 `redirect-www/`（独立的小 Worker）301 到 `https://bip39.ai`，需要改动时在该目录单独 `wrangler deploy`。
- zone 设置：Always Use HTTPS = on，Minimum TLS = 1.2（2026-09-24 设置）。
- workers.dev 已关闭（`workers_dev: false`），避免与正式域名重复。
- 不要开启 Cloudflare Web Analytics / Zaraz（会注入第三方脚本，违反隐私承诺）。
- 上线后：`/sitemap.xml` 提交到 Google Search Console。

注意：不要在本目录直接运行 `wrangler pages ...`——wrangler 会尝试“自动配置”并改写 astro.config/package.json（加 SSR 适配器）。
