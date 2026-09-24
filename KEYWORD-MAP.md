# BIP39.ai 关键词与页面映射

## 使用说明

本表用于定义搜索意图和页面边界，不代表已获得精确搜索量。正式开发前应补充目标国家、语言、搜索量、KD、CPC、趋势和检查日期。

| 优先级 | 关键词簇 | 主任务 | 主 URL | 页面类型 | 首版 |
|---|---|---|---|---|---|
| P0 | bip39, bip 39, bip39 tool | 了解标准或进入工具 | `/` | 导航型产品首页 | 是 |
| P0 | bip39 generator, mnemonic generator, seed phrase generator | 生成符合标准的测试助记词 | `/bip39-generator/` | 精品工具页 | 是 |
| P0 | bip39 validator, mnemonic validator, seed phrase checker | 验证词表、结构与 checksum | `/bip39-validator/` | 精品工具页 | 是 |
| P0 | bip39 word list, wordlist, 2048 words | 查找和下载官方词表 | `/bip39-word-list/` | 数据/参考页 | 是 |
| P0 | bip39 checksum, checksum calculator/checker | 理解或计算 checksum | `/bip39-checksum/` | 工具 + 教程 | 是 |
| P1 | bip39 converter, mnemonic to seed, entropy to mnemonic | 转换测试数据 | `/bip39-converter/` | 多模式工具页 | 是 |
| P1 | bip39 passphrase, 25th word | 理解可选 passphrase | `/bip39-passphrase/` | 交互教程 | 是 |
| P1 | bip39 offline, offline generator, standalone | 下载并断网运行 | `/bip39-offline/` | 下载/信任页 | 是 |
| P1 | what is bip39, how does bip39 work | 学习标准 | `/what-is-bip39/` | 支柱教程 | 是 |
| P2 | bip39 last word calculator | 计算有效末词 | `/bip39-last-word-calculator/` | 高风险离线工具 | 否，验证后 |
| P2 | bip39 derivation path, mnemonic to address | 从 seed 继续派生 | `/bip39-derivation-path/` | 高级工具/教程 | 否，验证后 |
| P2 | bip39 english/chinese/japanese word list | 指定语言词表 | `/bip39-word-list/{language}/` | 程序化数据页 | 否，小批验证 |
| P2 | bip39 javascript/python/rust/github/npm | 实现与代码 | `/developers/bip39-{language}/` | 开发教程 | 否，验证后 |
| 排除 | cracker, brute force, seed finder, wallet hacking | 破解或未经授权恢复 | 不建页 | 风险意图 | 永不承接 |

## 页面合并规则

### Generator 页面共同覆盖

`bip39 generator`、`bip39 mnemonic generator`、`bip39 seed generator`、`12 word seed phrase generator`、`24 word seed phrase generator` 先由同一页面覆盖。词数是控件与章节，不分别复制页面。

### Validator 页面共同覆盖

`validator`、`checker`、`verify` 在 SERP 和任务一致时合并。Checksum 页面只在用户需要理解/计算算法时独立。

### Converter 页面共同覆盖

首版在一个页面提供模式切换，不为 `mnemonic to seed`、`entropy to mnemonic` 等每个方向复制页面。上线后仅在 GSC 证明意图和内容足够独立时拆分。

### Word list 子页

首版只发布英文总页。其他语言满足以下条件才建页：

- 有独立查询需求；
- 能提供该语言完整官方数据和 Unicode 处理说明；
- 有真实兼容性提醒；
- 内容不是只替换语言名；
- 页面经过对应语言人工核验。

## 待采集关键词字段

```text
keyword
country
language
search_volume_estimate
kd
cpc
trend_5y
trend_12m
serp_types
top_10_urls
primary_intent
secondary_intent
page_decision
data_source
checked_at
notes
```

