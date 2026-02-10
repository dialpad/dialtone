---
title: CallbarKit
description: Specialized building blocks for meeting and telephony controls.
status: planned
prev: false
next: false
---

CallbarKit provides specialized building blocks for meeting and telephony controls. It includes callbar buttons, banners, and timers designed for voice and video communication experiences.

## Overview

CallbarKit components handle the unique requirements of call interfaces:
- Call control buttons (mute, hold, transfer)
- Call status banners and notifications
- Timer and duration displays
- Participant management
- Call quality indicators

## Planned Components

### Control Components
- **Callbar Button**: Specialized buttons for call actions
- **Callbar Row**: Horizontal layout for call controls
- **Call Timer**: Real-time call duration display

### Status Components
- **Call Banner**: Status and information banner
- **Connection Status**: Network quality indicator
- **Participant List**: Active call participants display

## Installation

```bash
npm install @dialpad/callbarkit
```

```javascript
import "@dialpad/callbarkit/vue3/css";
import { DpCallbarButton, DpCallTimer } from "@dialpad/callbarkit/vue3";
```

## Status

CallbarKit is currently in the planning phase. Components and APIs are subject to change.

## Resources

- [External Documentation](https://uikits.dialpad.com/callbarkit/) (Coming Soon)
- [GitHub Repository](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-vue3/ui-kits/callbarkit)
