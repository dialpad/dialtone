# Button Group

Used for grouping buttons that share a relationship or perform similar actions.

- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-button-group--default
- **Keywords**: button set, btn group, action group, d-btn-group, DtButtonGroup, dt-button-group, toolbar, segmented button

```vue
<dt-button-group>
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
```

## Variants

The alignment and the order of buttons within it can be customized to suit the specific use case.

### Start

When aligned to `start`, the `primary` button is on the **left** side of the group.

```vue
<dt-button-group>
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
```

### End

When aligned to `end`, the `primary` button is on the **right** side of the group.

```vue
<dt-button-group alignment="end">
  <dt-button importance="primary">Confirm</dt-button>
  <dt-button importance="outlined">Cancel</dt-button>
</dt-button-group>
```

### Space-Between

When set to `space-between`, the elements are evenly distributed within the row, creating a directional flow where the `primary` button is either on the **left** (regressive) or on the **right** (progressive).

```vue
<dt-button-group alignment="space-between">
  <dt-button importance="outlined">Previous</dt-button>
  <dt-button importance="primary">Next</dt-button>
</dt-button-group>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `alignment` | Alignment of the buttons inside the container | `string` | `'start'` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Default slot for button items |
