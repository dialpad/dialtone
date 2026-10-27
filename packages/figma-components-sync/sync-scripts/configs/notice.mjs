/**
 * DtNotice — an inline informational message.
 *
 * Axes come from the DtNotice prop API (Notice.vue props block), not from
 * NoticeConstants.js: NOTICE_KINDS happens to match the `kind` prop values here,
 * but NOTICE_ROLES is an ARIA vocabulary with no rendered effect at all (measured
 * identical across status / alert / alertdialog).
 *
 * Notice has NO interaction states of its own. The root is a non-focusable
 * <aside> and the compiled CSS carries no :hover / :active / :focus-visible rule
 * for any .d-notice selector — forcing all three on the root changed nothing but
 * `outlineWidth`, which the verifier exempts. The only interactive element is the
 * close DtButton, and forcing hover / hover+active / focus-visible on it moved
 * exactly one property each (its own background, then its own focus box-shadow) —
 * values owned by `.d-btn--muted.d-btn--clear`, i.e. already swept by the Button
 * page at kind=muted, importance=clear, size=200. So there is no `state` axis,
 * and therefore no `pseudo` / `stateTarget` either.
 */
export default {
  component: 'DtNotice',
  label: 'Notice',
  page: 'Notice',
  figmaSetId: '523:22898',

  axes: {
    // Each kind repaints the surface AND swaps the default icon glyph
    // (bell / alert-circle / info / check-circle / alert-triangle).
    kind: ['base', 'critical', 'info', 'positive', 'warning'],
    // Repaints surface, text, icon and kills the inset border — 41+ measured
    // property changes per kind, and the kind-specific `--important` blocks each
    // resolve to a different strong surface, so this is not a uniform overlay.
    important: [false, true],
    // Header presence, driven by `headerText`. Not cosmetic: it adds the
    // .d-notice__title paragraph (root 58px -> 75px) and flips the icon to
    // .d-notice__icon--has-title, which zeroes its margin-block-start.
    header: [false, true],
    // Booleans that gate real child elements. Kept as variant axes rather than
    // Figma component properties so the verifier actually covers both states —
    // a component property's non-default value is never swept (see B-11).
    showIcon: [true, false],
    // false does not merely hide the button: NoticeAction swaps the visible
    // DtButton for the sr-only close button, so .d-notice__actions collapses
    // from 26px to 0 and the root loses 4px of height.
    showClose: [true, false],
    /**
     * SLOT PRESENCE AS AN AXIS, not a BOOLEAN component property.
     *
     * `showAction` alone changes nothing — NoticeAction renders `<slot v-if="showAction" />`
     * and nothing else, which the note below records. What changes the render is the CONTENT,
     * so the content's presence is what gets swept.
     *
     * Why an axis rather than the merged BOOLEAN model that DtBadge uses: measured, revealing
     * the action makes the notice GROW (148.14 -> 164.14, and one case shrinks in height,
     * 54 -> 49), and the root cannot hug — its width is not content-determined, so the builder
     * pins it. A pinned frame cannot grow, so the toggle would reveal the button without
     * making room for it. `slotAxisSizing` caught exactly that, 80 times.
     */
    action: [false, true],
  },

  // Nothing to exclude. Notice rejects no combination of these props, and with no
  // interaction states there is no reachability rule to encode (the disabled-cannot-
  // be-hovered class of constraint has no analogue here). The hook is still required
  // by the sweep, so it is declared explicitly rather than left to be inferred.
  invalid: () => false,

  variantName: c => `kind=${c.kind}, important=${c.important}, header=${c.header}, `
    + `showIcon=${c.showIcon}, showClose=${c.showClose}, action=${c.action}`,

  props: c => ({
    kind: c.kind,
    important: c.important,
    showIcon: c.showIcon,
    showClose: c.showClose,
    // Pinned at its default rather than swept — see the note above `slotPass`.
    showAction: true,
    // Pinned: truncateText is deliberately not an axis (see below).
    truncateText: false,
    ...(c.header ? { headerText: 'Notice title' } : {}),
  }),

  // DELIBERATELY NOT AXES
  //
  // truncateText — measured across the sweep it is byte-identical at rest apart
  //   from `overflow: visible -> hidden` on .d-notice__content and
  //   .d-notice__message, and `overflow` is on the verifier's EXEMPT list
  //   ("Figma clipsContent is a build choice, not a rendered CSS value to
  //   match"). Boxes, colours and children are unchanged, so every variant would
  //   be paired with a pixel-identical twin the verifier could not tell apart —
  //   the DtChip `interactive` mistake. It only becomes visible with content that
  //   actually overflows (probed with a 240-char label: 88px -> 58px), and the
  //   sweep renders one short label for every variant.
  // showAction — measured identical with the action slot empty, because
  //   NoticeAction renders `<slot v-if="showAction" />` and nothing else. What
  //   changes the render is the SLOT CONTENT, not the flag, so `action` is
  //   handled in the slot pass below and the flag is pinned true.
  // role — status / alert / alertdialog are measured identical; ARIA only.
  // headerId, contentId, iconClass, headerClass, contentClass, actionClass —
  //   pure pass-through.
  //
  // `action` is swept as an axis above, so the ordinary sweep renders both states and no
  // second build or merge is involved. `icon` is deliberately NOT filled: it overrides the
  // kind's default glyph, and the set should show the DEFAULT. Making that glyph swappable
  // needs every icon to become an instance of the icon-library component, which is a
  // separate piece of work — until then the icon is correct but not swappable, which the
  // build report says out loud rather than implying.
  slots: c => (c.action ? ['action'] : []),
  // The action slot takes ANY content (its own doc offers a link as the example), so it is a
  // native Figma slot with the exemplar button as its default content, not a one-value swap.
  nativeSlots: ['action'],
  /**
   * WHAT EACH SLOT IS RENDERED WITH — A CHOSEN EXEMPLAR, NOT A DERIVED FACT.
   *
   * The `action` slot enforces nothing. It is a bare `<slot v-if="showAction" />` passing no
   * props, and its own doc comment offers a LINK as the example ("such as a link to another
   * page"). NoticeDefault.story.vue renders arbitrary HTML there when given any, and falls
   * back to a DtButton otherwise.
   *
   * So this is a decision, and it is recorded as one: the story's fallback is the most
   * representative single thing to show, so the set shows a 200 outlined button whose kind
   * follows the notice (`isInverted ? 'inverted' : 'muted'`). A function of the combo because
   * that dependency is real — a static kind would be wrong on every important notice.
   *
   * What this is NOT is evidence about the API. Anything a consumer puts there is valid, and
   * a Figma set can only show one thing, so whatever it shows is an example rather than a
   * constraint. Worth remembering before treating the rendered button as the contract.
   *
   * Why it matters that this is declared at all: without it every named slot received a
   * DtIconClose, so `action` was measured as a close icon — not a plausible exemplar of
   * anything, and it would have been baked into the set as the thing a designer swaps.
   *
   * `icon` is left unspecified: it IS an icon slot, so the default is correct.
   */
  // The `icon` slot overrides the kind glyph the component draws itself. That glyph is
  // never replaced by the sweep — the set should show the default — but it IS an instance
  // of an icon-library component, so it can carry an INSTANCE_SWAP and be changed from the
  // panel. Naming the wrapper is how the default content is identified: unlike injected
  // slot content it carries no `data-slot` marker.
  slotDefaults: { icon: 'd-notice__icon' },
  slotContent: c => ({
    action: {
      component: 'DtButton',
      props: { size: 200, importance: 'outlined', kind: c.important ? 'inverted' : 'muted' },
      text: 'Action',
      // The Figma component a designer starts from, stated as a full variant combo so
      // nothing is inferred. Resolved to a node id at encode time against DtButton's set.
      swapTo: { component: 'button', variant: {
        kind: c.important ? 'inverted' : 'muted', importance: 'outlined', size: 200,
        state: 'default', loading: false, startIcon: false, endIcon: false,
      } },
    },
  }),
  // The `icon` slot is dropped entirely when showIcon is false, so those combos
  // would spend a slot-pass variant checking nothing new.
  slotInvalid: c => c.showIcon === false,
  // No rootClass: .d-notice carries its own padding and its own content /icon
  // gaps, and no doc example wraps it in a spacing class.
};
