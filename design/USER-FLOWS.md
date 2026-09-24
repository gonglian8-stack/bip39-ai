# 用户流程

测试数据统一使用官方向量 #1：
- entropy `00000000000000000000000000000000`
- mnemonic `abandon ×11 + about`
- passphrase `TREZOR` → seed `c55257c3…e7463b04`（实现阶段以 vectors.json 校验）

## 1. Generator

```text
进入 /bip39-generator/（默认 12 words，结果区 Empty：显示"Press Generate or load a test vector"）
├─ 选词数（12/15/18/21/24）→ 右侧即时显示 ENT/CS/MS，例如 128 / 4 / 12
├─ [Generate]
│   ├─ crypto.getRandomValues 可用 → 输出 mnemonic 词块 + entropy hex + bit grid 折叠预览，来源标签 GENERATED
│   └─ 不可用 → 按钮禁用，Notice：Secure randomness is unavailable in this browser; generation is disabled.
├─ [Load test vector] → 填入向量 #1，来源标签 TEST VECTOR
├─ [Copy] → Copied；[Regenerate] → 覆盖结果
└─ 结果下方固定出口：Validate this phrase → /bip39-validator/（不带参数，不传递数据）；See the checksum → /bip39-checksum/；Download offline tool
```

规则：生成结果不写入 URL/存储；离开页面不保留。

## 2. Validator

```text
进入 /bip39-validator/（Secret field 空；结果 idle）
├─ 粘贴/输入 → 不自动校验；只本地显示词数计数
├─ [Validate]（或 Ctrl/Cmd+Enter）
│   ├─ 规范化：trim、合并空白、小写、NFKD
│   ├─ 词数 ∉ {12,15,18,21,24} → invalid：Word count n is not valid
│   ├─ 存在未知词 → invalid：列出位置 #n "abandn"，建议 "abandon"（仅首 4 字母匹配提示）
│   ├─ checksum 不匹配 → invalid：Checksum mismatch. The words exist, but this combination is not a valid BIP39 mnemonic.
│   └─ 通过 → valid + 固定免责声明
├─ [Load test vector]：提供 valid 示例和 invalid 示例（向量 #1 改末词为 "abandon"）
├─ [Clear] → 清空输入与结果，播报
└─ 侧栏常驻：Offline CTA
```

## 3. Word List

```text
进入 /bip39-word-list/（Grid 视图，2048 词全部在初始 HTML）
├─ 搜索框：输入字母 → 前缀匹配过滤；输入数字 → 按 index（显示 0–2047 与 1–2048 两种编号说明）
├─ 视图切换 Grid / List（List 列：#, index(dec), binary 11-bit, word）
├─ 点击单词 → 复制单词；行内次级按钮复制 index
├─ 下载 TXT / JSON / CSV → 显示每个文件 SHA-256 与来源 commit
└─ 无结果状态：No word starts with "xyz". BIP39 words are identified by their first 4 letters.
```

## 4. Checksum

```text
进入 /bip39-checksum/（默认载入向量 #1，而非空白）
├─ 源选择：Test vector ▾（官方向量 1–24 可选）| Generate random test entropy
├─ Step 1 Entropy：hex + bits（ENT 位）
├─ Step 2 SHA-256(entropy)：显示完整 hash，高亮前 CS 位
├─ Step 3 Append checksum：ENT+CS 位串，CS 位琥珀色
├─ Step 4 Split into 11-bit groups：bit grid
├─ Step 5 Map to words：index → word
└─ 每步 [Explain] 展开；底部公式表 CS = ENT/32，MS = (ENT+CS)/11
```

不提供粘贴真实 mnemonic 的入口；想检查自己的短语 → 链接 Validator。

## 5. Converter

```text
进入 /bip39-converter/（模式 tab，默认 Entropy → Mnemonic）
├─ Entropy → Mnemonic：hex 输入（Secret field）→ 校验长度 32/40/48/56/64 hex → mnemonic
├─ Mnemonic → Entropy：mnemonic 输入 → 先做 Validator 同样检查 → entropy hex
├─ Mnemonic (+ passphrase) → Seed：
│   ├─ passphrase 可选（Secret field，默认遮罩）
│   ├─ [Convert] → 512-bit seed hex（显示 "PBKDF2-HMAC-SHA512, 2048 iterations"），Working 状态
│   └─ 永远不显示 xprv、私钥、地址
├─ 每模式 [Load test vector]
└─ 切换模式时清空上一模式的输入与输出
```

## 6. Passphrase

```text
进入 /bip39-passphrase/
├─ 固定 mnemonic：向量 #1（只读，标 TEST VECTOR）
├─ 三列对比：passphrase "" / "TREZOR" / "trezor"
│   └─ 各显示 seed fingerprint（SHA-256(seed) 前 8 hex）+ 展开完整 seed
├─ 可编辑第四列 "Try your own test passphrase"（Secret field）→ 实时对比，说明 "No error is shown for a wrong passphrase — it silently produces a different wallet."
└─ 内容：大小写、Unicode NFKD、备份策略
```

## 7. Offline

```text
进入 /bip39-offline/
├─ Release 卡：Version · Size · Released · SHA-256 · [Download standalone HTML] · [View source ↗]
├─ Verify：各系统命令
│   ├─ macOS/Linux: shasum -a 256 bip39-ai-offline-vX.html
│   └─ Windows: Get-FileHash .\bip39-ai-offline-vX.html -Algorithm SHA256
├─ Use offline：断网 → 双击用浏览器打开 → 顶部徽标显示 Offline build → DevTools Network 应为空
├─ Evidence 表：Source tag ✓ / SHA-256 ✓ / Test vector results ✓ / Reproducible build: Not yet available / Signature: Not yet available
└─ Limitations：无法防御已感染的电脑、浏览器扩展、剪贴板和屏幕记录
```

离线单文件包含 Generator、Validator、Converter、Checksum、Word List 五个工具，单页 tab 切换。
