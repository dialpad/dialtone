---
title: DtModal Native Dialog Migration
description: DtModal now uses a native <dialog> element. This changes the DOM structure, backdrop behavior, and focus management. Popovers and tooltips inside modals also auto-append to the dialog.
---

## TLDR

- `DtModal` now renders a native `<dialog>` element instead of a `<div role="dialog">`.
- The native `::backdrop` pseudo-element replaces the custom `.d-modal__backdrop` div.
- Focus stays trapped within the dialog and Escape closes it — handled by the `v-dt-focustrap` directive and DtModal's own key handling.
- Popovers and tooltips inside modals now auto-append to the nearest `<dialog>`.
- **The dialog no longer enters the browser top layer by default.** The new `modal` prop controls this and defaults to `false`, so surfaces such as toasts and notifications can render above a modal again via the z-index scale. See [Top layer and the `modal` prop](#top-layer-and-the-modal-prop).
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

Previously, the backdrop was a custom `<div>` (`.d-modal__backdrop` or the `.d-modal` overlay itself with `aria-hidden`). The native `::backdrop` pseudo-element only renders for a dialog in the top layer, so it applies solely when `modal` is `true` — and Dialtone makes it transparent in any case. The `.d-modal` element itself is the visual backdrop overlay, painted by its own `background-color`, which is why the modal looks identical in both modes.

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

- **Focus trapping** — while the modal is open, keyboard focus stays inside the dialog: Tab from the last focusable element wraps to the first, and Shift+Tab from the first wraps to the last. This is enforced by the `v-dt-focustrap` directive, independently of `modal`.
- **Background inertness** — everything outside the dialog is inert while it is open. With `modal` set, the browser provides this; otherwise `DtModal` applies `inert` itself, walking up from the dialog and marking siblings at each level. Behaviour is the same either way.
- **Escape key** — pressing Escape closes the modal. The native `cancel` event only fires for top-layer dialogs, so it is used when `modal` is `true` and a keydown handler covers the default case.
- **Initial focus** still works via the `initialFocusElement` prop (`'first'`, `'#id'`, or an `HTMLElement`).

### Top layer and the `modal` prop

Opening a `<dialog>` with `showModal()` promotes it to the browser's **top layer**, which paints above the entire normal stacking order. `z-index` does not apply across that boundary, so *nothing* outside the top layer can render above such a dialog no matter how high its `z-index` is.

That broke Dialtone's own published contract: `--zi-notification` (700) is defined above `--zi-modal` (600), but the comparison never happened, so toasts, banners and application notification surfaces all rendered behind any open modal.

`DtModal` therefore takes a `modal` prop, defaulting to `false`:

```html
<!-- Default: stays in the normal stacking order, z-index scale applies -->
<dt-modal :open="open" header-text="Settings" />

<!-- Opt in to the top layer for a genuinely blocking dialog -->
<dt-modal :open="open" modal header-text="Confirm deletion" />
```

Dim overlay, positioning, focus trap, background inertness, scroll lock and Escape all behave the same in both modes. What differs is who provides them: with `modal` the browser does, and without it `DtModal` does. Two consequences are worth knowing:

- **Background inertness is applied when the dialog opens, not continuously.** Content inserted into the background *after* that point is not inerted. For the surfaces this mode exists to serve — toasts, notifications — that is the intent. For late-mounting application chrome it is a gap the top layer would not have.
- **Escape is handled on `keydown` rather than the native `cancel` event**, and is skipped when a nested widget has already called `preventDefault()` on it, so a dropdown inside the modal closes itself first without taking the modal with it.

**Use `modal` when** the dialog must out-rank another top-layer element, such as a `<dialog>` opened by a third-party library or a fullscreen element.

**Leave it off when** your application has overlays of its own — toasts, call notifications, update banners — that need to reach the user while a modal is open.

### Transition events

`DtLazyShow` is no longer used to wrap the dialog. If you were listening for transition events from the lazy-show wrapper, those events no longer fire. The modal now uses internal `onAfterEnter` / `onAfterLeave` callbacks tied to the dialog lifecycle.

### Popovers and tooltips inside modals

`DtPopover` and `DtTooltip` now auto-detect when they are inside a native `<dialog>` and append themselves to it instead of `<body>`. This keeps them rendering above the modal backdrop rather than behind it.

- The `appendTo="body"` default now resolves to the nearest ancestor `<dialog>` when inside one.
- To force appending to `<body>` regardless of dialog context, pass `document.body` as an `HTMLElement` instead of the string `'body'`.

## Do I Need to Do Anything?

Most likely **no**. These are internal implementation changes. You are affected only if you:

1. **Target `.d-modal__backdrop` or other internal class selectors** in your CSS — review and update those selectors.
2. **Apply `::backdrop` pseudo-element styles** — the native backdrop is now transparent; the `.d-modal` element is the visual overlay.
3. **Had custom `focusin` or `keydown.tab` handlers** wired around the old DOM structure — focus trapping is now handled by the `v-dt-focustrap` directive. Escape is handled on `keydown` by default, and via the native `cancel` event only when `modal` is set.
4. **Relied on `DtLazyShow` transition events** wrapping the dialog — those no longer fire.
5. **Relied on `appendTo="body"` for popovers/tooltips inside modals** to append to `<body>` — they now append to the `<dialog>`. Pass `document.body` explicitly if you need the old behavior.
6. **Depend on the modal out-ranking another top-layer element** — a `<dialog>` from a third-party library, or a fullscreen element. Pass `modal` to opt back into the top layer.

If none of the above apply, no action is required.

### Need Help?

Reach out in the **#dialtone** Dialpad channel with any questions or issues.
