/**
 * DtAvatar — packages/dialtone-vue/components/Avatar/
 *
 * Axes come from the PROP API (the .vue props block), not AvatarConstants.js:
 * AVATAR_SIZE_MODIFIERS / AVATAR_PRESENCE_SIZE_MODIFIERS / AVATAR_KIND_MODIFIERS
 * are CSS modifier maps, and AVATAR_KIND_MODIFIERS in particular has no prop
 * behind it at all — `kind` is inferred from which content prop/slot is supplied.
 *
 * Everything asserted below was MEASURED through the verify harness with
 * data-dt-mode="light" set ON THE DOCUMENT (build-spec.mjs does this), not read off the
 * stylesheet. "On the document" is load-bearing: the same attribute on the component's
 * own root element redeclares the light palette for its whole subtree and silently
 * defeats the verifier's dark run.
 */

// 1x1 PNG. The avatar image is object-fit:cover over the whole canvas, so the
// pixels are irrelevant; what matters is that an <img> exists and reaches its
// load event (which flips the canvas to .d-avatar--image-loaded and drops the
// colour underneath). A data URI resolves inside the harness's two-rAF wait —
// an http(s) src does not, and would silently spec the pre-load colour instead.
// The REAL avatar image from the Dialtone docs, served by the harness (it sits next to
// index.html, so vite serves it at `/person.png`).
//
// It used to be a 1x1 data-URI PNG, on the reasoning that the pixels are irrelevant and
// only the <img>'s existence and load event matter. That was true while Figma got nothing:
// B-98 found the Figma node was an empty frame and every numeric check passed it, because
// an <img> has no `background-color` and so both sides agreed about a property neither
// uses. Now that the builder imports the bytes as an IMAGE fill, the pixels are the thing
// being checked, and a 1x1 red dot would verify nothing anyone cares about.
//
// A LOCAL path, not the https URL: an http(s) src does not resolve inside the harness's
// two-rAF wait, and the spec would silently capture the pre-load state.
const AVATAR_IMAGE = '/person.png';

// `group` is a NUMBER prop, but only three renders come out of it: one digit,
// two digits, and the "99+"/"9+" overflow. formattedGroup() collapses everything
// else onto those, so the axis carries the buckets and props() maps them back.
const GROUP_COUNTS = { single: 3, double: 12, triple: 120 };

// There is no default colour: with no `seed`, no `family` and no `variant`,
// computedFamily/computedVariant call getRandomFamilyVariant(undefined), which
// falls through to Math.random(). Every combo therefore pins family+variant, and
// non-colour combos pin them HERE so the run is reproducible.
const ANCHOR_FAMILY = 8;
const ANCHOR_VARIANT = 4;

const isAnchorColor = c => c.family === ANCHOR_FAMILY && c.variant === ANCHOR_VARIANT;

// The 12x10 colour grid is swept once, against an otherwise-plain avatar — the
// badge/`decoration` pattern. Crossing it with the other seven axes would add
// 119 pixel-identical copies of every geometry variant.
const isColorBaseline = c => Number(c.size) === 300 && c.content === 'initials'
  && c.presence === '' && c.group === 'none' && c.overlay === 'none'
  && c.deactivated === false && c.state === 'default';

export default {
  component: 'DtAvatar',
  label: 'Avatar',
  page: 'Avatar',
  figmaSetId: '286:26996',

  axes: {
    // Numeric scale only. AVATAR_SIZE_MODIFIERS also carries xs/sm/md/lg/xl,
    // which the prop doc marks deprecated and which alias 100/200/300/500/600.
    size: [100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900],

    // No single prop behind this: the canvas paints EITHER an <img> (imageSrc),
    // OR the #icon slot, OR the initials span, chosen by v-if/v-else-if, and each
    // is a different element with different geometry. `iconOnly` is folded in as a
    // fourth value rather than kept as its own boolean because it only ever ships
    // with the icon slot (it strips the canvas colour so a bare glyph shows) and
    // as an independent axis it would double every non-icon variant with an
    // identical twin.
    content: ['initials', 'icon', 'iconOnly', 'image'],

    // Renders a real DtPresence child AND masks a notch out of the canvas.
    presence: ['', 'busy', 'away', 'offline', 'active', 'dnd'],

    group: ['none', 'single', 'double', 'triple'],

    // Full-cover scrim over the canvas. The two fillings are mutually exclusive
    // in the template (overlayIcon slot wins over overlayText), so one axis.
    overlay: ['none', 'text', 'icon'],

    // Hue offset, 30 degrees apart, added to the theme's --dt-avatar-anchor-hue.
    family: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

    // Lightness/chroma pair. Measured distinct at every step, and it also flips
    // --avatar-color-text from foreground-light to foreground-dark between 5 and 6.
    variant: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],

    deactivated: [false, true],

    // `hover` is absent on purpose: the stylesheet has NO .d-avatar:hover rule of
    // any kind, and forcing :hover was measured byte-identical to rest. `active`
    // is absent because .d-avatar--clickable:active and :focus-visible are the
    // SAME declaration block — measured byte-identical, so it would be a duplicate.
    state: ['default', 'focus'],
  },

  invalid: (c) => {
    const size = Number(c.size);

    // ── colour ──────────────────────────────────────────────────────────────
    // data-avatar-family/-variant are only emitted when the avatar is not
    // icon-typed and not iconOnly, and an image that has loaded blanks the
    // colour to transparent. Measured: family 1 vs 8 and variant 0 vs 4 are
    // byte-identical for content = icon, iconOnly and image.
    if (!isAnchorColor(c) && (c.content !== 'initials' || !isColorBaseline(c))) return true;

    // ── presence ────────────────────────────────────────────────────────────
    // DtPresence is rendered only when AVATAR_PRESENCE_SIZE_MODIFIERS[size]
    // exists, i.e. sizes 100-500. At 600+ the class lands but no dot is drawn:
    // measured, presence=busy and presence=dnd are byte-identical at size 600.
    if (c.presence !== '' && size > 500) return true;
    // showGroup suppresses the presence node outright (v-if="… && !showGroup").
    if (c.presence !== '' && c.group !== 'none') return true;

    // ── group ───────────────────────────────────────────────────────────────
    // The count sits in a notch masked out of the canvas by --avatar-mask, which
    // is only defined for sizes 100-500. Above that the mask is invalid-at-
    // computed-value-time, the notch never appears and the badge overlaps the
    // artwork — a render the docs never show.
    if (c.group !== 'none' && size > 500) return true;
    // formattedGroup() caps at two digits below size 300, so 120 renders as "9+",
    // exactly what 12 renders. Measured byte-identical at size 200.
    if (c.group === 'triple' && size < 300) return true;
    // .d-avatar--group.d-avatar--size-100 > .d-avatar__canvas is display:none —
    // only the count survives. Measured: all four content values are pixel-
    // identical there (canvas box 0x0), so only the anchor content is kept.
    if (c.group !== 'none' && size === 100 && c.content !== 'initials') return true;

    // ── overlay ─────────────────────────────────────────────────────────────
    // The scrim covers the canvas edge to edge; swept once over a plain avatar.
    if (c.overlay !== 'none' && (c.content !== 'initials' || c.presence !== ''
      || c.group !== 'none' || c.deactivated || c.state !== 'default')) return true;

    // ── deactivated ─────────────────────────────────────────────────────────
    // Additive: a saturate(0) filter plus a white ::after scrim on the canvas.
    // Swept across size x content, which is where it actually reads differently.
    if (c.deactivated && (c.presence !== '' || c.group !== 'none' || c.state !== 'default')) return true;

    // ── state ───────────────────────────────────────────────────────────────
    // The ring is a box-shadow on the ROOT, so it is identical for every content;
    // it does change with size (it follows --avatar-border-radius) and with
    // presence/group, which have their own .d-avatar--clickable rules.
    if (c.state === 'focus' && c.content !== 'initials') return true;

    return false;
  },

  variantName: c => `size=${c.size}, content=${c.content}, presence=${c.presence || 'none'}, `
    + `group=${c.group}, overlay=${c.overlay}, family=${c.family}, variant=${c.variant}, `
    + `deactivated=${c.deactivated}, state=${c.state}`,

  props: (c) => {
    const p = {
      // MODE PIN. Not a component prop — a fallthrough attribute, and the only
      // config-reachable way to set one.
      //
      // --dt-avatar-anchor-hue is the pivot of the whole OKLCH colour system, and
      // it is defined TWICE with different types:
      //   dialtone-default-theme.css  :root                  -> var(--dt-shell-base-color-accent)   (a COLOR)
      //   tokens-dp-colors.css        [data-dt-mode="light"]  -> 287.4                               (a NUMBER)
      // Only the second is the hue degrees the stylesheet expects. With no mode
      // attribute anywhere the :root colour wins, `calc(<color> + 210)` is invalid
      // at computed-value time, the whole oklch() is thrown away, and
      // --avatar-color-background falls back to TRANSPARENT.
      //
      // build-spec.mjs never calls window.__setMode (verify-components.mjs does,
      // which is why this config's measurements were right and the first spec was
      // not). Measured without it: every one of the 120 family x variant combos
      // painted rgba(0,0,0,0) — the colour sweep was 120 identical colourless
      // copies. With it: family=8,variant=4 -> oklch(0.64 0.18 137.4),
      // family=1,variant=0 -> oklch(0.45 0.08 287.4).
      // `data-dt-mode` is NOT set here any more. Setting it as a prop puts the attribute
      // on the component's own root element, and `[data-dt-mode="light"]` there redeclares
      // the whole light palette for that subtree — beating the document's dark palette.
      // The verifier's dark run therefore measured this component in light and reported
      // 366 findings against Figma values that were correct. build-spec.mjs now sets the
      // mode on the document, which is what the workaround was really reaching for.
      size: Number(c.size),
      family: c.family,
      variant: c.variant,
      presence: c.presence,
      deactivated: c.deactivated,
    };
    if (c.content === 'initials' || c.content === 'image') p.fullName = 'Person Avatar';
    if (c.content === 'image') { p.imageSrc = AVATAR_IMAGE; p.imageAlt = ''; }
    if (c.content === 'iconOnly') p.iconOnly = true;
    if (c.group !== 'none') p.group = GROUP_COUNTS[c.group];
    if (c.overlay === 'text') p.overlayText = '+3';
    // `interactive` is deliberately NOT an axis. Measured against every other
    // axis value at rest, interactive=false and interactive=true paint the same:
    // the only deltas are the element tag (div -> button), a border-radius on a
    // root that has no background and no stroke, a border-colour behind a
    // zero-width border, and the line-height of three boxes that paint no text.
    // Its one real effect is making the focus ring reachable, so it is forced on
    // exactly when focus is under test.
    if (c.state === 'focus') p.interactive = true;
    return p;
  },

  slots: c => [
    ...(c.content === 'icon' || c.content === 'iconOnly' ? ['icon'] : []),
    ...(c.overlay === 'icon' ? ['overlayIcon'] : []),
  ],

  pseudo: c => (c.state === 'focus' ? ['focus-visible'] : []),

  // No stateTarget: .d-avatar--clickable IS the root element (the component
  // swaps <div> for <button> in place), so the default #root > * is correct.

  // .d-avatar is `display: flex` with no width of its own, so mounted alone it
  // stretches to the viewport — measured 1200px wide around a 32px canvas. Every
  // shipped usage puts it inside a flex row (every doc example uses dt-stack),
  // where it hugs its canvas. Without this the spec would hand Figma a
  // 1200px-wide root frame for every static variant. See D-15.
  rootClass: 'd-w-fit-content',
};
