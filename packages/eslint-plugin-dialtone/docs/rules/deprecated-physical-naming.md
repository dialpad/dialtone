# deprecated-physical-naming

Detects deprecated physical direction names (left/right/top/bottom/alpha/omega) in Dialtone component slots, props, prop values, and events. Suggests logical replacements (start/end/blockStart/blockEnd).

## Rule Details

This rule flags usage of deprecated physical naming conventions across Dialtone Vue components and recipes. All deprecated names still work via backward-compatible fallbacks, but consumers should migrate to logical names.

### What it flags

- **Deprecated slots**: `#leftIcon`, `#rightIcon`, `#alphaIcon`, `#omegaIcon`, `#omega`, `#left`, `#right`, `#bottom`, `#leftContent`, `#rightContent`
- **Deprecated props**: `alpha-*`, `omega-*`, `left-class`, `right-class`, `bottom-class` on applicable components
- **Deprecated prop values**: `icon-position="left|right|top|bottom"`, `sidebar-position="left|right"`
- **Deprecated events**: `@alpha-clicked`, `@omega-clicked`
- **Special case**: `#icon` on `dt-button` (ambiguous — consumer must choose the replacement)

### Examples of **incorrect** code

```vue
<dt-badge>
  <template #leftIcon>...</template>
</dt-badge>

<dt-button icon-position="left">
  <template #icon>...</template>
</dt-button>

<dt-split-button alpha-active @alpha-clicked="handler">
  <template #alphaIcon>...</template>
</dt-split-button>

<dt-item-layout left-class="d-w32">
  <template #left>...</template>
</dt-item-layout>
```

### Examples of **correct** code

```vue
<dt-badge>
  <template #startIcon>...</template>
</dt-badge>

<dt-button>
  <template #startIcon>...</template>
</dt-button>

<dt-split-button start-active @start-clicked="handler">
  <template #startIcon>...</template>
</dt-split-button>

<dt-item-layout start-class="d-w32">
  <template #start>...</template>
</dt-item-layout>
```

## Migration

Use `npx dialtone-migration-helper` and select the "physical-to-logical" config to auto-rename unambiguous cases. The `#icon` slot on `dt-button` requires manual migration.

## When Not To Use It

If you are not yet ready to migrate to logical naming and want to suppress warnings.
