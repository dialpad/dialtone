/**
 * Component thumb generator (PNG screenshot mode).
 *
 * Usage (from repo root):
 *   Single:    node apps/dialtone-documentation/scripts/thumbs/generate.mjs --component=button
 *   All:       node apps/dialtone-documentation/scripts/thumbs/generate.mjs
 *   Force:     node apps/dialtone-documentation/scripts/thumbs/generate.mjs --force
 *
 * Override Chromium binary if Playwright's bundled headless shell isn't installed:
 *   PLAYWRIGHT_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node …
 */

import { createServer } from 'vite';
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, copyFileSync, readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

import { getStale, computeHash, readManifest, writeManifest } from './cache.mjs';
import { fileToSlug, slugToExportName, SLUG_ALIASES, isOnWall, frontmatterToSlug } from './wall.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dir, '../../../..');
const HARNESS_ROOT = resolve(__dir, 'harness');
const OUTPUT_DIR = resolve(
  REPO_ROOT,
  'apps/dialtone-documentation/docs/.vuepress/public/assets/images/components',
);

const HARNESS_PORT = 5899;
const MODES = ['light', 'dark'];
const VIEWPORT = { width: 400, height: 225 };
const DEVICE_SCALE = 2;
const CACHE_VERSION = 'png-v1'; // bump when output format changes

const TIMEOUTS = {
  goto: 15_000,
  mount: 5_000,
  networkIdle: 5_000,
  transitionSettle: 250,
  cleanupRecheck: 150,
};

// Wall pages without a components_list.js entry — either Dt* components from
// dialtone-icons (illustration) or CSS-primitive / directive-only slugs that
// only render via their override .vue file (table, scrollbar).
const EXTRA_SLUGS = [
  'illustration',
  'table',
  'scrollbar',
];

// Wall is the source of truth for which components need thumbnails. Each .md
// page in docs/components/ is one wall card; components with no wall page
// (e.g. DtTab, DtTabPanel, DtResizableHandle, DtResizablePanel,
// DtSegmentedControlItem — leaf parts of composite components) get skipped.
// A page's wall slug comes from its frontmatter, not its filename — see
// frontmatterToSlug for the rule.
const WALL_DOCS_DIR = resolve(REPO_ROOT, 'apps/dialtone-documentation/docs/components');
let wallSlugs;
try {
  wallSlugs = new Set(
    readdirSync(WALL_DOCS_DIR)
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .map(f => frontmatterToSlug(readFileSync(resolve(WALL_DOCS_DIR, f), 'utf8')))
      .filter(Boolean),
  );
} catch (err) {
  console.error(`[generate] cannot read wall pages at ${WALL_DOCS_DIR}: ${err.message}`);
  process.exit(1);
}

// Catch alias rot — a SLUG_ALIASES entry pointing at a missing wall page
// means a component slug bypasses isOnWall() but produces no displayed thumb.
for (const [src, aliases] of Object.entries(SLUG_ALIASES)) {
  for (const a of aliases) {
    if (!wallSlugs.has(a)) {
      console.warn(`[generate] SLUG_ALIASES['${src}'] → '${a}': no matching ${a}.md on wall`);
    }
  }
}

const argMap = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, ...v] = a.slice(2).split('=');
      return [k, v.join('=') || true];
    }),
);

const singleComponent = typeof argMap.component === 'string' && argMap.component.length
  ? argMap.component
  : null;
const forceRegen = argMap.force === true;

if (argMap.component != null && !singleComponent) {
  console.error('[generate] --component requires a value, e.g. --component=button');
  process.exit(1);
}

const require = createRequire(import.meta.url);
const allFiles = require(resolve(REPO_ROOT, 'common/components_list.js'));

// Override slugs that have no components_list.js entry (e.g.
// combobox-multi-select, combobox-with-popover) still need to be in the
// target set — otherwise editing their override .vue would never regen.
const OVERRIDE_DIR = resolve(REPO_ROOT, 'apps/dialtone-documentation/thumbs');
const overrideSlugs = readdirSync(OVERRIDE_DIR)
  .filter(f => f.endsWith('.vue'))
  .map(fileToSlug);

const targetSlugs = singleComponent
  // --component=foo bypasses isOnWall so devs can iterate on non-wall slugs.
  ? [singleComponent]
  : [...new Set([
      ...allFiles.map(fileToSlug),
      ...EXTRA_SLUGS,
      ...overrideSlugs,
    ])].filter(slug => isOnWall(slug, wallSlugs));

const manifest = readManifest();
if (manifest._version !== CACHE_VERSION) {
  console.log(`[generate] cache format changed (${manifest._version ?? 'none'} → ${CACHE_VERSION}); invalidating all entries`);
  for (const k of Object.keys(manifest)) delete manifest[k];
  manifest._version = CACHE_VERSION;
}

let staleSlugs;
if (forceRegen) {
  staleSlugs = targetSlugs;
  console.log(`[generate] --force: regenerating ${staleSlugs.length} component(s)`);
} else {
  staleSlugs = getStale(targetSlugs, slugToExportName, manifest);
  const cached = targetSlugs.length - staleSlugs.length;
  if (cached > 0) console.log(`[generate] ${cached} cache-hit(s) skipped`);
  if (staleSlugs.length === 0) {
    console.log('[generate] ✅ all up to date — nothing to regenerate');
    process.exit(0);
  }
  console.log(`[generate] ${staleSlugs.length} stale component(s) to regenerate`);
}

// Vite auto-loads harness/vite.config.js (shared with the preview server).
// strictPort: false → if 5899 is taken (e.g. the preview server is running),
// Vite picks the next free port instead of failing. We read the resolved port
// below to construct URLs.
const vite = await createServer({
  root: HARNESS_ROOT,
  server: { port: HARNESS_PORT, strictPort: false, open: false },
  logLevel: 'warn',
});
await vite.listen();
const resolvedPort = vite.httpServer.address().port;
console.log(`[generate] harness on :${resolvedPort}${resolvedPort === HARNESS_PORT ? '' : ` (${HARNESS_PORT} was busy)`}…`);

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
});

mkdirSync(OUTPUT_DIR, { recursive: true });

/**
 * Capture one screenshot using a fresh page. Fresh-page-per-shot avoids the
 * state-leak race where the second navigation per component paints before
 * styles fully apply (previously caused dark-variant render bugs).
 *
 * Wait stack: load → mount selector → networkidle → fonts.ready → 2× rAF →
 * 250ms transition settle. The trailing 250ms isn't redundant — it catches
 * CSS transitions that fire post-paint (e.g. button hover/focus settling).
 */
async function captureOne (url, outPath) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: DEVICE_SCALE });
  try {
    await page.goto(url, { waitUntil: 'load', timeout: TIMEOUTS.goto });
    await page.waitForSelector('#thumb-root > *', { timeout: TIMEOUTS.mount }).catch(() => null);
    await page.waitForLoadState('networkidle', { timeout: TIMEOUTS.networkIdle }).catch(() => {});
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.waitForTimeout(TIMEOUTS.transitionSettle);

    // Preserves `[autofocus]` (override files rely on focus-triggered shows)
    // and tippy `trigger: 'manual'` (programmatic popovers like DtPopover
    // :open="true"). Runs twice because some components re-focus after the
    // first blur (Modal close on transition end, Datepicker nav watchers).
    const cleanupFn = () => {
      document.body.classList.add('thumb-capturing');
      if (document.querySelector('[autofocus]')) return;
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      document.querySelectorAll('*').forEach(el => {
        const trigger = el._tippy?.props?.trigger;
        if (el._tippy && typeof trigger === 'string' && !trigger.includes('manual')) {
          el._tippy.hide();
        }
      });
      window.getSelection()?.removeAllRanges();
    };
    await page.evaluate(cleanupFn);
    await page.waitForTimeout(TIMEOUTS.cleanupRecheck);
    await page.evaluate(cleanupFn);

    const hasContent = await page.evaluate(() => {
      const root = document.getElementById('thumb-root');
      if (!root || !root.firstElementChild) return false;
      const rect = root.firstElementChild.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (!hasContent) return false;

    writeFileSync(outPath, await page.screenshot({ type: 'png', omitBackground: true }));
    return true;
  } finally {
    await page.close();
  }
}

const results = { ok: [], skip: [], error: [] };

for (const slug of staleSlugs) {
  const exportName = slugToExportName(slug);
  process.stdout.write(`  [shot] ${slug}… `);

  const modeResults = await Promise.all(MODES.map(async mode => {
    const url = `http://localhost:${resolvedPort}/?thumb=${exportName}&mode=${mode}`;
    const outPath = resolve(OUTPUT_DIR, `${slug}-${mode}.png`);
    try {
      return await captureOne(url, outPath);
    } catch (err) {
      return err;
    }
  }));

  const modeOk = modeResults.filter(r => r === true).length;
  const firstError = modeResults.find(r => r instanceof Error);

  // Wall-slug aliases — copy the captured PNGs to alternate filenames
  // for components whose docs page title doesn't match the components_list slug.
  for (const alias of SLUG_ALIASES[slug] ?? []) {
    for (let i = 0; i < MODES.length; i++) {
      if (modeResults[i] !== true) continue;
      copyFileSync(
        resolve(OUTPUT_DIR, `${slug}-${MODES[i]}.png`),
        resolve(OUTPUT_DIR, `${alias}-${MODES[i]}.png`),
      );
    }
  }

  if (modeOk === MODES.length) {
    manifest[slug] = { inputHash: computeHash(slug, exportName) };
    console.log(`✅  light + dark`);
    results.ok.push(slug);
  } else if (modeOk > 0) {
    manifest[slug] = { inputHash: computeHash(slug, exportName) };
    console.log(`⚠️   only ${modeOk}/${MODES.length} mode(s)`);
    results.ok.push(slug);
  } else if (firstError) {
    console.log(`❌  ${firstError.message.split('\n')[0]}`);
    results.error.push(slug);
  } else {
    console.log(`⚠️   no content — skipped`);
    results.skip.push(slug);
  }
}

await browser.close();
await vite.close();
writeManifest(manifest);

console.log(`\n${'─'.repeat(60)}`);
console.log(`✅  generated: ${results.ok.length}`);
if (results.skip.length) console.log(`⚠️   empty / no content: ${results.skip.length}  — ${results.skip.join(', ')}`);
if (results.error.length) console.log(`❌  errors: ${results.error.length}  — ${results.error.join(', ')}`);
console.log(`${'─'.repeat(60)}`);
