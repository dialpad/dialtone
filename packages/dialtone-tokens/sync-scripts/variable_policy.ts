/**
 * Decides, for each resolved token, whether it becomes a Figma variable and
 * which pickers it shows up in.
 *
 * Two things live here, both deliberately data rather than code, so what
 * reaches Figma can be read off a table instead of traced through branches:
 *
 *   EXCLUSIONS  tokens that cannot or should not become variables
 *   SCOPES      name patterns to the Figma pickers a variable appears in
 *
 * Nothing falls through silently. A token matching no scope rule is reported
 * as unscoped so the gap is visible, rather than quietly landing in every
 * picker.
 */

import type { ResolvedToken, TokenValue } from './resolve_tokens.js';

/** The scopes Figma accepts, per the REST API's `VariableScope` enum. */
export type VariableScope =
  | 'ALL_SCOPES'
  | 'TEXT_CONTENT' | 'CORNER_RADIUS' | 'WIDTH_HEIGHT' | 'GAP'
  | 'ALL_FILLS' | 'FRAME_FILL' | 'SHAPE_FILL' | 'TEXT_FILL'
  | 'STROKE_COLOR' | 'STROKE_FLOAT'
  | 'EFFECT_FLOAT' | 'EFFECT_COLOR' | 'OPACITY'
  | 'FONT_FAMILY' | 'FONT_STYLE' | 'FONT_WEIGHT' | 'FONT_SIZE'
  | 'LINE_HEIGHT' | 'LETTER_SPACING'
  | 'PARAGRAPH_SPACING' | 'PARAGRAPH_INDENT' | 'FONT_VARIATIONS';

export type FigmaType = 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN';

interface Exclusion {
  reason: string;
  match: (token: ResolvedToken) => boolean;
}

/** First match wins, and the reason is reported. */
export const EXCLUSIONS: Exclusion[] = [
  {
    // The source marks its own retirements with `$deprecated`, carrying the
    // replacement in the message. Honouring it is better than any name pattern
    // here could be: it is maintained next to the token, so a new deprecation
    // is picked up without anyone remembering to edit this file. "Dialtone 2026"
    // is a fresh collection, so seeding it with tokens already on their way out
    // would mean shipping a migration nobody asked for.
    reason: 'marked $deprecated in the token source',
    match: t => t.deprecated !== undefined,
  },
  {
    reason: 'deprecated scale, superseded by spacing.* and layout.*',
    match: t => t.name.startsWith('space.'),
  },
  {
    // `size.*` is two things sharing a prefix. The numeric ladder, its
    // negatives and its percentages are the deprecated half. `size.radius.*`
    // and `size.border.*` are current, still used, and have no equivalent on
    // the spacing or layout scales, because a radius is neither whitespace nor
    // structure.
    reason: 'deprecated scale, superseded by spacing.* and layout.*',
    match: t => t.name.startsWith('size.') && !/^size\.(radius|border)\./.test(t.name),
  },
  {
    reason: 'negative dimension, nothing in Figma consumes one',
    match: t => /(^|\.)[0-9]+-negative$/.test(t.name),
  },
  {
    reason: 'percentage, a Figma variable holds a number not a percentage',
    match: t => Object.values(t.modes).some(m => isPercent(m.resolved)),
  },
  {
    // Matched on the value rather than the name. Excluding `color.gradient.*`
    // by name is not enough: a token that *aliases* a gradient has its alias
    // flattened when the target is not emitted, which puts the gradient string
    // straight back into the payload.
    reason: 'gradient, a Figma COLOR variable holds one solid value',
    match: t => Object.values(t.modes).some(m => /gradient\(/.test(String(m.resolved))),
  },
  {
    reason: 'no Figma scope binds text-case',
    match: t => t.type === 'textCase',
  },
  {
    reason: 'input to the avatar colour computation, not a design property',
    match: t => /^avatar\.(hue|lightness|chroma|anchor)($|\.)/.test(t.name),
  },
  {
    reason: 'unmappable token type',
    match: t => figmaTypeFor(t.type) === null,
  },
];

function isPercent (value: TokenValue): boolean {
  return typeof value === 'string' && value.trim().endsWith('%');
}

/**
 * CSS font stacks to the single family Figma can resolve.
 *
 * A token holds the whole stack, `-apple-system, BlinkMacSystemFont, "SF Pro",
 * …`, which is right for a browser and meaningless in Figma: a `FONT_FAMILY`
 * variable has to name one font that exists, or nothing can bind to it.
 *
 * Picking the first recognised entry rather than the first entry: the head of
 * a stack is often a platform keyword, and the point is to land on the face
 * that actually renders.
 *
 * The stack is platform-dependent by design, so any single choice is only true
 * on one platform. `-apple-system` is SF Pro on macOS and Segoe UI on Windows;
 * this resolves it the way a Mac would, which is what the design team sees.
 */
const STACK_TO_FIGMA: Record<string, string> = {
  '-apple-system': 'SF Pro Text',
  blinkmacsystemfont: 'SF Pro Text',
  'sf pro': 'SF Pro Text',
  'season sans': 'Season Sans',
  'season mix': 'Season Mix',
  'sfmono-regular': 'SF Mono',
  'sf mono': 'SF Mono',
};

/** The Figma family a CSS `font-family` resolves to, or null if unrecognised. */
export function figmaFontFamily (cssFontFamily: string): string | null {
  const stack = String(cssFontFamily ?? '')
    .split(',')
    .map(part => part.trim().replace(/^["']|["']$/g, '').toLowerCase());
  const hit = stack.find(family => STACK_TO_FIGMA[family]);
  return hit ? STACK_TO_FIGMA[hit] : null;
}

/** Tokens Studio type to Figma's `resolvedType`. `null` means unmappable. */
export function figmaTypeFor (type: string): FigmaType | null {
  switch (type) {
    case 'color':
      return 'COLOR';
    case 'dimension':
    case 'number':
    case 'sizing':
    case 'spacing':
    case 'borderWidth':
    case 'borderRadius':
    case 'opacity':
    case 'fontWeight':
    case 'fontWeights':
    case 'lineHeight':
    case 'letterSpacing':
    case 'fontSize':
    case 'fontSizes':
      return 'FLOAT';
    case 'fontFamily':
    case 'fontFamilies':
    case 'fontStyle':
      return 'STRING';
    case 'boolean':
      return 'BOOLEAN';
    default:
      return null;
  }
}

interface ScopeRule {
  /** Why this rule exists, for the report. */
  label: string;
  match: RegExp;
  scopes: VariableScope[];
}

/**
 * Ordered. First match wins, so put the specific patterns above the general
 * ones. Every pattern is anchored on a segment boundary rather than a loose
 * substring, so `inputs.color.border.default` and `color.border.default` are
 * both caught by the border rule while `color.border-ish` would not be.
 */
export const SCOPES: ScopeRule[] = [
  // Raw palettes. Paulo, 2026-08-26: show them everywhere for now, and
  // revisit once designers report the picker is noisy.
  { label: 'raw colour ramp', match: /^color\.[a-z-]+\.(\d+|black|white|transparent|gold|magenta|purple|red|green|blue)$/, scopes: ['ALL_SCOPES'] },
  { label: 'material palette', match: /^material\./, scopes: ['ALL_SCOPES'] },
  { label: 'chart colour', match: /^color\.chart\./, scopes: ['ALL_SCOPES'] },

  // Type. These sit above the colour rules because a token like
  // `typography.body.md.fontSize` must not be read as a size.
  { label: 'font family', match: /(^|\.)font(Family|Families)$|^font\.family\./, scopes: ['FONT_FAMILY'] },
  { label: 'font size', match: /(^|\.)fontSize$|(^|\.)font\.size\./, scopes: ['FONT_SIZE'] },
  // `FONT_STYLE`, not `FONT_WEIGHT`. Figma accepts FONT_WEIGHT and then stores
  // FONT_STYLE, so sending the obvious one makes every run see a difference
  // and rewrite the same 86 variables forever. Send what it stores.
  { label: 'font weight', match: /(^|\.)fontWeight$|(^|\.)font\.weight\./, scopes: ['FONT_STYLE'] },
  { label: 'line height', match: /(^|\.)lineHeight($|\.)|(^|\.)font\.lineHeight\./, scopes: ['LINE_HEIGHT'] },
  { label: 'letter spacing', match: /(^|\.)letterSpacing$/, scopes: ['LETTER_SPACING'] },

  // Colour by the surface it paints.
  // The trailing `(-[a-z0-9-]+)?` catches state suffixes: a role can be spelled
  // `color.background.hover` or `color.background-hover` depending on the set.
  { label: 'background', match: /(^|\.)color\.(surface|background)(-[a-z0-9-]+)?($|\.)|(^|\.)background(-[a-z0-9-]+)?($|\.)/, scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
  // `SHAPE_FILL` as well as `TEXT_FILL`, because a Dialtone icon inherits the
  // foreground colour and an icon in Figma is a vector, which is a shape and
  // not text. Text-only scoping would leave every icon unable to reach the
  // colour it is supposed to take. Frames are deliberately not included: a
  // foreground colour has no business filling a container.
  { label: 'foreground', match: /(^|\.)color\.(foreground|link)(-[a-z0-9-]+)?($|\.)|(^|\.)foreground(-[a-z0-9-]+)?($|\.)/, scopes: ['TEXT_FILL', 'SHAPE_FILL'] },
  // The bare `border` alternative has to stay behind a `color` segment.
  // Without that it also matches `size.border.100`, which is a FLOAT, and
  // Figma rejects the whole payload for one colour scope on a number.
  { label: 'border colour', match: /(^|\.)color\.border(-[a-z0-9-]+)?($|\.)/, scopes: ['STROKE_COLOR'] },
  { label: 'shadow colour', match: /^shadow\..*\.color$/, scopes: ['EFFECT_COLOR'] },
  { label: 'presence dot', match: /^(presence|theme\.presence|shell\.presence)\./, scopes: ['SHAPE_FILL'] },

  // Numbers by the property they set.
  { label: 'corner radius', match: /(^|\.)size\.radius($|\.)|(^|\.)radius($|\.)/, scopes: ['CORNER_RADIUS'] },
  { label: 'border width', match: /(^|\.)size\.border($|\.)|(^|\.)borderWidth$/, scopes: ['STROKE_FLOAT'] },
  { label: 'shadow number', match: /^shadow\..*\.(blur|spread|offsetX|offsetY)$/, scopes: ['EFFECT_FLOAT'] },
  { label: 'opacity', match: /^opacity\./, scopes: ['OPACITY'] },
  { label: 'whitespace scale', match: /^spacing\./, scopes: ['GAP'] },
  { label: 'structural scale', match: /^layout\./, scopes: ['WIDTH_HEIGHT'] },
  { label: 'icon size', match: /^icon\.size\./, scopes: ['WIDTH_HEIGHT'] },
  { label: 'control size', match: /(^|\.)size\.(width|height)$/, scopes: ['WIDTH_HEIGHT'] },

  // A handful of colours name a thing rather than a surface: an accent, a logo,
  // a status dot. They could legitimately paint a fill, a stroke or text, so
  // they stay unconstrained. Listed last and labelled, so the report shows how
  // many landed here rather than hiding them in a silent default.
  { label: 'unclassified colour', match: /(^|\.)color($|\.)/, scopes: ['ALL_SCOPES'] },
];

export interface Classified {
  token: ResolvedToken;
  figmaType: FigmaType;
  scopes: VariableScope[];
  /** The rule that assigned the scopes, or null when nothing matched. */
  scopeRule: string | null;
}

/**
 * Which scopes Figma accepts for each variable type, from the REST API spec.
 *
 * Worth validating locally rather than letting the API decide: Figma rejects
 * the entire payload on the first bad pairing and names only that one variable,
 * so a scope bug affecting fifty tokens surfaces fifty times, once per run.
 *
 * Two entries in the FLOAT set are not in the spec's documented FLOAT list:
 *
 *   CORNER_RADIUS  in the scope enum, absent from the list. A radius is a
 *                  number, so the omission reads like an oversight.
 *   FONT_STYLE     documented for STRING only. Figma nonetheless stores it on
 *                  FLOAT variables: send FONT_WEIGHT and read the variable
 *                  back, and it comes back as FONT_STYLE. Verified against the
 *                  live API rather than taken from the docs.
 */
export const VALID_SCOPES: Record<FigmaType, Set<VariableScope>> = {
  FLOAT: new Set<VariableScope>([
    'ALL_SCOPES', 'TEXT_CONTENT', 'WIDTH_HEIGHT', 'GAP', 'STROKE_FLOAT',
    'EFFECT_FLOAT', 'OPACITY', 'FONT_WEIGHT', 'FONT_SIZE', 'LINE_HEIGHT',
    'LETTER_SPACING', 'PARAGRAPH_SPACING', 'PARAGRAPH_INDENT', 'CORNER_RADIUS',
    'FONT_STYLE',
  ]),
  STRING: new Set<VariableScope>(['ALL_SCOPES', 'TEXT_CONTENT', 'FONT_FAMILY', 'FONT_STYLE']),
  COLOR: new Set<VariableScope>([
    'ALL_SCOPES', 'ALL_FILLS', 'FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL',
    'STROKE_COLOR', 'EFFECT_COLOR',
  ]),
  BOOLEAN: new Set<VariableScope>([]),
};

export interface ScopeViolation {
  name: string;
  figmaType: FigmaType;
  scopes: VariableScope[];
  rule: string | null;
}

export interface Classification {
  emit: Classified[];
  excluded: { token: ResolvedToken; reason: string }[];
  /** Emitted, but no scope rule matched. These land in every picker. */
  unscoped: string[];
  /** Scopes Figma will reject for that variable's type. */
  violations: ScopeViolation[];
}

export function classify (tokens: ResolvedToken[]): Classification {
  const emit: Classified[] = [];
  const excluded: { token: ResolvedToken; reason: string }[] = [];
  const unscoped: string[] = [];
  const violations: ScopeViolation[] = [];

  for (const token of tokens) {
    const hit = EXCLUSIONS.find(e => e.match(token));
    if (hit) {
      excluded.push({ token, reason: hit.reason });
      continue;
    }

    const rule = SCOPES.find(r => r.match.test(token.name));
    if (!rule) unscoped.push(token.name);

    const figmaType = figmaTypeFor(token.type)!;
    const scopes = rule ? rule.scopes : ['ALL_SCOPES' as VariableScope];

    const allowed = VALID_SCOPES[figmaType];
    const bad = scopes.filter(s => !allowed.has(s));
    if (bad.length) {
      violations.push({ name: token.name, figmaType, scopes: bad, rule: rule?.label ?? null });
    }

    emit.push({ token, figmaType, scopes, scopeRule: rule ? rule.label : null });
  }

  return { emit, excluded, unscoped, violations };
}
