# 设计系统

所有值以 CSS 自定义属性实现，浅色/深色两套。无外部字体、无图标字体（图标为内联 SVG）。

## 1. 颜色 Token

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `--bg` | `#F7F8FA` | `#0F1216` | 页面背景 |
| `--surface` | `#FFFFFF` | `#161A20` | 卡片、工具面板 |
| `--surface-2` | `#EEF1F5` | `#1D222A` | 次级面板、代码块 |
| `--border` | `#D5DAE1` | `#2C333D` | 分隔、输入框边框 |
| `--text` | `#12161C` | `#E8ECF1` | 正文（对 bg ≥ 15:1） |
| `--text-muted` | `#4F5967` | `#A3ADBA` | 次要文字（≥ 7:1） |
| `--accent` | `#0B5C7A` | `#5CB8DB` | 主按钮、链接、焦点（对 surface ≥ 4.5:1） |
| `--accent-contrast` | `#FFFFFF` | `#0F1216` | 主按钮文字 |
| `--secret` | `#8A5A00` | `#E3B45C` | 敏感区标签与边框 |
| `--secret-bg` | `#FFF8E8` | `#241D10` | 敏感区背景 |
| `--ok` | `#1B6E3A` | `#6FCF97` | 校验通过 |
| `--ok-bg` | `#EAF6EE` | `#11241A` | |
| `--err` | `#B42318` | `#F28B82` | 校验失败 |
| `--err-bg` | `#FDEDEC` | `#2A1414` | |
| `--bits-ent` | `#0B5C7A` | `#5CB8DB` | entropy bits |
| `--bits-cs` | `#8A5A00` | `#E3B45C` | checksum bits |

规则：颜色从不单独承载含义。成功/失败同时有图标和文字；entropy/checksum 位同时用色和下划线样式区分（checksum 位加虚线下划线）。

## 2. 字体

- UI：`system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- 数据：`ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace`，开启 `font-variant-numeric: tabular-nums`。

| 级别 | 桌面 | 移动 | 行高 | 字重 |
|---|---|---|---|---|
| H1 | 40 | 30 | 1.15 | 700 |
| H2 | 28 | 23 | 1.25 | 650 |
| H3 | 20 | 18 | 1.3 | 600 |
| Body | 17 | 16 | 1.6 | 400 |
| Small | 14 | 14 | 1.45 | 400 |
| Mono data | 15 | 14 | 1.6 | 450 |
| Label | 13 大写，字距 0.04em | 同 | 1.3 | 600 |

正文最大行宽 70ch。

## 3. 间距、网格、断点

- 间距刻度（px）：4, 8, 12, 16, 24, 32, 48, 64, 96。
- 圆角：输入/按钮 6px，卡片 10px，徽标 999px。
- 容器：最大 1200px；文章正文 720px。
- 断点：`sm` < 640、`md` 640–1023、`lg` ≥ 1024。
- 工具页桌面：工具区 8 列 + 侧栏 4 列（Online/Offline 简卡、相关链接）；`md` 以下侧栏落到工具下方。
- 阴影：只用 1px 边框 + 极轻阴影 `0 1px 2px rgb(0 0 0 / .06)`，深色模式不用阴影。

## 4. 组件

### 4.1 按钮
- Primary（accent 填充）、Secondary（描边）、Ghost（仅文字）、Danger-ghost（Clear）。
- 高度 44px（触控目标 ≥ 44×44），图标按钮同样 44×44。
- 状态：hover 加深 8%；active 下压 1px；disabled 40% 不透明并 `aria-disabled`；loading 显示内联 spinner 与"Generating…"。

### 4.2 模式徽标 ModeBadge
- Online：中性描边 + 小圆点，文案 `Online · runs in your browser`。
- Offline（单文件版）：ok 色圆点，`Offline build v1.0.0`。
- 点击弹出 popover：说明 + "How to verify"（打开 DevTools Network）+ 链接 Offline。

### 4.3 Secret field（敏感输入容器）
凡是可输入 mnemonic / entropy / passphrase 的区域：
- 左侧 4px `--secret` 竖条，背景 `--secret-bg`，右上角标签 `SENSITIVE INPUT`。
- 上方常驻一行：`Use test data only. For a real recovery phrase, use the offline tool.` 后接链接。
- textarea：`autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"`，`data-sensitive`。
- 右下角：Clear 按钮（立即清空并把焦点还给输入框，播报 "Input cleared"）。
- 可选"Hide words"开关，遮罩显示为 `•••••`。

### 4.4 Output field（输出）
- 等宽，`--surface-2` 背景，带标签（如 `MNEMONIC · 12 words`）与 `TEST VECTOR`/`DEMO`/`GENERATED` 来源标签。
- Mnemonic 以编号词块网格显示：`01 abandon`，桌面 4 列、`md` 3 列、`sm` 2 列。
- Hex 每 8 字符加细空格分组，允许换行（`overflow-wrap:anywhere`）。
- Copy 按钮：点击后变为 "Copied" 2 秒，`aria-live=polite` 播报。生成结果的 Copy 附小字 "Clipboard can be read by other apps"。

### 4.5 Bit grid（位可视化）
- 每位一个等宽字符单元格，按 11 位一组，组下方显示十进制 index 与单词。
- entropy 位 `--bits-ent`，checksum 位 `--bits-cs` + 虚线下划线。
- 移动端每行 1 组（11 位），桌面每行 4 组。
- 屏幕阅读器：每组提供 `aria-label="Group 1: bits 00000000000, index 0, word abandon"`。

### 4.6 Result panel（校验结果）
状态：`idle`、`valid`、`invalid`、`warning`。
- valid：ok 色图标 + `Checksum valid · 12 words · English wordlist`，下方固定一行 `Valid structure only. It does not mean a wallet exists, holds funds, or is safe.`
- invalid：分项列出（词数不合法 / 第 n 个词不在词表中并给出最近候选 / checksum 不匹配）。
- 容器 `role="status"`（valid）或 `role="alert"`（invalid）。

### 4.7 Segmented control
词数 12/15/18/21/24、Converter 模式、Word List 视图。实现为 radio group，方向键切换。

### 4.8 Notice
- `info`（中性）、`secret`（琥珀）、`warning`（琥珀加粗）。一行为主，不可关闭（安全提示常驻）。

### 4.9 Evidence row（信任证据行）
`label | value | 验证方式`，例如 `SHA-256 | 3f9a…c21e [Copy] | How to verify`。值未知时显示 `Not yet available` 灰色标签。

### 4.10 其他
面包屑、FAQ（`<details>` 手风琴）、Related 卡片、目录（文章页右侧粘性，移动端顶部折叠）、表格（移动端横向滚动容器内，第一列固定）。

## 5. 通用状态

每个工具必须设计：Empty、Example loaded、Working、Success、Error、Copied、Cleared、Crypto unavailable（`crypto.getRandomValues` 或 `crypto.subtle` 不可用时禁用操作并解释）、Offline build。

## 6. 无障碍

- 目标 WCAG 2.2 AA；正文对比度 ≥ 7:1，交互元素 ≥ 4.5:1，焦点环 ≥ 3:1。
- 焦点环：2px `--accent` 实线 + 2px 外偏移，所有可聚焦元素可见，不用 `outline:none`。
- 每个输入有可见 `<label>`；帮助文本 `aria-describedby`；错误文本与字段关联并 `aria-invalid`。
- 结果区 `aria-live`；Copy/Clear 反馈播报。
- 触控目标 ≥ 44×44；相邻目标间距 ≥ 8px。
- 支持 `prefers-reduced-motion`（关闭位网格动画）；支持 200% 缩放无横向滚动（数据块内滚动除外）。
- 全站可纯键盘完成：Skip link → 主工具。
