/**
 * Generate the Code Connect template of every synced set from its config.
 *
 *   node sync-scripts/code-connect.mjs --target main           # write code-connect/Dt*.figma.ts
 *   node sync-scripts/code-connect.mjs --target main --check   # fail if a file differs from what would be written
 *
 * WHY GENERATED. The config already says how a Figma variant maps to a Vue prop: `props(combo)` is
 * what the harness mounts for that variant. A template written by hand says the same thing a second
 * time and drifts the moment an axis gains a value. So the mapping is DERIVED, not copied:
 *
 *   - For each axis value, the props `props()` returns are compared with the DEFAULT variant's. What
 *     differs is what the template writes for that value (`kind="critical"`, `:size="400"`, `loading`).
 *     What does not is a default, and is left out, so the snippet reads like code a person writes.
 *   - A prop whose value is text the harness injected (`textProps`, and the label) is read from the
 *     Figma TEXT property instead, so retyping the label in Figma changes the snippet.
 *   - An axis in `effectiveDefaults` has a default the component does not state (Collapsible is open
 *     by default but its `open` prop is null), so its true value is always written and false is not.
 *
 * What `props()` cannot say lives in a small `codeConnect` block on the config: the source file,
 * attributes that are always written (`circle`, `link`), the icon and native slots and when they
 * appear, and whether the component has text content. See `configs/README.md`.
 *
 * One template per set in `code-connect/`, committed so a change to one is reviewable; the icon
 * templates (626) are generated separately and gitignored (`code-connect-icons.mjs`).
 */
import { TARGET } from './target.mjs';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COMPONENTS, humanKey } from './component-axes.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '');
const OUT = `${ROOT}/code-connect`;
const CHECK = process.argv.includes('--check');
const ids = JSON.parse(readFileSync(`${ROOT}/sync-scripts/build-data/${TARGET.name}/set-ids.json`, 'utf8'));

const kebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const q = s => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";   // a JS string literal
/** A JS value as source, with single quotes, so it can sit inside a double-quoted attribute. */
const lit = (v) => {
  if (Array.isArray(v)) return '[' + v.map(lit).join(', ') + ']';
  if (v && typeof v === 'object') return '{ ' + Object.entries(v).map(([k, x]) => `${k}: ${lit(x)}`).join(', ') + ' }';
  return typeof v === 'string' ? q(v) : String(v);
};

/** The axis whose Figma name is `figmaName` ("Show Action" is `showAction`). */
const axisOf = (cfg, figmaName) => Object.keys(cfg.axes).find(a => humanKey(a) === figmaName);

function generate (key, cfg) {
  const hints = cfg.codeConnect;
  const setId = (ids[key] || {}).figmaSetId;
  if (!hints || !setId) return null;

  const spec = JSON.parse(readFileSync(`${ROOT}/sync-scripts/build-data/${key}-spec.json`, 'utf8'));
  const found = (spec.variants.find(v => v.name === spec.defaultVariant) || {}).combo;
  if (!found) throw new Error(`${key}: the default variant ${spec.defaultVariant} is not among the variants`);
  // The baseline is what the CODE defaults to. The Figma default can be the closest valid variant
  // instead (a circular button cannot be primary, so DtButtonIcon's default is clear), and the spec
  // records the code's own default when they differ.
  const base = { ...found, ...((spec.defaultAdjusted || {}).wanted || {}) };
  const baseProps = cfg.props(base);

  // Text the harness injected, and the Figma TEXT property each one becomes.
  const injected = new Map(Object.entries(cfg.textProps || {}));
  if (cfg.label && hints.label !== false) injected.set(cfg.label, 'Label');
  const textVars = new Map();   // Figma TEXT name -> variable
  const textVar = (name) => {
    if (!textVars.has(name)) textVars.set(name, 'text' + (textVars.size + 1));
    return textVars.get(name);
  };

  /** One attribute as a JS expression that evaluates to its source text. */
  const attr = (prop, value) => {
    const name = kebab(prop);
    if (value === undefined || value === null || value === '') return null;
    if (typeof value === 'string') {
      if (injected.has(value)) return `${q(name + '="')} + ${textVar(injected.get(value))} + ${q('"')}`;
      return q(`${name}="${value.replace(/"/g, '&quot;')}"`);
    }
    if (value === true) return q(name);
    if (typeof value === 'number' || value === false) return q(`:${name}="${value}"`);
    return q(`:${name}="${lit(value)}"`);
  };

  const lines = [];
  const used = [];   // variable names to join into the attribute list
  const effective = new Set(Object.keys(cfg.effectiveDefaults || {}));

  // Props that are always written: injected text that does not depend on an axis.
  const always = [...(hints.always || []).map(a => q(a))];
  for (const [prop, value] of Object.entries(baseProps)) {
    if (typeof value === 'string' && injected.has(value)) {
      const everyCombo = Object.keys(cfg.axes).every(a => cfg.axes[a].every(v => cfg.props({ ...base, [a]: v })[prop] === value));
      if (everyCombo) always.push(attr(prop, value));
    }
  }

  for (const axis of Object.keys(cfg.axes)) {
    const map = {};
    let any = false;
    // The props this axis moves: the same in every value, they are not its business.
    const perValue = cfg.axes[axis].map(v => cfg.props({ ...base, [axis]: v }));
    const moves = new Set();
    for (const p of perValue) for (const prop of new Set([...Object.keys(p), ...Object.keys(perValue[0])])) {
      if (JSON.stringify(p[prop]) !== JSON.stringify(perValue[0][prop])) moves.add(prop);
    }
    cfg.axes[axis].forEach((v, i) => {
      const props = perValue[i];
      const parts = [];
      for (const prop of moves) {
        if ((hints.skipProps || []).includes(prop) || prop.startsWith('__')) continue;
        const changed = JSON.stringify(props[prop]) !== JSON.stringify(baseProps[prop]);
        if (effective.has(axis)) {
          // The default is not the component's own: write what is on, never what is off.
          if (props[prop] === true || (changed && typeof props[prop] !== 'boolean')) parts.push(attr(prop, props[prop]));
        } else if (changed) {
          parts.push(attr(prop, props[prop]));
        }
      }
      const expr = parts.filter(Boolean).join(" + ' ' + ");
      map[String(v)] = expr || "''";
      if (expr) any = true;
    });
    if (!any) continue;
    const name = axis;
    lines.push(`const ${name} = instance.getEnum(${q(humanKey(axis))}, { ${Object.entries(map).map(([k, e]) => `${q(k)}: ${e}`).join(', ')} })`);
    used.push(name);
  }

  // The label is the default slot's text; the other text is read where an attribute uses it.
  const label = cfg.label && hints.label !== false ? textVar('Label') : null;

  /**
   * A value the code needs and Figma has no property for. DtSegmentedControlItem's `value` is the text
   * its group's v-model matches, so it is made from the label ("Item 1" is "item-1").
   */
  const derive = hints.derive || [];
  const deriveLines = derive.map(d => `const ${d.name} = slug(${textVar(d.from)})`);
  const deriveAttrs = derive.map(d => `${q(d.attr + '="')} + ${d.name} + ${q('"')}`);

  /**
   * Data this template hands to its PARENT's template (`metadata.props`), which reads it by running its
   * children's templates. A group takes its selected item as v-model, while Figma keeps "selected" on each
   * item, so the item exposes `{ value, selected }` and the group writes the one that is selected.
   */
  const expose = hints.expose || [];
  const exposeLines = expose.filter(e => e.axis).map((e) => {
    const a = axisOf(cfg, e.axis);
    if (!a) throw new Error(`${key}: codeConnect exposes the axis "${e.axis}" the config does not have`);
    return `const ${e.name} = instance.getEnum(${q(e.axis)}, { ${cfg.axes[a].map(v => `${q(String(v))}: ${String(v) === String(e.is)}`).join(', ')} })`;
  });
  const exposeProps = expose.map(e => (e.from && e.from !== e.name ? `${e.name}: ${e.from}` : e.name));

  const pick = hints.pick;   // { attr, from, when }: the child whose `when` is true gives its `from`
  const pickLines = pick ? [
    '// The items are this group\'s children: each one\'s template says whether it is selected and what its value is.',
    'const children = instance.findConnectedInstances((n) => true).map((c) => c.executeTemplate().metadata.props).filter(Boolean)',
    `const chosen = children.find((p) => p.${pick.when})`,
  ] : [];
  const pickAttrs = pick ? [`chosen ? ${q(pick.attr + '="')} + chosen.${pick.from} + ${q('"')} : ''`] : [];

  const attrsList = [...always, ...deriveAttrs, ...pickAttrs, ...used].join(',\n  ');
  const attrsLine = `const attrs = [\n  ${attrsList},\n].filter(Boolean).join(' ')`;

  // Icons: a swap (and, where the slot is additive, a visibility toggle).
  const icons = hints.icons || [];
  const children = [];   // [rank, name, code]
  const RANK = ['leading', 'blockStartIcon', 'startIcon', 'default', 'blockEndIcon', 'endIcon', 'trailing', 'action', 'content'];
  const rank = n => (RANK.includes(n) ? RANK.indexOf(n) : RANK.length);
  const condition = (when) => Object.entries(when || {}).map(([figmaName, value]) => {
    const a = axisOf(cfg, figmaName);
    if (!a) throw new Error(`${key}: codeConnect names an axis "${figmaName}" the config does not have`);
    return `instance.getEnum(${q(figmaName)}, { ${cfg.axes[a].map(v => `${q(String(v))}: ${q(String(v))}`).join(', ')} }) === ${q(String(value))}`;
  }).join(' && ');

  const iconCode = [];
  icons.forEach((ic, i) => {
    const cond = [ic.toggle ? `instance.getBoolean(${q(ic.toggle)})` : '', condition(ic.when)].filter(Boolean).join(' && ');
    iconCode.push(`const icon${i + 1} = ${cond ? cond + ' ? ' : ''}iconSnippet(instance.getInstanceSwap(${q(ic.swap)}))${cond ? ' : undefined' : ''}`);
    children.push([rank(ic.vue), ic.vue, `\${icon${i + 1} ? figma.code\`\n  <template #${ic.vue}="{ iconSize }">\${icon${i + 1}}</template>\` : ''}`]);
  });

  const slotCode = [];
  let needsContentCheck = false;
  (hints.slots || []).forEach((s, i) => {
    let value;
    if (s.when === 'always') value = `instance.getSlot(${q(s.figma)})`;
    else if (s.when === 'content') { needsContentCheck = true; value = `slotHasContent(${q(s.figma)}) ? instance.getSlot(${q(s.figma)}) : undefined`; }
    else value = `${condition(s.when)} ? instance.getSlot(${q(s.figma)}) : undefined`;
    slotCode.push(`const slot${i + 1} = ${value}`);
    children.push([rank(s.vue), s.vue, s.vue === 'default'
      ? `\${slot${i + 1} ? figma.code\`\n  \${slot${i + 1}}\` : ''}`
      : `\${slot${i + 1} ? figma.code\`\n  <template #${s.vue}>\${slot${i + 1}}</template>\` : ''}`]);
  });
  if (label) children.push([rank('default'), 'default', `\n  \${${label}}`]);
  children.sort((a, b) => a[0] - b[0]);

  const tag = cfg.component;
  const open = `<${tag}\${attrs ? ' ' + attrs : ''}`;
  const body = hints.selfClosing || !children.length
    ? `figma.code\`${open} />\``
    : `figma.code\`${open}>${children.map(c => c[2]).join('')}\n</${tag}>\``;

  const textLines = [...textVars].map(([name, v]) => `const ${v} = instance.getString(${q(name)})`);
  const sourceFile = hints.source || `packages/dialtone-vue/components/${tag.replace(/^Dt/, '')}/${tag.replace(/^Dt/, '')}.vue`;

  const out = [
    `// url=https://www.figma.com/design/${TARGET.fileKey}/Dialtone-2026?node-id=${setId.replace(':', '-')}`,
    `// source=${sourceFile}`,
    `// component=${tag}`,
    '// GENERATED by sync-scripts/code-connect.mjs from the config: edit the config, not this file.',
    "import figma from 'figma'",
    'const instance = figma.selectedInstance',
    '',
    ...textLines,
    ...(derive.length || pick ? ["const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')"] : []),
    ...deriveLines,
    ...exposeLines,
    ...pickLines,
    ...lines,
    attrsLine,
    '',
  ];
  if (icons.length) {
    out.push(
      '// The icon\'s own template says which DtIcon component it is; the button hands its slot the size.',
      'const iconSnippet = (swapped) => {',
      "  if (!swapped || swapped.type !== 'INSTANCE') return undefined",
      '  const result = swapped.executeTemplate()',
      '  const name = result.metadata && result.metadata.props && result.metadata.props.component',
      '  return name ? figma.code`<${name} :size="iconSize" />` : result.example',
      '}',
      ...iconCode,
      '',
    );
  }
  if (needsContentCheck) {
    out.push(
      '// A native slot always holds a spacer and getSlot() only returns a reference to it, so whether',
      '// something was dropped in is read from the text or instances under it.',
      'const slotHasContent = (name) => instance.findLayers((n) => n.type === \'TEXT\' || n.type === \'INSTANCE\', { path: [name] }).length > 0',
    );
  }
  if (slotCode.length) out.push(...slotCode, '');
  out.push(
    'export default {',
    `  example: ${body},`,
    `  imports: [${q(`import { ${tag} } from '@dialpad/dialtone-vue'`)}],`,
    `  id: ${q('dt-' + kebab(cfg.page))},`,
    `  metadata: { nestable: true${exposeProps.length ? `, props: { ${exposeProps.join(', ')} }` : ''} },`,
    '}',
    '',
  );
  return { file: `Dt${cfg.page}.figma.ts`, text: out.join('\n') };
}

mkdirSync(OUT, { recursive: true });
let different = 0, written = 0;
for (const [key, cfg] of Object.entries(COMPONENTS)) {
  const g = generate(key, cfg);
  if (!g) continue;
  const path = `${OUT}/${g.file}`;
  if (CHECK) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== g.text) { console.log(`differs: code-connect/${g.file}`); different++; }
  } else {
    writeFileSync(path, g.text);
    written++;
  }
}
if (CHECK) {
  console.log(different ? `${different} template(s) out of date: run without --check` : 'code-connect templates match the configs');
  process.exit(different ? 1 : 0);
}
console.log(`wrote ${written} templates in code-connect/`);
