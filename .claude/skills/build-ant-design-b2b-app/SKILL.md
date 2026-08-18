---
name: build-ant-design-b2b-app
description: 使用 React、TypeScript 和 Ant Design 创建或扩展可配置的 B 端应用与业务原型。
---

# Claude Code 适配入口

先完整读取仓库根目录 `SKILL.md`，并将其作为本任务的正式 Skill 指令。

随后按根 Skill 的路由说明读取所需 `references/` 文件。不要在本适配文件中推断或复制设计、页面和交互规范。

生成列表页时必须读取 `references/page-patterns.md` 和 `references/interaction-rules.md`，不得仅依赖 Ant Design `Form.Item` 默认布局。查询项必须使用标签与控件同行的四列网格；超过三个查询字段时默认展示三项，并提供展开／收起。

生成新建或编辑界面时，同样不得使用 Ant Design 默认纵向表单造成字段标签与控件换行。桌面端统一使用固定标签宽度的横向表单项，窄屏时才整体切换为纵向布局。

既有代码、Claude 默认布局或组件示例与根 Skill 规范冲突时，必须以根 Skill、相关 `references/` 和生效配置为准修改实现，不得保留冲突方案。查询字段折行后，按钮组必须位于当前行最右侧。

同一列表页的详情与编辑必须采用相同承载方式；分别评估后不一致时，统一提升到 Modal、Drawer、独立页面中复杂度更高的一档。
