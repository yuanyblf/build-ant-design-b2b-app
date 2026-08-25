#!/usr/bin/env python3
"""对 React/Ant Design 页面执行可确定的 B2B 规范检查。"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from generate_design_md import render_design_md


def main() -> int:
    parser = argparse.ArgumentParser(description="检查 B2B 页面是否符合强制规范")
    parser.add_argument("--root", type=Path, required=True, help="待检查的前端项目目录")
    parser.add_argument("--config", type=Path, help="默认读取 <root>/.b2b/b2b-standards.json")
    parser.add_argument("--design", type=Path, help="默认检查 <root>/DESIGN.md")
    args = parser.parse_args()
    root = args.root.resolve()
    config_path = (args.config or root / ".b2b/b2b-standards.json").resolve()
    design_path = (args.design or root / "DESIGN.md").resolve()
    errors: list[str] = []

    try:
        standards = json.loads(config_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"规范检查失败：无法读取配置 {config_path}：{exc}")
        return 1

    try:
        expected_design = render_design_md(standards, config_path.name)
        if design_path.read_text(encoding="utf-8") != expected_design:
            errors.append(f"{design_path} 已过期或被手工修改，请运行 generate:standards")
    except OSError as exc:
        errors.append(f"无法读取 {design_path}：{exc}")

    conformance = standards.get("conformance") or {}
    theme = standards.get("theme") or {}
    form = standards.get("form") or {}
    table = standards.get("table") or {}
    product = standards.get("product") or {}
    components = standards.get("components") or {}
    action_groups = components.get("actionGroups") or {}
    patterns = standards.get("pagePatterns") or {}
    list_pattern = patterns.get("list") or {}
    left_tree_filter = list_pattern.get("leftTreeFilter")
    expected = {
        "conformance.mode": conformance.get("mode") == "strict",
        "conformance.conflictPolicy": conformance.get("conflictPolicy") == "skill-wins",
        "form.layout": form.get("layout") == "horizontal",
        "form.labelWrap": form.get("labelWrap") is False,
        "theme.token.colorPrimary": (theme.get("token") or {}).get("colorPrimary") == "#2A56DE",
        "theme.customToken.colorSecondary": (theme.get("customToken") or {}).get("colorSecondary") == "#FF6B06",
        "theme.navigation.defaultMode": (theme.get("navigation") or {}).get("defaultMode") == "light",
        "product.contentWidthMode": product.get("contentWidthMode") == "fluid",
        "product.uniformOuterGutter": product.get("uniformOuterGutter") is True,
        "table.columnLayout": table.get("columnLayout") == "information-left-actions-right",
        "table.dataColumnsReadOnly": table.get("dataColumnsReadOnly") is True,
        "table.singleFieldPerColumnByDefault": table.get("singleFieldPerColumnByDefault") is True,
        "table.compositeFieldRequiresExplicitScenario": table.get("compositeFieldRequiresExplicitScenario") is True,
        "table.actionColumnSide": table.get("actionColumnSide") == "right",
        "table.actionColumnAlign": table.get("actionColumnAlign") == "right",
        "table.headerBackgroundConsistent": table.get("headerBackgroundConsistent") is True,
        "table.longContentOverflow": table.get("longContentOverflow") == "ellipsis-with-tooltip",
        "components.actionGroups.formSubmit": (action_groups.get("formSubmit") or {}).get("order") == ["secondary", "primary"],
        "components.actionGroups.listQuery": (action_groups.get("listQuery") or {}).get("order") == ["primary-business", "utility", "view-toggle"],
        "components.actionGroups.tableToolbar": (action_groups.get("tableToolbar") or {}).get("order") == ["danger-or-secondary", "positive-primary"],
        "components.actionGroups.tableToolbar.layout": (action_groups.get("tableToolbar") or {}).get("layout") == "information-left-actions-right",
        "components.actionGroups.tableToolbar.informationAlign": (action_groups.get("tableToolbar") or {}).get("informationAlign") == "left",
        "components.actionGroups.tableToolbar.actionsAlign": (action_groups.get("tableToolbar") or {}).get("actionsAlign") == "right",
        "components.actionGroups.tableRow": (action_groups.get("tableRow") or {}).get("order") == ["detail", "edit", "copy", "enable-disable", "delete"],
        "pagePatterns.detailEditSurfaceConsistency": patterns.get("detailEditSurfaceConsistency") == "same-within-list",
        "list.queryGridColumns": list_pattern.get("queryGridColumns") == 4,
        "list.collapseThreshold": list_pattern.get("collapseThreshold") == 3,
        "list.queryResponsiveColumns": list_pattern.get("queryResponsiveColumns") == [4, 2, 1],
        "list.queryActionsAlign": list_pattern.get("queryActionsAlign") == "right-center",
        "list.queryActionsStayRowEnd": list_pattern.get("queryActionsStayRowEnd") is True,
        "list.queryTableContentLeftAligned": list_pattern.get("queryTableContentLeftAligned") is True,
        "list.containerWidth": list_pattern.get("containerWidth") == "fill-available",
        "list.tableToolbarLayout": list_pattern.get("tableToolbarLayout") == "information-left-actions-right",
        "list.tableInformationPosition": list_pattern.get("tableInformationPosition") == "header-left",
        "list.tableActionsPosition": list_pattern.get("tableActionsPosition") == "header-right",
    }
    if isinstance(left_tree_filter, dict):
        left_tree_panel = left_tree_filter.get("panel") or {}
        node_actions = left_tree_filter.get("nodeActions")
        valid_node_actions = (
            isinstance(node_actions, list)
            and all(isinstance(action, str) for action in node_actions)
            and len(node_actions) == len(set(node_actions))
            and set(node_actions) <= {"edit", "add-child", "delete"}
            and node_actions == [action for action in ("edit", "add-child", "delete") if action in node_actions]
        )
        expected.update({
            "list.leftTreeFilter.applicableTo": left_tree_filter.get("applicableTo") == "hierarchical-dimension",
            "list.leftTreeFilter.panel.sticky": left_tree_panel.get("sticky") is True,
            "list.leftTreeFilter.selectionMode": left_tree_filter.get("selectionMode") == "single",
            "list.leftTreeFilter.searchable": left_tree_filter.get("searchable") is True,
            "list.leftTreeFilter.preserveAncestorPathOnSearch": left_tree_filter.get("preserveAncestorPathOnSearch") is True,
            "list.leftTreeFilter.showLine": left_tree_filter.get("showLine") is True,
            "list.leftTreeFilter.showLeafIcon": left_tree_filter.get("showLeafIcon") is False,
            "list.leftTreeFilter.blockNode": left_tree_filter.get("blockNode") is True,
            "list.leftTreeFilter.preserveStateOnCollapse": left_tree_filter.get("preserveStateOnCollapse") is True,
            "list.leftTreeFilter.nodeActions": valid_node_actions,
            "list.leftTreeFilter.destructiveActionConfirm": valid_node_actions and ("delete" not in node_actions or left_tree_filter.get("destructiveActionConfirm") is True),
            "list.leftTreeFilter.mobileBreakpoint": left_tree_filter.get("mobileBreakpoint") == 991,
            "list.leftTreeFilter.syncSelectionToUrl": left_tree_filter.get("syncSelectionToUrl") is True,
            "list.leftTreeFilter.resetRowSelectionOnChange": left_tree_filter.get("resetRowSelectionOnChange") is True,
        })
    elif left_tree_filter is not None:
        expected["list.leftTreeFilter"] = False
    errors.extend(f"配置项 {name} 不符合强制值" for name, valid in expected.items() if not valid)

    src = root / "src"
    paths = sorted(src.rglob("*.tsx")) if src.exists() else []
    left_tree_filter_files: list[tuple[Path, str]] = []
    for path in paths:
        content = path.read_text(encoding="utf-8")
        relative = path.relative_to(root)
        if "data-b2b-left-tree-filter" in content:
            left_tree_filter_files.append((path, content))
        if 'layout="vertical"' in content:
            errors.append(f"{relative}：桌面表单禁止使用 layout=\"vertical\"")
        if re.search(r"<SearchPanel\b[^>]*\bfieldCount=", content):
            errors.append(f"{relative}：查询字段数必须由实际子项计算，禁止手工 fieldCount")
        if re.search(r"footer=\{\(_, \{ OkBtn, CancelBtn \}\) => <Space><OkBtn /><CancelBtn /></Space>\}", content):
            errors.append(f"{relative}：弹窗 Footer 必须按取消、确认排列并整体右对齐")
        if re.search(r'<Drawer\b[^>]*extra=\{<Space><Button[^>]*type="primary"[^>]*>(?:保存|确认|提交)', content):
            errors.append(f"{relative}：抽屉提交区应将取消等次要按钮放在主按钮之前")

    if left_tree_filter_files:
        if not isinstance(left_tree_filter, dict):
            errors.append("检测到左侧树筛选实现，但配置缺少 pagePatterns.list.leftTreeFilter")
        for path, content in left_tree_filter_files:
            if "console.log" in content:
                errors.append(f"{path.relative_to(root)}：左侧树操作禁止保留 console.log 占位")
            if re.search(r"from\s+['\"]antd/(?:es|lib)/", content):
                errors.append(f"{path.relative_to(root)}：左侧树必须从 Ant Design 公开根入口导入类型和组件")

    search_panel = src / "shared/ui/ListPage.tsx"
    if search_panel.exists():
        content = search_panel.read_text(encoding="utf-8")
        markers = {
            "Children.toArray(children)": "SearchPanel 必须从实际子项计算字段数",
            "--search-action-row-4": "SearchPanel 缺少宽屏按钮行定位",
            "--search-action-row-2": "SearchPanel 缺少中屏按钮行定位",
            "--search-action-row-1": "SearchPanel 缺少窄屏按钮行定位",
            "SearchOutlined": "查询按钮缺少 SearchOutlined",
            "ReloadOutlined": "重置按钮缺少 ReloadOutlined",
            "DownOutlined": "展开按钮缺少 DownOutlined",
        }
        for marker, message in markers.items():
            if marker not in content:
                errors.append(f"{search_panel.relative_to(root)}：{message}")
        if re.search(r'<Button\s+type="link"[^>]*>\{expanded \? \'收起\' : \'展开\'\}', content):
            errors.append(f"{search_panel.relative_to(root)}：展开／收起必须使用默认描边按钮，不使用 Link Button")

    styles_path = src / "styles.css"
    if styles_path.exists():
        styles = styles_path.read_text(encoding="utf-8")
        if re.search(r"\.page-stack\s*\{[^}]*max-width", styles, re.S):
            errors.append(f"{styles_path.relative_to(root)}：页面内容区必须流式占满可用宽度，禁止为 page-stack 设置固定最大宽度")
        table_toolbar_rule = re.search(r"\.table-toolbar\s*\{([^}]*)\}", styles, re.S)
        if table_toolbar_rule is None:
            errors.append(f"{styles_path.relative_to(root)}：缺少表格顶部工具栏布局规则")
        elif not re.search(r"justify-content\s*:\s*(?:flex-end|space-between)", table_toolbar_rule.group(1)):
            errors.append(f"{styles_path.relative_to(root)}：表格顶部工具栏必须让操作按钮组靠右，不能使用左对齐")

    if table.get("autoMeasureLongContent") is True:
        ellipsis_component = src / "shared/ui/TableEllipsisText.tsx"
        if not ellipsis_component.exists():
            errors.append("缺少按实际溢出状态展示 Tooltip 的 TableEllipsisText 组件")
        else:
            ellipsis_content = ellipsis_component.read_text(encoding="utf-8")
            for marker in ("scrollWidth", "clientWidth", "ResizeObserver", "Tooltip"):
                if marker not in ellipsis_content:
                    errors.append(f"{ellipsis_component.relative_to(root)}：缺少自动溢出判断标记 {marker}")
            if not any("TableEllipsisText" in content for _, content in [(path, path.read_text(encoding="utf-8")) for path in paths if path != ellipsis_component]):
                errors.append("已配置自动长字段省略，但代表性页面未使用 TableEllipsisText")

    if errors:
        print("UI 规范检查失败：")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"UI 规范检查通过：{root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
