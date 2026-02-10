---
title: NavigationKit
description: Components for the application chrome, including top and left navigation.
status: planned
prev: false
next: false
---

NavigationKit provides components for the application chrome, including top and left navigation. It houses contact rows, unread pills, and menu buttons designed for app-level navigation.

## Overview

NavigationKit components create consistent navigation experiences:
- Top navigation bars
- Side navigation panels
- Contact and conversation lists
- Unread indicators and badges
- Navigation menu items

## Planned Components

### Navigation Components
- **Top Bar**: Application header with branding and actions
- **Side Panel**: Collapsible side navigation
- **Nav Item**: Individual navigation menu item

### List Components
- **Contact Row**: User/contact list item with avatar and status
- **Conversation Row**: Chat conversation list item with preview
- **Unread Pill**: Badge for unread count indicators

## Installation

```bash
npm install @dialpad/navigationkit
```

```javascript
import "@dialpad/navigationkit/vue3/css";
import { DpTopBar, DpContactRow } from "@dialpad/navigationkit/vue3";
```

## Status

NavigationKit is currently in the planning phase. Components and APIs are subject to change.

## Resources

- [External Documentation](https://uikits.dialpad.com/navigationkit/) (Coming Soon)
- [GitHub Repository](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-vue3/ui-kits/navigationkit)
