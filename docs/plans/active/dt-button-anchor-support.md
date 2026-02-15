# DtButton Anchor (`<a>`) and Router Link Rendering Support

## Overview

**Status:** Active
**Created:** 2026-02-06
**Updated:** 2026-02-15

Add the ability for DtButton to render as an `<a>` element (via `href`) or `<router-link>` (via `to`) so that link-styled buttons don't require raw HTML workarounds with manual `d-btn` class application.

## Problem

DtButton hardcodes `<button>` as its root element. Both the doc site and consuming Dialpad products have numerous instances of raw `<a class="d-btn">` and `<router-link class="d-btn">` workarounds because there's no way to render DtButton as a link or router link. These workarounds:

- Duplicate the internal markup structure (`d-btn__icon`, `d-btn__label` spans)
- Miss DtButton's accessibility features (aria-live, focus management)
- Drift out of sync as button internals evolve

### Workaround examples

**External link (`<a>`):**

```vue
<a
  class="d-btn d-btn--primary d-btn--outlined d-btn--sm"
  href="https://..."
  target="_blank"
  rel="noopener noreferrer"
>...</a>
```

**Router navigation (`<router-link>`):**

```vue
<router-link
  class="d-btn d-btn--primary d-btn--sm toast__primary-btn"
  :to="roomPath"
>...</router-link>
```

### Workaround locations

**Doc site:**

- `apps/dialtone-documentation/docs/.vuepress/theme/components/PageHeader.vue` (GitHub, Storybook, Figma links)
- `apps/dialtone-documentation/docs/.vuepress/theme/components/Navbar.vue` (Storybook, GitHub, Codepen links + `<router-link>` with `d-btn` classes)
- `apps/dialtone-documentation/docs/.vuepress/baseComponents/BaseIcon.vue` (Figma link)

**Consuming products (from audit):**

- `<a class="d-btn d-btn--primary d-btn--lg ...">` (conference summary promo)
- `<a class="d-btn d-btn--primary d-btn--outlined d-btn--sm ...">` (team page, multiple instances)
- `<a class="d-btn d-btn--circle d-btn--icon-only ...">` (blog/help center link)
- `<router-link class="d-btn d-btn--primary" :to="roomPath">` (conference join, with `@click.stop`)
- `<router-link class="d-btn d-btn--primary d-btn--sm" :to="roomPath">` (toast action)
- `<router-link class="d-btn d-btn--xs" to="/forgotpassword">` (login page)
- `<router-link class="d-btn d-btn--primary d-w64" to="/" replace>` (navigation with `replace`)

## Goals

- Allow DtButton to render as `<a>` (via `href`) or `<router-link>` (via `to`)
- Preserve all existing button styling, slots, and accessibility features
- Handle anchor-specific attributes (`href`, `target`, `rel`)
- Handle router-link attributes (`to`, `replace`, `activeClass`, etc.)
- Handle accessibility differences between `<button>` and `<a>` (disabled state, keyboard behavior)
- Eliminate raw `<a class="d-btn">` and `<router-link class="d-btn">` workarounds

## Non-Goals

- Supporting arbitrary elements beyond `<button>`, `<a>`, and `<router-link>`
- Changing DtLink's behavior

## Recommended API: `to` and `href` props (auto-switch)

The root element is determined by which prop is provided:

| Prop | Renders | Use case |
|------|---------|----------|
| `to` | `<router-link>` | Internal SPA navigation (preferred for consuming products) |
| `href` | `<a>` | External links leaving the app |
| neither | `<button>` | Actions, no navigation |

**Precedence:** `to` > `href` > `button`. If both `to` and `href` are provided, `to` wins — client-side navigation is preferred in SPA contexts because it avoids full page reloads and preserves application state.

```vue
<!-- Internal navigation (renders <router-link>) -->
<dt-button to="/forgotpassword" kind="default" size="xs">
  Forgot password?
</dt-button>

<!-- External link (renders <a>) -->
<dt-button kind="muted" href="https://github.com/..." target="_blank" rel="noopener noreferrer">
  <template #icon>...</template>
  GitHub
</dt-button>

<!-- Action (renders <button>, unchanged) -->
<dt-button @click="handleAction">Place Call</dt-button>
```

### Why `to`/`href` auto-switch over other patterns

**Precedent:** This is exactly how **Bootstrap Vue** (`<b-button>`) and **Vuetify** (`<v-btn>`) work. Both are major Vue design systems. Pass `to` and it renders `<router-link>`. Pass `href` and it renders `<a>`. Otherwise it's `<button>`.

Compared to alternatives:

| Pattern | Used by | Tradeoff |
|---------|---------|----------|
| **`to`/`href` auto-switch** | Bootstrap Vue, Vuetify | Zero new concepts, Vue convention, self-documenting |
| `as` prop | Chakra UI, PrimeVue, Dialtone (DtStack, DtText) | Redundant — `as="a"` always paired with `href` anyway |
| `asChild` | Radix UI/Vue | Verbose, new pattern to Dialtone, complex slot merging |
| Separate component | Carbon | More components to maintain, most systems moved away |

The `as` prop exists in Dialtone already (DtStack, DtText, DtItemLayout, DtModeIsland), but its purpose there is semantic HTML (`section`, `span`, `nav`) — not switching between fundamentally different interactive element types. Using `to`/`href` as the signal is more appropriate for the button/navigation distinction.

### Styling is unaffected by this change

All visual rendering (`kind`, `importance`, `size`, `circle`, etc.) flows through the `buttonClasses()` method in `button.vue` (lines 304-328), which computes CSS classes purely from prop values and never references the root element tag. The classes (`d-btn`, `d-btn--muted`, `d-btn--primary`, etc.) are applied via `:class` on the root element and work identically on `<button>`, `<a>`, and `<router-link>`. The inner `<span>` structure for icon and label also stays the same. Only which HTML attributes get applied to the root element changes.

## Breaking Change Assessment

**This is not a breaking change.** It is purely additive.

- All new props (`to`, `href`, `target`, `rel`, `replace`) default to `null`. When none are provided, `computedTag` resolves to `'button'` — every existing DtButton renders identically.
- No existing prop semantics change. `kind`, `importance`, `size`, `circle`, `disabled`, `type`, all slots, and all events behave exactly as before.
- CSS class computation is unaffected (driven by props, never references the root tag).
- The only behavioral edge case: if someone currently passes `href` as a raw attribute to DtButton (e.g., `<dt-button href="...">`), Vue 3 currently lets it fall through as an invalid HTML attribute on `<button>`. After this change, it becomes a declared prop and correctly renders `<a>`. This is a fix, not a regression — the prior behavior produced invalid HTML.

## Consuming Product Audit Results

Audit of Dialpad's Vue products that consume Dialtone (completed 2026-02-15):

**Findings:**

- Multiple `<router-link class="d-btn">` workarounds across consuming products (conference, toast, login, navigation)
- Multiple `<a class="d-btn">` workarounds for external links (team page, help center, promo CTAs)
- `<router-link class="d-btn">` is at least as prevalent as `<a class="d-btn">` in consuming products
- Consuming products use vue-router features like `@click.stop`, `:to="dynamicRoute"`, and `replace` — the `to` prop must support these
- No non-vue-router consumers were identified in the audit

**Conclusion:** `to` prop support is a real need, not a convenience. The `<router-link custom>` v-slot pattern (wrapping DtButton) is technically possible but impractical at scale — asking consumers to refactor from `<router-link class="d-btn" :to="roomPath">` to the verbose `<router-link v-slot="{ navigate }" custom><dt-button @click="navigate">` pattern is a harder migration sell than offering a direct `to` prop.

### vue-router coupling

Adding `to` introduces a vue-router dependency in the component library. This is mitigated by:

1. **Lazy resolution** — only import/resolve `RouterLink` when `to` is provided, so non-router consumers are unaffected
2. **Ecosystem reality** — all identified consumers are Vue SPAs that already depend on vue-router
3. **Precedent** — Bootstrap Vue and Vuetify both accept this tradeoff

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
// Navigation
to: { type: [String, Object], default: null },
href: { type: String, default: null },

// Anchor/router-link attributes
target: { type: String, default: null },
rel: { type: String, default: null },
replace: { type: Boolean, default: false },
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
const computedTag = computed(() => {
  if (props.to) return resolveRouterLink(); // lazy resolution
  if (props.href) return 'a';
  return 'button';
});

const isLink = computed(() => !!(props.to || props.href));

const computedAttrs = computed(() => {
  if (props.to) {
    return {
      to: props.to,
      replace: props.replace,
      ...(props.disabled && { 'aria-disabled': 'true', tabindex: '-1' }),
    };
  }
  if (props.href) {
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
- `packages/dialtone-vue/components/button/button.test.js` — new test cases for `to`, `href`, and accessibility
- `apps/dialtone-documentation/docs/components/button.md` — document the new capability (see Documentation section)

### Complexity estimate

Moderate — not high:

- ~60-100 lines of new/changed code in the component
- ~100-150 lines of new tests
- Template change is small (`<button>` to `<component :is>`)
- Main work is conditional attribute handling, router-link resolution, and accessibility

## Test Plan

### Unit tests

Run: `pnpm nx run dialtone-vue:test -- --testPathPattern=button`

**New test cases needed:**

`href` rendering:

- Renders `<a>` when `href` is provided
- Does not render `<a>` when `href` is not provided (default `<button>`)
- Applies `href`, `target`, `rel` attributes on `<a>`
- Does not apply `type` attribute on `<a>`
- Applies `role="button"` on `<a>`
- Applies all button classes (`kind`, `importance`, `size`, `circle`) identically on `<a>`
- Slots (`default`, `icon`) render identically on `<a>`

`to` rendering:

- Renders `<router-link>` when `to` is provided
- Passes `to` and `replace` props to `<router-link>`
- `to` takes precedence over `href` when both are provided
- Does not apply `type` attribute on `<router-link>`
- Applies all button classes identically on `<router-link>`

Disabled state:

- `<a>` with `disabled`: renders `aria-disabled="true"`, `tabindex="-1"`, prevents click
- `<router-link>` with `disabled`: renders `aria-disabled="true"`, `tabindex="-1"`, prevents navigation
- `<button>` with `disabled`: unchanged behavior (native `disabled` attribute)

Keyboard accessibility:

- `<a>` responds to Space key (triggers click)
- `<a>` responds to Enter key (native behavior)

### Integration verification

1. Storybook: button-as-anchor and button-as-router-link render identically to current workarounds
2. Accessibility: keyboard test (Tab, Enter, Space all work correctly per element type)
3. Doc site: convert PageHeader.vue workarounds as proof-of-concept

## Documentation Plan

Update `apps/dialtone-documentation/docs/components/button.md` with a new section documenting `to` and `href` support. This should be a concise addition, not a major rewrite.

### New section: "Navigation" (after Variants, before Sizes)

Include a simple decision tree:

- **Navigating within the app?** Use `to` — renders `<router-link>` for client-side navigation without page reloads.
- **Linking to an external site?** Use `href` — renders `<a>` for standard browser navigation.
- **Triggering an action?** Use neither — renders `<button>` (default).

Provide before/after code examples showing the migration from raw `<a class="d-btn">` and `<router-link class="d-btn">` workarounds to the prop-based API.

### Update existing guidance

The current docs (line 20) state: "if it goes somewhere, it's a link (`<a>`). If an action occurs, use a Button (`<button>`)." This guidance remains correct for semantic intent. The new `to`/`href` props are specifically for cases where you need **button styling** with **navigation behavior** — a common pattern validated by the consuming product audit. Add a brief note clarifying this distinction.
