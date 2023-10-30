---
title: Avatar
description: An avatar is a visual representation of a user or object.
status: new
thumb: true
image: assets/images/components/avatar.png
storybook: https://vue.dialpad.design/?path=/story/components-avatar--default
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
                <dt-avatar image-src="/assets/images/person.png" image-alt="person avatar" group="3" />
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

```html
<div class="d-avatar d-avatar--{$size}">
    <div class="d-avatar__canvas">
        <span class="d-avatar__icon">
            <svg>...</svg>
        </span>
    </div>
</div>
```

### Initials

<code-well-header>
    <dt-stack direction="row" gap="500" class="d-wmx50p d-fw-wrap">
      <dt-avatar v-for="color in colors" :color="color" full-name="DP" />
    </dt-stack>
</code-well-header>

```html
<div class="d-avatar d-avatar--{$size} d-avatar--{$color}">
    <div class="d-avatar__canvas">
        <span class="d-avatar__initials">DP</span>
    </div>
</div>
```

### Image

<code-well-header>
  <dt-avatar image-src="/assets/images/person.png" image-alt="avatar user" />
</code-well-header>

```html
<div class="d-avatar d-avatar--{$size}">
    <div class="d-avatar__canvas">
        <img class="d-avatar__image" src="/path/to/image" />
    </div>
</div>
```

### Sizes

<code-well-header>
    <div class="d-d-inline-flex d-ai-center d-flow8">
        <dt-avatar v-for="size in sizes" :size="size" icon-name="user" />
    </div>
</code-well-header>

```html
    <div class="d-avatar d-avatar--xs">
        ...
    </div>
    <div class="d-avatar d-avatar--sm">
        ...
    </div>
    <div class="d-avatar d-avatar--md">
        ...
    </div>
    <div class="d-avatar d-avatar--lg">
        ...
    </div>
    <div class="d-avatar d-avatar--xl">
        ...
    </div>
```

### Group

<code-well-header>
    <div class="d-d-inline-flex d-ai-center d-flow8">
        <dt-avatar group="11" image-src="/assets/images/person.png" image-alt="Person Avatar" />
        <dt-avatar group="3" image-src="/assets/images/person.png" image-alt="Person Avatar" />
    </div>
</code-well-header>

```html
<div class="d-avatar d-avatar--group">
    <div class="d-avatar__canvas">
        <img class="d-avatar__image" src="/assets/images/person.png" alt=""/>
    </div>
    <span class="d-avatar__count"><span class="d-avatar__count-number">12</span></span>
</div>
<div class="d-avatar d-avatar--group">
    <div class="d-avatar__canvas">
        <img class="d-avatar__image" src="/assets/images/person.png" alt=""/>
    </div>
    <span class="d-avatar__count"><span class="d-avatar__count-number">1</span></span>
</div>
```

### Presence

Positions the [Presence](/components/presence.html) component at each size.

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

```html
<div class="d-avatar d-avatar--{$size)">
    <div class="d-avatar__canvas">
        ...
    </div>
    <div class="d-avatar__presence">
        <div class="d-presence">
            <div class="d-presence__inner d-presence__inner--{$status}"></div>
        </div>
    </div>
</div>
```

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
