---
title: Avatar
description: An avatar is a visual representation of a user or object.
status: ready
thumb: true
image: assets/images/components/avatar.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-avatar--default
figma_url: https://www.figma.com/file/2adf7JhZOncRyjYiy2joil/DT-Core%3A-Components-7?node-id=8918%3A21289&viewport=137%2C605%2C0.46&t=xHutRjwo1o5zMTgT-11
---

<code-well-header>
    <div class="d-d-flex d-ai-center d-flow16">
        <dt-avatar size="lg" icon-name="user" icon-size="500" />
        <dt-avatar size="lg" full-name="dp" color="1000" presence="busy" />
        <dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" presence="active" />
    </div>
</code-well-header>

<!-- <component-combinator component-name="DtAvatar" /> -->

## Usage

The Avatar component is designed to prioritize different sources for content display. It will sequentially check for the availability of an image source (`image-src`) or an icon name (`icon-name`). If both properties are not provided, the avatar will extract and display initials from the full name (`full-name`). The resulting initials are extracted using the following logic:

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
                <dt-avatar icon-name="user" icon-size="400" />
            </td>
            <th class="d-ta-left"><a class="d-link" href="#icon">Icon</a></th>
            <td>When no username can be associated with the Avatar.</td>
        </tr>
        <tr>
            <td>
                <dt-avatar full-name="DP" color="1600" />
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

## Variants and examples

### Icon

<code-well-header>
    <dt-avatar icon-name="user" icon-size="300" />
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
<dt-avatar
  icon-name="person"
/>
'
/>

### Initials

<code-well-header>
    <dt-stack direction="row" gap="500" class="d-wmx50p d-fw-wrap">
      <dt-avatar v-for="color in colors" :color="color" full-name="DP" />
    </dt-stack>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--{$size} d-avatar--{$color}">
  <div class="d-avatar__canvas">
    <span class="d-avatar__initials">DP</span>
  </div>
</div>
'
vueCode='
<!-- colors 100 to 1800 are valid -->
<dt-avatar
  full-name="DP"
  color="100"
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

<code-well-header>
    <div class="d-d-inline-flex d-ai-center d-flow8">
        <dt-avatar v-for="size in sizes" :size="size" icon-name="user" />
    </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--xs">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--sm">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--md">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--lg">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
<div class="d-avatar d-avatar--xl">
  <div class="d-avatar__canvas">
    <svg>...</svg>
  </div>
</div>
'
vueCode='
<dt-avatar size="xs" icon-name="user" />
<dt-avatar size="sm" icon-name="user" />
<dt-avatar size="md" icon-name="user" />
<dt-avatar size="lg" icon-name="user" />
<dt-avatar size="xl" icon-name="user" />
'
/>

### Group

<code-well-header>
    <div class="d-d-inline-flex d-ai-center d-flow8">
        <dt-avatar :group="11" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar :group="3" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--group">
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
<dt-avatar :group="11" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar :group="3" image-src="/assets/images/person.png" image-alt="Person Avatar" />
'
/>

### Presence

Positions the [Presence](components/presence.html) component at each size.

<code-well-header>
    <div class="d-d-inline-flex d-ai-center d-flow8">
        <dt-avatar size="xs" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar size="sm" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar size="md" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar size="lg" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar size="xl" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </div>
    <div class="d-d-inline-flex d-ai-center d-flow8">
        <dt-avatar size="xs" presence="active" color="1200" />
        <dt-avatar size="sm" presence="away" color="500" full-name="W" />
        <dt-avatar size="md" presence="busy" color="800" full-name="FR" />
        <dt-avatar size="lg" presence="offline" color="1200" full-name="JH" />
        <dt-avatar size="xl" color="1500" full-name="AE" />
    </div>
</code-well-header>

<code-example-tabs
htmlCode='
<div class="d-avatar d-avatar--{$size)">
  <div class="d-avatar__canvas">
    ...
  </div>
  <div class="d-avatar__presence">
    <div class="d-presence d-avatar__presence d-avatar__presence--md"><!---->
      <div class="d-presence__inner d-presence__inner--{$status}" />
    </div>
  </div>
</div>
'
vueCode='
<dt-avatar size="xs" presence="active" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="sm" presence="away" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="md" presence="busy" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="lg" presence="offline" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="xl" image-src="/assets/images/person.png" image-alt="Person Avatar" />
<dt-avatar size="xs" presence="active" color="1200" />
<dt-avatar size="sm" presence="away" color="500" full-name="W" />
<dt-avatar size="md" presence="busy" color="800" full-name="FR" />
<dt-avatar size="lg" presence="offline" color="1200" full-name="JH" />
<dt-avatar size="xl" color="1500" full-name="AE" />
'
/>

### Overlay

<code-well-header>
  <div class="d-d-flex d-ai-center d-flow16">
    <dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-icon="hear" />
    <dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-text="+3" />
  </div>
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
<dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-icon="hear" />
<dt-avatar size="lg" image-src="/assets/images/person.png" image-alt="avatar user" overlay-text="+3" />
'
/>

### Clickable

If you need to create a clickable avatar you can set the clickable prop. This will make the avatar a clickable component, set some styling and will be navigable by keyboard. In order for the clickable avatar to be fully accessible, you need to either set `full-name`, `image-alt` or `icon-aria-label` attributes.

<code-well-header>
  <div class="d-d-flex d-ai-center d-flow16">
    <dt-avatar icon-name="user" clickable icon-aria-label="user" ref="example-clickable" />
  </div>
</code-well-header>

<code-example-tabs
:getComponentRef="() => $refs['example-clickable']"
vueCode='
<dt-avatar icon-name="user" clickable icon-aria-label="user" />
'
/>

### Seeded

You may use a seed to make the randomly generated color be the same every time for that seed. This is useful if you want users to always have the same color, just pass in their unique user ID as the seed.

<code-well-header>
  <div class="d-d-flex d-ai-center d-flow16">
    <dt-avatar full-name="Jaqueline Nackos" seed="X5G3D7D3DS3WL7" ref="example-seeded" />
  </div>
</code-well-header>

<code-example-tabs
:getComponentRef="() => $refs['example-seeded']"
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
const colors = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400', '1500', '1600', '1700', '1800'];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
</script>
