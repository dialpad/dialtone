/**
 * DtBanner — packages/dialtone-vue/components/Banner/Banner.vue
 *
 * Banner is a composition: the root <aside class="d-banner"> wraps
 * .d-banner__dialog, which lays out DtNoticeIcon / DtNoticeContent / DtNoticeAction.
 * Its colour comes entirely from the shared `.d-notice, .d-banner, .d-toast` custom
 * property block (--notice-color-background/-text/-icon), which `kind` and
 * `important` re-point; its geometry comes from the three child regions, each of
 * which a boolean prop can remove outright.
 *
 * Axes are the prop API (the .vue props block), not the CSS modifier names —
 * `.d-banner--error` / `.d-banner--success` exist in dialtone.css as legacy
 * aliases but are NOT in NOTICE_KINDS and no prop value can reach them.
 */
export default {
  component: 'DtBanner',
  label: 'Banner',
  // The title's text is a property, like the label: `headerText` is a prop in the code.
  textProps: { 'Optional title': 'Title' },
  page: 'Banner',
  figmaSetId: '592:10999',

  axes: {
    // NOTICE_KINDS exactly. `base` maps to `.d-banner--base`, which has no rules of
    // its own and therefore renders the default notice surface — still a distinct
    // colour from the other four, so it is a real value and not a no-op.
    kind: ['base', 'critical', 'info', 'positive', 'warning'],

    // Re-points --notice-color-background/-text/-icon to the inverted/strong
    // surface for every kind. Measured: inverts colour on all 15 nodes of the tree,
    // and each kind x important pair is distinct from every other.
    important: [false, true],

    // Presence of the title box. Driven by the `headerText` prop (equivalently the
    // `header` slot) — not a boolean prop, so it gets a boolean axis of its own the
    // way DtChip's `leading` does. Adds a .d-notice__title <p> and flips the icon
    // wrapper to .d-notice__icon--has-title. Both configurations ship: the default
    // Banner story sets a title, the custom-background story clears it.
    header: [true, false],

    // Booleans that gate real child REGIONS. Kept as variant axes rather than Figma
    // component properties for the same reason DtToggle keeps showIcon/showLabel as
    // axes — a component property's non-default value is never swept (B-11), so as
    // properties these three layouts would go unverified.
    // showIcon: removes the whole .d-notice__icon wrapper (20px + its inline gap).
    showIcon: [true, false],
    // showClose: swaps the 26px icon-only close DtButton for a 1px sr-only button,
    // collapsing .d-notice__actions and widening .d-notice__content by 26px.
    showClose: [true, false],
    // showAction: gates `<slot v-if="showAction">` inside .d-notice__actions. Only
    // observable when the `action` slot is actually filled — see `slots` below.
    showAction: [true, false],
  },

  // Every combination renders, and every one is a shipped configuration: the two
  // colour axes are fully orthogonal (measured across all 10 kind x important
  // pairs), and the three region gates only ever add or remove a box. There is no
  // state axis to make unreachable, either — grepped dialtone.css: neither
  // `.d-notice*` nor `.d-banner*` defines a single :hover, :active or :focus rule.
  // The close button's states belong to DtButton and are covered by the Button set.
  invalid: () => false,

  variantName: c => `kind=${c.kind}, important=${c.important}, header=${c.header}, ` +
    `showIcon=${c.showIcon}, showClose=${c.showClose}, showAction=${c.showAction}`,

  props: c => ({
    kind: c.kind,
    important: c.important,
    showIcon: c.showIcon,
    showClose: c.showClose,
    showAction: c.showAction,
    ...(c.header ? { headerText: 'Optional title' } : {}),
  }),

  // showAction=true with an EMPTY action slot is byte-identical to showAction=false:
  // the prop only guards `<slot />`, it renders no box of its own. Measured — the
  // two anatomies matched exactly. So the slot has to be filled for the axis to mean
  // anything, and left empty for the false half.
  slots: c => (c.showAction ? ['action'] : []),
  // Takes any content, like Notice's action: a native Figma slot with the exemplar button as
  // its default content, not a one-value swap.
  nativeSlots: ['action'],

  // `icon` overrides the kind's default glyph (DtNoticeIcon renders <slot> with the
  // kindToIcon component as its fallback) — an instance swap in Figma, so it is only
  // exercised by the slot pass. `action` is repeated here because slotPass REPLACES
  // `slots` during that pass; without it every showAction=true variant would render
  // an empty actions region and mismatch its Figma variant.
  // No `slotPass`, and no merged set: `showAction` already sweeps the action slot's presence
  // (see `slots` above), so both states are measured by the ordinary sweep. `icon` is
  // deliberately not filled — the set should carry the kind's DEFAULT glyph. Making that
  // swappable needs the icon-instance work, and until then it is correct but not swappable.
  //
  // The merged BOOLEAN model does not apply here at all: with presence already an axis, both
  // renders contain the same slot content, so there is nothing for a toggle to reveal.
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
        state: 'default', loading: false,
      } },
    },
  }),
  // Banner gates the whole DtNoticeIcon on `v-if="showIcon"`, so with showIcon=false
  // the custom icon has nowhere to land and the pass would re-check the plain sweep.
  slotInvalid: c => c.showIcon === false,

  // No `pseudo` / `stateTarget`: there is no state axis (see `invalid`).
  // No `rootClass`: .d-banner__dialog carries its own padding and each region its own
  // gap, so the component needs nothing from the consumer to render as designed. The
  // `d-ps-sticky` class in BannerDefault.story.vue is a Storybook trick to make a
  // position:fixed element visible inside the docs iframe, not component spacing.
};
