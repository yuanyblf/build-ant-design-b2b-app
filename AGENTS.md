# Agent 使用入口

本仓库根目录是 `build-ant-design-b2b-app` Skill。

处理 React、TypeScript、Ant Design、B 端后台、业务原型、CRUD、表单、详情、导航或设计规范任务时：

1. 完整读取根目录 `SKILL.md`。
2. 按 `SKILL.md` 的任务路由读取相关 `references/` 文档。
3. 使用 `assets/b2b-standards.json` 作为默认规范，项目副本优先。
4. 使用 `scripts/apply_standards.py` 校验规范，不直接修改生成文件。
5. `examples/demo/` 仅作为代表性实现和验证场景，不是规范的唯一来源。
6. 发现既有实现或 Agent 默认方案与 Skill 规范冲突时，严格以根 Skill、相关引用文档和生效配置为准，并修正冲突实现。

中文业务需求、规划建议、验收结果和产品交付文档统一使用中文。
