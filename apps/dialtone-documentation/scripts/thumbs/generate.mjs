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
import vue from '@vitejs/plugin-vue';
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';

import { fileToSlug, slugToExportName } from './name-map.mjs';
import { getStale, computeHash, readManifest, writeManifest } from './cache.mjs';

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
};

// Components that render nothing useful in their default state.
// Handled later by V3 (override files) or V4 (forceOpen mechanism).
const OVERLAY_SKIP = new Set([
  // Pure overlays — render nothing when closed
  'modal', 'toast', 'tooltip', 'hovercard',
  // Popover-style — only the anchor renders
  'combobox', 'dropdown', 'popover',
  // Composite that needs full page structure
  'root-layout', 'resizable-panel',
  // Complex async (ProseMirror) — needs special override
  'rich-text-editor',
]);

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

const targetSlugs = singleComponent
  ? [singleComponent]
  : allFiles.map(fileToSlug).filter(slug => !OVERLAY_SKIP.has(slug));

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

console.log(`[generate] starting harness on :${HARNESS_PORT}…`);
const vite = await createServer({
  root: HARNESS_ROOT,
  plugins: [vue()],
  server: { port: HARNESS_PORT, strictPort: true, open: false },
  logLevel: 'warn',
});
await vite.listen();

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

  // Light + dark are independent — run in parallel.
  const modeResults = await Promise.all(MODES.map(async mode => {
    const url = `http://localhost:${HARNESS_PORT}/?thumb=${exportName}&mode=${mode}`;
    const outPath = resolve(OUTPUT_DIR, `${slug}-${mode}.png`);
    try {
      return await captureOne(url, outPath);
    } catch (err) {
      return err;
    }
  }));

  const modeOk = modeResults.filter(r => r === true).length;
  const firstError = modeResults.find(r => r instanceof Error);

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
