---
title: DtModal Native Dialog Migration
description: DtModal now uses a native <dialog> element. This changes the DOM structure, backdrop behavior, and focus management. Popovers and tooltips inside modals also auto-append to the dialog.
---

## TLDR

- `DtModal` now renders a native `<dialog>` element instead of a `<div role="dialog">`.
- The native `::backdrop` pseudo-element replaces the custom `.d-modal__backdrop` div.
- Focus trapping and Escape-to-close are handled natively by the browser.
- Popovers and tooltips inside modals now auto-append to the nearest `<dialog>` to stay in the browser's top layer.
- We are **not** considering this a breaking change since consumers should not be targeting internal DOM structure. This guide is provided in case you are.

## What Changed

### DOM structure

The root element of `DtModal` changed from:

```html
<!-- Before -->
<div class="d-modal" role="dialog" aria-hidden="false">
  <div class="d-modal__dialog">...</div>
</div>
```

to:

```html
<!-- After -->
<dialog class="d-modal" open>
  <div class="d-modal__dialog">...</div>
</dialog>
```

The `role="dialog"` attribute is no longer needed — the `<dialog>` element has implicit dialog semantics. Visibility is now controlled via the `[open]` attribute instead of `[aria-hidden]`.

### Backdrop

Previously, the backdrop was a custom `<div>` (`.d-modal__backdrop` or the `.d-modal` overlay itself with `aria-hidden`). Now the native `::backdrop` pseudo-element fires when `showModal()` is called, but Dialtone makes it transparent — the `.d-modal` element itself still serves as the visual backdrop overlay.

**If you were targeting `::backdrop`** in your CSS, your styles may now conflict with the transparent reset:

```css
/* Dialtone sets this internally — your overrides may no longer apply as expected */
:where(dialog).d-modal::backdrop {
  background: transparent;
}
```

### CSS selectors

The CSS was updated to support both the legacy `[aria-hidden='false']` selector and the native `[open]` attribute:

```css
/* Before */
.d-modal[aria-hidden='false'] { ... }

/* After */
:is(.d-modal, .d-modal--transparent):is([aria-hidden='false'], [open]) { ... }
```

If you targeted `.d-modal[aria-hidden='false']` in your CSS, those selectors still work but you should migrate to targeting `[open]` or remove the attribute selector entirely.

### Focus management

- **Focus trapping** is now handled natively by the `<dialog>` element — the custom `trapFocus` and `focusin` handlers have been removed.
- **Escape key** closing is handled natively — the custom `keydown` Escape handler has been removed.
- **Initial focus** still works via the `initialFocusElement` prop (`'first'`, `'#id'`, or an `HTMLElement`).

### Transition events

`DtLazyShow` is no longer used to wrap the dialog. If you were listening for transition events from the lazy-show wrapper, those events no longer fire. The modal now uses internal `onAfterEnter` / `onAfterLeave` callbacks tied to the dialog lifecycle.

### Popovers and tooltips inside modals

`DtPopover` and `DtTooltip` now auto-detect when they are inside a native `<dialog>` and append themselves to it instead of `<body>`. This keeps them in the browser's top layer so they render correctly above the modal backdrop.

- The `appendTo="body"` default now resolves to the nearest ancestor `<dialog>` when inside one.
- To force appending to `<body>` regardless of dialog context, pass `document.body` as an `HTMLElement` instead of the string `'body'`.

## Do I Need to Do Anything?

Most likely **no**. These are internal implementation changes. You are affected only if you:

1. **Target `.d-modal__backdrop` or other internal class selectors** in your CSS — review and update those selectors.
2. **Apply `::backdrop` pseudo-element styles** — the native backdrop is now transparent; the `.d-modal` element is the visual overlay.
3. **Had custom `focusin` or `keydown.tab` handlers** wired around the old DOM structure — the native dialog handles focus trapping and Escape natively.
4. **Relied on `DtLazyShow` transition events** wrapping the dialog — those no longer fire.
5. **Relied on `appendTo="body"` for popovers/tooltips inside modals** to append to `<body>` — they now append to the `<dialog>`. Pass `document.body` explicitly if you need the old behavior.

If none of the above apply, no action is required.

### Need Help?

Reach out in the **#dialtone** Dialpad channel with any questions or issues.
