/**
 * DtInput.
 *
 * Axes are the PROP API (Input.vue's props block plus InputMixin and the
 * messages mixin it composes), not InputConstants.js — that file maps sizes to
 * CSS modifiers and lists every HTML input `type`, and only a subset of those
 * types is a Dialtone-styled control (see `type` below).
 *
 * The root is `.d-input__root`; the styled, hoverable, focusable element is the
 * inner `<input class="d-input">`, which is why `stateTarget` points at it
 * rather than at the root.
 */
export default {
  component: 'DtInput', label: '', page: 'Input',
  figmaSetId: '286:17984',

  axes: {
    // A SUBSET of INPUT_TYPES, chosen for what it changes rather than for
    // completeness:
    //   text     — the baseline single-line control
    //   textarea — a different ELEMENT (<textarea>), so a different anatomy
    //   search   — carries its own affordances in some browsers
    //   number   — spinner buttons, which are native UA widgets
    // Excluded: date, time, file, color. Each of those renders a native
    // browser widget (a picker button, a file button, a swatch) that Chrome
    // draws itself and Figma has no way to reproduce. Syncing them would put a
    // Chrome-specific control into a design file as if it were a Dialtone
    // decision. If they are ever wanted, they want an explicit allowance saying
    // the UA widget is not represented — not silent inclusion.
    type: ['text', 'textarea', 'search', 'number'],
    // Every documented size.
    size: ['xs', 'sm', 'md', 'lg', 'xl'],
    disabled: [false, true],
    // Gates the label element entirely. A variant axis rather than a Figma
    // BOOLEAN property so the false case is actually swept — a boolean property
    // defaults to false and its other value never renders (B-11).
    showLabel: [true, false],
    // Presence of description copy, not its text: it adds an element, which is
    // an anatomy change. Modelled as a boolean for the same reason as
    // Checkbox's `description`.
    description: [false, true],
    // No 'active': there is no :active rule for .d-input in input.less, so
    // active would be pixel-identical to rest. Left out rather than swept and
    // then excluded.
    state: ['default', 'hover', 'focus'],
  },

  invalid: c => {
    // The hover rule is `.d-input:not(:disabled):hover`, and a disabled input
    // cannot receive focus, so neither state is reachable while disabled.
    // Forcing them through CDP would paint a state no user can reach.
    if (c.disabled && c.state !== 'default') return true;
    return false;
  },

  props: c => ({
    type: c.type,
    size: c.size,
    disabled: c.disabled,
    label: 'Label',
    showLabel: c.showLabel,
    description: c.description ? 'Description copy' : '',
    modelValue: 'Value',
  }),

  // The styled element is the inner control, not the root. `.d-input__input` is the
  // class it ALWAYS carries; the second class is `d-input` for an <input> and
  // `d-textarea` for a <textarea>, so selecting on `.d-input` would silently miss
  // every textarea variant — and `forceState` failing to find its target aborts the
  // whole measurement rather than quietly skipping a state.
  stateTarget: '.d-input__input',
  pseudo: c => (c.state === 'hover' ? ['hover']
    : c.state === 'focus' ? ['focus', 'focus-visible'] : []),

  // Deliberately NOT swept here: validationMessages / showMessages. The
  // validation-message block is DtValidationMessages, and Radio already sweeps
  // it as a `message` axis — including its icon and its four kinds. Sweeping it
  // again here would multiply this set by four to re-check a component that is
  // already covered, and the first thing to check about DtInput is DtInput.
  variantName: c => `type=${c.type}, size=${c.size}, disabled=${c.disabled}, `
    + `showLabel=${c.showLabel}, description=${c.description}, state=${c.state}`,
};
