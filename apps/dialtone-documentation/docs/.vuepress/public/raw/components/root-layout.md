# Root layout

A root layout provides a standardized group of containers to display content at the root level.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-root-layout--default
- **Keywords**: app layout,page layout,d-root-layout,DtRootLayout,dt-root-layout

## Base Style

A root layout consists of a header, body, sidebar and footer. Content can optionally be passed into the slots which
will be displayed in the respective area. The sidebar is designed to be responsive and will reposition above the
body according to the `responsiveBreakpoint` prop.

```vue
<dt-root-layout
  :fixed="false"
  class="d-w100p d-h332"
>
  <template
    #header
  >
    <div class="d-h64 d-bgc-purple-100">Header</div>
  </template>
  <template
    #sidebar
  >
    <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
  </template>
  <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
  <template
    #footer
  >
    <div class="d-h64 d-bgc-gold-100">Footer</div>
  </template>
</dt-root-layout>
```

## Variants and Examples

### Header Sticky

<div
  class="d-h332 d-of-scroll"
>
    header-sticky
    class="d-w100p d-h332"
  >
      #header
    >
      <div class="d-h64 d-bgc-purple-100">Header</div>
      #sidebar
    >
      <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
      <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
      #footer
    >
      <div class="d-h64 d-bgc-gold-100">Footer</div>
</div>

```vue
<div
  class="d-h332 d-of-scroll"
>
  <dt-root-layout
    header-sticky
    class="d-w100p d-h332"
  >
    <template
      #header
    >
      <div class="d-h64 d-bgc-purple-100">Header</div>
    </template>
    <template
      #sidebar
    >
      <div class="d-w128 d-h100p d-bgc-black-100"><div>Sidebar item 1</div><div>Sidebar item 2</div><div>Sidebar item 3</div></div>
    </template>
      <div class="d-bgc-green-100 d-w100p d-h100p">Content</div>
    <template
      #footer
    >
      <div class="d-h64 d-bgc-gold-100">Footer</div>
    </template>
  </dt-root-layout>
</div>
```

## Usage

Root Layout should be used as the top level component for a route. All other components on the page should be nested
within one of the root layout's slots. The root layout should not be nested within any other elements or components.

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `fixed` | When true, the header, footer and sidebar will be locked in position and the content will be scrollable. When false the header, footer and sidebar will scroll out of view. | `boolean` | `true` |
| `headerClass` | Additional class name for the header element | `string\|array\|object` | `''` |
| `headerHeight` | DEPRECATED: set the height of the inner element instead. | `string` | `'64px'` |
| `headerSticky` | Scroll the header with the page | `boolean` | `false` |
| `bodyClass` | Additional class name for the body | `string\|array\|object` | `''` |
| `contentClass` | Additional class name for the content element | `string\|array\|object` | `''` |
| `sidebarClass` | Additional class name for the sidebar element | `string\|array\|object` | `''` |
| `sidebarWidth` | DEPRECATED: set the width of the inner element instead. | `string` | `'256px'` |
| `sidebarPosition` | Whether the sidebar is on the left or right side Possible options: 'left', 'right' | `string` | `'left'` |
| `footerClass` | Additional class name for the footer element | `string\|array\|object` | `''` |
| `footerHeight` | DEPRECATED: set the height of the inner element instead. | `string` | `'64px'` |
| `responsiveBreakpoint` | Defines the breakpoint when the root layout will change to responsive version | `string` | `null` |

### Slots

| Name | Description |
| --- | --- |
| `header` | Slot for header content, be sure to set a height on the element inside this |
| `sidebar` | Slot for sidebar content, be sure to set a width on the element within this. |
| `default` | Slot for the main content |
| `footer` | Slot for footer content, be sure to set a height on the element inside this |

## Accessibility

The RootLayout component uses
[Content Sectioning](https://developer.mozilla.org/en-US/docs/Web/HTML/Element#content_sectioning)
elements `<header>`, `<aside>`, `<main>`, and `<footer>` which automatically define
[ARIA Landmark Roles](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#landmark_roles)
on the page.

If you have navigation links contained within any of the slots Root Layout provides these should be enclosed in a `<nav>`
[Nav Section](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav).
The RootLayout component will not do this for you.

The sidebar will not automatically wrap to be above the main content by default.
This can be changed via the `responsiveBreakpoint` prop if desired.
