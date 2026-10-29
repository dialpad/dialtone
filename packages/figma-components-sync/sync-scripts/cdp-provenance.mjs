/**
 * Token provenance, resolved by the browser.
 *
 * `css-provenance.mjs` reimplements the CSS cascade to answer "which --dt-* token
 * backs this property?". Every reimplementation bug it had produced a plausible
 * wrong answer that no value-comparing verifier could see: `.d-link[disabled]`
 * matched every link, so a default link resolved to --dt-color-link-disabled (H-9).
 *
 * Chrome already knows. `CSS.getMatchedStylesForNode` returns the rules that
 * actually matched, in cascade order, with declarations as authored — including
 * `var(--dt-…)` references and the ancestors' custom properties. That is the same
 * engine that paints the pixels, so it cannot disagree with what renders.
 *
 * Used as an ORACLE: independent of our own parser, so it catches derivation
 * errors, not just write errors.
 */
import { fileURLToPath } from 'url';


/** Properties whose declared token we care about, mapped to Figma's vocabulary. */
export const PAINTED = {
  color: 'textColor',
  'background-color': 'background',
  'border-color': 'borderColor',
  'border-top-color': 'borderColor',
  // `column-gap` is listed FIRST so the `gap` shorthand, iterated later, wins. CDP
  // reports both, and the shorthand is where the author's var() reference survives —
  // reading the longhand last discarded the token for every utility-class gap.
  'column-gap': 'itemSpacing',
  gap: 'itemSpacing',
  // The CROSS-axis gap of a wrapping row, which Figma calls counterAxisSpacing. The `gap`
  // shorthand sets both, so on most components this resolves to the same token as
  // itemSpacing — but a component that sets them separately would otherwise have the cross
  // gap baked as a literal.
  'row-gap': 'counterAxisSpacing',
  'font-size': 'fontSize',
  'font-weight': 'fontWeight',
  'line-height': 'lineHeight',
  'box-shadow': 'effect',
  // Checkbox and Radio draw their checked focus ring with a real `outline`, not a
  // box-shadow. Absent from this map, no token was ever captured and the colour was
  // baked as a light literal — the 8 dark `outlineColor` findings.
  'outline-color': 'outlineColor',
  'outline-width': 'outlineWidth',
  // `.d-chip--disabled { opacity: var(--dt-opacity-1000) }` — the value was being
  // captured but never resolved to its token, so every disabled dimming was baked.
  opacity: 'opacity',
  /**
   * STRUCTURAL SIZE.
   *
   * Dialtone splits its numeric scales by role: `--dt-layout-*` and `--dt-icon-size-*`
   * size a box, `--dt-spacing-*` is whitespace between things. Padding and gap were read
   * from the start, so the whitespace half arrived in Figma as variables — width and
   * height never were, so every structural size was baked as a literal. Across the whole
   * synced library `layout/*` reached Figma 36 times, and all 36 were a corner radius on
   * one component: the scale's actual home had no route in at all.
   *
   * The logical property is listed after the physical one for each axis so that a
   * component declaring both ends up with the logical author's intent, which is what
   * Dialtone's own CSS writes (`inline-size`, not `width`).
   */
  width: 'width',
  'inline-size': 'width',
  height: 'height',
  'block-size': 'height',
  'min-width': 'minWidth',
  'min-inline-size': 'minWidth',
  'min-height': 'minHeight',
  'min-block-size': 'minHeight',
};

/**
 * BORDER WIDTH PER SIDE, RADIUS PER CORNER.
 *
 * One width and one corner used to stand for all four. That held while every synced
 * component was symmetrical and broke on the first that is not: DtSplitButton's halves each
 * declare `border-inline-end: 0`, `border-start-end-radius: 0` and `border-end-end-radius: 0`,
 * so reading `border-top-width` and `border-top-left-radius` described a quarter of the
 * geometry and assumed the rest matched. 140 variants came out with a phantom right border
 * and 115 with the wrong corners.
 *
 * Logical properties resolve to physical sides for LTR horizontal-tb, which is the same
 * assumption the PADDING map below already makes.
 */
const SIDES = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'];
const CORNERS = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];

/** Longhands and multi-value shorthands. Values distribute by CSS's 1-to-4 rule. */
const BORDER_WIDTH = {
  'border-width': SIDES,
  'border-top-width': ['strokeTopWeight'],
  'border-right-width': ['strokeRightWeight'],
  'border-bottom-width': ['strokeBottomWeight'],
  'border-left-width': ['strokeLeftWeight'],
  'border-block-width': ['strokeTopWeight', 'strokeBottomWeight'],
  'border-inline-width': ['strokeLeftWeight', 'strokeRightWeight'],
  'border-block-start-width': ['strokeTopWeight'],
  'border-block-end-width': ['strokeBottomWeight'],
  'border-inline-start-width': ['strokeLeftWeight'],
  'border-inline-end-width': ['strokeRightWeight'],
};

/** `border-inline-end: 0` sets width, style and colour at once; the width is the first
 *  part that is not a style keyword. This is the form DtSplitButton actually uses. */
const BORDER_SHORTHAND = {
  border: SIDES,
  'border-top': ['strokeTopWeight'],
  'border-right': ['strokeRightWeight'],
  'border-bottom': ['strokeBottomWeight'],
  'border-left': ['strokeLeftWeight'],
  'border-block': ['strokeTopWeight', 'strokeBottomWeight'],
  'border-inline': ['strokeLeftWeight', 'strokeRightWeight'],
  'border-block-start': ['strokeTopWeight'],
  'border-block-end': ['strokeBottomWeight'],
  'border-inline-start': ['strokeLeftWeight'],
  'border-inline-end': ['strokeRightWeight'],
};

const BORDER_RADIUS = {
  'border-radius': CORNERS,
  'border-top-left-radius': ['topLeftRadius'],
  'border-top-right-radius': ['topRightRadius'],
  'border-bottom-right-radius': ['bottomRightRadius'],
  'border-bottom-left-radius': ['bottomLeftRadius'],
  'border-start-start-radius': ['topLeftRadius'],
  'border-start-end-radius': ['topRightRadius'],
  'border-end-end-radius': ['bottomRightRadius'],
  'border-end-start-radius': ['bottomLeftRadius'],
};

/** CSS distributes 1, 2, 3 or 4 values across four slots. Anything else repeats the first. */
function distribute (parts, keys) {
  if (keys.length !== 4) return keys.map((k, i) => [k, parts[i] ?? parts[0]]);
  const [a, b, c, d] = parts;
  const four = parts.length >= 4 ? [a, b, c, d]
    : parts.length === 3 ? [a, b, c, b]
      : parts.length === 2 ? [a, b, a, b]
        : [a, a, a, a];
  return keys.map((k, i) => [k, four[i]]);
}

/** padding needs axis-aware handling, so it is resolved separately */
const PADDING = {
  padding: ['paddingV', 'paddingH'],
  // Mapped to SIDES, not to an axis, because both take TWO values —
  // `padding-inline: <start> <end>` — and collapsing them to one axis key recorded only
  // the start and let the axis fallback copy that token onto the end side too. That is
  // how `.d-chip__label` came to claim `spacing/75` (6px) for a padding of 18px: its end
  // padding is `calc(var(--chip-close-size) + var(--dt-spacing-25))`, which correctly has
  // no single token, and the start token was copied over it.
  'padding-block': ['paddingTop', 'paddingBottom'],
  'padding-inline': ['paddingLeft', 'paddingRight'],
  'padding-top': ['paddingTop'],
  'padding-bottom': ['paddingBottom'],
  'padding-left': ['paddingLeft'],
  'padding-right': ['paddingRight'],
  'padding-block-start': ['paddingTop'],
  'padding-block-end': ['paddingBottom'],
  'padding-inline-start': ['paddingLeft'],
  'padding-inline-end': ['paddingRight'],
};

/**
 * Fold a list of matched rules into one winning declaration per property.
 * CDP returns matchedCSSRules in increasing precedence, so later entries win;
 * this already accounts for specificity, source order and @layer.
 */
function foldRules (matchedCSSRules = []) {
  const out = {};
  for (const m of matchedCSSRules) {
    // honour which selectors in the list actually matched
    if (Array.isArray(m.matchingSelectors) && m.matchingSelectors.length === 0) continue;
    const style = m.rule && m.rule.style;
    if (!style) continue;
    for (const d of style.cssProperties || []) {
      if (!d.name || d.value === undefined) continue;
      if (d.disabled) continue;
      // `parsedOk === false` marks a declaration the engine rejected
      if (d.parsedOk === false) continue;
      // CDP keeps `!important` inside the value string, which breaks the
      // "exactly one var() reference" test and silently drops the token for every
      // utility-class declaration.
      out[d.name] = { value: String(d.value).replace(/\s*!important\s*$/i, ''),
                      selector: (m.rule.selectorList || {}).text || '' };
    }
  }
  return out;
}

/**
 * Read one node's declarations plus its ancestors', so custom properties that a
 * parent declares and a child consumes resolve correctly. `inherited` comes back
 * nearest-ancestor-first.
 */
export async function matchedFor (cdp, nodeId) {
  const ms = await cdp.send('CSS.getMatchedStylesForNode', { nodeId });
  const own = foldRules(ms.matchedCSSRules);
  for (const d of (ms.inlineStyle && ms.inlineStyle.cssProperties) || []) {
    if (d.name && d.value !== undefined && !d.disabled) own[d.name] = { value: d.value, selector: '[inline]' };
  }
  const chain = ((ms.inherited || []).map(entry => {
    const folded = foldRules(entry.matchedCSSRules);
    for (const d of (entry.inlineStyle && entry.inlineStyle.cssProperties) || []) {
      if (d.name && d.value !== undefined && !d.disabled) folded[d.name] = { value: d.value, selector: '[inline]' };
    }
    return folded;
  }));
  return { own, chain };
}

/**
 * Declared tokens for a PSEUDO-element (::before / ::after).
 * CDP returns these under `pseudoElements` on the owning node; custom properties
 * still resolve through the owner and its ancestors.
 */
export async function tokensForPseudo (cdp, nodeId, pseudoType) {
  const ms = await cdp.send('CSS.getMatchedStylesForNode', { nodeId });
  const entry = (ms.pseudoElements || []).find(p => p.pseudoType === pseudoType);
  if (!entry) return { tokens: {}, computed: {} };
  const own = foldRules(entry.matches);
  const ownerOwn = foldRules(ms.matchedCSSRules);
  const chain = [ownerOwn, ...(ms.inherited || []).map(e => foldRules(e.matchedCSSRules))];
  return resolveDeclared(own, chain);
}

/** Look a custom property up on the node, then outward through its ancestors. */
function lookupVar (name, own, chain) {
  if (own[name]) return own[name].value;
  for (const anc of chain) if (anc[name]) return anc[name].value;
  return null;
}

/**
 * Expand a declared value until only --dt-* references remain.
 * Returns { token } when the value is exactly one --dt-* reference, otherwise
 * { computed, tokens } — a colour-mix, a calc() or a relative colour, where no
 * single token backs the result.
 */
/**
 * `oklch(from <src> l c h / <a>)` with IDENTITY channels is just `<src>`.
 *
 * DtText writes `color: oklch(from var(--text-tone) l c h / var(--fco, alpha))`,
 * with `--text-tone` defaulting to `currentColor`. That is not a single var(--dt-*)
 * reference, so expand() called it computed and EVERY piece of text inside every
 * component nesting DtText lost its colour token — 120 of 120 in Notice, correct in
 * light and silently wrong in dark. The channels here are identity and the alpha is
 * an unset var falling back to `alpha`, so the value is exactly its source.
 */
const IDENTITY_CHANNELS = { oklch: 'l c h', oklab: 'l a b', lch: 'l c h', lab: 'l a b',
                            hsl: 'h s l', rgb: 'r g b', hwb: 'h w b' };
function unwrapIdentityRelative (v, own, chain) {
  const m = /^(oklch|oklab|lch|lab|hsl|rgb|hwb)\(\s*from\s+([\s\S]+?)\s+([a-z]\s+[a-z]\s+[a-z])\s*(?:\/\s*([\s\S]+?)\s*)?\)$/i.exec(v.trim());
  if (!m) return null;
  const [, fn, src, channels, alpha] = m;
  if (channels.replace(/\s+/g, ' ').toLowerCase() !== IDENTITY_CHANNELS[fn.toLowerCase()]) return null;
  if (alpha != null) {
    const a = alpha.trim();
    const viaVar = /^var\(\s*(--[a-z0-9-]+)\s*,\s*alpha\s*\)$/i.exec(a);
    const unsetFallback = viaVar && lookupVar(viaVar[1], own, chain) == null;
    if (!(/^alpha$/i.test(a) || unsetFallback)) return null;   // a real alpha change
  }
  return src.trim();
}

/** System colours have no token and no Figma equivalent; they must not be baked. */
export const SYSTEM_COLORS = new Set(['canvastext', 'canvas', 'linktext', 'visitedtext',
  'activetext', 'buttonface', 'buttontext', 'buttonborder', 'field', 'fieldtext',
  'highlight', 'highlighttext', 'selecteditem', 'selecteditemtext', 'mark', 'marktext',
  'graytext', 'accentcolor', 'accentcolortext']);

export function expand (value, own, chain) {
  let v = value;
  let guard = 0;
  while (/var\(\s*--(?!dt-)/.test(v) && guard++ < 16) {
    v = v.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,([^)]*))?\)/gi, (m, name, fallback) => {
      if (name.startsWith('--dt-')) return m;
      const found = lookupVar(name, own, chain);
      if (found != null) return found;
      return fallback != null ? fallback.trim() : `«${name}»`;
    });
  }
  let trimmed = v.trim();
  // Peel identity relative-colour wrappers until a plain value remains.
  for (let i = 0; i < 4; i++) {
    const src = unwrapIdentityRelative(trimmed, own, chain);
    if (src == null) break;
    trimmed = src;
  }
  // `currentColor` is a redirect to the inherited colour, exactly like `inherit`.
  if (/^currentcolor$/i.test(trimmed)) return { currentColor: true, raw: trimmed };
  if (SYSTEM_COLORS.has(trimmed.toLowerCase())) return { systemColor: trimmed, raw: trimmed };
  const dt = [...trimmed.matchAll(/var\(\s*(--dt-[a-z0-9-]+)\s*(?:,[^)]*)?\)/gi)].map(m => m[1]);
  if (dt.length === 1 && /^var\(\s*--dt-[a-z0-9-]+\s*(?:,[^)]*)?\)$/i.test(trimmed)) {
    return { token: dt[0], raw: trimmed };
  }
  return { computed: true, tokens: dt, raw: trimmed };
}

const splitTopLevel = (s) => {
  const parts = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) { if (cur) { parts.push(cur); cur = ''; } continue; }
    cur += ch;
  }
  if (cur) parts.push(cur);
  return parts;
};

/**
 * Declared tokens for one node, keyed by Figma property name.
 *   { textColor: '--dt-color-link-primary', itemSpacing: '--dt-spacing-50', … }
 */
/**
 * Resolve declared tokens from an already-folded declaration set.
 * Shared by real elements and pseudo-elements.
 */
export function resolveDeclared (own, chain) {
  const tokens = {}, computed = {};
  const record = (key, res) => {
    if (res.token) tokens[key] = res.token;
    else computed[key] = { raw: res.raw, tokens: res.tokens, systemColor: res.systemColor };
  };

  // `color`, `font-size`, `font-weight` and `line-height` INHERIT. Dialtone
  // routinely declares them on a block and paints them on a child — Badge sets
  // `color` on .d-badge while Figma binds the fill on the label TEXT node. Looking
  // only at the node's own rules reports every such binding as undeclared.
  const INHERITS = new Set(['color', 'font-size', 'font-weight', 'line-height']);
  const declFor = (cssProp) => {
    const mine = own[cssProp];
    // An explicit `inherit` is a redirect, not a value. `.d-link--unstyled` sets
    // `color: inherit`, which resolves to body's --dt-color-foreground-primary —
    // baking it as a literal instead left the unstyled link stuck at its light
    // colour in dark mode.
    if (mine && mine.value.trim() !== 'inherit') return mine;
    if (!mine && !INHERITS.has(cssProp)) return null;
    for (const anc of chain) if (anc[cssProp] && anc[cssProp].value.trim() !== 'inherit') return anc[cssProp];
    return mine || null;
  };

  for (const [cssProp, figmaKey] of Object.entries(PAINTED)) {
    const decl = declFor(cssProp);
    if (!decl) continue;
    let res = expand(decl.value, own, chain);
    // A value that resolves to `currentColor` is a redirect to the inherited colour,
    // no different from `inherit`. Without this, DtText's relative-colour `color`
    // terminated the search on the node itself and the inherited token was lost.
    if (res.currentColor && INHERITS.has(cssProp)) {
      for (const anc of chain) {
        const a = anc[cssProp];
        if (!a || a.value.trim() === 'inherit') continue;
        const up = expand(a.value, own, chain);
        if (!up.currentColor) { res = up; break; }
      }
    }
    record(figmaKey, res);
  }

  // The `outline` shorthand carries width, style and colour together, and both
  // Checkbox and Radio use it for their checked focus ring:
  //   outline: var(--dt-size-border-200) solid var(--dt-color-border-focus)
  // Looking only for the longhands left every such ring untokened.
  const outlineDecl = own.outline;
  if (outlineDecl) {
    const parts = splitTopLevel(expand(outlineDecl.value, own, chain).raw);
    const STYLES = new Set(['none', 'hidden', 'solid', 'dashed', 'dotted', 'double',
      'groove', 'ridge', 'inset', 'outset', 'auto']);
    const nonStyle = parts.filter(x => !STYLES.has(x.toLowerCase()));
    if (nonStyle.length && !tokens.outlineWidth) record('outlineWidth', expand(nonStyle[0], own, chain));
    if (nonStyle.length > 1 && !tokens.outlineColor) record('outlineColor', expand(nonStyle[nonStyle.length - 1], own, chain));
  }

  // A multi-part `box-shadow` never reduces to one token, so `effect` landed in
  // `computed` and shadowColorToken() was never reached — 40 Notice inset rings baked
  // as light literals. The COLOUR is still unambiguous when exactly one of the
  // expanded tokens is a colour, which is the only part Figma binds.
  if (!tokens.effect && computed.effect && Array.isArray(computed.effect.tokens)) {
    const colours = computed.effect.tokens.filter(t => /(^|-)color(-|$)/.test(t));
    if (colours.length === 1) tokens.effect = colours[0];
  }

  /**
   * Border widths and radii, resolved per side and per corner.
   *
   * Ordered longhand-last on purpose: `border-inline-end: 0` and `border-right-width: 1px`
   * can both be present, and the more specific declaration is the one the author wrote for
   * that side. CDP reports a shorthand's longhands too, so iterating shorthands first lets a
   * real longhand overwrite them.
   */
  /**
   * Within the border maps a later declaration is genuinely more specific, so it has to be
   * able to REPLACE an earlier token, not just add one where there was none.
   *
   * `record` cannot do that: it writes a token when it finds one and otherwise writes a
   * computed value, leaving any earlier token in place. So `border-radius: var(--x)` followed
   * by `border-start-end-radius: 0` left the zeroed corner claiming `button/size/radius/xs`,
   * a token whose value is 4. The measurement was right and the provenance was a fiction the
   * identity pass would then report as a missing binding.
   */
  const recordExact = (key, res) => {
    if (res.token) { tokens[key] = res.token; delete computed[key]; }
    else { delete tokens[key]; computed[key] = { raw: res.raw, tokens: res.tokens, systemColor: res.systemColor }; }
  };

  for (const [map, isShorthand] of [[BORDER_SHORTHAND, true], [BORDER_WIDTH, false], [BORDER_RADIUS, false]]) {
    for (const [cssProp, keys] of Object.entries(map)) {
      const decl = own[cssProp];
      if (!decl) continue;
      const parts = splitTopLevel(expand(decl.value, own, chain).raw);
      if (!parts.length) continue;
      if (isShorthand) {
        // width, style and colour in one declaration: take the width and, where the
        // shorthand covers every side, the colour too.
        const STYLE_WORDS = new Set(['none', 'hidden', 'solid', 'dashed', 'dotted', 'double',
          'groove', 'ridge', 'inset', 'outset']);
        const nonStyle = parts.filter(x => !STYLE_WORDS.has(x.toLowerCase()));
        if (!nonStyle.length) continue;
        for (const k of keys) recordExact(k, expand(nonStyle[0], own, chain));
        if (nonStyle.length > 1 && keys.length === 4 && !tokens.borderColor) {
          record('borderColor', expand(nonStyle[nonStyle.length - 1], own, chain));
        }
        continue;
      }
      for (const [k, part] of distribute(parts, keys)) {
        if (part) recordExact(k, expand(part, own, chain));
      }
    }
  }

  for (const [cssProp, keys] of Object.entries(PADDING)) {
    const decl = own[cssProp];
    if (!decl) continue;
    // Expand BEFORE splitting: `padding: var(--link-padding)` is one part until
    // the local resolves into two.
    const parts = splitTopLevel(expand(decl.value, own, chain).raw);
    if (keys.length === 2) {
      if (parts[0]) record(keys[0], expand(parts[0], own, chain));
      const h = parts.length >= 2 ? parts[1] : parts[0];
      if (h) record(keys[1], expand(h, own, chain));
    } else if (parts.length) {
      record(keys[0], expand(parts[0], own, chain));
    }
  }

  // The `border` shorthand's width and colour are handled by BORDER_SHORTHAND above, which
  // covers every side and logical form rather than just `border` / `border-top` /
  // `border-block-start`. Dialtone writes it directly —
  // `border: var(--dt-size-border-100) solid var(--toggle-color-background)` — so both halves
  // have to come out of one declaration.

  // Physical sides inherit from the `padding` shorthand's axis when they have no token of
  // their own. Note this CANNOT be gated on "the side has no declaration": CDP reports a
  // shorthand's longhands too, with substituted values that never reduce to a single
  // token, so every side always has a `computed` entry. Gating on that removed 756 of
  // Chip's 1230 token-backed properties — the axis fallback stopped firing entirely.
  const AXIS = { paddingTop: 'paddingV', paddingBottom: 'paddingV', paddingLeft: 'paddingH', paddingRight: 'paddingH' };
  for (const [side, axis] of Object.entries(AXIS)) {
    if (!tokens[side] && tokens[axis]) tokens[side] = tokens[axis];
  }
  // The axis keys are SCAFFOLDING for that fan-out, not Figma properties — Figma has
  // four padding fields and no axis field. Leaving them in `tokens` made the identity
  // audit report a "declared but unbound" for every node with a two-value `padding`
  // shorthand: 400 on Banner, 200 on Notice, against a property that cannot exist
  // (B-106). The sides have already inherited from them, so nothing is lost.
  delete tokens.paddingV; delete tokens.paddingH;

  return { tokens, computed, own, chain };
}

/**
 * Declared tokens for one node, keyed by Figma property name.
 *   { textColor: '--dt-color-link-primary', itemSpacing: '--dt-spacing-50', … }
 */
export async function tokensFor (cdp, nodeId) {
  const { own, chain } = await matchedFor(cdp, nodeId);
  return resolveDeclared(own, chain);
}

/**
 * Follow a --dt-* alias chain while each step is a single var() reference.
 * `--dt-shadow-focus` -> `--dt-shadow-focus-inset` -> a composite of five fields.
 */
export function followDtAlias (token, own, chain) {
  let cur = token, guard = 0;
  while (guard++ < 8) {
    const val = lookupVar(cur, own, chain);
    if (val == null) return { token: cur, value: null };
    const t = val.trim();
    const m = t.match(/^var\(\s*(--dt-[a-z0-9-]+)\s*(?:,[^)]*)?\)$/i);
    if (!m) return { token: cur, value: t };
    cur = m[1];
  }
  return { token: cur, value: null };
}

/**
 * Figma binds each shadow FIELD separately (color, spread, radius, offsets), while
 * the CSS names one composite token. Resolve the composite down to the field that
 * Figma actually binds, so the two are compared at the same level.
 */
export function shadowColorToken (compositeToken, own, chain) {
  const { value } = followDtAlias(compositeToken, own, chain);
  if (!value) return null;
  const refs = [...value.matchAll(/var\(\s*(--dt-[a-z0-9-]+)\s*(?:,[^)]*)?\)/gi)].map(m => m[1]);
  return refs.find(r => /-color$/.test(r)) || null;
}

/** Split on TOP-LEVEL commas only, so `rgba(0, 0, 0, .2)` stays whole. */
const splitCommas = (s) => {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ',' && depth === 0) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map(x => x.trim());
};

/**
 * One colour token PER LAYER of a composite shadow token.
 *
 * `--dt-shadow-focus-outset` expands to two full layers, each with its own colour:
 *
 *   var(…outset-1-…) var(…outset-1-color), var(…outset-2-…) var(…outset-2-color)
 *
 * `shadowColorToken` above returns the FIRST colour for the whole shadow, so a two-ring
 * focus shadow bound both of its rings to ring 1's token — or, once that was corrected to
 * bind only the layer whose colour actually matched, left ring 2 as a baked literal that
 * could not follow the mode (Chip's 9 dark findings, `expected rgba(10,103,242)`, `got
 * rgba(35,123,255)`). Reading a token per layer removes both the wrong binding and the
 * colour-matching heuristic that stood in for it.
 */
export function shadowLayerColorTokens (compositeToken, own, chain) {
  const { value } = followDtAlias(compositeToken, own, chain);
  if (!value) return [];
  return splitCommas(value).map((part) => {
    const refs = [...part.matchAll(/var\(\s*(--dt-[a-z0-9-]+)\s*(?:,[^)]*)?\)/gi)].map(m => m[1]);
    return refs.find(r => /-color$/.test(r)) || null;
  });
}

/**
 * '--dt-color-link-primary-hover' -> 'color.link.primary-hover'
 *
 * A compiled CSS custom property has already lost the distinction between a dot (a
 * real path level) and a hyphen that's part of a token's own name ('primary-hover',
 * 'focus-inset') — dialtone-tokens kebab-cases the whole dotted path into one string
 * before either reaches the browser, the same transform check_against_css.ts's
 * cssNameFor() uses to validate the built CSS. Guessing which hyphen was which from
 * the flattened string alone cannot recover that, so this inverts the real transform
 * over every live token instead — regenerated from the current token set on every
 * run, so a newly added token needs no update here.
 */
async function buildCssVarToPathMap () {
  const cssNameFor = (path) => path.split('.')
    .map(seg => seg.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
    .join('-');

  // resolve_tokens.ts reads token files relative to process.cwd() — both at
  // import time AND on every resolveModes() call, so the chdir has to stay in
  // place for both, then get restored before this module hands control back to
  // the rest of the pipeline (which reads its own files relative to ITS cwd).
  //
  // The import below loads TypeScript from plain Node, which needs native type stripping
  // (unflagged from Node 22.18, hence `engines` in package.json). fileURLToPath, not the
  // URL's `.pathname`: the latter stays percent-encoded, so a checkout under a path with a
  // space made chdir throw.
  const originalCwd = process.cwd();
  process.chdir(fileURLToPath(new URL('../../dialtone-tokens', import.meta.url)));
  let map;
  try {
    const { resolveModes } = await import('../../dialtone-tokens/sync-scripts/resolve_tokens.ts');
    // Same GROUPS/MODES build_variables.ts resolves to build the real 837
    // published variables — confirmed 1:1 against them (837/837 names matched).
    const { tokens: base } = await resolveModes('base', ['light', 'dark']);
    const { tokens: dp } = await resolveModes('dp', ['light', 'dark']);
    map = new Map([...base, ...dp].map(t => [`--dt-${cssNameFor(t.name)}`, t.name]));
  } finally {
    process.chdir(originalCwd);
  }
  return map;
}

const CSS_VAR_TO_PATH = await buildCssVarToPathMap();

/**
 * '--dt-color-link-primary-hover' -> 'color/link/primary-hover' (Figma variable naming).
 *
 * Looks the measured CSS variable up against every real token's own dotted path
 * first — exact, since it reverses dialtone-tokens' own transform rather than
 * guessing. Falls back to the old blind hyphen-split only for a name absent from
 * the current token set entirely (e.g. a token that doesn't exist yet), so an
 * unmapped name still produces a best-effort guess instead of nothing.
 */
export const toFigmaName = t => {
  const path = CSS_VAR_TO_PATH.get(t);
  return path ? path.split('.').join('/') : t.replace(/^--dt-/, '').split('-').join('/');
};
