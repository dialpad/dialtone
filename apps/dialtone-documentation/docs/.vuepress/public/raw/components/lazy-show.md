# Lazy Show

Lazy show is a utility component that prevents its children from being rendered until the first time it is shown.

- **Status**: ready
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/utilities-lazy-show--default
- **Keywords**: lazy load,conditional render,d-lazy-show,DtLazyShow,dt-lazy-show

`DtLazyShow` is essentially a combination of a `v-if` and `v-show`. This means that the child slot will not be rendered/initialized until the first time `show` is `true`, after which the slot will stay in the DOM and be hidden/shown with the `v-show` directive. This is useful to prevent elements which are hidden from being rendered immediately, but keeping them alive when toggled later.

The lazy show wraps the slot in a parent `div` in order to achieve this. It also wraps the `v-show` in a `transition`, so you can pass any valid Vue transition class to control the enter/leave transitions.

```vue
<dt-button @click="isShown = !isShown">
  Toggle
</dt-button>
<dt-lazy-show
  transition="fade"
  :show="isShown"
>
  Im Lazy!
</dt-lazy-show>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `show` | Whether the child slot is shown. | `boolean` | `false` |
| `transition` | A valid Vue enter/leave CSS transition name. | `string` | `null` |
| `appear` | Enable/Disable transition animation | `boolean` | `false` |

### Slots

| Name | Description |
| --- | --- |
| `default` | Slot for main content |
