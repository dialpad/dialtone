/**
 * Rules for mapping CSS box-model facts onto Figma's, shared by every stage.
 *
 * These predicates MUST be identical in the spec builder, the generic builder and
 * the verifier. When the border fold (D-11) lived in two places it drifted, and the
 * verifier then agreed with a Figma file that was 2px wrong — two errors that
 * cancelled and read as correctness. One definition, three importers.
 */

/**
 * Can this node's CSS margin be folded into its OWN Figma frame padding?
 *
 * Figma auto-layout has no per-child margin. Folding a margin into the child's own
 * padding is visually identical only while the child paints nothing itself — the
 * moment it has a background, a border or a shadow, the fold would grow the painted
 * box rather than the space around it.
 *
 * Notice's icon is the motivating case: `margin-inline-end: 12px` and
 * `margin-block-start: 2px` on an unpainted box. Uncaptured, Notice lost 28px of
 * spacing across its variants while every compared property read green.
 *
 * CALLERS MUST NOT FOLD A COORDINATE-PLACED CHILD. Inside a Figma frame with
 * layoutMode NONE every child is positioned by an offset measured from the browser,
 * and that offset ALREADY includes the child's margins. Folding as well would count
 * the same space twice. Folding is only meaningful where auto-layout does the
 * stacking and there is no coordinate to carry the margin.
 */
export function marginFoldable (style) {
  const alpha = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) return c && c !== 'transparent' && c !== 'none' ? 1 : 0;
    const parts = m[1].split(/[,/\s]+/).filter(Boolean);
    return parts.length > 3 ? parseFloat(parts[3]) : 1;
  };
  // A NEGATIVE margin pulls content outward. Figma padding cannot go below zero —
  // the value is rejected outright — so this is not foldable in either direction.
  const m = margins(style);
  if (m.top < 0 || m.right < 0 || m.bottom < 0 || m.left < 0) return false;
  const painted = alpha(style.backgroundColor) >= 0.005
    || (parseFloat(style.borderTopWidth) > 0 && alpha(style.borderTopColor) >= 0.005)
    || (style.boxShadow && style.boxShadow !== 'none');
  return !painted;
}

/** The four margins as numbers, zero when absent. */
export function margins (style) {
  const n = (v) => (typeof v === 'string' && v.endsWith('px') ? parseFloat(v) : 0) || 0;
  return {
    top: n(style.marginTop), right: n(style.marginRight),
    bottom: n(style.marginBottom), left: n(style.marginLeft),
  };
}
export const hasMargin = (m) => !!(m.top || m.right || m.bottom || m.left);

/**
 * An outline maps to an outset DROP_SHADOW with zero blur and zero offset — the same
 * shape Dialtone's `shadow/focus` token already uses. `outline-offset` pushes the
 * ring further out, so the spread is width + offset.
 *
 * `outline` was exempted from comparison on the belief that Dialtone always paints
 * focus with box-shadow. Checkbox's checked focus ring is a real outline, so the
 * exemption was an assumption about the design system, not an observation of it.
 */
export function outlineAsShadow (style) {
  const w = parseFloat(style.outlineWidth) || 0;
  if (!w || style.outlineStyle === 'none' || !style.outlineColor) return null;
  const off = parseFloat(style.outlineOffset) || 0;
  // A NEGATIVE outline-offset draws the ring INSIDE the border box. Checkbox and
  // Radio both use `outline-offset: calc(width * -1)`, so `spread = w + off` came out
  // 0 — an outset drop shadow that paints absolutely nothing, which is what the
  // side-by-side render exposed. Drawn inside, it is an INNER_SHADOW of the outline's
  // own width.
  if (off < 0) return { inset: true, spread: w, color: style.outlineColor, width: w, offset: off };
  return { inset: false, spread: w + off, color: style.outlineColor, width: w, offset: off };
}

/**
 * A box with no children, no text, no glyph and zero area shows nothing at all.
 *
 * Checkbox's `base-input__messages` is 1176x0 and empty — as a Figma node it became
 * a 1176x1 phantom frame, because a frame cannot be zero-height.
 *
 * RECURSIVE, and computed from the DOM tree alone so the spec builder and the
 * verifier reach the same answer. A parent whose every child is dropped becomes empty
 * itself; a single non-recursive pass left those behind. Dropping must happen on BOTH
 * sides or the child counts disagree.
 */
export function paintsNothing (n) {
  if (n.text || n.svg) return false;
  if ((n.pseudos || []).length) return false;
  const kids = (n.children || []).filter(c => c.style && c.style.display !== 'none' && !paintsNothing(c));
  if (kids.length) return false;
  const b = n.box || {};
  return !(b.w > 0 && b.h > 0);
}

/**
 * Fold the margins of PAINTED children into the parent's own auto-layout numbers.
 *
 * `marginFoldable` handles the easy half: an unpainted child absorbs its own margin
 * as padding. A child that paints a background cannot — growing its padding would
 * grow what is painted. But the space is still real, so it has to land somewhere,
 * and the only expressible home is the parent: a leading margin on the first child
 * is parent padding, a trailing margin on the last child is parent padding, and
 * anything between siblings is itemSpacing.
 *
 * Badge's decorative dot is the motivating case — a 2px inline-start margin on a
 * painted 8px dot, across 44 variants. Left as a bare allowance it read as a
 * deliberate divergence; it was simply 2px missing from every one of them.
 *
 * itemSpacing is a single number for every gap, so non-uniform interior margins are
 * genuinely unrepresentable and are reported rather than averaged away. Cross-axis
 * margins would shift one child only, which auto-layout cannot express at all.
 *
 * CALLERS MUST ONLY USE THIS ON AN AUTO-LAYOUT PARENT — see marginFoldable.
 */
export function parentMarginFold (style, children) {
  const row = style.flexDirection !== 'column';
  const out = { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0, itemSpacing: 0, unrepresentable: [] };
  const kids = children || [];
  const interior = [];
  kids.forEach((c, i) => {
    if (!c || !c.style || marginFoldable(c.style)) return;   // handled by the child itself
    const m = margins(c.style);
    if (!hasMargin(m)) return;
    const first = i === 0, last = i === kids.length - 1;
    const [lead, trail, crossA, crossB] = row
      ? [m.left, m.right, m.top, m.bottom]
      : [m.top, m.bottom, m.left, m.right];
    if (first) out[row ? 'paddingLeft' : 'paddingTop'] += lead; else if (lead) interior.push(lead);
    if (last) out[row ? 'paddingRight' : 'paddingBottom'] += trail; else if (trail) interior.push(trail);
    if (crossA || crossB) {
      out.unrepresentable.push(`${c.classes ? c.classes.join('.') : 'child'}: cross-axis margin ${crossA}/${crossB}px shifts one child only`);
    }
  });
  if (interior.length) {
    const uniq = [...new Set(interior)];
    if (uniq.length === 1) out.itemSpacing = uniq[0];
    else out.unrepresentable.push(`interior margins differ (${uniq.join(', ')}px) — itemSpacing is one number for every gap`);
  }
  return out;
}

/**
 * A fully TRANSPARENT border is not an absence when the node also carries an inset
 * box-shadow.
 *
 * CSS clips an inset shadow to the PADDING box, so a `border: 1px solid transparent`
 * pushes the ring 1px inward and lets the background paint through the border band.
 * DtRadio's checked dot is the case: purple background, `border: 1px rgba(0,0,0,0)`,
 * `box-shadow: inset 0 0 0 2px <near-white>` — which paints 1px purple, 2px white,
 * then the purple centre. Dropping the transparent border (colour alpha 0 reads as
 * "nothing painted") lost the 1px offset, so Figma started the white ring at the
 * very edge and the outer purple band disappeared.
 *
 * Figma's INNER_SHADOW always grows inward from the SHAPE edge and has no start
 * offset, and a transparent stroke does not move it — both measured on isolated
 * nodes: `spread 2` alone gives white 0–2px, and adding a transparent 1px inside
 * stroke gives byte-identical bands. What does reproduce the CSS render is a stroke
 * painted in the BACKGROUND colour at the border width plus `spread + borderWidth`:
 * measured 1px purple, 2px white, purple centre — exactly the browser.
 *
 * Returns the border width to fold, or 0 when the rule does not apply.
 */
export function transparentBorderFoldOf ({ borderWidth, borderAlpha, hasInsetShadow, hasBackground }) {
  if (!borderWidth || !hasInsetShadow) return 0;
  // Only when the border painted NOTHING — a visible border is already a real stroke.
  if (borderAlpha >= 0.005) return 0;
  // The background is what shows through the transparent band; with nothing to show,
  // there is no band to reproduce.
  if (!hasBackground) return 0;
  return borderWidth;
}

/** Spec-shaped wrapper. The verifier calls transparentBorderFoldOf with DOM values. */
export function transparentBorderFold (props) {
  return transparentBorderFoldOf({
    /**
     * PER SIDE. This read `props.strokeWeight`, a key that stopped existing when the widths
     * became per-side — so it has been reading `undefined` and returning 0 ever since, and
     * the fold silently stopped happening on every component that needed it.
     *
     * The cost: DtButton's focus ring and DtRadio's, 620 findings between them, all of them
     * Figma having no stroke where the browser has a transparent one holding an inset
     * shadow off the edge. A renamed key that fails by returning a falsy value is worse than
     * one that throws.
     */
    borderWidth: Math.max(
      ((props.strokeTopWeight || {}).value) || 0,
      ((props.strokeRightWeight || {}).value) || 0,
      ((props.strokeBottomWeight || {}).value) || 0,
      ((props.strokeLeftWeight || {}).value) || 0),
    // build-spec drops a transparent border colour entirely, so its absence IS alpha 0.
    borderAlpha: props.borderColor ? 1 : 0,
    hasInsetShadow: !!(props.shadow && props.shadow.inset),
    hasBackground: !!props.background,
  });
}

/**
 * Does a pseudo-element actually PAINT a glyph?
 *
 * `content` is read as a literal string, so `content: ' '` — the idiom for "this
 * pseudo exists to paint a box, not a character" — arrives as a one-space literal and
 * a truthiness test counts it as a glyph. Every one of DtToggle's 72 variants grew a
 * TEXT child named `glyph` holding a space with no geometry: a layer that paints
 * nothing and that Figma shows as an empty text node.
 *
 * The motivating real case is the opposite one and must keep working: FilterPill's
 * `::before` is a literal "=" with no background at all, so requiring a background
 * here would drop the only thing that pseudo exists to draw. Whitespace is the
 * distinction, not emptiness.
 */
export function pseudoPaintsGlyph (pe) {
  return !!(pe.text && pe.text.trim()) || !!pe.svg;
}

/**
 * Resolve a PERCENTAGE border-radius to the pixels Figma needs.
 *
 * `getComputedStyle` keeps a percentage radius as written, so `px()` returns null and
 * every consumer that reads it silently sees "no radius". The element path in the spec
 * builder already resolved this for DtChip's circular close button; the pseudo path did
 * not, so DtToggle's knob — `content: " "`, `border-radius: 50%` — was built square.
 * The verifier skipped it on BOTH paths (a null expectation compares nothing), which is
 * why a square knob could never be reported.
 *
 * CSS resolves each corner against its own axis; Figma has one number per corner, so a
 * non-square box can only be approximated. Using the SHORTER side keeps a "50% = fully
 * round" box exactly round, which is what the idiom always means in Dialtone.
 * Returns null when the radius is not a percentage.
 */
export function resolvePercentRadius (radius, w, h) {
  if (!/%\s*$/.test(radius || '')) return null;
  const pct = parseFloat(radius) / 100;
  const shortest = Math.min(w || 0, h || 0);
  if (!pct || !shortest) return null;
  return +(pct * shortest).toFixed(2);
}

/**
 * The children the browser actually FLOWS — the only ones auto-layout has to place.
 *
 * Two comparisons need this same answer: whether a `gap` has any sibling to sit
 * between, and whether the children overlap. Defining it once means those two cannot
 * come to different conclusions about what counts as a child.
 */
export function flowChildren (dom) {
  return (dom.children || []).filter(c => c.style.display !== 'none' && !paintsNothing(c)
    && c.style.position !== 'absolute' && c.rel && c.box);
}

/**
 * THE children a Figma frame gets for one DOM node, in Figma's order.
 *
 * Membership is not obvious and it is not the DOM's child list. A pseudo-element that
 * paints becomes a child; a `background-image` glyph becomes a child with no DOM node
 * at all; an empty wrapper that paints nothing becomes no child; and an <svg> is
 * imported whole, so its internals are never children.
 *
 * This is the single authority because it used to be answered twice. `audit-provenance`
 * walked the DOM itself and reached different conclusions — it kept sr-only spans, kept
 * empty message wrappers, missed synthesised glyphs and descended into SVG internals.
 * Children are paired by index, so each disagreement compared unrelated nodes: a glyph's
 * fill against a span's background, and 692 structural mismatches across nine components
 * once the pairing was finally asserted (B-103, B-105).
 *
 * Returns the PARTS rather than one flat list, because each consumer decorates them
 * differently — the values pass attaches expected offsets, the identity pass attaches
 * CDP selectors — while membership and order stay fixed here.
 *
 * @param col  a CSS-colour parser returning {r,g,b,a}; the caller owns it.
 */
export function figmaChildParts (dom, col) {
  const pseudos = (dom.pseudos || []).filter(pe =>
    (pe.style.backgroundColor && (col(pe.style.backgroundColor)?.a ?? 0) >= 0.005) ||
    (pe.style.boxShadow && pe.style.boxShadow !== 'none') ||
    pseudoPaintsGlyph(pe));
  const gr = dom.svgRect;
  return {
    // A glyph painted through background-image has no DOM node; Figma imports it as a
    // vector child, so it has to be counted as one.
    glyphRect: (dom.svg && dom.tag !== 'svg' && gr && !gr.unrepresentable) ? gr : null,
    unrepresentableGlyph: (gr && gr.unrepresentable) || null,
    before: pseudos.filter(pe => pe.pseudo === 'before'),
    // `display: none` children still exist in the DOM but paint nothing — the
    // indeterminate toggle hides its glyph that way. Same for an empty message wrapper.
    elements: (dom.children || []).filter(c => c.style.display !== 'none' && !paintsNothing(c)),
    after: pseudos.filter(pe => pe.pseudo === 'after'),
  };
}

/**
 * Which Figma font family a CSS font stack resolves to.
 *
 * SHARED, because two places need the same answer and disagreed: the builder wrote every
 * text node in SF Pro Text while the values pass expected the family this map names, so
 * DtCodeblock's monospace label reported 12 findings that were entirely the builder not
 * knowing what the check knew.
 *
 * What this can and cannot answer: CSS names a STACK and which member the browser actually
 * used is not exposed, so the first resolvable entry wins. A stated assumption, not a
 * measurement.
 */
export const STACK_TO_FIGMA = {
  '-apple-system': 'SF Pro Text', blinkmacsystemfont: 'SF Pro Text', 'sf pro': 'SF Pro Text',
  'season sans': 'Season Sans', 'season mix': 'Season Mix',
  'sfmono-regular': 'SF Mono', 'sf mono': 'SF Mono',
};

/** The Figma family a CSS `font-family` value resolves to, or null if none is recognised. */
export function figmaFamilyFor (cssFontFamily) {
  const stack = String(cssFontFamily || '').split(',')
    .map(x => x.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const first = stack.find(f => STACK_TO_FIGMA[f]);
  return first ? STACK_TO_FIGMA[first] : null;
}
