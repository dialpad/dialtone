# Mode Island

Create independent sections with their own color modes.

- **Status**: beta
- **Keywords**: theme island,mode override,d-mode-island,DtModeIsland,dt-mode-island

## Usage

Mode islands create isolated regions that may display in a different color mode, `light`, `dark`, or `inverted`. Useful for forcing a region to a controlled mode for a unique UI purpose.

### Structure

```vue
<dt-mode-island>
  Inverted
</dt-mode-island>
<dt-mode-island mode="light">
  Light
</dt-mode-island>
<dt-mode-island mode="dark">
  Dark
</dt-mode-island>
```

### Guidance

**Do:**

- Use sparingly for specific needs, not general theming
- Use only to force a region to a controlled theme for a unique purpose
- Always test in both light and dark root themes
- Ensure content remains readable when mode changes

**Don't:**

- Do not overuse mode islands, respect user theme preference
- Do not use purely for decoration. Ensure Mode Island use serves a functional and unique purpose
- Avoid nesting deeply. Keep hierarchy shallow for maintainability

### Reactive Mode Updates

Inverted islands reactively track parent/root mode changes. User switches light ↔ dark → inverted islands flip automatically. Even directly modifying the `mode` attribute will also work.

### Brand Theme Protection

`data-dt-brand` (aka "Theme", e.g. "tmo", "sunflower", etc) can not be set on Mode Islands. Brand theme can only be set at root level and are inherited

### Contrast Inheritance

Contrast is not an option to set to a Mode Island. Contrast theme setting is inherited from the root element, i.e. `<html>`.

## Variants

### Inverted

The default mode, inverts the container relative to the parent or root's mode. When `mode` attribute is omitted, it defaults to `inverted`.

```vue
<dt-mode-island class="d-p16 d-bar8">
  <dt-text as="p">Inverted mode (opposite of parent)</dt-text>
</dt-mode-island>
```

### Light

Explicitly set to light mode regardless of parent or root mode.

```vue
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <dt-text as="p">Always light mode</dt-text>
</dt-mode-island>
```

### Dark

Explicitly set to dark mode regardless of parent or root mode.

```vue
<dt-mode-island mode="dark" class="d-p16 d-bar8">
  <dt-text as="p">Always dark mode</dt-text>
</dt-mode-island>
```

## Custom element

Polymorphic rendering via `as` prop—controls which HTML element wraps content. Ensures proper document structure and semantic markup. Example values: `section` for thematic grouping, `article` for self-contained content. Defaults to `div` where semantics aren't a concern.

```vue
<dt-mode-island as="section" mode="dark" class="d-p16 d-bar8">
  <dt-text as="p">Rendered as section element</dt-text>
</dt-mode-island>
```

**Common values:** `div` (default), `section`, `article`, `nav`, `aside`, `header`, `footer`, `main`

## Nesting

Mode islands may be nested, though should rarely occur.

```vue
<dt-mode-island mode="light" class="d-p16 d-bar8">
  <dt-text as="p">Light island</dt-text>
  <dt-mode-island class="d-p16 d-bar8">
    <dt-text as="p">Inverted → Dark island</dt-text>
    <dt-mode-island class="d-p16 d-bar4">
      <dt-text as="p">Inverted again → Light island</dt-text>
    </dt-mode-island>
  </dt-mode-island>
</dt-mode-island>
```

## Examples

### Callbar

```vue
<dt-mode-island class="d-ba d-bc-subtle d-p8 d-py4 d-bar32 d-bs-md d-w100p">
  <dt-stack direction="row" gap="600">
    <dt-stack gap="400" direction="row">
      <dt-avatar full-name="TA" color="700" size="lg" />
      <dt-stack gap="200">
        <dt-text kind="label" size="md" density="200">Ted Anderson</dt-text>
        <dt-stack direction="row" gap="300" align="baseline">
          <dt-text kind="helper" size="sm" tone="tertiary" wrap="nowrap" numeric>(913) 555-6745</dt-text>
          <dt-text kind="helper" size="sm" tone="muted">&bull;</dt-text>
          <dt-text kind="helper" size="sm" tone="tertiary" numeric>21:18</dt-text>
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
```

### Positioned Components

[Popovers](./popover.md), [Dropdowns](./dropdown.md), and [Hovercards](./hovercard.md) are typically rendered at the root element of the DOM tree, and thus inherit the page's mode by default. They can be forced to a specific mode by assigning a Mode Island to its content slot.

```vue
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
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `as` | Set this prop to render the mode island as a specific HTML element. | `String` | `'div'` |
| `mode` | The mode to apply to the island. - 'inverted': Opposite of parent or root mode - 'light': Always light mode - 'dark': Always dark mode | `String` | `DT_MODE_ISLAND_TYPES.INVERTED` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Slot for main content |

## Accessibility

Purely visual. No semantic HTML impact. Supports high contrast mode via auto contrast inheritance.
