import { strict as assert } from 'node:assert';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEFAULT_FIRESPOTTER_URL =
  'https://localhost.uv-beta.dialpad.net/app/feed/aglzfnV2LWJldGFyGAsSC1VzZXJQcm9maWxlGICA2KiXi8QIDA/aglzfnV2LWJldGFyGAsSC1VzZXJQcm9maWxlGICAmOPRoYoLDA';

function test(name, fn) {
  return { name, fn };
}

function testDependencyGraph() {
  return {
    summary: {
      refPrefixFamilies: {
        '--dt': 2,
        '--button': 2,
      },
    },
    classToTokens: {
      'd-box': ['--dt-active-color', '--dt-surface-color'],
      'd-btn': ['--button-color', '--button-padding-x'],
    },
    tokenToClasses: {
      '--dt-active-color': ['d-box'],
      '--dt-surface-color': ['d-box'],
      '--button-color': ['d-btn'],
      '--button-padding-x': ['d-btn'],
    },
  };
}

async function withPage(fn) {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await fn(page);
  } finally {
    await browser.close();
  }
}

async function installContentScript(
  page,
  {
    exposeHelpers = false,
    discoveryGraph = testDependencyGraph(),
    serviceResponses = {},
    storage = {},
  } = {},
) {
  await page.evaluate(({ discoveryGraph: graph, serviceResponses: responses, storage: initialStorage }) => {
    const localStore = { ...initialStorage };
    const storageListeners = [];
    const messageListeners = [];
    const nativeFetch = window.fetch.bind(window);
    window.__dtDiscoveryGraph = graph;
    window.__dtDiscoveryFetches = 0;
    window.__dtServiceResponses = { ...responses };
    window.__dtStorage = localStore;
    window.__dtContentMessages = [];
    window.fetch = (input, init) => {
      const url = String(input?.url || input);
      if (url.endsWith('/docs/analysis/dependency-graph.json')) {
        window.__dtDiscoveryFetches += 1;
        return Promise.resolve(
          new Response(JSON.stringify(window.__dtDiscoveryGraph), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        );
      }
      return nativeFetch(input, init);
    };
    window.__sendContentMessage = (msg) =>
      new Promise((resolve) => {
        let asyncResponse = false;
        let resolved = false;
        const sendResponse = (response) => {
          if (!resolved) {
            resolved = true;
            resolve(response ?? null);
          }
        };
        for (const listener of messageListeners) {
          const keepOpen = listener(msg, { tab: { id: 1 } }, sendResponse);
          if (keepOpen === true) asyncResponse = true;
        }
        if (!asyncResponse && !resolved) resolve(null);
      });

    window.chrome = {
      runtime: {
        id: 'dt-migration-helper-test',
        lastError: null,
        getURL(path) {
          return `chrome-extension://dt-migration-helper-test/${path}`;
        },
        sendMessage(_msg, cb) {
          window.__dtContentMessages.push(_msg);
          let response = window.__dtServiceResponses[_msg?.type] ?? null;
          // Mode-specific dispatch: { light: {...}, dark: {...} } keyed by _msg.mode
          if (response !== null && typeof response === 'object' && ('light' in response || 'dark' in response)) {
            response = response[_msg?.mode] ?? null;
          }
          Promise.resolve(response).then((res) => cb?.(res));
        },
        onMessage: {
          addListener(listener) {
            messageListeners.push(listener);
          },
        },
      },
      storage: {
        local: {
          get(keys, cb) {
            const out = {};
            if (Array.isArray(keys)) {
              for (const key of keys) out[key] = localStore[key];
            } else if (typeof keys === 'string') {
              out[keys] = localStore[keys];
            } else if (keys && typeof keys === 'object') {
              for (const [key, fallback] of Object.entries(keys)) {
                out[key] = key in localStore ? localStore[key] : fallback;
              }
            }
            if (cb) queueMicrotask(() => cb(out));
            return Promise.resolve(out);
          },
          set(items, cb) {
            const changes = {};
            for (const [key, newValue] of Object.entries(items)) {
              changes[key] = { oldValue: localStore[key], newValue };
              localStore[key] = newValue;
            }
            for (const listener of storageListeners) listener(changes, 'local');
            cb?.();
          },
          remove(keys, cb) {
            for (const key of Array.isArray(keys) ? keys : [keys]) delete localStore[key];
            cb?.();
          },
        },
        onChanged: {
          addListener(listener) {
            storageListeners.push(listener);
          },
        },
      },
    };
  }, { discoveryGraph, serviceResponses, storage });

  // Load scripts in manifest order: rules.js → structure.js → token-renames.js → content.js
  const rulesSource = await readFile(join(__dirname, 'rules.js'), 'utf8');
  const structureSource = await readFile(join(__dirname, 'structure.js'), 'utf8');
  await page.addScriptTag({ content: rulesSource });
  await page.addScriptTag({ content: structureSource });
  // token-renames.js is optional — only exists after Task 2 is implemented
  try {
    const tokenRenamesSource = await readFile(join(__dirname, 'token-renames.js'), 'utf8');
    await page.addScriptTag({ content: tokenRenamesSource });
  } catch { /* not yet present */ }

  const contentPath = join(__dirname, 'content.js');
  const source = await readFile(contentPath, 'utf8');
  const instrumented = exposeHelpers
    ? source.replace(
        /\}\)\(\);\s*$/,
        'window.__dtTestHelpers = { buildScopedCustomPropertyCss, buildDiscoveryTokenFilter }; })();',
      )
    : source;
  await page.addScriptTag({ content: instrumented });
}

async function readDiscoveryData() {
  const [graph, utilities, components] = await Promise.all([
    readFile(join(__dirname, 'docs/analysis/dependency-graph.json'), 'utf8').then(JSON.parse),
    readFile(join(__dirname, 'docs/analysis/utilities.json'), 'utf8').then(JSON.parse),
    readFile(join(__dirname, 'docs/analysis/components.json'), 'utf8').then(JSON.parse),
  ]);
  return { graph, utilities, components };
}

function buildDiscoveryTokenFilterData(graph) {
  const exact = new Set();
  const addToken = (name) => {
    if (typeof name === 'string' && name.startsWith('--')) exact.add(name);
  };
  for (const name of Object.keys(graph?.tokenToClasses || {})) addToken(name);
  for (const tokens of Object.values(graph?.classToTokens || {})) {
    if (Array.isArray(tokens)) tokens.forEach(addToken);
  }
  const prefixes = Object.keys(graph?.summary?.refPrefixFamilies || {})
    .filter((prefix) => prefix.startsWith('--'))
    .sort((a, b) => b.length - a.length || a.localeCompare(b));
  return { exactNames: [...exact].sort(), prefixes };
}

function stableCssUrls({ version, brand, mode }) {
  const base = `https://unpkg.com/@dialpad/dialtone@${version}`;
  return {
    tokenUrl: `${base}/dist/tokens/css/tokens-${brand}-${mode}.css`,
    frameworkUrl: `${base}/dist/css/dialtone.css`,
  };
}

async function fetchCss(url, label) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${label} fetch failed: HTTP ${response.status}`);
  const text = await response.text();
  if (!text.trim()) throw new Error(`${label} fetch returned empty CSS`);
  return text;
}

function nextCssUrls({ brand, mode }) {
  const base = 'https://unpkg.com/@dialpad/dialtone@next';
  return {
    tokenUrl: `${base}/dist/tokens/css/tokens-${brand}-${mode}.css`,
    frameworkUrl: `${base}/dist/css/dialtone.css`,
  };
}

function parseCustomPropertyDecls(cssText, source) {
  const map = new Map();
  const re = /(--[A-Za-z0-9-]+)\s*:\s*([^;}{]+);/g;
  let match;
  while ((match = re.exec(cssText)) !== null) {
    map.set(match[1], { value: match[2].trim(), source });
  }
  return map;
}

const NON_COLOR_PAT = new RegExp(
  'space|spacing|padding|gap|radius|width|height|size|layout|position|offset|' +
  'line-height|font-size|font-weight|typography|shadow|z-index|zi|top|right|bottom|left',
  'i',
);

function classifyTokenName(name) {
  if (/color|bgg|bgo|bgc|background|foreground|border.*color|fc|fco|bc|bco|chroma|opacity/i.test(name)) {
    return 'color';
  }
  if (NON_COLOR_PAT.test(name)) {
    return 'non-color';
  }
  return 'other';
}

function buildExpectedChangeFocus({
  stableTokenCss,
  stableFrameworkCss,
  nextTokenCss,
  nextFrameworkCss,
  discovery,
}) {
  const stable = new Map([
    ...parseCustomPropertyDecls(stableTokenCss, 'tokens-css'),
    ...parseCustomPropertyDecls(stableFrameworkCss, 'framework-css'),
  ]);
  const next = new Map([
    ...parseCustomPropertyDecls(nextTokenCss, 'tokens-css'),
    ...parseCustomPropertyDecls(nextFrameworkCss, 'framework-css'),
  ]);
  const liveClasses = new Set(discovery.components.allClasses || []);
  const classToTokens = {};
  const classToProps = {};
  const expectedRows = [];

  for (const [name, stableEntry] of stable) {
    const nextEntry = next.get(name);
    if (!nextEntry || nextEntry.value === stableEntry.value) continue;
    const classes = (discovery.graph.tokenToClasses[name] || []).filter((cls) => liveClasses.has(cls));
    if (!classes.length) continue;
    const row = {
      token: name,
      kind: classifyTokenName(name),
      source: stableEntry.source,
      stable: stableEntry.value,
      next: nextEntry.value,
      classes,
    };
    expectedRows.push(row);
    for (const cls of classes) {
      classToTokens[cls] ||= [];
      classToTokens[cls].push(name);
      const utility = discovery.utilities.utilities[cls];
      if (utility?.props) {
        classToProps[cls] ||= [];
        for (const prop of utility.props) {
          if (!prop.startsWith('--') && !classToProps[cls].includes(prop)) {
            classToProps[cls].push(prop);
          }
        }
      }
    }
  }

  return {
    expectedRows,
    classToTokens,
    classToProps,
  };
}

async function findRealPage(browser) {
  const targetUrl = process.env.REAL_PAGE_URL || DEFAULT_FIRESPOTTER_URL;
  const urlMatch = process.env.REAL_PAGE_URL_MATCH || targetUrl;
  const pages = browser.contexts().flatMap((context) => context.pages());
  const candidates = pages.filter((page) => {
    const url = page.url();
    return url.startsWith('http') && (url === targetUrl || url.startsWith(targetUrl) || url.includes(urlMatch));
  });
  if (candidates.length) return candidates[0];
  const openPages = pages.map((page) => page.url()).join('\n  ');
  throw new Error(
    `No Firespotter tab found via CDP. Open ${targetUrl} or set REAL_PAGE_URL / REAL_PAGE_URL_MATCH.\nOpen pages:\n  ${openPages}`,
  );
}

async function detectRealPageTheme(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    let brand = root.getAttribute('data-dt-brand') || 'dp';
    let mode = root.getAttribute('data-dt-mode') || root.getAttribute('data-dt-theme');
    if (!mode) {
      if (document.body?.classList.contains('dialtone-theme-dark')) mode = 'dark';
      else if (document.body?.classList.contains('dialtone-theme-light')) mode = 'light';
    }
    if (!mode) {
      try {
        const p = new URL(window.location.href).searchParams;
        const v = (p.get('dt-theme') || p.get('DT-THEME') || '').toLowerCase();
        if (v === 'light' || v === 'dark') mode = v;
      } catch {
        // Ignore URL parsing failures on unusual pages.
      }
    }
    return mode ? { brand, mode } : null;
  });
}

async function realPageSnapshot(page, tokenFilter, focus = null) {
  return page.evaluate(({ focus, tokenFilter: filterData }) => {
    const exact = new Set(filterData.exactNames || []);
    const prefixes = filterData.prefixes || [];
    const allowed = (name) =>
      exact.has(name) ||
      prefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}-`));
    const isVisible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        Number(style.opacity || 1) > 0
      );
    };
    const visible = [...document.querySelectorAll('body *')].filter(isVisible);
    const tokenHosts = [document.documentElement, ...visible.filter((el) =>
      [...el.classList].some((name) => name.startsWith('d-')),
    )].slice(0, 30);
    const tokenValues = {};
    for (const el of tokenHosts) {
      const style = getComputedStyle(el);
      for (let i = 0; i < style.length; i++) {
        const name = style[i];
        if (name.startsWith('--') && allowed(name)) {
          const value = style.getPropertyValue(name).trim();
          if (value && !(name in tokenValues)) tokenValues[name] = value;
        }
      }
    }
    const bodyRect = document.body.getBoundingClientRect();
    const focused = {};
    if (focus) {
      for (const [className, tokens] of Object.entries(focus.classToTokens || {})) {
        const element = [...document.querySelectorAll(`.${CSS.escape(className)}`)].find(isVisible);
        if (!element) continue;
        const style = getComputedStyle(element);
        const tokenValues = {};
        for (const token of tokens) {
          const value = style.getPropertyValue(token).trim();
          if (value) tokenValues[token] = value;
        }
        const propertyValues = {};
        for (const prop of (focus.classToProps?.[className] || []).slice(0, 40)) {
          const value = style.getPropertyValue(prop).trim();
          if (value) propertyValues[prop] = value;
        }
        focused[className] = {
          tag: element.tagName.toLowerCase(),
          classes: [...element.classList],
          tokenValues,
          propertyValues,
        };
      }
    }
    return {
      title: document.title,
      url: location.href,
      bodyWidth: bodyRect.width,
      bodyHeight: bodyRect.height,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      visibleCount: visible.length,
      tokenValues,
      focused,
    };
  }, { focus, tokenFilter });
}

function changedToken(before, after) {
  for (const [name, beforeValue] of Object.entries(before.tokenValues)) {
    const afterValue = after.tokenValues[name];
    if (afterValue && afterValue !== beforeValue) return { name, beforeValue, afterValue };
  }
  return null;
}

function focusedDiffs(before, after, expectedRows) {
  const expectedByToken = new Map(expectedRows.map((row) => [row.token, row]));
  const tokenDiffs = [];
  const propertyDiffs = [];

  for (const [className, beforeEntry] of Object.entries(before.focused || {})) {
    const afterEntry = after.focused?.[className];
    if (!afterEntry) continue;
    for (const [token, beforeValue] of Object.entries(beforeEntry.tokenValues || {})) {
      const afterValue = afterEntry.tokenValues?.[token];
      if (afterValue && afterValue !== beforeValue) {
        const expected = expectedByToken.get(token);
        tokenDiffs.push({
          className,
          token,
          kind: expected?.kind || 'unknown',
          before: beforeValue,
          after: afterValue,
          expectedStable: expected?.stable,
          expectedNext: expected?.next,
          source: expected?.source,
        });
      }
    }
    for (const [prop, beforeValue] of Object.entries(beforeEntry.propertyValues || {})) {
      const afterValue = afterEntry.propertyValues?.[prop];
      if (afterValue && afterValue !== beforeValue) {
        propertyDiffs.push({ className, prop, before: beforeValue, after: afterValue });
      }
    }
  }

  return { tokenDiffs, propertyDiffs };
}

function assertRealPageVisible(before, after) {
  assert.ok(after.bodyWidth > 0, 'body width collapsed');
  assert.ok(after.bodyHeight > 0, 'body height collapsed');
  assert.ok(after.visibleCount >= Math.max(1, Math.floor(before.visibleCount * 0.8)), {
    beforeVisibleCount: before.visibleCount,
    afterVisibleCount: after.visibleCount,
  });
}

async function applyRealPageOverride(page, cssTexts, tokenFilter) {
  return page.evaluate(({ cssTexts: texts, tokenFilter: filterData }) => {
    const exact = new Set(filterData.exactNames || []);
    const prefixes = filterData.prefixes || [];
    const allowed = (name) =>
      exact.has(name) ||
      prefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}-`));
    const declarationsFor = (style) => {
      const declarations = [];
      for (let i = 0; i < style.length; i++) {
        const name = style[i];
        if (!name.startsWith('--') || !allowed(name) || style.getPropertyPriority(name)) continue;
        const value = style.getPropertyValue(name).trim();
        if (value) declarations.push(`${name}: ${value};`);
      }
      return declarations;
    };
    const headerFor = (rule) => {
      const text = rule.cssText || '';
      const i = text.indexOf('{');
      return i === -1 ? '' : text.slice(0, i).trim();
    };
    const scopedRule = (rule) => {
      if (rule.selectorText && rule.style) {
        const declarations = declarationsFor(rule.style);
        return declarations.length ? `${rule.selectorText} { ${declarations.join(' ')} }` : '';
      }
      if (!rule.cssRules) return '';
      const children = [...rule.cssRules].map(scopedRule).filter(Boolean);
      if (!children.length) return '';
      const header = headerFor(rule);
      if (header.startsWith('@layer')) return children.join('\n');
      return header ? `${header} {\n${children.join('\n')}\n}` : children.join('\n');
    };
    const scopedRules = [];
    for (const text of texts) {
      const parsed = new CSSStyleSheet();
      parsed.replaceSync(text);
      for (const rule of parsed.cssRules) {
        const css = scopedRule(rule);
        if (css) scopedRules.push(css);
      }
    }
    const cssText = scopedRules.join('\n');
    if (!cssText.trim()) return { applied: false, cssLength: 0 };
    if (window.__dtRealPageOverrideSheet) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (sheet) => sheet !== window.__dtRealPageOverrideSheet,
      );
    }
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    window.__dtRealPageOverrideSheet = sheet;
    return {
      applied: true,
      cssLength: cssText.length,
      sheetCount: document.adoptedStyleSheets.length,
    };
  }, { cssTexts, tokenFilter });
}

async function removeRealPageOverride(page) {
  await page.evaluate(() => {
    if (!window.__dtRealPageOverrideSheet) return;
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (sheet) => sheet !== window.__dtRealPageOverrideSheet,
    );
    window.__dtRealPageOverrideSheet = null;
  });
}

async function runRealPageValidation() {
  const endpoint = process.env.REAL_PAGE_CDP;
  if (!endpoint) {
    throw new Error(
      `REAL_PAGE_CDP is required, for example: REAL_PAGE_CDP=http://127.0.0.1:9222 REAL_PAGE_URL='${DEFAULT_FIRESPOTTER_URL}' node e2e.mjs --real-page`,
    );
  }
  const discovery = await readDiscoveryData();
  const tokenFilter = buildDiscoveryTokenFilterData(discovery.graph);
  const browser = await chromium.connectOverCDP(endpoint);
  const page = await findRealPage(browser);
  const detectedTheme = await detectRealPageTheme(page);
  const brand = process.env.REAL_PAGE_DT_BRAND || detectedTheme?.brand;
  const mode = process.env.REAL_PAGE_DT_MODE || detectedTheme?.mode;
  if (!brand || !mode) {
    throw new Error('Could not detect Dialtone brand/mode; set REAL_PAGE_DT_BRAND and REAL_PAGE_DT_MODE');
  }
  const version = process.env.REAL_PAGE_DT_VERSION || 'latest';
  const { tokenUrl, frameworkUrl } = stableCssUrls({ version, brand, mode });
  const nextUrls = nextCssUrls({ brand, mode });
  const tokenCss = await fetchCss(tokenUrl, 'token CSS');
  const nextTokenCss = await fetchCss(nextUrls.tokenUrl, 'next token CSS');
  let frameworkCss = '';
  let nextFrameworkCss = '';
  try {
    frameworkCss = await fetchCss(frameworkUrl, 'framework CSS');
  } catch (error) {
    console.warn(String(error.message || error));
  }
  try {
    nextFrameworkCss = await fetchCss(nextUrls.frameworkUrl, 'next framework CSS');
  } catch (error) {
    console.warn(String(error.message || error));
  }

  const focus = buildExpectedChangeFocus({
    stableTokenCss: tokenCss,
    stableFrameworkCss: frameworkCss,
    nextTokenCss,
    nextFrameworkCss,
    discovery,
  });
  const expectedNonColor = focus.expectedRows.filter((row) => row.kind === 'non-color');
  console.log(`expected changed tokens on discovered live classes: ${focus.expectedRows.length}`);
  console.log(`expected non-color changed tokens on discovered live classes: ${expectedNonColor.length}`);

  const before = await realPageSnapshot(page, tokenFilter, focus);
  assertRealPageVisible(before, before);
  const applied = await applyRealPageOverride(page, [tokenCss, frameworkCss].filter(Boolean), tokenFilter);
  assert.equal(applied.applied, true, 'override sheet was not applied');
  const after = await realPageSnapshot(page, tokenFilter, focus);
  assertRealPageVisible(before, after);
  const change = changedToken(before, after);
  assert.ok(change, 'no sampled token value changed after applying stable override');
  const diffs = focusedDiffs(before, after, focus.expectedRows);
  const nonColorTokenDiffs = diffs.tokenDiffs.filter((diff) => diff.kind === 'non-color');
  console.log('actual token diffs:', JSON.stringify(diffs.tokenDiffs.slice(0, 80), null, 2));
  console.log('actual computed property diffs:', JSON.stringify(diffs.propertyDiffs.slice(0, 80), null, 2));
  assert.ok(
    nonColorTokenDiffs.length || diffs.propertyDiffs.length,
    'no discovered non-color token/property values changed after applying stable override',
  );
  await removeRealPageOverride(page);
  const reverted = await realPageSnapshot(page, tokenFilter, focus);
  assertRealPageVisible(before, reverted);
  assert.deepEqual(reverted.tokenValues, before.tokenValues, 'sampled token values did not revert exactly');
  assert.deepEqual(reverted.focused, before.focused, 'focused token/property values did not revert exactly');
  console.log(`ok - TS-003 real page visible after override (${change.name}: ${change.beforeValue} -> ${change.afterValue})`);
}

if (process.argv.includes('--real-page')) {
  try {
    await runRealPageValidation();
  } catch (error) {
    console.error(error?.stack || error);
    process.exit(1);
  }
  process.exit(0);
}

const tests = [
  test('TS-001 preserves selectors and layers while emitting only safe tokens', async () => {
    await withPage(async (page) => {
      await page.setContent(`
        <style>
          @layer uv-legacy, dialtone.components, app.overrides;
          @layer dialtone.components {
            .sample {
              --button-color: rgb(0, 0, 255);
              --dt-active-color: rgb(0, 0, 255);
              color: var(--button-color);
              background-color: var(--dt-active-color);
              display: block;
              width: 20px;
              height: 20px;
            }
          }
          @layer app.overrides {
            .app-override {
              --button-color: rgb(0, 128, 0);
            }
          }
        </style>
        <div id="normal" class="sample"></div>
        <div id="app" class="sample app-override"></div>
      `);
      await installContentScript(page, { exposeHelpers: true });

      const result = await page.evaluate(() => {
        const stableCss = `
          @layer dialtone.components {
            .sample {
              --button-color: rgb(255, 0, 0);
              --dt-active-color: rgb(255, 255, 0);
              --md: 999px;
              --not-discovered-token: ignored;
              width: 1000px;
            }
            .important-token {
              --button-color: rgb(255, 0, 255) !important;
            }
          }
        `;
        const tokenFilter = window.__dtTestHelpers.buildDiscoveryTokenFilter(
          window.__dtDiscoveryGraph,
        );
        const css = window.__dtTestHelpers.buildScopedCustomPropertyCss(
          [stableCss],
          tokenFilter,
          { preserveLayers: true },
        );
        const style = document.createElement('style');
        style.textContent = css;
        document.head.append(style);
        return {
          css,
          normalColor: getComputedStyle(document.querySelector('#normal')).color,
          normalBg: getComputedStyle(document.querySelector('#normal')).backgroundColor,
          normalWidth: getComputedStyle(document.querySelector('#normal')).width,
          appColor: getComputedStyle(document.querySelector('#app')).color,
        };
      });

      assert.match(result.css, /@layer dialtone\.components/);
      assert.match(result.css, /\.sample/);
      assert.match(result.css, /--button-color:\s*rgb\(255, 0, 0\);/);
      assert.match(result.css, /--dt-active-color:\s*rgb\(255, 255, 0\);/);
      assert.doesNotMatch(result.css, /width:/);
      assert.doesNotMatch(result.css, /--md/);
      assert.doesNotMatch(result.css, /--not-discovered-token/);
      assert.doesNotMatch(result.css, /!important/);
      assert.equal(result.normalColor, 'rgb(255, 0, 0)');
      assert.equal(result.normalBg, 'rgb(255, 255, 0)');
      assert.equal(result.normalWidth, '20px');
      assert.equal(result.appColor, 'rgb(0, 128, 0)');
    });
  }),
  test('TS-002 applies stable custom-property override and reverts exactly', async () => {
    await withPage(async (page) => {
      await page.setContent(`
        <style>
          @layer dialtone.tokens, dialtone.components;
          @layer dialtone.tokens {
            :root { --dt-surface-color: rgb(0, 0, 255); }
          }
          @layer dialtone.components {
            .sample {
              --button-color: rgb(0, 0, 255);
              --button-padding-x: 4px;
              color: var(--button-color);
              background-color: var(--dt-surface-color);
              padding-left: var(--button-padding-x);
              display: block;
              width: 20px;
              height: 20px;
            }
          }
          .unlayered-component {
            --button-padding-x: 4px;
            padding-left: var(--button-padding-x);
          }
          .app-override.unlayered-component {
            --button-padding-x: 20px;
          }
        </style>
        <div id="sample" class="sample unlayered-component d-btn"></div>
        <div id="app-component" class="unlayered-component app-override"></div>
      `);

      await installContentScript(page, {
        storage: {
          dtVersion: 'latest',
          dtThemeOverride: { brand: 'dp', mode: 'light' },
        },
        serviceResponses: {
          getStableTokens: {
            resolvedVersion: '9.200.0',
            map: {
              '--dt-surface-color': 'rgb(255, 255, 0)',
              '--button-color': 'rgb(255, 0, 0)',
            },
            tokenCss: ':root { --dt-surface-color: rgb(255, 255, 0); }',
          },
          getStableFrameworkCss: {
            resolvedVersion: '9.200.0',
            frameworkCss: `
              @layer dialtone.components {
                .sample {
                  --button-color: rgb(255, 0, 0);
                  --button-padding-x: 12px;
                  padding: 999px;
                }
                .unlayered-component {
                  --button-padding-x: 12px;
                  margin-left: 999px;
                }
              }
            `,
          },
        },
      });

      const baseline = await page.evaluate(() => {
        const style = getComputedStyle(document.querySelector('#sample'));
        const appStyle = getComputedStyle(document.querySelector('#app-component'));
        return {
          color: style.color,
          bg: style.backgroundColor,
          width: style.width,
          paddingLeft: style.paddingLeft,
          appPaddingLeft: appStyle.paddingLeft,
        };
      });
      assert.deepEqual(baseline, {
        color: 'rgb(0, 0, 255)',
        bg: 'rgb(0, 0, 255)',
        width: '20px',
        paddingLeft: '4px',
        appPaddingLeft: '20px',
      });

      const inspectBefore = await page.evaluate(async () => {
        await window.__sendContentMessage({ type: 'setInspect', value: true });
        await new Promise((resolve) => setTimeout(resolve, 0));
        const el = document.querySelector('#sample');
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: 1, clientY: 1 }));
        return document.querySelector('#__dt-token-tip__')?.shadowRoot?.textContent || '';
      });
      assert.match(inspectBefore, /--dt-surface-color/);

      const enabled = await page.evaluate(async () => {
        const response = await window.__sendContentMessage({ type: 'setOverride', value: true });
        const style = getComputedStyle(document.querySelector('#sample'));
        return {
          color: style.color,
          bg: style.backgroundColor,
          width: style.width,
          paddingLeft: style.paddingLeft,
          appPaddingLeft: getComputedStyle(document.querySelector('#app-component')).paddingLeft,
          discoveryFetches: window.__dtDiscoveryFetches,
          reportNonColor:
            response.report.changes.tokenDiffs.nonColor +
            response.report.changes.propertyDiffs.nonColor,
          reportColor:
            response.report.changes.tokenDiffs.color +
            response.report.changes.propertyDiffs.color,
          reportFrameworkCss: response.report.sources.frameworkCss,
          sheetCount: document.adoptedStyleSheets.length,
        };
      });
      assert.deepEqual(
        {
          color: enabled.color,
          bg: enabled.bg,
          width: enabled.width,
          paddingLeft: enabled.paddingLeft,
          appPaddingLeft: enabled.appPaddingLeft,
          discoveryFetches: enabled.discoveryFetches,
          reportFrameworkCss: enabled.reportFrameworkCss,
          sheetCount: enabled.sheetCount,
        },
        {
        color: 'rgb(255, 0, 0)',
        bg: 'rgb(255, 255, 0)',
        width: '20px',
        paddingLeft: '12px',
        appPaddingLeft: '20px',
        discoveryFetches: 1,
        reportFrameworkCss: true,
        sheetCount: 1,
        },
      );
      assert.ok(enabled.reportNonColor >= 1, enabled);
      assert.ok(enabled.reportColor >= 1, enabled);

      const inspectAfter = await page.evaluate(() => {
        const el = document.querySelector('#sample');
        el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: 1, clientY: 1 }));
        return document.querySelector('#__dt-token-tip__')?.shadowRoot?.textContent || '';
      });
      assert.match(inspectAfter, /--dt-surface-color/);

      const disabled = await page.evaluate(async () => {
        await window.__sendContentMessage({ type: 'setOverride', value: false });
        const style = getComputedStyle(document.querySelector('#sample'));
        return {
          color: style.color,
          bg: style.backgroundColor,
          width: style.width,
          paddingLeft: style.paddingLeft,
          appPaddingLeft: getComputedStyle(document.querySelector('#app-component')).paddingLeft,
          sheetCount: document.adoptedStyleSheets.length,
        };
      });
      assert.deepEqual(disabled, { ...baseline, sheetCount: 0 });

      const fallback = await page.evaluate(async () => {
        window.__dtServiceResponses.getStableFrameworkCss = { error: 'HTTP 500' };
        await window.__sendContentMessage({ type: 'setOverride', value: true });
        const style = getComputedStyle(document.querySelector('#sample'));
        return {
          color: style.color,
          bg: style.backgroundColor,
          width: style.width,
          paddingLeft: style.paddingLeft,
          bodyVisible: document.body.getBoundingClientRect().height > 0,
        };
      });
      assert.deepEqual(fallback, {
        color: 'rgb(0, 0, 255)',
        bg: 'rgb(255, 255, 0)',
        width: '20px',
        paddingLeft: '4px',
        bodyVisible: true,
      });
    });
  }),
  test('TS-004 applies stable Avatar component CSS and reversible size aliases', async () => {
    await withPage(async (page) => {
      await page.setContent(`
        <style>
          .d-avatar {
            --avatar-size-shape: 20px;
            display: inline-flex;
          }
          .d-avatar--size-200 {
            --avatar-size-shape: 24px;
          }
          .d-avatar__canvas {
            inline-size: var(--avatar-size-shape);
            block-size: var(--avatar-size-shape);
            border-radius: 4px;
            background-color: rgb(0, 0, 255);
          }
        </style>
        <div id="avatar" class="d-avatar d-avatar--size-200">
          <span class="d-avatar__canvas"></span>
          <span class="d-avatar__presence d-presence">
            <span class="d-presence__inner d-presence__inner--dnd">
              <svg class="d-presence__icon"></svg>
            </span>
          </span>
        </div>
      `);

      await installContentScript(page, {
        storage: {
          dtVersion: 'latest',
          dtThemeOverride: { brand: 'dp', mode: 'light' },
        },
        serviceResponses: {
          getStableTokens: {
            resolvedVersion: '9.187.2',
            map: {
              '--dt-size-550': '32px',
              '--dt-size-radius-pill': '999px',
              '--dt-avatar-color-background-000': 'rgb(255, 0, 0)',
              // Mirrors real stable structure: the semantic token chains to a
              // palette primitive that next's page does NOT define. The swap
              // must emit the full chain or presence colors collapse.
              '--dt-presence-color-unavailable': 'var(--dt-color-orange-400)',
              '--dt-color-orange-400': 'rgb(255, 128, 0)',
            },
            tokenCss: `
              :root {
                --dt-size-550: 32px;
                --dt-size-radius-pill: 999px;
                --dt-avatar-color-background-000: rgb(255, 0, 0);
                --dt-presence-color-unavailable: var(--dt-color-orange-400);
                --dt-color-orange-400: rgb(255, 128, 0);
              }
            `,
          },
          getStableFrameworkCss: {
            resolvedVersion: '9.187.2',
            frameworkCss: `
              @layer dialtone.components {
                .d-avatar {
                  --avatar-color-background: var(--dt-avatar-color-background-000);
                  --avatar-size-shape: 20px;
                }
                .d-avatar--sm {
                  --avatar-size-shape: var(--dt-size-550);
                }
                .d-avatar__canvas {
                  inline-size: var(--avatar-size-shape);
                  block-size: var(--avatar-size-shape);
                  border-radius: var(--dt-size-radius-pill);
                  background-color: var(--avatar-color-background);
                }
                .d-presence {
                  --presence-color-background-busy: var(--dt-presence-color-unavailable);
                  --presence-size: 10px;
                }
                .d-presence__inner {
                  inline-size: var(--presence-size);
                  block-size: var(--presence-size);
                  border-radius: 50%;
                }
                .d-presence__inner--busy {
                  background-color: var(--presence-color-background-busy);
                }
              }
            `,
          },
        },
      });

      const baseline = await page.evaluate(() => {
        const avatar = document.querySelector('#avatar');
        const canvas = document.querySelector('.d-avatar__canvas');
        const presence = document.querySelector('.d-presence__inner');
        const style = getComputedStyle(canvas);
        const presenceStyle = getComputedStyle(presence);
        return {
          className: avatar.getAttribute('class'),
          presenceClassName: presence.getAttribute('class'),
          width: style.width,
          radius: style.borderRadius,
          background: style.backgroundColor,
          presenceWidth: presenceStyle.width,
          presenceBackground: presenceStyle.backgroundColor,
        };
      });
      assert.deepEqual(baseline, {
        className: 'd-avatar d-avatar--size-200',
        presenceClassName: 'd-presence__inner d-presence__inner--dnd',
        width: '24px',
        radius: '4px',
        background: 'rgb(0, 0, 255)',
        presenceWidth: 'auto',
        presenceBackground: 'rgba(0, 0, 0, 0)',
      });

      const enabled = await page.evaluate(async () => {
        const response = await window.__sendContentMessage({ type: 'setAvatarSwap', value: true });
        const avatar = document.querySelector('#avatar');
        const canvas = document.querySelector('.d-avatar__canvas');
        const presence = document.querySelector('.d-presence__inner');
        const style = getComputedStyle(canvas);
        const presenceStyle = getComputedStyle(presence);
        return {
          ok: response.ok,
          report: response.report,
          className: avatar.getAttribute('class'),
          presenceClassName: presence.getAttribute('class'),
          width: style.width,
          radius: style.borderRadius,
          background: style.backgroundColor,
          presenceWidth: presenceStyle.width,
          presenceBackground: presenceStyle.backgroundColor,
          sheetCount: document.adoptedStyleSheets.length,
        };
      });
      assert.equal(enabled.ok, true);
      assert.equal(enabled.className, 'd-avatar d-avatar--sm');
      assert.equal(enabled.presenceClassName, 'd-presence__inner d-presence__inner--busy');
      assert.equal(enabled.width, '32px');
      assert.equal(enabled.radius, '999px');
      assert.equal(enabled.background, 'rgb(255, 0, 0)');
      assert.equal(enabled.presenceWidth, '10px');
      assert.equal(enabled.presenceBackground, 'rgb(255, 128, 0)');
      assert.equal(enabled.sheetCount, 1);
      assert.equal(enabled.report.avatars, 1);
      assert.equal(enabled.report.presence, 1);
      assert.ok(enabled.report.remapped >= 3, `expected >= 3 remaps, got ${enabled.report.remapped}`);
      assert.ok(enabled.report.rules >= 6, enabled.report);
      assert.ok(enabled.report.scopedTokens >= 4, enabled.report);

      const disabled = await page.evaluate(async () => {
        await window.__sendContentMessage({ type: 'setAvatarSwap', value: false });
        const avatar = document.querySelector('#avatar');
        const canvas = document.querySelector('.d-avatar__canvas');
        const presence = document.querySelector('.d-presence__inner');
        const style = getComputedStyle(canvas);
        const presenceStyle = getComputedStyle(presence);
        return {
          className: avatar.getAttribute('class'),
          presenceClassName: presence.getAttribute('class'),
          width: style.width,
          radius: style.borderRadius,
          background: style.backgroundColor,
          presenceWidth: presenceStyle.width,
          presenceBackground: presenceStyle.backgroundColor,
          sheetCount: document.adoptedStyleSheets.length,
        };
      });
      assert.deepEqual(disabled, { ...baseline, sheetCount: 0 });
    });
  }),

  test('TS-005 stable token override does not corrupt next Presence colors via excludeAvatarPresence', async () => {
    await withPage(async (page) => {
      await page.setContent(`
        <style>
          :root { --dt-presence-color: rgb(0, 200, 0); }
          .d-presence__inner--available {
            background-color: var(--dt-presence-color);
            display: block; width: 10px; height: 10px;
          }
        </style>
        <span class="d-presence__inner--available" id="presence"></span>
      `);
      await installContentScript(page, { exposeHelpers: true });

      const result = await page.evaluate(() => {
        // Stable CSS has a presence-scoped token override with a different value.
        // Without excludeAvatarPresence, this would leak into the override and
        // corrupt the next Presence color.
        const stableCss = `.d-presence__inner--available { --dt-presence-color: rgb(255, 0, 0); }`;
        const tokenFilter = window.__dtTestHelpers.buildDiscoveryTokenFilter(
          { tokenToClasses: { '--dt-presence-color': ['d-presence__inner--available'] }, classToTokens: {} },
        );
        const css = window.__dtTestHelpers.buildScopedCustomPropertyCss(
          [stableCss],
          tokenFilter,
          { excludeAvatarPresence: true },
        );
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css || '/* empty */');
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
        return {
          css,
          presenceColor: getComputedStyle(document.querySelector('#presence')).backgroundColor,
        };
      });

      assert.doesNotMatch(result.css ?? '', /d-presence/,
        'presence selector must not appear in override CSS when excludeAvatarPresence is true');
      assert.equal(result.presenceColor, 'rgb(0, 200, 0)',
        'next Presence color must not be overridden by stable scoped token injection');
    });
  }),

  test('TS-006 replace mode substitutes stable token values in-place per tag and restores on disable', async () => {
    await withPage(async (page) => {
      // Measured next page shape: three id-tagged token-only style nodes + a
      // contrast tag with no --dt-* declarations + an unlabeled app sheet.
      // Framework CSS lives in single.css (<link>), never in these tags.
      // data-dt-mode on <html> makes [data-dt-mode="light"/"dark"] selectors match.
      await page.setContent(`<!DOCTYPE html>
        <html data-dt-mode="light">
        <head>
          <style id="dialtone-css-core">@layer dialtone.base { :root { --dt-radio-size-radius: 50%; --dt-chained: var(--dt-prim-x); } }</style>
          <style id="dialtone-css-base-colors">[data-dt-mode="light"] { --dt-color-surface: rgb(200, 200, 200); } [data-dt-mode="dark"] { --dt-color-surface: rgb(50, 50, 50); }</style>
          <style id="dialtone-css-brand">[data-dt-mode="light"] { --dt-brand-primary: rgb(100, 100, 100); } [data-dt-mode="dark"] { --dt-brand-primary: rgb(30, 30, 30); }</style>
          <style id="dialtone-css-contrast">.d-high-contrast { font-weight: bold; }</style>
          <style>.app-card { background: var(--dt-color-surface); } .chained-probe { color: var(--dt-chained); }</style>
        </head>
        <body>
          <div class="app-card" id="probe"></div>
          <div class="chained-probe" id="probe-chained"></div>
        </body>
        </html>`);
      await installContentScript(page, {
        storage: { dtVersion: 'latest', dtThemeOverride: { brand: 'dp', mode: 'light' } },
        serviceResponses: {
          // Mode-specific maps: --dt-prim-x exists in stable but NOT in the fixture tags;
          // --dt-chained chains to it via var() — expanded to literal before substitution.
          getStableTokens: {
            light: {
              resolvedVersion: '9.187.2',
              map: { '--dt-radio-size-radius': '0.25rem', '--dt-chained': 'var(--dt-prim-x)', '--dt-prim-x': 'rgb(255, 0, 0)', '--dt-color-surface': 'rgb(255, 255, 255)', '--dt-brand-primary': 'rgb(200, 0, 0)' },
              tokenCss: '',
            },
            dark: {
              resolvedVersion: '9.187.2',
              map: { '--dt-radio-size-radius': '0.25rem', '--dt-chained': 'var(--dt-prim-x)', '--dt-prim-x': 'rgb(255, 0, 0)', '--dt-color-surface': 'rgb(0, 0, 0)', '--dt-brand-primary': 'rgb(0, 100, 0)' },
              tokenCss: '',
            },
          },
        },
      });

      // Step 1: enable replace
      const enabled = await page.evaluate(async () => {
        const response = await window.__sendContentMessage({ type: 'setReplace', value: true });
        return {
          ok: response.ok,
          report: response.report,
          coreText: document.querySelector('#dialtone-css-core').textContent,
          baseColorsText: document.querySelector('#dialtone-css-base-colors').textContent,
          brandText: document.querySelector('#dialtone-css-brand').textContent,
          contrastText: document.querySelector('#dialtone-css-contrast').textContent,
          probeBg: getComputedStyle(document.querySelector('#probe')).backgroundColor,
          chainedColor: getComputedStyle(document.querySelector('#probe-chained')).color,
        };
      });

      // Step 1: ok, all four tags reported
      assert.equal(enabled.ok, true, 'replace enabled ok');
      assert.ok(enabled.report.replacedIds.includes('dialtone-css-core'), 'core in replacedIds');
      assert.ok(enabled.report.replacedIds.includes('dialtone-css-base-colors'), 'base-colors in replacedIds');
      assert.ok(enabled.report.replacedIds.includes('dialtone-css-brand'), 'brand in replacedIds');
      assert.ok(enabled.report.replacedIds.includes('dialtone-css-contrast'), 'contrast in replacedIds');

      // Step 2: structure + names preserved, only values changed
      // Core: @layer wrapper and :root preserved
      assert.match(enabled.coreText, /@layer dialtone\.base/, 'core @layer wrapper preserved');
      assert.match(enabled.coreText, /:root/, 'core :root preserved');
      assert.match(enabled.coreText, /--dt-radio-size-radius/, 'core token name preserved');
      assert.match(enabled.coreText, /0\.25rem/, 'core token value substituted to stable');
      assert.doesNotMatch(enabled.coreText, /50%/, 'core old value replaced');
      // Chained token: stable map had var(--dt-prim-x) which expanded to literal rgb(255,0,0)
      assert.match(enabled.coreText, /--dt-chained/, 'chained token name preserved');
      assert.match(enabled.coreText, /rgb\(255, 0, 0\)/, 'chained value expanded to literal (var chain resolved)');
      assert.doesNotMatch(enabled.coreText, /var\(--dt-prim-x\)/, 'no unresolved var() for primitive absent from next tags');
      // No tag emptied
      assert.ok(enabled.coreText.length > 10, 'core not emptied');
      assert.ok(enabled.baseColorsText.length > 10, 'base-colors not emptied');
      assert.ok(enabled.brandText.length > 10, 'brand not emptied');
      // base-colors: mode blocks preserved, values substituted per mode
      assert.match(enabled.baseColorsText, /\[data-dt-mode="light"\]/, 'light mode block preserved');
      assert.match(enabled.baseColorsText, /\[data-dt-mode="dark"\]/, 'dark mode block preserved');
      assert.match(enabled.baseColorsText, /rgb\(255, 255, 255\)/, 'light value substituted');
      assert.match(enabled.baseColorsText, /rgb\(0, 0, 0\)/, 'dark value substituted');
      // Contrast: no --dt-* → byte-identical (after comment strip, still same structure)
      assert.match(enabled.contrastText, /\.d-high-contrast/, 'contrast tag structure preserved');
      assert.doesNotMatch(enabled.contrastText, /--dt-/, 'contrast tag has no --dt- declarations to change');

      // Step 3: computed color reflects stable light value; chained token is literal
      assert.equal(enabled.probeBg, 'rgb(255, 255, 255)', 'probe background uses stable light --dt-color-surface');
      assert.equal(enabled.chainedColor, 'rgb(255, 0, 0)', 'chained token resolves to literal stable value');

      // Step 4: set dark mode — native re-theming, no re-toggle needed
      const darkResult = await page.evaluate(async () => {
        document.documentElement.setAttribute('data-dt-mode', 'dark');
        // Wait one frame for style recalc
        await new Promise(r => requestAnimationFrame(r));
        return getComputedStyle(document.querySelector('#probe')).backgroundColor;
      });
      assert.equal(darkResult, 'rgb(0, 0, 0)', 'dark mode re-themes natively without re-toggle');

      // Step 5: disable restores originals byte-identical
      const origCore = '@layer dialtone.base { :root { --dt-radio-size-radius: 50%; --dt-chained: var(--dt-prim-x); } }';
      const origContrast = '.d-high-contrast { font-weight: bold; }';
      const disabled = await page.evaluate(async () => {
        await window.__sendContentMessage({ type: 'setReplace', value: false });
        return {
          coreText: document.querySelector('#dialtone-css-core').textContent,
          contrastText: document.querySelector('#dialtone-css-contrast').textContent,
        };
      });
      assert.equal(disabled.coreText, origCore, 'core tag restored byte-identical');
      assert.equal(disabled.contrastText, origContrast, 'contrast tag (no-op) restored byte-identical');
    });
  }),

  test('TS-009 renamed-family tokens resolve to stable values via reverse rename tables', async () => {
    await withPage(async (page) => {
      await page.setContent(`<!DOCTYPE html>
        <html data-dt-mode="light">
        <head>
          <style id="dialtone-css-core">@layer dialtone.base { :root {
            --dt-spacing-100: nextval-spacing-100;
            --dt-spacing-300: nextval-spacing-300;
            --dt-layout-25: nextval-layout-25;
            --dt-color-black-positive-default: nextval-positive;
            --dt-text-size-400: nextval-text-unmapped;
          } }</style>
        </head><body></body></html>`);
      await installContentScript(page, {
        storage: { dtVersion: 'latest', dtThemeOverride: { brand: 'dp', mode: 'light' } },
        serviceResponses: {
          getStableTokens: {
            light: {
              resolvedVersion: '9.187.2',
              map: {
                '--dt-space-400': 'stable-spacing-100-val',
                '--dt-space-550': 'stable-spacing-300-val',
                '--dt-size-500':  'stable-layout-25-val',
                '--dt-color-black-success-default': 'stable-positive-val',
              },
              tokenCss: '',
            },
            dark: { resolvedVersion: '9.187.2', map: {}, tokenCss: '' },
          },
        },
      });

      const result = await page.evaluate(async () => {
        const response = await window.__sendContentMessage({ type: 'setReplace', value: true });
        return { ok: response.ok, coreText: document.querySelector('#dialtone-css-core').textContent };
      });

      assert.equal(result.ok, true, 'replace enabled');
      // Renamed families: stable values substituted via reverse rename tables
      assert.match(result.coreText, /stable-spacing-100-val/, '--dt-spacing-100 → --dt-space-400 value');
      assert.match(result.coreText, /stable-spacing-300-val/, '--dt-spacing-300 → --dt-space-550 value');
      assert.match(result.coreText, /stable-layout-25-val/,   '--dt-layout-25 → --dt-size-500 value');
      assert.match(result.coreText, /stable-positive-val/,    '--dt-color-*-positive-* → --dt-color-*-success-* value');
      // Unmapped family: next value preserved (never undefined)
      assert.match(result.coreText, /--dt-text-size-400/, 'unmapped token name preserved');
      assert.match(result.coreText, /nextval-text-unmapped/, 'unmapped token keeps next value');
    });
  }),

  test('TS-007 legacy page — flat :root tags substituted using current-mode map', async () => {
    await withPage(async (page) => {
      // Legacy setTheme() shape: two flat :root style nodes, no mode scoping, no layers.
      await page.setContent(`<!DOCTYPE html>
        <html data-dt-theme="light">
        <head>
          <style id="dialtone-css-theme">:root { --dt-color-surface: old-theme-val; --dt-unmapped: old-unmapped-val; }</style>
          <style id="dialtone-css-brand">:root { --dt-brand-primary: old-brand-val; }</style>
        </head><body></body></html>`);
      await installContentScript(page, {
        storage: { dtVersion: 'latest', dtThemeOverride: { brand: 'dp', mode: 'light' } },
        serviceResponses: {
          getStableTokens: {
            light: {
              resolvedVersion: '9.187.2',
              map: { '--dt-color-surface': 'stable-theme-val', '--dt-brand-primary': 'stable-brand-val' },
              tokenCss: '',
            },
            dark: { resolvedVersion: '9.187.2', map: { '--dt-color-surface': 'dark-theme-val' }, tokenCss: '' },
          },
        },
      });

      const origTheme = ':root { --dt-color-surface: old-theme-val; --dt-unmapped: old-unmapped-val; }';
      const enabled = await page.evaluate(async () => {
        const response = await window.__sendContentMessage({ type: 'setReplace', value: true });
        return {
          ok: response.ok,
          themeText: document.querySelector('#dialtone-css-theme').textContent,
          brandText: document.querySelector('#dialtone-css-brand').textContent,
        };
      });

      assert.equal(enabled.ok, true, 'replace enabled on legacy page');
      // Matched tokens get stable light values; structure and names preserved
      assert.match(enabled.themeText, /:root/, 'theme :root preserved');
      assert.match(enabled.themeText, /stable-theme-val/, 'theme token value substituted');
      assert.doesNotMatch(enabled.themeText, /old-theme-val/, 'old value replaced');
      // Unmatched token keeps next value (never undefined)
      assert.match(enabled.themeText, /--dt-unmapped/, 'unmapped token name preserved');
      assert.match(enabled.themeText, /old-unmapped-val/, 'unmapped token keeps next value');
      assert.match(enabled.brandText, /stable-brand-val/, 'brand token value substituted');

      const disabled = await page.evaluate(async () => {
        await window.__sendContentMessage({ type: 'setReplace', value: false });
        return { themeText: document.querySelector('#dialtone-css-theme').textContent };
      });
      assert.equal(disabled.themeText, origTheme, 'theme tag restored byte-identical');
    });
  }),

  test('TS-008 untagged page — heuristic sheet substituted, mixed sheet skipped', async () => {
    await withPage(async (page) => {
      await page.setContent(`<!DOCTYPE html><html><head></head><body></body></html>`);
      // Inject heuristic Dialtone sheet (≥50 rules, ≥80% .d-*) and mixed app sheet in page context
      await page.evaluate(() => {
        const dtStyle = document.createElement('style');
        let rules = '';
        for (let i = 0; i < 40; i++) rules += `.d-item-${i} { color: red; } `;
        rules += ':root { --dt-test-heuristic: old-heuristic-val; } ';
        for (let i = 0; i < 9; i++) rules += `.other-rule-${i} { font-size: 12px; } `;
        dtStyle.textContent = rules;
        document.head.appendChild(dtStyle);

        const mixedStyle = document.createElement('style');
        let mixed = '.d-avatar { display: flex; } ';
        for (let i = 0; i < 59; i++) mixed += `.app-other-${i} { color: green; } `;
        mixedStyle.textContent = mixed;
        document.head.appendChild(mixedStyle);
      });
      await installContentScript(page, {
        storage: { dtVersion: 'latest', dtThemeOverride: { brand: 'dp', mode: 'light' } },
        serviceResponses: {
          getStableTokens: {
            light: {
              resolvedVersion: '9.187.2',
              map: { '--dt-test-heuristic': 'stable-heuristic-val' },
              tokenCss: '',
            },
            dark: { resolvedVersion: '9.187.2', map: {}, tokenCss: '' },
          },
        },
      });

      const enabled = await page.evaluate(async () => {
        const response = await window.__sendContentMessage({ type: 'setReplace', value: true });
        const sheets = document.querySelectorAll('style');
        return {
          ok: response.ok,
          report: response.report,
          dtSheetText: sheets[0].textContent,
          mixedSheetText: sheets[1].textContent,
          origMixed: sheets[1].textContent, // captured before any change
        };
      });

      assert.equal(enabled.ok, true, 'replace enabled on heuristic page');
      assert.equal(enabled.report.skippedMixed, 1, 'mixed sheet counted as skippedMixed');
      // Dialtone heuristic sheet: --dt-* value substituted, .d-* rule bodies untouched
      assert.match(enabled.dtSheetText, /stable-heuristic-val/, '--dt-* value substituted');
      assert.match(enabled.dtSheetText, /\.d-item-0/, '.d-* rule selector preserved');
      assert.match(enabled.dtSheetText, /color: red/, '.d-* rule body untouched');
      // Mixed app sheet: unchanged
      assert.match(enabled.mixedSheetText, /\.d-avatar/, 'mixed sheet structure preserved');

      const disabled = await page.evaluate(async () => {
        await window.__sendContentMessage({ type: 'setReplace', value: false });
        return { dtText: document.querySelectorAll('style')[0].textContent };
      });
      assert.match(disabled.dtText, /old-heuristic-val/, 'heuristic sheet restored to original value');
    });
  }),

  test('TS-010 rapid toggle — stale enable does not write after disable', async () => {
    await withPage(async (page) => {
      await page.setContent(`
        <style id="dialtone-css-core">@layer dialtone.base { :root { --dt-radio-size-radius: 50%; } }</style>
      `);
      await installContentScript(page, {
        storage: { dtVersion: 'latest', dtThemeOverride: { brand: 'dp', mode: 'light' } },
        serviceResponses: {
          getStableTokens: {
            light: { resolvedVersion: '9.187.2', map: { '--dt-radio-size-radius': '0.25rem' }, tokenCss: '' },
            dark:  { resolvedVersion: '9.187.2', map: { '--dt-radio-size-radius': '0.25rem' }, tokenCss: '' },
          },
        },
      });

      const result = await page.evaluate(async () => {
        const origText = document.querySelector('#dialtone-css-core').textContent;
        // Fire enable then immediately disable without awaiting enable
        const enablePromise = window.__sendContentMessage({ type: 'setReplace', value: true });
        const disableResult = await window.__sendContentMessage({ type: 'setReplace', value: false });
        const enableResult = await enablePromise;
        return {
          disableOk: disableResult.ok,
          enableSkipped: enableResult?.skipped === true || enableResult?.ok === false,
          finalText: document.querySelector('#dialtone-css-core').textContent,
          origText,
        };
      });

      assert.equal(result.disableOk, true, 'disable succeeded');
      assert.ok(result.enableSkipped, 'stale enable reported skipped or not-ok');
      assert.equal(result.finalText, result.origText, 'tag byte-identical to original after rapid toggle');
    });
  }),
];

let failures = 0;
for (const t of tests) {
  try {
    await t.fn();
    console.log(`ok - ${t.name}`);
  } catch (error) {
    failures += 1;
    console.error(`not ok - ${t.name}`);
    console.error(error?.stack || error);
  }
}

if (failures) process.exit(1);
console.log(`${tests.length} test(s) passed`);
