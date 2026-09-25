# Claude 设计任务：BIP39.ai

请完整阅读本目录：

1. `PLANNING.zh-CN.md`
2. `PRODUCT-PLAN.md`
3. `KEYWORD-MAP.md`
4. `PAGE-SPECS.md`
5. `SECURITY-AND-TRUST.md`
6. `ACCEPTANCE.md`

## 任务

先为 BIP39.ai 完成产品 UX、视觉系统和高保真响应式原型。此阶段只做设计，不修改产品范围，不直接部署，也不连接真实钱包或外部 API。

请依次交付：

1. `DESIGN-RATIONALE.md`：目标用户、设计原则、关键词意图如何影响布局。
2. `INFORMATION-ARCHITECTURE.md`：导航、Sitemap、页面关系和内链入口。
3. `DESIGN-SYSTEM.md`：颜色、字体、间距、组件、状态、响应式与无障碍规范。
4. `USER-FLOWS.md`：Generator、Validator、Word List、Checksum、Offline 的任务流程。
5. 可浏览的高保真原型：桌面和移动端，使用明确的测试数据。
6. `DESIGN-QA.md`：逐项自检 `ACCEPTANCE.md` A 部分。

## 硬性产品边界

- 首版是英语 BIP39 垂直工具站，不是综合钱包恢复平台。
- 设计必须由 `bip39 + modifier` 的搜索任务驱动。
- 首屏直接提供任务入口或工具，不设置登录墙。
- 不增加 Wallet Connect、余额扫描、交易、托管、破解、社区或用户结果页。
- 不把助记词发送给 AI，也不设计接收助记词的 AI 对话框。
- 不添加虚构的用户数量、星级、审计、合作钱包或安全保证。
- 工具页不放广告、第三方聊天、会话回放或营销追踪。
- 真实助记词操作明确引导到下载后的离线版本。
- 不通过大段恐吓弹窗妨碍测试数据使用；安全提示应持续可见、清楚、克制。

## 视觉方向

目标感受：可信、冷静、开源、精确、可验证。

避免：

- 黑金赌场式 crypto 视觉；
- 币价、K线、火箭、收益率和财富暗示；
- 霓虹渐变堆叠；
- 过多玻璃拟态；
- 用锁图标替代真实安全证据；
- 大型营销 Hero 把工具推到首屏以下。

建议探索：

- 明亮或可切换的中性界面；
- 高对比度、等宽数据区与清楚层级；
- 把 entropy、bits、checksum、word index 变成可理解的可视结构；
- 安全证据使用版本、哈希、源码和测试状态表达；
- 移动端确保长 mnemonic、hex 和表格可读。

## 页面范围

必须设计：

- `/`
- `/bip39-generator/`
- `/bip39-validator/`
- `/bip39-word-list/`
- `/bip39-checksum/`
- `/bip39-converter/`
- `/bip39-passphrase/`
- `/bip39-offline/`
- `/what-is-bip39/`
- Trust 页公共模板

## 设计数据

- 只能使用公开的 BIP39 测试向量或清楚标为 demo 的固定数据。
- 不使用看似属于真实用户的钱包数据。
- 缺少的搜索量、审计、测试或商业数据写 `TODO`，不得自行编造。

## 完成标准

原型必须让第一次访问的用户在不阅读长文的情况下，快速判断：

1. 这个页面能完成什么；
2. 哪些操作适合在线测试；
3. 何时应该下载离线版本；
4. 输入是否会离开设备；
5. 如何查看源码、版本和验证证据。

完成设计后停止，不进入技术架构或编码，等待产品审核。

