/**
 * Extract Button's disabled-state colours in BOTH modes.
 *
 * Disabled states are computed — `color-mix()` and relative colours over the base
 * token, with per-kind/importance chroma and opacity adjustments — so no single
 * Dialtone token backs them (D-3). Baked as literals they are correct in Light and
 * wrong in Dark, which the dual-mode sweep surfaced as 180 findings.
 *
 * This reads the real rendered value per (kind, importance) per mode so those
 * values can become variables that follow the mode.
 */
import './pin-cwd.mjs';   // launch directory must not matter
import { writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';
import { converter, parse as parseColor, clampChroma, displayable } from 'culori';
import { COMPONENTS } from './component-axes.mjs';

const HARNESS = new URL('./verify-harness/', import.meta.url).pathname;
const toRgb = converter('rgb');
const cfg = COMPONENTS.button;

function toFigmaRGB (css) {
  if (!css) return null;
  const c = parseColor(css);
  if (!c) return null;
  const mapped = displayable({ mode: 'rgb', ...toRgb(c) }) ? toRgb(c) : toRgb(clampChroma(c, 'rgb'));
  return {
    r: +Math.min(1, Math.max(0, mapped.r)).toFixed(6),
    g: +Math.min(1, Math.max(0, mapped.g)).toFixed(6),
    b: +Math.min(1, Math.max(0, mapped.b)).toFixed(6),
    a: +(c.alpha ?? 1).toFixed(4),
  };
}

const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js', server: { port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${server.httpServer.address().port}/`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });

const KINDS = cfg.axes.kind;
const IMPORTANCES = cfg.axes.importance;
const rows = {};

for (const mode of ['Light', 'Dark']) {
  await page.evaluate(m => window.__setMode(m), mode === 'Light' ? 'light' : 'dark');
  for (const kind of KINDS) {
    for (const importance of IMPORTANCES) {
      if (kind === 'muted' && importance === 'primary') continue;
      await page.evaluate(([k, i]) => window.__setProps('DtButton',
        { kind: k, importance: i, size: 300, disabled: true }, { label: 'Button', slots: [] }), [kind, importance]);
      await page.evaluate(() => { void document.querySelector('#root > *').offsetWidth; });
      const dom = await page.evaluate(() => window.__anatomy());
      const label = (dom.children || []).find(c => c.classes.some(x => x.includes('__label')));
      const key = `${kind}/${importance}`;
      rows[key] = rows[key] || { kind, importance };
      rows[key][`${mode}_text`] = toFigmaRGB((label || dom).style.color);
      rows[key][`${mode}_bg`] = toFigmaRGB(dom.style.backgroundColor);
      rows[key][`${mode}_border`] = parseFloat(dom.style.borderTopWidth)
        ? toFigmaRGB(dom.style.borderTopColor) : null;
    }
  }
}

await browser.close();
await server.close();

// Only emit a variable where the two modes actually differ — an identical pair
// needs no variable, and inventing one would add a token for nothing.
const out = [];
const differs = (a, b) => !a || !b || ['r', 'g', 'b', 'a'].some(k => Math.abs(a[k] - b[k]) > 0.002);
for (const r of Object.values(rows)) {
  for (const [field, prefix] of [['text', 'foreground'], ['bg', 'background'], ['border', 'border']]) {
    const light = r[`Light_${field}`], dark = r[`Dark_${field}`];
    if (!light || !dark) continue;
    if ((light.a ?? 1) < 0.005) continue;                 // transparent: nothing painted
    // Dialtone names kind=default as `base`, and omits the importance segment for
    // `clear`. Matching that exactly means a future real Dialtone token is a 1:1
    // swap for these derived ones.
    const k = r.kind === 'default' ? 'base' : r.kind;
    const name = r.importance === 'clear'
      ? `action/color/${prefix}/${k}/disabled`
      : `action/color/${prefix}/${k}/${r.importance}/disabled`;
    out.push({ name, kind: r.kind, importance: r.importance, field, light, dark, modesDiffer: differs(light, dark) });
  }
}

writeFileSync('sync-scripts/disabled-vars.json', JSON.stringify(out, null, 2));
console.log(`${out.length} candidate variables (${out.filter(o => o.modesDiffer).length} where the modes differ)\n`);
for (const o of out) {
  const f = c => `${[c.r, c.g, c.b].map(x => Math.round(x * 255)).join(',')} a=${c.a}`;
  console.log(`${o.modesDiffer ? ' ' : '='} ${o.name.padEnd(52)} L ${f(o.light).padEnd(22)} D ${f(o.dark)}`);
}
console.log('\nwrote sync-scripts/disabled-vars.json');
