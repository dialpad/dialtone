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
  errors: { name: string; error: string }[];
  totalStyles: number;
}

const TEXT_CASE: Record<string, TextCase> = {
  none: 'ORIGINAL',
  uppercase: 'UPPER',
  lowercase: 'LOWER',
  capitalize: 'TITLE',
};

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
  const errors: CreateTextStylesResult['errors'] = [];

  for (const spec of specs) {
    try {
      let style = styleByName.get(spec.name);
      const isNew = !style;
      if (!style) style = figma.createTextStyle();
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

      (isNew ? created : updated).push(style.name);
    } catch (e) {
      errors.push({ name: spec.name, error: String(e) });
    }
  }

  return { created, updated, errors, totalStyles: (await figma.getLocalTextStylesAsync()).length };
}

figma.showUI(__html__, { width: 360, height: 420 });

figma.ui.onmessage = async (msg: { type: string; specs?: TextStyleSpec[] }) => {
  if (msg.type !== 'run-text-styles') return;
  try {
    const result = await createTextStyles(msg.specs ?? []);
    figma.ui.postMessage({ type: 'result', result });
  } catch (e) {
    figma.ui.postMessage({ type: 'error', error: String(e) });
  }
};
