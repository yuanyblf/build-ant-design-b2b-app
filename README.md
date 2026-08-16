# Ant Design B 端业务原型 Skill

这是一个面向产品经理和前端研发的通用 Agent Skill，用统一的中文业务描述、Ant Design 组件和可配置规范，快速生成、验证 B 端业务原型。支持 Codex，并提供 Claude Code、Cursor、GitHub Copilot 和通用 `AGENTS.md` 适配入口。

仓库根目录就是可安装 Skill，同时包含中文文档和完整可运行示例。

## 仓库结构

```text
.
├── SKILL.md                         # Skill 入口
├── agents/                          # Skill UI 元数据
├── AGENTS.md                        # 通用 Agent 入口
├── .claude/                         # Claude Code 适配
├── .cursor/                         # Cursor 规则适配
├── .github/                         # GitHub Copilot 指令
├── assets/                          # 默认 b2b-standards.json
├── references/                      # 架构、页面、交互与产品工作流
├── scripts/                         # 规范校验与代码生成脚本
├── docs/                            # 面向产品经理和设计负责人的中文文档
│   ├── 产品经理业务原型使用手册.md
│   └── b2b-standards-中文配置指南.md
└── examples/demo/                   # React + TypeScript + Ant Design 标准 Demo
```

## 安装 Skill

将仓库克隆或复制到 Codex Skill 目录：

```bash
git clone <GitHub 仓库地址> ~/.codex/skills/build-ant-design-b2b-app
```

安装后可以这样使用：

```text
使用 build-ant-design-b2b-app Skill 规划一个培训课程应用。
请先给出两级菜单、页面清单、状态流转和验证方案，等我确认后再制作页面。
```

## 产品经理文档

- [产品经理业务原型使用手册](docs/产品经理业务原型使用手册.md)：从业务描述、规划确认、原型生成到业务验收的完整流程和可复制提示词。
- [b2b-standards.json 中文配置指南](docs/b2b-standards-中文配置指南.md)：修改颜色、字号、间距、布局、组件和页面规则。
- [多 Agent 兼容与安装指南](docs/多Agent兼容与安装指南.md)：Codex、Claude Code、Cursor、GitHub Copilot 和其他 Agent 的入口与维护方式。

## 运行 Demo

```bash
cd examples/demo
npm install
npm run dev
```

Demo 包含工作台、组织、商品、订单、员工体验、培训课程和人文关怀等场景，覆盖列表、卡片、树形结构、进度条、弹窗、抽屉、高级详情和分步表单。

生产构建：

```bash
cd examples/demo
npm run build
```

## 修改并生成设计规范

编辑 Demo 中的规范配置：

```text
examples/demo/.b2b/b2b-standards.json
```

在仓库根目录执行：

```bash
python3 scripts/apply_standards.py \
  --config examples/demo/.b2b/b2b-standards.json \
  --out-dir examples/demo/src/shared/design-system/generated
```

不要直接修改 `examples/demo/src/shared/design-system/generated` 下的生成文件。

## 发布前验证

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  .

python3 scripts/apply_standards.py \
  --config assets/b2b-standards.json \
  --check

cd examples/demo && npm run build
```

## 设计规范来源

当前规范以腾讯 CoDesign“后台规范”项目为设计来源，入口和已核对页面记录在 [design-source.md](references/design-source.md)。
