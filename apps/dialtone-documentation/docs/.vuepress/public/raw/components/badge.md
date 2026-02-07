# Badge

A badge is a compact UI element providing brief, descriptive information about an element and its surrounding context. It is terse, ideally one word.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-badge--default
- **Keywords**: label,tag,indicator,count,d-badge,DtBadge,dt-badge

## Usage

**Do:**

- To flag and draw awareness to a specific element or feature of focus. For example, something is unique about that separates it from other like content.
- As a notification system with minimal footprint.

**Don't:**

- To indicate that interaction by the user is required.

### Best Practices

- While the color variant used should not be the sole indicator of information, choose color patterns that users can quickly scan and identify its intention.
- Avoid long values, favoring a brief scannable word.

## Accessibility

- Since a Badge may often reflect a value within an implied label, ensure a label is announced. For example, via `aria-label` or `aria-labeledby`.

## Kind

### Label

```vue
<dt-badge text="Label" />
```

### Count

```vue
<dt-badge kind="count" text="1" />
```

## Type

| Type | Kind: Label | Kind: Count | Usage |
| --- | --- | --- | --- |
| Default |  |  | Default general purpose callout when no implicit semantic meaning applies. |
| Info |  |  | Used to convey general information that isn’t critical or requires action on the user's part. |
| Success |  |  | Accompanying a successful or otherwise positive action or message |
| Warning |  |  | When a users attention is needed, or action may be required. |
| Critical |  |  | To communicate conditions deemed critical, negative, or dangerous. For example, sensitive state (e.g. recording), must be resolved, or something has failed. |
| Bulletin |  |  | Used to provide temporary feedback to specific items in the interface, like live activity, notifications, and unread counts. |
| Ai |  | N/A | To call out Dialpad Ai features. |

```vue
<dt-badge kind="label" text="Label" />
<dt-badge type="info" kind="label" text="Label" />
<dt-badge type="success" kind="label" text="Label" />
<dt-badge type="warning" kind="label" text="Label" />
<dt-badge type="critical" kind="label" text="Label" />
<dt-badge type="bulletin" kind="label" text="Label" />
<dt-badge type="ai" text="Label" kind="label" />
<dt-badge type="default" text="1" kind="count" />
<dt-badge type="info" text="2" kind="count" />
<dt-badge type="success" text="3" kind="count" />
<dt-badge type="warning" text="4" kind="count" />
<dt-badge type="critical" text="5" kind="count" />
<dt-badge type="bulletin" text="6" kind="count" />
```

## Outlined

```vue
<dt-badge text="Label" outlined />
<dt-badge text="Label" type="info" outlined />
<dt-badge text="Label" type="success" outlined />
<dt-badge text="Label" type="warning" outlined />
<dt-badge text="Label" type="critical" outlined />
<dt-badge text="1" kind="count" outlined />
<dt-badge text="1" type="info" kind="count" outlined />
<dt-badge text="1" type="success" kind="count" outlined />
<dt-badge text="1" type="warning" kind="count" outlined />
<dt-badge text="1" type="critical" kind="count" outlined />
```

## Subtle

At the moment, only the `bulletin` type has a subtle variant.

```vue
<dt-badge text="Label" type="bulletin" subtle />
<dt-badge text="Label" type="bulletin" subtle outlined />
<dt-badge text="1" type="bulletin" subtle kind="count" />
<dt-badge text="1" type="bulletin" subtle kind="count" outlined />
```

## Icon

```vue
<dt-badge type="default" text="Label" kind="label">
  <template #leftIcon="{ iconSize }">
    <dt-icon-lightning-bolt :size="iconSize" />
  </template>
</dt-badge>
<dt-badge type="default" text="Label" kind="label">
  <template #rightIcon="{ iconSize }">
    <dt-icon-lightning-bolt :size="iconSize" />
  </template>
</dt-badge>
```

## Decorative

Decorative badges label and classify items for quick recognition.

```vue
<dt-badge text="Label" decoration="black-400" />
<dt-badge text="Label" decoration="black-500" />
<dt-badge text="Label" decoration="black-900" />
<dt-badge text="Label" decoration="red-200" />
<dt-badge text="Label" decoration="red-300" />
<dt-badge text="Label" decoration="red-400" />
<dt-badge text="Label" decoration="purple-200" />
<dt-badge text="Label" decoration="purple-300" />
<dt-badge text="Label" decoration="purple-400" />
<dt-badge text="Label" decoration="purple-500" />
<dt-badge text="Label" decoration="blue-200" />
<dt-badge text="Label" decoration="blue-300" />
<dt-badge text="Label" decoration="blue-400" />
<dt-badge text="Label" decoration="green-300" />
<dt-badge text="Label" decoration="green-400" />
<dt-badge text="Label" decoration="green-500" />
<dt-badge text="Label" decoration="gold-300" />
<dt-badge text="Label" decoration="gold-400" />
<dt-badge text="Label" decoration="gold-500" />
<dt-badge text="Label" decoration="magenta-200" />
<dt-badge text="Label" decoration="magenta-300" />
<dt-badge text="Label" decoration="magenta-400" />
```

**Do:**

- Use for categories of items with a limited number of options (eg. call categories, AI moments).

**Don't:**

- Use for categories of items with an unlimited or unknown number of options (eg. user-defined contact labels, RTA cards, contact centers).
- Use for single items that are not part of a larger group.
- Use for decoration only, to bring attention to part of the UI by using colors.
- Use with `kind=count`, nor with any `type` that is not `default`.
- Use in combination with an icon.
- Change the customize the Badge's background color text style,
- Extend the decorative slot color beyond what Dialtone provides.

### Best Practices

- Favor lighter shades over darker ones.
- Use each color hue before using the next available shade.

## Examples

### Label

### Count

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `iconSize` | The size of the left and right icons. | `string` | `'200'` |
| `text` | Text for the badge content | `string` | `''` |
| `kind` | The kind of badge which determines the styling | `string` | `'label'` |
| `type` | Color for the badge background | `string` | `'default'` |
| `decoration` | Decoration for the badge. This can be only used with kind: label and type: default with no left and right icons | `string` | `''` |
| `labelClass` | Used to customize the label container | `string\|array\|object` | `''` |
| `subtle` | Shows a subtle appearance for the badge Currently only affects the badge when type is bulletin. | `boolean` | `false` |
| `outlined` | Outlines the badge with a border | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `leftIcon` | Slot for left icon, icon-size slot prop defaults to '200' |
| `default` | Slot for badge content, defaults to text prop |
| `rightIcon` | Slot for right icon, icon-size slot prop defaults to '200' |

## Classes

| Class | Applies to | Description |
| --- | --- | --- |
| `d-badge` | N/A | Base badge style |
| `d-badge--count` | .d-badge | Styles with rounded corners. |
| `d-badge--info` | .d-badge | Applies light blue background color. |
| `d-badge--success` | .d-badge | Applies light green background color. |
| `d-badge--warning` | .d-badge | Applies light yellow background color. |
| `d-badge--critical` | .d-badge | Applies light red background color. |
| `d-badge--bulletin` | .d-badge | Applies Dialpad purple background color. |
| `d-badge--ai` | .d-badge | Applies Dialpad Ai's purple/magenta background gradient. |
| `d-badge--decorate-{$color}` | .d-badge | Styles the decoration shape color. |
| `d-badge__label` | Child of .d-badge | Text label |
| `d-badge__decorative` | Child of .d-badge | Decorative color shape |
| `d-badge__icon-left` | Child of .d-badge | Left icon |
| `d-badge__icon-right` | Child of .d-badge | Right icon |
