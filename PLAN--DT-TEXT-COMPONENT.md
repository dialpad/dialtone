# DtText Component — Implementation Plan v2

**Goal:** Stop utility class sprawl (`d-fs-300 d-fw-semibold d-lh-200`) → enforce tokens via component

---

## 📌 Changelog

- **2025-10-17** — Restructured plan with explicit token alignment guidance, introduced changelog + decision log scaffolding, and recorded research references for typography docs.
- **2025-10-17** — Added variant coverage requirements, semantic element guidance, SSR/test expectations, lint roadmap alignment, and initial decision log entries after principal review.
- **2025-10-19** — Implemented Vue 3 validations (strength/density/tone), refactored numeric/align CSS, added prop documentation, test coverage, tone token automation plan, and truncate accessibility follow-ups.

---

## ✅ Milestone Log

- **2025-10-17** — Completed base CSS (`packages/dialtone-css/lib/build/less/components/text.less`) and shared constants for Vue 2/3. Confirmed typography sources. Observed stylelint warnings about unknown rules on the new LESS file; will revisit once component wiring is complete.
- **2025-10-17** — Added Vue 3 exports (`packages/dialtone-vue3/components/text/index.js`, root index) so `DtText` is available to consumers. Storybook stories/tests still pending.

---

## 🎨 Naming Conventions (Critical)

**API:**

```html
<dt-text kind="headline" size="lg" as="h2">
  Text
</dt-text>
```

Renders as:

```html
<h2 class="d-text d-headline--lg">Text</h2>
```

---

## 🎯 The Problem

1. Devs bypass text styles (`d-headline--lg`) for utilities (`d-fs-300 d-fw-semibold`)
2. Inconsistent rendering across product
3. Industry standard → components over raw utilities (8/8 major design systems)
4. Solution → component enforces tokens, allows controlled overrides

---

## 🧱 Token & Utility Alignment (New)

- **Source of truth:** `apps/dialtone-documentation/docs/design/typography/index.md` and `apps/dialtone-documentation/docs/utilities/typography/` describe every `d-{kind}--{size}-{strength}-{density}` composition. These map to tokens exported via `@data/type.json` and `packages/dialtone-tokens/`.
- **Composed utilities:** Typography classes resolve to shorthand `font` declarations, bundling `font-size`, `line-height`, `font-weight`, and `font-family`. The component must read the same semantic contract instead of recomputing values.
- **Design tokens:** Weights (`var(--dt-font-weight-*)`), sizes (`var(--dt-font-size-*)`), and families (`var(--dt-font-family-*)`) live in `packages/dialtone-tokens/tokens` and stay themable through CSS variables. `DtText` should never hardcode numeric values—always emit classes or tokens.
- **ESLint guardrails:** `packages/eslint-plugin-dialtone/lib/rules/recommend-typography-style.js` warns when discrete utilities appear. `DtText` adoption reduces those warnings organically while keeping the rule as a safety net.
- **Fallback posture:** Keep base utilities intact for non-Vue contexts (emails, docs). `DtText` is an additive affordance layered on top of the existing utility scale.

---

### Variant Coverage Requirements

- **Enumerate available classes:** For each `kind`, list the valid `size`, `strength`, and `density` combinations that Dialtone currently exports. Use the canonical data source `apps/dialtone-documentation/docs/design/typography/index.md` (tables) and `@data/type.json` to avoid inventing unsupported modifiers.
- **Shared source of truth:** Publish the matrices in this plan and ship a mirrored reference within component docs so engineers know exactly which permutations are valid and which intentionally fall back.
- **Future additions:** Document how new styles (e.g., `headline--xxxl`, additional densities) will flow from tokens → utilities → component props to keep the contract coherent.

#### ✅ Variant Matrix (verified 2025-10-20)

| Kind | Size | Strength | Density | Utility Tokens |
| --- | --- | --- | --- | --- |
| headline | eyebrow | – | – | `d-headline--eyebrow` |
| headline | sm | soft | compact | `d-headline--sm`, `d-headline--sm-soft`, `d-headline--sm-compact`, `d-headline--sm-soft-compact` |
| headline | md | – | compact | `d-headline--md`, `d-headline--md-compact` |
| headline | lg | soft | compact | `d-headline--lg`, `d-headline--lg-soft`, `d-headline--lg-compact`, `d-headline--lg-soft-compact` |
| headline | xl | – | compact | `d-headline--xl`, `d-headline--xl-compact` |
| headline | xxl | – | compact | `d-headline--xxl`, `d-headline--xxl-compact` |
| body | sm | – | compact | `d-body--sm`, `d-body--sm-compact` |
| body | md | – | compact | `d-body--md`, `d-body--md-compact` |
| label | sm | plain | compact | `d-label--sm`, `d-label--sm-plain`, `d-label--sm-compact`, `d-label--sm-plain-compact` |
| label | md | plain | compact | `d-label--md`, `d-label--md-plain`, `d-label--md-compact`, `d-label--md-plain-compact` |
| helper | sm | – | – | `d-helper--sm` |
| helper | md | – | – | `d-helper--md` |
| code | sm | – | – | `d-code--sm` |
| code | md | – | – | `d-code--md` |

Source of truth cross-checked against `apps/dialtone-documentation/docs/_data/type.json`; storybook examples in `packages/dialtone-vue3/components/text/text_variants.story.vue` cover each combination.

#### 📄 Documentation & Content Plan

- **Component page draft:** Create `apps/dialtone-documentation/docs/components/text.md` covering usage, props, accessibility (truncate guidance), and variant tables (reuse matrix above).
- **Storybook notes:** Add summary of allowable combinations and tone guidance to `packages/dialtone-vue3/components/text/text.stories.js` `parameters.docs` block once content is ready.
- **API table:** Generate prop tables from source JSDoc, highlighting default slot vs `text` prop behavior.
- **Usage examples:** Include examples for headline, body, label/helper/code, numeric, truncation, alignment, and tone variations.
- **Docs navigation:** Update `apps/dialtone-documentation/docs/_data/site-nav.json` with `{ "text": "Text", "link": "/components/text.html" }` so the page appears in the Components sidebar.
- **Docs runtime fix:** `apps/dialtone-documentation/docs/.vuepress/theme/components/Page.vue` now guards `usePageData().git.updatedTime`; missing metadata returns "Not available" to prevent invalid date errors on new pages like `text.md`.

#### 🧪 SSR & Testing Strategy (Draft)

- **Nuxt harness:** Spin up minimal Nuxt 3 SSR fixture rendering `DtText` with `component :is=""`, hydrate on client, and assert no mismatch warnings.
- **Snapshot comparison:** Capture rendered markup to ensure merged `class` / `style` attributes behave identically between server and client.
- **Vite SSR smoke:** Add Vitest SSR run (using `vitest-ssr`) to render component to string for key prop permutations.
- **Integration hook:** Document how SSR tests gate future prop additions (update CI when harness lands).

#### 🧹 Lint & Messaging Alignment

- **ESLint warning copy:** Update lint rule messaging to point teams toward `DtText` rather than raw utilities (Phase 3 action item).
- **Component logs:** Replace `console.warn` usage in `packages/dialtone-vue3/components/text/text.vue` with centralized logger or dev-only warning helper to satisfy lint.

#### 🔁 Vue 2 Parity Prep

- **Component port:** After Vue 3 docs/tests ship, mirror implementation into `packages/dialtone-vue2/components/dt-text/` (component, constants, validators).
- **Story/Test updates:** Duplicate Storybook stories/tests for Vue 2 using existing patterns (`*.story.vue`, `*.test.js`).
- **Token sync:** Reuse generated tone tokens by exporting from shared location or packaging as JSON included in both builds.

---

## 📊 Architecture: Single Component

**Decision:** Single `DtText` component for all text kinds

```html
<dt-text kind="headline" size="lg" as="h2">Page Title</dt-text>
<dt-text kind="body" size="md" as="div">Body text</dt-text>
<dt-text kind="label" size="sm">Label text</dt-text>
```

Renders as:

```html
<h2 class="d-text d-headline--lg">Page Title</h2>
<div class="d-text d-body--md">Body text</div>
<span class="d-text d-label--sm">Label text</span>
```

**Why:**

- Dialtone already unified → `d-headline--lg`, `d-body--md`, `d-label--sm` all = "text styles"
- Single import, one mental model
- Easier migration from utilities → one component target
- Simpler for designers learning code

---

## 🔧 Component API

```typescript
interface DtTextProps {
  // Semantic
  as?: string  // Any HTML element (no validator — follows Stack pattern)

  // Typography scale (optional — no classes if omitted)
  kind?: 'headline' | 'body' | 'label' | 'helper' | 'code'
  size?: KindSize  // Defaults to 'md' if kind is set, contextual: eyebrow/sm/md/lg/xl/xxl

  // Dialtone modifiers (optional — no classes if omitted)
  strength?: 'soft' | 'plain'  // headline-soft, label-plain
  density?: 'compact'           // tighter line-height

  // Overrides (optional — inherits if nested)
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string  // CSS color or token — no default, inherits naturally
  align?: 'start' | 'center' | 'end' | 'justify'  // Logical values (RTL-friendly)

  // Features
  truncate?: boolean   // single-line ellipsis via d-truncate
  maxLines?: number    // multi-line truncation via line-clamp (a11y: content still announced)
  numeric?: boolean    // tabular-nums for data
  text?: string        // Alternative to slot — both work

  // Escape hatch
  class?: string
}
```

### Class Composition Priority

```html
<!-- Base: d-text (always present) -->
<!-- 1. No props → minimal markup -->
<dt-text>Hello</dt-text>
<!-- Renders: <span class="d-text">Hello</span> -->

<!-- 2. Kind with default size → d-text d-headline--md -->
<dt-text kind="headline">Title</dt-text>
<!-- Renders: <span class="d-text d-headline--md">Title</span> -->

<!-- 3. Kind + size → d-text d-headline--lg -->
<dt-text kind="headline" size="lg">Title</dt-text>
<!-- Renders: <span class="d-text d-headline--lg">Title</span> -->

<!-- 4. Modifiers → d-text d-headline--lg-compact -->
<dt-text kind="headline" size="lg" density="compact">Compact Title</dt-text>
<!-- Renders: <span class="d-text d-headline--lg-compact">Compact Title</span> -->

<!-- 5. Overrides → d-text d-headline--lg-compact d-fw-bold -->
<dt-text kind="headline" size="lg" density="compact" weight="bold">Bold Title</dt-text>
<!-- Renders: <span class="d-text d-headline--lg-compact d-fw-bold">Bold Title</span> -->

<!-- 6. Features → d-text d-truncate d-fvn-tabular -->
<dt-text truncate numeric>123.456</dt-text>
<!-- Renders: <span class="d-text d-truncate d-fvn-tabular">123.456</span> -->

<!-- 7. Multi-line truncation → class + custom property -->
<dt-text :max-lines="3">Long content...</dt-text>
<!-- Renders: <span class="d-text d-text__clamp" style="--dt-text-line-clamp: 3">Long content...</span> -->

<!-- 8. Text prop → alternative to slot -->
<dt-text text="Hello" />
<!-- Renders: <span class="d-text">Hello</span> -->
<!-- Same as: <dt-text>Hello</dt-text> -->
```

### Color Inheritance (Natural)

```html
<!-- Parent defines color → children inherit automatically -->
<dt-text color="critical">
  Red text
  <dt-text>This inherits red (no color prop needed)</dt-text>
</dt-text>

<!-- Renders: -->
<span class="d-text d-fc-critical">
  Red text
  <span class="d-text">This inherits red (no color prop needed)</span>
</span>

<!-- Nested inheritance works naturally via CSS -->
<dt-text color="success">
  Green parent
  <dt-text>Green child inherits via CSS cascade</dt-text>
</dt-text>

<!-- Renders: -->
<span class="d-text d-fc-success">
  Green parent
  <span class="d-text">Green child inherits via CSS cascade</span>
</span>
```

---

## 🚀 Migration Strategy (Non-Breaking)

### Current State (Analyzed)

- **193 Vue3 component files**
- **59 text style occurrences** across 8 files
- **28 font-size utilities** across 10 files
- **Most components (95%) don't use text styles directly**
- Example pattern: `DtEmptyState` uses constants → classes, not components

### ✅ **Phase 1: Coexistence ()**

**CSS classes stay forever** — no deprecation:

```html
<!-- ✅ OLD: Still works, always will -->
<div class="d-headline--lg">Title</div>

<!-- ✅ NEW: Opt-in alternative -->
<dt-text kind="headline" size="lg">Title</dt-text>
<!-- Renders: <span class="d-text d-headline--lg">Title</span> -->

<!-- ✅ BOTH: Can coexist -->
<dt-text kind="headline" size="lg">New</dt-text>
<p class="d-body--md">Legacy</p>
<!-- Renders:
<span class="d-text d-headline--lg">New</span>
<p class="d-body--md">Legacy</p>
-->
```

**Why keep CSS classes:**

- Emails, static HTML, markdown
- Non-Vue contexts (marketing sites, docs)
- Quick prototypes
- Existing code that works

**Strategy:** Add new, don't remove old

### 🎯 **Phase 2: New Code Adoption ()**

**Target: New features only**

- Docs say: "Prefer `<dt-text>` for new components"
- Existing components unchanged
- No mandate, no deadlines

**Metrics:**

- 50%+ new PRs use `<dt-text>`
- 70%+ new code uses component
- ESLint nudge: "Consider `<dt-text>` for 3+ typography utilities" (warning, not error)

### 📝 **Phase 3: Opportunistic Refactoring ()**

**Tier 1 — Easy Wins ():**

- Update Dialtone story files (`*_default.story.vue`, `*_variants.story.vue`)
- 8-10 files total
- Zero consumer impact (stories = docs examples)

**Tier 2 — Major Refactors Only ():**

- When component gets rewritten for new features → consider `<dt-text>`
- Example: `DtEmptyState` constants → component props
- Not required, just opportunistic

**Tier 3 — Consumer Products (+, Organic):**

- Never mandate refactoring
- Teams adopt naturally when touching files
- ESLint gentle nudge (not blocking)

### ❌ **What We DON'T Do**

- ❌ Deprecate CSS classes (foundational primitives)
- ❌ Mandate refactoring timelines
- ❌ Breaking changes
- ❌ Console warnings on existing code
- ❌ Refactor all 193 components

### 🎯 **Migration Decision Tree**

```
Writing NEW code?
├─ YES → Use <dt-text>
└─ NO → Major refactor?
    ├─ YES → Consider <dt-text> (optional)
    └─ NO → Leave alone
```

---

### Responsive Props: Object Syntax

```html
<!-- Chakra pattern — object syntax -->
<dt-text kind="headline" :size="{ mobile: 'sm', desktop: 'lg' }">Responsive</dt-text>
<!-- Renders: <span class="d-text d-headline--sm d-headline--lg@desktop">Responsive</span> -->

<!-- NOT array syntax -->
<dt-text :size="['sm', 'md', 'lg']" />
<!-- ❌ Not supported -->
```

**Why:** Familiar to Chakra/Radix users, TypeScript-friendly, composable

**Implementation:** Phase 2 (after validating base component)

### Precision Overrides: Tiered System

**Tier 1 (Common):** Always available, token-mapped

```html
<dt-text weight="bold" color="critical" align="center">Centered Error</dt-text>
<!-- Renders: <span class="d-text d-fw-bold d-fc-critical d-ta-center">Centered Error</span> -->
```

**Tier 2 (Advanced):** Available but "use sparingly"

```html
<dt-text numeric>1,234.56</dt-text>
<!-- Renders: <span class="d-text d-fvn-tabular">1,234.56</span> -->
```

**Tier 3 (Escape):** Linted warning

```html
<dt-text class="custom" style="...">Custom</dt-text>
<!-- Renders: <span class="d-text custom" style="...">Custom</span> -->
<!-- ⚠️ ESLint: "Consider token-mapped props" -->
```

---

## 🛠️ Implementation: Vue 2 & 3 (Options API, JavaScript)

### Required Patterns (Audited from Existing Components)

| Pattern | Vue 2 | Vue 3 | DtText Must Use |
|---------|-------|-------|-----------------|
| **API** | Options API | Options API | ✅ Options (NOT Composition) |
| **Language** | JavaScript | JavaScript | ✅ JavaScript (no TS in .vue) |
| **Constants** | `_constants.js` | `_constants.js` | ✅ Separate file |
| **Polymorphic** | `<component :is>` | `<component :is>` | ✅ Template syntax |
| **Parity** | ~99% identical | ~99% identical | ✅ Near-identical code |
| **Slots** | `$slots.default` | `hasSlotContent()` | ✅ Version-specific |
| **Compat** | N/A | `compatConfig: { MODE: 3 }` | ✅ Vue3 only |

### File Structure

```
packages/dialtone-css/lib/build/less/components/
└── text.less                   # Component styles: .d-text, .d-text__clamp

packages/dialtone-vue3/components/text/
├── text.vue                    # Options API, JavaScript
├── text_constants.js           # All constants/mappers
├── text.stories.js
├── text.test.js
├── text.mdx
├── text_default.story.vue
└── text_variants.story.vue

packages/dialtone-vue2/components/text/
└── (identical structure, 99% same code)
```

### Component Scaffold (Vue 3)

```html
<template>
  <component
    :is="as"
    :class="textClasses"
    :style="textStyles"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<script>
import { hasSlotContent } from '@/common/utils';
import {
  TEXT_KIND_MODIFIERS,
  TEXT_SIZE_MODIFIERS,
  TEXT_WEIGHT_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
} from './text_constants';

export default {
  compatConfig: { MODE: 3 },
  name: 'DtText',

  props: {
    kind: {
      type: String,
      default: null,  // Optional — no class if omitted
      validator: (k) => {
        if (!k) return true;
        const valid = Object.keys(TEXT_KIND_MODIFIERS);
        if (!valid.includes(k)) {
          console.warn(
            `[DtText] Invalid kind="${k}". Valid options: ${valid.join(', ')}`
          );
          return false;
        }
        return true;
      },
    },

    size: {
      type: String,
      default: 'md',  // Default only used when kind is set
      validator: (s, props) => {
        // Size validation is contextual to kind
        if (!props.kind) return true;
        const validSizes = TEXT_SIZE_MODIFIERS[props.kind];
        if (!validSizes || !validSizes.includes(s)) {
          console.warn(
            `[DtText] Invalid size="${s}" for kind="${props.kind}". Valid sizes: ${validSizes?.join(', ') || 'none'}`
          );
          return false;
        }
        return true;
      },
    },

    as: {
      type: String,
      default: 'span',  // No validator — any string accepted
    },

    // NOTE: Caller must select semantically correct element (e.g., h1-h6 for headlines).
    // Provide documentation guidance + Storybook examples enforcing accessible defaults.

    color: {
      type: String,
      default: null,  // No default → inherits naturally
      // No validator — freeform (maps to d-fc-{color})
    },

    align: {
      type: String,
      default: null,
      validator: (a) => {
        if (!a) return true;
        const valid = ['start', 'center', 'end', 'justify'];
        if (!valid.includes(a)) {
          console.warn(
            `[DtText] Invalid align="${a}". Valid options: ${valid.join(', ')}. Note: 'start' maps to 'left' in LTR, 'right' in RTL.`
          );
          return false;
        }
        return true;
      },
    },

    weight: {
      type: String,
      default: null,
      validator: (w) => {
        if (!w) return true;
        const valid = Object.keys(TEXT_WEIGHT_MODIFIERS);
        if (!valid.includes(w)) {
          console.warn(
            `[DtText] Invalid weight="${w}". Valid options: ${valid.join(', ')}`
          );
          return false;
        }
        return true;
      },
    },

    strength: {
      type: String,
      default: null,
      validator: (s) => {
        if (!s) return true;
        const valid = ['soft', 'plain'];
        if (!valid.includes(s)) {
          console.warn(
            `[DtText] Invalid strength="${s}". Valid options: ${valid.join(', ')}`
          );
          return false;
        }
        return true;
      },
    },

    density: {
      type: String,
      default: null,
      validator: (d) => {
        if (!d) return true;
        if (d !== 'compact') {
          console.warn(
            `[DtText] Invalid density="${d}". Valid option: 'compact'`
          );
          return false;
        }
        return true;
      },
    },

    truncate: {
      type: Boolean,
      default: false,
    },

    maxLines: {
      type: Number,
      default: null,
      validator: (n) => {
        if (!n) return true;
        if (n < 1) {
          console.warn(
            `[DtText] Invalid maxLines="${n}". Must be a positive integer.`
          );
          return false;
        }
        return true;
      },
    },

    numeric: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      hasSlotContent,
    };
  },

  computed: {
    textClasses () {
      return [
        'd-text',  // Base class always present
        this.getKindSizeClass(),
        this.weight && TEXT_WEIGHT_MODIFIERS[this.weight],
        this.color && `d-fc-${this.color}`,  // e.g., color="critical" → d-fc-critical
        this.align && TEXT_ALIGN_MODIFIERS[this.align],
        this.truncate && 'd-truncate',
        this.maxLines && 'd-text__clamp',  // Add clamp class when maxLines is set
        this.numeric && 'd-fvn-tabular',
      ].filter(Boolean);
    },

    textStyles () {
      // Only custom property for line-clamp amount
      if (!this.maxLines) return null;

      return {
        '--dt-text-line-clamp': this.maxLines,
      };
    },
  },

  methods: {
    getKindSizeClass () {
      const { kind, size, strength, density } = this;

      // No kind → no class
      if (!kind) return null;

      // Build: d-{kind}--{size}-{strength}-{density}
      let className = `d-${kind}--${size}`;
      if (strength) className += `-${strength}`;
      if (density) className += `-${density}`;

      return className;
    },
  },
};
</script>
```

### Component CSS (text.less)

```less
//
//  DIALTONE
//  COMPONENTS: TEXT
//
//  These are text component classes for Dialpad's design system Dialtone.
//  For further documentation of these and other classes,
//  visit https://dialtone.dialpad.com/components/text
//
//  TABLE OF CONTENTS
//  • BASE STYLE
//  • LINE CLAMP
//
//  ============================================================================
//  $   BASE STYLE
//  ----------------------------------------------------------------------------

.d-text {
  // Base text component class
  // Minimal styling - typography comes from kind/size classes
}

//  ============================================================================
//  $   LINE CLAMP
//  ----------------------------------------------------------------------------

.d-text__clamp {
  --dt-text-line-clamp: 1;  // Default to 1 line if not specified

  display: -webkit-box;
  -webkit-line-clamp: var(--dt-text-line-clamp);
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Constants File

```javascript
// text_constants.js

// Kind → size mapping
export const TEXT_SIZE_MODIFIERS = {
  headline: ['eyebrow', 'sm', 'md', 'lg', 'xl', 'xxl'],
  body: ['sm', 'md'],
  label: ['sm', 'md'],
  helper: ['sm', 'md'],
  code: ['sm', 'md'],
};

export const TEXT_KIND_MODIFIERS = {
  headline: 'd-headline',
  body: 'd-body',
  label: 'd-label',
  helper: 'd-helper',
  code: 'd-code',
};

export const TEXT_WEIGHT_MODIFIERS = {
  normal: 'd-fw-normal',
  medium: 'd-fw-medium',
  semibold: 'd-fw-semibold',
  bold: 'd-fw-bold',
};

export const TEXT_ALIGN_MODIFIERS = {
  start: 'd-ta-left',      // Prop: start → Class: left (browsers handle RTL)
  center: 'd-ta-center',
  end: 'd-ta-right',       // Prop: end → Class: right (browsers handle RTL)
  justify: 'd-ta-justify',
};

// Note: color prop is freeform (e.g., color="critical" → class="d-fc-critical")
// No constants needed — maps directly to Dialtone foreground color utilities

export default {
  TEXT_SIZE_MODIFIERS,
  TEXT_KIND_MODIFIERS,
  TEXT_WEIGHT_MODIFIERS,
  TEXT_ALIGN_MODIFIERS,
};
```

### Vue 2 Differences

```html
<!-- Identical except: -->
<script>
import Vue from 'vue';  // Not: import { warn } from 'vue'

export default {
  // No compatConfig
  name: 'DtText',

  methods: {
    hasDefaultSlot () {
      return !!this.$slots.default;  // Direct access, not hasSlotContent()
    },
  },
};
</script>
```

---

## 📋 Implementation Phases

### Phase 1: MVP (Vue 3 First)

**Goal:** Ship functional Vue 3 component mapping to existing tokens (Vue 2 begins only after Vue 3 parity achieved)

**Tasks:**

- [x] Create CSS file: `packages/dialtone-css/lib/build/less/components/text.less`
- [x] Implement `.d-text` base class and `.d-text__clamp` with custom property
- [x] Create component scaffold (Vue 3)
- [x] Implement `kind`, `size`, `strength`, `density`, `as` props (Vue 3)
- [x] Map to existing CSS classes (`d-headline--lg-compact`)
- [x] Add overrides: `tone`, `align` (render `d-text--align-*` classes with matching CSS in `packages/dialtone-css/lib/build/less/components/text.less`)
- [x] Add comprehensive prop validators with clear error messages
- [x] Single-line `truncate` (boolean → `d-truncate` class)
- [x] Multi-line `maxLines` (number → `d-text__clamp` class + `--dt-text-line-clamp` custom property)
- [x] `text` prop (alternative to slot)
- [x] `numeric` prop applies new `d-text--numeric` class (replace utility usage with component-local style token)
- [x] TypeScript defs via JSDoc (Vue 3)
- [x] Unit tests (class composition, truncation, color inheritance, text prop, validators) (Vue 3)
- [x] Ensure `d-text__clamp` styles are bundled/imported so multi-line truncation works as expected
- [x] Storybook stories (Vue 3)
- [x] Update package exports (`packages/dialtone-vue3/components/text/index.js`, root `packages/dialtone-vue3/index.js`)
- [x] Restrict `strength` prop usage to kinds that support it; emit warnings otherwise
- [x] Remove `weight` prop from API (avoid redundancy with strength)
- [x] Implement prop validation for `tone` that warns when the supplied token does not map to known `d-fc-*` utilities; ensure theming coverage (Vue 3)
- [ ] Cross-check rendered classes against `@data/type.json` fixture expectations to guarantee parity with documentation tables
- [ ] Document variant matrices mapping `kind` × `size` × `strength` × `density` to concrete utility classes
- [ ] Automate tone token list generation to avoid manual curation (pull from `packages/dialtone-css/lib/dist/dialtone-docs.json` with an exclusion list for base colors like `red-400`)
- [ ] Author component documentation in `apps/dialtone-documentation/docs/components/` covering usage, props, and design guidance
- [ ] Add SSR/hydration test plan (Nuxt/Vite SSR harness) validating `<component :is>` output and merged `class`/`style` attributes (Vue 3)
- [ ] After Vue 3 parity, mirror implementation to Vue 2 (component, exports, tests, stories)
- [ ] **Lint rule alignment** — ESLint warning currently references only utilities. Action: update messaging in Phase 3 to recommend `<dt-text>` when feasible without breaking downstream pipelines.
- **Notes:** Auto-applying `title` works only when using the `text` prop. Slot content is harder to mirror reliably, and screen readers may need explicit tooltip/ARIA strategies. Likely outcome: document guidance for product teams rather than auto behavior.
- **Deferred:**
  - Investigate truncate accessibility (auto `title` vs ARIA attributes vs consumer guidance) and document recommendation
  - Implement or document `truncate` UX decision (e.g., add `title` automatically or require consumer opt-in)
- [ ] **Lint rule alignment** — ESLint warning currently references only utilities. Action: update messaging in Phase 3 to recommend `<dt-text>` when feasible without breaking downstream pipelines.
- **SSR coverage** — Hydration behavior untested; must add Nuxt/Vite SSR verification before GA. Action: include in MVP QA checklist.

---

## 🗂️ TODO Backlog

- **Document variant matrices** — Derive explicit `kind` × `size` × `strength` × `density` tables from `@data/type.json` and embed them here plus component docs. Until populated, note that unused combinations may yield no-op (ghost) props.
- **Define SSR harness** — Specify the Nuxt/Vite SSR test workflow that validates hydration, `<component :is>` output, and attribute merging for `<dt-text>`.
- **Enumerate color tokens** — Partner with the tokens team to publish a consumable list of supported `d-fc-*` utilities; wire that into prop validation once available.
- **Next up:** Implement Vue 3 component scaffold, mirror in Vue 2, and add stories/tests per plan.

---

**Deliverable:**

```html
<!-- Basic usage -->
<dt-text kind="headline" size="lg" as="h2">Page Title</dt-text>
<!-- Renders: <h2 class="d-text d-headline--lg">Page Title</h2> -->

<!-- Text prop (alternative to slot) -->
<dt-text kind="headline" size="lg" as="h2" text="Page Title" />
<!-- Renders: <h2 class="d-text d-headline--lg">Page Title</h2> -->

<!-- With overrides -->
<dt-text kind="body" size="md" weight="bold" color="critical">
  Error message
</dt-text>
<!-- Renders: <span class="d-text d-body--md d-fw-bold d-fc-critical">Error message</span> -->

<!-- Single-line truncation -->
<dt-text truncate>Long text that truncates with ellipsis...</dt-text>
<!-- Renders: <span class="d-text d-truncate">Long text that truncates with ellipsis...</span> -->

<!-- Multi-line truncation (Atlassian pattern) -->
<dt-text :max-lines="3">
  Very long text that will be truncated after three lines with ellipsis.
  Screen readers still announce the full content.
</dt-text>
<!-- Renders: <span class="d-text d-text__clamp" style="--dt-text-line-clamp: 3">Very long text...</span> -->

<!-- Logical alignment (RTL-friendly) -->
<dt-text align="start">Aligns to start (left in LTR, right in RTL)</dt-text>
<!-- Renders: <span class="d-text d-ta-left">Aligns to start (left in LTR, right in RTL)</span> -->

<dt-text align="end">Aligns to end (right in LTR, left in RTL)</dt-text>
<!-- Renders: <span class="d-text d-ta-right">Aligns to end (right in LTR, left in RTL)</span> -->

<!-- Color inheritance -->
<dt-text color="success">
  Green parent
  <dt-text>Green child (inherits naturally)</dt-text>
</dt-text>
<!-- Renders:
<span class="d-text d-fc-success">
  Green parent
  <span class="d-text">Green child (inherits naturally)</span>
</span>
-->
```

**Success:**

- ✅ All Dialtone text styles representable
- ✅ TypeScript autocomplete works
- ✅ 100% test coverage
- ✅ Storybook shows all variants

### Phase 2: Enhanced Features ()

**Goal:** Add advanced features

**Tasks:**

- [ ] Advanced overrides: `maxWidth`
- [ ] Features: `decorate`, `nowrap`
- [ ] Responsive props: `{ mobile: 'sm', desktop: 'lg' }`
- [ ] Update Storybook

**Deferred to future:**

- I18n: `lang`, `dir` props
- Fluid typography (clamp)

**Success:**

- ✅ Advanced overrides working
- ✅ Responsive props across breakpoints

### Phase 3: Developer Experience ()

**Goal:** Make discoverable and easy to adopt

**Tasks:**

- [ ] ESLint rule: warn on 3+ typography utilities
- [ ] Codemod: utility patterns → component
- [ ] VSCode snippet: `dttext` → full template
- [ ] Migration guide
- [ ] Design token docs (link props → tokens)
- [ ] A11y guide (semantic HTML)
- [ ] Add Dialtone documentation section cross-linking to typography pages so designers see component + style parity
- [ ] Update `packages/eslint-plugin-dialtone/lib/rules/recommend-typography-style.js` messaging once `<dt-text>` is available (nudge toward component while respecting legacy utilities)
- [ ] Extend documentation site (`apps/dialtone-documentation/docs/design/typography/index.md`) with component usage tabs alongside existing utility tables

**Deliverable:**

```bash
# ESLint catches:
<p class="d-fs-300 d-fw-semibold d-lh-200 d-fc-primary">
⚠️ Consider <dt-text>

# Codemod converts:
<dt-text kind="body" size="md" weight="semibold" color="primary">
```

**Success:**

- ✅ ESLint rule deployed
- ✅ Codemod handles 80% of common patterns
- ✅ Migration guide published

### Phase 4: Ecosystem ()

**Goal:** Full integration

**Tasks:**

- [ ] Global provider: `<dt-provider direction="rtl">`
- [ ] Theme integration: custom kind mappings
- [ ] Figma component mapping docs
- [ ] Usage analytics
- [ ] Performance audit

**Success:**

- ✅ Provider pattern working
- ✅ Zero perf impact
- ✅ 50%+ adoption in new code

---

## ✅ Success Metrics

### Technical

- ✅ Vue 2/3 render identical HTML
- ✅ All text styles representable via props
- ✅ Zero runtime errors/warnings
- ✅ 100% test coverage on class composition
- ✅ A11y audit passes (semantic HTML)
- ✅ Bundle size < 2KB gzipped

### Developer Experience

- ✅ Prop autocomplete in VS Code
- ✅ Invalid combos show clear warnings
- ✅ Storybook shows all variants
- ✅ Migration guide published
- ✅ Component in Dialtone docs

### Adoption (Non-Breaking)

- **** 50%+ new PRs use `<dt-text>`
- **** 70%+ new code uses component
- **** Dialtone story files updated
- **** 5-10 components opportunistically refactored
- **Long-term:** CSS classes still used (emails, static HTML) — and that's fine

---

## 📚 Documentation Strategy

### In DtText Docs

```markdown
## When to Use

✅ **Use `<dt-text>`:**
- New Vue components
- Complex needs (truncation, i18n, responsive)
- Enforce tokens programmatically

✅ **Use CSS classes:**
- Emails, static HTML
- Quick prototypes
- Non-Vue contexts
- Existing code that works


---

## 🎯 Final Recommendation

**Start Single Component** (`DtText`) because:

1. ✅ Matches Dialtone's unified system
2. ✅ Easier migration (one target)
3. ✅ Lower entry barrier (one import)
4. ✅ Can split later if user research shows benefit
5. ✅ 6/8 major systems use single component

**Implementation: 4-Phase Rollout**

1. MVP → Core component mapping tokens
2. Enhanced → Advanced features, responsive props
3. DX → ESLint, codemods, migration guides
4. Ecosystem → Provider, theme integration, analytics

**Migration: Non-Breaking, Opt-In**

- CSS classes stay forever (emails, static HTML, non-Vue)
- Component = new alternative, not replacement
- Gradual adoption over 12-18 months
- No deprecation, no mandate, no breaking changes

---

## 📖 References

### Design Systems Analyzed

- Material UI, Chakra UI, Radix, Primer, Polaris, Adobe Spectrum, IBM Carbon
- **Atlassian Design System** (deep dive — influenced final design)
- Element Plus, Ant Design Vue, Vuetify, Naive UI (Vue 3)

### Atlassian Design System Deep Dive

**Components researched:**

- [Text primitive](https://atlassian.design/components/primitives/text/) — body text component
- [Heading](https://atlassian.design/components/heading/) — heading component
- [Forge UI Kit docs](https://developer.atlassian.com/platform/forge/ui-kit/components/text/)

**Key features adopted:**

1. `maxLines` prop → multi-line truncation via line-clamp
2. Logical alignment (`start`/`end`) → RTL-friendly
3. Optional `color` prop → natural CSS inheritance
4. Accessibility → line-clamp preserves screen reader announcement

**Atlassian Text API:**

- Props: `size` (small/medium/large), `as` (em/p/span/strong/strike), `color` (token/inherit), `maxLines` (number), `weight`, `align`
- Split architecture: separate Text + Heading components
- Color inheritance: nested Text components inherit parent color

### Dialtone Resources

- [Typography](https://dialtone.dialpad.com/design/typography/)
- [Utilities](https://dialtone.dialpad.com/utilities/)
- Current pattern audit: 193 Vue3 components, 14 use `kind` prop, 0 use `variant`
