# Loader

A loader is a visual indicator that a task is in progress.

- **Status**: beta
- **Storybook**: https://dialtone.dialpad.com/vue/?path=/story/components-loader--default
- **Keywords**: spinner, loading, progress, d-loader, DtLoader, dt-loader, activity indicator, spin

## Loader vs Skeleton

**Use Loader when:**

- You need a simple, generic loading indicator
- Loading time is short or indeterminate
- You want to indicate that a process is running without showing layout structure
- You need a compact loading indicator for buttons, small components, or overlays

**Use [Skeleton](./skeleton.md) when:**

- Content is expected to take more than a few hundred milliseconds to load on average
- You want to show the approximate layout and structure of content being loaded
- Loading complex lists, cards, or detailed content where users benefit from seeing the expected layout
- You need to maintain visual hierarchy during loading states

## Variants

### Default

The base loader should be the go-to loader for most of your needs. When in doubt, use this style.

```vue
<dt-loader />
```

## Sizes

The base loader size is 24px and should be used in most cases.

```vue
<dt-loader size="100"></dt-loader>
<dt-loader size="200"></dt-loader>
<dt-loader size="300"></dt-loader>
<dt-loader size="400"></dt-loader>
<dt-loader></dt-loader>
<dt-loader size="600"></dt-loader>
<dt-loader size="700"></dt-loader>
<dt-loader size="800"></dt-loader>
```

## Vue API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| `ariaLabel` | The label of the loader as read out by a screen reader. Default is "loading" | `string` | `''` |
| `size` | The size of the icon. | `string` | `'500'` |

## Accessibility

- You can add an `aria-label` attribute to the loader to indicate a custom label.
- If no `aria-label` is provided, the default value is "loading".
