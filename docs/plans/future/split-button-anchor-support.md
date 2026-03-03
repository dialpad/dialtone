# DtSplitButton Anchor and Router Link Forwarding

## Overview

**Status:** Future
**Created:** 2026-02-15
**Depends on:** [DtButton Anchor Support](../active/dt-button-anchor-support.md)

Forward DtButton's `href` and `to` navigation props through the SplitButton alpha button so the primary action can navigate.

## Problem

With DtButton now supporting `href` and `to` props, SplitButton's alpha button cannot take advantage of this because `split_button.vue` and `split_button-alpha.vue` don't forward the navigation props. Consumers who need a navigating split button (e.g., "Join Room" as the main CTA with a dropdown for options) have no clean path.

## Why alpha only

The alpha (left) button is the primary action — navigation is a natural use case (e.g., "Join Room" as the main CTA, with a dropdown for "Join with video", "Join audio only"). The omega (right) button is a dropdown trigger; it opens a menu, not navigates. If a custom navigating omega is ever needed, the `#omega` slot already provides full override capability.

## Naming convention

Follows SplitButton's existing pattern: `alphaDisabled`, `alphaActive`, `alphaAriaLabel`, `alphaLoading`, `alphaTooltipText`, etc. The navigation props become `alphaTo`, `alphaHref`, `alphaTarget`, `alphaRel`, `alphaReplace`.

## Props

New props on `DtSplitButton`:

| Prop            | Type           | Default | Description                                                  |
| --------------- | -------------- | ------- | ------------------------------------------------------------ |
| `alphaHref`     | String         | null    | Renders alpha button as `<a>` for external navigation        |
| `alphaTo`       | String, Object | null    | Renders alpha button as `<router-link>` for SPA navigation   |
| `alphaTarget`   | String         | null    | HTML anchor target. Only applied when using `alphaHref`      |
| `alphaRel`      | String         | null    | HTML anchor rel. Only applied when using `alphaHref`         |
| `alphaReplace`  | Boolean        | false   | vue-router replace. Only applied when using `alphaTo`        |

New props on `SplitButtonAlpha` (internal):

| Prop      | Type           | Default | Forwards to          |
| --------- | -------------- | ------- | -------------------- |
| `to`      | String, Object | null    | `<dt-button :to>`    |
| `href`    | String         | null    | `<dt-button :href>`  |
| `target`  | String         | null    | `<dt-button :target>`|
| `rel`     | String         | null    | `<dt-button :rel>`   |
| `replace` | Boolean        | false   | `<dt-button :replace>`|

No changes to `SplitButtonOmega`.

## Example usage

```vue
<!-- Alpha navigates externally, omega opens dropdown -->
<dt-split-button
  alpha-href="https://example.com"
  alpha-target="_blank"
  alpha-rel="noopener noreferrer"
  omega-tooltip-text="More options"
>
  Visit Site
  <template #dropdownList>
    <dt-list-item role="menuitem">Copy link</dt-list-item>
    <dt-list-item role="menuitem">Open in new tab</dt-list-item>
  </template>
</dt-split-button>

<!-- Alpha navigates via router, omega opens dropdown -->
<dt-split-button
  :alpha-to="roomPath"
  omega-tooltip-text="More calling options"
>
  Join Room
  <template #dropdownList>
    <dt-list-item role="menuitem">Join with video</dt-list-item>
    <dt-list-item role="menuitem">Join audio only</dt-list-item>
  </template>
</dt-split-button>
```

## Prerequisites

The [DtButton Anchor Support](../active/dt-button-anchor-support.md) plan must be **merged and stable** before this work begins. The first milestone below evaluates the final merged API to confirm the design here still holds — prop names, types, defaults, and behavior may have evolved during review.

## Implementation

### Milestones

#### Milestone 0: Evaluate merged DtButton API

- [ ] Confirm DtButton anchor support PR is merged to `staging`
- [ ] Review the final `button.vue` props (`to`, `href`, `target`, `rel`, `replace`) — verify names, types, and defaults match what this plan assumes
- [ ] Review any API changes that emerged during DtButton PR review
- [ ] Update this plan's prop tables and examples if anything diverged

#### Milestone 1: Prop forwarding

- [ ] Add `alphaTo`, `alphaHref`, `alphaTarget`, `alphaRel`, `alphaReplace` props to `split_button.vue`
- [ ] Forward via `alphaButtonProps` computed
- [ ] Add `to`, `href`, `target`, `rel`, `replace` props to `split_button-alpha.vue` and pass through to `<dt-button>`

#### Milestone 2: Tests and stories

- [ ] Unit tests for prop forwarding
- [ ] Storybook: navigation variant in `split_button_variants.story.vue`
- [ ] Storybook controls for new props

### Files to modify

- `packages/dialtone-vue/components/split_button/split_button.vue` — add `alpha*` props; forward in `alphaButtonProps`
- `packages/dialtone-vue/components/split_button/split_button-alpha.vue` — add navigation props; pass through to `<dt-button>`
- `packages/dialtone-vue/components/split_button/split_button.test.js` — tests for prop forwarding
- `packages/dialtone-vue/components/split_button/split_button.stories.js` — Storybook controls
- `packages/dialtone-vue/components/split_button/split_button_variants.story.vue` — navigation variant

### Files not modified

- `packages/dialtone-vue/components/split_button/split_button-omega.vue` — omega is a dropdown trigger, not a navigation element
- `packages/dialtone-vue/components/split_button/split_button_constants.js` — no new validators needed
