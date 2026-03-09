---
type: reference
category: reference
keywords: [accessibility, a11y, wcag, aria, focus-management, keyboard-navigation, screen-reader, data-qa, focus-visible, reduced-motion]
ai_summary: Accessibility checklist for Dialtone components — ARIA patterns, focus management, keyboard navigation, and CSS utilities used across the design system.
last_updated: 2026-03-09
related_packages: [dialtone-vue, dialtone-css]
---

# Accessibility Checklist

Dialtone targets **WCAG 2.1 AA** compliance. This checklist covers the accessibility patterns implemented across Dialtone components and the utilities available for custom work.

For the full accessibility guide with P.O.U.R. principles and role-specific responsibilities, see `apps/dialtone-documentation/docs/guides/accessibility/index.md`.

## ARIA Patterns by Component Type

### Dialogs (DtModal)

- `role="dialog"` and `aria-modal="true"` on the dialog container
- `aria-labelledby` pointing to the title element ID
- `aria-describedby` pointing to the body content ID
- `aria-hidden="true"` on the backdrop overlay
- Screen-reader-only close button (`SrOnlyCloseButton` component) always present

### Tooltips and Popovers (DtTooltip, DtPopover)

- `aria-expanded` on the anchor element reflecting open state
- `aria-controls` linking anchor to the floating content ID
- `aria-haspopup` on popover anchors
- Keyboard dismiss via `Escape` key

### Form Inputs (DtInput, DtCheckbox, DtRadio, DtToggle)

- Native semantic elements (`<input>`, `<label>`) used wherever possible
- `aria-details` linking input to its description element
- `aria-checked` as string on DtToggle (supports `'mixed'` for indeterminate)
- `aria-disabled` as string attribute (not just the `disabled` HTML prop)
- Validation messages connected via `aria-describedby`

### Combobox (DtCombobox)

- `role="combobox"` on the input
- `aria-expanded` reflecting list visibility
- `aria-owns` and `aria-controls` pointing to the listbox ID
- `aria-haspopup="listbox"`
- `aria-activedescendant` tracking the highlighted option ID

### Dropdowns (DtDropdown)

- `role="menu"` on the list container
- `role="menuitem"` on individual items
- `aria-expanded` on the trigger

## Focus Management

### Focus Trapping (Modal Mixin)

`packages/dialtone-vue/common/mixins/modal.js` provides focus trap methods used by DtModal and similar overlays:

- `focusFirstElement()` — moves focus into the trapped region on open
- `focusTrappedTabPress(event, element)` — intercepts Tab/Shift+Tab to cycle within the region
- `_getFocusableElements()` — finds all focusable children, excluding `disabled`, `aria-disabled="true"`, `role="presentation"`, and `tabindex="-1"` elements
- Also checks computed styles for `display: none` and `visibility: hidden`

Focusable selector used: `button, [href], input, select, textarea, details, [tabindex]`

### Keyboard List Navigation

`packages/dialtone-vue/common/mixins/keyboard_list_navigation.js` provides arrow-key navigation for dropdowns and selects:

- Up/Down arrow keys move highlight through list items
- `listItemRole` configurable (defaults to `'option'`)
- `focusOnKeyboardNavigation` flag controls whether items receive DOM focus on arrow
- `scrollToOnHighlight` scrolls the active item into view

### Standard Keyboard Events

Components use `EVENT_KEYNAMES` from `packages/dialtone-vue/common/constants/index.js`:

| Key | Constant | Used for |
|-----|----------|----------|
| Escape | `EVENT_KEYNAMES.escape` | Dismiss modals, tooltips, popovers, dropdowns |
| Tab | `EVENT_KEYNAMES.tab` | Focus trap cycling in modals |
| Enter | `EVENT_KEYNAMES.enter` | Activate buttons, select items |
| Space | `EVENT_KEYNAMES.space` | Toggle checkboxes, activate buttons |
| ArrowUp/Down | `EVENT_KEYNAMES.arrowup/arrowdown` | List navigation |
| Home/End | `EVENT_KEYNAMES.home/end` | Jump to first/last item |

## CSS Accessibility Utilities

### Screen Reader Only

`.d-vi-visible-sr` — visually hidden but announced by screen readers. Uses clipping technique with `width: 1px`, `height: 1px`, `overflow: hidden`, `position: absolute`.

Keyboard shortcuts use `.d-keyboard-shortcut--sr-only:not(:focus, :active)` for screen-reader-only text that becomes visible on focus.

### Focus Visible

Dialtone uses `:focus-visible` (not `:focus`) for keyboard focus indicators. This means mouse clicks do not show focus rings, but Tab navigation does.

Applied on: buttons (`.d-btn:focus-visible`), links (`.d-link:focus-visible`), checkboxes, radio buttons, tabs, list items, dropdowns.

### Reduced Motion

`@media (prefers-reduced-motion)` is applied to disable animations for users with motion sensitivity. This affects transitions on tooltips, modals, and other animated components.

## Component Accessibility Checklist

When building or modifying a Dialtone component, verify:

### Semantic HTML
- [ ] Uses native elements where possible (`<button>`, `<input>`, `<label>`, `<nav>`)
- [ ] Does not use `<div>` or `<span>` for interactive elements
- [ ] Heading levels follow document hierarchy (no skipping levels)

### ARIA
- [ ] Interactive elements have accessible names (visible label, `aria-label`, or `aria-labelledby`)
- [ ] Related elements are linked (`aria-describedby`, `aria-details`, `aria-controls`)
- [ ] Dynamic state is reflected (`aria-expanded`, `aria-checked`, `aria-disabled`, `aria-hidden`)
- [ ] Roles are correct for non-native patterns (`role="dialog"`, `role="menu"`, `role="combobox"`)

### Keyboard
- [ ] All interactive elements are reachable via Tab
- [ ] `Escape` dismisses overlays (modals, tooltips, dropdowns)
- [ ] Arrow keys work for list-type navigation
- [ ] Enter/Space activates buttons and toggles
- [ ] Focus is trapped inside modals while open
- [ ] Focus returns to trigger element when overlay closes

### Visual
- [ ] Color contrast meets 4.5:1 minimum ratio (WCAG AA)
- [ ] Focus indicator is visible via `:focus-visible`
- [ ] Information is not conveyed by color alone
- [ ] Animations respect `prefers-reduced-motion`

### Testing
- [ ] `data-qa` attributes present on root and key child elements
- [ ] Dedicated `describe('Accessibility Tests')` block in test file
- [ ] Tests verify ARIA attributes reflect component state
- [ ] Tests verify keyboard interactions work
