# 设计规范来源

## 权威来源

CoDesign 项目入口是本 Skill 的在线设计规范总源：

https://codesign.qq.com/app/s/714423819152360

项目名为“后台规范”。2026-08-15 已确认入口可只读访问，包含 8 张设计稿，并支持“设计／标注”视图。以下链接分别对应项目中的 8 个可定位演示页：

1. https://codesign.qq.com/s/714423819152360/714423776438751/presentation
2. https://codesign.qq.com/s/714423819152360/714423777461669/presentation
3. https://codesign.qq.com/s/714423819152360/714423778387638/presentation
4. https://codesign.qq.com/s/714423819152360/714423779338839/presentation
5. https://codesign.qq.com/s/714423819152360/714423780316326/presentation
6. https://codesign.qq.com/s/714423819152360/714423781313690/presentation
7. https://codesign.qq.com/s/714423819152360/714423782415875/presentation
8. https://codesign.qq.com/s/714423819152360/714423783573907/presentation

来源优先级：用户当前任务中的明确要求 > CoDesign 项目入口及当前内容 > 演示页记录 > Skill 默认规范。

## 已确认内容（2026-08-15）

项目入口和 8 个演示页均已读取。页面主题依次为：框架示例、Color、Layout、Typography、Buttons、Dropdown、Toast／Snackbar／Tooltip／Modal、Data tables／表单。

### 框架与布局（第 1、3 页）

首页样例采用：

- 顶部导航 + 左侧分组菜单 + 主内容区的后台框架。
- 浅灰页面背景与白色卡片内容区。
- 蓝色作为主操作、选中菜单和链接强调色。
- 首页包含指标卡、快捷入口、排行榜／列表、图表和动态信息区。
- 左侧菜单支持一级分组、二级菜单和明显的当前项选中状态。
- 指标卡将名称、主数值、辅助说明和快捷操作分层展示。
- 内容通过卡片圆角、留白和弱阴影建立层级，避免使用重边框切割。

- 基础详情页直接平铺需要展示的信息，规范推荐优先采用这种详情展示方式。

### 颜色与字体（第 2、4 页）

- 一级主要文字：`#171A1D`，100%。
- 二级次要文字：`#747677`，100%。
- 三级说明文字：`#A2A3A5`，100%。
- 四级禁用文字：`#C8C8C9`，100%。
- 水印／占位文字：`#F8F8F8`，100%。该值保留为语义规范，不直接映射为正文 Token。
- 一级标题 H1：24px，Regular／Bold。
- 二级标题 H2：18px，Regular／Bold。
- Tab 栏／弹窗标题：16px，Regular／Bold。
- 描述正文：14px，Regular／Bold，用于默认正文、按钮、表格、导航正文和选项卡片。
- 脚注：12px，Regular／Bold，用于备注和次要辅助内容。

### 组件与反馈（第 5～8 页）

- 按钮区分主按钮和次按钮，覆盖默认、悬停、按下、禁用、加载状态；支持纯文字、下拉和前置图标模式。
- 一个模块最多使用一个主按钮；无法判断操作强调级别时，优先使用次按钮。文字按钮用于弱化操作，常见于表格操作列；图标按钮必须保证语义可识别。
- 下拉菜单支持简单列表、多选、分组标题与分割线、图标项和带说明项；悬停项必须有明确反馈。
- Toast 支持纯文字、图标、成功、错误、加载和可关闭模式；需要轻量操作时使用 Snackbar。
- Tooltip 文案最大宽度为 300px，超出后换行，建议不超过两行；可用于展示快捷键提示。
- 表格支持固定右侧操作列和行悬停。内容过长时可使用竖向拖拽分隔线扩展列宽，分隔线的交互颜色与输入框一致。

当前文档只写入页面上能够明确读出的精确值。品牌色、间距、圆角等未明确展示的值继续采用可修改默认值，不声明为 CoDesign 精确值。

## 同步规则

1. 先读取项目入口，核对项目名、设计稿数量和可用视图，再逐份读取演示页；不根据封面或单个示例推断全部规范。
2. 提取颜色、字体、字号、字重、行高、间距、圆角、阴影、布局尺寸、组件状态和交互说明。
3. 将已确认数值同步到项目本地 `.b2b/b2b-standards.json`，并记录来源页码。
4. CoDesign 与 Ant Design Token 无法一一对应时，保留原始语义并选择最接近的公开 Token，不覆盖内部 DOM。
5. 页面暂时不可读取时，保留默认规范并标记为“待同步”，禁止猜测精确数值。
6. 项目入口当前内容与历史演示记录不一致时，以项目入口当前内容为准；无法判断时列为待确认项。

## 建议映射

| 设计概念 | 配置位置 | Ant Design 实现 |
|---|---|---|
| 品牌主色 | `theme.token.colorPrimary` | `ConfigProvider.theme.token.colorPrimary` |
| 成功、警告、错误色 | `theme.token.colorSuccess/colorWarning/colorError` | 同名 Token |
| 基础圆角 | `theme.token.borderRadius` | `borderRadius` |
| 基础字号 | `theme.token.fontSize` | `fontSize` |
| 控件高度 | `theme.token.controlHeight` | `controlHeight` |
| 页面边距 | `product.pageGutter` | 页面布局组件 |
| 侧边栏宽度 | `layout.sidebarWidth` | 应用外壳布局 |
| 表格密度 | `theme.components.Table` | Table 组件 Token |
| 表单间距 | `theme.components.Form` | Form 组件 Token |

同步时保留来源链接、演示稿页码、读取日期和无法映射的条目，避免后续规范修改失去依据。
