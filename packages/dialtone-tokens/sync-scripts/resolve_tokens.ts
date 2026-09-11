/**
 * Resolves the Tokens Studio sets in `tokens/` into a flat, per-mode list of
 * variables ready to be written to Figma.
 *
 * This runs Style Dictionary with the same set composition and the same
 * transforms the CSS build uses, so a value here cannot drift from the value
 * Dialtone ships. The one deliberate difference is units: the CSS build
 * converts dimensions to rem, and Figma wants raw px, so the two rem transforms
 * are dropped from the transform group.
 *
 * Aliases survive. Style Dictionary keeps the pre-resolution value on
 * `token.original`, so a token whose source value is exactly one reference is
 * emitted as an alias rather than a literal, at any chain depth.
 */

import { parse, converter } from 'culori';
import { register, getTransforms, expandTypesMap } from '@tokens-studio/sd-transforms';
import StyleDictionary from 'style-dictionary';
import { readFileSync } from 'fs';

import figmaOrder from './figma_order.json' with { type: 'json' };
import {
  registerDialtoneTransforms,
  registerDialtonePreprocessors,
  registerRelativeColorWrap,
} from '../dialtone-transforms.js';

export type TokenValue = string | number | boolean;

export interface Modifier {
  /** `alpha`, `lighten`, `darken`, `mix`. */
  type: string;
  value: string;
}

export interface ModeValue {
  /** The value before resolution: an alias, an expression, or a literal. */
  raw: TokenValue;
  /** The value after Style Dictionary has resolved and transformed it. */
  resolved: TokenValue;
  /** Dot path of the referenced token, when `raw` is exactly one reference. */
  alias: string | null;
  /**
   * Where the value came from when it could not stay an alias: the token it
   * references and the modifier applied to it. Kept so the variable can say so
   * in its description, since the link itself cannot survive into Figma.
   */
  from?: { target: string; modifier: Modifier };
}

export interface ResolvedToken {
  /** Dot path, e.g. `color.surface.primary`. */
  name: string;
  /** The declared Tokens Studio type, e.g. `color`, `dimension`. */
  type: string;
  /** The set the token was declared in, for provenance. */
  filePath: string;
  /**
   * The kebab name Style Dictionary emits, without the `--dt-` prefix, e.g.
   * `color-surface-primary`. Taken from the build rather than derived, so the
   * name Figma shows in Dev Mode is the one Dialtone actually ships.
   */
  cssName: string;
  /**
   * The source's own `$deprecated` note, when it has one, e.g. "Use text
   * tokens instead." This is a better signal than any name pattern, because
   * it is maintained alongside the token rather than inferred from outside.
   */
  deprecated?: string;
  /** One entry per mode, keyed by mode name. */
  modes: Record<string, ModeValue>;
}

const toOklch = converter('oklch');

const BASE_FONT_SIZE = Number.parseFloat(
  JSON.parse(readFileSync('./tokens/root.json', 'utf8')).font.size.root.value,
);

/**
 * The CSS transform group, minus the two rem conversions. Everything else is
 * kept so maths, colour handling and the Dialtone-specific transforms behave
 * identically to the shipped build.
 */
const FIGMA_TRANSFORM_GROUP = 'dt/figma/variables';

let registered = false;

function registerOnce (): void {
  if (registered) return;
  registered = true;

  register(StyleDictionary);
  registerDialtoneTransforms(StyleDictionary);
  registerDialtonePreprocessors(StyleDictionary);
  registerRelativeColorWrap(StyleDictionary);

  const dropped = [
    // Not wanted: Figma stores dimensions as px numbers.
    'dt/size/pxToRem',
    'dt/space/pxToRem',
    // Dropped by the CSS build too.
    'name/camel',
    'ts/size/px',
    'ts/typography/css/fontFamily',
  ];

  StyleDictionary.registerTransformGroup({
    name: FIGMA_TRANSFORM_GROUP,
    transforms: [
      ...getTransforms({ platform: 'css' }),
      'name/kebab',
      'dt/lineHeight/percentToDecimal',
      'dt/avatar/anchorHue',
    ].filter(t => !dropped.includes(t)),
  });
}

interface ThemeEntry {
  group: string;
  name: string;
  selectedTokenSets: Record<string, 'source' | 'enabled' | 'disabled'>;
}

function readThemes (): ThemeEntry[] {
  return JSON.parse(readFileSync('tokens/$themes.json', 'utf8'));
}

function readSetOrder (): string[] {
  return JSON.parse(readFileSync('tokens/$metadata.json', 'utf8')).tokenSetOrder;
}

/**
 * Tokens Studio and Style Dictionary use the word "source" for opposite things.
 * A Tokens Studio `source` set is a reference the theme resolves against but
 * does not emit, which is Style Dictionary's `include`. A Tokens Studio
 * `enabled` set is emitted, which is Style Dictionary's `source`.
 */
function setsFor (theme: ThemeEntry, kind: 'source' | 'enabled', order: string[]): string[] {
  const wanted = new Set(
    Object.entries(theme.selectedTokenSets)
      .filter(([, value]) => value === kind)
      .map(([key]) => key),
  );
  return order.filter(set => wanted.has(set)).map(set => `tokens/${set}.json`);
}

/**
 * The order a designer arranged these in, lifted from the Dialtone 9 file.
 *
 * It is semantic rather than alphabetical: importance, then intensity, then
 * variants, so `primary, secondary, tertiary, muted, placeholder, disabled`
 * rather than the alphabetical scramble of the same six. No sort function can
 * derive that from the names, which is why it is data.
 *
 * Regenerate with `extract_order.ts`. Covers roughly two thirds of what we
 * emit; the rest is newer than that file and falls back to the natural sort.
 */
const CURATED: string[] = figmaOrder.order;

const curatedIndex = new Map<string, number>(CURATED.map((name, i) => [name, i]));

/**
 * Where a token sits in the curated order, or `Infinity`.
 *
 * Falls back to the parent path so an expanded composite inherits its parent's
 * place: `typography.body.md` was one text style in the old file and is five
 * variables here, and all five belong together where the style was.
 */
function curatedRank (name: string): number {
  const exact = curatedIndex.get(name);
  if (exact !== undefined) return exact;
  const parent = curatedIndex.get(name.split('.').slice(0, -1).join('.'));
  return parent ?? Infinity;
}

/**
 * Group order, chosen rather than inherited.
 *
 * Figma filters a picker by type first and then by scope, so this order only
 * ever matters within a type. That makes one sequence serve every picker,
 * provided the useful groups come before the ones a designer reaches for
 * rarely: painting a frame should offer `color.surface` before `color.purple`,
 * and sizing one should offer `layout` before `icon.size`.
 *
 * Matching is longest-prefix, which is what makes the list short. `color` sits
 * in the primitives band as a catch-all, so the twelve hue ramps land there
 * without being named and a thirteenth needs no edit. The semantic colour
 * groups are named explicitly and therefore win over it. That asymmetry is
 * deliberate: a new ramp has an obvious home, a new semantic group is a
 * decision someone should make here.
 *
 * Longest-prefix also means a named entry can sit either side of the catch-all
 * it overlaps, which is how `color.chart` lands behind the ramps rather than
 * among them.
 *
 * The bands, and why they sit where they do:
 *
 *   1  the global colour semantics, which is what a designer wants first
 *   2  `theme` and `shell`, the app chrome, still semantic and still reached for
 *   3  the primitives, which are the fallback rather than the default
 *   4  the non-colour scales, in general-before-specific order
 *   5  the component namespaces, which carry floats as well as colours
 *
 * Ordering inside a group is left to the curated list. This list only decides
 * which group comes first, which the curated list cannot: it is keyed by token
 * name, and a group path is not a token name, so every colour group scored
 * `Infinity` and the tiebreak fell through to the group string. That is why the
 * panel read `berry, black, blue, border, brand, chart, coral, foreground, …`
 * before this existed.
 *
 * Anything unlisted falls back to its curated position, then to the natural
 * sort. Order here is load-bearing: Figma has no ordering field, so a
 * variable's place in the panel is the order its CREATE arrived in.
 */
const GROUP_ORDER = [
  // Global colour semantics. `border` never shows in a fill picker, since it
  // is scoped to STROKE_COLOR alone, so its place here costs that picker
  // nothing and gives the stroke picker the right first hit.
  'color.surface',
  'color.foreground',
  'color.border',
  'color.link',
  'color.brand',

  // App chrome. Semantic, and used often enough to sit above the primitives.
  'theme',
  'shell',

  // Primitives, real colours before the chart palettes. `chart` is named only
  // so its 160 variables sit behind the ramps instead of interleaving
  // alphabetically through them. Being the longer prefix it wins over the
  // catch-all for its own subtree, and being later in the list it sorts after
  // it, which is the whole trick.
  'color',
  'color.chart',

  // The non-colour scales.
  'layout',     // structural scale
  'spacing',    // whitespace scale
  'size',       // radius and border
  'font',       // type scale
  'text',       // the current type ramp
  'typography',
  'opacity',
  'shadow',

  // The component namespaces, last. These are whole namespaces rather than
  // colour groups, so they carry a component's floats as well as its colours:
  // `icon.size.100`, `checkbox.size.width`, `button.size.radius`. That is why
  // they sit behind the general scales rather than in front of the primitives
  // where their colours alone would belong. Figma filters a picker by type
  // first, so the cost is only to the colour pickers, where it puts
  // `action.color.background` behind the ramps.
  'inputs',
  'checkbox',
  'radio',
  'badge',
  'action',
  'avatar',
  'presence',
  'button',
  'icon',
];

/**
 * Where a name sits in `GROUP_ORDER`, by longest matching prefix, or
 * `Infinity`.
 *
 * Longest wins so that a specific entry beats a catch-all regardless of the
 * order the two appear in the list: `color.surface.primary` matches both
 * `color.surface` and `color`, and has to take the first.
 */
function groupOrderRank (name: string): number {
  let rank = Infinity;
  let matched = -1;
  for (let i = 0; i < GROUP_ORDER.length; i++) {
    const prefix = GROUP_ORDER[i];
    if (name !== prefix && !name.startsWith(`${prefix}.`)) continue;
    if (prefix.length > matched) { matched = prefix.length; rank = i; }
  }
  return rank;
}

/** The rank of the earliest curated member of a namespace, or `Infinity`. */
const namespaceRank = new Map<string, number>();
for (const [name, index] of curatedIndex) {
  const ns = name.split('.')[0];
  const current = namespaceRank.get(ns);
  if (current === undefined || index < current) namespaceRank.set(ns, index);
}

/**
 * Orders token paths the way a person reads them, so `100` sorts before `1000`
 * and `50` before both.
 *
 * This matters because Figma has no ordering field: a variable's position comes
 * from the order it was created in, which is the order of this list. Sorting as
 * plain strings puts `1000` second in every ramp, right after `100`, and leaves
 * `50` stranded in the middle.
 */
export function compareTokenNames (a: string, b: string): number {
  const ka = sortKey(a);
  const kb = sortKey(b);
  for (let i = 0; i < Math.min(ka.length, kb.length); i++) {
    if (ka[i] !== kb[i]) return ka[i] < kb[i] ? -1 : 1;
  }
  return ka.length - kb.length;
}

/**
 * A fixed key per name, rather than a decision made per pair.
 *
 * This has to be a key and not a set of pairwise rules. An earlier version
 * skipped the curated rank when both names had numeric leaves and applied it
 * otherwise, which is not a valid ordering: a numeric pair compared by number
 * while each of them compared to a third name by curation, so the three formed
 * a cycle. `Array.sort` given an intransitive comparator returns whatever it
 * happens to return, which is how `1000` landed between `600` and `700` in a
 * ramp that looked correctly ordered when checked two names at a time.
 *
 *   1  the namespace, in the order we chose
 *   2  the group, so a group stays together
 *   3  within a group, numbers by value and names by curation
 *
 * Splitting the leaf that way settles the one real tension. A numeric ramp
 * already states its own order, and the old file's coverage of ours is partial
 * because the February migration removed its irregular stops, so deferring to
 * it scrambles a ramp. A named leaf is the opposite: `primary, secondary,
 * tertiary, muted` is meaning no sort can derive, and only curation has it.
 */
function sortKey (name: string): (number | string)[] {
  const segments = name.split('.');
  const namespace = segments[0];
  const group = segments.slice(0, -1).join('.');
  const leaf = segments[segments.length - 1];

  const explicit = groupOrderRank(name);
  const namespaceKey = Number.isFinite(explicit)
    ? explicit
    : (namespaceRank.get(namespace) ?? Infinity) + GROUP_ORDER.length;

  // A group inherits the earliest curated position of anything under it, so a
  // group the old file did not have sorts after the ones it did.
  const groupKey = curatedRank(group === '' ? name : group);

  const numeric = /^\d+$/.test(leaf);

  return [
    namespaceKey,
    groupKey,
    group,
    // Plain steps first, then anything named: `pill`, `focus`, `base`, `1px`.
    numeric ? 0 : 1,
    numeric ? Number(leaf) : curatedRank(name),
    leaf,
  ];
}

/** `{a.b.c}` and nothing else. An expression like `{a} * 2` is not an alias. */
function aliasTarget (raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const match = raw.trim().match(/^\{([^{}]+)\}$/);
  return match ? match[1] : null;
}

interface FlatToken {
  type: string;
  filePath: string;
  cssName: string;
  modifier?: Modifier;
  deprecated?: string;
  raw: TokenValue;
  resolved: TokenValue;
  alias: string | null;
}

/** Resolve a single theme into a map of dot path to token. */
export async function resolveTheme (
  group: string,
  mode: string,
  opts: { verbose?: boolean; extraSets?: string[] } = {},
): Promise<{ emitted: Map<string, FlatToken>; allValues: Map<string, TokenValue> }> {
  registerOnce();

  const theme = readThemes().find(t => t.group === group && t.name === mode);
  if (!theme) {
    throw new Error(`No theme "${group}/${mode}" in tokens/$themes.json`);
  }
  const order = readSetOrder();

  // Extra sets go in the emitted list, appended last, so they win.
  //
  // Putting them in `include` looks right and is not: Style Dictionary's
  // `source` always beats `include`, so a material placed in `include` is
  // silently ignored for any token an emitted set already defines. That is
  // exactly the black ramp, which `base/default` emits, so the material would
  // change every semantic colour and leave the ramp it is supposed to swap
  // untouched.
  const extra = new Set(opts.extraSets ?? []);
  const extraFiles = order
    .filter(set => extra.has(set))
    .map(set => `tokens/${set}.json`);

  const sd = new StyleDictionary({
    source: [...setsFor(theme, 'enabled', order), ...extraFiles],
    include: setsFor(theme, 'source', order),
    preprocessors: ['tokens-studio', 'dt/relative-color/extract'],
    expand: { typesMap: expandTypesMap },
    log: opts.verbose ? { verbosity: 'verbose' } : undefined,
    platforms: {
      figma: {
        transformGroup: FIGMA_TRANSFORM_GROUP,
        basePxFontSize: BASE_FONT_SIZE,
      },
    },
  });

  const dictionary = await sd.getPlatformTokens('figma');
  const out = new Map<string, FlatToken>();
  /**
   * Every token's CSS name to its resolved value, including the ones that are
   * not emitted. A relative colour in the `dp` group routinely references a
   * `base` primitive, which resolves but is never emitted by `dp`, so building
   * this from the emitted set alone leaves those references unresolvable.
   */
  const valueByCssName = new Map<string, TokenValue>();
  /** Dot path to CSS name, so a newly resolved value can be fed back. */
  const cssNameOf = new Map<string, string>();
  /**
   * Every token's resolved value by dot path, emitted or not. Verifying that a
   * reference survived unchanged means comparing against its target, and a
   * semantic token routinely references a primitive this theme group does not
   * emit.
   */
  const allValues = new Map<string, TokenValue>();

  for (const token of dictionary.allTokens) {
    // `token.name` is the kebab name the CSS build emits, which is what a
    // relative-colour expression references. Recorded for every token, emitted
    // or not, because resolution needs the ones that are not.
    if (token.name) valueByCssName.set(`--dt-${token.name}`, (token.$value ?? token.value) as TokenValue);
    allValues.set(token.path.join('.'), (token.$value ?? token.value) as TokenValue);

    // `isSource` is true only for tokens from `enabled` sets. Reference-only
    // sets resolve but must not be emitted.
    if (!token.isSource) continue;

    const name = token.path.join('.');
    if (token.name) cssNameOf.set(name, `--dt-${token.name}`);
    const raw = token.original?.$value ?? token.original?.value;
    const resolved = token.$value ?? token.value;

    const deprecated =
      token.$deprecated ?? (token as { deprecated?: string }).deprecated ??
      token.original?.$deprecated;

    const modify = (token.original?.$extensions ?? token.$extensions)?.['studio.tokens']?.modify;

    out.set(name, {
      type: token.$type ?? token.type ?? 'unknown',
      filePath: token.filePath ?? '',
      cssName: token.name ?? '',
      ...(modify?.type ? { modifier: { type: String(modify.type), value: String(modify.value) } } : {}),
      ...(typeof deprecated === 'string' ? { deprecated } : {}),
      raw: raw as TokenValue,
      resolved: resolved as TokenValue,
      alias: aliasTarget(raw),
    });
  }

  resolveRelativeColors(out, valueByCssName, cssNameOf);

  // Relative colours were rewritten in `out`; mirror those into the value map
  // so a reference pointing at one is compared against the resolved colour.
  for (const [path, token] of out) allValues.set(path, token.resolved);

  return { emitted: out, allValues };
}

/**
 * Rewrites `oklch(from var(--dt-x) l c h / N)` into a concrete colour.
 *
 * The CSS build leaves these as-is, because a browser evaluates them. Figma
 * cannot: a variable holds one colour. Every occurrence in the token source is
 * this single shape, which keeps the referenced colour's lightness, chroma and
 * hue and replaces its alpha, so it can be computed exactly rather than
 * approximated.
 *
 * Iterates because a reference can point at another expression. Anything still
 * unresolved after the cap is left alone and surfaces downstream as an
 * unparseable colour, which is louder than a silently wrong one.
 */
function resolveRelativeColors (
  tokens: Map<string, FlatToken>,
  valueByCssName: Map<string, TokenValue>,
  cssNameOf: Map<string, string>,
): void {
  const pattern = /^oklch\(\s*from\s+var\((--[a-z0-9-]+)\)\s+l\s+c\s+h\s*\/\s*([\d.]+)\s*\)$/;

  for (let pass = 0; pass < 5; pass++) {
    let changed = false;

    for (const [path, token] of tokens) {
      const match = typeof token.resolved === 'string' && token.resolved.trim().match(pattern);
      if (!match) continue;

      const target = valueByCssName.get(match[1]);
      if (typeof target !== 'string') continue;
      if (pattern.test(target.trim())) continue; // not resolved yet

      const oklch = toOklchChannels(target);
      if (!oklch) continue;

      const resolved = `oklch(${oklch.l} ${oklch.c} ${oklch.h} / ${match[2]})`;
      token.resolved = resolved;

      // Feed it back, so a colour built on top of this one resolves on the
      // next pass instead of being left as an expression. Without this the
      // iteration cannot make progress past the first layer.
      const cssName = cssNameOf.get(path);
      if (cssName) valueByCssName.set(cssName, resolved);

      changed = true;
    }

    if (!changed) break;
  }
}

/** The three OKLCH channels of any CSS colour, or null if it cannot be read. */
function toOklchChannels (color: string): { l: number; c: number; h: number } | null {
  const parsed = parse(color);
  if (!parsed) return null;
  const oklch = toOklch(parsed);
  if (!oklch) return null;
  return {
    l: round(oklch.l ?? 0),
    c: round(oklch.c ?? 0),
    // An achromatic colour has no hue. Zero is the conventional stand-in and
    // is harmless, because chroma is zero too.
    h: round(oklch.h ?? 0),
  };
}

function round (n: number): number {
  return Math.round(n * 1e4) / 1e4;
}

/**
 * Resolve several modes of one theme group and zip them into one list, so each
 * token carries a value per mode. A token missing from a mode is reported
 * rather than silently dropped: that would mean the modes disagree about which
 * tokens exist, which Figma cannot represent.
 */
export async function resolveModes (
  group: string,
  modes: string[],
  opts: { extraSets?: string[] } = {},
): Promise<{
  tokens: ResolvedToken[];
  missing: Record<string, string[]>;
  /** References dropped because a modifier changed the value. */
  modified: string[];
}> {
  const perMode = new Map<string, Map<string, FlatToken>>();
  const valuesPerMode = new Map<string, Map<string, TokenValue>>();
  for (const mode of modes) {
    const { emitted, allValues } = await resolveTheme(group, mode, opts);
    perMode.set(mode, emitted);
    valuesPerMode.set(mode, allValues);
  }

  const allNames = new Set<string>();
  for (const map of perMode.values()) {
    for (const name of map.keys()) allNames.add(name);
  }

  const tokens: ResolvedToken[] = [];
  const missing: Record<string, string[]> = {};
  const modified: string[] = [];

  /**
   * A reference is only a real alias if the value came through unchanged.
   *
   * Tokens Studio lets a token reference another and then modify it, lightening
   * it or changing its alpha, via a `studio.tokens.modify` extension. The raw
   * value still reads as a plain `{reference}`, so the reference alone cannot be
   * trusted. A Figma alias copies the target's whole value, so emitting one of
   * these as an alias silently discards the modification: an entire chart ramp
   * collapses to its first step and still passes any check that compares
   * resolved values.
   *
   * Comparing the resolved values catches it without needing to know the
   * extension exists, so a future modifier type is handled too.
   */
  const survivesAsAlias = (mode: string, target: string, resolved: TokenValue): boolean => {
    const targetValue = valuesPerMode.get(mode)!.get(target);
    // Refuse to claim an alias that cannot be verified. A wrong alias is
    // silently wrong on the canvas; a flattened literal is merely less elegant.
    if (targetValue === undefined) return false;
    return String(targetValue) === String(resolved);
  };

  for (const name of [...allNames].sort(compareTokenNames)) {
    const absentFrom = modes.filter(m => !perMode.get(m)!.has(name));
    if (absentFrom.length) {
      missing[name] = absentFrom;
      continue;
    }

    const first = perMode.get(modes[0])!.get(name)!;
    const entry: ResolvedToken = {
      name,
      type: first.type,
      filePath: first.filePath,
      cssName: first.cssName,
      ...(first.deprecated ? { deprecated: first.deprecated } : {}),
      modes: {},
    };
    for (const mode of modes) {
      const t = perMode.get(mode)!.get(name)!;
      const alias =
        t.alias !== null && survivesAsAlias(mode, t.alias, t.resolved) ? t.alias : null;
      const dropped = t.alias !== null && alias === null;
      entry.modes[mode] = {
        raw: t.raw,
        resolved: t.resolved,
        alias,
        ...(dropped && t.modifier ? { from: { target: t.alias!, modifier: t.modifier } } : {}),
      };
      if (dropped) modified.push(`${name} [${mode}] -> ${t.alias}`);
    }
    tokens.push(entry);
  }

  return { tokens, missing, modified };
}
