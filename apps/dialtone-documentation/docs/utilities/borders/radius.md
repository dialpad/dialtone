---
title: Border Radius
description: Utilities for controlling an element's border radius.
keywords: ["rounded", "corner", "pill", "circle", "radius start", "radius end", "block-start", "block-end", "inline-start", "inline-end", "single corner"]
---

<script setup>
  import { radius } from '@data/borders.json';
</script>

## All Corners

Use `d-bar-{stop}` to change the border radius on all four corners. The stop references the matching `--dt-size-radius-{stop}` token.

```vue demo
<!-- @wrapper -->
<dt-stack gap="100" :direction="{ default: 'column', md: 'row' }">
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-0">  <dt-text kind="code" size="xs">d-bar-0</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-100"><dt-text kind="code" size="xs">d-bar-100</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-200"><dt-text kind="code" size="xs">d-bar-200</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-300"><dt-text kind="code" size="xs">d-bar-300</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-350"><dt-text kind="code" size="xs">d-bar-350</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-400"><dt-text kind="code" size="xs">d-bar-400</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-450"><dt-text kind="code" size="xs">d-bar-450</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-500"><dt-text kind="code" size="xs">d-bar-500</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-550"><dt-text kind="code" size="xs">d-bar-550</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-600"><dt-text kind="code" size="xs">d-bar-600</dt-text></div>
</dt-stack>
```

## Rounded Sides

Use a side-pair class to round the two corners on a single side. Class roots are the first-letter compression of the matching CSS logical property.

| Class root | CSS properties set                                      | Visible in LTR |
| ---------- | ------------------------------------------------------- | -------------- |
| `d-bbsr-*` | `border-start-start-radius` + `border-start-end-radius` | top            |
| `d-bier-*` | `border-start-end-radius` + `border-end-end-radius`     | right          |
| `d-bber-*` | `border-end-start-radius` + `border-end-end-radius`     | bottom         |
| `d-bisr-*` | `border-start-start-radius` + `border-end-start-radius` | left           |

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" :direction="{ default: 'column', md: 'row' }">
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bbsr-450"><dt-text kind="code" size="xs">d-bbsr-450</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bier-450"><dt-text kind="code" size="xs">d-bier-450</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bber-450"><dt-text kind="code" size="xs">d-bber-450</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bisr-450"><dt-text kind="code" size="xs">d-bisr-450</dt-text></div>
</dt-stack>
```

## Individual Corners

Use a single-corner class to round exactly one corner. Class roots match the CSS logical corner properties.

| Class root | CSS property set            | Visible in LTR |
| ---------- | --------------------------- | -------------- |
| `d-bssr-*` | `border-start-start-radius` | top-left       |
| `d-bser-*` | `border-start-end-radius`   | top-right      |
| `d-beer-*` | `border-end-end-radius`     | bottom-right   |
| `d-besr-*` | `border-end-start-radius`   | bottom-left    |

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" :direction="{ default: 'column', md: 'row' }">
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bssr-500"><dt-text kind="code" size="xs">d-bssr-500</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bser-500"><dt-text kind="code" size="xs">d-bser-500</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-beer-500"><dt-text kind="code" size="xs">d-beer-500</dt-text></div>
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-besr-500"><dt-text kind="code" size="xs">d-besr-500</dt-text></div>
</dt-stack>
```

## Pills

Use `d-bar-pill` for a pill-shaped radius on all four corners. The same `-pill` suffix is available on every scope (`d-bbsr-pill`, `d-bssr-pill`, etc.).

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" :direction="{ default: 'column', md: 'row' }">
  <div class="d-p-100 d-ba d-baw2 d-bgc-primary d-ws-nowrap d-bar-pill">
    <dt-text kind="code" size="xs">d-bar-pill</dt-text>
  </div>
</dt-stack>
```

## Circles

Use `d-bar-circle` for a fully circular radius. Best paired with a square element.

```vue demo
<!-- @wrapper -->
<dt-stack gap="400" :direction="{ default: 'column', md: 'row' }">
  <dt-stack direction="row" align="center" justify="center" class="d-p-100 d-size-200 d-ba d-baw2 d-bc-default d-bgc-primary d-ws-nowrap d-bar-circle">
    <dt-text kind="code" size="xs">d-bar-circle</dt-text>
  </dt-stack>
</dt-stack>
```

## Reset

Use `d-bar-unset` to reset the border-radius on all four corners to `unset`.

## Classes

<utility-class-table show-rendered>
  <template #content>
    <tbody v-for="scope in radius.scopes" :key="scope.logicalPrefix">
      <tr v-for="val in radius.values" :key="`${scope.logicalPrefix}-${val.stop}`">
        <th scope="row">
          <dt-text as="span" kind="code" :size="100" class="d-docsite-code">.d-{{ scope.logicalPrefix }}-{{ val.stop }}</dt-text>
        </th>
        <td class="d-code--sm">
          <span v-for="prop in scope.cssProperties" :key="prop">
            {{ prop }}: var(--dt-size-radius-{{ val.stop }}) !important;<br/>
          </span>
        </td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">{{ val.rem }}</td>
        <td class="d-code--sm d-fc-tertiary d-ta-right">{{ val.px }}</td>
      </tr>
      <template v-if="scope.legacyPrefix">
        <tr v-for="val in radius.values" :key="`legacy-${scope.legacyPrefix}-${val.legacyPx}`">
          <th scope="row">
            <dt-stack gap="50">
              <dt-text as="span" kind="code" :size="100" class="d-docsite-code">
                .d-{{ scope.legacyPrefix }}<template v-if="val.legacyPx === 'pill' || val.legacyPx === 'circle'">-</template>{{ val.legacyPx }}
              </dt-text>
              <dt-badge type="critical" kind="label" text="Deprecated" />
            </dt-stack>
          </th>
          <td class="d-code--sm">
            <span v-for="prop in scope.cssProperties" :key="prop">
              {{ prop }}: var(--dt-size-radius-{{ val.stop }}) !important;<br/>
            </span>
          </td>
          <td class="d-code--sm d-fc-tertiary d-ta-right">{{ val.rem }}</td>
          <td class="d-code--sm d-fc-tertiary d-ta-right">{{ val.px }}</td>
        </tr>
      </template>
    </tbody>
    <tbody>
      <tr>
        <th scope="row">
          <dt-text as="span" kind="code" :size="100" class="d-docsite-code">.d-bar-unset</dt-text>
        </th>
        <td class="d-code--sm">border-radius: unset !important;</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
        <td class="d-fc-muted d-fs-100 d-ta-center">N/A</td>
      </tr>
    </tbody>
  </template>
</utility-class-table>
