// Dialtone Migration Helper — content script.
//
// Four independent toggles, applied via background.js's per-tab
// getTabState/setTabState (chrome.storage.session, resets on browser/extension
// restart):
//   • dtInspect — hover tooltip listing the --dt-* tokens applied to an element,
//     shown as "next value → stable value" with a changed/new badge, plus the
//     element's d-* utility classes.
//   • dtOverride — swaps the page's next token values for stable inline on <html>.
//   • dtAvatarSwap — swaps Avatar/Presence markup between next and stable.
//   • dtReplace — in-place substitution of --dt-* values on each dialtone-css-*
//     tag, preserving structure/mode blocks/names.
// Theme is auto-detected from data-dt-brand/data-dt-theme with a manual override
// (dtThemeOverride, stored globally in chrome.storage.local) as fallback. Runs
// in every frame (manifest all_frames), so inspect also works in a Storybook iframe.

(() => {
  'use strict';

  const TIP_ID = '__dt-token-tip__';
  // Token referenced inside a declaration value, e.g. color: var(--dt-x).
  const VAR_RE = /var\(\s*(--dt-[A-Za-z0-9-]+)/g;
  // Token name anywhere in an inline style attribute (reference or definition).
  const NAME_RE = /--dt-[A-Za-z0-9-]+/g;
  // Exact single-class Dialtone utility selector, e.g. ".d-p8", ".d-d-flex".
  const UTIL_SEL_RE = /^\.(d-[A-Za-z0-9_-]+)$/;
  const DISCOVERY_GRAPH_PATH = 'docs/analysis/dependency-graph.json';
  const DISCOVERY_TOKENS_PATH = 'docs/analysis/tokens.json';
  const DISCOVERY_UTILITIES_PATH = 'docs/analysis/utilities.json';

  // Index of { selectorText, tokens } for every rule that references a --dt-*
  // token. Built once on activate, cleared on deactivate. The hover hot path
  // only runs el.matches() against this cache + resolves values — it never
  // re-walks the stylesheets.
  let tokenIndex = null;
  // Map<className, cssText> for every exact single-class .d-* rule. Built
  // alongside tokenIndex in activateInspect, cleared in deactivateInspect.
  let utilIndex = null;
  let tipHost = null;
  let tipBody = null;
  let rafId = 0;
  let lastX = 0;
  let lastY = 0;

  let inspectOn = false;
  let stableMap = null; // { '--dt-x': stableValue } for the current theme/version — feeds tooltip diff
  let overrideOn = false;
  let overrideSheet = null;
  let overrideRequestId = 0;
  let avatarSwapOn = false;
  let avatarSwapSheet = null;
  let avatarSwapRequestId = 0;
  let lastAvatarSwapReport = null;
  let replaceOn = false;
  let replaceRequestId = 0;
  let replacedSheets = []; // { node, originalText } — for exact restore
  let lastReplaceReport = null;
  let stableOverrideTokenFilter = null;
  let stableOverrideTokenFilterPromise = null;
  let lastOverrideReport = null;
  const AVATAR_TOKEN_SCOPE_SELECTOR =
    '.d-avatar, .d-avatar *, .d-presence, .d-presence *, ' +
    '.d-badge, .d-badge *, .d-btn, .d-btn *, .d-banner, .d-banner *';
  const PROBE_PROPS = [
    'color', 'background-color', 'border-color', 'border-radius', 'box-shadow',
    'font-size', 'line-height', 'padding-top', 'padding-right', 'padding-bottom',
    'padding-left', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'width', 'height', 'min-width', 'min-height', 'gap', 'row-gap', 'column-gap',
    'top', 'right', 'bottom', 'left',
  ];

  // --- Stable override CSS extraction --------------------------------------

  async function loadDiscoveryJson(path) {
    const res = await fetch(chrome.runtime.getURL(path));
    if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
    return res.json();
  }

  function buildDiscoveryTokenFilter(graph, tokensData = null, utilitiesData = null) {
    const exact = new Set();
    const sourceCounts = {
      dependencyTokens: 0,
      tokenDefinitions: 0,
      utilityTokenRefs: 0,
      prefixes: 0,
    };
    const addToken = (name) => {
      if (typeof name === 'string' && name.startsWith('--')) exact.add(name);
    };

    const dependencyTokens = new Set();
    const addDependencyToken = (name) => {
      if (typeof name === 'string' && name.startsWith('--')) {
        dependencyTokens.add(name);
        exact.add(name);
      }
    };

    for (const name of Object.keys(graph?.tokenToClasses || {})) addDependencyToken(name);
    for (const tokens of Object.values(graph?.classToTokens || {})) {
      if (Array.isArray(tokens)) tokens.forEach(addDependencyToken);
    }
    sourceCounts.dependencyTokens = dependencyTokens.size;

    const tokenDefinitions = new Set();
    for (const tokens of Object.values(tokensData?.byPrefix || {})) {
      if (!Array.isArray(tokens)) continue;
      for (const name of tokens) {
        if (typeof name === 'string' && name.startsWith('--')) {
          tokenDefinitions.add(name);
          addToken(name);
        }
      }
    }
    sourceCounts.tokenDefinitions = tokenDefinitions.size;

    const utilityTokenRefs = new Set();
    for (const utility of Object.values(utilitiesData?.utilities || {})) {
      for (const name of utility?.tokenRefs || []) {
        if (typeof name === 'string' && name.startsWith('--')) {
          utilityTokenRefs.add(name);
          addToken(name);
        }
      }
    }
    sourceCounts.utilityTokenRefs = utilityTokenRefs.size;

    const prefixes = Object.keys(graph?.summary?.refPrefixFamilies || {})
      .filter((prefix) => prefix.startsWith('--'))
      .sort((a, b) => b.length - a.length || a.localeCompare(b));
    sourceCounts.prefixes = prefixes.length;

    return { exact, prefixes, sourceCounts };
  }

  function normalizeTokenFilter(tokenFilter) {
    if (Array.isArray(tokenFilter)) return { exact: new Set(), prefixes: tokenFilter };
    if (tokenFilter && tokenFilter.exact && Array.isArray(tokenFilter.prefixes)) {
      return tokenFilter;
    }
    if (tokenFilter && Array.isArray(tokenFilter.exactNames) && Array.isArray(tokenFilter.prefixes)) {
      return { exact: new Set(tokenFilter.exactNames), prefixes: tokenFilter.prefixes };
    }
    return stableOverrideTokenFilter || { exact: new Set(), prefixes: [] };
  }

  async function loadDiscoveryTokenFilter() {
    if (stableOverrideTokenFilter) return stableOverrideTokenFilter;
    if (!stableOverrideTokenFilterPromise) {
      stableOverrideTokenFilterPromise = (async () => {
        const [graph, tokensData, utilitiesData] = await Promise.all([
          loadDiscoveryJson(DISCOVERY_GRAPH_PATH),
          loadDiscoveryJson(DISCOVERY_TOKENS_PATH).catch((error) => {
            console.warn('dt: tokens discovery unavailable', error?.message || error);
            return null;
          }),
          loadDiscoveryJson(DISCOVERY_UTILITIES_PATH).catch((error) => {
            console.warn('dt: utilities discovery unavailable', error?.message || error);
            return null;
          }),
        ]);
        const filter = buildDiscoveryTokenFilter(graph, tokensData, utilitiesData);
        if (!filter.exact.size && !filter.prefixes.length) {
          throw new Error('empty discovery token filter');
        }
        stableOverrideTokenFilter = filter;
        return filter;
      })().catch((error) => {
        stableOverrideTokenFilterPromise = null;
        console.warn(
          'dt: discovery graph unavailable; stable override skipped',
          error?.message || error,
        );
        return null;
      });
    }
    return stableOverrideTokenFilterPromise;
  }

  function isAllowedStableTokenName(name, tokenFilter = stableOverrideTokenFilter) {
    const filter = normalizeTokenFilter(tokenFilter);
    if (filter.exact.has(name)) return true;
    return filter.prefixes.some((prefix) => name === prefix || name.startsWith(`${prefix}-`));
  }

  function valueKind(name) {
    if (/color|background|foreground|border.*color|chroma|opacity|shadow/i.test(name)) return 'color';
    return 'nonColor';
  }

  function tokenPrefix(name) {
    return name.match(/^--[^-]+/)?.[0] || name;
  }

  function scopedTokenDeclarationsFromText(blockText, tokenFilter) {
    const declarations = [];
    const re = /(--[A-Za-z0-9-]+)\s*:\s*([^;{}]+);/g;
    let match;
    while ((match = re.exec(blockText)) !== null) {
      const name = match[1];
      if (!isAllowedStableTokenName(name, tokenFilter)) continue;
      const value = match[2].trim();
      if (/!important/i.test(value)) continue;
      if (value) declarations.push(`${name}: ${value};`);
    }
    return declarations;
  }

  function stripCssComments(text) {
    return text.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  function matchingBraceIndex(text, openIndex) {
    let depth = 1;
    let quote = '';
    let escaped = false;
    for (let i = openIndex + 1; i < text.length; i++) {
      const char = text[i];
      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (char === '\\') {
          escaped = true;
        } else if (char === quote) {
          quote = '';
        }
        continue;
      }
      if (char === '"' || char === '\'') {
        quote = char;
      } else if (char === '{') {
        depth += 1;
      } else if (char === '}') {
        depth -= 1;
        if (depth === 0) return i;
      }
    }
    return -1;
  }

  function ruleHeader(text, start, openIndex) {
    const raw = text.slice(start, openIndex);
    const statementEnd = raw.lastIndexOf(';');
    return raw.slice(statementEnd + 1).trim();
  }

  function extractScopedRules(text, tokenFilter, options) {
    const rules = [];
    let pos = 0;
    while (pos < text.length) {
      const openIndex = text.indexOf('{', pos);
      if (openIndex === -1) break;
      const header = ruleHeader(text, pos, openIndex);
      const closeIndex = matchingBraceIndex(text, openIndex);
      if (closeIndex === -1) break;
      const body = text.slice(openIndex + 1, closeIndex);
      pos = closeIndex + 1;

      if (!header) continue;
      if (header.startsWith('@')) {
        const children = extractScopedRules(body, tokenFilter, options);
        if (!children.length) continue;
        if (!options.preserveLayers && header.startsWith('@layer')) {
          rules.push(...children);
        } else {
          rules.push(`${header} {\n${children.join('\n')}\n}`);
        }
        continue;
      }

      // Skip avatar/presence component-scoped rules when the DOM is still in next
      // form — injecting stable scoped token values onto next selectors breaks colors.
      if (options.excludeAvatarPresence && selectorTargetsAvatar(header)) continue;

      const declarations = scopedTokenDeclarationsFromText(body, tokenFilter);
      if (declarations.length) rules.push(`${header} { ${declarations.join(' ')} }`);
    }
    return rules;
  }

  function buildScopedCustomPropertyCss(
    cssTextList,
    tokenFilter = stableOverrideTokenFilter,
    options = {},
  ) {
    const buildOptions = { preserveLayers: false, ...options };
    const texts = Array.isArray(cssTextList) ? cssTextList : [cssTextList];
    const filter = normalizeTokenFilter(tokenFilter);
    const scopedRules = [];

    for (const text of texts) {
      if (!text || typeof text !== 'string') continue;
      try {
        scopedRules.push(...extractScopedRules(stripCssComments(text), filter, buildOptions));
      } catch (e) {
        console.warn('dt: unable to extract stable CSS for override', e);
      }
    }

    return scopedRules.join('\n');
  }

  // Components covered by the stable swap: avatar, presence, badge, button, banner.
  function selectorTargetsAvatar(header) {
    return /\.d-(?:avatar|presence|badge|btn|banner)(?:$|[\s.:,[>+~#]|--|__)/.test(header);
  }

  function extractMatchingRules(text, selectorPredicate, options) {
    const rules = [];
    let pos = 0;
    while (pos < text.length) {
      const openIndex = text.indexOf('{', pos);
      if (openIndex === -1) break;
      const header = ruleHeader(text, pos, openIndex);
      const closeIndex = matchingBraceIndex(text, openIndex);
      if (closeIndex === -1) break;
      const body = text.slice(openIndex + 1, closeIndex);
      pos = closeIndex + 1;

      if (!header) continue;
      if (header.startsWith('@')) {
        const children = extractMatchingRules(body, selectorPredicate, options);
        if (!children.length) continue;
        if (!options.preserveLayers && header.startsWith('@layer')) {
          rules.push(...children);
        } else {
          rules.push(`${header} {\n${children.join('\n')}\n}`);
        }
        continue;
      }

      if (selectorPredicate(header)) rules.push(`${header} {${body}}`);
    }
    return rules;
  }

  function buildAvatarComponentCss(cssTextList, options = {}) {
    const buildOptions = { preserveLayers: false, ...options };
    const texts = Array.isArray(cssTextList) ? cssTextList : [cssTextList];
    const rules = [];
    for (const text of texts) {
      if (!text || typeof text !== 'string') continue;
      try {
        rules.push(...extractMatchingRules(stripCssComments(text), selectorTargetsAvatar, buildOptions));
      } catch (e) {
      console.warn('dt: unable to extract Avatar/Presence stable CSS', e);
      }
    }
    return rules.join('\n');
  }

  function collectTokenRefs(cssText) {
    const refs = new Set();
    const re = /var\(\s*(--[A-Za-z0-9-]+)/g;
    let match;
    while ((match = re.exec(cssText)) !== null) refs.add(match[1]);
    return refs;
  }

  // Token values chain to other tokens (e.g. --dt-presence-color-available:
  // var(--dt-color-green-475)), and next's page may not define the primitives
  // stable chains to. Expand refs through the map until fixpoint so the
  // emitted scoped rule is self-contained.
  function expandTokenRefs(refs, map) {
    const out = new Set(refs);
    for (let pass = 0; pass < 8; pass++) {
      let added = false;
      for (const name of [...out]) {
        const value = map[name];
        if (typeof value !== 'string') continue;
        for (const ref of collectTokenRefs(value)) {
          if (!out.has(ref)) {
            out.add(ref);
            added = true;
          }
        }
      }
      if (!added) break;
    }
    return out;
  }

  // Pre-expand var() refs within stable map values to literals through the map.
  // Stable values often chain to primitives the next page never defines — expanding
  // ensures substituted values are self-contained (no collapsed var() on next's tags).
  function expandMapValues(map) {
    const expanded = { ...map };
    for (let pass = 0; pass < 8; pass++) { // 8 passes exceeds the max observed chain depth in stable token files (≤3 hops)
      let changed = false;
      for (const name of Object.keys(expanded)) {
        const newValue = expanded[name].replace(
          /var\(\s*(--[A-Za-z0-9-]+)\s*(?:,[^)]+)?\)/g,
          (_, ref) => (expanded[ref] !== undefined ? expanded[ref] : `var(${ref})`),
        );
        if (newValue !== expanded[name]) { expanded[name] = newValue; changed = true; }
      }
      if (!changed) break;
    }
    return expanded;
  }

  // Substitute --dt-* declaration values in-place within a CSS text string.
  // Preserves structure, mode blocks, @layer wrappers, selectors, and token names.
  // maps: { light: Object|null, dark: Object|null } — already expanded via expandMapValues.
  // currentMode: 'light'|'dark' — used for unscoped blocks (:root, legacy flat blocks).
  // Returns { text: string, substitutions: number }.
  function substituteTokenValues(cssText, maps, currentMode) {
    let substitutions = 0;

    function rewriteDecls(body, stableMap) {
      return body.replace(/(--dt-[A-Za-z0-9-]+)(\s*:\s*)([^;}\n]+)/g, (match, name, sep) => {
        if (stableMap[name] !== undefined) {
          substitutions++;
          return `${name}${sep}${stableMap[name]}`;
        }
        // Task 2: rename lookup (globalThis.__dtTokenRenames set by token-renames.js)
        const renames = globalThis.__dtTokenRenames;
        if (renames) {
          for (const candidate of (renames.toStable(name) || [])) {
            if (stableMap[candidate] !== undefined) {
              substitutions++;
              return `${name}${sep}${stableMap[candidate]}`;
            }
          }
        }
        return match;
      });
    }

    function rewriteBlocks(text, modeContext) {
      let result = '';
      let pos = 0;
      while (pos < text.length) {
        const openIndex = text.indexOf('{', pos);
        if (openIndex === -1) { result += text.slice(pos); break; }
        const header = ruleHeader(text, pos, openIndex);
        const closeIndex = matchingBraceIndex(text, openIndex);
        if (closeIndex === -1) { result += text.slice(pos); break; }
        const body = text.slice(openIndex + 1, closeIndex);
        result += text.slice(pos, openIndex + 1); // everything up to and including {

        let childMode = modeContext;
        if (/\[data-dt-mode\s*=\s*["']?light["']?\]/.test(header)) childMode = 'light';
        else if (/\[data-dt-mode\s*=\s*["']?dark["']?\]/.test(header)) childMode = 'dark';
        else if (/\[data-dt-theme\s*=\s*["']?light["']?\]/.test(header)) childMode = 'light';
        else if (/\[data-dt-theme\s*=\s*["']?dark["']?\]/.test(header)) childMode = 'dark';

        if (body.includes('{')) {
          result += rewriteBlocks(body, childMode);
        } else {
          const activeMode = childMode || currentMode;
          const activeMap = maps[activeMode];
          result += activeMap != null ? rewriteDecls(body, activeMap) : body;
        }

        result += text[closeIndex]; // closing brace
        pos = closeIndex + 1;
      }
      return result;
    }

    const text = rewriteBlocks(stripCssComments(cssText), null);
    return { text, substitutions };
  }

  function stableMapToScopedCss(map, tokenNames, selector) {
    if (!map || !tokenNames?.size) return '';
    const declarations = [];
    for (const name of [...tokenNames].sort()) {
      const value = map[name];
      if (typeof value !== 'string' || !value.trim()) continue;
      declarations.push(`${name}: ${value.trim()};`);
    }
    return declarations.length ? `${selector} { ${declarations.join(' ')} }` : '';
  }

  function stableMapToRootCss(map, tokenFilter = stableOverrideTokenFilter) {
    if (!map || !Object.keys(map).length) return '';
    const filter = normalizeTokenFilter(tokenFilter);
    const declarations = Object.entries(map)
      .filter(([name]) => isAllowedStableTokenName(name, filter))
      .map(([name, value]) => `${name}: ${String(value).trim()};`)
      .join(' ');
    return declarations ? `:root { ${declarations} }` : '';
  }

  function countOverrideDeclarations(cssText) {
    const out = { total: 0, color: 0, nonColor: 0, byPrefix: {} };
    const re = /(--[A-Za-z0-9-]+)\s*:/g;
    let match;
    while ((match = re.exec(cssText)) !== null) {
      out.total += 1;
      out[valueKind(match[1])] += 1;
      const prefix = tokenPrefix(match[1]);
      out.byPrefix[prefix] = (out.byPrefix[prefix] || 0) + 1;
    }
    out.byPrefix = Object.fromEntries(
      Object.entries(out.byPrefix).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    );
    return out;
  }

  function summarizeTokenFilter(tokenFilter) {
    const filter = normalizeTokenFilter(tokenFilter);
    return {
      exactNames: filter.exact.size,
      prefixes: filter.prefixes.length,
      sourceCounts: filter.sourceCounts || null,
      prefixSample: filter.prefixes.slice(0, 16),
    };
  }

  function isVisibleElement(el) {
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity || 1) > 0
    );
  }

  function captureOverrideSnapshot(tokenFilter) {
    const filter = normalizeTokenFilter(tokenFilter);
    return [...document.querySelectorAll('[class*="d-"]')]
      .filter(isVisibleElement)
      .slice(0, 80)
      .map((el, index) => {
        const style = getComputedStyle(el);
        const tokens = {};
        for (let i = 0; i < style.length; i++) {
          const name = style[i];
          if (name.startsWith('--') && isAllowedStableTokenName(name, filter)) {
            const value = style.getPropertyValue(name).trim();
            if (value) tokens[name] = value;
          }
        }
        const props = {};
        for (const prop of PROBE_PROPS) {
          const value = style.getPropertyValue(prop).trim();
          if (value) props[prop] = value;
        }
        return {
          key: `${index}:${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 6).join('.')}`,
          tokens,
          props,
        };
      });
  }

  function diffOverrideSnapshots(before, after) {
    const out = {
      sampledElements: before.length,
      tokenDiffs: { total: 0, color: 0, nonColor: 0 },
      propertyDiffs: { total: 0, color: 0, nonColor: 0 },
      samples: [],
    };
    for (let i = 0; i < Math.min(before.length, after.length); i++) {
      for (const [name, beforeValue] of Object.entries(before[i].tokens)) {
        const afterValue = after[i].tokens[name];
        if (afterValue && afterValue !== beforeValue) {
          const kind = valueKind(name);
          out.tokenDiffs.total += 1;
          out.tokenDiffs[kind] += 1;
          if (out.samples.length < 12) {
            out.samples.push({ class: before[i].key, name, before: beforeValue, after: afterValue });
          }
        }
      }
      for (const [name, beforeValue] of Object.entries(before[i].props)) {
        const afterValue = after[i].props[name];
        if (afterValue && afterValue !== beforeValue) {
          const kind = valueKind(name);
          out.propertyDiffs.total += 1;
          out.propertyDiffs[kind] += 1;
          if (out.samples.length < 12) {
            out.samples.push({ class: before[i].key, property: name, before: beforeValue, after: afterValue });
          }
        }
      }
    }
    return out;
  }

  function removeOverrideSheet() {
    if (!overrideSheet || !document.adoptedStyleSheets) {
      overrideSheet = null;
      return;
    }
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (sheet) => sheet !== overrideSheet,
    );
    overrideSheet = null;
  }

  function adoptOverrideCss(cssText) {
    removeOverrideSheet();
    if (!cssText.trim()) return false;
    if (typeof CSSStyleSheet === 'undefined' || !document.adoptedStyleSheets) {
      console.warn('dt: adoptedStyleSheets unavailable; stable override skipped');
      return false;
    }
    const sheet = new CSSStyleSheet();
    try {
      sheet.replaceSync(cssText);
    } catch (e) {
      console.warn('dt: unable to apply stable override CSS', e);
      return false;
    }
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    overrideSheet = sheet;
    return true;
  }

  function removeAvatarSwapSheet() {
    if (!avatarSwapSheet || !document.adoptedStyleSheets) {
      avatarSwapSheet = null;
      return;
    }
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (sheet) => sheet !== avatarSwapSheet,
    );
    avatarSwapSheet = null;
  }

  function adoptAvatarSwapCss(cssText) {
    removeAvatarSwapSheet();
    if (!cssText.trim()) return false;
    if (typeof CSSStyleSheet === 'undefined' || !document.adoptedStyleSheets) {
      console.warn('dt: adoptedStyleSheets unavailable; Avatar/Presence swap skipped');
      return false;
    }
    const sheet = new CSSStyleSheet();
    try {
      sheet.replaceSync(cssText);
    } catch (e) {
      console.warn('dt: unable to apply Avatar stable CSS', e);
      return false;
    }
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
    avatarSwapSheet = sheet;
    return true;
  }


  function countAvatarCssRules(cssText) {
    return (cssText.match(/\.d-(?:avatar|presence|badge|btn|banner)(?:$|[\s.:,[>+~#]|--|__)/g) || []).length;
  }

  // --- Token discovery ------------------------------------------------------

  function tokensInRuleStyle(style) {
    const found = new Set();
    for (let i = 0; i < style.length; i++) {
      const value = style.getPropertyValue(style[i]);
      VAR_RE.lastIndex = 0;
      let m;
      while ((m = VAR_RE.exec(value)) !== null) found.add(m[1]);
    }
    return found;
  }

  // Recurse through CSSStyleRule (selector + declarations) and CSSGroupingRule
  // (@layer / @media / @supports / @container, which expose nested cssRules).
  function walkRules(rules, out) {
    for (const rule of rules) {
      if (rule.selectorText && rule.style) {
        const tokens = tokensInRuleStyle(rule.style);
        if (tokens.size) out.push({ selectorText: rule.selectorText, tokens: [...tokens] });
        // Harvest utility-class index alongside token discovery — no extra pass.
        const um = UTIL_SEL_RE.exec(rule.selectorText);
        if (um && utilIndex) utilIndex.set(um[1], rule.style.cssText);
      }
      if (rule.cssRules) walkRules(rule.cssRules, out);
    }
  }

  function buildTokenIndex() {
    utilIndex = new Map(); // populated by walkRules below alongside token discovery
    const out = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules; // cross-origin sheets throw SecurityError
      } catch {
        continue;
      }
      if (rules) walkRules(rules, out);
    }
    return out;
  }

  const norm = (s) => (s || '').trim().toLowerCase();

  function nextValueFor(el, name) {
    return getComputedStyle(el).getPropertyValue(name).trim();
  }

  // Return [{ name, next }] for the --dt-* tokens applied to `el`: tokens
  // referenced by rules that match the element (or by its inline style). The
  // stable side is looked up from `stableMap` at render time.
  function collectTokensForElement(el) {
    if (!tokenIndex || !(el instanceof Element)) return [];
    const names = new Set();

    for (const entry of tokenIndex) {
      try {
        if (el.matches(entry.selectorText)) entry.tokens.forEach((n) => names.add(n));
      } catch {
        // Unsupported / pseudo-element selectors throw in matches() — skip.
      }
    }

    const inline = el.getAttribute('style');
    if (inline) {
      NAME_RE.lastIndex = 0;
      let m;
      while ((m = NAME_RE.exec(inline)) !== null) names.add(m[0]);
    }

    if (!names.size) return [];

    const tokens = [];
    for (const name of names) {
      const next = nextValueFor(el, name);
      if (next) tokens.push({ name, next });
    }
    tokens.sort((a, b) => a.name.localeCompare(b.name));
    return tokens;
  }

  // Return [{ name, decls }] for every d-* class on `el`. Detection is
  // prefix-only (origin-independent); declarations are a best-effort lookup
  // from utilIndex (empty string when the rule wasn't readable).
  function collectUtilitiesForElement(el) {
    if (!utilIndex || !(el instanceof Element)) return [];
    const names = [...el.classList].filter((c) => c.startsWith('d-') && c.length > 2);
    if (!names.length) return [];
    return names
      .map((name) => ({ name, decls: utilIndex.get(name) ?? '' }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // --- Tooltip --------------------------------------------------------------

  // A Shadow-DOM host fully isolates the tooltip from page CSS (even aggressive
  // `* !important` rules). pointer-events: none means it never becomes a hover
  // target and never blocks the elements underneath.
  function ensureTooltip() {
    if (tipHost) return;
    tipHost = document.createElement('div');
    tipHost.id = TIP_ID;
    const root = tipHost.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2147483647;
        pointer-events: none;
        display: none;
      }
      .tip {
        font: 11px/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background: #1b1b1b;
        color: #f4f4f5;
        border: 1px solid #3f3f46;
        border-radius: 6px;
        padding: 6px 8px;
        max-width: 380px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      }
      .row {
        display: flex;
        gap: 10px;
        white-space: nowrap;
        align-items: baseline;
      }
      .row + .row {
        margin-top: 2px;
      }
      .name {
        color: #c4b5fd;
      }
      .val {
        color: #fcd34d;
      }
      .arrow {
        color: #71717a;
      }
      .stable {
        color: #86efac;
      }
      .badge {
        font-size: 9px;
        padding: 0 4px;
        border-radius: 3px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .badge.changed {
        background: #7c2d12;
        color: #fdba74;
      }
      .badge.new {
        background: #1e3a5f;
        color: #7dd3fc;
      }
      .sep {
        border-top: 1px solid #3f3f46;
        margin: 4px 0;
      }
      .uname {
        color: #86efac;
      }
      .udecl-row {
        padding-left: 10px;
      }
      .udecl {
        color: #a1a1aa;
        font-size: 10px;
        white-space: nowrap;
      }
      .more {
        color: #52525b;
        font-style: italic;
      }
    `;
    tipBody = document.createElement('div');
    tipBody.className = 'tip';
    root.append(style, tipBody);
    // documentElement is always present, even before <body> parses.
    document.documentElement.appendChild(tipHost);
  }

  function addSpan(row, cls, text) {
    const s = document.createElement('span');
    s.className = cls;
    s.textContent = text;
    row.appendChild(s);
  }

  // Each row: token name, then either next → stable (with a "changed" badge),
  // a "new in next" marker (no stable counterpart), or just the next value when
  // no stable map is available (fetch pending/failed — inspect is never blocked).
  function renderTokens(tokens) {
    tipBody.textContent = '';
    for (const t of tokens) {
      const row = document.createElement('div');
      row.className = 'row';
      addSpan(row, 'name', t.name);

      const stable = stableMap ? stableMap[t.name] : undefined;
      if (!stableMap) {
        addSpan(row, 'val', t.next);
      } else if (stable === undefined) {
        addSpan(row, 'val', t.next);
        addSpan(row, 'badge new', 'new in next');
      } else {
        addSpan(row, 'val', t.next);
        addSpan(row, 'arrow', '→');
        addSpan(row, 'stable', stable);
        if (norm(stable) !== norm(t.next)) addSpan(row, 'badge changed', 'changed');
      }
      tipBody.appendChild(row);
    }
  }

  // Append utility-class rows to tipBody after token rows. addSep=true adds a
  // divider line when both tokens and utilities are present.
  function renderUtilities(utils, addSep) {
    if (!utils.length) return;
    if (addSep) {
      const sep = document.createElement('div');
      sep.className = 'sep';
      tipBody.appendChild(sep);
    }
    for (const u of utils) {
      const nameRow = document.createElement('div');
      nameRow.className = 'row';
      addSpan(nameRow, 'uname', u.name);
      tipBody.appendChild(nameRow);

      if (u.decls) {
        // Show only --custom-property declarations (token-relevant); skip layout/paint props
        const decls = u.decls.split(';').map(d => d.trim()).filter(d => d.startsWith('--'));
        const shown = decls.slice(0, 6);
        const hidden = decls.length - shown.length;
        for (const d of shown) {
          const drow = document.createElement('div');
          drow.className = 'row udecl-row';
          addSpan(drow, 'udecl', d);
          tipBody.appendChild(drow);
        }
        if (hidden > 0) {
          const mrow = document.createElement('div');
          mrow.className = 'row udecl-row';
          addSpan(mrow, 'udecl more', `…+${hidden} more`);
          tipBody.appendChild(mrow);
        }
      }
    }
  }

  function positionTooltip() {
    if (!tipHost || tipHost.style.display === 'none') return;
    const pad = 14;
    // Measure the rendered tooltip box (.tip inside the shadow root) so the
    // viewport-edge flip uses the real dimensions regardless of how the :host
    // box is styled. Falls back to the host box if .tip isn't available.
    const rect = (tipBody ?? tipHost).getBoundingClientRect();
    let x = lastX + pad;
    let y = lastY + pad;
    if (x + rect.width > window.innerWidth) x = lastX - rect.width - pad;
    if (y + rect.height > window.innerHeight) y = lastY - rect.height - pad;
    tipHost.style.left = Math.max(0, x) + 'px';
    tipHost.style.top = Math.max(0, y) + 'px';
  }

  function onMouseOver(e) {
    const t = e.target;
    const tokens = collectTokensForElement(t);
    const utils = collectUtilitiesForElement(t);
    if (!tokens.length && !utils.length) {
      if (tipHost) tipHost.style.display = 'none';
      return;
    }
    ensureTooltip();
    renderTokens(tokens);
    renderUtilities(utils, tokens.length > 0);
    tipHost.style.display = 'block';
    positionTooltip();
  }

  // Reposition only — never recompute tokens on move. Coalesced to one update
  // per animation frame to keep the move handler cheap.
  function onMouseMove(e) {
    lastX = e.clientX;
    lastY = e.clientY;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      positionTooltip();
    });
  }

  // --- Theme detection + stable-token fetch ---------------------------------

  function detectTheme() {
    const root = document.documentElement;
    let brand = root.getAttribute('data-dt-brand');
    // data-dt-mode: new layered API (initDialtoneTheme/setMode in dialpad-uikits)
    let mode = root.getAttribute('data-dt-mode');
    // data-dt-theme: legacy API (setTheme in firespotter)
    if (!mode) mode = root.getAttribute('data-dt-theme');
    // Body class: dialtone-theme-light/dark (firespotter sets both attrs and body class)
    if (!mode) {
      if (document.body?.classList.contains('dialtone-theme-dark')) mode = 'dark';
      else if (document.body?.classList.contains('dialtone-theme-light')) mode = 'light';
    }
    // URL param: ?dt-theme= (firespotter's getDialtoneThemeFromURL)
    if (!mode) {
      try {
        const p = new URL(window.location.href).searchParams;
        const v = (p.get('dt-theme') || p.get('DT-THEME') || '').toLowerCase();
        if (v === 'light' || v === 'dark') mode = v;
      } catch { /* cross-origin guard */ }
    }
    // Linked stylesheet: apps that <link> tokens-<brand>-<mode>.css
    if (!brand || !mode) {
      for (const sheet of document.styleSheets) {
        const m = sheet.href && sheet.href.match(/tokens-([a-z0-9-]+)-(light|dark)\.css/);
        if (m) {
          brand = brand || m[1];
          mode = mode || m[2];
          break;
        }
      }
    }
    // colorScheme last resort for mode
    if (!mode) {
      const cs = getComputedStyle(root).colorScheme;
      if (cs === 'light' || cs === 'dark') mode = cs;
    }
    // Brand always defaults to 'dp' (mirrors firespotter: getAttribute(...) || 'dp')
    brand = brand || 'dp';
    // Mode falls back to 'light' so the extension works on pages without any
    // Dialtone theme markers (e.g. admin pages) instead of silently bailing.
    return { brand, mode: mode || 'light' };
  }

  function sendMessage(msg) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(msg, (resp) =>
          resolve(chrome.runtime.lastError ? null : resp),
        );
      } catch {
        resolve(null);
      }
    });
  }

  async function stableRequestOptions() {
    const { dtVersion = 'latest', dtThemeOverride = null } = await chrome.storage.local.get([
      'dtVersion',
      'dtThemeOverride',
    ]);
    const theme =
      dtThemeOverride && dtThemeOverride.brand && dtThemeOverride.mode
        ? dtThemeOverride
        : detectTheme();
    if (!theme) {
      stableMap = null;

      return null;
    }
    return {
      version: dtVersion,
      brand: theme.brand,
      mode: theme.mode,
      theme,
    };
  }

  // Resolve the theme (manual override wins) and fetch+cache the stable map via
  // the service worker. Stores it in `stableMap`; returns it (or null on failure).
  async function loadStableMap() {
    const request = await stableRequestOptions();
    if (!request) return null;
    const res = await sendMessage({
      type: 'getStableTokens',
      version: request.version,
      brand: request.brand,
      mode: request.mode,
    });
    if (!res || res.error || !res.map) {
      stableMap = null;

      return null;
    }
    stableMap = res.map;
    stableTheme = request.theme;
    return res.map;
  }

  async function loadStableOverrideCss() {
    const request = await stableRequestOptions();
    if (!request) return null;

    const [tokenFilter, tokenRes, frameworkRes] = await Promise.all([
      loadDiscoveryTokenFilter(),
      sendMessage({
        type: 'getStableTokens',
        version: request.version,
        brand: request.brand,
        mode: request.mode,
      }),
      sendMessage({
        type: 'getStableFrameworkCss',
        version: request.version,
      }),
    ]);
    if (!tokenFilter) return null;

    const cssTexts = [];
    if (tokenRes && !tokenRes.error && tokenRes.map) {
      stableMap = tokenRes.map;

      cssTexts.push(tokenRes.tokenCss || stableMapToRootCss(tokenRes.map, tokenFilter));
    } else {
      stableMap = null;
      console.warn('dt: stable token CSS unavailable for override', tokenRes?.error || 'no response');
    }

    if (frameworkRes && !frameworkRes.error && frameworkRes.frameworkCss) {
      cssTexts.push(frameworkRes.frameworkCss);
    } else {
      console.warn(
        'dt: stable framework CSS unavailable; applying root tokens only',
        frameworkRes?.error || 'no response',
      );
    }

    return {
      cssText: buildScopedCustomPropertyCss(cssTexts, tokenFilter, { excludeAvatarPresence: true }),
      tokenFilter,
      sources: {
        tokenCss: !!(tokenRes && !tokenRes.error && tokenRes.map),
        frameworkCss: !!(frameworkRes && !frameworkRes.error && frameworkRes.frameworkCss),
        tokenVersion: tokenRes?.resolvedVersion || null,
        frameworkVersion: frameworkRes?.resolvedVersion || null,
      },
    };
  }

  async function loadStableAvatarSwapCss() {
    const request = await stableRequestOptions();
    if (!request) return null;

    const [tokenRes, frameworkRes] = await Promise.all([
      sendMessage({
        type: 'getStableTokens',
        version: request.version,
        brand: request.brand,
        mode: request.mode,
      }),
      sendMessage({
        type: 'getStableFrameworkCss',
        version: request.version,
      }),
    ]);

    if (!frameworkRes || frameworkRes.error || !frameworkRes.frameworkCss) {
      console.warn(
        'dt: stable framework CSS unavailable for Avatar/Presence swap',
        frameworkRes?.error || 'no response',
      );
      return null;
    }

    if (tokenRes && !tokenRes.error && tokenRes.map) {
      stableMap = tokenRes.map;

    }

    const avatarCss = buildAvatarComponentCss(frameworkRes.frameworkCss);
    if (!avatarCss.trim()) return null;
    const tokenRefs = expandTokenRefs(collectTokenRefs(avatarCss), tokenRes?.map || {});
    const scopedTokenCss = stableMapToScopedCss(
      tokenRes?.map || {},
      tokenRefs,
      AVATAR_TOKEN_SCOPE_SELECTOR,
    );
    const cssText = [scopedTokenCss, avatarCss].filter(Boolean).join('\n');
    return {
      cssText,
      tokenRefs,
      sources: {
        tokenCss: !!(tokenRes && !tokenRes.error && tokenRes.map),
        frameworkCss: true,
        tokenVersion: tokenRes?.resolvedVersion || null,
        frameworkVersion: frameworkRes.resolvedVersion || null,
      },
    };
  }

  async function enableOverride() {
    overrideOn = true;
    const requestId = ++overrideRequestId;
    const result = await loadStableOverrideCss();
    if (!overrideOn || requestId !== overrideRequestId) return { ok: false, skipped: true };
    if (!result?.cssText?.trim()) {
      removeOverrideSheet();
      lastOverrideReport = null;
      return { ok: false, error: 'no stable override CSS' };
    }
    const before = captureOverrideSnapshot(result.tokenFilter);
    const ok = adoptOverrideCss(result.cssText);
    const after = ok ? captureOverrideSnapshot(result.tokenFilter) : [];
    lastOverrideReport = {
      sources: result.sources,
      discovery: summarizeTokenFilter(result.tokenFilter),
      declarations: countOverrideDeclarations(result.cssText),
      changes: ok ? diffOverrideSnapshots(before, after) : null,
    };
    console.info('dt: stable override report', lastOverrideReport);
    return { ok, report: lastOverrideReport };
  }

  async function enableAvatarSwap() {
    avatarSwapOn = true;
    const requestId = ++avatarSwapRequestId;
    const result = await loadStableAvatarSwapCss();
    if (!avatarSwapOn || requestId !== avatarSwapRequestId) return { ok: false, skipped: true };
    if (!result?.cssText?.trim()) {
      removeAvatarSwapSheet();
      lastAvatarSwapReport = null;
      return { ok: false, error: 'no stable Avatar/Presence CSS' };
    }

    globalThis.__dtStructure.enable(globalThis.DT_STRUCTURE_RULES);
    const ok = adoptAvatarSwapCss(result.cssText);
    if (!ok) {
      globalThis.__dtStructure.disable();
      lastAvatarSwapReport = null;
      return { ok: false, error: 'Avatar/Presence stable CSS could not be applied' };
    }
    const avatarCount = document.querySelectorAll('.d-avatar').length;
    const presenceCount = document.querySelectorAll('.d-presence').length;
    lastAvatarSwapReport = {
      sources: result.sources,
      rules: countAvatarCssRules(result.cssText),
      scopedTokens: result.tokenRefs.size,
      avatars: avatarCount,
      presence: presenceCount,
      remapped: globalThis.__dtStructure.remapCount,
    };
    console.info('dt: Avatar/Presence stable swap report', lastAvatarSwapReport);
    return { ok, report: lastAvatarSwapReport };
  }

  function disableOverride() {
    overrideOn = false;
    overrideRequestId += 1;
    removeOverrideSheet();
    return { ok: true };
  }

  function disableAvatarSwap() {
    avatarSwapOn = false;
    avatarSwapRequestId += 1;
    removeAvatarSwapSheet();
    globalThis.__dtStructure.disable();
    return { ok: true };
  }

  // --- Replace mode: swap the page's Dialtone sheets for stable, in place ----
  // A page <style> is Dialtone-owned when ≥80% of its rules are .d-* selectors
  // or :root --dt-* token blocks. Content-swapping the node keeps the exact
  // cascade position; app sheets are never touched. Mixed sheets are skipped
  // and reported rather than risking app CSS.

  function classifyDialtoneSheet(sheet) {
    let rules;
    try { rules = sheet.cssRules; } catch { return null; } // cross-origin
    if (!rules || rules.length < 50) return null;
    let dt = 0;
    for (const r of rules) {
      if (r.selectorText?.includes('.d-')) dt += 1;
      else if (r.selectorText === ':root' && r.cssText.includes('--dt-')) dt += 1;
      else if (r.cssRules) {
        for (const c of r.cssRules) if (c.selectorText?.includes('.d-')) { dt += 1; break; }
      }
    }
    return dt / rules.length >= 0.8 ? { dtShare: dt / rules.length, size: rules.length } : null;
  }

  async function enableReplace() {
    replaceOn = true;
    let requestId = ++replaceRequestId;
    const request = await stableRequestOptions();
    if (!replaceOn || requestId !== replaceRequestId) return { ok: false, skipped: true };
    if (!request) return { ok: false, error: 'no theme' };

    const [lightRes, darkRes] = await Promise.all([
      sendMessage({ type: 'getStableTokens', version: request.version, brand: request.brand, mode: 'light' }),
      sendMessage({ type: 'getStableTokens', version: request.version, brand: request.brand, mode: 'dark' }),
    ]);
    if (!replaceOn || requestId !== replaceRequestId) return { ok: false, skipped: true };

    const currentModeRes = request.mode === 'light' ? lightRes : darkRes;
    if (!currentModeRes?.map) {
      return { ok: false, error: currentModeRes?.error || 'no stable token map' };
    }

    const maps = {
      light: lightRes?.map ? expandMapValues(lightRes.map) : null,
      dark:  darkRes?.map  ? expandMapValues(darkRes.map)  : null,
    };
    const partial = !maps.light ? 'missing light map' : (!maps.dark ? 'missing dark map' : null);

    disableReplace(); // idempotent re-enable — restores originals first
    replaceOn = true;
    requestId = replaceRequestId; // disableReplace bumped the counter; re-sync so future guards stay valid

    // Tagged Dialtone sheets first; fall back to rule-share heuristic for untagged pages.
    let targets = [...document.querySelectorAll('style[id*="dialtone"]')];
    let skippedMixed = 0;
    if (!targets.length) {
      for (const sheet of [...document.styleSheets]) {
        const node = sheet.ownerNode;
        if (!(node instanceof HTMLStyleElement)) continue;
        if (classifyDialtoneSheet(sheet)) targets.push(node);
        else if (sheet.cssRules?.length >= 50 && node.textContent.includes('.d-avatar')) skippedMixed += 1;
      }
    }

    const replacedIds = [];
    let totalSubstitutions = 0;
    for (const node of targets) {
      replacedSheets.push({ node, originalText: node.textContent });
      const { text, substitutions } = substituteTokenValues(node.textContent, maps, request.mode);
      node.textContent = text;
      replacedIds.push(node.id || '(no id)');
      totalSubstitutions += substitutions;
    }

    lastReplaceReport = {
      replaced: replacedIds.length,
      replacedIds,
      skippedMixed,
      substitutions: totalSubstitutions,
      ...(partial ? { partial } : {}),
      versions: { token: lightRes?.resolvedVersion || darkRes?.resolvedVersion || null },
    };
    console.info('dt: replace report', lastReplaceReport);
    // ponytail: no content observer — app rewriting a tag mid-toggle needs a re-toggle
    return {
      ok: replacedIds.length > 0,
      report: lastReplaceReport,
      error: replacedIds.length ? undefined : 'no Dialtone sheet found',
    };
  }

  function disableReplace() {
    replaceOn = false;
    replaceRequestId += 1;
    for (const { node, originalText } of replacedSheets) {
      if (node.isConnected) node.textContent = originalText;
    }
    replacedSheets = [];
    return { ok: true };
  }

  // --- Activation -----------------------------------------------------------

  function activateInspect() {
    if (inspectOn) return;
    inspectOn = true;
    tokenIndex = buildTokenIndex();
    ensureTooltip();
    loadStableMap(); // preload stable map for the diff tooltip (non-blocking)
    document.addEventListener('mouseover', onMouseOver, true);
    document.addEventListener('mousemove', onMouseMove, true);
  }

  function deactivateInspect() {
    inspectOn = false;
    document.removeEventListener('mouseover', onMouseOver, true);
    document.removeEventListener('mousemove', onMouseMove, true);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    tipHost?.remove();
    tipHost = null;
    tipBody = null;
    tokenIndex = null;
    utilIndex = null;
  }

  // Toggles are per-tab: ask the service worker for this tab's state on load.
  // Config (dtVersion/dtThemeOverride) stays global in storage.local.
  sendMessage({ type: 'getTabState' }).then((s) => {
    if (s?.dtInspect) activateInspect();
    if (s?.dtOverride) enableOverride();
    if (s?.dtAvatarSwap) enableAvatarSwap();
    if (s?.dtReplace) enableReplace();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;
    const themeChanged = 'dtThemeOverride' in changes || 'dtVersion' in changes;
    if (themeChanged && (inspectOn || overrideOn || avatarSwapOn || replaceOn)) {
      stableMap = null;
      if (inspectOn) loadStableMap();
      if (overrideOn) enableOverride();
      if (avatarSwapOn) enableAvatarSwap();
      if (replaceOn) enableReplace();
    }
  });

  // Polling chrome.runtime.id detects orphaned content scripts (extension reloaded
  // without page reload) and cleans up stale hover listeners.
  const _orphanCheck = setInterval(() => {
    try {
      if (!chrome.runtime?.id) throw new Error();
    } catch {
      clearInterval(_orphanCheck);
      deactivateInspect();
      disableOverride();
      disableAvatarSwap();
      disableReplace();
    }
  }, 1000);

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg?.type === 'getDetectedTheme') {
      if (window.top === window) sendResponse({ theme: detectTheme() });
      return false;
    }
    if (msg?.type === 'setInspect') {
      if (msg.value) activateInspect(); else deactivateInspect();
      sendResponse({ ok: true });
      return false;
    }
    if (msg?.type === 'setOverride') {
      if (msg.value) enableOverride().then(sendResponse)
        .catch(e => sendResponse({ ok: false, error: String(e?.message || e) }));
      else sendResponse(disableOverride());
      return !!msg.value;
    }
    if (msg?.type === 'setAvatarSwap') {
      if (msg.value) enableAvatarSwap().then(sendResponse)
        .catch(e => sendResponse({ ok: false, error: String(e?.message || e) }));
      else sendResponse(disableAvatarSwap());
      return !!msg.value;
    }
    if (msg?.type === 'getOverrideReport') {
      sendResponse({ ok: true, report: lastOverrideReport });
      return false;
    }
    if (msg?.type === 'getAvatarSwapReport') {
      sendResponse({ ok: true, report: lastAvatarSwapReport });
      return false;
    }
    if (msg?.type === 'setReplace') {
      if (msg.value) enableReplace().then(sendResponse)
        .catch(e => sendResponse({ ok: false, error: String(e?.message || e) }));
      else sendResponse(disableReplace());
      return !!msg.value;
    }
    if (msg?.type === 'getReplaceReport') {
      sendResponse({ ok: true, report: lastReplaceReport });
      return false;
    }
    return false;
  });
})();
