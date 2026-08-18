#!/usr/bin/env python3
"""Validate B2B standards and optionally generate Ant Design TypeScript config."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


REQUIRED_SECTIONS = {
    "product",
    "conformance",
    "theme",
    "layout",
    "table",
    "form",
    "feedback",
    "accessibility",
    "typography",
    "components",
    "spacing",
    "border",
    "pagePatterns",
}


def fail(message: str) -> None:
    raise ValueError(message)


def validate_left_tree_filter(left_tree_filter: Any) -> None:
    if not isinstance(left_tree_filter, dict):
        fail("pagePatterns.list.leftTreeFilter must be an object")
    if left_tree_filter.get("applicableTo") != "hierarchical-dimension":
        fail("pagePatterns.list.leftTreeFilter.applicableTo must be hierarchical-dimension")
    panel = left_tree_filter.get("panel")
    if not isinstance(panel, dict):
        fail("pagePatterns.list.leftTreeFilter.panel must be an object")
    for name in ("width", "gap", "paddingBlock", "paddingInline", "borderRadius", "stickyTop", "viewportOffset"):
        value = panel.get(name)
        if isinstance(value, bool) or not isinstance(value, (int, float)) or value <= 0:
            fail(f"pagePatterns.list.leftTreeFilter.panel.{name} must be a positive number")
    if not isinstance(panel.get("boxShadow"), str) or not panel["boxShadow"].strip():
        fail("pagePatterns.list.leftTreeFilter.panel.boxShadow must be a non-empty string")
    if panel.get("sticky") is not True:
        fail("pagePatterns.list.leftTreeFilter.panel.sticky must be true")
    fixed_values = {
        "selectionMode": "single",
        "titleOverflow": "ellipsis-with-tooltip",
        "collapsedTriggerPosition": "content-top-left",
        "mobileLayout": "stack",
    }
    for name, expected in fixed_values.items():
        if left_tree_filter.get(name) != expected:
            fail(f"pagePatterns.list.leftTreeFilter.{name} must be {expected}")
    required_true = (
        "searchable",
        "preserveAncestorPathOnSearch",
        "showLine",
        "blockNode",
        "collapsible",
        "preserveStateOnCollapse",
        "showSelectedStateWhenCollapsed",
        "syncSelectionToUrl",
        "resetRowSelectionOnChange",
    )
    for name in required_true:
        if left_tree_filter.get(name) is not True:
            fail(f"pagePatterns.list.leftTreeFilter.{name} must be true")
    if left_tree_filter.get("showLeafIcon") is not False:
        fail("pagePatterns.list.leftTreeFilter.showLeafIcon must be false")
    if not isinstance(left_tree_filter.get("footerCreateAction"), bool):
        fail("pagePatterns.list.leftTreeFilter.footerCreateAction must be a boolean")
    actions = left_tree_filter.get("nodeActions")
    allowed_actions = ["edit", "add-child", "delete"]
    if (
        not isinstance(actions, list)
        or not all(isinstance(action, str) for action in actions)
        or len(actions) != len(set(actions))
        or any(action not in allowed_actions for action in actions)
        or actions != [action for action in allowed_actions if action in actions]
    ):
        fail("pagePatterns.list.leftTreeFilter.nodeActions must be an ordered unique subset of edit, add-child, delete")
    if not isinstance(left_tree_filter.get("destructiveActionConfirm"), bool):
        fail("pagePatterns.list.leftTreeFilter.destructiveActionConfirm must be a boolean")
    if "delete" in actions and left_tree_filter.get("destructiveActionConfirm") is not True:
        fail("pagePatterns.list.leftTreeFilter.destructiveActionConfirm must be true when delete is enabled")
    if left_tree_filter.get("mobileBreakpoint") != 991:
        fail("pagePatterns.list.leftTreeFilter.mobileBreakpoint must be 991")


def validate(data: dict[str, Any]) -> None:
    if data.get("$schemaVersion") != 1:
        fail("$schemaVersion must be 1")
    missing = sorted(REQUIRED_SECTIONS - data.keys())
    if missing:
        fail(f"missing sections: {', '.join(missing)}")

    conformance = data["conformance"]
    if not isinstance(conformance, dict):
        fail("conformance must be an object")
    if conformance.get("mode") != "strict":
        fail("conformance.mode must be strict")
    if conformance.get("conflictPolicy") != "skill-wins":
        fail("conformance.conflictPolicy must be skill-wins")
    if conformance.get("allowSilentDeviation") is not False:
        fail("conformance.allowSilentDeviation must be false")
    if conformance.get("requireAutomatedCheck") is not True:
        fail("conformance.requireAutomatedCheck must be true")

    source = data.get("designSource")
    if not isinstance(source, dict) or source.get("projectUrl") != "https://codesign.qq.com/app/s/714423819152360":
        fail("designSource.projectUrl must point to the authoritative CoDesign project")

    density = data["product"].get("density")
    if density not in {"small", "middle", "large"}:
        fail("product.density must be small, middle, or large")
    layout = data["form"].get("layout")
    if layout != "horizontal":
        fail("form.layout must be horizontal")
    if data["form"].get("labelWrap") is not False:
        fail("form.labelWrap must be false")

    positive_paths = [
        ("product.contentMaxWidth", data["product"].get("contentMaxWidth")),
        ("product.pageGutter", data["product"].get("pageGutter")),
        ("layout.sidebarWidth", data["layout"].get("sidebarWidth")),
        ("layout.logoWidth", data["layout"].get("logoWidth")),
        ("spacing.unit", data["spacing"].get("unit")),
        ("border.width", data["border"].get("width")),
        ("table.pageSize", data["table"].get("pageSize")),
        ("form.drawerWidth", data["form"].get("drawerWidth")),
        ("form.modalWidth", data["form"].get("modalWidth")),
        ("accessibility.minimumTargetSize", data["accessibility"].get("minimumTargetSize")),
        ("feedback.tooltipMaxWidth", data["feedback"].get("tooltipMaxWidth")),
    ]
    for path, value in positive_paths:
        if not isinstance(value, (int, float)) or value <= 0:
            fail(f"{path} must be a positive number")

    options = data["table"].get("pageSizeOptions")
    if not isinstance(options, list) or not options or not all(isinstance(v, int) and v > 0 for v in options):
        fail("table.pageSizeOptions must be a non-empty list of positive integers")
    if data["table"]["pageSize"] not in options:
        fail("table.pageSize must be included in table.pageSizeOptions")

    token = data["theme"].get("token")
    components = data["theme"].get("components")
    if not isinstance(token, dict) or not isinstance(components, dict):
        fail("theme.token and theme.components must be objects")

    if data["layout"].get("pattern") != "top-app-left-app-menu-content":
        fail("layout.pattern must be top-app-left-app-menu-content")
    if data["layout"].get("topLevelType") != "application":
        fail("layout.topLevelType must be application")
    if data["layout"].get("leftNavigationType") != "application-menu":
        fail("layout.leftNavigationType must be application-menu")
    if data["layout"].get("sidebarTitleContent") != "none":
        fail("layout.sidebarTitleContent must be none")
    if data["layout"].get("navigationMaxDepth") != 2:
        fail("layout.navigationMaxDepth must be 2")
    if data["layout"].get("applicationOverflowMode") != "categorized-hover-card":
        fail("layout.applicationOverflowMode must be categorized-hover-card")
    if data["layout"].get("applicationCardTrigger") != "hover":
        fail("layout.applicationCardTrigger must be hover")
    if not isinstance(data["layout"].get("applicationDirectVisibleMax"), int) or data["layout"]["applicationDirectVisibleMax"] < 1:
        fail("layout.applicationDirectVisibleMax must be a positive integer")
    if data["layout"].get("switchApplicationLoadsDefaultPage") is not True:
        fail("layout.switchApplicationLoadsDefaultPage must be true")
    if data["layout"].get("menuIconsRequired") is not True:
        fail("layout.menuIconsRequired must be true")

    for name, spec in data["typography"].items():
        if not isinstance(spec, dict) or not isinstance(spec.get("fontSize"), (int, float)) or spec["fontSize"] <= 0:
            fail(f"typography.{name}.fontSize must be a positive number")
        weights = spec.get("fontWeights")
        if not isinstance(weights, list) or not weights:
            fail(f"typography.{name}.fontWeights must be a non-empty list")

    max_lines = data["feedback"].get("tooltipRecommendedMaxLines")
    if not isinstance(max_lines, int) or max_lines <= 0:
        fail("feedback.tooltipRecommendedMaxLines must be a positive integer")

    if data["components"].get("primaryButtonMaxPerModule") != 1:
        fail("components.primaryButtonMaxPerModule must be 1")
    if data["components"].get("primaryActionPosition") != "left":
        fail("components.primaryActionPosition must be left")
    if data["components"].get("buttonFallbackEmphasis") != "secondary":
        fail("components.buttonFallbackEmphasis must be secondary")

    patterns = data["pagePatterns"]
    if patterns.get("menuDefaultTarget") != "list":
        fail("pagePatterns.menuDefaultTarget must be list")
    required_capabilities = {"query", "create", "detail", "rowActions", "batchActions"}
    if set(patterns.get("listCapabilities", [])) != required_capabilities:
        fail("pagePatterns.listCapabilities must contain query, create, detail, rowActions, and batchActions")
    list_pattern = patterns.get("list")
    if not isinstance(list_pattern, dict):
        fail("pagePatterns.list must be an object")
    if list_pattern.get("sections") != ["query", "table"]:
        fail("pagePatterns.list.sections must be query followed by table")
    if list_pattern.get("pageOrder") != ["breadcrumb", "title", "query", "table"]:
        fail("pagePatterns.list.pageOrder must be breadcrumb, title, query, table")
    if list_pattern.get("breadcrumbSeparator") != ">":
        fail("pagePatterns.list.breadcrumbSeparator must be >")
    if list_pattern.get("queryButtons") != ["查询", "重置"]:
        fail("pagePatterns.list.queryButtons must be 查询 followed by 重置")
    if list_pattern.get("queryGridColumns") != 4:
        fail("pagePatterns.list.queryGridColumns must be 4")
    if list_pattern.get("queryActionSlots") != 1:
        fail("pagePatterns.list.queryActionSlots must be 1")
    collapse_threshold = list_pattern.get("collapseThreshold")
    if collapse_threshold != 3:
        fail("pagePatterns.list.collapseThreshold must be 3 when buttons occupy one of four columns")
    if list_pattern.get("queryItemLayout") != "label-control-inline":
        fail("pagePatterns.list.queryItemLayout must be label-control-inline")
    label_width = list_pattern.get("queryLabelWidth")
    if not isinstance(label_width, int) or label_width <= 0:
        fail("pagePatterns.list.queryLabelWidth must be a positive integer")
    if list_pattern.get("queryLabelWrap") is not False:
        fail("pagePatterns.list.queryLabelWrap must be false")
    if list_pattern.get("queryControlWidth") != "fill":
        fail("pagePatterns.list.queryControlWidth must be fill")
    if list_pattern.get("queryActionsAlign") != "right-center":
        fail("pagePatterns.list.queryActionsAlign must be right-center")
    if list_pattern.get("queryResponsiveColumns") != [4, 2, 1]:
        fail("pagePatterns.list.queryResponsiveColumns must be [4, 2, 1]")
    if list_pattern.get("queryActionsStayRowEnd") is not True:
        fail("pagePatterns.list.queryActionsStayRowEnd must be true")
    if list_pattern.get("showTableTitle") is not False:
        fail("pagePatterns.list.showTableTitle must be false")
    if list_pattern.get("tableActionsPosition") != "header-left":
        fail("pagePatterns.list.tableActionsPosition must be header-left")
    if list_pattern.get("queryOrder") not in {"table-column-order", "custom"}:
        fail("pagePatterns.list.queryOrder must be table-column-order or custom")
    if list_pattern.get("requiredHint") != "tooltip-on-query":
        fail("pagePatterns.list.requiredHint must be tooltip-on-query")
    if list_pattern.get("longContent") not in {"show-all-unless-specified", "ellipsis-with-tooltip"}:
        fail("pagePatterns.list.longContent has an unsupported value")
    left_tree_filter = list_pattern.get("leftTreeFilter")
    if left_tree_filter is not None:
        validate_left_tree_filter(left_tree_filter)
    if patterns.get("formTypes") != ["basic", "step", "advanced"]:
        fail("pagePatterns.formTypes must contain basic, step, and advanced")
    if patterns.get("formItemLayout") != "label-control-inline":
        fail("pagePatterns.formItemLayout must be label-control-inline")
    form_label_width = patterns.get("formLabelWidth")
    if not isinstance(form_label_width, int) or form_label_width <= 0:
        fail("pagePatterns.formLabelWidth must be a positive integer")
    if patterns.get("formLabelWrap") is not False:
        fail("pagePatterns.formLabelWrap must be false")
    if patterns.get("formControlWidth") != "fill":
        fail("pagePatterns.formControlWidth must be fill")
    if patterns.get("formNarrowLayout") != "vertical":
        fail("pagePatterns.formNarrowLayout must be vertical")
    if patterns.get("detailTypes") != ["basic", "advanced"]:
        fail("pagePatterns.detailTypes must contain basic and advanced")
    if patterns.get("detailEditSurfaceConsistency") != "same-within-list":
        fail("pagePatterns.detailEditSurfaceConsistency must be same-within-list")
    if patterns.get("surfaceConflictResolution") != "escalate-to-more-complex":
        fail("pagePatterns.surfaceConflictResolution must be escalate-to-more-complex")
    if patterns.get("surfacePriority") != ["modal", "drawer", "page"]:
        fail("pagePatterns.surfacePriority must be modal, drawer, page")
    detail_columns = patterns.get("detailColumns")
    if not isinstance(detail_columns, int) or detail_columns not in {1, 2, 3}:
        fail("pagePatterns.detailColumns must be 1, 2, or 3")
    if patterns.get("advancedDetailBreadcrumbSeparateRow") is not True:
        fail("pagePatterns.advancedDetailBreadcrumbSeparateRow must be true")
    if patterns.get("advancedDetailActionsInlineWithTitle") is not True:
        fail("pagePatterns.advancedDetailActionsInlineWithTitle must be true")
    if patterns.get("advancedDetailPrimaryActionPosition") != "left":
        fail("pagePatterns.advancedDetailPrimaryActionPosition must be left")
    cards = patterns.get("cards")
    if not isinstance(cards, dict):
        fail("pagePatterns.cards must be an object")
    if cards.get("density") != "compact":
        fail("pagePatterns.cards.density must be compact")
    if cards.get("mediaRatio") != 2 or cards.get("contentRatio") != 1:
        fail("pagePatterns.cards media/content ratio must be 2:1")
    if cards.get("dataCardLayout") != "data-left-icon-right":
        fail("pagePatterns.cards.dataCardLayout must be data-left-icon-right")
    if cards.get("dataTitleFontSize") != 14:
        fail("pagePatterns.cards.dataTitleFontSize must be 14")
    if cards.get("dataValueFontSize") != 24:
        fail("pagePatterns.cards.dataValueFontSize must be 24")
    if cards.get("dataValueFontWeight") != "regular":
        fail("pagePatterns.cards.dataValueFontWeight must be regular")
    if cards.get("titleWrap") is not False:
        fail("pagePatterns.cards.titleWrap must be false")
    if cards.get("summaryMaxLines") != 2:
        fail("pagePatterns.cards.summaryMaxLines must be 2")
    modal = patterns.get("modal")
    if not isinstance(modal, dict):
        fail("pagePatterns.modal must be an object")
    if modal.get("confirmOnLeft") is not True:
        fail("pagePatterns.modal.confirmOnLeft must be true")
    if not isinstance(modal.get("cancelText"), str) or not modal.get("cancelText"):
        fail("pagePatterns.modal.cancelText must be a non-empty string")
    if not isinstance(modal.get("confirmText"), str) or not modal.get("confirmText"):
        fail("pagePatterns.modal.confirmText must be a non-empty string")
    for surface_name in ("createEditSurface", "detailSurface"):
        surface = patterns.get(surface_name)
        if not isinstance(surface, dict):
            fail(f"pagePatterns.{surface_name} must be an object")
        modal_max = surface.get("modalMaxFields")
        drawer_max = surface.get("drawerMaxFields")
        if not isinstance(modal_max, int) or modal_max <= 0:
            fail(f"pagePatterns.{surface_name}.modalMaxFields must be a positive integer")
        if not isinstance(drawer_max, int) or drawer_max <= modal_max:
            fail(f"pagePatterns.{surface_name}.drawerMaxFields must be greater than modalMaxFields")


def ts_literal(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, indent=2)


def generate(data: dict[str, Any], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    theme = {
        "token": data["theme"]["token"],
        "components": data["theme"]["components"],
    }
    (out_dir / "antd-theme.generated.ts").write_text(
        "// Generated by apply_standards.py. Do not edit.\n"
        "import type { ThemeConfig } from 'antd';\n\n"
        f"export const antdTheme = {ts_literal(theme)} satisfies ThemeConfig;\n",
        encoding="utf-8",
    )
    (out_dir / "b2b-standards.generated.ts").write_text(
        "// Generated by apply_standards.py. Do not edit.\n"
        f"export const b2bStandards = {ts_literal(data)} as const;\n",
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--out-dir", type=Path)
    args = parser.parse_args()

    try:
        data = json.loads(args.config.read_text(encoding="utf-8"))
        if not isinstance(data, dict):
            fail("root must be an object")
        validate(data)
        if args.out_dir:
            generate(data, args.out_dir)
    except (OSError, json.JSONDecodeError, ValueError) as exc:
        parser.error(str(exc))

    action = "validated and generated" if args.out_dir else "validated"
    print(f"Standards {action}: {args.config}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
