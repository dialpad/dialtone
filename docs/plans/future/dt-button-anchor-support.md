# DtButton Anchor (`<a>`) Rendering Support

## Overview

**Status:** Future
**Created:** 2026-02-06

Add the ability for DtButton to render as an `<a>` element so that link-styled buttons don't require raw HTML workarounds with manual `d-btn` class application.

## Problem

DtButton hardcodes `<button>` as its root element. The doc site has ~8 instances of raw `<a class="d-btn d-btn--muted" href="...">` workarounds (in PageHeader.vue, Navbar.vue, BaseIcon.vue) because there's no way to render DtButton as a link. These workarounds:

- Duplicate the internal markup structure (`d-btn__icon`, `d-btn__label` spans)
- Miss DtButton's accessibility features (aria-live, focus management)
- Drift out of sync as button internals evolve

### Current workaround example (PageHeader.vue)

```vue
<a
  class="d-btn d-btn--muted"
  :href="githubUrl"
  target="_blank"
  rel="noopener noreferrer"
>
  <span class="d-btn__icon d-btn__icon--left">
    <svg class="d-icon d-icon--size-300" ...>...</svg>
  </span>
  <span class="d-btn__label">GitHub</span>
</a>
```

### Workaround locations

- `apps/dialtone-documentation/docs/.vuepress/theme/components/PageHeader.vue` (GitHub, Storybook, Figma links)
- `apps/dialtone-documentation/docs/.vuepress/theme/components/Navbar.vue` (Storybook, GitHub, Codepen links + `<router-link>` with `d-btn` classes)
- `apps/dialtone-documentation/docs/.vuepress/baseComponents/BaseIcon.vue` (Figma link)

## Goals

- Allow DtButton to render as `<a>` when given a URL
- Preserve all existing button styling, slots, and accessibility features
- Handle anchor-specific attributes (`href`, `target`, `rel`)
- Handle accessibility differences between `<button>` and `<a>` (disabled state, keyboard behavior)
- Eliminate raw `<a class="d-btn">` workarounds in the doc site

## Non-Goals

- Supporting arbitrary elements beyond `<button>` and `<a>`
- Changing DtLink's behavior

## Recommended API: `href` prop (auto-switch)

**If `href` is provided, render `<a>`. Otherwise render `<button>`.** No new conceptual prop needed.

```vue
<!-- Before: raw HTML workaround -->
<a class="d-btn d-btn--muted" href="https://github.com/..." target="_blank" rel="noopener noreferrer">
  <span class="d-btn__icon d-btn__icon--left">...</span>
  <span class="d-btn__label">GitHub</span>
</a>

<!-- After: proper component usage -->
<dt-button kind="muted" href="https://github.com/..." target="_blank" rel="noopener noreferrer">
  <template #icon>...</template>
  GitHub
</dt-button>
```

### Why `href` auto-switch over other patterns

**Precedent:** This is exactly how **Bootstrap Vue** (`<b-button>`) and **Vuetify** (`<v-btn>`) work. Both are major Vue design systems. Pass `href` and it renders `<a>`. Pass `to` and it renders `<router-link>`. Otherwise it's `<button>`.

Compared to alternatives:

| Pattern | Used by | Tradeoff |
|---------|---------|----------|
| **`href` auto-switch** | Bootstrap Vue, Vuetify | Zero new concepts, Vue convention, self-documenting |
| `as` prop | Chakra UI, PrimeVue, Dialtone (DtStack, DtText) | Redundant — `as="a"` always paired with `href` anyway |
| `asChild` | Radix UI/Vue | Verbose, new pattern to Dialtone, complex slot merging |
| Separate component | Carbon | More components to maintain, most systems moved away |

The `as` prop exists in Dialtone already (DtStack, DtText, DtItemLayout, DtModeIsland), but its purpose there is semantic HTML (`section`, `span`, `nav`) — not switching between fundamentally different interactive element types. Using `href` as the signal is more appropriate for the button/anchor distinction.

### Styling is unaffected by this change

All visual rendering (`kind`, `importance`, `size`, `circle`, etc.) flows through the `buttonClasses()` method in `button.vue` (lines 304-328), which computes CSS classes purely from prop values and never references the root element tag. The classes (`d-btn`, `d-btn--muted`, `d-btn--primary`, etc.) are applied via `:class` on the root element and work identically on `<button>` and `<a>`. The inner `<span>` structure for icon and label also stays the same. Only which HTML attributes get applied to the root element changes (`type`/`disabled` for button vs `href`/`target`/`rel`/`role` for anchor).

## Vue Router (`to` prop) Consideration

### Existing patterns in the doc site

The doc site uses `<router-link>` with button styling in two distinct ways:

**Pattern 1: `<router-link>` with raw `d-btn` classes** (Navbar.vue)
```vue
<router-link :to="link.link" class="d-btn d-btn--muted d-btn--lg">
  <span class="d-btn__label">{{ link.text }}</span>
</router-link>
```

**Pattern 2: `<router-link custom>` wrapping `<dt-button>`** (SidebarItem.vue, Page.vue)
```vue
<router-link v-slot="{ navigate }" :to="prev.link" custom>
  <dt-button @click="navigate">Previous</dt-button>
</router-link>
```

Pattern 2 **already works today** without any changes to DtButton. Vue Router's `custom` prop + scoped slot separates routing from rendering entirely — the button just handles `@click="navigate"`.

### Should DtButton accept a `to` prop?

Adding a `to` prop would mean DtButton renders `<router-link>` (or `<nuxt-link>`, etc.) via `<component :is="RouterLink">`. This creates a **vue-router dependency in the component library** — a meaningful architectural decision for a design system that may be consumed in contexts where vue-router isn't present.

Bootstrap Vue and Vuetify both accept this tradeoff, but they're also tightly coupled to Vue's ecosystem. A more portable design system might not want that coupling.

| Scenario | Solution | Complexity | vue-router dependency? |
|----------|----------|------------|----------------------|
| External links (`href`) | Add `href` prop, render `<a>` | Low | No |
| Router navigation | `<router-link custom>` wrapping DtButton (Pattern 2) | Zero — already works | No — stays in consumer code |
| Router navigation | Add `to` prop, render `<router-link>` | Higher | **Yes** — component library imports vue-router |

### Recommendation

Start with `href` only — it solves the concrete pain point (8 raw `<a class="d-btn">` workarounds) without introducing framework coupling. The `<router-link custom>` wrapping pattern already handles router navigation cleanly.

If a `to` prop is desired later, it can be added incrementally using the same `<component :is>` mechanism. But this decision should be informed by an analysis of consuming products — specifically whether Dialpad's Vue applications (beyond the doc site) have the same `<router-link class="d-btn">` workaround pattern and would benefit from a built-in `to` prop, and whether the vue-router coupling is acceptable across all consumers.

### Open question: consuming product audit

Before deciding on `to` prop support, audit Dialpad's Vue products that consume Dialtone:

- Do they wrap `<router-link>` around DtButton frequently?
- Do they use raw `<router-link class="d-btn">` workarounds?
- Are there consumers that don't use vue-router (e.g., web components, non-SPA contexts)?
- Would a `to` prop meaningfully reduce boilerplate, or is the `custom` v-slot pattern sufficient?

This audit would determine whether `to` is a convenience (nice-to-have) or a real need across the ecosystem.

## Accessibility Considerations

When DtButton renders as `<a>`:

1. **`role="button"`** — Required so screen readers announce it as a button, not a link. Dialtone's own button.md docs (lines 1180-1182) already specify this requirement.
2. **Space key handler** — `<a>` elements only respond to Enter. Buttons respond to both Enter and Space. A keydown handler must trigger click on Space when rendering as `<a>`.
3. **`disabled` state** — `disabled` attribute doesn't exist on `<a>`. Use `aria-disabled="true"` + CSS `pointer-events: none` + prevent click handler.
4. **`type` prop** — Should be omitted from the rendered `<a>` element (only valid on `<button>`).
5. **`href`, `target`, `rel`** — Should only be rendered on `<a>`, not `<button>`.

## Implementation Outline

### New props on DtButton

```js
href: { type: String, default: null },
target: { type: String, default: null },
rel: { type: String, default: null },
```

### Template change

```vue
<!-- From -->
<button :class="..." :type="type" :disabled="disabled" ...>

<!-- To -->
<component
  :is="computedTag"
  :class="..."
  v-bind="computedAttrs"
  v-on="computedListeners"
>
```

### Computed logic

```js
const computedTag = computed(() => props.href ? 'a' : 'button');
const isAnchor = computed(() => !!props.href);

const computedAttrs = computed(() => {
  if (isAnchor.value) {
    return {
      href: props.href,
      target: props.target,
      rel: props.rel,
      role: 'button',
      ...(props.disabled && { 'aria-disabled': 'true', tabindex: '-1' }),
    };
  }
  return {
    type: props.type,
    disabled: props.disabled,
  };
});
```

### Files to modify

- `packages/dialtone-vue/components/button/button.vue` — template + props + computed logic
- `packages/dialtone-vue/components/button/button_constants.js` — new prop validators if needed
- `packages/dialtone-vue/components/button/button.test.js` — new test cases
- `apps/dialtone-documentation/docs/components/button.md` — document the new capability

### Complexity estimate

Moderate — not high:

- ~50-80 lines of new/changed code in the component
- ~60-100 lines of new tests
- Template change is small (`<button>` to `<component :is>`)
- Main work is conditional attribute handling and accessibility

## Verification Plan

1. Unit tests pass: `pnpm nx run dialtone-vue:test -- --testPathPattern=button`
2. New test cases cover: anchor rendering, attribute filtering, keyboard (Space), disabled-as-anchor, role="button"
3. Storybook: button-as-anchor renders identically to current `<a class="d-btn">` workarounds
4. Accessibility: keyboard test (Tab, Enter navigates, Space navigates with role="button")
5. Doc site: convert PageHeader.vue workarounds as proof-of-concept
