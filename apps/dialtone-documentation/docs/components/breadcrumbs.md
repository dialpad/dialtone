---
title: Breadcrumbs
description: Breadcrumbs are links used to provide context for the currently-viewed page and where it is located within the overall site structure.
status: ready
thumb: true
image: assets/images/components/breadcrumbs.png
storybook: https://dialtone.dialpad.com/vue/?path=/story/components-breadcrumbs--default
figma_url: https://www.figma.com/design/W58r5BkO8qTw3vem9YieJd/DT9-Component-Library--Rebrand-2025-?node-id=2455-0
keywords: ["navigation", "path", "d-breadcrumbs", "DtBreadcrumbs", "dt-breadcrumbs", "trail", "path navigation"]
---

<code-well-header>
  <div class="d-w100p">
    <nav class="d-breadcrumbs" aria-label="breadcrumb">
      <ol>
        <li class="d-breadcrumbs__item">
          <a href="#" class="d-link d-link--muted">Root</a>
        </li>
        <li class="d-breadcrumbs__item">
          <a href="#" class="d-link d-link--muted">Section</a>
        </li>
        <li class="d-breadcrumbs__item">
          <a href="#" class="d-link d-link--muted">Section</a>
        </li>
        <li class="d-breadcrumbs__item">
          <a href="#" class="d-link d-link--muted">Section</a>
        </li>
        <li class="d-breadcrumbs__item d-breadcrumbs__item--selected">
          <a href="#" class="d-link d-link--muted" aria-current="location">Current Page</a>
        </li>
      </ol>
    </nav>
  </div>
</code-well-header>

<!-- <component-combinator component-name="DtBreadcrumbs" /> -->

## Usage

Breadcrumbs show users where they are within a site’s hierarchy. Breadcrumbs help orient the user and allow for navigation to previous page levels. It can be appropriate to use a breadcrumb when:

- The user is many levels of navigation deep
- The current page does not have its own navigation
- The user needs to quickly go back to the previous parent page

Breadcrumbs should be the first page element—placed directly above the page’s title. All pages that appear in the breadcrumb should link to their respective page. The page the user is on should always be the last page listed and not linked.

### When Not to Use

Breadcrumbs are always treated as secondary and should not entirely replace the primary navigation. They shouldn’t be used for products that have single level navigation because they create unnecessary clutter.

## Variants and Examples

### Default

<code-well-header>
    <nav class="d-breadcrumbs" aria-label="breadcrumb">
        <ol>
            <li class="d-breadcrumbs__item">
                <a href="#" class="d-link d-link--muted">Root</a>
            </li>
            <li class="d-breadcrumbs__item">
                <a href="#" class="d-link d-link--muted">Section</a>
            </li>
            <li class="d-breadcrumbs__item">
                <a href="#" class="d-link d-link--muted">Section</a>
            </li>
            <li class="d-breadcrumbs__item">
                <a href="#" class="d-link d-link--muted">Section</a>
            </li>
            <li class="d-breadcrumbs__item d-breadcrumbs__item--selected">
                <a href="#" class="d-link d-link--muted" aria-current="location">Current Page</a>
            </li>
        </ol>
    </nav>
</code-well-header>

<code-example-tabs
htmlCode='
<nav class="d-breadcrumbs" aria-label="breadcrumb">
  <ol>
    <li class="d-breadcrumbs__item">
      <a href="#" class="d-link d-link--muted">Root</a>
    </li>
    <li class="d-breadcrumbs__item">
      <a href="#" class="d-link d-link--muted">Section</a>
    </li>
    <li class="d-breadcrumbs__item">
      <a href="#" class="d-link d-link--muted">Section</a>
    </li>
    <li class="d-breadcrumbs__item">
      <a href="#" class="d-link d-link--muted">Section</a>
    </li>
    <li class="d-breadcrumbs__item d-breadcrumbs__item--selected">
      <a href="#" class="d-link d-link--muted" aria-current="location">Current Page</a>
    </li>
  </ol>
</nav>
'
vueCode='
<dt-breadcrumbs
  :breadcrumbs="[
    {
      href: `#`,
      label: `Root`,
    },
    {
      href: `#`,
      label: `Section`,
    },
    {
      href: `#`,
      label: `Section`,
    },
    {
      href: `#`,
      label: `Section`,
    },
    {
      href: `#`,
      label: `Current Page`,
      selected: true,
    },
  ]" />
'
showHtmlWarning />

### Inverted

<dt-notice title="Deprecated" kind="error" class="d-wmx100p d-my16">
  The <code>inverted</code> prop has been deprecated in favor of using <router-link to="mode-island.html"><DtLink>DtModeIsland</DtLink></router-link> as a wrapper.
</dt-notice>

In place of the <code>inverted</code> prop, use the <router-link to="mode-island.html"><DtLink>DtModeIsland</DtLink></router-link> component as a wrapper.

<code-well-header>
  <dt-mode-island class="d-p16 d-bar8">
    <dt-breadcrumbs
      ref="invertedBreadcrumbsExample"
      :breadcrumbs="[
        { href: '#', label: 'Root' },
        { href: '#', label: 'Section' },
        { href: '#', label: 'Current Page', selected: true },
      ]"
    />
  </dt-mode-island>
</code-well-header>

<code-example-tabs
:htmlCode='() => $refs.invertedBreadcrumbsExample'
vueCode='
<dt-mode-island>
  <dt-breadcrumbs :breadcrumbs="breadcrumbs" />
</dt-mode-island>
'
showHtmlWarning />

## Vue API

<component-vue-api component-name="breadcrumbs" />

## Classes

<component-class-table component-name="breadcrumbs"></component-class-table>

## Accessibility

HTML doesn't provide dedicated semantic elements for breadcrumbs, so we need to add a few ARIA attributes to make them accessible.

<component-accessible-table component-name="breadcrumbs"></component-accessible-table>
