---
title: WorkflowKit
description: Logic-driven components for visual builders and scripted editors.
status: planned
prev: false
next: false
---

WorkflowKit provides logic-driven components for visual builders and scripted editors. It is centered around the IVR Node for telephony routing and workflow automation.

## Overview

WorkflowKit components enable visual workflow creation:
- Node-based workflow editors
- Connection and flow visualization
- Conditional logic builders
- IVR (Interactive Voice Response) routing
- Script and automation editors

## Planned Components

### Builder Components
- **IVR Node**: Node component for call routing workflows
- **Flow Canvas**: Drag-and-drop workflow editor surface
- **Connection Line**: Visual connector between nodes

### Logic Components
- **Condition Builder**: Visual interface for conditional logic
- **Script Editor**: Code editor for custom scripts
- **Variable Manager**: Workflow variable configuration

## Installation

```bash
npm install @dialpad/workflowkit
```

```javascript
import "@dialpad/workflowkit/vue3/css";
import { DpIvrNode, DpFlowCanvas } from "@dialpad/workflowkit/vue3";
```

## Status

WorkflowKit is currently in the planning phase. Components and APIs are subject to change.

## Resources

- [External Documentation](https://uikits.dialpad.com/workflowkit/) (Coming Soon)
- [GitHub Repository](https://github.com/dialpad/dialtone/tree/staging/packages/dialtone-vue3/ui-kits/workflowkit)
