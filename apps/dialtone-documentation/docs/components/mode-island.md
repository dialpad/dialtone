---
title: Mode
description: Directive for scoping light, dark, or inverted color mode.
status: new
thumb: true
keywords: ["theme island","mode island","mode override","v-dt-mode","directive","light","dark","invert","v-dt"]
---

```vue demo-only
<dt-stack gap="400">
  <dt-stack direction="row" gap="200" align="center" justify="center">
    <dt-segmented-control
      size="100"
      :model-value="currentMode"
      aria-label="Mode"
      activation-mode="manual"
      @update:model-value="setMode"
    >
      <dt-segmented-control-item value="system">
        System
        <template #startIcon="{ iconSize }">
          <dt-icon name="laptop-2" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
      <dt-segmented-control-item value="light">
        Light
        <template #startIcon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
      <dt-segmented-control-item value="dark">
        Dark
        <template #startIcon="{ iconSize }">
          <dt-icon name="moon" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
    </dt-segmented-control>
    <dt-segmented-control
      size="100"
      :model-value="currentContrast"
      aria-label="Contrast"
      activation-mode="manual"
      @update:model-value="setContrast"
    >
      <dt-segmented-control-item value="default">
        Default
        <template #startIcon="{ iconSize }">
          <dt-icon name="hash" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
      <dt-segmented-control-item value="high">
        High
        <template #startIcon="{ iconSize }">
          <dt-icon name="hash-bold" :size="iconSize" />
        </template>
      </dt-segmented-control-item>
    </dt-segmented-control>
  </dt-stack>
  <dt-stack :direction="{ 'default': 'column', 'lg': 'row' }" gap="200" class="d-w100p">
    <dt-stack gap="100">
      <dt-text as="h3" kind="headline" :size="200">Inverted <dt-text strength="normal">(auto)</dt-text></dt-text>
      <dt-box v-dt-mode:invert surface="secondary" padding="200" border-radius="400" border-width="100">
        <dt-stack gap="100">
          <dt-stack gap="100" direction="row">
            <dt-icon name="circle-half-filled" size="200" class="d-fc-positive" />
            <dt-text as="p" kind="body" :size="100">Primary</dt-text>
            <dt-text as="p" kind="body" :size="100" tone="muted">Muted</dt-text>
            <dt-text as="p" kind="body" :size="100" tone="critical">Critical</dt-text>
            <dt-text as="p" kind="body" :size="100"><dt-link>Link</dt-link></dt-text>
          </dt-stack>
          <dt-stack direction="row" gap="100" class="d-100p">
            <dt-button :size="100" class="d-fl1">Button</dt-button>
            <dt-button :size="100" class="d-fl1" kind="critical">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-box>
    </dt-stack>
    <dt-stack gap="100">
      <dt-text as="h3" kind="headline" :size="200">Dark <dt-text strength="normal">(auto)</dt-text></dt-text>
      <dt-box v-dt-mode:dark surface="secondary" padding="200" border-radius="400" border-width="100">
        <dt-stack gap="100">
          <dt-stack gap="100" direction="row">
            <dt-icon name="circle-half-filled" size="200" class="d-fc-positive" />
            <dt-text as="p" kind="body" :size="100">Primary</dt-text>
            <dt-text as="p" kind="body" :size="100" tone="muted">Muted</dt-text>
            <dt-text as="p" kind="body" :size="100" tone="critical">Critical</dt-text>
            <dt-text as="p" kind="body" :size="100"><dt-link>Link</dt-link></dt-text>
          </dt-stack>
          <dt-stack direction="row" gap="100" class="d-100p">
            <dt-button :size="100" class="d-fl1">Button</dt-button>
            <dt-button :size="100" class="d-fl1" kind="critical">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-box>
    </dt-stack>
    <dt-stack gap="100">
      <dt-text as="h3" kind="headline" :size="200">Light <dt-text strength="normal">(auto)</dt-text></dt-text>
      <dt-box v-dt-mode:light surface="secondary" padding="200" border-radius="400" border-width="100">
        <dt-stack gap="100">
          <dt-stack gap="100" direction="row">
            <dt-icon name="circle-half-filled" size="200" class="d-fc-positive" />
            <dt-text as="p" kind="body" :size="100">Primary</dt-text>
            <dt-text as="p" kind="body" :size="100" tone="muted">Muted</dt-text>
            <dt-text as="p" kind="body" :size="100" tone="critical">Critical</dt-text>
            <dt-text as="p" kind="body" :size="100"><dt-link>Link</dt-link></dt-text>
          </dt-stack>
          <dt-stack direction="row" gap="100" class="d-100p">
            <dt-button :size="100" class="d-fl1">Button</dt-button>
            <dt-button :size="100" class="d-fl1" kind="critical">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-box>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

## Usage

Use `v-dt-mode` by default on the element that defines the region. It adds no wrapper and does not paint a background. Choose `DtModeIsland` when you deliberately want its container and automatic primary surface together, or cannot use the directive.

Both APIs scope token-based styles to the specified color mode. Putting the directive on an existing element preserves layout relationships, such as direct children of a flex or grid container.

### Directive or component?

Use `v-dt-mode` by default for new mode-scoping code.

| Situation | Recommendation |
| --- | --- |
| The region already has a container (section, card, toolbar, or button) | `v-dt-mode` |
| You need a new container, including a painted surface | Usually a native container with `v-dt-mode`; add `d-bgc-primary` when needed |
| You deliberately want the component's container and automatic primary surface together | `DtModeIsland` is a reasonable convenience |
| You cannot install the currently exported directive plugin | `DtModeIsland` |
| Explicit light/dark attributes must appear in server-rendered HTML | Consider `DtModeIsland`; verify rendering and hydration in your setup |
| Positioned overlay content | The positioned component's `content-mode` prop |

The current directive applies attributes after mounting; the component binds them in its template. This makes the component worth considering for explicit light/dark server markup. It does not guarantee correct inverted mode, root-derived contrast/material, or hydration in every SSR setup.

The directive and `content-mode` prop use `invert`; the component uses `mode="inverted"`.

### Basic usage

```vue demo
<!-- @wrapper -->
<dt-stack gap="100">
  <dt-text v-dt-mode:dark tone="positive"> Dark content </dt-text>
  <dt-text v-dt-mode:light tone="positive"> Light content </dt-text>
  <dt-text v-dt-mode:invert tone="positive"> Inverted — opposite of parent or root </dt-text>
</dt-stack>
```

### Inverting

This effectively removes the need for `inverted` props or variants on elements or components.

For example, instead of using `inverted` on a DtButton, use `v-dt-mode:invert`

```vue demo
<!-- @wrapper -->
<dt-stack gap="200" direction="row">
  <dt-button>Button</dt-button>
  <dt-button v-dt-mode:invert>Button</dt-button>
</dt-stack>
```

### Dynamic mode

Bind a reactive variable as the directive arg to switch modes at runtime.

```vue demo
<dt-stack gap="200">
  <dt-segmented-control :size="100" v-model="dynamicMode" aria-label="Mode">
    <dt-segmented-control-item value="invert" :selected="dynamicMode === 'invert'">
      <template #startIcon="{ iconSize }">
        <dt-icon name="circle-half-filled" :size="iconSize" />
      </template>
      Invert
    </dt-segmented-control-item>
    <dt-segmented-control-item value="light" :selected="dynamicMode === 'light'">
      <template #startIcon="{ iconSize }">
        <dt-icon name="sun" :size="iconSize" />
      </template>
      Light
    </dt-segmented-control-item>
    <dt-segmented-control-item value="dark" :selected="dynamicMode === 'dark'">
      <template #startIcon="{ iconSize }">
        <dt-icon name="moon" :size="iconSize" />
      </template>
      Dark
    </dt-segmented-control-item>
  </dt-segmented-control>
  <dt-text v-dt-mode:[dynamicMode] align="center" tone="positive"> {{ dynamicMode }} mode </dt-text>
</dt-stack>
<!-- @code -->
<dt-text v-dt-mode:{mode} align="center" tone="positive"> ... mode </dt-text>
```

### Conditional

Pass a boolean value to conditionally apply or remove the directive. When `false`, mode attributes are removed entirely.

```vue
<dt-button v-dt-mode:invert="isInverted">Button</dt-button>
```

### Guidance

<dialtone-usage>
<template #do>

- Use sparingly for specific needs, not general theming
- Use only to force a region to a controlled theme for a unique purpose
- Always test in both light and dark root themes
- Ensure content remains readable when mode changes

</template>

<template #dont>

- Do not overuse mode islands, respect user theme preference
- Do not use purely for decoration. Ensure mode island use serves a functional and unique purpose
- Avoid nesting deeply. Keep hierarchy shallow for maintainability

</template>

</dialtone-usage>

### How it works

- CSS tokens activate via `[data-dt-mode="light"]` and `[data-dt-mode="dark"]` attribute selectors
- High-contrast tokens layer via `[data-dt-mode][data-dt-contrast="high"]`
- Contrast is inherited from the root `<html>` element and kept in sync via MutationObserver
- Material is inherited from the root `<html>` element the same way — `data-dt-material` propagates onto the island/directive element so `--dt-color-black-*` re-binds correctly inside inverted regions
- For `invert` mode, the directive reads the nearest ancestor's `data-dt-mode`, computes the opposite, and reacts when it changes
- Keep `data-dt-brand` (theme) and `data-dt-material` at the root; do not set local overrides on mode boundaries. Material is paired to brand for visual coherence (see [brand-locked materials](/guides/theme-and-mode/#brand-locked-materials)).

## Variants

### Inverted

The default mode — inverts relative to the nearest parent mode boundary or the root. When no arg is provided, `v-dt-mode` defaults to invert.

```vue demo
<section v-dt-mode class="d-p-200 d-bar-400">
  <dt-text as="p" tone="positive">Inverted mode (opposite of parent)</dt-text>
</section>
```

### Light

Explicitly set to light mode regardless of parent or root mode.

```vue demo
<section v-dt-mode:light class="d-p-200 d-bar-400">
  <dt-text as="p" tone="positive">Always light mode</dt-text>
</section>
```

### Dark

Explicitly set to dark mode regardless of parent or root mode.

```vue demo
<section v-dt-mode:dark class="d-p-200 d-bar-400">
  <dt-text as="p" tone="positive">Always dark mode</dt-text>
</section>
```

## Nesting

Mode boundaries can be nested. Each `v-dt-mode:invert` reads the nearest parent boundary and flips. In this example the first level is explicitly set to light mode, the second level inverts against that, and the third level inverts again.

```vue demo
<dt-stack gap="200" v-dt-mode:light class="d-p-200 d-bar-400 d-bgc-secondary d-ba">
  <dt-text as="p" tone="positive" text-box-trim="both">Explicit Light</dt-text>
  <dt-stack v-dt-mode gap="200" class="d-p-200 d-bar-400 d-bgc-secondary">
    <dt-text as="p" tone="positive" text-box-trim="both">Inverted (Dark)</dt-text>
    <dt-stack v-dt-mode gap="200" class="d-p-200 d-bar-300 d-bgc-secondary">
      <dt-text as="p" tone="positive" text-box-trim="both">Inverted again (Light)</dt-text>
    </dt-stack>
  </dt-stack>
</dt-stack>
```

## Custom background

The directive scopes color mode without supplying a background. Keep the region's existing background styling, or choose a surface explicitly with `d-bgc-primary` or the `surface` prop when using [DtBox](/components/box.html). For example, `<dt-box v-dt-mode:invert surface="primary">` scopes the mode and paints its primary surface. Check foreground and background contrast in both root modes.

The component's `d-mode-island` class automatically paints `var(--dt-color-surface-primary)` from the island's active mode. A background utility can override that surface.

```vue code-only
<section v-dt-mode:invert>
  <dt-text as="p">The region keeps its existing background styling.</dt-text>
</section>
```

These live examples choose backgrounds explicitly with the directive, or use the component's automatic surface:

```vue demo
<!-- @wrapper -->
<dt-stack gap="200">
  <section v-dt-mode:invert class="d-bgc-primary d-p-200 d-bar-400 d-w100p">
    <dt-text as="p">The region explicitly uses the active mode's primary surface.</dt-text>
  </section>
  <dt-box v-dt-mode:invert surface="secondary" padding="200" border-radius="400" class="d-w100p">
    <dt-text as="p">DtBox: explicit secondary surface, inverted mode</dt-text>
  </dt-box>
  <dt-mode-island class="d-p-200 d-bar-400 d-w100p">
    <dt-stack gap="200">
      <dt-text as="p" kind="code" :size="100" tone="tertiary">Component: automatic primary surface, inverted mode</dt-text>
      <div>
        <dt-button>Button</dt-button>
      </div>
    </dt-stack>
  </dt-mode-island>
  <section v-dt-mode:dark class="d-p-200 d-bar-400 d-w100p d-bgc-critical">
    <dt-stack gap="200">
      <dt-text as="p" kind="code" :size="100" tone="tertiary">Explicit critical background, dark mode directive</dt-text>
      <div>
        <dt-button>Button</dt-button>
      </div>
    </dt-stack>
  </section>
  <section v-dt-mode:light class="d-p-200 d-bar-400 d-w100p d-bgc-critical">
    <dt-stack gap="200">
      <dt-text as="p" kind="code" :size="100" tone="tertiary">Explicit critical background, light mode directive</dt-text>
      <div>
        <dt-button>Button</dt-button>
      </div>
    </dt-stack>
  </section>
</dt-stack>
```

## Examples

### Callbar

A real-world pattern: the callbar container already exists as a semantic element. The directive applies mode theming directly — no wrapper needed.

```vue demo
<dt-stack v-dt-mode class="d-ba d-bc-subtle d-bgc-secondary d-p-100 d-pis-125 d-py-100 d-bar-450 d-bs-md d-w100p" direction="row" gap="400">
  <dt-stack gap="100" direction="row">
    <dt-avatar
      full-name="TA"
      seed="ted-anderson"
      :size="400"
    />
    <dt-stack gap="25">
      <dt-text kind="label" :size="300" density="200">Ted Anderson</dt-text>
      <dt-stack direction="row" gap="50" align="baseline">
        <dt-text kind="body" :size="100" tone="tertiary" wrap="nowrap" numeric>(913) 555-6745</dt-text>
        <dt-text kind="body" :size="100" tone="muted">&bull;</dt-text>
        <dt-text kind="body" :size="100" tone="tertiary" numeric>21:18</dt-text>
      </dt-stack>
    </dt-stack>
  </dt-stack>
  <dt-stack class="d-fl1" direction="row" gap="25" justify="center">
    <dt-button class="d-px-100 d-w-100" :size="100" kind="critical">
      <template #blockStartIcon> <dt-icon name="mic" size="300" /> </template>
      Unmute
    </dt-button>
    <dt-button class="d-px-100 d-w-100" :size="100" kind="muted" importance="clear">
      <template #blockStartIcon> <dt-icon name="record-filled" size="300" /> </template>
      Record
    </dt-button>
    <dt-button class="d-px-100 d-w-100" :size="100" kind="muted" importance="clear">
      <template #blockStartIcon> <dt-icon name="keypad" size="300" /> </template>
      Keypad
    </dt-button>
    <dt-button class="d-px-100 d-w-100" :size="100" kind="muted" importance="clear">
      <template #blockStartIcon> <dt-icon name="user-plus" size="300" /> </template>
      Add
    </dt-button>
    <dt-button class="d-px-100 d-w-100" :size="100" kind="muted" importance="clear">
      <template #blockStartIcon> <dt-icon name="more-horizontal" size="300" /> </template>
      More
    </dt-button>
  </dt-stack>
  <dt-stack>
    <dt-button class="d-p-150" :size="400" kind="critical">
      <template #startIcon> <dt-icon name="phone-hang-up" size="500" /> </template>
    </dt-button>
  </dt-stack>
</dt-stack>
<dt-text as="p" kind="label" :size="200" tone="muted" class="d-mbs-100">* Not real, still just an example</dt-text>
```

### Positioned Components

[Popovers](/components/popover.html), [Dropdowns](/components/dropdown.html), [Modals](/components/modal.html), and [Hovercards](/components/hovercard.html) render their content *outside* the normal DOM tree, so `v-dt-mode` on the component itself won't reach the positioned element. Use their `content-mode` prop (`contentMode` in JavaScript) to apply the mode directly to the positioned content.

```vue demo
<dt-stack gap="200">
  <dt-stack gap="25">
    <dt-text as="p" kind="headline" :size="300">Hovercard</dt-text>
    <dt-stack gap="100" direction="row">
      <dt-hovercard placement="top-start">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined">Default </dt-button>
        </template>
        <template #content>
          <ExampleProfileCard />
        </template>
      </dt-hovercard>
      <dt-hovercard content-mode="invert" placement="top-start">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined">Inverted </dt-button>
        </template>
        <template #content>
          <ExampleProfileCard />
        </template>
      </dt-hovercard>
      <dt-hovercard content-mode="light" placement="top-start">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined">Light </dt-button>
        </template>
        <template #content>
          <ExampleProfileCard />
        </template>
      </dt-hovercard>
      <dt-hovercard content-mode="dark" placement="top-start">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined">Dark </dt-button>
        </template>
        <template #content>
          <ExampleProfileCard />
        </template>
      </dt-hovercard>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="25">
    <dt-text as="p" kind="headline" :size="300">Popover</dt-text>
    <dt-stack gap="100" direction="row">
      <dt-popover placement="top-start" dialogClass="d-w-350">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined"> Default </dt-button>
        </template>
        <template #content="{ close }">
          <dt-text as="p">This is just a default Popover, and does not use Mode Island.</dt-text>
        </template>
      </dt-popover>
      <dt-popover content-mode="invert" placement="top-start" dialogClass="d-w-350">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined"> Inverted </dt-button>
        </template>
        <template #content="{ close }">
          <dt-text as="p">This Popover's content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
        </template>
      </dt-popover>
      <dt-popover content-mode="light" placement="top-start" dialogClass="d-w-350">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined"> Light </dt-button>
        </template>
        <template #content="{ close }">
          <dt-text as="p">This Popover's content is in explicit <dt-text strength="strong">light</dt-text> mode.</dt-text>
        </template>
      </dt-popover>
      <dt-popover content-mode="dark" placement="top-start" dialogClass="d-w-350">
        <template #anchor>
          <dt-button :size="200" kind="muted" importance="outlined"> Dark </dt-button>
        </template>
        <template #content="{ close }">
          <dt-text as="p">This Popover's content is in explicit <dt-text strength="strong">dark</dt-text> mode.</dt-text>
        </template>
      </dt-popover>
    </dt-stack>
  </dt-stack>
  <dt-stack gap="25">
    <dt-text as="p" kind="headline" :size="300">Dropdown</dt-text>
    <dt-stack gap="100" direction="row">
      <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
        <template #anchor="{ attrs }">
          <dt-button v-bind="attrs" :size="200" kind="muted" importance="outlined">
            Default
            <template #endIcon="{ iconSize }">
              <dt-icon name="chevron-down" :size="iconSize" />
            </template>
          </dt-button>
        </template>
        <template #list="{ close }">
          <dt-list-item
            v-for="item in items"
            :key="item.id"
            role="menuitem"
            :navigation-type="arrow - keys"
            @click="close"
          >
            {{ item.name }}
          </dt-list-item>
        </template>
      </dt-dropdown>
      <dt-dropdown content-mode="invert" navigation-type="arrow-keys" placement="bottom-start">
        <template #anchor="{ attrs }">
          <dt-button v-bind="attrs" :size="200" kind="muted" importance="outlined">
            Inverted
            <template #endIcon="{ iconSize }">
              <dt-icon name="chevron-down" :size="iconSize" />
            </template>
          </dt-button>
        </template>
        <template #list="{ close }">
          <dt-list-item
            v-for="item in items"
            :key="item.id"
            role="menuitem"
            :navigation-type="arrow - keys"
            @click="close"
          >
            {{ item.name }}
          </dt-list-item>
        </template>
      </dt-dropdown>
      <dt-dropdown content-mode="light" navigation-type="arrow-keys" placement="bottom-start">
        <template #anchor="{ attrs }">
          <dt-button v-bind="attrs" :size="200" kind="muted" importance="outlined">
            Light
            <template #endIcon="{ iconSize }">
              <dt-icon name="chevron-down" :size="iconSize" />
            </template>
          </dt-button>
        </template>
        <template #list="{ close }">
          <dt-list-item
            v-for="item in items"
            :key="item.id"
            role="menuitem"
            :navigation-type="arrow - keys"
            @click="close"
          >
            {{ item.name }}
          </dt-list-item>
        </template>
      </dt-dropdown>
      <dt-dropdown content-mode="dark" navigation-type="arrow-keys" placement="bottom-start">
        <template #anchor="{ attrs }">
          <dt-button v-bind="attrs" :size="200" kind="muted" importance="outlined">
            Dark
            <template #endIcon="{ iconSize }">
              <dt-icon name="chevron-down" :size="iconSize" />
            </template>
          </dt-button>
        </template>
        <template #list="{ close }">
          <dt-list-item
            v-for="item in items"
            :key="item.id"
            role="menuitem"
            :navigation-type="arrow - keys"
            @click="close"
          >
            {{ item.name }}
          </dt-list-item>
        </template>
      </dt-dropdown>
    </dt-stack>
  </dt-stack>
</dt-stack>
<!-- @code -->
<!-- Hovercard -->
<dt-hovercard placement="top-start" content-mode="invert">
  <template #anchor>
    <dt-button :size="200" kind="muted" importance="outlined">Default</dt-button>
  </template>
  <template #content>
    <ExampleProfileCard />
  </template>
</dt-hovercard>
<!-- Popover -->
<dt-popover content-mode="invert" placement="top-start" dialogClass="d-w-350">
  <template #anchor>
    <dt-button :size="200" kind="muted" importance="outlined"> Inverted </dt-button>
  </template>
  <template #content="{ close }">
    <dt-text as="p">This Popover content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
  </template>
</dt-popover>
<!-- Dropdown -->
<dt-dropdown content-mode="invert" navigation-type="arrow-keys" placement="bottom-start">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs" :size="200" kind="muted" importance="outlined">
      Inverted
      <template #endIcon="{ iconSize }">
        <dt-icon name="chevron-down" :size="iconSize" />
      </template>
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-list-item
      v-for="item in items"
      :key="item.id"
      role="menuitem"
      :navigation-type="arrow - keys"
      @click="close"
    >
      {{ item.name }}
    </dt-list-item>
  </template>
</dt-dropdown>
```

## Mode Island component

> [!INFO] Prefer the directive
> Use `v-dt-mode` by default, including on a new native container. Choose `DtModeIsland` when you deliberately want its container and automatic primary surface together, or cannot install the current directive plugin.

Both APIs create scoped mode regions and share utility functions, but have separate implementations. The component renders a container, controlled by its `as` prop, and paints the active mode's primary surface. The directive attaches to an existing element, such as `<span v-dt-mode:invert>...</span>`, without adding a container or background.

The component's default mode is `inverted`, equivalent in intent to the directive's `invert` argument. See [Directive or component?](#directive-or-component) for registration and server-rendering considerations.

```vue code-only
<dt-mode-island as="section">
  Rendered as a section element inverted
</dt-mode-island>
<dt-mode-island>
  Inverted (default)
</dt-mode-island>
<dt-mode-island mode="light">
  Light
</dt-mode-island>
<dt-mode-island mode="dark">
  Dark
</dt-mode-island>
```

## Accessibility

Changing color mode is visual. The directive preserves the element's semantics; the component's `as` prop determines its container semantics. Both inherit the root's high-contrast setting. Check readability against the chosen background in light, dark, and high-contrast modes.

<script setup>
import { DtIconPhone, DtIconQuickReply, DtIconVideo } from '@dialpad/dialtone-icons/vue';
import ExampleProfileCard from '@exampleComponents/ExampleProfileCard.vue';
import { useThemeManager } from '@composables/useThemeManager';
import { ref } from 'vue';
// Use theme manager composable without theme switching (mode + contrast only)
const {
  currentMode,
  currentContrast,
  setMode,
  setContrast,
} = useThemeManager({ includeThemes: false });

const dynamicMode = ref('invert');

const items = ref([
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
]);

</script>

## Vue API

### Directive

```js
import { DtModeDirective } from '@dialpad/dialtone-vue';
app.use(DtModeDirective);
```

### Component

<component-vue-api component-name="modeisland" />
