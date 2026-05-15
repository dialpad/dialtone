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
import { writeFileSync, mkdirSync, copyFileSync } from 'fs';
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

// Components that still produce nothing useful even after V2.6 variant overrides
// and V3 hand-authored thumbs at apps/dialtone-documentation/thumbs/<slug>.vue.
// (Currently empty — all components covered.)
const OVERLAY_SKIP = new Set();

// Wall pages whose components aren't in common/components_list.js but DO need
// generated PNGs. e.g. `DtIllustration` lives in @dialpad/dialtone-icons and is
// exposed via the docs wall as a standalone "Illustration" page.
const EXTRA_SLUGS = [
  'illustration',
];

// Wall-page slugs that don't match the components_list slug 1:1. After capture,
// copy <source-slug>-*.png to <alias>-*.png so the wall card finds its thumb.
// E.g., tabs.md (title "Tabs" → fileName "tabs") is the wall card for the Tab
// Group component, whose PNGs are generated as `tab-group-*.png`.
const SLUG_ALIASES = {
  // Wall page "Tabs" (title-derived slug 'tabs') uses the tab-group thumb.
  'tab-group': ['tabs'],
  // Wall page "Mode" (title-derived slug 'mode') uses the mode-island thumb.
  'mode-island': ['mode'],
};

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
  : [...allFiles.map(fileToSlug), ...EXTRA_SLUGS].filter(slug => !OVERLAY_SKIP.has(slug));

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

    // Pre-capture cleanup: suppress preview decorations, drop any focus that
    // would render as a :focus ring (e.g. autofocused inputs in EmojiPicker,
    // SelectMenu, etc.), and clear any text selection.
    await page.evaluate(() => {
      document.body.classList.add('thumb-capturing');
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      window.getSelection()?.removeAllRanges();
    });

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
