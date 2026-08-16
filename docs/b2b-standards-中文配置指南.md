# b2b-standards.json 中文配置指南

## 这份文件控制什么

`.b2b/b2b-standards.json` 是项目的统一设计规范配置。产品经理或设计负责人可以通过它调整布局、颜色、字号、表格、表单和反馈规则，不需要逐页修改组件代码。

修改时只改 JSON 中冒号右侧的值，不要删除字段名、逗号或双引号。尺寸单位统一为像素，但 JSON 中只填写数字，例如 `224`，不要写成 `"224px"`。

设计规范总源为 `designSource.projectUrl` 指向的 CoDesign“后台规范”项目。该地址用于核对当前版本；`urls` 中其余链接用于定位具体演示页。不要自行删除或替换总源地址。

## 修改布局

标准骨架固定为：顶部通栏中左侧 Logo、中间为应用切换区、右侧当前用户；主体左侧为当前应用的应用菜单（最多两级），右侧为功能区。切换应用时，左侧菜单和应用默认页自动切换。应用较多时由“全部应用”入口收缩，并在分类悬浮卡片中展示。该结构直接使用 Ant Design `Layout`、`Menu` 和 `Popover`。

布局尺寸由 `product`、`layout` 和 `theme.components.Layout` 三个区域共同控制：

```json
{
  "product": {
    "contentMaxWidth": 1440,
    "pageGutter": 24,
    "pageGutterCompact": 16
  },
  "theme": {
    "components": {
      "Layout": { "headerHeight": 56 }
    }
  },
  "layout": {
    "pattern": "top-app-left-app-menu-content",
    "topLevelType": "application",
    "leftNavigationType": "application-menu",
    "sidebarTitleContent": "none",
    "navigationMaxDepth": 2,
    "applicationDirectVisibleMax": 4,
    "applicationOverflowMode": "categorized-hover-card",
    "applicationCardTrigger": "hover",
    "switchApplicationLoadsDefaultPage": true,
    "menuIconsRequired": true,
    "logoWidth": 224,
    "sidebarWidth": 224,
    "sidebarCollapsedWidth": 64,
    "stickyPageHeader": false,
    "breadcrumb": true
  }
}
```

| 配置项 | 中文含义 | 当前值 | 推荐范围 | 修改效果 |
|---|---|---:|---:|---|
| `product.contentMaxWidth` | 主内容最大宽度 | 1440 | 1200～1600 | 大屏时限制内容区域宽度 |
| `product.pageGutter` | 桌面端页面边距 | 24 | 16～32 | 控制内容与页面边缘的距离 |
| `product.pageGutterCompact` | 窄屏页面边距 | 16 | 12～20 | 控制平板和手机页面边距 |
| `theme.components.Layout.headerHeight` | 顶部导航高度 | 56 | 48～64 | 控制顶部栏和左侧品牌区高度 |
| `layout.pattern` | 固定应用骨架 | `top-app-left-app-menu-content` | 不修改 | 顶部应用、左侧应用菜单、右侧功能区 |
| `layout.topLevelType` | 顶层对象类型 | `application` | 不修改 | 明确顶部切换的是应用，不是菜单层级 |
| `layout.leftNavigationType` | 左侧导航类型 | `application-menu` | 不修改 | 左侧只展示当前应用的菜单 |
| `layout.sidebarTitleContent` | 左侧栏标题内容 | `none` | 不修改 | 不显示标题区，应用菜单从侧栏顶部直接开始 |
| `layout.navigationMaxDepth` | 应用菜单最大层级 | 2 | 不修改 | 左侧应用菜单最多两级 |
| `layout.applicationDirectVisibleMax` | 顶部直显应用数 | 4 | 3～6 | 超出的应用收进全部应用卡片 |
| `layout.applicationOverflowMode` | 多应用收缩方式 | `categorized-hover-card` | 不修改 | 按分类用悬浮卡片展示全部应用 |
| `layout.applicationCardTrigger` | 应用卡片主要触发方式 | `hover` | 不修改 | 鼠标悬浮“全部应用”打开卡片，同时保留点击能力以兼容触控和键盘 |
| `layout.switchApplicationLoadsDefaultPage` | 切换应用后进入默认页 | true | 不修改 | 同步更新左侧菜单和默认页面 |
| `layout.menuIconsRequired` | 菜单是否必须配置图标 | true | 不修改 | 顶部和左侧所有菜单项均展示语义图标 |
| `layout.logoWidth` | 顶部 Logo 区宽度 | 224 | 200～256 | 控制 Logo 区域及右侧用户区对称宽度 |
| `layout.sidebarWidth` | 左侧导航展开宽度 | 224 | 200～256 | 控制展开后的菜单宽度 |
| `layout.sidebarCollapsedWidth` | 左侧导航收起宽度 | 64 | 56～80 | 控制只显示图标时的宽度 |
| `layout.stickyPageHeader` | 页面标题是否吸顶 | false | true／false | 供页面框架决定标题滚动行为 |
| `layout.breadcrumb` | 是否显示面包屑 | true | true／false | 供页面框架决定是否显示路径导航 |

### 示例一：做成更紧凑的后台

```json
"product": {
  "locale": "zh-CN",
  "density": "small",
  "contentMaxWidth": 1280,
  "pageGutter": 16,
  "pageGutterCompact": 12
},
"layout": {
  "pattern": "top-app-left-app-menu-content",
  "navigationMaxDepth": 2,
  "applicationDirectVisibleMax": 3,
  "logoWidth": 200,
  "sidebarWidth": 200,
  "sidebarCollapsedWidth": 56,
  "stickyPageHeader": true,
  "breadcrumb": true
}
```

同时将顶部高度改为：

```json
"Layout": { "headerHeight": 48 }
```

### 示例二：做成适合大屏的宽松布局

```json
"product": {
  "locale": "zh-CN",
  "density": "large",
  "contentMaxWidth": 1600,
  "pageGutter": 32,
  "pageGutterCompact": 20
},
"layout": {
  "pattern": "top-app-left-app-menu-content",
  "navigationMaxDepth": 2,
  "applicationDirectVisibleMax": 5,
  "logoWidth": 256,
  "sidebarWidth": 256,
  "sidebarCollapsedWidth": 72,
  "stickyPageHeader": false,
  "breadcrumb": true
}
```

## 修改颜色与圆角

修改 `theme.token`：

```json
"theme": {
  "token": {
    "colorPrimary": "#1677ff",
    "colorSuccess": "#52c41a",
    "colorWarning": "#faad14",
    "colorError": "#ff4d4f",
    "colorText": "#171A1D",
    "colorTextSecondary": "#747677",
    "borderRadius": 6,
    "controlHeight": 32
  }
}
```

- `colorPrimary`：主按钮、选中项和链接的品牌色。
- `colorSuccess`／`colorWarning`／`colorError`：成功、警告、错误状态色。
- `colorText`：主要正文颜色。
- `colorTextSecondary`：辅助说明文字颜色。
- `borderRadius`：按钮、输入框、卡片等基础圆角。
- `controlHeight`：输入框、按钮等基础控件高度。

## 修改间距与边框

业务间距使用统一的 4px 基数，组件和页面优先读取以下语义值：

```json
"spacing": {
  "unit": 4,
  "xs": 4,
  "sm": 8,
  "md": 16,
  "lg": 24,
  "xl": 32
},
"border": {
  "color": "#E8E9EB",
  "width": 1,
  "style": "solid"
}
```

例如希望分割线更深，可将 `border.color` 改为 `#D9DADD`。通常不建议把 `border.width` 改成 2 以上，以免后台界面显得过重。

## 自定义 Ant Design 组件

组件外观集中在 `theme.components`，字段直接映射 Ant Design 公开的组件 Token：

```json
"components": {
  "Layout": {
    "headerBg": "#FFFFFF",
    "siderBg": "#FFFFFF",
    "bodyBg": "#F5F6F8",
    "headerHeight": 56
  },
  "Menu": {
    "itemHeight": 40,
    "itemBorderRadius": 6,
    "itemMarginInline": 8
  },
  "Table": {
    "cellPaddingBlock": 12,
    "cellPaddingInline": 12
  },
  "Button": { "paddingInline": 15 },
  "Card": { "paddingLG": 24 }
}
```

- 菜单更紧凑：减小 `Menu.itemHeight` 和 `Menu.itemMarginInline`。
- 表格更紧凑：减小 `Table.cellPaddingBlock`。
- 卡片留白更大：增大 `Card.paddingLG`。
- 按钮左右更宽：增大 `Button.paddingInline`。

只使用 Ant Design 当前版本公开的组件 Token；不要通过覆盖内部类名修改组件。

按钮强调规则位于顶层 `components`：

```json
"components": {
  "primaryButtonMaxPerModule": 1,
  "primaryActionPosition": "left",
  "buttonFallbackEmphasis": "secondary"
}
```

表示每个模块最多出现一个主按钮；无法判断按钮强调级别时使用次按钮。该规则来自 CoDesign 按钮规范，不建议在项目中修改。

## 修改字号

`theme.token.fontSize` 是 Ant Design 的基础字号；`typography` 定义业务语义字号：

```json
"typography": {
  "h1": { "fontSize": 24, "fontWeights": ["regular", "bold"] },
  "h2": { "fontSize": 18, "fontWeights": ["regular", "bold"] },
  "modalAndTab": { "fontSize": 16, "fontWeights": ["regular", "bold"] },
  "description": { "fontSize": 14, "fontWeights": ["regular", "bold"] },
  "footnote": { "fontSize": 12, "fontWeights": ["regular", "bold"] }
}
```

如果把一级标题从 24px 改为 28px，只修改：

```json
"h1": { "fontSize": 28, "fontWeights": ["regular", "bold"] }
```

## 修改表格

```json
"table": {
  "pageSize": 20,
  "pageSizeOptions": [10, 20, 50, 100],
  "showSizeChanger": true,
  "stickyHeader": true,
  "actionsMaxVisible": 3,
  "fixedActionColumn": true,
  "emptyText": "暂无数据"
}
```

- 默认每页显示 50 条：将 `pageSize` 改为 `50`，并确保 `pageSizeOptions` 中包含 `50`。
- 不允许用户修改每页数量：将 `showSizeChanger` 改为 `false`。
- 行内最多直接显示两个操作：将 `actionsMaxVisible` 改为 `2`，其余操作应收进“更多”。
- 不固定操作列：将 `fixedActionColumn` 改为 `false`。

## 修改列表页和弹窗／抽屉判断

默认交互为“菜单进入列表页”，列表页统一承载查询、新增、详情、行操作和批量操作：

```json
"pagePatterns": {
  "menuDefaultTarget": "list",
  "listCapabilities": ["query", "create", "detail", "rowActions", "batchActions"],
  "createEditSurface": {
    "modalMaxFields": 6,
    "drawerMaxFields": 16,
    "complexContentEscalates": true
  },
  "detailSurface": {
    "modalMaxFields": 8,
    "drawerMaxFields": 20,
    "complexContentEscalates": true
  },
  "preserveListContext": true
}
```

新增／编辑默认判断：

- 1～6 个简单字段：弹窗。
- 7～16 个字段：抽屉。
- 超过 16 个字段：独立页面。

详情默认判断：

- 1～8 个简单展示字段：弹窗。
- 9～20 个字段：抽屉。
- 超过 20 个字段：独立页面。

字段数量不是唯一标准。包含长文本、附件上传、动态字段、子表、复杂关联、状态流转或高风险提交时，必须至少提升一级。例如只有 5 个字段但包含多个附件和动态明细，也应使用抽屉而不是弹窗。

`preserveListContext` 为 `true` 表示关闭新增、编辑或详情后，应保留列表的筛选、排序、分页和合理的滚动位置。

### 修改列表、表单、详情和弹窗规范

这些业务页面规则集中在 `pagePatterns`，默认值如下：

```json
"list": {
  "sections": ["query", "table"],
  "pageOrder": ["breadcrumb", "title", "query", "table"],
  "breadcrumbSeparator": ">",
  "titleSubtitleInline": true,
  "queryLabelControlLayout": true,
  "queryButtons": ["查询", "重置"],
  "queryGridColumns": 4,
  "queryActionSlots": 1,
  "collapseThreshold": 3,
  "showTableTitle": false,
  "tableActionsPosition": "header-left",
  "queryOrder": "table-column-order",
  "dateRangeDefault": true,
  "dateRangeRequired": false,
  "requiredHint": "tooltip-on-query",
  "linkNavigableContent": true,
  "longContent": "show-all-unless-specified"
},
"formTypes": ["basic", "step", "advanced"],
"advancedFormStickyFooter": true,
"detailTypes": ["basic", "advanced"],
"detailColumns": 3,
"advancedDetailHeader": true,
"advancedDetailBreadcrumbSeparateRow": true,
"advancedDetailActionsInlineWithTitle": true,
"advancedDetailPrimaryActionPosition": "left",
"cards": {
  "density": "compact",
  "mediaRatio": 2,
  "contentRatio": 1,
  "dataCardLayout": "data-left-icon-right",
  "dataTitleFontSize": 14,
  "dataValueFontSize": 24,
  "dataValueFontWeight": "regular",
  "titleWrap": false,
  "summaryMaxLines": 2
},
"modal": {
  "requiredMark": true,
  "fieldHelpRequired": true,
  "cancelText": "取消",
  "confirmText": "确认",
  "confirmOnLeft": true
}
```

- `list.sections`：固定为上方查询、下方表格。
- `list.pageOrder`：列表页从上到下固定为面包屑、标题、查询、表格。
- `list.breadcrumbSeparator`：面包屑分隔符，默认 `>`。
- `list.titleSubtitleInline`：标题和副标题同行展示。
- `list.queryLabelControlLayout`：查询项使用“字段名称 + 输入控件”。
- `list.queryButtons`：查询区按钮及顺序，默认“查询”“重置”。
- `list.queryGridColumns`：桌面端查询区每行最多 4 项。
- `list.queryActionSlots`：按钮组占用 1 项。
- `list.collapseThreshold`：默认收起时最多展示 3 个查询字段，剩余第 4 项留给按钮组；超过 3 个查询字段时出现“展开／收起”。
- `list.showTableTitle`：列表页表格区不展示独立标题。
- `list.tableActionsPosition`：表格级操作位于表格上方左侧，并与第一列表头左边界对齐。
- `list.queryOrder`：默认按表格列顺序排列查询项；特殊场景可改成 `custom`，并在需求中列明顺序。
- `list.dateRangeDefault`：日期起止默认使用范围选择器。
- `list.dateRangeRequired`：默认 `false`，表示开始和结束都非必填。
- `list.requiredHint`：必填查询项为空时，点击查询后使用 Tooltip 提示，不显示星号。
- `list.linkNavigableContent`：可跳转内容使用链接形式。
- `list.longContent`：默认完整展示；需要统一截断时可改为 `ellipsis-with-tooltip`。
- `advancedFormStickyFooter`：高级表单操作区是否吸底。
- `detailColumns`：详情字段桌面端每行列数，可配置为 1、2 或 3，默认 3。
- `advancedDetailHeader`：高级详情是否使用突出状态、金额和操作的统一 Header。
- `advancedDetailBreadcrumbSeparateRow`：高级详情面包屑单独占一行。
- `advancedDetailActionsInlineWithTitle`：高级详情操作按钮与标题同行，默认标题在左、操作在右。
- `advancedDetailPrimaryActionPosition`：操作按钮组内主操作位于最左侧，次操作依次向右排列。
- `cards.density`：卡片默认使用紧凑密度。
- `cards.mediaRatio`／`contentRatio`：图文卡片的图片与文字高度比例，默认 2:1。
- `cards.dataCardLayout`：数据卡片采用左侧小标题与突出数据、右侧 Logo／图标的结构。
- `cards.dataTitleFontSize`：数据卡片标题字号，默认 14px。
- `cards.dataValueFontSize`：数据卡片数字字号，默认 24px。
- `cards.dataValueFontWeight`：数据卡片数字使用常规字重 `regular`，不加粗。
- `cards.titleWrap`：`false` 表示标题不换行，超长使用省略号和完整标题提示。
- `cards.summaryMaxLines`：图文卡片摘要最多展示两行，超出后省略。
- `modal`：控制弹窗必填标识、字段说明以及“取消／确认”按钮文案和顺序。
- `components.primaryActionPosition`：所有按钮组的主操作统一位于最左侧。
- `modal.confirmOnLeft`：弹窗与确认气泡的确认按钮位于取消按钮左侧。

字段级的默认值、数据源、组件格式、单选／多选、校验和联动属于业务需求，不应写成全局 JSON。产品经理应在字段清单中逐项说明；Skill 会按统一页面规则实现。

## 修改表单和弹窗

```json
"form": {
  "layout": "vertical",
  "validateTrigger": "onBlur",
  "drawerWidth": 560,
  "modalWidth": 640,
  "unsavedChangesGuard": true
}
```

- `layout` 可选 `vertical`、`horizontal`、`inline`。
- `validateTrigger` 为 `onBlur` 时，离开字段后校验；改为 `onChange` 时输入过程中校验。
- `drawerWidth` 和 `modalWidth` 分别控制抽屉与弹窗默认宽度。
- `unsavedChangesGuard` 控制未保存离开提醒是否必须实现。

## 修改反馈规则

```json
"feedback": {
  "successDurationSeconds": 3,
  "errorDurationSeconds": 5,
  "confirmDestructiveActions": true,
  "tooltipMaxWidth": 300,
  "tooltipRecommendedMaxLines": 2
}
```

危险操作不需要确认通常不建议；如确有需要，将 `confirmDestructiveActions` 改为 `false`。Tooltip 的 CoDesign 标准为最大宽度 300px，建议不超过两行。

## 让修改生效

在项目目录执行：

```bash
python3 scripts/apply_standards.py \
  --config examples/demo/.b2b/b2b-standards.json \
  --check

python3 scripts/apply_standards.py \
  --config examples/demo/.b2b/b2b-standards.json \
  --out-dir examples/demo/src/shared/design-system/generated
```

如果开发服务正在运行，保存后通常会自动刷新；否则重新执行 `npm run dev`。

## 注意事项

1. 不要直接修改 `examples/demo/src/shared/design-system/generated`，下次生成时会被覆盖。
2. 修改 JSON 后先运行 `--check`，确认格式和取值合法。
3. 不是所有行为配置都会自动变成样式；业务组件需要读取相应配置。这个 Demo 已接入主题 Token、组件 Token、顶部高度、Logo 宽度、侧栏宽度、边框、内容最大宽度和页面边距。
4. 新增配置字段时，需要同步更新校验脚本和消费该字段的页面组件。
