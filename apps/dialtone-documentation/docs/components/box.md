---
title: Box
description: Low-level surface and spacing primitive for building token-constrained containers with padding, background, border, shadow, and sizing.
status: beta
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-box--default
keywords: ["box", "container", "surface", "padding", "border", "shadow", "radius", "sizing", "layout", "primitive", "DtBox", "dt-box", "d-box"]
---

<component-combinator component-name="DtBox" />

## Overview

DtBox is a general-purpose container primitive that applies visual surface properties via token-constrained props. It complements [DtText](/components/text.html) (typography) and [DtStack](/components/stack.html) (flex layout) to form Dialtone's primitive triad.

Instead of composing CSS utility classes for common surface patterns, DtBox provides a discoverable, validated prop API mapped directly to Dialtone design tokens.

```vue demo
<dt-box
  padding="300"
  surface="primary"
  border-width="100"
  border-radius="300"
  shadow="card"
>
  Box demo
</dt-box>
```
