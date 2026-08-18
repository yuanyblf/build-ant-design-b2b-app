# 多 Agent 兼容规范

## 单一事实来源

根目录 `SKILL.md` 是能力描述和执行流程的唯一事实来源。`assets/`、`references/` 和 `scripts/` 与它保持相对路径关系。

不要为不同 Agent 复制业务规范。平台适配文件只负责发现根 Skill，并要求 Agent 完整读取根 `SKILL.md` 及其按任务引用的文档。

## 兼容层

- Codex：直接安装仓库根目录，读取 `SKILL.md` 和 `agents/openai.yaml`。
- 通用 Agent Skills：将仓库目录放入运行时支持的 skills 目录，入口为根 `SKILL.md`。
- Claude Code：`.claude/skills/build-ant-design-b2b-app/SKILL.md` 是项目级发现入口，转向根 `SKILL.md`。
- Cursor：`.cursor/rules/build-ant-design-b2b-app.mdc` 在相关 React／TypeScript／Ant Design 文件中启用，并转向根 `SKILL.md`。
- GitHub Copilot：`.github/copilot-instructions.md` 提供仓库级指令，并转向根 `SKILL.md`。
- 其他支持 `AGENTS.md` 的智能体：从根 `AGENTS.md` 获取入口和工作约束。

## 适配器要求

1. 先完整读取根 `SKILL.md`；处理 UI 时同时读取自动生成的 `DESIGN.md`，再执行任务。
2. 按根 Skill 的路由说明读取所需 `references/` 文件。
3. 使用 `assets/b2b-standards.json` 作为默认规范。
4. 使用 `scripts/apply_standards.py` 校验和生成配置，使用 `scripts/generate_design_md.py` 从 JSON 更新 `DESIGN.md`。
5. 不在适配器中重新定义 Token、布局、页面和交互规则；不得手工维护 `DESIGN.md`。
6. 平台能力与根 Skill 冲突时，遵守更严格的安全和权限规则。
7. 既有项目实现、平台默认 UI、Agent 生成习惯与根 Skill 业务规范冲突时，以根 Skill、相关引用文档和生效配置为准，主动修正冲突实现，不得静默偏离。

## 维护验证

修改根 Skill 后检查所有适配器仍指向 `SKILL.md`。适配器不应包含根 Skill 的长段落副本，避免更新遗漏。
