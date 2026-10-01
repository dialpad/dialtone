/// <reference types="@figma/plugin-typings" />

/**
 * Runs inside Figma's plugin sandbox: full Plugin API access, no fetch/DOM.
 * The spec is resolved in Node (`src/resolve_text_styles.ts`) and handed in
 * by `ui.html`, which does have fetch — see that file for why.
 */

interface TextStyleField {
  value: string | number;
  variable: string;
}

interface TextStyleSpec {
  name: string;
  fontFamily: TextStyleField;
  fontSize: TextStyleField;
  fontWeight: TextStyleField;
  lineHeight: TextStyleField;
  textCase: string;
  fontStyleName: string;
  figmaFamily: string;
}

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

  const vars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map(vars.map(v => [v.name, v]));
  const existingStyles = await figma.getLocalTextStylesAsync();
  const styleByName = new Map(existingStyles.map(s => [s.name, s]));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const errors: CreateTextStylesResult['errors'] = [];

  for (const spec of specs) {
    try {
      let style = styleByName.get(spec.name);
      const isNew = !style;
      if (!style) style = figma.createTextStyle();

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

      const famVar = varByName.get(spec.fontFamily.variable);
      const sizeVar = varByName.get(spec.fontSize.variable);
      const weightVar = varByName.get(spec.fontWeight.variable);
      if (!famVar || !sizeVar || !weightVar) {
        const missing = !famVar
          ? spec.fontFamily.variable
          : !sizeVar ? spec.fontSize.variable : spec.fontWeight.variable;
        throw new Error(`missing variable: ${missing}`);
      }
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
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return { created, updated, unchanged, errors, totalStyles: (await figma.getLocalTextStylesAsync()).length };
}

const EFFECT_BINDABLE_FIELDS = ['blur', 'color', 'offsetX', 'offsetY', 'spread'] as const;
type EffectBindableField = (typeof EFFECT_BINDABLE_FIELDS)[number];

interface EffectLayerSpec {
  variables: Record<EffectBindableField, string>;
}

interface EffectStyleSpec {
  name: string;
  isInset: boolean;
  layers: EffectLayerSpec[];
}

interface CreateEffectStylesResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  errors: { name: string; error: string }[];
  totalStyles: number;
}

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

// We only ever build DROP_SHADOW/INNER_SHADOW effects, so color/offset/
// radius/spread are always present — no need to guard per field.
function normalizeEffect (e: Effect) {
  const shadow = e as Effect & { color: RGBA; offset: Vector; radius: number; spread?: number };
  const bv = shadow.boundVariables;
  return {
    type: shadow.type,
    visible: shadow.visible,
    blendMode: shadow.blendMode,
    color: roundColor(shadow.color),
    offset: { x: round4(shadow.offset.x), y: round4(shadow.offset.y) },
    radius: round4(shadow.radius),
    spread: round4(shadow.spread ?? 0),
    boundVariables: {
      color: boundVarId(bv, 'color'),
      radius: boundVarId(bv, 'radius'),
      offsetX: boundVarId(bv, 'offsetX'),
      offsetY: boundVarId(bv, 'offsetY'),
      spread: boundVarId(bv, 'spread'),
    },
  };
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
  const vars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map(vars.map(v => [v.name, v]));
  const existingStyles = await figma.getLocalEffectStylesAsync();
  const styleByName = new Map(existingStyles.map(s => [s.name, s]));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const errors: CreateEffectStylesResult['errors'] = [];

  for (const spec of specs) {
    try {
      let style = styleByName.get(spec.name);
      const isNew = !style;
      if (!style) style = figma.createEffectStyle();
      const before = isNew ? null : effectsFingerprint(style.effects);
      style.name = spec.name;

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
          const variable = varByName.get(layer.variables[field]);
          if (!variable) throw new Error(`missing variable: ${layer.variables[field]}`);
          effect = figma.variables.setBoundVariableForEffect(effect, EFFECT_FIELD_TO_API[field], variable);
        }
        return effect;
      });

      style.effects = effects;
      if (isNew) created.push(style.name);
      else (before === effectsFingerprint(effects) ? unchanged : updated).push(style.name);
    } catch (e) {
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return { created, updated, unchanged, errors, totalStyles: (await figma.getLocalEffectStylesAsync()).length };
}

interface GradientStopSpec {
  position: number;
  variable?: string;
  color?: { r: number; g: number; b: number; a?: number };
}

interface PaintStyleSpec {
  name: string;
  angleDeg: number;
  stops: GradientStopSpec[];
}

interface CreatePaintStylesResult {
  created: string[];
  updated: string[];
  unchanged: string[];
  errors: { name: string; error: string }[];
  totalStyles: number;
}

/**
 * Figma's gradientTransform is a 2x3 matrix, not an angle — CSS's angle
 * convention doesn't map onto it directly. Calibrated empirically against a
 * red-to-blue test gradient at 0/90/135deg (screenshotted and compared to
 * what the same angle renders as in CSS): the sign that matches CSS is
 * `(90 - angleDeg)`, not the more obvious `(angleDeg - 90)`.
 */
function gradientTransform (angleDeg: number): Transform {
  const phi = (90 - angleDeg) * Math.PI / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  return [
    [cos, -sin, 0.5 - 0.5 * cos + 0.5 * sin],
    [sin, cos, 0.5 - 0.5 * sin - 0.5 * cos],
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

/**
 * A bound stop still needs a literal `color` alongside `boundVariables` —
 * Figma has no dedicated `setBoundVariableForColorStop` helper, so the alias
 * is set directly on the object literal, and the literal colour is used as
 * the fallback swatch until the variable resolves.
 */
async function createPaintStyles (specs: PaintStyleSpec[]): Promise<CreatePaintStylesResult> {
  const vars = await figma.variables.getLocalVariablesAsync();
  const varByName = new Map(vars.map(v => [v.name, v]));
  const existingStyles = await figma.getLocalPaintStylesAsync();
  const styleByName = new Map(existingStyles.map(s => [s.name, s]));

  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const errors: CreatePaintStylesResult['errors'] = [];

  for (const spec of specs) {
    try {
      let style = styleByName.get(spec.name);
      const isNew = !style;
      if (!style) style = figma.createPaintStyle();
      const before = isNew ? null : paintsFingerprint(style.paints);
      style.name = spec.name;

      const stops: ColorStop[] = spec.stops.map(stop => {
        if (stop.variable) {
          const variable = varByName.get(stop.variable);
          if (!variable) throw new Error(`missing variable: ${stop.variable}`);
          const firstModeId = Object.keys(variable.valuesByMode)[0];
          const resolved = variable.valuesByMode[firstModeId] as RGBA;
          return {
            position: stop.position,
            color: { r: resolved.r, g: resolved.g, b: resolved.b, a: resolved.a ?? 1 },
            boundVariables: { color: { type: 'VARIABLE_ALIAS', id: variable.id } },
          };
        }
        const c = stop.color!;
        return { position: stop.position, color: { r: c.r, g: c.g, b: c.b, a: c.a ?? 1 } };
      });

      const paints: Paint[] = [{
        type: 'GRADIENT_LINEAR',
        gradientTransform: gradientTransform(spec.angleDeg),
        gradientStops: stops,
        visible: true,
        opacity: 1,
        blendMode: 'NORMAL',
      }];
      style.paints = paints;

      if (isNew) created.push(style.name);
      else (before === paintsFingerprint(paints) ? unchanged : updated).push(style.name);
    } catch (e) {
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return { created, updated, unchanged, errors, totalStyles: (await figma.getLocalPaintStylesAsync()).length };
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
