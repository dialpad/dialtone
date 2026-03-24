---
title: Mode Island
description: Create independent sections with their own color modes.
status: beta
keywords: ["theme island","mode override","d-mode-island","DtModeIsland","dt-mode-island"]
---

<code-well-header>
  <dt-stack gap="200" class="d-ai-flex-start d-w100p">
    <dt-stack direction="row" gap="200" class="d-jc-space-between d-w100p">
      <dt-text as="h4" kind="headline" size="xl">Demo</dt-text>
      <dt-dropdown
        navigation-type="arrow-keys"
        placement="bottom-end"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            kind="muted"
          >
            <dt-stack gap="100" direction="row">
              <dt-text><dt-text strength="strong">Mode:</dt-text> {{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}</dt-text>
              <dt-text><dt-text strength="strong">Contrast:</dt-text> {{ currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1) }}</dt-text>
            </dt-stack>
            <template #startIcon>
              <dt-icon
                size="300"
                :name="currentModeIconName"
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
    <dt-stack :direction="{ 'default': 'column', 'md': 'row' }" gap="200" class="d-w100p">
      <dt-mode-island class="d-p16 d-bar8 d-ba d-fl1">
        <dt-stack gap="100">
          <dt-stack direction="row" gap="100" class="d-jc-space-between">
            <dt-text as="h3" kind="headline" size="md" density="200">Inverted <dt-text strength="normal">(auto)</dt-text></dt-text>
            <dt-icon name="circle-half-filled" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="100" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <dt-text as="p">Primary</dt-text>
            <dt-text as="p" tone="tertiary">Tertiary</dt-text>
            <dt-text as="p" tone="critical">Critical</dt-text>
          </dt-stack>
          <dt-text as="p">
            <dt-link>Text link</dt-link>
          </dt-text>
          <dt-stack direction="row" gap="100" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
      <dt-mode-island mode="light" class="d-p16 d-bar8 d-ba d-fl1">
        <dt-stack gap="100">
          <dt-stack direction="row" gap="100" class="d-jc-space-between">
            <dt-text as="h3" kind="headline" size="md" density="200">Explicit light</dt-text>
            <dt-icon name="sun" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="100" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <dt-text as="p">Primary</dt-text>
            <dt-text as="p" tone="tertiary">Tertiary</dt-text>
            <dt-text as="p" tone="critical">Critical</dt-text>
          </dt-stack>
          <dt-text as="p">
            <dt-link>Text link</dt-link>
          </dt-text>
          <dt-stack direction="row" gap="100" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
      <dt-mode-island mode="dark" class="d-p16 d-bar8 d-ba d-fl1">
        <dt-stack gap="100">
          <dt-stack direction="row" gap="100" class="d-jc-space-between">
            <dt-text as="h3" kind="headline" size="md" density="200">Explicit dark</dt-text>
            <dt-icon name="moon" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="100" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <dt-text as="p">Primary</dt-text>
            <dt-text as="p" tone="tertiary">Tertiary</dt-text>
            <dt-text as="p" tone="critical">Critical</dt-text>
          </dt-stack>
          <dt-text as="p">
            <dt-link>Text link</dt-link>
          </dt-text>
          <dt-stack direction="row" gap="100" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
    </dt-stack>
  </dt-stack>
</code-well-header>

## Usage

Mode islands create isolated regions that may display in a different color mode, `light`, `dark`, or `inverted`. Useful for forcing a region to a controlled mode for a unique UI purpose.

### Structure

<code-example-tabs
vueCode='
<dt-mode-island>
  Inverted
</dt-mode-island>
<dt-mode-island mode="light">
  Light
</dt-mode-island>
<dt-mode-island mode="dark">
  Dark
</dt-mode-island>
'
/>

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
- Do not use purely for decoration. Ensure Mode Island use serves a functional and unique purpose
- Avoid nesting deeply. Keep hierarchy shallow for maintainability

</template>

</dialtone-usage>

### Reactive Mode Updates

Inverted islands reactively track parent/root mode changes. User switches light ↔ dark → inverted islands flip automatically. Even directly modifying the `mode` attribute will also work.

### Brand Theme Protection

`data-dt-brand` (aka "Theme", e.g. "tmo", "sunflower", etc) can not be set on Mode Islands. Brand theme can only be set at root level and are inherited

### Contrast Inheritance

Contrast is not an option to set to a Mode Island. Contrast theme setting is inherited from the root element, i.e. `<html>`.

## Variants

### Inverted

The default mode, inverts the container relative to the parent or root's mode. When `mode` attribute is omitted, it defaults to `inverted`.

<code-well-header>
  <dt-mode-island ref="invertedExample" class="d-p16 d-bar8">
    <dt-text as="p">Inverted mode (opposite of parent)</dt-text>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.invertedExample'
vueCode='
<dt-mode-island class="d-p16 d-bar8">
  <dt-text as="p">Inverted mode (opposite of parent)</dt-text>
</dt-mode-island>
'
showHtmlWarning />

### Light

Explicitly set to light mode regardless of parent or root mode.

<code-well-header>
  <dt-mode-island ref="lightExample" mode="light" class="d-p16 d-bar8">
    <dt-text as="p">Always light mode</dt-text>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.lightExample'
vueCode='
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <dt-text as="p">Always light mode</dt-text>
</dt-mode-island>
'
showHtmlWarning />

### Dark

Explicitly set to dark mode regardless of parent or root mode.

<code-well-header>
  <dt-mode-island ref="darkExample" mode="dark" class="d-p16 d-bar8">
    <dt-text as="p">Always dark mode</dt-text>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.darkExample'
vueCode='
<dt-mode-island mode="dark" class="d-p16 d-bar8">
  <dt-text as="p">Always dark mode</dt-text>
</dt-mode-island>
'
showHtmlWarning />

## Custom element

Polymorphic rendering via `as` prop—controls which HTML element wraps content. Ensures proper document structure and semantic markup. Example values: `section` for thematic grouping, `article` for self-contained content. Defaults to `div` where semantics aren't a concern.

<code-well-header>
  <dt-mode-island ref="sectionExample" as="section" mode="dark" class="d-p16 d-bar8">
    <dt-text as="p">Rendered as section element</dt-text>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.sectionExample'
vueCode='
<dt-mode-island as="section" mode="dark" class="d-p16 d-bar8">
  <dt-text as="p">Rendered as section element</dt-text>
</dt-mode-island>
'
showHtmlWarning />

**Common values:** `div` (default), `section`, `article`, `nav`, `aside`, `header`, `footer`, `main`

## Nesting

Mode islands may be nested, though should rarely occur.

<code-well-header>
  <dt-mode-island ref="nestingExample" mode="light" class="d-p16 d-bar8">
    <dt-text as="p">Light island</dt-text>
    <dt-mode-island class="d-p16 d-bar8">
      <dt-text as="p">Inverted → Dark island</dt-text>
      <dt-mode-island class="d-p16 d-bar4">
        <dt-text as="p">Inverted again → Light island</dt-text>
      </dt-mode-island>
    </dt-mode-island>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.nestingExample'
vueCode='
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <dt-text as="p">Light island</dt-text>
  <dt-mode-island class="d-p16 d-bar8">
    <dt-text as="p">Inverted → Dark island</dt-text>
    <dt-mode-island class="d-p16 d-bar4">
      <dt-text as="p">Inverted again → Light island</dt-text>
    </dt-mode-island>
  </dt-mode-island>
</dt-mode-island>
'
/>

## Examples

### Callbar

<code-well-header>
  <dt-mode-island ref="callbarExample" class="d-ba d-bc-subtle d-p8 d-py4 d-bar32 d-bs-md d-w100p">
    <dt-stack direction="row" gap="400">
      <dt-stack gap="100" direction="row">
        <dt-avatar
          full-name="TA"
          seed="ted-anderson"
          size="lg"
        />
        <dt-stack gap="25">
          <dt-text kind="label" size="md" density="200">Ted Anderson</dt-text>
          <dt-stack direction="row" gap="50" align="baseline">
            <dt-text kind="body" size="xs" tone="tertiary" wrap="nowrap" numeric>(913) 555-6745</dt-text>
            <dt-text kind="body" size="xs" tone="muted">&bull;</dt-text>
            <dt-text kind="body" size="xs" tone="tertiary" numeric>21:18</dt-text>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack class="d-fl1 d-jc-center" direction="row" gap="25">
        <dt-button class="d-px8 d-w72" size="sm" kind="danger">
          <template #blockStartIcon> <dt-icon name="mic" size="400" /> </template>
          Unmute
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear">
          <template #blockStartIcon> <dt-icon name="record-filled" size="400" /> </template>
          Record
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear">
          <template #blockStartIcon> <dt-icon name="keypad" size="400" /> </template>
          Keypad
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear">
          <template #blockStartIcon> <dt-icon name="user-plus" size="400" /> </template>
          Add
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear">
          <template #blockStartIcon> <dt-icon name="more-horizontal" size="400" /> </template>
          More
        </dt-button>
      </dt-stack>
      <dt-stack>
        <dt-button class="d-p12" circle size="lg" kind="danger">
          <template #startIcon> <dt-icon name="phone-hang-up" size="500" /> </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-mode-island>
  <dt-text as="p" tone="muted" class="d-mt8">* Not real, still just an example</dt-text>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.callbarExample'
vueCode='
<dt-mode-island class="d-ba d-bc-subtle d-p8 d-py4 d-bar32 d-bs-md d-w100p">
  <dt-stack direction="row" gap="400">
    <dt-stack gap="100" direction="row">
      <dt-avatar full-name="TA" seed="ted-anderson" size="lg" />
      <dt-stack gap="25">
        <dt-text kind="label" size="md" density="200">Ted Anderson</dt-text>
        <dt-stack direction="row" gap="50" align="baseline">
          <dt-text kind="helper" size="sm" tone="tertiary" wrap="nowrap" numeric>(913) 555-6745</dt-text>
          <dt-text kind="helper" size="sm" tone="muted">&bull;</dt-text>
          <dt-text kind="helper" size="sm" tone="tertiary" numeric>21:18</dt-text>
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack class="d-fl1 d-jc-center" direction="row" gap="25">
      <dt-button class="d-px8 d-w72" size="sm" kind="danger">
        <template #blockStartIcon><dt-icon name="mic" size="400" /></template>
        Unmute
      </dt-button>
      <!-- Additional buttons... -->
    </dt-stack>
    <dt-stack>
      <dt-button class="d-p12" circle size="lg" kind="danger">
        <template #startIcon><dt-icon name="phone-hang-up" size="500" /></template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</dt-mode-island>
'
showHtmlWarning />

### Positioned Components

[Popovers](/components/popover.html), [Dropdowns](/components/dropdown.html), and [Hovercards](/components/hovercard.html) are typically rendered at the root element of the DOM tree, and thus inherit the page's mode by default. They can be forced to a specific mode by assigning a Mode Island to its content slot.

<code-well-header>
  <dt-stack gap="200">
    <dt-stack gap="25">
      <dt-text as="p" kind="headline" size="md">Hovercard</dt-text>
      <dt-stack gap="100" direction="row">
        <dt-hovercard ref="hovercardDefault" padding="none" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Default </dt-button>
          </template>
          <template #content>
            <div class="d-p16 d-bgc-secondary">
              <ExampleProfileCard />
            </div>
          </template>
        </dt-hovercard>
        <dt-hovercard padding="none" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Inverted </dt-button>
          </template>
          <template #content>
            <dt-mode-island class="d-p16 d-bgc-secondary">
              <ExampleProfileCard />
            </dt-mode-island>
          </template>
        </dt-hovercard>
        <dt-hovercard padding="none" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Light </dt-button>
          </template>
          <template #content>
            <dt-mode-island mode="light" class="d-p16 d-bgc-secondary">
              <ExampleProfileCard />
            </dt-mode-island>
          </template>
        </dt-hovercard>
        <dt-hovercard padding="none" placement="top-start">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined">Dark </dt-button>
          </template>
          <template #content>
            <dt-mode-island mode="dark" class="d-p16 d-bgc-secondary">
              <ExampleProfileCard />
            </dt-mode-island>
          </template>
        </dt-hovercard>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="25">
      <dt-text as="p" kind="headline" size="md">Popover</dt-text>
      <dt-stack gap="100" direction="row">
        <dt-popover ref="popoverDefault" padding="none" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Default </dt-button>
          </template>
          <template #content="{ close }">
            <div class="d-p16">
              <dt-text as="p">This is just a default Popover, and does not use Mode Island.</dt-text>
            </div>
          </template>
        </dt-popover>
        <dt-popover ref="popoverInverted" padding="none" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Inverted </dt-button>
          </template>
          <template #content="{ close }">
            <dt-mode-island mode="inverted" class="d-p16 d-bgc-secondary">
              <dt-text as="p">This Popover's content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
            </dt-mode-island>
          </template>
        </dt-popover>
        <dt-popover padding="none" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Light </dt-button>
          </template>
          <template #content="{ close }">
            <dt-mode-island mode="light" class="d-p16 d-bgc-secondary">
              <dt-text as="p">This Popover's content is in explicit <dt-text strength="strong">light</dt-text> mode.</dt-text>
            </dt-mode-island>
          </template>
        </dt-popover>
        <dt-popover padding="none" placement="top-start" dialogClass="d-w216">
          <template #anchor>
            <dt-button size="sm" kind="muted" importance="outlined"> Dark </dt-button>
          </template>
          <template #content="{ close }">
            <dt-mode-island mode="dark" class="d-p16 d-bgc-secondary">
              <dt-text as="p">This Popover's content is in explicit <dt-text strength="strong">dark</dt-text> mode.</dt-text>
            </dt-mode-island>
          </template>
        </dt-popover>
      </dt-stack>
    </dt-stack>
    <dt-stack gap="25">
      <dt-text as="p" kind="headline" size="md">Dropdown</dt-text>
      <dt-stack gap="100" direction="row">
        <dt-dropdown ref="dropdownDefault" navigation-type="arrow-keys" placement="bottom-start">
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
        <dt-dropdown ref="dropdownInverted" navigation-type="arrow-keys" placement="bottom-start" listClass="d-m0" padding="small">
          <template #anchor="{ attrs }">
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
              Inverted
              <template #endIcon="{ iconSize }">
                <dt-icon name="chevron-down" :size="iconSize" />
              </template>
            </dt-button>
          </template>
          <template #list="{ close }">
            <dt-mode-island class="d-bgc-secondary d-p4">
              <dt-list-item
                v-for="item in items"
                :key="item.id"
                role="menuitem"
                :navigation-type="arrow - keys"
                @click="close"
              >
                {{ item.name }}
              </dt-list-item>
            </dt-mode-island>
          </template>
        </dt-dropdown>
        <dt-dropdown navigation-type="arrow-keys" placement="bottom-start" listClass="d-m0" padding="small">
          <template #anchor="{ attrs }">
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
              Light
              <template #endIcon="{ iconSize }">
                <dt-icon name="chevron-down" :size="iconSize" />
              </template>
            </dt-button>
          </template>
          <template #list="{ close }">
            <dt-mode-island mode="light" class="d-bgc-secondary d-p4">
              <dt-list-item
                v-for="item in items"
                :key="item.id"
                role="menuitem"
                :navigation-type="arrow - keys"
                @click="close"
              >
                {{ item.name }}
              </dt-list-item>
            </dt-mode-island>
          </template>
        </dt-dropdown>
        <dt-dropdown navigation-type="arrow-keys" placement="bottom-start" listClass="d-m0" padding="small">
          <template #anchor="{ attrs }">
            <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
              Dark
              <template #endIcon="{ iconSize }">
                <dt-icon name="chevron-down" :size="iconSize" />
              </template>
            </dt-button>
          </template>
          <template #list="{ close }">
            <dt-mode-island mode="dark" class="d-bgc-secondary d-p4">
              <dt-list-item
                v-for="item in items"
                :key="item.id"
                role="menuitem"
                :navigation-type="arrow - keys"
                @click="close"
              >
                {{ item.name }}
              </dt-list-item>
            </dt-mode-island>
          </template>
        </dt-dropdown>
      </dt-stack>
    </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
vueCode='
<!-- Hovercard -->
<dt-hovercard padding="none" placement="top-start">
  <template #anchor>
    <dt-button size="sm" kind="muted" importance="outlined">Inverted</dt-button>
  </template>
  <template #content>
    <dt-mode-island class="d-p16 d-bgc-secondary">
      <ExampleProfileCard />
    </dt-mode-island>
  </template>
</dt-hovercard>
<!-- Popover -->
<dt-popover padding="none" placement="top-start" dialogClass="d-w216">
  <template #anchor>
    <dt-button size="sm" kind="muted" importance="outlined">Inverted</dt-button>
  </template>
  <template #content="{ close }">
    <dt-mode-island mode="inverted" class="d-p16 d-bgc-secondary">
      <dt-text as="p">This Popover content is in the <dt-text strength="strong">inverted</dt-text> mode.</dt-text>
    </dt-mode-island>
  </template>
</dt-popover>
<!-- Dropdown -->
<dt-dropdown navigation-type="arrow-keys" placement="bottom-start" listClass="d-m0" padding="small">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined">
      Inverted
      <template #endIcon="{ iconSize }">
        <dt-icon name="chevron-down" :size="iconSize" />
      </template>
    </dt-button>
  </template>
  <template #list="{ close }">
    <dt-mode-island class="d-bgc-secondary d-p4">
      <dt-list-item
        v-for="item in items"
        :key="item.id"
        role="menuitem"
        @click="close"
      >
        {{ item.name }}
      </dt-list-item>
    </dt-mode-island>
  </template>
</dt-dropdown>
'
/>

## Vue API

<component-vue-api component-name="modeisland" />

## Accessibility

Purely visual. No semantic HTML impact. Supports high contrast mode via auto contrast inheritance.

<script setup>
import { DtIconPhone, DtIconQuickReply, DtIconVideo } from '@dialpad/dialtone-icons/vue3';
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

const items = ref([
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3' },
]);

</script>
