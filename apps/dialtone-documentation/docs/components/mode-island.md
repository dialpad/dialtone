---
title: Mode Island
description: Create isolated sections with independent color modes.
status: beta
---

<code-well-header>
  <dt-stack gap="500" class="d-ai-flex-start d-w100p">
    <dt-stack direction="row" gap="500" class="d-jc-space-between d-w100p">
      <h4 class="d-headline--lg">Demo</h4>
      <dt-dropdown
        navigation-type="arrow-keys"
        placement="bottom-end"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            kind="muted"
          >
            <dt-stack gap="400" direction="row">
              <span><strong>Mode:</strong> {{ currentMode.charAt(0).toUpperCase() + currentMode.slice(1) }}</span>
              <span><strong>Contrast:</strong> {{ currentContrast.charAt(0).toUpperCase() + currentContrast.slice(1) }}</span>
            </dt-stack>
            <template #icon>
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
              <template #right>
                <dt-icon :class="{ 'd-o0': currentMode !== 'system' }" name="check" size="200" />
              </template>
            </dt-list-item>
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setMode('light')"
            >
              Light
              <template #right>
                <dt-icon :class="{ 'd-o0': currentMode !== 'light' }" name="check" size="200" />
              </template>
            </dt-list-item>
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setMode('dark')"
            >
              Dark
              <template #right>
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
              <template #right>
                <dt-icon :class="{ 'd-o0': currentContrast !== 'default' }" name="check" size="200" />
              </template>
            </dt-list-item>
            <dt-list-item
              role="menuitem"
              navigation-type="arrow-keys"
              @click="setContrast('high')"
            >
              High
              <template #right>
                <dt-icon :class="{ 'd-o0': currentContrast !== 'high' }" name="check" size="200" />
              </template>
            </dt-list-item>
          </dt-list-item-group>
        </template>
      </dt-dropdown>
    </dt-stack>
    <dt-stack :direction="{ 'default': 'column', 'md': 'row' }" gap="500" class="d-w100p">
      <dt-mode-island class="d-p16 d-bar8 d-ba d-fl1">
        <dt-stack gap="400">
          <dt-stack direction="row" gap="400" class="d-jc-space-between">
            <h3 class="d-headline--md-compact">Inverted <span class="d-fw-normal">(auto)</span></h3>
            <dt-icon name="circle-half-filled" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="400" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <p>Primary</p>
            <p class="d-fc-tertiary">Tertiary</p>
            <p class="d-fc-critical">Critical</p>
          </dt-stack>
          <p>
            <dt-link>Text link</dt-link>
          </p>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
      <dt-mode-island mode="light" class="d-p16 d-bar8 d-ba d-fl1">
        <dt-stack gap="400">
          <dt-stack direction="row" gap="400" class="d-jc-space-between">
            <h3 class="d-headline--md-compact">Explicit light</h3>
            <dt-icon name="sun" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="400" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <p>Primary</p>
            <p class="d-fc-tertiary">Tertiary</p>
            <p class="d-fc-critical">Critical</p>
          </dt-stack>
          <p>
            <dt-link>Text link</dt-link>
          </p>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
      <dt-mode-island mode="dark" class="d-p16 d-bar8 d-ba d-fl1">
        <dt-stack gap="400">
          <dt-stack direction="row" gap="400" class="d-jc-space-between">
            <h3 class="d-headline--md-compact">Explicit dark</h3>
            <dt-icon name="moon" size="300" class="d-fc-success" />
          </dt-stack>
          <dt-stack gap="400" direction="row" class="d-py2 d-px8 d-bgc-moderate d-bar4 d-ba">
            <p>Primary</p>
            <p class="d-fc-tertiary">Tertiary</p>
            <p class="d-fc-critical">Critical</p>
          </dt-stack>
          <p>
            <dt-link>Text link</dt-link>
          </p>
          <dt-stack direction="row" gap="400" class="d-100p">
            <dt-button class="d-fl1">Button</dt-button>
            <dt-button class="d-fl1" kind="danger">Button</dt-button>
          </dt-stack>
        </dt-stack>
      </dt-mode-island>
    </dt-stack>
  </dt-stack>
</code-well-header>

## Usage

Mode islands create isolated sections that can display content in a different color mode. Useful for forcing specific themes on UI sections or inverting against the overall theme for visual hierarchy.

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

- Use only to force a region to a controlled theme for a unique purpose
- Use sparingly for specific needs, not general theming
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

### Contrast Inheritance

Contrast is not an option to set to a Mode Island. Contrast theme setting is inherited from the root element, i.e. `<html>`.

### Brand Theme Protection

`data-dt-brand` (aka "Theme", e.g. "tmo", "sunflower", etc) can not be set on Mode Islands. Brand theme can only be set at root level.

## Variants

### Inverted

The default mode, inverts the container relative to the parent or theme mode. If `mode` attribute is omitted, it defaults to `inverted`.

<code-well-header>
  <dt-mode-island ref="invertedExample" class="d-p16 d-bar8">
    <p>Inverted mode (opposite of parent)</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.invertedExample'
vueCode='
<dt-mode-island class="d-p16 d-bar8">
  <p>Inverted mode (opposite of parent)</p>
</dt-mode-island>
'
showHtmlWarning />

### Light

Always light mode regardless of parent or root mode.

<code-well-header>
  <dt-mode-island ref="lightExample" mode="light" class="d-p16 d-bar8">
    <p>Always light mode</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.lightExample'
vueCode='
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <p>Always light mode</p>
</dt-mode-island>
'
showHtmlWarning />

### Dark

Always dark mode regardless of parent or root mode.

<code-well-header>
  <dt-mode-island ref="darkExample" mode="dark" class="d-p16 d-bar8">
    <p>Always dark mode</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.darkExample'
vueCode='
<dt-mode-island mode="dark" class="d-p16 d-bar8">
  <p>Always dark mode</p>
</dt-mode-island>
'
showHtmlWarning />

## Custom element

Polymorphic rendering via `as` prop—controls which HTML element wraps content. Ensures proper document structure and semantic markup. Example values: `section` for thematic grouping, `article` for self-contained content. Defaults to `div` where semantics aren't a concern.

<code-well-header>
  <dt-mode-island ref="sectionExample" as="section" mode="dark" class="d-p16 d-bar8">
    <p>Rendered as section element</p>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.sectionExample'
vueCode='
<dt-mode-island as="section" mode="dark" class="d-p16 d-bar8">
  <p>Rendered as section element</p>
</dt-mode-island>
'
showHtmlWarning />

**Common values:** `div` (default), `section`, `article`, `nav`, `aside`, `header`, `footer`, `main`

## Nesting

Mode islands may be nested, though should rarely occur.

<code-well-header>
  <dt-mode-island ref="nestingExample" mode="light" class="d-p16 d-bar8">
    <p>Light island</p>
    <dt-mode-island class="d-p16 d-bar8">
      <p>Inverted → Dark island</p>
      <dt-mode-island class="d-p16 d-bar4">
        <p>Inverted again → Light island</p>
      </dt-mode-island>
    </dt-mode-island>
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.nestingExample'
vueCode='
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <p>Light island</p>
  <dt-mode-island class="d-p16 d-bar8">
    <p>Inverted → Dark island</p>
    <dt-mode-island class="d-p16 d-bar4">
      <p>Inverted again → Light island</p>
    </dt-mode-island>
  </dt-mode-island>
</dt-mode-island>
'
/>

## Examples

Positioned components like [Popovers](/components/popover.html), [Dropdowns](/components/dropdown.html), and [Hovercards](/components/hovercard.html) are typically rendered at the root element of the DOM tree, and thus inherit the page's mode by default. They can be forced to a specific mode using Mode Islands.

### Hovercard

<code-well-header>
  <dt-stack gap="400" direction="row">
    <dt-hovercard ref="hovercardDefault" padding="none" contentClass="d-body--sm" placement="top-start">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined">Default </dt-button>
      </template>
      <template #content>
        <div class="d-p16 d-bgc-secondary">
          <dt-stack gap="500">
            <dt-stack gap="400" class="d-jc-space-between">
              <dt-stack gap="200">
                <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                <dt-stack direction="row" gap="350">
                  <span class="d-fc-success">Available</span>
                  <span>&bull;</span>
                  <span class="d-fc-tertiary">Working from coffee shop</span>
                </dt-stack>
              </dt-stack>
              <dt-stack class="d-body--md-compact">
                <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
              </dt-stack>
            </dt-stack>
            <dt-stack gap="400" direction="row" class="d-jc-space-between">
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-phone :size="iconSize" />
                </template>
                Call
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-quick-reply :size="iconSize" />
                </template>
                Message
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-video :size="iconSize" />
                </template>
                Meet
              </dt-button>
            </dt-stack>
          </dt-stack>
        </div>
      </template>
    </dt-hovercard>
    <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined">Inverted </dt-button>
      </template>
      <template #content>
        <dt-mode-island class="d-p16 d-bgc-secondary">
          <dt-stack gap="500">
            <dt-stack gap="400" class="d-jc-space-between">
              <dt-stack gap="200">
                <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                <dt-stack direction="row" gap="350">
                  <span class="d-fc-success">Available</span>
                  <span>&bull;</span>
                  <span class="d-fc-tertiary">Working from coffee shop</span>
                </dt-stack>
              </dt-stack>
              <dt-stack class="d-body--md-compact">
                <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
              </dt-stack>
            </dt-stack>
            <dt-stack gap="400" direction="row" class="d-jc-space-between">
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-phone :size="iconSize" />
                </template>
                Call
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-quick-reply :size="iconSize" />
                </template>
                Message
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-video :size="iconSize" />
                </template>
                Meet
              </dt-button>
            </dt-stack>
          </dt-stack>
        </dt-mode-island>
      </template>
    </dt-hovercard>
    <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined">Light </dt-button>
      </template>
      <template #content>
        <dt-mode-island mode="light" class="d-p16 d-bgc-secondary">
          <dt-stack gap="500">
            <dt-stack gap="400" class="d-jc-space-between">
              <dt-stack gap="200">
                <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                <dt-stack direction="row" gap="350">
                  <span class="d-fc-success">Available</span>
                  <span>&bull;</span>
                  <span class="d-fc-tertiary">Working from coffee shop</span>
                </dt-stack>
              </dt-stack>
              <dt-stack class="d-body--md-compact">
                <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
              </dt-stack>
            </dt-stack>
            <dt-stack gap="400" direction="row" class="d-jc-space-between">
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-phone :size="iconSize" />
                </template>
                Call
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-quick-reply :size="iconSize" />
                </template>
                Message
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-video :size="iconSize" />
                </template>
                Meet
              </dt-button>
            </dt-stack>
          </dt-stack>
        </dt-mode-island>
      </template>
    </dt-hovercard>
    <dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined">Dark </dt-button>
      </template>
      <template #content>
        <dt-mode-island mode="dark" class="d-p16 d-bgc-secondary">
          <dt-stack gap="500">
            <dt-stack gap="400" class="d-jc-space-between">
              <dt-stack gap="200">
                <h2 class="d-headline--xl-compact">Katie Rodriguez</h2>
                <dt-stack direction="row" gap="350">
                  <span class="d-fc-success">Available</span>
                  <span>&bull;</span>
                  <span class="d-fc-tertiary">Working from coffee shop</span>
                </dt-stack>
              </dt-stack>
              <dt-stack class="d-body--md-compact">
                <span class="d-fw-semibold d-fc-tertiary">Chief Customer Success Officer</span>
                <span><strong class="d-fw-semibold">6:19 am</strong> local time</span>
              </dt-stack>
            </dt-stack>
            <dt-stack gap="400" direction="row" class="d-jc-space-between">
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-phone :size="iconSize" />
                </template>
                Call
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-quick-reply :size="iconSize" />
                </template>
                Message
              </dt-button>
              <dt-button class="d-fl1" kind="muted" importance="outlined">
                <template #icon="{ iconSize }">
                  <dt-icon-video :size="iconSize" />
                </template>
                Meet
              </dt-button>
            </dt-stack>
          </dt-stack>
        </dt-mode-island>
      </template>
    </dt-hovercard>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.hovercardDefault'
vueCode='
<dt-hovercard padding="none" contentClass="d-body--sm" placement="top-start">
  <template #anchor>
    <dt-button size="sm" kind="muted" importance="outlined">Inverted</dt-button>
  </template>
  <template #content>
    <dt-mode-island class="d-p16 d-bgc-secondary">
      <!-- Content with inverted mode -->
    </dt-mode-island>
  </template>
</dt-hovercard>
'
showHtmlWarning />

### Popover

<code-well-header>
  <dt-stack gap="400" direction="row">
    <dt-popover ref="popoverDefault" padding="none" placement="top-start" dialogClass="d-w216">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined"> Default </dt-button>
      </template>
      <template #content="{ close }">
        <div class="d-p16">
          <p>This is just a default Popover, and does not use Mode Island.</p>
        </div>
      </template>
    </dt-popover>
    <dt-popover ref="popoverInverted" padding="none" placement="top-start" dialogClass="d-w216">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined"> Inverted </dt-button>
      </template>
      <template #content="{ close }">
        <dt-mode-island mode="inverted" class="d-p16 d-bgc-secondary">
          <p>This Popover's content is in the <strong>inverted</strong> mode.</p>
        </dt-mode-island>
      </template>
    </dt-popover>
    <dt-popover padding="none" placement="top-start" dialogClass="d-w216">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined"> Light </dt-button>
      </template>
      <template #content="{ close }">
        <dt-mode-island mode="light" class="d-p16 d-bgc-secondary">
          <p>This Popover's content is in explicit <strong>light</strong> mode.</p>
        </dt-mode-island>
      </template>
    </dt-popover>
    <dt-popover padding="none" placement="top-start" dialogClass="d-w216">
      <template #anchor>
        <dt-button size="sm" kind="muted" importance="outlined"> Dark </dt-button>
      </template>
      <template #content="{ close }">
        <dt-mode-island mode="dark" class="d-p16 d-bgc-secondary">
          <p>This Popover's content is in explicit <strong>dark</strong> mode.</p>
        </dt-mode-island>
      </template>
    </dt-popover>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.popoverInverted'
vueCode='
<dt-popover padding="none" placement="top-start" dialogClass="d-w216">
  <template #anchor>
    <dt-button size="sm" kind="muted" importance="outlined">Inverted</dt-button>
  </template>
  <template #content="{ close }">
    <dt-mode-island mode="inverted" class="d-p16 d-bgc-secondary">
      <p>This Popover content is in the <strong>inverted</strong> mode.</p>
    </dt-mode-island>
  </template>
</dt-popover>
'
showHtmlWarning />

### Dropdown

<code-well-header>
  <dt-stack gap="400" direction="row">
    <dt-dropdown ref="dropdownDefault" navigation-type="arrow-keys" placement="bottom-start">
      <template #anchor="{ attrs }">
        <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
          Default
          <template #icon="{ iconSize }">
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
        <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
          Inverted
          <template #icon="{ iconSize }">
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
        <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
          Light
          <template #icon="{ iconSize }">
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
        <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
          Dark
          <template #icon="{ iconSize }">
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
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.dropdownInverted'
vueCode='
<dt-dropdown navigation-type="arrow-keys" placement="bottom-start" listClass="d-m0" padding="small">
  <template #anchor="{ attrs }">
    <dt-button v-bind="attrs" size="sm" kind="muted" importance="outlined" icon-position="right">
      Inverted
      <template #icon="{ iconSize }">
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
showHtmlWarning />

### Callbar

<code-well-header>
  <dt-mode-island ref="callbarExample" class="d-ba d-bc-subtle d-p8 d-py4 d-bar32 d-bs-md d-w100p">
    <dt-stack direction="row" gap="600">
      <dt-stack gap="400" direction="row">
        <dt-avatar
          full-name="TA"
          color="700"
          size="lg"
        />
        <dt-stack gap="200">
          <span class="d-label--md-compact">Ted Anderson</span>
          <dt-stack direction="row" gap="300" class="d-ai-baseline d-helper--sm d-fc-tertiary">
            <span class="d-fvn-tabular d-ws-nowrap" >(913) 555-6745</span>
            <span class="d-fc-muted">&bull;</span>
            <span class="d-fvn-tabular">21:18</span>
          </dt-stack>
        </dt-stack>
      </dt-stack>
      <dt-stack class="d-fl1 d-jc-center" direction="row" gap="200">
        <dt-button class="d-px8 d-w72" size="sm" kind="danger" icon-position="top">
          <template #icon> <dt-icon name="mic" size="400" /> </template>
          Unmute
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="record-filled" size="400" /> </template>
          Record
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="keypad" size="400" /> </template>
          Keypad
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="user-plus" size="400" /> </template>
          Add
        </dt-button>
        <dt-button class="d-px8 d-w72" size="sm" kind="muted" importance="clear" icon-position="top">
          <template #icon> <dt-icon name="more-horizontal" size="400" /> </template>
          More
        </dt-button>
      </dt-stack>
      <dt-stack>
        <dt-button class="d-p12" circle size="lg" kind="danger">
          <template #icon> <dt-icon name="phone-hang-up" size="500" /> </template>
        </dt-button>
      </dt-stack>
    </dt-stack>
  </dt-mode-island>
  <p class="d-fc-muted d-mt8">* Not real, still just an example</p>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.callbarExample'
vueCode='
<dt-mode-island class="d-ba d-bc-subtle d-p8 d-py4 d-bar32 d-bs-md d-w100p">
  <dt-stack direction="row" gap="600">
    <dt-stack gap="400" direction="row">
      <dt-avatar full-name="TA" color="700" size="lg" />
      <dt-stack gap="200">
        <span class="d-label--md-compact">Ted Anderson</span>
        <dt-stack direction="row" gap="300" class="d-ai-baseline d-helper--sm d-fc-tertiary">
          <span class="d-fvn-tabular d-ws-nowrap">(913) 555-6745</span>
          <span class="d-fc-muted">&bull;</span>
          <span class="d-fvn-tabular">21:18</span>
        </dt-stack>
      </dt-stack>
    </dt-stack>
    <dt-stack class="d-fl1 d-jc-center" direction="row" gap="200">
      <dt-button class="d-px8 d-w72" size="sm" kind="danger" icon-position="top">
        <template #icon><dt-icon name="mic" size="400" /></template>
        Unmute
      </dt-button>
      <!-- Additional buttons... -->
    </dt-stack>
    <dt-stack>
      <dt-button class="d-p12" circle size="lg" kind="danger">
        <template #icon><dt-icon name="phone-hang-up" size="500" /></template>
      </dt-button>
    </dt-stack>
  </dt-stack>
</dt-mode-island>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="modeisland" />

## Accessibility

Purely visual. No semantic HTML impact. Supports high contrast mode via auto contrast inheritance.

<script setup>
import { DtIconPhone, DtIconQuickReply, DtIconVideo } from '@dialpad/dialtone-icons/vue3';
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
