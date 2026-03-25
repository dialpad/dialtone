---
title: Mode Island
description: Apply light, dark, or inverted color mode to any element or region.
status: beta
keywords: ["theme island","mode override","v-dt-mode","directive","light","dark","invert","v-dt"]
---

<code-example only-show="demo">
  <dt-stack gap="500">
    <dt-stack direction="row" gap="500" justify="space-between" class="d-w100p">
      <dt-text as="h4" kind="headline" size="lg">Demo</dt-text>
      <dt-dropdown
        navigation-type="arrow-keys"
        placement="bottom-end"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            kind="muted"
            size="sm"
          >
            <dt-stack gap="400" direction="row">
              <span>
                <dt-text strength="bold">Mode:</dt-text>
                <dt-text tone="tertiary">{{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}</dt-text>
              </span>
              <span>
                <dt-text strength="bold">Contrast:</dt-text>
                <dt-text tone="tertiary">{{ currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1) }}</dt-text>
              </span>
            </dt-stack>
            <template #startIcon="{ iconSize }">
              <dt-icon
                :size="iconSize"
                :name="currentModeIconName"
              />
            </template>
            <template #endIcon="{ iconSize }">
              <dt-icon
                :size="iconSize"
                name="chevron-down"
              />
            </template>
          </dt-button>
        </template>
        <template #list>
          <dt-list-item-group
            heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
            heading="Mode"
          >
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setMode('system')"
            >
              System
              <template #end>
                <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
              </template>
            </dt-list-item>
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setMode('light')"
            >
              Light
              <template #end>
                <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
              </template>
            </dt-list-item>
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setMode('dark')"
            >
              Dark
              <template #end>
                <dt-icon :class="{ 'd-o0': currentMode !== 'dark' }" name="check" size="200" />
              </template>
            </dt-list-item>
          </dt-list-item-group>
          <dt-dropdown-separator />
          <dt-list-item-group
            heading-class="d-py4 d-px8 d-c-default d-fc-tertiary d-label--sm"
            heading="Contrast"
          >
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setContrast('default')"
            >
              Default
              <template #end>
                <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
              </template>
            </dt-list-item>
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setContrast('high')"
            >
              High
              <template #end>
                <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
              </template>
            </dt-list-item>
          </dt-list-item-group>
        </template>
      </dt-dropdown>
    </dt-stack>
    <dt-stack :direction="{ 'default': 'column', 'lg': 'row' }" gap="500" class="d-w100p">
      <dt-stack gap="400" class="d-fl1">
        <dt-text as="h3" kind="headline" size="md">Inverted <dt-text strength="normal">(auto)</dt-text></dt-text>
        <dt-stack v-dt-mode:invert gap="400" class="d-bgc-secondary d-p16 d-bar8 d-ba d-bc-default">
          <dt-stack gap="400" direction="row">
            <dt-icon name="circle-half-filled" size="300" class="d-fc-success" />
            <dt-text as="p" kind="body" size="sm">Primary</dt-text>
            <dt-text as="p" kind="body" size="sm" tone="muted">Muted</dt-text>
            <dt-text as="p" kind="body" size="sm" tone="critical">Critical</dt-text>
            <dt-link>Link</dt-link>
          </dt-stack>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button size="sm" class="d-fl1">Button</dt-button>
            <dt-button size="sm" class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="d-fl1">
        <dt-text as="h3" kind="headline" size="md">Explicit light</dt-text>
        <dt-stack v-dt-mode:light gap="400" class="d-bgc-secondary d-p16 d-bar8 d-ba d-bc-default">
          <dt-stack gap="400" direction="row">
            <dt-icon name="sun" size="300" class="d-fc-success" />
            <dt-text as="p" kind="body" size="sm">Primary</dt-text>
            <dt-text as="p" kind="body" size="sm" tone="muted">Muted</dt-text>
            <dt-text as="p" kind="body" size="sm" tone="critical">Critical</dt-text>
            <dt-link>Link</dt-link>
          </dt-stack>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button size="sm" class="d-fl1">Button</dt-button>
            <dt-button size="sm" class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack gap="400" class="d-fl1">
        <dt-text as="h3" kind="headline" size="md">Explicit dark</dt-text>
        <dt-stack v-dt-mode:dark gap="400" class="d-bgc-secondary d-p16 d-bar8 d-ba d-bc-default">
          <dt-stack gap="400" direction="row">
            <dt-icon name="moon" size="300" class="d-fc-success" />
            <dt-text as="p" kind="body" size="sm">Primary</dt-text>
            <dt-text as="p" kind="body" size="sm" tone="muted">Muted</dt-text>
            <dt-text as="p" kind="body" size="sm" tone="critical">Critical</dt-text>
            <dt-link>Link</dt-link>
          </dt-stack>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button size="sm" class="d-fl1">Button</dt-button>
            <dt-button size="sm" class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-example>

<!-- <component-combinator component-name="DtModeIsland" /> -->

## Usage

Use the `v-dt-mode` directive to control the color mode of a region, component, or element. It creates a scoped region with the specified mode. Descendant elements retain their original styling but are rendered with the specified mode.

<code-example>
  <dt-stack gap="400" data-demo-wrapper>
    <dt-text v-dt-mode:dark tone="success"> Dark content </dt-text>
    <dt-text v-dt-mode:light tone="success"> Light content </dt-text>
    <dt-text v-dt-mode:invert tone="success"> Inverted — opposite of parent or root </dt-text>
  </dt-stack>
</code-example>

### Inverting

This effectively removes the need for `inverted` props or variants on elements or components.

For example, instead of using `inverted` on a DtButton, use `v-dt-mode:invert`

<code-example>
  <dt-stack gap="400" direction="row" data-demo-wrapper>
    <dt-button>Button</dt-button>
    <dt-button v-dt-mode:invert>Button</dt-button>
  </dt-stack>
</code-example>

### Dynamic mode

Bind a reactive variable as the directive arg to switch modes at runtime.

<code-example vueCode='
<dt-text v-dt-mode:{mode} align="center" tone="success"> ... mode </dt-text>
'>
  <dt-stack gap="500">
    <dt-stack gap="400" direction="row">
      <dt-button
        kind="muted"
        size="sm"
        importance="outlined"
        :active="dynamicMode === 'invert'"
        @click="dynamicMode = 'invert'"
      >
        Invert
        <template #startIcon="{ iconSize }">
          <dt-icon name="circle-half-filled" :size="iconSize" />
        </template>
      </dt-button>
      <dt-button
        kind="muted"
        size="sm"
        importance="outlined"
        :active="dynamicMode === 'light'"
        @click="dynamicMode = 'light'"
      >
        Light
        <template #startIcon="{ iconSize }">
          <dt-icon name="sun" :size="iconSize" />
        </template>
      </dt-button>
      <dt-button
        kind="muted"
        size="sm"
        importance="outlined"
        :active="dynamicMode === 'dark'"
        @click="dynamicMode = 'dark'"
      >
        Dark
        <template #startIcon="{ iconSize }">
          <dt-icon name="moon" :size="iconSize" />
        </template>
      </dt-button>
    </dt-stack>
    <dt-text v-dt-mode:[dynamicMode] align="center" tone="success"> {{ dynamicMode }} mode </dt-text>
  </dt-stack>
</code-example>

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
- For `invert` mode, the directive reads the nearest ancestor's `data-dt-mode`, computes the opposite, and reacts when it changes
- `data-dt-brand` (theme) cannot be set on mode islands — brand is root-level only

## Variants

### Inverted

The default mode — inverts relative to the nearest parent mode boundary or the root. When no arg is provided, `v-dt-mode` defaults to invert.

<code-example>
  <section v-dt-mode class="d-p16 d-bar8">
    <dt-text as="p" tone="success">Inverted mode (opposite of parent)</dt-text>
  </section>
</code-example>

### Light

Explicitly set to light mode regardless of parent or root mode.

<code-example>
  <section v-dt-mode:light class="d-p16 d-bar8">
    <dt-text as="p" tone="success">Always light mode</dt-text>
  </section>
</code-example>

### Dark

Explicitly set to dark mode regardless of parent or root mode.

<code-example>
  <section v-dt-mode:dark class="d-p16 d-bar8">
    <dt-text as="p" tone="success">Always dark mode</dt-text>
  </section>
</code-example>

## Nesting

Mode boundaries can be nested. Each `v-dt-mode:invert` reads the nearest parent boundary and flips. In this example the first level is explicitly set to light mode, the second level inverts against that, and the third level inverts again.

<code-example>
  <dt-stack gap="500" v-dt-mode:light class="d-p16 d-bar8 d-bgc-secondary d-ba">
    <dt-text as="p" tone="success" text-box-trim="both">Explicit Light</dt-text>
    <dt-stack v-dt-mode gap="500" class="d-p16 d-bar8 d-bgc-secondary">
      <dt-text as="p" tone="success" text-box-trim="both">Inverted (Dark)</dt-text>
      <dt-stack v-dt-mode gap="500" class="d-p16 d-bar4 d-bgc-secondary">
        <dt-text as="p" tone="success" text-box-trim="both">Inverted again (Light)</dt-text>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-example>

## Custom background

The background surface of a Mode Island defaults to the root surface color. To override, use a CSS Utility class.

<code-example>
  <dt-stack gap="500" data-demo-wrapper>
    <dt-mode-island class="d-p16 d-bar8 d-w100p d-bgc-transparent">
      <dt-stack gap="400">
        <dt-text as="p" kind="code" size="xs" tone="tertiary">Transparent background, inverted mode island</dt-text>
        <div>
          <dt-button>Button</dt-button>
        </div>
      </dt-stack>
    </dt-mode-island>
    <dt-mode-island class="d-p16 d-bar8 d-w100p">
      <dt-stack gap="400">
        <dt-text as="p" kind="code" size="xs" tone="tertiary">Default background, inverted mode island</dt-text>
        <div>
          <dt-button>Button</dt-button>
        </div>
      </dt-stack>
    </dt-mode-island>
    <dt-mode-island mode="dark" class="d-p16 d-bar8 d-w100p d-bgc-critical">
      <dt-stack gap="400">
        <dt-text as="p" kind="code" size="xs" tone="tertiary">critical background, dark mode island</dt-text>
        <div>
          <dt-button>Button</dt-button>
        </div>
      </dt-stack>
    </dt-mode-island>
    <dt-mode-island mode="light" class="d-p16 d-bar8 d-w100p d-bgc-critical">
      <dt-stack gap="400">
        <dt-text as="p" kind="code" size="xs" tone="tertiary">critical background, light mode island</dt-text>
        <div>
          <dt-button>Button</dt-button>
        </div>
      </dt-stack>
    </dt-mode-island>
  </dt-stack>
</code-example>

## Examples

### Callbar

A real-world pattern: the callbar container already exists as a semantic element. The directive applies mode theming directly — no wrapper needed.

<code-example>
  <dt-stack v-dt-mode class="d-ba d-bc-subtle d-bgc-secondary d-p6 d-py4 d-bar12 d-bs-md d-w100p" direction="row" gap="600">
    <dt-stack gap="400" direction="row">
      <dt-avatar
        full-name="TA"
        seed="ted-anderson"
        size="lg"
      />
      <dt-stack gap="200">
        <dt-text kind="label" size="md" density="200">Ted Anderson</dt-text>
        <dt-stack direction="row" gap="300" align="baseline">
          <dt-text kind="body" size="xs" tone="tertiary" wrap="nowrap" numeric>(913) 555-6745</dt-text>
          <dt-text kind="body" size="xs" tone="muted">&bull;</dt-text>
          <dt-text kind="body" size="xs" tone="tertiary" numeric>21:18</dt-text>
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack class="d-fl1" direction="row" gap="200" justify="center">
      <dt-button class="d-px8 d-w64 d-w64" size="xs" kind="danger">
        <template #blockStartIcon> <dt-icon name="mic" size="300" /> </template>
        Unmute
      </dt-button>
      <dt-button class="d-px8 d-w64 d-w64" size="xs" kind="muted" importance="clear">
        <template #blockStartIcon> <dt-icon name="record-filled" size="300" /> </template>
        Record
      </dt-button>
      <dt-button class="d-px8 d-w64 d-w64" size="xs" kind="muted" importance="clear">
        <template #blockStartIcon> <dt-icon name="keypad" size="300" /> </template>
        Keypad
      </dt-button>
      <dt-button class="d-px8 d-w64 d-w64" size="xs" kind="muted" importance="clear">
        <template #blockStartIcon> <dt-icon name="user-plus" size="300" /> </template>
        Add
      </dt-button>
      <dt-button class="d-px8 d-w64 d-w64" size="xs" kind="muted" importance="clear">
        <template #blockStartIcon> <dt-icon name="more-horizontal" size="300" /> </template>
        More
      </dt-button>
    </dt-stack>
    <dt-stack>
      <dt-button class="d-p12" circle size="lg" kind="danger">
        <template #startIcon> <dt-icon name="phone-hang-up" size="500" /> </template>
      </dt-button>
    </dt-stack>
  </dt-stack>
  <dt-text as="p" kind="label" size="sm" tone="muted" class="d-mt8">* Not real, still just an example</dt-text>
</code-example>

### Positioned Components

[Popovers](/components/popover.html), [Dropdowns](/components/dropdown.html), [Modals](/components/modal.html), and [Hovercards](/components/hovercard.html) render their content *outside* the normal DOM tree, so `v-dt-mode` on the component itself won't reach the positioned element. These components provide a `contentMode` prop that applies the mode directly to the positioned content.

<code-example vueCode='
<!-- Hovercard -->
<dt-hovercard placement="top-start" content-mode="invert">
  <template #anchor>
    <dt-button size="sm" kind="muted" importance="outlined">Default</dt-button>
  </template>
  <template #content>
    <ExampleProfileCard />
  </template>
</dt-hovercard>
<!-- Popover -->
<dt-popover content-mode="invert" placement="top-start" dialogClass="d-w216">
  <template #anchor>
    <dt-button size="sm" kind="muted" importance="outlined"> Inverted </dt-button>
  </template>
  <template #content="{ close }">
    <dt-text as="p">This Popover content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
  </template>
</dt-popover>
<!-- Dropdown -->
<dt-dropdown content-mode="invert" navigation-type="arrow-keys" placement="bottom-start">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
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
'>
  <dt-stack gap="500">
    <dt-stack gap="200">
      <dt-text as="p" kind="headline" size="md">Hovercard</dt-text>
      <dt-stack gap="400" direction="row">
        <dt-hovercard placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Default </dt-button>
          </template>
          <template #content>
            <ExampleProfileCard />
          </template>
        </dt-hovercard>
        <dt-hovercard content-mode="invert" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Inverted </dt-button>
          </template>
          <template #content>
            <ExampleProfileCard />
          </template>
        </dt-hovercard>
        <dt-hovercard content-mode="light" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Light </dt-button>
          </template>
          <template #content>
            <ExampleProfileCard />
          </template>
        </dt-hovercard>
        <dt-hovercard content-mode="dark" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Dark </dt-button>
          </template>
          <template #content>
            <ExampleProfileCard />
          </template>
        </dt-hovercard>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text as="p" kind="headline" size="md">Popover</dt-text>
      <dt-stack gap="400" direction="row">
        <dt-popover placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Default </dt-button>
          </template>
          <template #content="{ close }">
            <dt-text as="p">This is just a default Popover, and does not use Mode Island.</dt-text>
          </template>
        </dt-popover>
        <dt-popover content-mode="invert" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Inverted </dt-button>
          </template>
          <template #content="{ close }">
            <dt-text as="p">This Popover's content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
          </template>
        </dt-popover>
        <dt-popover content-mode="light" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Light </dt-button>
          </template>
          <template #content="{ close }">
            <dt-text as="p">This Popover's content is in explicit <dt-text strength="strong">light</dt-text> mode.</dt-text>
          </template>
        </dt-popover>
        <dt-popover content-mode="dark" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Dark </dt-button>
          </template>
          <template #content="{ close }">
            <dt-text as="p">This Popover's content is in explicit <dt-text strength="strong">dark</dt-text> mode.</dt-text>
          </template>
        </dt-popover>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="200">
      <dt-text as="p" kind="headline" size="md">Dropdown</dt-text>
      <dt-stack gap="400" direction="row">
        <dt-dropdown navigation-type="arrow-keys" placement="bottom-start">
          <template #anchor="{ attrs }">
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
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
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
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
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
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
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
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
</code-example>

## Component

The `<dt-mode-island>` component is the underlying abstraction that the directive builds on. The key rendered difference is that it creates a wrapper element, while the directive attaches to mode to the existing element.

<dt-notice
  kind="info"
  class="d-wmx100p d-mt24 d-mb24"
  hide-close
  title="Note"
>
  The only real case where you might want to use the component is when you need to create a container element that doesn't already exist, but even then, you can create any kind of containing element with the directive e.g. <code>&lt;span v-dt-mode:invert"&gt;...&lt;/span&gt;</code>.
</dt-notice>

<code-example only-show="code">
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
</code-example>

## Vue API

### Directive

```js
import { DtModeDirective } from '@dialpad/dialtone-vue';
app.use(DtModeDirective);
```

### Component

<component-vue-api component-name="modeisland" />

## Accessibility

Purely visual. No semantic HTML impact. Supports high contrast mode via auto contrast inheritance.

<script setup>
import { DtIconPhone, DtIconQuickReply, DtIconVideo } from '@dialpad/dialtone-icons/vue';
import ExampleProfileCard from '@exampleComponents/ExampleProfileCard.vue';
import { useThemeManager } from '@composables/useThemeManager';
import { ref } from 'vue';
// Use theme manager composable without theme switching (mode + contrast only)
const {
  currentMode,
  currentContrast,
  currentModeIconName,
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
