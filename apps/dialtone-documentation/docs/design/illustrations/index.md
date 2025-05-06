---
title: Illustrations
description: Illustration assets.
storybook: https://dialtone.dialpad.com/vue/index.html?path=/story/components-illustration--default
figma_url: https://www.figma.com/design/dzGQjTcbUfviiqGvwsD9VV/DT9-Spot-Illustrations?node-id=1181-1068
---

## Illustrations

Illustrations are the slightly grown up version of icons with a little more detail. A illustration is an image that typically works in tandem with inline text to communicate a state in a more friendly way. They’re most often used in empty states, onboarding, and in-product announcements.

<icons illustration kind="spot" size="large" :excluded-icons="excludedIllustrations"></icons>

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
