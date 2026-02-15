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

All visual rendering (`kind`, `importance`, `size`, `circle`, etc.) flows through the `buttonClasses()` method in `button.vue`, which computes CSS classes purely from prop values and never references the root element tag. The classes (`d-btn`, `d-btn--muted`, `d-btn--primary`, etc.) are applied via `:class` on the root element and work identically on `<button>`, `<a>`, and `<router-link>`. The inner `<span>` structure for icon and label also stays the same. Only which HTML attributes get applied to the root element changes.

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

When DtButton renders as `<a>` or `<router-link>`:

1. **No `role="button"`** — The element navigates, so the native link role is semantically correct. Screen reader users should know the element will navigate. This matches Bootstrap Vue and Vuetify behavior (neither adds `role="button"` to navigating elements).
2. **Space key handler** — `<a>` elements only respond to Enter. Buttons respond to both Enter and Space. Since DtButton looks like a button, users may expect Space to work. A keydown handler triggers click on Space.
3. **`disabled` state** — `disabled` attribute doesn't exist on `<a>`. Use `aria-disabled="true"` + `tabindex="-1"` + prevent click handler with `stopImmediatePropagation`. `href` is also removed when disabled to prevent navigation.
4. **`type` prop** — Omitted from the rendered `<a>` element (only valid on `<button>`).
5. **`href`, `target`, `rel`** — Only rendered on `<a>`, not `<button>`.

## Implementation Milestones

### Milestone 1: Core component changes (button.vue) — DONE

- [x] Add `to`, `href`, `target`, `rel`, `replace` props
- [x] Change template from `<button>` to `<component :is="computedTag">`
- [x] Add `computedTag`, `computedAttrs`, `computedListeners`, `isNativeButton` computed properties
- [x] Lazy-resolve `RouterLink` via `resolveComponent('RouterLink')` with `<a>` fallback
- [x] Space key handler for link elements
- [x] Disabled state: `aria-disabled`, `tabindex=-1`, remove `href`, prevent click with `stopImmediatePropagation`
- [x] No `role="button"` — navigating elements keep native link role
- [x] Prop descriptions reference activating prop (`href`/`to`) not rendered element

### Milestone 2: Unit tests — DONE

14 new tests in `button.test.js` (48 total, up from 34):

- [x] `href` rendering: `<a>` tag, `href`/`target`/`rel` attributes, no `role="button"`
- [x] `to` rendering: `<router-link>` stub, passes `to`/`replace` props, precedence over `href`
- [x] Disabled state: `<a>` (aria-disabled, tabindex, no href, prevents click), `<router-link>` (aria-disabled, tabindex), `<button>` (native disabled unchanged)
- [x] Keyboard: Space key on `<a>` triggers click, disabled `<a>` blocks Space

### Milestone 3: Storybook stories — DONE

- [x] Update `button_default.story.vue` to pass through new props
- [x] Add `href` navigation variant to `button_variants.story.vue` (no `to` variant — Storybook has no vue-router)
- [x] Add Storybook controls for `to`, `href`, `target` (dropdown), `rel`, `replace`

### REVIEW CHECKPOINT 1 — DONE

- [x] Review component code changes in `button.vue`
- [x] Review test results
- [x] Visually verify Storybook `components-button--variants` navigation section
- [x] Confirm visual parity with existing `d-btn` class workarounds

### Milestone 4: Documentation (button.md) — DONE

- [x] Add "Navigation" section after Variants, before Sizes
- [x] Decision tree: `to` vs `href` vs neither
- [x] Before/after migration examples (Migration subsection)
- [x] Clarify link-vs-button guidance in Usage section
- [x] Update Accessibility section (outdated `role="button"` guidance replaced)

### Milestone 5: Migrate doc site workarounds — DONE

- [x] PageHeader.vue: Storybook + Figma `<a class="d-btn">` → `<dt-button href="..." kind="muted" importance="clear">`
- [x] Navbar.vue: `<router-link class="d-btn">` nav links → `<dt-button :to="..." kind="muted" importance="clear" :active="...">`
- [x] Navbar.vue: Storybook, GitHub, Codepen `<a class="d-btn d-btn--icon-only">` → `<dt-button href="..." kind="muted" importance="clear" aria-label="...">`
- [x] BaseIcon.vue: Figma `<a class="d-btn">` → `<dt-button :href="figmaLink" kind="muted" importance="clear">`

### Milestone 6: Refactor `<router-link custom>` wrapping DtButton — DONE

Replaced verbose `<router-link v-slot="{ navigate }" custom>` wrappers with DtButton's `to` prop.

- [x] Page.vue: prev/next navigation buttons — direct `to` prop replacement
- [x] Home.vue: "Get Started" and "What's New?" CTAs — removed `role="link"` and `@keypress.enter` (both unnecessary with `to` prop), kept analytics `@click`
- [x] Home.vue: "Make a request" and "Report a bug" `<a class="d-btn d-btn--muted d-btn--outlined d-btn--lg">` → `<dt-button href="..." kind="muted" importance="outlined" size="lg">`
- [x] SidebarItem.vue: main item + sub-item — refactored `isActiveLink` to compute from `useRoute()` instead of router-link's `isExactActive` scoped slot, simplified `handleAnchorClick` to drop `navigate` parameter, items without `link` render as `<button>` (no `to` prop)

### REVIEW CHECKPOINT 2 — DONE

- [x] Review documentation page for button
- [x] Visually verify Page.vue prev/next navigation
- [x] Visually verify Home.vue CTA buttons + confirm analytics still fire
- [x] Visually verify Home.vue "Make a request" / "Report a bug" external links
- [x] Visually verify SidebarItem.vue sidebar navigation + active state highlighting
- [x] Confirm all migrated buttons render identically to old workarounds
- [ ] Confirm all migrated buttons render identically to old workarounds

## Implementation Details

### New props

```js
to: { type: [String, Object], default: null },
href: { type: String, default: null },
target: { type: String, default: null },
rel: { type: String, default: null },
replace: { type: Boolean, default: false },
```

### Template change

```vue
<!-- From -->
<button :class="..." :type="type" :disabled="disabled" v-on="buttonListeners">

<!-- To -->
<component :is="computedTag" :class="..." v-bind="computedAttrs" v-on="computedListeners">
```

### Computed logic (as implemented)

```js
computedTag () {
  if (this.to) return this.resolveRouterLink();
  if (this.href) return 'a';
  return 'button';
},

computedAttrs () {
  if (this.to) {
    return {
      to: this.to,
      replace: this.replace,
      ...(this.disabled && { 'aria-disabled': 'true', tabindex: '-1' }),
    };
  }
  if (this.href) {
    return {
      href: this.disabled ? null : this.href,
      target: this.target,
      rel: this.rel,
      ...(this.disabled && { 'aria-disabled': 'true', tabindex: '-1' }),
    };
  }
  return {
    type: this.type,
    disabled: this.disabled,
  };
},
```

### Files modified

- `packages/dialtone-vue/components/button/button.vue` — template + props + computed logic
- `packages/dialtone-vue/components/button/button.test.js` — 14 new test cases
- `packages/dialtone-vue/components/button/button.stories.js` — Storybook controls for new props
- `packages/dialtone-vue/components/button/button_default.story.vue` — pass through new props
- `packages/dialtone-vue/components/button/button_variants.story.vue` — `href` navigation variant

### Files not modified

- `packages/dialtone-vue/components/button/button_constants.js` — no new validators needed

## Test Plan

### Unit tests

Run: `pnpm exec vitest run --test-timeout=10000 components/button/button.test.js`

14 new tests covering actual new behaviors:

`href` rendering:

- Renders `<a>` when `href` is provided
- Applies `href`, `target`, `rel` attributes on `<a>`
- Does not apply `role="button"` (element navigates, native link role is correct)

`to` rendering:

- Renders `<router-link>` when `to` is provided
- Passes `to` and `replace` props to `<router-link>`
- `to` takes precedence over `href` when both are provided

Disabled state:

- `<a>` with `disabled`: `aria-disabled="true"`, `tabindex="-1"`, no `href`, prevents click
- `<router-link>` with `disabled`: `aria-disabled="true"`, `tabindex="-1"`
- `<button>` with `disabled`: unchanged behavior (native `disabled` attribute)

Keyboard accessibility:

- `<a>` responds to Space key (triggers click)
- Disabled `<a>` blocks Space key

### Integration verification

1. Storybook: `components-button--variants` shows `href` navigation variant
2. Doc site: Milestone 5 converts workarounds as proof-of-concept (also validates `to` prop with real vue-router)

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
