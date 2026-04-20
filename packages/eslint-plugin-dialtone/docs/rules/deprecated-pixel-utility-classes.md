# deprecated-pixel-utility-classes

Detects usage of pixel-based utility classes (`d-h16`, `d-p8`, `d-m8`, etc.) and auto-fixes to token-stop-based equivalents (`d-h-25`, `d-p-100`, `d-m-100`).

## Rule Details

Dialtone's sizing, spacing, gap, and position utilities moved from legacy pixel-suffixed names (`d-p8` = 8px) to token-stop-indexed names (`d-p-100` references `--dt-spacing-100`). Mirrors the `utility-class-to-token-stops` migration helper.

This rule flags:

- Sizing: `d-h16` → `d-h-25`, `d-w64` → `d-w-100`, `d-hmn96` → `d-hmn-150`, etc.
- Margin: `d-m8` → `d-m-100`, `d-mt16` → `d-mt-200`, `d-mtn8` → `d-mt-n100` (negative)
- Padding: `d-p8` → `d-p-100`, `d-pt16` → `d-pt-200`
- Gap: `d-g8` → `d-g-100`, `d-rg16` → `d-rg-200`, `d-cg16` → `d-cg-200`
- Position: `d-t8` → `d-t-100`, `d-tn8` → `d-t-n100` (negative)

Small-value sizing stops fall back to pixel-indexed suffixes (off-scale exceptions from DLT-3330): `d-w1` → `d-w-1px`, `d-h2` → `d-h-2px`, `d-h24` → `d-h-24px`.

This rule does NOT flag:

- New token-stop classes (`d-h-25`, `d-p-100`, etc.)
- Percentage classes (`d-h100p`, `d-w50p`)
- Viewport classes (`d-h100vh`, `d-w100vw`, `d-h-dvh`)
- Keyword classes (`d-h-auto`, `d-w-fit-content`)
- Character-width classes (`d-w60ch`)
- Logical property aliases (`d-mis-100`, `d-pbs-200`)
- Custom non-Dialtone classes (`foo-d-h16`, `my-d-p8` are left alone)

## Options

No options.

## Examples

### Invalid

```vue
<template>
  <div class="d-h16 d-w64" />
  <div class="d-p8 d-mt16" />
  <div class="d-mtn8" />
  <div class="d-t8 d-l16" />
</template>
```

### Valid (auto-fixed)

```vue
<template>
  <div class="d-h-25 d-w-100" />
  <div class="d-p-100 d-mt-200" />
  <div class="d-mt-n100" />
  <div class="d-t-100 d-l-200" />
</template>
```
