# dsh-client-front-ui

English | [中文](README.zh.md)

**Client Front UI (界面美化)** — A DSH Web extension with three interface modules: Font Controller, Workspace Extended, and Plugin Rail.

[![version](https://img.shields.io/badge/version-0.3.2-blue.svg)](#changelog)
[![DSH](https://img.shields.io/badge/DSH-0.2.1--rc.2-green.svg)](#compatibility--architecture)
[![platform](https://img.shields.io/badge/platform-DSH%20Web-lightgrey.svg)](#compatibility--architecture)

## Overview

`dsh-client-front-ui` is a single DSH Web extension with three independently switchable modules: **Font Controller**, **Workspace Extended**, and **Plugin Rail**. It appears as one card on the Plugins page and adds one entry to the left icon rail; that entry opens a centralized configuration view where each module can be toggled and collapsed.

* **Package Name**: `dsh-client-front-ui`
* **Loader Key**: `client-front-ui`
* **Plugin Title**: Client Front UI / 界面美化
* **Platform**: DSH Web (tested on the `desktop` profile)

## Table of Contents

* [Core Features](#core-features)
* [Installation](#installation)
* [Quick Start](#quick-start)
* [Settings & Persistence](#settings--persistence)
* [Compatibility & Architecture](#compatibility--architecture)
* [Known Limitations](#known-limitations)
* [FAQ](#faq)
* [Changelog](#changelog)
* [License](#license)

## Core Features

### 1. Font Controller

Configure separate Chinese and Latin font families for DSH's interface, code blocks, and terminal.

* **Official Role Mapping**: Maps directly to `textFontFamily` (UI & chat), `codeFontFamily` (code), and `terminalFontFamily` (terminal) within the `ui-theme` namespace, staying bidirectionally synced with **Settings → General → Fonts**.
* **Built-in Font Library**: Ships with 69 curated CJK and Latin fonts featuring keyword search, an "Installed only" filter, inline expansion previews, and keyboard selection.
* **Smart Status Indicators**: Allows selecting uninstalled fonts (useful for cross-device profile syncing) while listing missing fonts below the table; supports per-row reset and one-click restore to defaults.
* **Independent Lifecycle**: Toggling the module switch off only hides the configuration panel while preserving active fonts in `ui-theme`. Clicking **Reset and disable** clears all three font roles and disables the entire plugin.

### 2. Workspace Extended

Restructures the default session sidebar into a three-tier layout—**Recent / Workspaces / Chats**—for streamlined multi-project session management.

* **Non-destructive Slot Override**: Takes over the `sidebar.workspaces` slot at `priority: -1`. Disabling the module or plugin seamlessly restores the official sidebar.
* **Three-Tier Structure**:
  * **Recent**: A cross-workspace index of recent sessions (displays 4 items by default with incremental expansion).
  * **Workspaces**: Sorted by recent group activity (displays 5 sessions per group by default, supporting incremental expansion and group-level collapsing).
  * **Chats**: Houses standalone sessions not bound to any workspace. Automatically creates and registers `~/.dsh/chats` as the default chat workspace upon first activation (customizable via the `…` menu on the **Chats** section header).
* **Full Interaction Parity**: Preserves workspace/session context menus, search, sorting & filtering, hover info cards, long-press drag reordering, and the **Chat** toggle button next to the composer input. All sub-features can be toggled individually.

### 3. Plugin Rail

Consolidates global sidebar entries into a slim vertical icon rail on the far left to reclaim vertical sidebar space.

* **40×40 Vertical Rail**: Arranges "Plugins", "Scheduled tasks", and all global panels registered to `sidebar.panellist` as vertical 40×40 icon buttons.
* **Streamlined Layout**: Hides the top brand row and moves **New session** to the top row; clicking the brand whale icon returns to the conversation (revealing a home icon on hover), while the account entry stays anchored at the bottom.
* **Scoped Styling**: All rail styles are scoped under `html[data-client-front-ui='on']`. Disabling the module or plugin removes the attribute and reverts to the official layout. This module requires no additional settings beyond its enable switch.

## Installation

The repository root serves directly as the plugin package root (containing `package.json`, `cordis.patch.yml`, and the prebuilt `client.js`). End users do not need Node.js or pnpm installed locally; the DSH Host uses its bundled pnpm automatically.

### Option 1: Install via npm (Recommended)

```bash
dsh plugin --profile desktop add dsh-client-front-ui
# Or specify a version
dsh plugin --profile desktop add dsh-client-front-ui@0.3.2
```

### Option 2: Install from GitHub

```bash
# Repository owner: QinzYee
dsh plugin --profile desktop add git+https://github.com/QinzYee/dsh-client-front-ui.git
```

### Option 3: Install from a Local Directory or `.tgz` Archive

```bash
# From a local source checkout
dsh plugin --profile desktop add file:/absolute/path/to/dsh-client-front-ui

# From a packaged .tgz tarball
dsh plugin --profile desktop add file:/absolute/path/to/dsh-client-front-ui-0.3.2.tgz
```

> **GUI Installation**: You can also navigate to **Plugins → Add Plugin** in DSH Web and enter the npm package name, Git repository URL, `.tgz` path, or local directory path directly (on Windows, paths like `F:\plugins\client-front-ui` work out of the box).
>
> **Note**: When adding the Loader entry to a running Host for the first time, restart the DSH service if refreshing the page does not load the plugin.

## Quick Start

1. Go to **Plugins → Installed Plugins**, locate **Client Front UI**, and enable it.
2. Refresh the page, then click the new **sliders icon** on the left icon rail (or open the plugin details page) to access the settings view.
3. Manage each module using the controls on its header row:
   * **Enable Switch**: Turns the module's functionality on or off.
   * **Collapse Arrow**: Expands or collapses the module's configuration panel without affecting its active state (modules without extra settings, such as Plugin Rail, only display the enable switch).

| UI Location | Behavior |
| --- | --- |
| **Plugins Page** | One card: **Client Front UI** |
| **Left Icon Rail** | Adds a sliders configuration button (official "Plugins" and "Scheduled tasks" entries remain intact) |
| **Configuration View** | Both the rail entry and the plugin details page render the exact same three-module settings panel |

## Settings & Persistence

All plugin states are stored locally in your browser or within your active DSH profile. No data is ever transmitted to external servers.

| Setting | Storage Location / Key | Scope |
| --- | --- | --- |
| Font Preferences | `ui-theme` (`textFontFamily` / `codeFontFamily` / `terminalFontFamily`) | Synced with DSH Profile across browsers |
| Module Enable States | `localStorage`: `cfui.modules.enabled.v1` | Per browser |
| Module Collapse States | `localStorage`: `cfui.modules.v1` | Per browser |
| Workspace Feature Toggles | `localStorage`: `dswb.features.v1` | Per browser |
| Chat Workspace ID | `localStorage`: `dswb.chatWorkspace.v1` | Per browser |
| Default Chat Directory | `~/.dsh/chats` (created and registered by Host) | Local filesystem |

## Compatibility & Architecture

* **Compatibility**: Verified on DSH Web `0.2.1-rc.2` (`desktop` profile).
* **Peer Dependencies**: Relies on host-provided `@deepseek-ai/dsh-client-ui-theme`, `ui-layout`, and `ui-sidebar` client packages without bundling duplicates.
* **Implementation Details**:
  * Single bundle and single Loader entry (`client-front-ui`) applying `createFontModule`, `createSidebarModule`, and `createRailModule` together.
  * Page-level slots (`main`, `sidebar.panellist`, `plugins.bundle.config`) and detail actions are registered only once.
  * Ships with a prebuilt `client.js` committed to the repository for direct Git and npm distribution.

## Known Limitations

* **Plugin-Level Toggle**: Disabling **Client Front UI** on the Plugins page disables all three modules simultaneously. Use individual module switches to disable specific features.
* **Font Module Switch Behavior**: Turning off the Font Controller switch only hides its UI panel and does not reset fonts already saved in `ui-theme`. Use the module's reset buttons to revert fonts.
* **Installed Font Detection**: Detection relies on canvas text-width heuristics; if a local font is registered under a different system name, it may be flagged as uninstalled even though it can still be selected.
* **Host DOM Coupling**: Workspace overrides and rail styles depend on official slot anchors (`data-slot`) and shell overlay structures (`shell.overlay`). Future DSH UI updates may require selector adjustments.
* **Web-Only Scope**: Built exclusively for DSH Web; provides no CLI, TUI, or model-facing tools.

## FAQ

**Q: After upgrading, the rail or page still looks like the previous version. What should I do?**  
A: The browser may still be running a cached client bundle. Hard-refresh with `Ctrl+Shift+R` (or `Cmd+Shift+R`). If the Plugins page still shows an outdated card, confirm the new version is installed and restart DSH so the Host reloads its Loader graph.

**Q: Can I use only the Font Controller module?**  
A: Yes. Simply toggle off **Workspace Extended** and **Plugin Rail** in the settings panel while leaving **Font Controller** enabled.

**Q: Why does Workspace Extended take over the official sidebar instead of injecting into it?**  
A: The official `sidebar.workspaces` slot is a single-occupant slot. Implementing the **Recent / Workspaces / Chats** layout requires taking over the slot at a lower priority (`priority: -1`). Disabling the module releases the override and restores the official sidebar automatically.

## Changelog

### 0.3.2

* **Documentation**: rewrote the changelog and product history from this plugin's own perspective. Font Controller, Workspace Extended and Plugin Rail are described as the plugin's modules, not as separate packages.
* Updated the bilingual README and in-app release notes; no runtime changes.

### 0.3.1

* **License**: added the MIT `LICENSE` file and the `license` field in `package.json`.
* **Documentation**: added the bilingual README set and the repository/homepage metadata.
* No runtime changes; this release only ships package metadata and documentation updates.

### 0.3.0

* **Initial public release**: one rail entry, one configuration page, and three modules — Font Controller, Workspace Extended and Plugin Rail.
* **Per-module controls**: each module can be enabled, disabled and collapsed independently.
* **Workspace settings table**: the eight feature switches render as a bordered table with a Feature / State header.
* Removed redundant module overview cards and moved release notes to the plugin details page.

## License

This package is released under the [MIT License](LICENSE).

Copyright (c) 2026 QinzYee.
