---
title: Avatar
description: An avatar is a visual representation of a user or object.
status: ready
thumb: true
image: assets/images/components/avatar.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-avatar--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=5413-13176
---

<code-well-header>
  <dt-stack direction="row" align="center" gap="500">
    <dt-avatar size="lg">
      <template #icon="{ iconSize }">
        <dt-icon-user :size="iconSize" />
      </template>
    </dt-avatar>
    <dt-avatar size="lg" full-name="dp" seed="user-123" presence="busy" />
    <dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" presence="active" />
  </dt-stack>
</code-well-header>

<!-- <component-combinator component-name="DtAvatar" /> -->

## Usage

The Avatar component is designed to prioritize different sources for content display. It will sequentially check for the availability of an image source (`image-src`) or content through the icon slot. If both are not provided, the avatar will extract and display initials from the full name (`full-name`). The resulting initials are extracted using the following logic:

* If the string contains two or more words, the result will be the first character of the first and last word capitalized. E.g.:
`full-name: "Jaqueline Nackos"` will result in: `JN`.
* If the string contains only one word, the result will be the first two characters capitalized. E.g:
`full-name: "Jaqueline"` will result in: `JA`.
`full-name: "10"` will result in: `10`.
* If full-name is not provided, the result will be an empty string.

<table class="d-table dialtone-doc-table d-mb16">
    <colgroup>
        <col class="d-w64">
        <col>
        <col>
        <col>
    </colgroup>
    <thead>
        <tr>
            <th colspan="2">Type</th>
            <th>Usage</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <dt-avatar>
                  <template #icon="{ iconSize }">
                    <dt-icon-user :size="iconSize" />
                  </template>
                </dt-avatar>
            </td>
            <th class="d-ta-left"><a class="d-link" href="#icon">Icon</a></th>
            <td>When no username can be associated with the Avatar.</td>
        </tr>
        <tr>
            <td>
                <dt-avatar full-name="DP" seed="user-456" />
            </td>
            <th class="d-ta-left"><a class="d-link" href="#initials">Initials</a></th>
            <td>When the user's name is known.</td>
        </tr>
        <tr>
            <td>
                <dt-avatar image-alt="user avatar" image-src="/assets/images/person.png" />
            </td>
            <th class="d-ta-left"><a class="d-link" href="#image">Image</a></th>
            <td>When a custom image has been uploaded.</td>
        </tr>
        <tr>
            <td>
                <dt-avatar image-src="/assets/images/person.png" image-alt="person avatar" :group="3" />
            </td>
            <th class="d-ta-left"><a class="d-link" href="#group">Group</a></th>
            <td>When reflecting more than 2 participants.</td>
        </tr>
    </tbody>
</table>

## Variants and Examples

### Icon

<code-well-header>
  <dt-avatar>
    <template #icon="{ iconSize }">
      <dt-icon-user :size="iconSize" />
    </template>
  </dt-avatar>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--{$size}">
  <div class="d-avatar__canvas">
    <span class="d-avatar__icon">
      <svg>...</svg>
    </span>
  </div>
</div>'
vueCode='
<dt-avatar>
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
'
/>

### Initials

If no color information is provided, the avatar will display a random color based on the `seed` prop. This ensures consistent colors for the same user across sessions. Colors are dynamically computed using OKLCH and adapt to the current theme.

<code-well-header>
    <dt-stack direction="row" gap="500" class="d-wmx50p d-fw-wrap">
      <dt-avatar v-for="seed in seeds" :seed="seed" full-name="DP" />
    </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--{$size}" data-avatar-family="{$family}" data-avatar-variant="{$variant}">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">DP</span>
  </div>
</div>
'
vueCode='
<!-- Use seed for consistent random colors per user -->
<dt-avatar
  full-name="DP"
  seed="user-unique-id"
/>
'
/>

### Image

If `image-src` is not provided, or if image fails to load, the avatar will fall back to the initials extracted from the `full-name`.

<code-well-header>
  <dt-avatar image-src="/assets/images/person.png" image-alt="avatar user" />
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--{$size}">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/path/to/image" alt="avatar user" />
  </div>
</div>
'
vueCode='
<dt-avatar image-src="/assets/images/person.png" image-alt="avatar user" />
'
/>

### Sizes

Avatar supports a 100-based sizing scale. T-shirt sizes (`xs`, `sm`, `md`, `lg`, `xl`) are deprecated but still supported as aliases.

| Size | Alias | Dimensions |
|------|-------|------------|
| `100` | `xs` | 16px |
| `150` | — | 20px |
| `200` | `sm` | 24px |
| `250` | — | 28px |
| `300` | `md` | 32px (default) |
| `400` | `lg` | 40px |
| `500` | `xl` | 48px |
| `600` | — | 64px |
| `700` | — | 96px |
| `800` | — | 128px |
| `900` | — | 256px |

<code-well-header>
    <dt-stack direction="row" align="center" gap="500" class="d-fw-wrap">
        <dt-avatar v-for="size in sizes" :size="size">
          <template #icon="{ iconSize }">
            <dt-icon-user :size="iconSize" />
          </template>
        </dt-avatar>
    </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<!-- 100-based sizes (recommended) -->
<div class="d-avatar d-avatar--size-100">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-150">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-200">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-250">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-300">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-400">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-500">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-600">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-700">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-800">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--size-900">
  ss="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
'
vueCode='
<dt-avatar size="100">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="150">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="200">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="250">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="300">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="400">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="500">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="600">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="700">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="800">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
<dt-avatar size="900">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
'
/>

### Group

Adds a count badge and CSS mask to the avatar based on the number of digits (1, 2, or 3). Currently available only with the `xs` avatar size.

<code-well-header>
    <dt-stack direction="row" align="center" gap="500">
        <dt-avatar :group="100" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :group="11" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :group="3" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--group d-avatar--group-digits-3">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/assets/images/person.png" alt="Person Avatar"/>
  </div>
  <span class="d-avatar__count"><span class="d-avatar__count-number">12</span></span>
</div>
<div class="d-avatar d-avatar--group d-avatar--group-digits-2">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/assets/images/person.png" alt="Person Avatar"/>
  </div>
  <span class="d-avatar__count"><span class="d-avatar__count-number">12</span></span>
</div>
<div class="d-avatar d-avatar--group">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/assets/images/person.png" alt="Person Avatar"/>
  </div>
  <span class="d-avatar__count"><span class="d-avatar__count-number">1</span></span>
</div>
'
vueCode='
<dt-avatar :group="100" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar :group="11" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar :group="3" image-src="/assets/images/person.png" image-alt="Person Avatar" />
'
/>

### Presence

Positions the [Presence](/components/presence.md) component at each size and applies a CSS mask to the avatar.

<code-well-header>
  <dt-stack gap="400">
      <dt-stack direction="row" align="center" gap="400">
          <dt-avatar size="xs" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
          <dt-avatar size="sm" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
          <dt-avatar size="md" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
          <dt-avatar size="lg" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
          <dt-avatar size="xl" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
      </dt-stack>
      <dt-stack direction="row" align="center" gap="400">
          <dt-avatar size="xs" presence="active" seed="user-1" full-name="Test Name" />
          <dt-avatar size="sm" presence="away" seed="user-2" full-name="William Steele" />
          <dt-avatar size="md" presence="busy" seed="user-3" full-name="Frank Richard" />
          <dt-avatar size="lg" presence="offline" seed="user-4" full-name="John Hawkins" />
          <dt-avatar size="xl" presence="active" seed="user-5" full-name="Alice Edwards" />
      </dt-stack>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<!-- First set with images (no color needed when using image) -->
<div class="d-avatar d-avatar--xs d-avatar--presence">
  <div class="d-avatar__canvas">
    <img
      class="d-avatar__image"
      src="/assets/images/person.png"
      alt="Person Avatar"
    />
  </div>
  <div class="d-presence d-avatar__presence" role="status" aria-live="off">
    <div class="d-presence__inner d-presence__inner--active"></div>
  </div>
</div>
<div class="d-avatar d-avatar--sm d-avatar--presence">
  <div class="d-avatar__canvas">
    <img
      class="d-avatar__image"
      src="/assets/images/person.png"
      alt="Person Avatar"
    />
  </div>
  <div class="d-presence d-avatar__presence" role="status" aria-live="off">
    <div class="d-presence__inner d-presence__inner--away"></div>
  </div>
</div>
<div class="d-avatar d-avatar--md d-avatar--presence">
  <div class="d-avatar__canvas">
    <img
      class="d-avatar__image"
      src="/assets/images/person.png"
      alt="Person Avatar"
    />
  </div>
  <div
    class="d-presence d-avatar__presence d-avatar__presence--md"
    role="status"
    aria-live="off"
  >
    <div class="d-presence__inner d-presence__inner--busy"></div>
  </div>
</div>
<div class="d-avatar d-avatar--lg d-avatar--presence">
  <div class="d-avatar__canvas">
    <img
      class="d-avatar__image"
      src="/assets/images/person.png"
      alt="Person Avatar"
    />
  </div>
  <div
    class="d-presence d-avatar__presence d-avatar__presence--lg"
    role="status"
    aria-live="off"
  >
    <div class="d-presence__inner d-presence__inner--offline"></div>
  </div>
</div>
<div class="d-avatar d-avatar--xl d-avatar--presence">
  <div class="d-avatar__canvas">
    <img
      class="d-avatar__image"
      src="/assets/images/person.png"
      alt="Person Avatar"
    />
  </div>
  <div class="d-presence d-avatar__presence" role="status" aria-live="off">
    <div class="d-presence__inner d-presence__inner--active"></div>
  </div>
</div>

<!-- Second set with initials (colors computed from seed via data-attributes) -->
<div class="d-avatar d-avatar--xs d-avatar--presence" data-avatar-family="3" data-avatar-variant="5">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials"></span>
  </div>
  <div class="d-presence d-avatar__presence" role="status" aria-live="off">
    <div class="d-presence__inner d-presence__inner--active"></div>
  </div>
</div>
<div class="d-avatar d-avatar--sm d-avatar--presence" data-avatar-family="7" data-avatar-variant="2">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">W</span>
  </div>
  <div class="d-presence d-avatar__presence" role="status" aria-live="off">
    <div class="d-presence__inner d-presence__inner--away"></div>
  </div>
</div>
<div class="d-avatar d-avatar--md d-avatar--presence" data-avatar-family="10" data-avatar-variant="4">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">FR</span>
  </div>
  <div
    class="d-presence d-avatar__presence d-avatar__presence--md"
    role="status"
    aria-live="off"
  >
    <div class="d-presence__inner d-presence__inner--busy"></div>
  </div>
</div>
<div class="d-avatar d-avatar--lg d-avatar--presence" data-avatar-family="5" data-avatar-variant="7">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">JH</span>
  </div>
  <div
    class="d-presence d-avatar__presence d-avatar__presence--lg"
    role="status"
    aria-live="off"
  >
    <div class="d-presence__inner d-presence__inner--offline"></div>
  </div>
</div>
<div class="d-avatar d-avatar--xl d-avatar--presence" data-avatar-family="12" data-avatar-variant="3">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">AE</span>
  </div>
  <div class="d-presence d-avatar__presence" role="status" aria-live="off">
    <div class="d-presence__inner d-presence__inner--active"></div>
  </div>
</div>
'
vueCode='
<dt-avatar size="xs" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="sm" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="md" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="lg" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="xl" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="xs" presence="active" seed="user-1" full-name="Test Name" />
<dt-avatar size="sm" presence="away" seed="user-2" full-name="William Steele" />
<dt-avatar size="md" presence="busy" seed="user-3" full-name="Frank Richard" />
<dt-avatar size="lg" presence="offline" seed="user-4" full-name="John Hawkins" />
<dt-avatar size="xl" presence="active" seed="user-5" full-name="Alice Edwards" />
'
/>

### Overlay

<code-well-header>
  <dt-stack direction="row" align="center" gap="500">
    <dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user">
      <template #overlayIcon>
        <dt-icon-hear />
      </template>
    </dt-avatar>
    <dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-text="+3" />
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--lg">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/path/to/image" alt="avatar user" />
  </div>
  <div class="d-avatar__overlay">...</div>
</div>
<div class="d-avatar d-avatar--lg">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/path/to/image" alt="avatar user" />
  </div>
  <div class="d-avatar__overlay">
    <p class="d-avatar__overlay-text">+3</p>
  </div>
</div>'
vueCode='
<dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user">
  <template #overlayIcon>
    <dt-icon-hear />
  </template>
</dt-avatar>
<dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-text="+3" />
'
/>

### Clickable

If you need to create a clickable avatar you can set the clickable prop. This will make the avatar a clickable component, set some styling and will be navigable by keyboard. In order for the clickable avatar to be fully accessible, you need to either set `full-name`, `image-alt` or `icon-aria-label` attributes.

<code-well-header>
  <dt-stack direction="row" align="center" gap="500">
    <dt-avatar clickable icon-aria-label="user" ref="example-clickable">
      <template #icon="{ iconSize }">
        <dt-icon-user :size="iconSize" />
      </template>
    </dt-avatar>
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['example-clickable']"
vueCode='
<dt-avatar clickable icon-aria-label="user">
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
'
/>

### Deactivated

Use the `deactivated` prop to render the avatar in a desaturated/washed-out state. This is useful to indicate that a user is deactivated or inactive.

<code-well-header>
  <dt-stack direction="row" align="center" gap="500">
    <dt-avatar deactivated image-src="/assets/images/person.png" image-alt="Deactivated user" ref="example-deactivated-image" />
    <dt-avatar deactivated full-name="Deactivated User" seed="user-deactivated" ref="example-deactivated-initials" />
    <dt-avatar deactivated ref="example-deactivated-icon">
      <template #icon="{ iconSize }">
        <dt-icon-user :size="iconSize" />
      </template>
    </dt-avatar>
  </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--deactivated">
  <div class="d-avatar__canvas">
    <img class="d-avatar__image" src="/assets/images/person.png" alt="Deactivated user" />
  </div>
</div>
<div class="d-avatar d-avatar--deactivated" data-avatar-family="5" data-avatar-variant="3">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">DU</span>
  </div>
</div>
<div class="d-avatar d-avatar--deactivated">
  <div class="d-avatar__canvas">
    <span class="d-avatar__icon">
      <svg>...</svg>
    </span>
  </div>
</div>
'
vueCode='
<dt-avatar deactivated image-src="/assets/images/person.png" image-alt="Deactivated user" />
<dt-avatar deactivated full-name="Deactivated User" seed="user-deactivated" />
<dt-avatar deactivated>
  <template #icon="{ iconSize }">
    <dt-icon-user :size="iconSize" />
  </template>
</dt-avatar>
'
/>

### Seeded

You may use a seed to make the randomly generated color be the same every time for that seed. This is useful if you want users to always have the same color, just pass in their unique user ID as the seed.

<code-well-header>
  <dt-stack direction="row" align="center" gap="500">
    <dt-avatar full-name="Jaqueline Nackos" seed="X5G3D7D3DS3WL7" ref="example-seeded" />
  </dt-stack>
</code-well-header>

<code-example-tabs
:htmlCode="() => $refs['example-seeded']"
vueCode='
<dt-avatar full-name="Jaqueline Nackos" seed="X5G3D7D3DS3WL7" />
'
/>

## Vue API

<component-vue-api component-name="avatar" />

## Classes

<component-class-table component-name="avatar"></component-class-table>

## Accessibility

Initial avatars' background and font color combinations have been paired to ensure minimum contrast is met.

When it comes to voiceover, avatars accompanying a label should generally be considered decorative,
is not focusable, nor is it read out. An example is a user's avatar next to their name.

Avatars unaccompanied by labels, especially those representing functionality or navigation, should be focusable and
read out in voiceover. Please refer
to [WCAG](https://www.w3.org/WAI/tutorials/images/decorative) references for
your specific usage.

<script setup>
import { DtIconUser, DtIconHear } from '@dialpad/dialtone-icons/vue3';

const seeds = ['alice', 'bob', 'carol', 'david', 'eve', 'frank', 'grace', 'henry', 'iris', 'jack', 'kate', 'leo', 'mia', 'noah', 'olive', 'paul', 'quinn', 'ruby'];
const sizes = ['100', '150', '200', '250', '300', '400', '500', '600', '700', '800', '900'];
</script>
