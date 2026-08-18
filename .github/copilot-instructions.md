# Ant Design B 端项目指令

本仓库根目录是一个 Agent Skill。处理 React、TypeScript、Ant Design、后台管理或业务原型任务前，完整读取根目录 `SKILL.md` 和自动生成的 `DESIGN.md`，并按其中的路由说明读取相关 `references/` 文件。

- 默认规范：`assets/b2b-standards.json`
- 校验脚本：`scripts/apply_standards.py`
- DESIGN.md 生成脚本：`scripts/generate_design_md.py`
- 代表性示例：`examples/demo/`
- 中文产品文档：`docs/`

不要复制或局部改写全局规范；`DESIGN.md` 只由 JSON 生成，禁止手工修改。需要修改全局规范时，同步修改默认配置、校验逻辑、中文文档和代表性 Demo。

既有实现或 Copilot 默认建议与根 Skill 规范冲突时，严格执行根 Skill、相关引用文档和生效配置，不得静默偏离。
