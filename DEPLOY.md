# 部署（Cloudflare Pages）

1. Cloudflare Pages → Create project → 连接 GitHub 仓库。
2. Build command：`npm run build`　Output directory：`dist`
3. Node 版本由 `.nvmrc`（24）决定；如未生效，设置环境变量 `NODE_VERSION=24`。
4. 自定义域名绑定 `bip39.ai`。
5. 上线后检查：
   - 响应头包含 `Content-Security-Policy`（来自 `public/_headers`）；
   - Cloudflare Web Analytics / Zaraz 保持关闭（否则会注入第三方脚本，违反隐私承诺）；
   - `/sitemap.xml` 可访问，提交到 Google Search Console。

`npm run build` 会依次：从固定的上游文件生成词表与测试向量（校验 SHA-256）→ 跑全部测试 → 构建站点 → 打包离线单文件并把 SHA-256 写入 Offline 页。任一步失败则构建失败。
