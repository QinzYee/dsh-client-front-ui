# dsh-client-front-ui

[English](README.md) | 中文

**界面美化（Client Front UI）** —— 将字体控制、工作区拓展与插件边栏整合为单一 DSH Web 扩展插件。

[![version](https://img.shields.io/badge/version-0.3.0-blue.svg)](#更新日志)
[![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.2-green.svg)](#兼容性与技术实现)
[![platform](https://img.shields.io/badge/platform-DSH%20Web-lightgrey.svg)](#兼容性与技术实现)

---

## 简介

`dsh-client-front-ui` 将原有的三个独立 DSH Web 插件——**字体控制**、**会话侧栏拓展**与**插件边栏**——合并为单一扩展包。安装后，插件列表仅保留一张卡片，左侧图标栏仅新增一个统一入口，点击即可在单个配置页中独立启停、折叠管理三大界面增强模块。

- **包名**：`dsh-client-front-ui`
- **Loader 标识**：`client-front-ui`
- **插件名称**：界面美化 / Client Front UI
- **适用平台**：DSH Web（已于 `desktop` profile 验证）

---

## 目录

- [核心特性](#核心特性)
- [安装](#安装)
- [快速上手](#快速上手)
- [从旧版本插件迁移](#从旧版本插件迁移)
- [配置与数据持久化](#配置与数据持久化)
- [兼容性与技术实现](#兼容性与技术实现)
- [已知限制](#已知限制)
- [常见问题 (FAQ)](#常见问题-faq)
- [更新日志](#更新日志)
- [许可证](#许可证)

---

## 核心特性

### 1. 字体控制（Font Controller）

为 DSH 的界面、代码与终端分别指定中文字体与西文字体。

- **官方角色映射**：直接对接 `textFontFamily`（界面与对话）、`codeFontFamily`（代码）与 `terminalFontFamily`（终端），写入 `ui-theme` 命名空间，与 **设置 → 通用 → 字体** 实时双向同步。
- **内置字体库**：内置 69 款常用中英文字体，支持关键字检索、仅显示已安装字体、行内展开预览及键盘快捷选择。
- **智能状态提示**：允许选择本机未安装的字体（便于跨设备同步配置），并在列表底部明确提示缺失字体；支持单行重置与一键恢复默认。
- **独立生命周期**：关闭模块开关仅隐藏配置面板，已生效的字体配置仍保留在 `ui-theme` 中；点击 **恢复默认并停用** 可清空字体设置并停用整个插件。

### 2. 工作区拓展（Workspace Extended）

将默认会话侧栏重构为 **最近 / 工作区 / 聊天** 三段式结构，提升多项目会话管理效率。

- **无损接管机制**：以 `priority: -1` 接管 `sidebar.workspaces` 插槽；停用模块或插件即可无缝还原官方侧栏。
- **三段式结构**：
  - **最近**：跨工作区的全局最近会话索引（默认展示 4 条，支持分批展开）。
  - **工作区**：按组内最近活跃度排序（默认每组展示 5 条，支持分批展开与整组折叠）。
  - **聊天**：收纳未归属任何工作区的独立会话；首次启用时自动创建并注册 `~/.dsh/chats` 作为默认聊天工作区（可在「聊天」标题右侧 `…` 菜单中更改路径）。
- **完整交互保留**：完整保留右键菜单、全局搜索、排序与筛选、悬停信息卡片、长按拖拽排序，以及输入框旁的「聊天」快捷切换按钮，所有子功能均可在设置面板中单独开关。

### 3. 插件边栏（Plugin Rail）

将分散在侧栏中的全局功能入口收敛至左侧垂直图标栏，释放侧栏垂直空间。

- **40×40 窄图标栏**：将「插件」「自动化任务」及所有注册至 `sidebar.panellist` 的全局面板以 40×40 图标按钮垂直排列。
- **布局优化**：隐藏原顶部品牌行，将 **新会话** 按钮上移至首行；点击品牌鲸鱼图标返回会话（悬停显示首页图标），账户入口固定于图标栏底部。
- **样式隔离**：所有样式规则均挂载于 `html[data-client-front-ui='on']` 选择器下，停用后自动移除属性并还原官方布局。该模块无需额外参数配置，仅提供启用开关。

---

## 安装

本仓库根目录即为插件包根目录（包含 `package.json`、`cordis.patch.yml` 与预构建产物 `client.js`）。使用方无需本地安装 Node.js 或 pnpm，DSH Host 会自动调用内置的 pnpm 完成安装。

### 方式一：通过 npm 安装（推荐）

```bash
dsh plugin --profile desktop add dsh-client-front-ui
# 或指定版本
dsh plugin --profile desktop add dsh-client-front-ui@0.3.0
```

### 方式二：通过 GitHub 仓库安装

```bash
# 请将 <owner> 替换为实际仓库所有者
dsh plugin --profile desktop add git+https://github.com/<owner>/dsh-client-front-ui.git
```

### 方式三：从本地目录或 `.tgz` 包安装

```bash
# 从本地源码目录安装
dsh plugin --profile desktop add file:/绝对路径/dsh-client-front-ui

# 从打包好的 tgz 归档安装
dsh plugin --profile desktop add file:/绝对路径/dsh-client-front-ui-0.3.0.tgz
```

> **图形界面安装**：你也可以在 DSH Web 中前往 **插件 → 添加插件**，直接输入 npm 包名、Git 仓库 URL、`.tgz` 路径或本地文件夹绝对路径（Windows 下可直接填写如 `F:\plugins\client-front-ui`）。
>
> **提示**：首次为运行中的 Host 添加 Loader 行时，若刷新页面后未生效，请重启 DSH 服务。

---

## 快速上手

1. 前往 **插件 → 已安装插件**，找到 **界面美化** 并开启。
2. 刷新页面后，点击左侧图标栏新增的 **滑杆图标**（或直接进入插件详情页）打开配置面板。
3. 通过各模块标题栏右侧的控件进行管理：
   - **启用开关**：控制该模块功能的开启与关闭。
   - **折叠箭头**：展开或收起该模块的配置项，不影响模块运行状态（无独立配置项的模块仅显示开关）。

| 界面位置 | 变化说明 |
| --- | --- |
| **插件管理页** | 合并为单张卡片：**界面美化** |
| **左侧图标栏** | 新增滑杆配置入口（保留官方「插件」「自动化任务」入口） |
| **配置详情页** | 左侧图标栏入口与插件详情页共享同一套三模块配置界面 |

---

## 从旧版本插件迁移

如果你此前安装过拆分版本的三个独立插件（`font-controller`、`dsh-plugin-sidebar`、`dsh-session-sidebar-extended`），请按以下步骤平滑迁移：

1. 在插件页停用并卸载上述三个旧插件（或从 profile 的 `dsh.profile.bundles` 与依赖列表中移除）。
2. 按照 [安装](#安装) 章节的步骤安装 `dsh-client-front-ui`。
3. 启用新插件并刷新页面。

> **数据无损继承**：合并后的插件沿用原有的存储键名，你此前配置的字体偏好（`ui-theme`）与工作区开关状态（`dswb.features.v1`）将自动继承，无需重新配置。请勿将新旧插件同时启用，以免产生插槽冲突。

---

## 配置与数据持久化

本插件所有状态均保存在本地浏览器或当前 DSH Profile 中，不会向任何外部服务器发送数据。

| 配置项 | 存储位置 / 键名 | 作用域 |
| --- | --- | --- |
| 字体配置 | `ui-theme` (`textFontFamily` / `codeFontFamily` / `terminalFontFamily`) | 跟随 DSH Profile，跨浏览器同步 |
| 模块启用状态 | `localStorage`：`cfui.modules.enabled.v1` | 仅当前浏览器生效 |
| 模块折叠状态 | `localStorage`：`cfui.modules.v1` | 仅当前浏览器生效 |
| 工作区功能开关 | `localStorage`：`dswb.features.v1` | 仅当前浏览器生效 |
| 聊天工作区 ID | `localStorage`：`dswb.chatWorkspace.v1` | 仅当前浏览器生效 |
| 默认聊天目录 | `~/.dsh/chats`（由 Host 侧自动创建并登记） | 本地文件系统 |

---

## 兼容性与技术实现

- **版本兼容**：已在 DSH Web `0.2.1-rc.2`（`desktop` profile）完整测试通过。
- **外部依赖**：依赖宿主环境提供的 `@deepseek-ai/dsh-client-ui-theme`、`ui-layout` 与 `ui-sidebar`，构建产物中未重复打包这些依赖。
- **架构设计**：
  - 采用单一 Bundle 与单一 Loader 行（`client-front-ui`），内部由 `createFontModule`、`createSidebarModule`、`createRailModule` 三个独立工厂模块统一挂载。
  - 全局页面级插槽（`main`、`sidebar.panellist`、`plugins.bundle.config`）仅注册一次，避免重复挂载开销。
  - 仓库内直接包含预构建的 `client.js`，确保可直接通过 Git 或 npm 分发安装。

---

## 已知限制

- **整体启停粒度**：在 DSH 插件页停用 `界面美化` 会同时关闭全部三个模块；如需仅禁用其中某一项，请使用配置页内的独立模块开关。
- **字体开关行为**：关闭「字体控制」开关仅隐藏配置界面，不会重置已写入 `ui-theme` 的字体；如需还原字体，请使用模块内的重置按钮。
- **字体安装检测局限**：已安装字体检测基于 Canvas 文本宽度启发式测量；若特定字体在操作系统的注册名称与预设列表不一致，可能会被误判为「未安装」，但不影响实际选用。
- **官方 UI 耦合度**：工作区接管与图标栏样式依赖于官方插槽锚点（`data-slot`）及外壳浮层结构（`shell.overlay`）。当 DSH 宿主版本升级导致 DOM 结构变化时，部分视觉表现可能需要随版本适配更新。
- **运行环境限制**：仅适用于 DSH Web 客户端，不包含 CLI、TUI 或模型侧 Tool 注册。

---

## 常见问题 (FAQ)

**Q：更新后左侧图标栏仍显示旧版的 `Aa` 或列表图标怎么办？**  
A：浏览器可能仍缓存了旧版客户端脚本，请尝试强制刷新（`Ctrl+Shift+R` 或 `Cmd+Shift+R`）。若刷新后插件页仍存在旧插件卡片，说明运行中的 Host 进程仍持有旧 Loader 配置，请重启 DSH 服务或确认已移除旧插件依赖。

**Q：我只想使用其中的「字体控制」功能，可以关闭另外两个模块吗？**  
A：完全可以。在插件配置页中关闭「工作区拓展」和「插件边栏」的开关，仅保留「字体控制」开启即可。

**Q：为什么工作区拓展需要接管官方侧栏，而不是增量插入？**  
A：官方的 `sidebar.workspaces` 属于单占位插槽（Single-slot）。为了实现「最近 / 工作区 / 聊天」的三段式信息架构，插件必须以更低优先级（`priority: -1`）接管该插槽；当关闭该模块时，插件会自动释放接管，官方侧栏随即恢复。

---

## 更新日志

### 0.3.0

- **架构合并**：将原 `font-controller`、`dsh-plugin-sidebar`、`dsh-session-sidebar-extended` 合并为单一插件包与单一 Loader 行。
- **统一配置中心**：新增左侧图标栏统一入口与三模块可折叠配置面板，支持模块级独立启停开关。
- **UI 细节优化**：将工作区拓展设置项重构为带「功能 / 状态」表头的边框表格；移除模块内冗余概览卡片，并将历史更新日志迁移至插件详情页。
- **向后兼容**：完整保留原有三大模块的核心交互逻辑及持久化存储键名。

> 三个旧版独立插件的早期版本历史可在 DSH 插件详情页的完整更新日志中查看。

---

## 许可证

当前仓库尚未指定开源许可证。在公开发布至 npm 或开源社区前，请补充 `LICENSE` 文件并在 `package.json` 中声明对应协议（如 `MIT`）。
