---
title: Illustration
description: Contextual artwork for empty states, guidance, and visual support.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-illustration--default
figma_url: https://www.figma.com/design/dzGQjTcbUfviiqGvwsD9VV/DT9-Spot-Illustrations?node-id=1181-1068
keywords: ["image", "graphic", "artwork", "d-illustration", "DtIllustration", "dt-illustration", "spot illustration", "hero image"]
combinator: DtIllustration
---

Use illustrations in product UI, paired with inline text in [empty states](/components/empty-state.html), onboarding, and announcements. Spot illustrations are retired from brand and marketing work; use [Resolve graphics](/foundations/graphic-system/) there instead.

## Usage

Pass the illustration's `name` in kebab-case. Each name in the catalog below is a valid value.

```vue demo
<dt-illustration name="access-denied" />
```

## Catalog

<icons illustration kind="spot" size="large" :excluded-icons="excludedIllustrations"></icons>

## Vue API

<component-vue-api component-name="illustration" />

## Accessibility

- Illustrations are decorative by default. Without an `aria-label`, they render with `aria-hidden="true"`, so screen readers skip them.
- Add an `aria-label` only when the illustration carries meaning that the surrounding text doesn't, for example `<dt-illustration name="access-denied" aria-label="Access denied" />`.
- Don't rely on an illustration alone to communicate. Pair it with a heading and body text, as in [Empty State](/components/empty-state.html).

<script setup>
// Temporarily exclude illustrations from being shown on the docsite
const excludedIllustrations = [
  'mind',
  'blank-space',
  'vector-vortex',
  'atomic-pathway',
  'black-hole',
  'orbital-harmony',
];
</script>
