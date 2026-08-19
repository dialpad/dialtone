---
title: Components
description: Reusable components solving common UI needs, designed and built to be assembled in countless combinations.
keywords: ["vue components", "ui components", "DtButton", "DtModal", "storybook", "figma"]
no_preview: true
next:
  text: Component Status
  link: /components/status/
---

## Newest Components

<DtBox class="d-box d-box--bc-default d-d-grid d-g-300 md:d-g-cols3 d-mbe-400">
  <DtLink to="/components/box" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtBox</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Primitive container for surface, border, spacing, and sizing.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/filter-pill" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtFilterPill</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Filter control with selectable options in a popover.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/mode-island" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">Mode Directive</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Directive for scoping light, dark, or inverted color mode.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/motion-text" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtMotionText</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Animated text for reveal, shimmer, and loading moments.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/motion-text" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtResizable</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Layout primitive for adjustable panels and split views.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/segmented-control" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtSegmentedControl</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Single-select control for switching views, scopes, or modes.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/text" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtText</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Token-based typography for semantic text styles.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
  <DtLink to="/components/text-list" :underline="false" class="d-d-block d-bar-400 d-fc-secondary h:d-td-none h:d-fc-primary">
    <DtStack direction="row" gap="200">
      <DtBox :padding="viewport.pick({ default: '100', md: '200' })" border-width="100" border-color="subtle" border-radius="400" surface="secondary">
        <DtStack>
          <dt-icon class="d-fc-tertiary" name="component" :size="viewport.pick({ default: '300', md: '500' })" />
        </DtStack>
      </DtBox>
      <DtStack>
        <dt-text as="h3" kind="headline" size="200">DtTextList</dt-text>
        <dt-text as="p" kind="body" size="200" wrap="pretty">Semantic bullet, numbered, nested, and custom-marker lists.</dt-text>
      </DtStack>
    </DtStack>
  </DtLink>
</DtBox>

## All Components

<overview :pages="$page.enhancedFrontmatter" />

<script setup>
import { useViewportBreakpoints } from '@composables/useViewportBreakpoints.js';

const viewport = useViewportBreakpoints();
</script>
