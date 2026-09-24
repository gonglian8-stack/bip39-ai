# 设计自检（ACCEPTANCE.md A 部分）

检查日期：2026-09-24 · 版本 0.1.0 · 原型即可运行的实现（`npm run dev`）

| # | 验收项 | 结论 | 证据 |
|---|---|---|---|
| A1 | 先提交 sitemap、用户流程和页面模块 | ✅ | `INFORMATION-ARCHITECTURE.md`、`USER-FLOWS.md` 先于代码提交（检查点 1） |
| A2 | 桌面与移动端均有首页、Generator、Validator、Word List、Checksum、Offline | ✅ | 断点 640/1024；已在 375px 与 1280px 下检查，无横向滚动 |
| A3 | 每个工具展示空、示例、成功、错误和安全提示状态 | ✅ | Generator：空/测试向量/生成/随机源不可用；Validator：idle/valid/invalid（词数、未知词、checksum 三类）；Converter：每模式错误提示；Checksum：默认示例；Word List：无结果状态 |
| A4 | 首屏直接完成任务，而非营销 Hero + 注册墙 | ✅ | 工具页 H1 + 一句话后即工具；无登录 |
| A5 | 视觉可信、技术、克制 | ✅ | 中性色 + 单一深青蓝强调色；无渐变、金色、币价意象 |
| A6 | 安全提示醒目但不阻断测试任务 | ✅ | 常驻 inline notice + Online 徽标；无弹窗 |
| A7 | 普通内容与高风险秘密输入视觉区分 | ✅ | 统一 Secret field：琥珀竖条 + `SENSITIVE INPUT` 标签 + 常驻说明 |
| A8 | 无虚构审计、用户数、评分、合作方和测试结论 | ✅ | 审计/可复现构建/签名显示 “Not yet available”；依赖库审计按上游 README 如实写明版本范围；测试结论均来自实际测试套件 |
| A9 | 焦点、对比度、label、错误播报和触控尺寸 | ✅ | 可见焦点环；正文对比度 ≥ 7:1；全部输入有 label；`aria-live` 区域播报 Copy/Clear/校验结果；按钮 ≥ 44px |
| A10 | 未增加登录、钱包连接、余额扫描、社区和聊天 | ✅ | 无 |

## 仍需人工确认

- 需在 GitHub 仓库 Settings → Security 开启 Private vulnerability reporting（Security 页的报告入口依赖它）。
- 屏幕阅读器实测（VoiceOver/NVDA）尚未进行。
