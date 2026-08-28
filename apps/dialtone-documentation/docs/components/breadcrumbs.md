---
title: Breadcrumbs
description: Navigation trail that shows the current page location.
status: ready
thumb: true
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-breadcrumbs--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2455-0
keywords: ["navigation", "path", "d-breadcrumbs", "DtBreadcrumbs", "dt-breadcrumbs", "trail", "path navigation"]
combinator: DtBreadcrumbs
---

## Usage

Breadcrumbs show users where they are within a site's hierarchy. Breadcrumbs help orient the user and allow for navigation to previous page levels. It can be appropriate to use a breadcrumb when:

- The user is many levels of navigation deep
- The current page does not have its own navigation
- The user needs to quickly go back to the previous parent page

Breadcrumbs should be the first page element—placed directly above the page's title. All pages that appear in the breadcrumb should link to their respective page. The page the user is on should always be the last page listed and not linked.

### When Not to Use

Breadcrumbs are always treated as secondary and should not entirely replace the primary navigation. They shouldn't be used for products that have single level navigation because they create unnecessary clutter.

## Variants and Examples

### Default

```vue demo
<dt-breadcrumbs
  :breadcrumbs="[
    { href: '#', label: 'Root' },
    { href: '#', label: 'Section' },
    { href: '#', label: 'Section' },
    { href: '#', label: 'Section' },
    { href: '#', label: 'Current Page', selected: true },
  ]"
/>
```

### Inverted

> [!WARNING] Deprecated
> The `inverted` prop has been deprecated. Use the [v-dt-mode directive](mode-island.html#inverting) instead.

In place of the `inverted` prop, use the [v-dt-mode directive](mode-island.html#inverting) on the component element.

```vue demo
<div class="d-bgc-contrast">
  <dt-breadcrumbs
    v-dt-mode:invert
    class="d-p-200 d-bar-400"
    :breadcrumbs="[
      { href: '#', label: 'Root' },
      { href: '#', label: 'Section' },
      { href: '#', label: 'Current Page', selected: true },
    ]"
  />
</div>
```

## Accessibility

HTML doesn't provide dedicated semantic elements for breadcrumbs, so we need to add a few ARIA attributes to make them accessible.

<component-accessible-table component-name="breadcrumbs"></component-accessible-table>

## Vue API

<component-vue-api component-name="breadcrumbs" />

## Classes

<component-class-table component-name="breadcrumbs"></component-class-table>
