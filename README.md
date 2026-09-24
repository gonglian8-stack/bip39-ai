# BIP39.ai 产品规划与设计交接

版本：2026-09-24 / v1

本目录用于从零规划新的 BIP39.ai，不继承旧站源码、信息架构、视觉或产品承诺。

## 当前结论

BIP39.ai 首版定位为：

> A trustworthy, offline-first BIP39 toolkit and learning center.

产品以真实的 `bip39 + 修饰词` 搜索任务为边界，不先做宽泛的“钱包恢复平台”，也不为了 `.ai` 强行加入聊天机器人。公开网页负责解释、演示和下载；涉及真实助记词的操作优先引导到离线版本。

## 文件

- `PRODUCT-PLAN.md`：完整产品规划、商业模式、阶段与指标。
- `KEYWORD-MAP.md`：关键词簇、搜索意图、页面映射与建页边界。
- `PAGE-SPECS.md`：首版各页面的产品和 SEO 规格。
- `SECURITY-AND-TRUST.md`：秘密数据边界、隐私和可信构建要求。
- `ACCEPTANCE.md`：设计、开发和上线验收条件。
- `CLAUDE-BRIEF.md`：交给 Claude 的设计任务说明（已被“由 Claude 负责完整产品”取代，保留作参考）。
- `design/`：设计原理、信息架构、设计系统、用户流程、设计自检。

## 当前状态（2026-09-24，v0.1.0）

- 已完成：产品范围、关键词架构、页面规格、安全边界；设计文档（`design/`）；12 个核心页面 + Guides（2 篇）+ Changelog + 404；`llms.txt`；离线单文件构建；测试（24 个官方向量 + 120 个 python-mnemonic 交叉验证 + 40 个无效 checksum）。
- 待补：维护者信息、GitHub 仓库地址、安全联系方式、部署、GSC；精确搜索量/KD/CPC 仍未采集。
- 说明：当前关键词判断来自 SERP 与同类页面观察，不得把未获得的搜索量写成确定数字。

## 开发

需要 Node ≥ 22.12（见 `.nvmrc`）。

```bash
npm install
npm run dev          # 本地开发
npm test             # 测试
npm run build        # 生成 dist/（含离线文件 dist/downloads/）
npm run check:dist   # 构建产物检查：CSP 兼容、SEO 基础、内链
node scripts/serve-dist.mjs   # 带生产 CSP 头的本地预览
```

目录：`src/lib/bip39.ts` 核心逻辑 · `src/components/Tool*.astro` 五个工具 · `src/pages/` 页面 · `scripts/` 构建与校验 · `data/upstream/` 固定的官方词表与测试向量 · `design/` 设计文档。部署见 `DEPLOY.md`，内容更新见 `CONTENT-GUIDE.md`。

## 推荐协作顺序

1. 用户确认本规划中的产品范围与首版页面。
2. Claude 阅读本目录全部文件，先提交 UX/视觉系统和响应式原型。
3. Codex 按 `ACCEPTANCE.md` 审核设计是否满足搜索意图、安全边界与页面规格。
4. 设计通过后再让 Claude 提交技术架构和实现计划。
5. 开发后小批上线，通过 GSC 与产品事件验证，再决定扩页。

