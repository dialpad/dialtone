/**
 * generate.mjs — before/after imagery for the designer-facing visual migration
 * guide (DLT-3469).
 *
 * Renders the "scene" .vue files under ./scenes through a standalone
 * Vite + Playwright harness (./harness) and screenshots each one against:
 *   - after:  the Dialtone build in THIS checkout (run on `next`)
 *   - before: the Dialtone build in a prepared `staging` worktree
 *
 * Output: individual PNGs (no compositing — the docs site's <before-after>
 * component lays the pair out) named <scene>-<branch>-<mode>.png in
 * docs/.vuepress/public/assets/images/migration-visual/.
 *
 * USAGE
 *   pnpm nx run dialtone-documentation:visual-guide [-- <flags>]
 *       NX target wrapping this script (builds tokens/css/icons/vue first).
 *
 *   node apps/dialtone-documentation/scripts/visual-guide/generate.mjs
 *       After-only render from this checkout.
 *
 *   node .../generate.mjs --before-root=../dialtone-staging
 *       Render both sides. The staging worktree must exist with
 *       dialtone-tokens/css/vue built (see README.md). This script copies the
 *       scenes + harness into the worktree automatically so both sides render
 *       the same scene files.
 *
 *   node .../generate.mjs --only=token-type-scale,component-button
 *       Restrict to specific scenes (comma-separated ids) while iterating.
 *
 * Scene flags (SCENES below):
 *   modes:    which color modes to capture     (default ['light', 'dark'])
 *   branches: which sides make sense           (default ['before', 'after'];
 *             e.g. brand-new components are after-only)
 *   capture:  'element' shoots the auto-sized #vg-root; 'viewport' shoots the
 *             whole viewport (for scenes with top-layer content like modals)
 *   hover:    CSS selector to move the pointer over before shooting, so the
 *             capture includes a real :hover state (e.g. quiet-link underline)
 */
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// __dirname = apps/dialtone-documentation/scripts/visual-guide
const REPO_ROOT = resolve(__dirname, '../../../..');
const REL_SELF = 'apps/dialtone-documentation/scripts/visual-guide';
const LOCAL_HARNESS = join(__dirname, 'harness');
const OUT_DIR = resolve(
  REPO_ROOT,
  'apps/dialtone-documentation/docs/.vuepress/public/assets/images/migration-visual',
);

const VIEWPORT = { width: 1280, height: 800 };
// 4x density: the fullscreen comparison modal stretches images well past
// their CSS size — 2x looked soft there. Scene layout is in CSS px, so
// changing density never moves pixels between the before/after pair.
const DEVICE_SCALE = 4;

const SCENES = [
  // §1 — token-driven ambient changes (one token, every page)
  { id: 'token-type-scale' },
  { id: 'token-neutrals' },
  { id: 'token-color-ramps' },
  { id: 'token-focus-ring' },
  { id: 'token-size-shifts', branches: ['after'] }, // static infographic — deprecated size tokens still resolve on next, so a pair can't show the shift
  { id: 'token-disabled-states' },
  { id: 'token-overlay-surface' },
  // §2 — redesigned components
  { id: 'component-button' },
  { id: 'component-control-alignment' },
  { id: 'component-empty-state' },
  { id: 'component-presence' },
  { id: 'component-banner-toast' },
  { id: 'component-tabs' },
  { id: 'component-avatar' },
  { id: 'component-input' },
  { id: 'component-validation' },
  { id: 'component-notice' },
  { id: 'component-link', hover: '#vg-hover-target' },
  { id: 'component-link-descenders' },
  { id: 'component-modal', capture: 'viewport' },
];

const argv = process.argv.slice(2);
const argMap = Object.fromEntries(
  argv.map(a => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [m[1], m[2] ?? true] : [a, true];
  }),
);

const only = typeof argMap.only === 'string' ? argMap.only.split(',') : null;
const scenes = SCENES.filter(s => !only || only.includes(s.id));

/** Capture one scene+mode. Returns true on success. */
async function capture (browser, baseUrl, scene, mode, outPath) {
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: DEVICE_SCALE });
  try {
    await page.goto(`${baseUrl}/?scene=${scene.id}&mode=${mode}`, {
      waitUntil: 'load',
      timeout: 30000,
    });
    await page.waitForSelector('#vg-root > *', { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.evaluate(() => document.body.classList.add('vg-capturing'));
    await page.waitForTimeout(300);
    if (scene.hover) {
      await page.hover(scene.hover);
      await page.waitForTimeout(120);
    }

    const el = await page.$('#vg-root');
    const box = el && (await el.boundingBox());
    if (!box || box.width < 2 || box.height < 2) {
      console.error(`  ✗ ${scene.id} (${mode}): scene rendered empty`);
      return false;
    }
    if (scene.capture === 'viewport') {
      await page.screenshot({ path: outPath });
    } else {
      await el.screenshot({ path: outPath });
    }
    return true;
  } catch (err) {
    console.error(`  ✗ ${scene.id} (${mode}): ${err.message}`);
    return false;
  } finally {
    await page.close();
  }
}

/** Start a Vite harness and capture every applicable scene for one branch. */
async function renderSet (browser, harnessRoot, branch) {
  const vite = await createServer({
    root: harnessRoot,
    server: { port: 0, strictPort: false, open: false },
    logLevel: 'error',
  });
  await vite.listen();
  const port = vite.httpServer.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.info(`[visual-guide] rendering "${branch}" from ${harnessRoot} on :${port}`);

  const failed = [];
  for (const scene of scenes) {
    const branches = scene.branches ?? ['before', 'after'];
    if (!branches.includes(branch)) continue;
    for (const mode of scene.modes ?? ['light', 'dark']) {
      const file = `${scene.id}-${branch}-${mode}.png`;
      // One retry — cold Vite transforms can race the first page's timeouts.
      const success = await capture(browser, baseUrl, scene, mode, join(OUT_DIR, file)) ||
        await capture(browser, baseUrl, scene, mode, join(OUT_DIR, file));
      if (success) console.info(`  ✓ ${file}`);
      else failed.push(file);
    }
  }
  await vite.close();
  return failed;
}

/**
 * Copy scenes + harness into the worktree so the "before" render uses the SAME
 * scene files. The worktree's own Dialtone build supplies the old token values.
 */
// Static sample assets referenced by scenes (photos etc.) — these live in the
// next checkout's public dir but must also exist in the worktree's public dir,
// which is what the "before" harness serves.
const SAMPLE_ASSETS = ['sample-person.png'];

function syncIntoWorktree (beforeRoot) {
  const dest = resolve(beforeRoot, REL_SELF);
  rmSync(dest, { recursive: true, force: true });
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(join(__dirname, 'harness'), join(dest, 'harness'), { recursive: true });
  cpSync(join(__dirname, 'scenes'), join(dest, 'scenes'), { recursive: true });
  const assetDir = resolve(
    beforeRoot,
    'apps/dialtone-documentation/docs/.vuepress/public/assets/images/migration-visual',
  );
  mkdirSync(assetDir, { recursive: true });
  for (const asset of SAMPLE_ASSETS) {
    cpSync(join(OUT_DIR, asset), join(assetDir, asset));
  }
  return join(dest, 'harness');
}

async function main () {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
  });
  try {
    const failed = [];
    failed.push(...await renderSet(browser, LOCAL_HARNESS, 'after'));

    const beforeRoot = typeof argMap['before-root'] === 'string' ? argMap['before-root'] : null;
    if (beforeRoot) {
      if (!existsSync(resolve(beforeRoot, 'packages/dialtone-css/lib/dist/dialtone.min.css'))) {
        console.error(`[visual-guide] no built dialtone-css in --before-root=${beforeRoot} — build it first (see README).`);
        process.exitCode = 1;
      } else {
        const beforeHarness = syncIntoWorktree(beforeRoot);
        failed.push(...await renderSet(browser, beforeHarness, 'before'));
      }
    } else {
      console.info('[visual-guide] no --before-root — rendered "after" side only.');
    }

    if (failed.length) {
      console.error(`\n[visual-guide] failures: ${failed.join(', ')}`);
      process.exitCode = 1;
    } else {
      console.info(`\n[visual-guide] images written to ${OUT_DIR}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
