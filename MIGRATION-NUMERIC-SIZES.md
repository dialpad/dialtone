# Migration Guide: T-Shirt Sizes → Numeric Scale

Dialtone component size props are migrating from t-shirt labels (`xs`, `sm`, `md`, `lg`, `xl`) to a numeric ordinal scale (`100`, `200`, `300`, `400`, `500`). T-shirt sizes remain supported as deprecated aliases.

## Size Mapping

| T-shirt | Numeric | Description |
|---------|---------|-------------|
| `xs` | `100` | Extra small |
| `sm` | `200` | Small |
| `md` | `300` | Medium (default) |
| `lg` | `400` | Large |
| `xl` | `500` | Extra large |
| `2xl` | `600` | Headline only |
| `3xl` | `700` | Headline only |

## What Changed

All component `size` props now accept `[String, Number]` and default to numeric:

```vue
<!-- Before -->
<dt-button size="sm">Click me</dt-button>
<dt-text kind="headline" size="xl">Title</dt-text>
<dt-input size="lg" label="Name" />

<!-- After (preferred) -->
<dt-button :size="200">Click me</dt-button>
<dt-text kind="headline" :size="500">Title</dt-text>
<dt-input :size="400" label="Name" />
```

### Props affected

- `size` on: DtButton, DtInput, DtSelectMenu, DtSegmentedControl, DtText, DtToggle, DtChip, DtCodeblock, DtEmptyState, DtSkeleton, DtSplitButton, DtFilterPill, DtCombobox, DtComboboxMultiSelect, DtComboboxWithPopover, DtTabGroup
- `label-size` on: DtInput, DtSelectMenu, DtRadio, DtCheckbox
- `speed` on: DtMotionText

### Not affected

- Icon sizes (`dt-icon`, `dt-loader`, `dt-emoji`, `dt-progress-circle`) — these already use numeric and are unchanged
- `dt-avatar` — already migrated to numeric in a prior release
- CSS utility classes — no changes

## Migration Steps

### 1. Enable the ESLint rule (recommended)

Add to your ESLint config:

```js
// eslint.config.js (flat config)
import dialtone from '@dialpad/eslint-plugin-dialtone';

export default [
  {
    plugins: { dialtone },
    rules: {
      'dialtone/deprecated-tshirt-sizes': 'warn', // or 'error'
    },
  },
];
```

Then run:

```bash
npx eslint --fix "src/**/*.vue"
```

This auto-fixes `size="sm"` → `:size="200"` on all Dialtone components in Vue templates.

### 2. Run the batch codemod (alternative)

For non-Vue files or broader coverage:

```bash
# Preview changes
npx dialtone-migrate-tshirt-to-numeric --dry-run --cwd ./src

# Apply changes
npx dialtone-migrate-tshirt-to-numeric --cwd ./src
```

The codemod transforms `.vue`, `.md`, `.html`, `.js`, `.ts`, `.jsx`, `.tsx` files.

### 3. Manual review

The ESLint rule and codemod only handle **static** prop values. Dynamic bindings need manual review:

```vue
<!-- Auto-fixed -->
<dt-button size="sm" />  →  <dt-button :size="200" />

<!-- Needs manual review -->
<dt-button :size="computedSize" />
```

If `computedSize` returns t-shirt strings, update the source:

```js
// Before
const computedSize = isCompact ? 'sm' : 'md';

// After
const computedSize = isCompact ? 200 : 300;
```

## Why Numeric?

- **Extensible**: Need a size between `sm` and `md`? Use `250`. No naming gymnastics.
- **Consistent**: Same 100-unit convention as `dt-size-*` tokens, `dt-icon-size-*`, and color scales.
- **Predictable**: Bigger number = bigger size. 50-unit half-steps available for future sizes.
