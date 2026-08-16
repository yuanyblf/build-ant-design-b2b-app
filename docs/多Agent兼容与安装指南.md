# 多 Agent 兼容与安装指南

本项目以根目录 `SKILL.md` 为唯一 Skill 入口，同时提供 Codex、Claude Code、Cursor、GitHub Copilot 和支持 `AGENTS.md` 的智能体适配文件。

## 目录约定

```text
SKILL.md                                  核心 Skill，唯一事实来源
AGENTS.md                                 通用 Agent 仓库入口
agents/openai.yaml                        Codex 展示元数据
.claude/skills/build-ant-design-b2b-app/  Claude Code 项目级入口
.cursor/rules/                            Cursor 项目规则
.github/copilot-instructions.md           GitHub Copilot 仓库指令
assets/ references/ scripts/              所有 Agent 共用资源
```

## Codex

```bash
git clone <仓库地址> ~/.codex/skills/build-ant-design-b2b-app
```

重新启动或刷新 Skill 列表后，使用：

```text
使用 build-ant-design-b2b-app Skill 规划一个培训课程后台。
```

## 通用 Agent Skills 目录

如果智能体支持 `SKILL.md` 和 skills 目录，将整个仓库克隆到该运行时的用户级或项目级 skills 目录。不要只复制 `SKILL.md`，否则无法读取默认配置、参考规范和校验脚本。

## Claude Code

仓库内已包含项目级适配入口：

```text
.claude/skills/build-ant-design-b2b-app/SKILL.md
```

在本仓库中使用 Claude Code 时，适配入口会要求其读取根 Skill。用户级安装时，也可以把整个仓库放入 Claude Code 的 skills 目录，并保证根 `SKILL.md` 与资源目录保持相对位置。

## Cursor

仓库包含：

```text
.cursor/rules/build-ant-design-b2b-app.mdc
```

在 Cursor 中对相关文件启用该规则后，Agent 会转向根 `SKILL.md`。全局规范仍只维护在根 Skill 和 `references/` 中。

## GitHub Copilot

仓库级指令位于：

```text
.github/copilot-instructions.md
```

它用于提示 Copilot 读取根 Skill、规范配置和相关参考文档。

## 其他 Agent

支持 `AGENTS.md` 的智能体从仓库根 `AGENTS.md` 开始。其他工具可以创建一个轻量入口，只包含“完整读取根 `SKILL.md`”的指令，不要复制完整规范。

## 兼容性验证

更新 Skill 后至少检查：

1. 根 `SKILL.md` 能通过 Skill 校验。
2. 所有适配文件都指向根 `SKILL.md`。
3. 默认 JSON 能通过校验脚本。
4. Demo 能完成 TypeScript 和生产构建。
5. 没有在平台适配文件中复制全局业务规范。
