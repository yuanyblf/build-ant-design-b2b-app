#!/usr/bin/env python3
"""对 React/Ant Design 页面执行可确定的 B2B 规范检查。"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser(description="检查 B2B 页面是否符合强制规范")
    parser.add_argument("--root", type=Path, required=True, help="待检查的前端项目目录")
    parser.add_argument("--config", type=Path, help="默认读取 <root>/.b2b/b2b-standards.json")
    args = parser.parse_args()
    root = args.root.resolve()
    config_path = (args.config or root / ".b2b/b2b-standards.json").resolve()
    errors: list[str] = []

    try:
        standards = json.loads(config_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"规范检查失败：无法读取配置 {config_path}：{exc}")
        return 1

    conformance = standards.get("conformance") or {}
    form = standards.get("form") or {}
    components = standards.get("components") or {}
    patterns = standards.get("pagePatterns") or {}
    list_pattern = patterns.get("list") or {}
    left_tree_filter = list_pattern.get("leftTreeFilter")
    expected = {
        "conformance.mode": conformance.get("mode") == "strict",
        "conformance.conflictPolicy": conformance.get("conflictPolicy") == "skill-wins",
        "form.layout": form.get("layout") == "horizontal",
        "form.labelWrap": form.get("labelWrap") is False,
        "components.primaryActionPosition": components.get("primaryActionPosition") == "left",
        "pagePatterns.detailEditSurfaceConsistency": patterns.get("detailEditSurfaceConsistency") == "same-within-list",
        "list.queryGridColumns": list_pattern.get("queryGridColumns") == 4,
        "list.collapseThreshold": list_pattern.get("collapseThreshold") == 3,
        "list.queryResponsiveColumns": list_pattern.get("queryResponsiveColumns") == [4, 2, 1],
        "list.queryActionsAlign": list_pattern.get("queryActionsAlign") == "right-center",
        "list.queryActionsStayRowEnd": list_pattern.get("queryActionsStayRowEnd") is True,
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
        for modal in re.findall(r"<Modal\b[^>]*>", content):
            if "onOk=" in modal and "footer=" not in modal:
                errors.append(f"{relative}：Modal 使用 onOk 时必须自定义 footer，确保主操作在左")
        if re.search(r'<Space>\s*<Button(?![^>]*type="primary")[^>]*>取消</Button>\s*<Button[^>]*type="primary"', content):
            errors.append(f"{relative}：按钮组中取消出现在主操作左侧")

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
        }
        for marker, message in markers.items():
            if marker not in content:
                errors.append(f"{search_panel.relative_to(root)}：{message}")

    if errors:
        print("UI 规范检查失败：")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"UI 规范检查通过：{root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
