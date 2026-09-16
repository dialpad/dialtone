# deprecated-radius-utility-classes

Detects usage of legacy border-radius utility classes (`d-bar6`, `d-btr8`, `d-bbr-pill`, etc.) and auto-fixes them to the new token-stop-indexed logical names (`d-bar-350`, `d-bbsr-400`, `d-bber-pill`).

## Rule Details

Dialtone's border-radius utilities moved from legacy t-shirt-indexed pixel suffixes (`d-bar6` = 6px) to token-stop-indexed logical names (`d-bar-350` references `--dt-size-radius-350`). Physical side prefixes (`btr`/`bbr`/`blr`/`brr`) also moved to logical pair prefixes (`bbsr`/`bber`/`bisr`/`bier`).

This rule flags:

- All-corners numeric: `d-bar6` → `d-bar-350`, `d-bar24` → `d-bar-550`
- Side-pair numeric: `d-btr6` → `d-bbsr-350`, `d-bbr8` → `d-bber-400`, `d-blr12` → `d-bisr-450`, `d-brr16` → `d-bier-500`
- Side-pair keyword: `d-btr-pill` → `d-bbsr-pill`, `d-brr-circle` → `d-bier-circle`

This rule does NOT flag:

- New logical classes (`d-bar-350`, `d-bbsr-400`, etc.)
- Keyword classes (`d-bar-pill`, `d-bar-circle`, `d-bar-unset`)
- Single-corner logical classes (`d-bssr-*`, `d-bser-*`, `d-beer-*`, `d-besr-*`)
- Custom non-Dialtone classes that contain legacy-looking substrings (e.g. `foo-d-bar6` is left alone)

## Options

No options.

## Examples

### Invalid

```vue
<template>
  <div class="d-bar6 d-btr8" />
  <div class="d-bbr-pill" />
</template>
```

### Valid (auto-fixed)

```vue
<template>
  <div class="d-bar-350 d-bbsr-400" />
  <div class="d-bber-pill" />
</template>
```

## Stop Mapping

| Legacy px | Token stop |
|-----------|------------|
| 0 | 0 |
| 1 | 100 |
| 2 | 200 |
| 4 | 300 |
| 6 | 350 |
| 8 | 400 |
| 12 | 450 |
| 16 | 500 |
| 24 | 550 |
| 32 | 600 |

## Pair Prefix Mapping

| Physical | Logical | CSS properties |
|----------|---------|----------------|
| btr | bbsr | `border-start-start-radius`, `border-start-end-radius` |
| bbr | bber | `border-end-start-radius`, `border-end-end-radius` |
| blr | bisr | `border-start-start-radius`, `border-end-start-radius` |
| brr | bier | `border-start-end-radius`, `border-end-end-radius` |
