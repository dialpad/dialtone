// Dialtone Migration Helper — bundled next→stable DOM-structure rules.
//
// Direction: NEXT → STABLE (reverse of the Dialtone migration guide, which
// documents the stable→next upgrade path). Rules here undo those upgrades to
// reproduce the stable component structure on a `next`-running page.
//
// Rule shape: { id, match, ops: [{ type, ... }] }
//   match  — CSS selector (querySelectorAll / el.matches). Comma-separated for
//            multiple variants.
//   ops    — ordered list of ops; renameTag threads its replacement element
//            forward so subsequent ops apply to the new tag.
//
// Op types:
//   replaceClass  { from, to }         — prefix-aware: replaces all classes
//                                        starting with `from` with `to + suffix`.
//   addClass      { cls }              — adds class if absent.
//   removeClass   { cls }              — removes class if present.
//   setAttr       { name, value }      — sets attribute; inverse restores prior value.
//   removeAttr    { name }             — removes attribute; inverse restores value.
//   renameTag     { to }               — replaces element with a new tag, copies all
//                                        attributes and moves all children.
//
// Visual vs structural:
//   ★ VISUAL change   — the rendered output (styling, behaviour, affordances) differs
//                        between stable and next.
//   ✎ NORMALIZATION   — markup is renamed but Dialtone co-emits both class names to
//                        the SAME CSS declaration; no pixel difference.
//
// Adding a rule:
//   1. Find the matching Dialtone Next migration guide entry at
//      https://dialtone.dialpad.com/next/guides/migration/
//   2. Copy the stable and next rendered-DOM strings (tag names, class names,
//      attributes) from the guide page — never infer them.
//   3. Express the REVERSE transform (next → stable) as a rule here.
//   4. Mark the rule's visual vs normalization status in a comment.

// COVERAGE ANALYSIS (against https://dialtone.dialpad.com/next/guides/migration/)
//
// All guides were reviewed for rendered HTML/CSS class changes implementable with
// prefix-aware `replaceClass`, `renameTag`, `setAttr`, or `removeAttr` ops.
//
// COVERED — rules below handle:
//   Guide #6 (success→positive):   d-fc-success*, d-bgc-success*, d-bc-success*  — Rule 3
//   Guide #15 (chip interactive):  span.d-chip → button                           — Rule 1
//   Guide #17 (modal native):      dialog.d-modal → div[role=dialog]              — Rule 2
//
// NOT ADDED — reasons:
//   Guide #7 (border-radius):  d-bar6→d-bar-350, d-btr6→d-bbsr-350, etc.
//     NORMALIZATION — next CSS co-selects both names with same values. No visual
//     diff even if old rule doesn't match. Also: `replaceClass` is prefix-aware
//     but suffixes differ (6≠350), so exact-match replacement would be needed.
//     Skipped: no visual gain + requires a new op type.
//   Guides #2/#3/#5 (token renames): CSS variables not class names — handled
//     by token injection + framework CSS injection, no DOM rules needed.
//   Guide #10 (component sizes): "CSS utility classes — no changes" per guide.
//   Guide #11 (avatar): "already migrated to numeric in a prior release" —
//     same class names in both stable and next, no rename.
//   Guide #14 (component props kind/type values danger→critical): These are Vue
//     prop value renames, not CSS utility class renames. No explicit before/after
//     CSS class names shown in the guide.
//   Guide #16 (scrollbar): Vue directive change only, no CSS class rename.
//   Guide #18 (typography): Legacy classes co-selected in next — NORMALIZATION.
//
// PENDING SPIKE CONFIRMATION:
//   Any component-specific CSS modifier classes that changed between stable and
//   next but aren't documented in the migration guide. The de-risk spike on the
//   real next page will identify these by observing which class-named components
//   don't flip geometry after CSS injection.

globalThis.DT_STRUCTURE_RULES = [
  // ── Rule 1: DtChip <span> → <button>  (★ VISUAL CHANGE) ─────────────────────
  // Source: https://dialtone.dialpad.com/next/guides/migration/chip-interactive/
  //
  // Dialtone Next changed the default value of the `interactive` prop from `true`
  // to `false`. A chip without an explicit `interactive` prop now renders as a
  // non-interactive <span class="d-chip"> in next; in stable it rendered as a
  // <button class="d-chip"> with hover, focus, pointer, and active styles.
  //
  // This is the flagship rule: the element-type change produces a real visual diff
  // (button shows UA focus ring, cursor:pointer, hover styles that a span lacks).
  //
  // Confirmed rendered markup:
  //   stable: <button class="d-chip">…</button>
  //   next:   <span   class="d-chip">…</span>     ← matched here
  //
  // Reference for `.d-chip` class name:
  //   https://dialtone.dialpad.com/components/chip.html — "set the width of the
  //   .d-chip element" confirms d-chip as the root element class.
  {
    id: 'chip-span-to-button',
    match: 'span.d-chip',
    ops: [
      { type: 'renameTag', to: 'button' },
    ],
  },

  // ── Rule 2: DtModal <dialog> → <div role="dialog">  (★ VISUAL CHANGE) ───────
  // Source: https://dialtone.dialpad.com/next/guides/migration/modal-native-dialog/
  //
  // Dialtone Next changed DtModal's root element from <div role="dialog"> to a
  // native <dialog> element. The visibility attribute changed from aria-hidden
  // to the native [open] attribute.
  //
  // This produces a structural + a11y-attribute change: the native <dialog> uses
  // browser-native focus trapping (showModal/cancel events), backdrop, and top-layer
  // positioning that a plain <div> does not have.
  //
  // Note: Dialtone co-emits CSS rules for both [aria-hidden='false'] and [open], so
  // the visual overlay appearance is the same — the change here is the DOM structure
  // and accessibility model, not the overlay colour.
  //
  // Confirmed rendered markup (from guide page):
  //   stable: <div class="d-modal" role="dialog" aria-hidden="false">…</div>
  //   next:   <dialog class="d-modal" open>…</dialog>               ← matched here
  //
  // Ops run in order on the same logical element; renameTag threads the new <div>
  // forward so the following setAttr/removeAttr ops apply to the <div>.
  {
    id: 'modal-dialog-to-div',
    match: 'dialog.d-modal[open]',
    ops: [
      { type: 'renameTag', to: 'div' },
      { type: 'setAttr',   name: 'role',         value: 'dialog' },
      { type: 'setAttr',   name: 'aria-hidden',  value: 'false'  },
      { type: 'removeAttr', name: 'open' },
    ],
  },

  // ── Rule 3: Avatar canvas-inner unwrap  (★ VISUAL CHANGE) ───────────────────
  // Next Avatar wraps image/icon/initials in an extra <div class="d-avatar__canvas-inner">.
  // Stable does not have this wrapper — the content sits directly inside d-avatar__canvas.
  // Removing it is safe: the wrapper carries no app-owned classes or attributes.
  {
    id: 'avatar-canvas-inner-unwrap',
    match: '.d-avatar__canvas-inner',
    ops: [
      { type: 'unwrap' },
    ],
  },

  // ── Rule 4: Presence icon removal  (★ VISUAL CHANGE) ────────────────────────
  // Next Presence renders an <svg class="d-presence__icon"> inside d-presence__inner.
  // Stable has no icon — stable CSS has no rules for d-presence__icon.
  {
    id: 'presence-icon-remove',
    match: '.d-presence__icon',
    ops: [
      { type: 'removeElement' },
    ],
  },

  // ── Rule 4b: Presence sr-only removal  (★ STRUCTURAL CHANGE) ─────────────
  // Next Presence renders a <span class="sr-only"> as a direct child of .d-presence
  // for accessibility labelling. Stable does not have this element.
  // Removing it gives stable's exact DOM shape so stable CSS selectors match correctly.
  {
    id: 'presence-sr-only-remove',
    match: '.d-presence > .sr-only',
    ops: [
      { type: 'removeElement' },
    ],
  },

  // ── Rule 5: Avatar size class remap  (★ VISUAL CHANGE) ──────────────────────
  // Next uses numeric size modifiers (d-avatar--size-100 … d-avatar--size-900).
  // Stable uses t-shirt sizes (xs, sm, md, lg, xl).
  {
    id: 'avatar-size-remap',
    match: '.d-avatar[class*="d-avatar--size-"]',
    ops: [
      { type: 'replaceClass', from: 'd-avatar--size-100', to: 'd-avatar--xs' },
      { type: 'replaceClass', from: 'd-avatar--size-150', to: 'd-avatar--xs' },
      { type: 'replaceClass', from: 'd-avatar--size-200', to: 'd-avatar--sm' },
      { type: 'replaceClass', from: 'd-avatar--size-250', to: 'd-avatar--sm' },
      { type: 'replaceClass', from: 'd-avatar--size-300', to: 'd-avatar--md' },
      { type: 'replaceClass', from: 'd-avatar--size-400', to: 'd-avatar--md' },
      { type: 'replaceClass', from: 'd-avatar--size-500', to: 'd-avatar--lg' },
      { type: 'replaceClass', from: 'd-avatar--size-600', to: 'd-avatar--xl' },
      { type: 'replaceClass', from: 'd-avatar--size-700', to: 'd-avatar--xl' },
      { type: 'replaceClass', from: 'd-avatar--size-800', to: 'd-avatar--xl' },
      { type: 'replaceClass', from: 'd-avatar--size-900', to: 'd-avatar--xl' },
    ],
  },

  // ── Rule 6: Avatar presence wrapper size remap  (★ VISUAL CHANGE) ───────────
  // Confirmed against live master/next captures (2026-07-01): master's sm avatars
  // render the presence wrapper with NO size modifier (default); next adds --200.
  // Master keeps --md/--lg for md/lg avatars, and next does too — those pass through.
  // So numeric small sizes are REMOVED (stable default), 300 maps to md, 400/500 to lg.
  {
    id: 'avatar-presence-size-remap',
    match: '.d-avatar__presence[class*="d-avatar__presence--"]',
    ops: [
      { type: 'removeClass', cls: 'd-avatar__presence--100' },
      { type: 'removeClass', cls: 'd-avatar__presence--150' },
      { type: 'removeClass', cls: 'd-avatar__presence--200' },
      { type: 'removeClass', cls: 'd-avatar__presence--250' },
      { type: 'replaceClass', from: 'd-avatar__presence--300', to: 'd-avatar__presence--md' },
      { type: 'replaceClass', from: 'd-avatar__presence--400', to: 'd-avatar__presence--lg' },
      { type: 'replaceClass', from: 'd-avatar__presence--500', to: 'd-avatar__presence--lg' },
    ],
  },

  // ── Rule 8: Split button start/end → alpha/omega  (★ VISUAL CHANGE) ────────
  // Confirmed against live master/next captures (2026-07-01): next renamed the
  // split-button segment classes. Exact suffixed classes first (--300 → --md),
  // then the prefix-aware bare rename catches remaining variants.
  {
    id: 'split-btn-segment-rename',
    match: '[class*="d-split-btn__start"], [class*="d-split-btn__end"]',
    ops: [
      { type: 'replaceClass', from: 'd-split-btn__start--300', to: 'd-split-btn__alpha--md' },
      { type: 'replaceClass', from: 'd-split-btn__end--300', to: 'd-split-btn__omega--md' },
      { type: 'replaceClass', from: 'd-split-btn__start', to: 'd-split-btn__alpha' },
      { type: 'replaceClass', from: 'd-split-btn__end', to: 'd-split-btn__omega' },
    ],
  },

  // ── Rule 7: Presence dnd → busy fallback  (★ VISUAL CHANGE) ─────────────────
  // Stable has no dnd state. Nearest visual approximation is busy.
  // This is an intentional semantic fallback, not an accurate mapping.
  {
    id: 'presence-dnd-remap',
    match: '.d-presence__inner--dnd',
    ops: [
      { type: 'replaceClass', from: 'd-presence__inner--dnd', to: 'd-presence__inner--busy' },
    ],
  },

  // ── Rule 3 (renumbered): positive→success class rename  (✎ NORMALIZATION — NO pixel diff) ──
  // Source: https://dialtone.dialpad.com/next/guides/migration/success-to-positive/
  //
  // ⚠️  VISUALLY INERT: Dialtone deliberately co-emits both the old (`success`)
  //     and new (`positive`) utility-class selectors to the SAME CSS declaration:
  //     ".d-fc-success, .d-fc-positive { color: var(--dt-color-foreground-positive) }"
  //     Renaming these classes changes the markup but produces ZERO pixel difference.
  //     This rule is included to:
  //       a) exercise the `replaceClass` op type in tests;
  //       b) normalize markup to stable-era class names so other tooling expecting
  //          `success` tokens doesn't break on the inspected page.
  //
  // Confirmed utility-class names (from guide page Before/After examples):
  //   next:   d-fc-positive, d-fc-positive-strong, d-fc-positive-inverted, …
  //   stable: d-fc-success,  d-fc-success-strong,  d-fc-success-inverted, …
  //   (same pattern for d-bgc-* and d-bc-* families)
  //
  // The `replaceClass` op is prefix-aware: it replaces the prefix and preserves
  // any suffix (e.g. d-fc-positive-strong → d-fc-success-strong).
  {
    id: 'positive-to-success-classes',
    match: '[class*="d-fc-positive"], [class*="d-bgc-positive"], [class*="d-bc-positive"]',
    ops: [
      { type: 'replaceClass', from: 'd-fc-positive',  to: 'd-fc-success'  },
      { type: 'replaceClass', from: 'd-bgc-positive', to: 'd-bgc-success' },
      { type: 'replaceClass', from: 'd-bc-positive',  to: 'd-bc-success'  },
    ],
  },
];
