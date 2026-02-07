# Card

A card contains summary content and actions about a single subject. It can be used by itself or within a list, and is generally interactive.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-card--default
- **Keywords**: panel, container, box, d-card, DtCard, dt-card, tile, surface

## Usage

Cards are surfaces that display content and actions on a single topic.
They should be easy to scan for relevant and actionable information. Elements, like text and images, should be placed on them in a way that clearly indicates hierarchy.

**Do:**

- To display content and actions on a single topic.

**Don't:**

- Add too many call-to-action elements to the same card. A card should only contain a single primary action.
- Inform users about important changes.

### Best Practices

- It should only contain a single idea that may feature a call-to-action, or the option to navigate to more detailed content.
- The content of a card should be concise and offer only a preview of detailed content.
- The headings should set clear expectations about the card’s purpose.

## Variants and Examples

### Base

```vue
<dt-card class="d-w264">
  <template #header>
    (header slot)
  </template>
  <template #content>
    (content slot)
  </template>
  <template #footer>
    (footer slot)
  </template>
</dt-card>
```

### With Header

```vue
<dt-card class="d-w264">
  <template #header>
    <dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>
    <dt-button
      size="xs"
      importance="clear"
      aria-label="Menu button"
    >
      <template #icon>
        <dt-icon
          name="more-vertical"
          size="100"
        />
      </template>
    </dt-button>
  </template>
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
</dt-card>
```

### With Footer

```vue
<dt-card class="d-w264">
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
  <template #footer>
    <dt-button
      importance="outlined"
      size="sm"
    >
      Button
    </dt-button>
  </template>
</dt-card>
```

### Content Only

```vue
<dt-card class="d-w264">
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
</dt-card>
```

### With Header, Footer and Scrollable Content

```vue
<dt-card max-height="50px" class="d-w264">
  <template #header>
    <dt-text as="p" kind="headline" size="md">Lorem ipsum</dt-text>
    <dt-button
      size="xs"
      importance="clear"
      aria-label="Menu button"
    >
      <template #icon>
        <dt-icon
          name="more-vertical"
          size="100"
        />
      </template>
    </dt-button>
  </template>
  <template #content>
    Content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
  </template>
  <template #footer>
    <dt-button
      importance="outlined"
      size="sm"
    >
      Button
    </dt-button>
  </template>
</dt-card>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `maxHeight` | The maximum height of the card content. If given, makes content area scrollable. | `string` | `null` |
| `containerClass` | class for card container. | `string\|array\|object` | `''` |
| `contentClass` | class for card content. | `string\|array\|object` | `''` |
| `headerClass` | class for card header. | `string\|array\|object` | `''` |
| `footerClass` | class for card footer. | `string\|array\|object` | `''` |

### Slots

| Name | Description |
| --- | --- |
| `header` | slot for header content |
| `content` | slot for main content |
| `footer` | slot for footer content |

## Classes

At minimum, card contains body of content. It could also have header with buttons, and footer with buttons/text.

| Class | Applies to | Description |
| --- | --- | --- |
| `d-card` | N/A | Container for the card and its elements. |
| `d-card__header` | Child of .d-card | Contains the header content. |
| `d-card__content` | Child of .d-card | Contains the main body content of the card. |
| `d-card__footer` | Child of .d-card | Contains the footer content. |
