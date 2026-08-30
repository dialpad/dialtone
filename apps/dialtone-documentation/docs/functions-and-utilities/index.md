---
title: Vue Utilities
description: Consumer-facing directives and utilities exported by Dialtone Vue.
status: new
thumb: true
keywords: ["directive", "function", "utility", "utilities", "plugin", "v-dt-focusgroup", "v-dt-mode", "v-dt-tooltip", "v-dt-scrollbar", "keyboard navigation", "roving tabindex", "dark mode", "date", "time", "localization", "i18n", "lazy show", "DtLazyShow", "accessibility", "a11y", "internationalization", "theme"]
---

## Directives

Behavioral plugins that attach to any element — add keyboard navigation, color modes, tooltips, and more.

| Directive | Description |
| --- | --- |
| [`v-dt-focusgroup`](https://dialtone.dialpad.com/vue/?path=/docs/directives-focusgroup--docs) | Roving tabindex for composite widgets — arrow-key cycling, looping, memory, and disabled-item handling |
| [`v-dt-focustrap`](https://dialtone.dialpad.com/vue/?path=/docs/directives-focustrap--docs) | Trap Tab/Shift+Tab within a container — initial focus, boundary wrapping, and focus restoration for dialogs and overlays |
| [`v-dt-mode`](https://dialtone.dialpad.com/vue/?path=/docs/directives-mode--docs) | Scope descendant design tokens to a light, dark, or inverted color palette |
| [`v-dt-tooltip`](https://dialtone.dialpad.com/vue/?path=/docs/directives-tooltip--docs) | Attach a tooltip to any element without a wrapper component |
| [`v-dt-scrollbar`](https://dialtone.dialpad.com/vue/?path=/docs/directives-scrollbar--docs) | Replace native scrollbars with a styled overlay that auto-hides |

## Functions

Stateless helpers for formatting and transforming data.

| Function | Description |
| --- | --- |
| [Date and Time](https://dialtone.dialpad.com/vue/?path=/docs/functions-date-and-time--docs) | Format dates, relative timestamps, and durations with i18n locale support |

## Utilities

Foundational modules for rendering optimization and internationalization.

| Utility | Description |
| --- | --- |
| [DtLazyShow](https://dialtone.dialpad.com/vue/?path=/docs/utilities-lazy-show--docs) | Defer child rendering until first shown — reduces initial mount cost for popovers and modals |
| [Localization](https://dialtone.dialpad.com/vue/?path=/docs/utilities-localization--docs) | Singleton i18n manager that localizes strings across all Dialtone components |
