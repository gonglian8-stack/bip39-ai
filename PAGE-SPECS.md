# BIP39.ai 首版页面规格

## 全站共同规格

- 正式页面语言：英语；`html lang="en"`。
- 顶部导航：Tools、Word List、Learn、Offline、GitHub。
- 工具页首屏必须能开始任务，不先展示长篇营销文案。
- 输入、空状态、示例、错误、成功、复制、重置和离线状态全部设计。
- 工具页面无广告、无会话回放、无第三方聊天和无不必要网络请求。
- 所有页面提供 Security、Privacy、Open Source 入口。
- 不显示虚构用户数、审计、评分、合作品牌或“最安全”等无法证明的文案。

## 1. 首页 `/`

### 搜索任务

用户搜索宽泛的 `bip39`，可能想了解标准，也可能想找工具。

### 首屏

- H1：`BIP39 Mnemonic Tools`
- 定义：一句话说明 BIP39 将 entropy 编码为 mnemonic，并从 mnemonic 派生 seed。
- 四个任务入口：Generate、Validate、Convert、Browse Word List。
- 显著安全提示：真实恢复短语优先使用下载后的离线版本。

### 模块顺序

1. H1 + 定义 + 任务入口；
2. 工具卡片；
3. Entropy → Mnemonic → Seed 简图；
4. 离线与开源证据；
5. 核心概念；
6. FAQ；
7. 相关资源。

### 禁止

- 把所有工具完整塞入首页；
- 用首页抢所有长尾词；
- 在首页要求用户粘贴助记词。

## 2. Generator `/bip39-generator/`

### 页面任务

生成符合 BIP39 结构的测试 mnemonic，并理解词数、entropy 和 checksum。

### 输入

- Word count：12/15/18/21/24；
- Language：首版 English；其他语言显示“planned”而非伪可用；
- Generate 按钮；
- Load official test vector。

### 输出

- Mnemonic；
- Entropy hex；
- ENT/CS/MS；
- Copy（测试数据）；
- Regenerate；
- Download offline tool。

### 状态与限制

- 不使用自定义“脑随机”文字作为 entropy；
- 加密随机源不可用时禁止生成并解释原因；
- 页面清楚标注在线生成仅用于测试/学习；
- 生产钱包推荐硬件钱包或经核验的离线环境。

### SEO 内容

- What is a BIP39 generator?
- 12 vs 24 words；
- entropy 和 checksum；
- browser randomness；
- online vs offline；
- FAQ。

## 3. Validator `/bip39-validator/`

### 页面任务

判断测试 mnemonic 的词数、词表和 checksum 是否符合 BIP39。

### 输入

- 多行 mnemonic 输入；
- Load test vector；
- Validate；
- Clear。

### 输出

- Word count；
- Detected wordlist；
- Unknown word positions；
- Checksum valid/invalid；
- 明确说明：valid 不代表资金安全、所有权或余额存在。

### 安全交互

- 输入框旁永久显示真实助记词风险；
- 不自动验证每次键入，避免分析工具间接采样；
- 不允许任何输入内容进入日志或 URL；
- 页面隐藏时清除策略由安全评审决定，不能导致用户误以为内存必然彻底擦除；
- 提供离线版 CTA。

## 4. Word List `/bip39-word-list/`

### 页面任务

查询和下载官方英文 2048 词表。

### 功能

- 按单词和 index 搜索；
- Grid/List 视图；
- 复制单词或 index；
- 下载 TXT/JSON/CSV；
- 显示数据源、版本、文件哈希和更新时间。

### SEO 内容

- Why 2048 words；
- 11-bit index；
- first-four-letter property；
- word order and checksum；
- 不能把任意 12 个词当作有效 mnemonic；
- 多语言兼容性提醒。

## 5. Checksum `/bip39-checksum/`

### 页面任务

理解并用测试数据计算 BIP39 checksum。

### 功能

- 选择官方测试向量或生成测试 entropy；
- 分步显示 entropy bits、SHA-256、checksum bits、11-bit groups 和 words；
- 每一步可展开解释；
- 不要求真实助记词。

### 关键公式

```text
CS = ENT / 32
MS = (ENT + CS) / 11
```

事实和示例必须从规范与测试向量核验。

## 6. Converter `/bip39-converter/`

### 页面任务

在测试 entropy、mnemonic 和 seed 之间转换。

### 模式

- Entropy → Mnemonic；
- Mnemonic → Entropy；
- Mnemonic + optional passphrase → Seed。

### 不提供

- 私钥；
- 地址余额扫描；
- 服务器端 API；
- 真实钱包恢复承诺。

### 页面策略

首版一个 URL + 模式标签。每个模式均有可链接标题和独立说明，但 canonical 保持主 URL。

## 7. Passphrase `/bip39-passphrase/`

### 页面任务

解释 optional passphrase、“25th word”俗称和错误 passphrase 的后果。

### 交互

- 固定官方测试 mnemonic；
- 两个示例 passphrase；
- 展示不同 seed fingerprint，而非完整私钥；
- 解释任何 passphrase 都能导出一个确定性 seed，通常不存在“错误提示”。

### 内容

- passphrase 不一定是一个词；
- 大小写和 Unicode 规范化；
- mnemonic vs passphrase；
- 遗失 passphrase 的风险；
- 备份策略。

## 8. Offline `/bip39-offline/`

### 页面任务

下载、验证并断网运行 BIP39 工具。

### 必须展示

- 当前版本；
- 文件大小；
- SHA-256；
- 签名/发布流程（若存在）；
- GitHub source tag；
- reproducible build 状态；
- Windows/macOS/Linux 的本地打开步骤；
- 如何确认浏览器无网络请求；
- 安全限制。

### CTA

`Download standalone HTML` 为主，`View source` 为次。

## 9. What Is BIP39 `/what-is-bip39/`

### 页面任务

以非开发者也能理解的方式解释 BIP39。

### 结构

1. 40–60词直接定义；
2. 图解 Entropy → Mnemonic → Seed；
3. BIP39 解决什么；
4. 不解决什么；
5. 词数和 entropy 表；
6. checksum；
7. passphrase；
8. BIP39 与 BIP32/BIP44 的边界；
9. 安全建议；
10. 官方规范与测试工具。

