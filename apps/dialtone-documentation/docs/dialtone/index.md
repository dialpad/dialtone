---
title: Dialtone Design System
description: Dialpad's design system for building consistent, accessible product experiences
keywords: ["design system", "components", "css utilities", "design tokens", "content guidelines", "vue utilities", "ui kits", "downloads"]
next:
  text: What's New
  link: /dialtone/whats-new/
---

<DtBox class="d-d-grid d-g-300 md:d-g-cols3 d-mbe-400">
  <DtLink to="/dialtone/whats-new/"  tone="muted" :underline="false" class="d-d-block d-bar-400 h:d-td-none">
    <DtStack direction="row" gap="200">
      <DtBox
        :padding="viewport.pick({ default: '100', md: '200' })"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        surface="secondary"
      >
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="megaphone" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">What's New</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Updates, progress and planning for all things Dialtone.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/guides/migration/"  tone="muted" :underline="false" class="d-d-block d-bar-400 h:d-td-none">
    <DtStack direction="row" gap="200">
      <DtBox
        :padding="viewport.pick({ default: '100', md: '200' })"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        surface="secondary"
      >
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="list-checks" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">Migration Guide</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Codemods and Linting for Dialtone Next</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/guides/getting-started/"  tone="muted" :underline="false" class="d-d-block d-bar-400 h:d-td-none">
    <DtStack direction="row" gap="200">
      <DtBox
        :padding="viewport.pick({ default: '100', md: '200' })"
        border-width="100"
        border-color="subtle"
        border-radius="400"
        surface="secondary"
      >
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="file-text" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">Getting Started</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Quick start guidelines for using Dialtone in your project.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
</DtBox>

<overview :pages="$page.overviewPages" />

<script setup>
import { useViewportBreakpoints } from '@composables/useViewportBreakpoints.js';

const viewport = useViewportBreakpoints();
</script>
