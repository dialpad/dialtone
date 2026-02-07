# Breadcrumbs

Breadcrumbs are links used to provide context for the currently-viewed page and where it is located within the overall site structure.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-breadcrumbs--default
- **Keywords**: navigation, path, d-breadcrumbs, DtBreadcrumbs, dt-breadcrumbs, trail, path navigation

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

```vue
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
```

### Inverted

```vue
<dt-breadcrumbs
  inverted
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
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `breadcrumbs` | A provided list of breadcrumbs. Overridden by default slot | `array` | `[]` |
| `inverted` | Passed through to link. If true, applies inverted styles to the link. | `boolean` | `false` |
| `ariaLabel` | Descriptive label for the navigation content. | `string` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `default` | default slot for breadcrumbs content |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-breadcrumbs` | N/A | Parent wrapper class for all breadcrumb items. |
| `d-breadcrumbs__item` | N/A | Wrapper for each breadcrumb li element. Adds a decorative separator using the :before pseudo element in CSS. |
| `d-breadcrumbs__item--selected` | .d-breadcrumbs__item | Changes the default styling to a selected state. Used to denote the current location. |
| `d-breadcrumbs--inverted` | .d-breadcrumbs | Inverts all child styles to work on dark backgrounds. |

## Accessibility

HTML doesn't provide dedicated semantic elements for breadcrumbs, so we need to add a few ARIA attributes to make them accessible.

| Item | Applies to | Description |
| --- | --- | --- |
| `nav` | .d-breadcrumbs | Use this landmark element to guide screen readers to this navigational unit. |
| `aria-label="breadcrumb"` | .d-breadcrumbs | Applied to the nav landmark element, this provides a description of the navigation unit. (Source) |
| `ol` | Child of .d-breadcrumbs | This child element of .d-breadcrumbs communicates that breadcrumbs are a structured, navigational hierarchy to screen readers. |
| `aria-current="location"` | .d-breadcrumbs__link | Used to denote the current page. (Source) |
