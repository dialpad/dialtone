# Link

A link is a navigational element that can be found on its own, within other text, or directly following content.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-link--default
- **Keywords**: anchor, hyperlink, url, d-link, DtLink, dt-link, text link, href

## Usage

`button` and link (`<a>`) HTML elements each describe a specific intent. Understanding the distinction is important: if it goes somewhere, use a Link. If an action occurs, use a [Button](button.md).

**Do:**

- Use for navigating between destinations.

**Don't:**

- Use for actions, instead use a [Button](button.md).

### Best Practices

- Use useful, actionable, and descriptive text clearly conveying the hyperlink’s destination. For example, a generic label like "click here" doesn’t convey its target content.
- Too many links can be overwhelming. Be selective about the number of links in a context.
- Clearly identify links that target an external source.

## Accessibility

- Allow keyboard navigation. Users must be able to navigate between links, i.e. keypress of tab, and activate it by pressing ‘Enter’.
- Users must be able to identify links without relying on color alone.
- Users must be able to activate hover and focus states with both a mouse and a keyboard.

## Variants and Examples

### Default

```vue
<dt-link :href="#link">Link</dt-link>
<dt-link :href="#link" kind="danger">Danger link</dt-link>
<dt-link :href="#link" kind="muted">Muted link</dt-link>
<dt-link :href="#link" kind="success">Success link</dt-link>
<dt-link :href="#link" kind="warning">Warning link</dt-link>
<dt-link :href="#link" kind="mention">Mention link</dt-link>
```

### Inverted

```vue
<dt-link :href="#link" inverted>Inverted link</dt-link>
<dt-link :href="#link" kind="danger" inverted>Inverted danger link</dt-link>
<dt-link :href="#link" kind="success" inverted>Inverted success link</dt-link>
<dt-link :href="#link" kind="warning" inverted>Inverted warning link</dt-link>
<dt-link :href="#link" kind="muted" inverted>Inverted muted link</dt-link>
<dt-link :href="#link" kind="mention" inverted>Inverted mention link</dt-link>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `kind` | Applies the link variant styles | `string` | `''` |
| `inverted` | Determines whether the link should have inverted styling default is false. | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Slot for main content |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-link` | N/A | Base link style. |
| `d-link--danger` | .d-link | Danger link style. Used for potentially destructive actions. |
| `d-link--inverted` | .d-link | Base inverted link style |
| `d-link--muted` | .d-link | A darker, muted link style that mirrors our muted button style. |
| `d-link--success` | .d-link | Success link style. Used to alert users to successful actions. |
| `d-link--warning` | .d-link | Warning link style. Used to alert users to potential problems. |
| `d-link--disabled` | .d-link | Disabled link style. |
| `d-link--mention` | .d-link | Mention link style. Used for links that refer to a user or channel. |
