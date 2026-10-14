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

## Catalog

<icons illustration kind="spot" size="large" :excluded-icons="excludedIllustrations"></icons>

## Vue API

<component-vue-api component-name="illustration" />

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
