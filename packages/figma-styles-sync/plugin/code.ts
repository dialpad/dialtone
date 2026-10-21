/// <reference types="@figma/plugin-typings" />

/**
 * Runs inside Figma's plugin sandbox: full Plugin API access, no fetch/DOM.
 * The spec is resolved in Node (`src/resolve_text_styles.ts`) and handed in
 * by `ui.html`, which does have fetch — see that file for why.
 */

import type { TextStyleSpec } from '../src/resolve_text_styles.ts';
import type { EffectStyleSpec } from '../src/resolve_effect_styles.ts';
import type { PaintStyleSpec } from '../src/resolve_paint_styles.ts';

interface CreateTextStylesResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  errors: { name: string; error: string }[];
  totalStyles: number;
}

const TEXT_CASE: Record<string, TextCase> = {
  none: 'ORIGINAL',
  uppercase: 'UPPER',
  lowercase: 'LOWER',
  capitalize: 'TITLE',
};

interface TextStyleFingerprintInput {
  fontFamily: string;
  fontStyleName: string;
  fontSizeVar: string | null;
  fontWeightVar: string | null;
  fontFamilyVar: string | null;
  lineHeight: LineHeight;
  textCase: TextCase;
}

/** Shared by every style kind's fingerprint: a bound field's variable id, or null. */
function boundVarId (bv: Record<string, VariableAlias | undefined> | undefined, field: string): string | null {
  return bv?.[field]?.id ?? null;
}

/**
 * A Figma variable name is unique only within its own collection, not across
 * the file — `getLocalVariablesAsync()` returns every local collection at
 * once, so two unrelated collections sharing a variable name is a real
 * possibility, not a hypothetical. Collapsing that straight into
 * `Map(name -> variable)` would let whichever collection's variable happens
 * to iterate last silently win, binding a style to the wrong collection with
 * no error. Recording the collision instead and failing loudly on lookup
 * turns that into a clear error pointing at the ambiguous name.
 */
function indexVariablesByName (vars: Variable[]): Map<string, Variable | 'ambiguous'> {
  const index = new Map<string, Variable | 'ambiguous'>();
  for (const v of vars) index.set(v.name, index.has(v.name) ? 'ambiguous' : v);
  return index;
}

/**
 * A right-named, unambiguous variable can still be the wrong Figma type — a
 * stray manual edit, or a variable recreated with the wrong type during some
 * other cleanup, both leave the name intact. `setBoundVariable` rejects a
 * type mismatch, but only once called, which validating existence alone
 * doesn't catch: the resolve-everything-before-mutating guard this function
 * exists for only holds if resolving also fails on a type that could never
 * have bound in the first place.
 */
function resolveVariable (
  index: Map<string, Variable | 'ambiguous'>,
  name: string,
  expectedType: VariableResolvedDataType,
): Variable {
  const found = index.get(name);
  if (found === 'ambiguous') {
    throw new Error(`variable "${name}" exists in more than one local collection — cannot bind unambiguously`);
  }
  if (!found) throw new Error(`missing variable: ${name}`);
  if (found.resolvedType !== expectedType) {
    throw new Error(`variable "${name}" is ${found.resolvedType}, expected ${expectedType}`);
  }
  return found;
}

function textStyleFingerprint (input: TextStyleFingerprintInput): string {
  return JSON.stringify(input);
}

/**
 * lineHeight cannot bind: confirmed directly against a live file that Figma
 * always reads a bound variable's number as PIXELS, but Dialtone's
 * line-heights are unitless multipliers. Binding one collapses text to an
 * unreadable smear. Literal PERCENT is correct; a token change here needs a
 * rerun to catch up, same as any other literal.
 */
async function createTextStyles (specs: TextStyleSpec[]): Promise<CreateTextStylesResult> {
  const fontsNeeded = new Set(
    specs.map(s => JSON.stringify({ family: s.figmaFamily, style: s.fontStyleName })),
  );
  for (const key of fontsNeeded) await figma.loadFontAsync(JSON.parse(key) as FontName);

  const varIndex = indexVariablesByName(await figma.variables.getLocalVariablesAsync());
  const existingStyles = await figma.getLocalTextStylesAsync();
  const styleByName = new Map(existingStyles.map(s => [s.name, s]));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const errors: CreateTextStylesResult['errors'] = [];

  for (const spec of specs) {
    let isNew = false;
    let style: TextStyle | undefined;
    try {
      // Resolve every variable before touching the document: an existing
      // style must come away untouched if any lookup below fails, and a
      // newly-created one must not be left behind empty.
      const famVar = resolveVariable(varIndex, spec.fontFamily.variable, 'STRING');
      const sizeVar = resolveVariable(varIndex, spec.fontSize.variable, 'FLOAT');
      const weightVar = resolveVariable(varIndex, spec.fontWeight.variable, 'FLOAT');

      const existing = styleByName.get(spec.name);
      isNew = !existing;
      style = existing ?? figma.createTextStyle();

      const before = isNew ? null : textStyleFingerprint({
        fontFamily: style.fontName.family,
        fontStyleName: style.fontName.style,
        fontSizeVar: boundVarId(style.boundVariables, 'fontSize'),
        fontWeightVar: boundVarId(style.boundVariables, 'fontWeight'),
        fontFamilyVar: boundVarId(style.boundVariables, 'fontFamily'),
        lineHeight: style.lineHeight,
        textCase: style.textCase,
      });

      style.name = spec.name;

      // Baseline before binding, so setBoundVariable('fontWeight', …) has a
      // loaded starting point to resolve the nearest named style from.
      style.fontName = { family: spec.figmaFamily, style: spec.fontStyleName };
      style.setBoundVariable('fontFamily', famVar);
      style.setBoundVariable('fontSize', sizeVar);
      style.setBoundVariable('fontWeight', weightVar);

      const multiplier = Number.parseFloat(String(spec.lineHeight.value));
      style.lineHeight = { unit: 'PERCENT', value: multiplier * 100 };

      style.textCase = TEXT_CASE[spec.textCase] ?? 'ORIGINAL';

      if (isNew) {
        created.push(style.name);
      } else {
        const after = textStyleFingerprint({
          fontFamily: spec.figmaFamily,
          fontStyleName: spec.fontStyleName,
          fontSizeVar: sizeVar.id,
          fontWeightVar: weightVar.id,
          fontFamilyVar: famVar.id,
          lineHeight: style.lineHeight,
          textCase: style.textCase,
        });
        (before === after ? unchanged : updated).push(style.name);
      }
    } catch (e) {
      // A style this run itself created never survives a failed attempt —
      // otherwise it lingers as an empty, unbound orphan that matches this
      // spec's name on every future run and repeats the same error forever.
      if (isNew && style) style.remove();
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return {
    created, updated, unchanged, errors,
    totalStyles: created.length + updated.length + unchanged.length + errors.length,
  };
}

const EFFECT_BINDABLE_FIELDS = ['blur', 'color', 'offsetX', 'offsetY', 'spread'] as const;
type EffectBindableField = (typeof EFFECT_BINDABLE_FIELDS)[number];

interface CreateEffectStylesResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  errors: { name: string; error: string }[];
  totalStyles: number;
}

const EFFECT_FIELD_TYPE: Record<EffectBindableField, VariableResolvedDataType> = {
  blur: 'FLOAT',
  color: 'COLOR',
  offsetX: 'FLOAT',
  offsetY: 'FLOAT',
  spread: 'FLOAT',
};

/** `radius` is the field name `setBoundVariableForEffect` expects for blur. */
const EFFECT_FIELD_TO_API: Record<EffectBindableField, VariableBindableEffectField> = {
  blur: 'radius',
  color: 'color',
  offsetX: 'offsetX',
  offsetY: 'offsetY',
  spread: 'spread',
};

/**
 * Comparing `JSON.stringify` of a style's own `.effects`/`.paints` directly
 * against a freshly-built literal is unreliable two ways: Figma hands back
 * its own key order on read, which can differ from the literal's insertion
 * order with identical values, and a value that round-tripped through Figma's
 * storage can lose float precision our freshly-computed number still has —
 * confirmed directly: a literal gradient stop's red channel came back from
 * storage as 0.8274314999…, 3e-8 under our computed 0.8274315283…, close
 * enough to flip which side of a 6-decimal rounding boundary each landed on
 * and register as "changed" every run. Rebuilding both sides through the same
 * normalizer — fixed key order, floats rounded to 4 decimals rather than 6 —
 * clears that noise with a wide margin while still catching any real change,
 * which differs by orders of magnitude more than storage round-trip noise.
 */
function round4 (n: number): number {
  return Math.round(n * 1e4) / 1e4;
}

function roundColor (c: RGBA): RGBA {
  return { r: round4(c.r), g: round4(c.g), b: round4(c.b), a: round4(c.a) };
}

// We only ever WRITE DROP_SHADOW/INNER_SHADOW effects, but the "before"
// fingerprint reads whatever an existing style already has, which a human
// could have set to any member of the Effect union (LAYER_BLUR,
// BACKGROUND_BLUR, …). Reading shadow-only fields off one of those throws —
// confirmed directly: a pre-existing blur reached `roundColor(undefined)` and
// crashed before the style's effects were ever replaced, leaving the blur in
// place and repeating the same crash every subsequent run. Every other member
// gets a shape-appropriate, still-comparable fingerprint instead.
function normalizeEffect (e: Effect) {
  if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
    const bv = e.boundVariables;
    return {
      type: e.type,
      visible: e.visible,
      blendMode: e.blendMode,
      color: roundColor(e.color),
      offset: { x: round4(e.offset.x), y: round4(e.offset.y) },
      radius: round4(e.radius),
      spread: round4(e.spread ?? 0),
      boundVariables: {
        color: boundVarId(bv, 'color'),
        radius: boundVarId(bv, 'radius'),
        offsetX: boundVarId(bv, 'offsetX'),
        offsetY: boundVarId(bv, 'offsetY'),
        spread: boundVarId(bv, 'spread'),
      },
    };
  }
  return { type: e.type, visible: e.visible };
}

function effectsFingerprint (effects: readonly Effect[]): string {
  return JSON.stringify(effects.map(normalizeEffect));
}

/**
 * Every field here has a real variable — none of these are set as literals,
 * unlike a text style's lineHeight. Both light and dark share the same layer
 * count per shadow (the padding fix that made this possible), so one style,
 * with every field bound, renders correctly in both modes without needing a
 * per-mode style object, which Figma has no concept of.
 */
async function createEffectStyles (specs: EffectStyleSpec[]): Promise<CreateEffectStylesResult> {
  const varIndex = indexVariablesByName(await figma.variables.getLocalVariablesAsync());
  const existingStyles = await figma.getLocalEffectStylesAsync();
  const styleByName = new Map(existingStyles.map(s => [s.name, s]));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const errors: CreateEffectStylesResult['errors'] = [];

  for (const spec of specs) {
    let isNew = false;
    let style: EffectStyle | undefined;
    try {
      // Build and validate every layer's effect up front — no mutation of
      // the document happens until every variable in every layer resolves.
      const effects: Effect[] = spec.layers.map(layer => {
        let effect: Effect = {
          type: spec.isInset ? 'INNER_SHADOW' : 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 1 },
          offset: { x: 0, y: 0 },
          radius: 0,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL',
        };

        for (const field of EFFECT_BINDABLE_FIELDS) {
          const variable = resolveVariable(varIndex, layer.variables[field], EFFECT_FIELD_TYPE[field]);
          effect = figma.variables.setBoundVariableForEffect(effect, EFFECT_FIELD_TO_API[field], variable);
        }
        return effect;
      });

      const existing = styleByName.get(spec.name);
      isNew = !existing;
      style = existing ?? figma.createEffectStyle();
      const before = isNew ? null : effectsFingerprint(style.effects);
      style.name = spec.name;
      style.effects = effects;

      if (isNew) created.push(style.name);
      else (before === effectsFingerprint(effects) ? unchanged : updated).push(style.name);
    } catch (e) {
      if (isNew && style) style.remove();
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return {
    created, updated, unchanged, errors,
    totalStyles: created.length + updated.length + unchanged.length + errors.length,
  };
}

interface CreatePaintStylesResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  errors: { name: string; error: string }[];
  totalStyles: number;
}

/**
 * Figma's `gradientTransform` maps a point in the shape's own 0-1 space to
 * gradient space — the INVERSE direction of what the matrix's row/column
 * shape suggests — so it's the stop's *coefficients*, not a length, that
 * must shrink to make the visible line longer. Confirmed directly, rendering
 * both sides and reading pixels back: a pure rotation (the previous formula)
 * reproduces CSS's direction exactly but not its extent, because CSS's
 * gradient line on a non-axis-aligned angle is longer than the box's own
 * side (√2× at 45°/135° on a square) while a rotation alone stays unit
 * length — every diagonal gradient's stops landed too close to the center,
 * confirmed at 135°: stop 10%/90% rendered at ~22%/~78% instead.
 *
 * `dirX/dirY` is CSS's own gradient-line unit direction (0deg = up, clockwise
 * — see https://www.w3.org/TR/css-images-3/#linear-gradients); `length` is
 * that same spec's line-length formula for a unit square. Dividing the
 * direction by it is what makes a stop's coefficient in gradient space
 * shrink exactly enough to compensate for the line being longer, so a point
 * at a given fraction along CSS's longer line still reads back the same
 * fraction here. The perpendicular row stays a plain unit rotation — no
 * length correction needed, since nothing about it depends on the box's
 * aspect ratio along the gradient axis.
 */
function gradientTransform (angleDeg: number): Transform {
  const rad = angleDeg * Math.PI / 180;
  const dirX = Math.sin(rad);
  const dirY = -Math.cos(rad);
  const length = Math.abs(Math.sin(rad)) + Math.abs(Math.cos(rad));
  const a = dirX / length;
  const b = dirY / length;
  const c = -b;
  const d = a;
  return [
    [a, b, 0.5 * (1 - a - b)],
    [c, d, 0.5 * (1 - c - d)],
  ];
}

function normalizeColorStop (s: ColorStop) {
  return {
    position: round4(s.position),
    color: roundColor(s.color),
    boundColor: boundVarId(s.boundVariables, 'color'),
  };
}

function normalizePaint (p: Paint) {
  if (p.type !== 'GRADIENT_LINEAR') return p;
  return {
    type: p.type,
    visible: p.visible,
    opacity: round4(p.opacity ?? 1),
    blendMode: p.blendMode,
    gradientTransform: p.gradientTransform.map(row => row.map(round4)),
    gradientStops: p.gradientStops.map(normalizeColorStop),
  };
}

function paintsFingerprint (paints: readonly Paint[]): string {
  return JSON.stringify(paints.map(normalizePaint));
}

const MAX_ALIAS_HOPS = 10;

/**
 * A bound colour variable's value at a given mode can itself be a
 * `VariableAlias` rather than an `RGBA` — Dialtone's semantic-to-primitive
 * chains are exactly this shape — so reading `valuesByMode[modeId]` once and
 * casting straight to `RGBA` can silently produce a color with undefined
 * channels. Follows the chain through the collection's own `defaultModeId`
 * (not an arbitrary object key) until it lands on a literal, bounded so a
 * cycle fails loudly instead of hanging.
 */
async function resolveColor (variable: Variable): Promise<RGBA> {
  let current: Variable = variable;
  for (let hop = 0; hop < MAX_ALIAS_HOPS; hop++) {
    const collection = await figma.variables.getVariableCollectionByIdAsync(current.variableCollectionId);
    if (!collection) throw new Error(`missing variable collection for "${current.name}"`);
    const value = current.valuesByMode[collection.defaultModeId];
    if (value && typeof value === 'object' && 'type' in value && value.type === 'VARIABLE_ALIAS') {
      const next = await figma.variables.getVariableByIdAsync(value.id);
      if (!next) throw new Error(`missing variable aliased from "${current.name}"`);
      current = next;
      continue;
    }
    return value as RGBA;
  }
  throw new Error(`colour alias chain from "${variable.name}" is more than ${MAX_ALIAS_HOPS} hops deep`);
}

/**
 * A bound stop still needs a literal `color` alongside `boundVariables` —
 * Figma has no dedicated `setBoundVariableForColorStop` helper, so the alias
 * is set directly on the object literal, and the literal colour is used as
 * the fallback swatch until the variable resolves.
 */
async function createPaintStyles (specs: PaintStyleSpec[]): Promise<CreatePaintStylesResult> {
  const varIndex = indexVariablesByName(await figma.variables.getLocalVariablesAsync());
  const existingStyles = await figma.getLocalPaintStylesAsync();
  const styleByName = new Map(existingStyles.map(s => [s.name, s]));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const errors: CreatePaintStylesResult['errors'] = [];

  for (const spec of specs) {
    let isNew = false;
    let style: PaintStyle | undefined;
    try {
      // Resolve every stop's variable before touching the document.
      const stops: ColorStop[] = await Promise.all(spec.stops.map(async stop => {
        if (stop.variable) {
          const variable = resolveVariable(varIndex, stop.variable, 'COLOR');
          const resolved = await resolveColor(variable);
          return {
            position: stop.position,
            color: { r: resolved.r, g: resolved.g, b: resolved.b, a: resolved.a ?? 1 },
            boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } },
          };
        }
        const c = stop.color!;
        return { position: stop.position, color: { r: c.r, g: c.g, b: c.b, a: c.a ?? 1 } };
      }));

      const paints: Paint[] = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: gradientTransform(spec.angleDeg),
        gradientStops: stops,
        visible: true,
        opacity: 1,
        blendMode: 'NORMAL',
      }];

      const existing = styleByName.get(spec.name);
      isNew = !existing;
      style = existing ?? figma.createPaintStyle();
      const before = isNew ? null : paintsFingerprint(style.paints);
      style.name = spec.name;
      style.paints = paints;

      if (isNew) created.push(style.name);
      else (before === paintsFingerprint(paints) ? unchanged : updated).push(style.name);
    } catch (e) {
      if (isNew && style) style.remove();
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return {
    created, updated, unchanged, errors,
    totalStyles: created.length + updated.length + unchanged.length + errors.length,
  };
}

figma.showUI(__html__, { width: 360, height: 400 });

figma.ui.onmessage = async (msg: {
  type: string;
  specs?: TextStyleSpec[] | EffectStyleSpec[] | PaintStyleSpec[];
}) => {
  if (msg.type === 'close') {
    figma.closePlugin();
    return;
  }
  try {
    if (msg.type === 'run-text-styles') {
      const result = await createTextStyles((msg.specs ?? []) as TextStyleSpec[]);
      figma.ui.postMessage({ type: 'result', result });
    } else if (msg.type === 'run-effect-styles') {
      const result = await createEffectStyles((msg.specs ?? []) as EffectStyleSpec[]);
      figma.ui.postMessage({ type: 'result', result });
    } else if (msg.type === 'run-paint-styles') {
      const result = await createPaintStyles((msg.specs ?? []) as PaintStyleSpec[]);
      figma.ui.postMessage({ type: 'result', result });
    }
  } catch (e) {
    figma.ui.postMessage({ type: 'error', error: String(e) });
  }
};
