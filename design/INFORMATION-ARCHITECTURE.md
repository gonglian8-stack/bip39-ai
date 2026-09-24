# 信息架构

## 1. Sitemap（首版，全部可索引，统一尾斜杠）

```text
/                         BIP39 Mnemonic Tools
├── /bip39-generator/     Tools
├── /bip39-validator/     Tools
├── /bip39-converter/     Tools（模式：#entropy-to-mnemonic / #mnemonic-to-entropy / #mnemonic-to-seed）
├── /bip39-checksum/      Tools + Learn
├── /bip39-word-list/     Word List
├── /bip39-passphrase/    Learn
├── /what-is-bip39/       Learn
├── /bip39-offline/       Offline
├── /security/            Trust
├── /privacy/             Trust
├── /open-source/         Trust
├── /guides/              Learn（文章索引，文章为 /guides/<slug>/）
└── /changelog/           About
```

另有 `/llms.txt`（AI 搜索用站点地图，由页面注册表自动生成）。

另有：`/404.html`（noindex）、`/sitemap.xml`、`/robots.txt`、`/wordlist/english.{txt,json,csv}`（静态下载文件，不进 sitemap）、`/downloads/bip39-ai-offline-v{version}.html`。

Converter 模式用 hash 锚点，canonical 始终是 `/bip39-converter/`。

## 2. 全局导航

桌面顶栏（左到右）：

```text
[BIP39.ai]  Tools ▾   Word List   Learn ▾   Offline        [Online mode ●] [◐ theme] [GitHub ↗]
```

- **Tools ▾**：Generator / Validator / Converter / Checksum，每项带一行说明。
- **Learn ▾**：What Is BIP39 / Passphrase / Checksum explained（指向 `/bip39-checksum/#how-it-works`）。
- **Online mode 徽标**：在线站点显示 "Online · runs in your browser"，点击展开说明并链接 Offline；离线单文件版本显示 "Offline build v x.y.z"。
- 移动端：Logo + 模式徽标 + 菜单按钮；菜单为全屏抽屉，分组同桌面。

页脚（所有页面）：

```text
Tools: Generator · Validator · Converter · Checksum · Word List
Learn: What Is BIP39 · Passphrase
Trust: Security · Privacy · Open Source · Offline download
Version vX.Y.Z · commit abc1234 · MIT License · Maintained by TODO(维护者)
BIP39 specification ↗ (github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
```

## 3. 页面模板

| 模板 | 用于 | 区块顺序 |
|---|---|---|
| Tool | Generator、Validator、Converter | 面包屑 → H1 + 承诺句 → 工具 → Online/Offline 简卡 → Example → How to use → How it works → Limitations → FAQ → Related |
| Interactive explainer | Checksum、Passphrase | 面包屑 → H1 + 定义 → 分步交互 → 公式/表 → 详细解释 → FAQ → Related |
| Reference data | Word List | 面包屑 → H1 + 来源行 → 搜索/视图/下载工具条 → 词表 → 属性说明 → FAQ → Related |
| Article | What Is BIP39 | 面包屑 → H1 → 定义 → 图解 → 章节（带目录）→ Sources → Related |
| Download | Offline | 面包屑 → H1 → Release 卡（版本/大小/SHA-256/下载）→ 验证步骤 → 断网使用步骤 → 发布证据状态表 → 限制 |
| Trust | Security、Privacy、Open Source | 面包屑 → H1 → 摘要 → 分节正文 → Last reviewed 日期 → 相关 Trust 页 |
| Home | / | H1 + 定义 → 四个任务入口 → 工具卡片 → 流程简图 → 离线与开源证据 → 核心概念 → FAQ → 资源 |

## 4. 内链矩阵

每个工具页 Related 区固定 = 原理页 + Offline + 两个最相关工具：

| 页面 | Related |
|---|---|
| Generator | What Is BIP39、Checksum、Validator、Offline |
| Validator | Checksum、Word List、Generator、Offline |
| Converter | Passphrase、Checksum、Generator、Offline |
| Checksum | Generator、Validator、Word List、What Is BIP39 |
| Word List | Checksum、Validator、What Is BIP39 |
| Passphrase | Converter（#mnemonic-to-seed）、What Is BIP39、Offline |
| What Is BIP39 | 正文上下文链接全部工具；末尾 Generator、Checksum、Passphrase |
| Offline | Security、Open Source、Generator |

正文中提到概念时就地链接（例如 "checksum" 首次出现链接到 `/bip39-checksum/`），每页每目标最多一个正文链接。

## 5. 每页 SEO 元数据（草案）

| URL | Title（≤60） | H1 |
|---|---|---|
| `/` | BIP39 Mnemonic Tools – Generate, Validate, Word List | BIP39 Mnemonic Tools |
| `/bip39-generator/` | BIP39 Generator – 12 to 24 Word Test Mnemonics | BIP39 Mnemonic Generator |
| `/bip39-validator/` | BIP39 Validator – Check Words and Checksum | BIP39 Mnemonic Validator |
| `/bip39-converter/` | BIP39 Converter – Entropy, Mnemonic and Seed | BIP39 Converter |
| `/bip39-checksum/` | BIP39 Checksum Explained – Step-by-Step Calculator | BIP39 Checksum |
| `/bip39-word-list/` | BIP39 Word List – All 2048 English Words | BIP39 Word List (English, 2048 words) |
| `/bip39-passphrase/` | BIP39 Passphrase (25th Word) Explained | BIP39 Passphrase |
| `/bip39-offline/` | Offline BIP39 Tool – Download Standalone HTML | Offline BIP39 Tool |
| `/what-is-bip39/` | What Is BIP39? Mnemonic Phrases Explained | What Is BIP39? |
| `/security/` | Security Model – BIP39.ai | Security Model |
| `/privacy/` | Privacy – BIP39.ai | Privacy |
| `/open-source/` | Open Source – BIP39.ai | Open Source |

Schema：全站 `WebSite` + `BreadcrumbList`；工具页 `SoftwareApplication`（无 rating）；FAQ 区 `FAQPage` 仅当问答可见；What Is BIP39 用 `Article`。
