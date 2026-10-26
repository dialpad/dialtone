# Vue Component Rules

Apply to `packages/dialtone-vue/components/**`. These are shared authoring rules; the client entrypoints choose when to read them.

## API Style

- **New components**: Composition API with `<script setup lang="ts">`. Use `defineProps`, `defineEmits`, `defineSlots`.

- **Existing components**: Options API with `compatConfig: { MODE: 3 }`. Do NOT convert unless explicitly asked.

## Props

- Use `validator` — NEVER `validate`. Vue silently ignores `validate`.
- Import allowed values from the component's current constants module (`*Constants.js` or `*Constants.ts`) or an existing shared constants module in component validators; never hardcode valid value arrays in components. Validator tests may declare expected public values independently of production constants.
- Add JSDoc with `@values` annotation.
- Boolean visibility toggles: use positive polarity (`showClose`, `showHeader`, `showArrow`). Never use negative names (`hideX`, `preventX`, `skipX`).

## Events

- Use `modelValue` / `update:modelValue` for the v-model prop and emitted event
  contract. In Vue templates, follow the existing linted listener spelling,
  for example `@update:model-value`.
- Use `update:open` for overlay visibility; verify each component's emitted events before changing its contract.

## Slots

- Overlay components (Popover, Hovercard): `headerContent` / `footerContent`.
- Structural components (Card, Modal): `header` / `footer`.
- Follow the slot-class convention below when adding or reviewing slots. Preserve existing public contracts unless the task authorizes changing them.

## Slot Class Props Convention

Every named slot **must** have a corresponding `{slotName}Class` prop applied to its wrapper element. This gives consumers styling control over each slot region without overriding internal classes.

### Prop Shape

Always declare slot class props with this exact shape:

```js
sectionClass: {
  type: [String, Array, Object],
  default: '',
},
```

### Template Application

Merge the class prop into the wrapper element's static class list:

```vue
<div :class="['d-component__section', sectionClass]">
  <slot name="section" />
</div>
```

The Dialtone BEM class comes first; the consumer override comes second.

### Exceptions

#### 1. Default slot — use a semantic name

The default slot must **never** use `defaultClass`. Instead, choose a semantic name that describes the content region (`contentClass`, `labelClass`, `bodyClass`, etc.).

```js
// ✅ correct
contentClass: { type: [String, Array, Object], default: '' }

// ❌ wrong
defaultClass: { type: [String, Array, Object], default: '' }
```

#### 2. Overlay header/footer slots — shortened names are acceptable

Overlay components (Popover, Hovercard) use `headerContent` / `footerContent` slot names. The corresponding class props may use the shortened form:

| Slot name       | Class prop    |
| --------------- | ------------- |
| `headerContent` | `headerClass` |
| `footerContent` | `footerClass` |

Both `headerContentClass` and `headerClass` are acceptable; prefer the shorter form for consistency with existing components.

#### 3. Structural class props are separate

Props like `rootClass`, `dialogClass`, `wrapperClass`, etc. target structural wrapper elements that do **not** correspond to a slot. These are encouraged for deep customization but are a separate concern — they do not satisfy the slot class requirement.

### Checklist

When adding or reviewing a slot:

1. Slot exists in the template → corresponding `{slotName}Class` prop is declared.
2. Prop uses the canonical shape (`[String, Array, Object]`, default `''`).
3. Prop is bound on the slot's immediate wrapper element via `:class` array merge.
4. Default slot uses a semantic name, not `defaultClass`.
5. Overlay header/footer slots may use `headerContentClass` / `footerContentClass` or `headerClass` / `footerClass` (prefer the shortened form).

## Sizes

- Prefer numeric ordinal sizes. Supported values are component-specific; use each component's constants, validator and API documentation.
- Prop type: `[String, Number]`. Default: numeric (e.g., `default: 300`).
- T-shirt aliases (`xs`, `sm`, `md`, `lg`, `xl`) remain in constants for backward compat but are deprecated.
- `@values` JSDoc: list numeric only (e.g., `@values 100, 200, 300, 400, 500`). Do not list t-shirt aliases.
- Text headline extends the scale: `500` (xl), `600` (2xl), `700` (3xl).
- Icons: separate numeric scale `100`–`800`, independent of component-specific supported values (do not remap icon values onto the component scale). Icon-family `size` props (`Icon`, `Loader`, `Emoji`, `EmojiTextWrapper`, `ProgressCircle`, `ToastLayoutAlternateIcon`) still use `[String, Number]`.
- Use each component's constants for supported values.
- Shared scale definition: `packages/dialtone-vue/common/constants/sizes.js`.
- Export a component-specific `<COMPONENT>_SIZE_MODIFIERS` object (e.g., `BUTTON_SIZE_MODIFIERS`) from `*Constants.js` or `*Constants.ts`, with numeric and t-shirt keys. `COMPONENT_SIZES` is the shared scale mapping.

## Logical Naming

New directional props, slots, values and events use logical naming. Read [logical naming](logical-naming.md) when adding or changing directional names.

## Separation of Concerns

- **Template**: Presentation only. No complex expressions (extract to computed). No API calls.
- **Script**: All logic. Use composables for new reusable logic, mixins for legacy.
- **Styles**: Component styles live in `packages/dialtone-css/lib/build/less/components/{component-name}.less`. Use Dialtone utility classes (`d-*`) in templates. Reference tokens via `var(--dt-*)` for colors, spacing, sizing, z-index, radius and typography. Never hardcode these values.

## File Structure (per component directory)

Follow the existing directory's layout and casing. Common files are:

- `<Name>.vue` — implementation
- `<Name>Constants.js` or `<Name>Constants.ts` — constants when needed
- `<Name>.test.js` — Vitest tests
- `<Name>.stories.js` — Storybook stories
- `<Name>*.story.vue` — story components when used
- `<Name>.mdx` — optional Storybook documentation
- `index.js` — barrel export
- `Utils.js` / `Validators.js` — optional helpers; retain existing component-specific names or casing
- `modules/` — optional sub-components; preserve existing names
- `composables/` or `Composables/` — optional composition functions; follow local conventions

This describes authoring locations, not a mandate to rename existing files.

## Component Artifact Pipeline

When creating or updating a component, ALL must stay in sync:

1. **Vue source**: `packages/dialtone-vue/components/`
2. **Tests**: `.test.js` using Vitest + @vue/test-utils
3. **Storybook stories**: `.stories.js`, any `.story.vue` components, and `.mdx` where maintained
4. **Component docs JSON**: via `scripts/build-dialtone-vue-docs.mjs`
5. **VuePress documentation**: `apps/dialtone-documentation/docs/`, sidebar in `_data/site-nav.json`. Use fenced ` ```vue demo ` blocks for code examples (see [shared documentation-writing guidance](documentation-writing.md#documentation-site-examples))
6. **CLI/MCP lookup data**: rebuild the generated datasets consumed through `packages/dialtone-query-core`; run `pnpm nx run-many -t build -p dialtone-cli dialtone-mcp-server` rather than hand-editing generated records.
7. **Combinator variant file**: `packages/combinator/src/variants/variants_<component>.js` plus registration in `packages/combinator/src/variants/variants.js`. Required for prop, slot, value, and visual-state changes. See `.agents/resources/rules/combinator-variants.md`.
8. **Component wall thumbnail**: auto-generated PNG at `apps/dialtone-documentation/docs/.vuepress/public/assets/images/components/<slug>-{light,dark}.png`. Run `pnpm nx run dialtone-documentation:thumbs` to regen (pre-commit hook fires automatically on relevant staged changes). If the Combinator default doesn't render well as a thumbnail, author an override at `apps/dialtone-documentation/thumbs/<slug>.vue`; see `apps/dialtone-documentation/thumbs/README.md`. Preview live at `pnpm nx run dialtone-documentation:thumbs:preview` (picker at `/`, full grid at `/?gallery`).
9. **Public docs JSON**: `packages/dialtone-docs/dist/public-docs.json`, built by `packages/dialtone-docs/src/generators/build-public-docs.mjs` from `apps/dialtone-documentation/docs/**/*.md` and the public directives' MDX pages. Directive references also read their `.stories.js` titles, `dialtone-vue/index.js` exports, `dialtone-vue/package.json` and the shared `SITE_URL`. Consumed by `dialtone-mcp-server` (`search_documentation`) and `dialtone-cli` (`dialtone docs`) via `@dialpad/dialtone-query-core`. Rebuilt by `pnpm nx run dialtone-docs:build`; Nx inputs include these sources.
