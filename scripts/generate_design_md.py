#!/usr/bin/env python3
"""从 b2b-standards.json 生成供 Agent 阅读的中文 DESIGN.md。"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
from typing import Any


def config_digest(data: dict[str, Any]) -> str:
    payload = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def yn(value: bool) -> str:
    return "是" if value else "否"


def render_design_md(data: dict[str, Any], source_label: str = "b2b-standards.json") -> str:
    product = data["product"]
    token = data["theme"]["token"]
    custom_token = data["theme"]["customToken"]
    navigation = data["theme"]["navigation"]
    navigation_modes = navigation["modes"]
    layout = data["layout"]
    spacing = data["spacing"]
    border = data["border"]
    table = data["table"]
    form = data["form"]
    components = data["components"]
    action_groups = components["actionGroups"]
    patterns = data["pagePatterns"]
    list_pattern = patterns["list"]
    cards = patterns["cards"]
    modal = patterns["modal"]
    tree = list_pattern.get("leftTreeFilter")
    digest = config_digest(data)
    tree_rule = ""
    if tree:
        tree_rule = f"""
### 左侧树筛选

- 仅用于具有层级关系的筛选维度，默认单选；面板宽度 {tree['panel']['width']}px，与列表间距 {tree['panel']['gap']}px。
- 树支持搜索、收起和状态保留；搜索结果必须保留祖先路径，选择结果同步到 URL。
- 移动端在 {tree['mobileBreakpoint']}px 断点切换为上下堆叠，不压缩成不可读的窄栏。
"""

    query_button_text = "、".join(
        f"{button['icon']} + {button['label']}（{button['variant']}）"
        for button in action_groups['listQuery']['buttons']
    )
    row_action_text = " → ".join(action_groups['tableRow']['order'])

    return f"""<!-- 本文件由 scripts/generate_design_md.py 自动生成，请勿直接修改。 -->
<!-- source: {source_label}; sha256: {digest} -->

# B 端界面设计规范

本文件供 Codex、Claude Code、Cursor、Copilot 及兼容 Agent 在生成或修改 UI 前读取。配置值的唯一事实来源是 `{source_label}`；修改配置后必须重新生成本文件。

## 执行优先级

- 本规范采用严格模式。既有代码、框架默认值、Agent 习惯或示例与本规范冲突时，以本规范为准。
- 优先复用项目已有规范组件，其次组合 Ant Design 公开组件；禁止重复实现已有的菜单、分页、校验、弹窗焦点和查询布局能力。
- 不得为追求“丰富”自行添加渐变、大圆角、强阴影、装饰插画或额外主色。
- 业务需求未明确修改设计规范时，不得静默偏离；无法满足时必须报告冲突。

## 产品气质

- 语言：{product['locale']}；密度：{product['density']}；内容区采用 {product['contentWidth']} 流式宽度，页面四周使用统一响应式留白。
- 面向企业管理和员工体验业务，优先保证信息扫描效率、状态辨识、操作确定性和一致性。
- 页面留白用于表达信息层级，不用于制造营销感；文字、控件和数据应保持稳定对齐。

## 核心视觉令牌

| 项目 | 规范值 |
| --- | --- |
| 主品牌色／辅助色 | `{token['colorPrimary']}`／`{custom_token['colorSecondary']}` |
| 成功／警告／错误 | `{token['colorSuccess']}`／`{token['colorWarning']}`／`{token['colorError']}` |
| 主文字／次文字 | `{token['colorText']}`／`{token['colorTextSecondary']}` |
| 基础字号 | {token['fontSize']}px |
| 控件高度 | {token['controlHeight']}px |
| 圆角 | {token['borderRadius']}px |
| 边框 | {border['width']}px {border['style']} `{border['color']}` |
| 页面间距 | {product['pageGutter']}px；紧凑页面 {product['pageGutterCompact']}px |
| 间距基数 | {spacing['unit']}px；常用 {spacing['xs']}／{spacing['sm']}／{spacing['md']}／{spacing['lg']}／{spacing['xl']}px |

所有视觉数值必须来自 Theme、共享 Token 或规范组件，不在业务页面散落无解释的色值、字号、间距和圆角。可交互字段、链接和主按钮统一使用主品牌色；辅助色仅用于特殊强调和个别标签，不替代主交互色。

## 应用骨架

- 顶部通栏：左侧 Logo，中间为应用切换，右侧为当前用户和全局操作；Header 高度 {data['theme']['components']['Layout']['headerHeight']}px。
- Header 与左侧菜单支持浅色和深色两套模式；未明确要求深色时固定使用 `{navigation['defaultMode']}`（浅色）模式。
- 浅色模式背景：Header `{navigation_modes['light']['headerBg']}`、Sider `{navigation_modes['light']['siderBg']}`；深色模式背景：Header `{navigation_modes['dark']['headerBg']}`、Sider `{navigation_modes['dark']['siderBg']}`。
- 左侧直接展示当前应用菜单，不显示“应用菜单”或应用名称标题；菜单最多 {layout['navigationMaxDepth']} 级，所有菜单必须有图标。
- 应用切换后同步替换左侧菜单并进入默认页。超过 {layout['applicationDirectVisibleMax']} 个直显应用时，使用分类悬浮卡片。
- 左侧栏展开宽度 {layout['sidebarWidth']}px，收起宽度 {layout['sidebarCollapsedWidth']}px；内容区不得被固定宽度组件撑破。

## 列表页

- 顺序固定为：面包屑 → 标题与副标题同行 → 查询条件 → 表格区。
- 查询区采用 {list_pattern['queryGridColumns']} 列网格，按钮占一项；字段总数超过 {list_pattern['collapseThreshold']} 个时默认只显示前三项并提供展开／收起。
- 查询项的标签与控件同行，标签宽度 {list_pattern['queryLabelWidth']}px且禁止换行；控件占满剩余空间并允许收缩。
- 查询区内容左边界与表格内容左边界对齐。
- 查询区、表格区和独立表单默认占满可用内容宽度，不在业务页面写死整体容器宽度；阅读型内容允许按场景设置最大阅读宽度。
- 响应式列数依次为 {'／'.join(str(value) for value in list_pattern['queryResponsiveColumns'])}；折行后按钮组仍位于当前行最右侧。
- 查询按钮顺序为“{'、'.join(list_pattern['queryButtons'])}”；查询条件不使用星号标必填，缺失时在查询动作触发后使用 Tooltip 提示。
- 表格采用“左侧信息、右侧操作”：左侧数据列只读，可保留查看详情等导航链接；右侧固定操作列承载变更类动作。
- 默认一列只展示一个明确字段；头像、名称、邮箱等复合字段仅在身份识别等明确业务场景中使用。
- 表格不展示独立标题；顶部工具栏的只读文本位于左侧，操作按钮组位于右侧。每页默认 {table['pageSize']} 条，操作列固定：{yn(table['fixedActionColumn'])}。
- 操作列表头和内容均右对齐；所有表头单元格统一使用 `{table['headerBackgroundToken']}`，包括选择列和固定操作列。
- 根据字段和可用列宽自动判断溢出；超长内容显示省略号并在 Hover／键盘聚焦时用 Tooltip 展示全文，不能遮挡相邻字段或右侧操作列。
{tree_rule}
## 表单、详情与弹窗

- 桌面端表单固定为横向布局：标签宽度 {patterns['formLabelWidth']}px、不换行；表单容器占满可用宽度，控件按字段内容、输入预期和页面布局选择语义宽度，不将短字段机械拉满；窄屏时整张表单统一切换为纵向。
- 新增／编辑不超过 {patterns['createEditSurface']['modalMaxFields']} 个简单字段可用弹窗，最多 {patterns['createEditSurface']['drawerMaxFields']} 个使用抽屉，更复杂时使用独立页面。
- 详情不超过 {patterns['detailSurface']['modalMaxFields']} 个简单字段可用弹窗，最多 {patterns['detailSurface']['drawerMaxFields']} 个使用抽屉，更复杂时使用独立页面。
- 同一列表页、同一业务对象的详情和编辑必须采用相同承载方式；不一致时统一提升为更复杂的一档。
- 详情字段桌面端默认每行 {patterns['detailColumns']} 列。高级详情的面包屑单独一行，操作按钮与标题同行。
- 高级表单操作区必须吸底。弹窗宽度默认 {form['modalWidth']}px，抽屉宽度默认 {form['drawerWidth']}px。
- 弹窗字段必须提供说明并标注必填项；弹窗与抽屉提交操作区整体右对齐，按钮顺序为“{modal['cancelText']}”“{modal['confirmText']}”（次要 → 主）。

## 按钮与反馈

- 按钮顺序按场景确定，不使用全局统一的“主操作在左／右”规则；每个功能模块最多 {components['primaryButtonMaxPerModule']} 个主按钮。
- 弹窗、抽屉提交区：整体右对齐，次要按钮在前、主按钮在后，例如“{'、'.join(action_groups['formSubmit']['example'])}”。
- 列表查询区：整体右对齐，按“{'、'.join(action_groups['listQuery']['example'])}”排列；按钮样式为 {query_button_text}。展开属于视图切换，高频场景可独立靠右并与查询、重置分组。
- 表格顶部工具栏采用“只读文本居左、操作按钮组居右”；按钮组内按危险或次要在前、正向主动作在后，示例为“{'、'.join(action_groups['tableToolbar']['example'])}”。
- 表格行内操作按 `{row_action_text}` 的相对顺序渲染，仅展示实际存在且有权限的动作；启用／禁用互斥，删除始终最右并使用危险色。超过可见上限时收入“更多”菜单并保持相对顺序。
- Select 使用 Ant Design 公开组件并保留尾部箭头间距 {data['theme']['components']['Select']['showArrowPaddingInlineEnd']}px，不使用原生下拉或覆盖内部 DOM 定位箭头。
- 危险或不可逆操作必须二次确认并说明影响；错误后保留可恢复的用户输入。
- 明确处理加载、空、失败、无权限和成功状态，不使用无反馈的假操作。

## 卡片

- 卡片采用紧凑密度。图文卡片图片与文字比例为 {cards['mediaRatio']}:{cards['contentRatio']}，标题禁止换行，摘要最多 {cards['summaryMaxLines']} 行。
- 数据卡片左侧为 {cards['dataTitleFontSize']}px 标题和 {cards['dataValueFontSize']}px 常规字重数字，右侧为图标；数字不加粗。
- 默认依靠边框和间距建立层级，不随意增加阴影和装饰性背景。

## 组件复用顺序

1. 先查找并复用 `src/shared`、设计系统目录和同类页面中的规范组件。
2. 没有项目组件时，直接组合 Ant Design 的 `Layout`、`Menu`、`Breadcrumb`、`Form`、`Table`、`Modal`、`Drawer`、`Card` 等公开组件。
3. 只有至少两个真实业务功能共享稳定行为时才新增公共封装。
4. 禁止复制现有组件后改名、依赖 Ant Design 内部 DOM，或在单页重写全局 Token。

## 交付检查

- 先运行规范配置和 DESIGN.md 同步检查，再运行类型检查、测试和构建。
- 检查列表、表单、详情、弹窗、危险操作以及窄屏折行。
- 任何自动检查失败都必须阻止交付，不得以“接近规范”为由跳过。
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="生成或检查中文 DESIGN.md")
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--check", action="store_true", help="只检查输出是否为最新，不写文件")
    args = parser.parse_args()

    try:
        data = json.loads(args.config.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            raise ValueError("配置根节点必须是对象")
        expected = render_design_md(data, args.config.name)
        if args.check:
            actual = args.output.read_text(encoding="utf-8")
            if actual != expected:
                raise ValueError(f"{args.output} 已过期，请重新生成")
            print(f"DESIGN.md 已同步：{args.output}")
            return 0
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(expected, encoding="utf-8")
    except (OSError, json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
        parser.error(str(exc))

    print(f"DESIGN.md 已生成：{args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
