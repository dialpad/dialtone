// Which components render with PLAUSIBLE props? Empirical, because guessing a prop API
// from a props block missed that DtInput's control carries `d-textarea` not `d-input`.
import './pin-cwd.mjs';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const HARNESS = new URL('./verify-harness/', import.meta.url).pathname;
const server = await createServer({ root: HARNESS, configFile: HARNESS + 'vite.config.js',
  server: { port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${server.httpServer.address().port}/`);
await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });
await page.evaluate(() => window.__setMode('light'));

const TRIALS = [
  // Round 2 candidates: self-contained and prop-driven, so no slot-content story is needed
  // before they can be measured. Props are best guesses from each component's props block;
  // the point of this script is that a guess gets checked rather than assumed.
  ['DtTab', { label: 'Tab', id: 't1', panelId: 'p1' }],
  ['DtSegmentedControl', { modelValue: 'a' }],
  ['DtCodeblock', { language: 'js' }],
  ['DtEmptyState', { title: 'Nothing here', description: 'Try again' }],
  ['DtLoader', {}],
  ['DtSkeletonShape', { width: '100px', height: '20px' }],
  ['DtSkeletonText', { paragraphOptions: { rows: 2 } }],
  ['DtListItem', { navigationType: 'none' }],
  ['DtSplitButton', { label: 'Action' }],
  ['DtModeIsland', {}],
  ['DtCollapsible', { anchorText: 'More' }],
  ['DtTextList', { listStyle: 'disc' }],
  ['DtDescriptionList', {}],
  ['DtValidationMessages', { validationMessages: [{ message: 'Required', type: 'error' }] }],
  ['DtProgressCircle', { value: 60 }],
  ['DtIllustration', { name: 'access-denied' }],
];

for (const [name, props] of TRIALS) {
  // RELOAD between trials. A render error leaves the Vue app unmounted, so every
  // subsequent probe reports "rendered nothing" whatever its props — which made two
  // earlier runs look like 14 unrenderable components when the truth was one throw
  // followed by 13 meaningless readings. The first failure poisons everything after it.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.__anatomy === 'function', null, { timeout: 30000 });
  await page.evaluate(() => window.__setMode('light'));
  const r = await page.evaluate(async ([n, p]) => {
    try {
      const ok = await window.__setProps(n, p, { label: 'Label' });
      if (!ok) return { err: 'rendered nothing' };
      const a = window.__anatomy();
      if (!a) return { err: 'no anatomy' };
      let nodes = 0, depth = 0, texts = 0, svgs = 0;
      const walk = (x, d) => {
        nodes++; depth = Math.max(depth, d);
        if (x.text) texts++;
        if (x.tag === 'svg') svgs++;
        (x.children || []).forEach(c => walk(c, d + 1));
      };
      walk(a, 0);
      return { tag: a.tag, cls: (a.classes || [])[0] || '', nodes, depth, texts, svgs,
        w: a.box && +a.box.w.toFixed(1), h: a.box && +a.box.h.toFixed(1) };
    } catch (e) { return { err: String(e && e.message || e).slice(0, 70) }; }
  }, [name, props]);
  const keys = Object.keys(props).join(',') || '(none)';
  console.log(r.err
    ? `${name.padEnd(20)} ✗  ${r.err.padEnd(24)} props: ${keys}`
    : `${name.padEnd(20)} ok ${String(r.nodes).padStart(3)}n d${r.depth} ${String(r.texts)}txt ${String(r.svgs)}svg `
      + `${String(r.w).padStart(6)}x${String(r.h).padEnd(6)} ${r.tag}.${r.cls}`);
}
await browser.close(); await server.close();
