// Dialtone Migration Helper — service worker (MV3, classic worker).
//
// Fetches the latest stable (or pinned) Dialtone token CSS from the unpkg CDN,
// parses it into a { "--dt-name": "value" } map, and caches it in
// chrome.storage.local. The content script / popup request maps via message:
//   { type: 'getStableTokens', version, brand, mode } -> { resolvedVersion, map } | { error }
//   { type: 'refreshTokens',  version, brand, mode } -> same, after clearing cache
//
// "version" is "latest" (npm dist-tag → newest STABLE release, never `next`) or
// a pinned semver. The page under inspection runs the unreleased `next`; this
// worker only ever holds a published release.

const TOKENS_BASE = 'https://unpkg.com/@dialpad/dialtone';

function tokenUrl(version, brand, mode) {
  return `${TOKENS_BASE}@${version}/dist/tokens/css/tokens-${brand}-${mode}.css`;
}

// Palette primitives (--dt-color-*, sizes, spaces) live in the base tokens
// file; the brand file only holds semantic tokens whose values chain to them.
// Both are needed for var() chains to resolve.
function baseTokenUrl(version, mode) {
  return `${TOKENS_BASE}@${version}/dist/tokens/css/tokens-base-${mode}.css`;
}

function frameworkCssUrl(version) {
  return `${TOKENS_BASE}@${version}/dist/css/dialtone.css`;
}

// v2: cache now includes base tokens — old dtTokens: entries lack primitives.
function cacheKey(version, brand, mode) {
  return `dtTokens2:${version}:${brand}-${mode}`;
}

function cacheKeyFw(version) {
  return `dtFrameworkCss:${version}`;
}

// Parse `:root { --dt-…: value; }` declarations into a map. Pure (string→object).
// Defense-in-depth on CDN-fetched strings: skip values that are HTML-injectable,
// over-long, or carry a javascript: URL — custom-property values are inert in the
// cascade, but this guards a compromised/malformed response.
function parseTokenCss(text) {
  // Restrict to the :root block so declarations in other rule blocks are ignored.
  const root = text.match(/:root\s*\{([^}]*)\}/s)?.[1] ?? '';
  const map = {};
  const re = /(--dt-[A-Za-z0-9-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(root)) !== null) {
    const name = m[1];
    const value = m[2].trim();
    if (!value) continue;
    if (value.length > 512) {
      console.warn('dt: skipping over-long token value', name);
      continue;
    }
    if (/[<>]/.test(value)) {
      console.warn('dt: skipping HTML-injectable token value', name);
      continue;
    }
    if (/url\s*\(\s*['"]?\s*javascript:/i.test(value)) {
      console.warn('dt: skipping javascript: token value', name);
      continue;
    }
    map[name] = value;
  }
  return map;
}

// Cache-first; on miss fetch + parse + cache. Returns { resolvedVersion, map, tokenCss }
// on success, { error } on any failure (never caches or returns a partial map).
async function getStableTokens({ version = 'latest', brand, mode } = {}) {
  if (!brand || !mode) return { error: 'missing brand/mode' };
  const key = cacheKey(version, brand, mode);
  const cached = (await chrome.storage.local.get(key))[key];
  if (cached && cached.map && cached.tokenCss) return cached;

  try {
    const res = await fetch(tokenUrl(version, brand, mode));
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const brandCss = await res.text();
    // unpkg redirects @latest → @<concrete>; read it back from the final URL.
    const vm = res.url.match(/@dialpad\/dialtone@([^/]+)\//);
    const resolvedVersion = vm ? vm[1] : version;

    // Base tokens (palette primitives) — best-effort: brand css alone still
    // works for tokens whose values are literals.
    let baseCss = '';
    try {
      const baseRes = await fetch(baseTokenUrl(resolvedVersion, mode));
      if (baseRes.ok) baseCss = await baseRes.text();
      else console.warn('dt: base tokens unavailable', baseRes.status);
    } catch (e) {
      console.warn('dt: base tokens fetch failed', e);
    }

    // Base first, brand second — brand values win on name collision.
    const map = { ...parseTokenCss(baseCss), ...parseTokenCss(brandCss) };
    if (!Object.keys(map).length) return { error: 'no tokens parsed' };
    const tokenCss = [baseCss, brandCss].filter(Boolean).join('\n');
    const value = { resolvedVersion, map, tokenCss };
    await chrome.storage.local.set({ [key]: value });
    return value;
  } catch (e) {
    return { error: String((e && e.message) || e) };
  }
}

async function refreshTokens({ version = 'latest', brand, mode } = {}) {
  await chrome.storage.local.remove(cacheKey(version, brand, mode));
  return getStableTokens({ version, brand, mode });
}

// Cache-first fetch of the theme-agnostic framework CSS (dialtone.css).
// Returns { resolvedVersion, frameworkCss } or { error }.
async function getStableFrameworkCss({ version = 'latest' } = {}) {
  const key = cacheKeyFw(version);
  const cached = (await chrome.storage.local.get(key))[key];
  if (cached && cached.frameworkCss) return cached;

  try {
    const res = await fetch(frameworkCssUrl(version));
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const frameworkCss = await res.text();
    if (!frameworkCss.trim()) return { error: 'empty framework CSS' };
    const vm = res.url.match(/@dialpad\/dialtone@([^/]+)\//);
    const resolvedVersion = vm ? vm[1] : version;
    const value = { resolvedVersion, frameworkCss };
    await chrome.storage.local.set({ [key]: value });
    return value;
  } catch (e) {
    return { error: String((e && e.message) || e) };
  }
}

// --- Per-tab toggle state ---------------------------------------------------
// Toggles (inspect/override/swap) are scoped to a single tab, stored in
// storage.session keyed by tab id. Config (dtVersion, dtThemeOverride) stays
// global in storage.local. Session storage resets on browser/extension restart.

const tabStateKey = (tabId) => `tabState:${tabId}`;

async function getTabState(tabId) {
  if (tabId == null) return {};
  const key = tabStateKey(tabId);
  return (await chrome.storage.session.get(key))[key] || {};
}

async function setTabState(tabId, patch) {
  if (tabId == null) return {};
  const key = tabStateKey(tabId);
  const state = { ...(await getTabState(tabId)), ...patch };
  await chrome.storage.session.set({ [key]: state });
  return state;
}

chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.session.remove(tabStateKey(tabId));
});

// Re-inject content scripts into open tabs on install/update so toggling works
// without a manual page reload after every extension reload. Orphaned old
// scripts self-disable via the orphan check in content.js.
chrome.runtime.onInstalled.addListener(async () => {
  const scripts = chrome.runtime.getManifest().content_scripts || [];
  const tabs = await chrome.tabs.query({ url: ['http://*/*', 'https://*/*'] });
  for (const cs of scripts) {
    for (const tab of tabs) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id, allFrames: !!cs.all_frames },
          files: cs.js,
        })
        .catch(() => { /* chrome:// pages, discarded tabs, etc. */ });
    }
  }
});

// ⛔ Must return true synchronously so Chrome keeps the response channel open
// until the async fetch resolves — the #1 cause of silent MV3 message hangs.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'getStableTokens') {
    getStableTokens(msg).then(sendResponse);
    return true;
  }
  if (msg?.type === 'refreshTokens') {
    refreshTokens(msg).then(sendResponse);
    return true;
  }
  if (msg?.type === 'getStableFrameworkCss') {
    getStableFrameworkCss(msg).then(sendResponse);
    return true;
  }
  if (msg?.type === 'getTabState') {
    getTabState(msg.tabId ?? sender.tab?.id).then(sendResponse);
    return true;
  }
  if (msg?.type === 'setTabState') {
    setTabState(msg.tabId ?? sender.tab?.id, msg.patch || {}).then(sendResponse);
    return true;
  }
  return false;
});
