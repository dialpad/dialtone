// Popup controller. The inspect, stable-token override, and Avatar swap toggles write to
// storage; the content script reacts via chrome.storage.onChanged (no reload).
// The status panel shows the active tab's detected theme and the resolved
// stable version (from the service worker). Version pin + manual theme override
// + refresh are written to storage and re-resolved here.

const $ = (id) => document.getElementById(id);
const inspectBtn = $('inspect');
const overrideBtn = $('override');
const avatarSwapBtn = $('avatarSwap');
const replaceBtn = $('replace');
const themeEl = $('theme');
const versionEl = $('version');
const changesEl = $('changes');
const scopeEl = $('scope');
const avatarStatusEl = $('avatarStatus');
const versionInput = $('versionInput');
const refreshBtn = $('refresh');
const themeSelect = $('themeSelect');

let state = {
  dtInspect: false,
  dtOverride: false,
  dtAvatarSwap: false,
  dtReplace: false,
  dtVersion: 'latest',
  dtThemeOverride: null,
};

function friendlyTabError(error) {
  if (/Receiving end does not exist/i.test(error || '')) return 'reload target tab';
  if (/Cannot access|chrome:|extension/i.test(error || '')) return 'open target tab';
  return error || 'no tab response';
}

function renderToggles() {
  inspectBtn.textContent = state.dtInspect ? 'Disable inspector' : 'Enable inspector';
  inspectBtn.classList.toggle('on', state.dtInspect);
  overrideBtn.textContent = state.dtOverride ? 'Remove stable tokens' : 'Apply stable tokens';
  overrideBtn.classList.toggle('on', state.dtOverride);
  avatarSwapBtn.textContent = state.dtAvatarSwap
    ? 'Remove stable components'
    : 'Apply stable components';
  avatarSwapBtn.classList.toggle('on', state.dtAvatarSwap);
  replaceBtn.textContent = state.dtReplace
    ? 'Restore next CSS'
    : 'Replace next CSS entirely';
  replaceBtn.classList.toggle('on', state.dtReplace);
  versionInput.value = state.dtVersion === 'latest' ? '' : state.dtVersion;
  themeSelect.value = state.dtThemeOverride
    ? `${state.dtThemeOverride.brand}-${state.dtThemeOverride.mode}`
    : '';
}

function renderOverrideReport(report, fallback = null) {
  if (!report) {
    changesEl.textContent = fallback || (state.dtOverride ? 'checking…' : '—');
    scopeEl.textContent = '—';
    scopeEl.title = '';
    return;
  }
  const token = report.changes?.tokenDiffs || { color: 0, nonColor: 0 };
  const prop = report.changes?.propertyDiffs || { color: 0, nonColor: 0 };
  const nonColor = token.nonColor + prop.nonColor;
  const color = token.color + prop.color;
  const total = nonColor + color;
  const declarations = report.declarations || { total: 0, color: 0, nonColor: 0 };
  const discovery = report.discovery || { exactNames: 0, prefixes: 0, sourceCounts: null };
  changesEl.textContent = `${total} computed (${nonColor} non-color, ${color} color)`;
  scopeEl.textContent =
    `${declarations.total} vars from ${discovery.exactNames} tokens + ${discovery.prefixes} prefixes`;
  const details = {
    sources: report.sources,
    discovery,
    declarations,
    samples: report.samples || report.changes?.samples || [],
  };
  changesEl.title = JSON.stringify(details, null, 2);
  scopeEl.title = changesEl.title;
}

function renderAvatarReport(report, fallback = null) {
  if (!report) {
    avatarStatusEl.textContent = fallback || (state.dtAvatarSwap ? 'checking…' : '—');
    avatarStatusEl.title = '';
    return;
  }
  avatarStatusEl.textContent =
    `${report.avatars || 0} avatars, ${report.presence || 0} presence, ${report.remapped || 0} remaps, ${report.rules || 0} rules`;
  avatarStatusEl.title = JSON.stringify(report, null, 2);
}

function sendSW(msg) {
  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(msg, (r) => resolve(chrome.runtime.lastError ? null : r));
    } catch {
      resolve(null);
    }
  });
}

function activeTab() {
  return new Promise((resolve) =>
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => resolve(tabs[0])),
  );
}

// Queries (getDetectedTheme, get*Report) go to the top frame only — they want
// the main page's answer. Toggles pass { allFrames: true } so the change applies
// in every injected frame (the content script runs with all_frames), e.g. a
// Storybook preview iframe where the actual components live.
function sendTab(tabId, msg, { allFrames = false } = {}) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve({ ok: false, error: 'tab response timed out' }), 10000);
    const options = allFrames ? {} : { frameId: 0 };
    try {
      chrome.tabs.sendMessage(tabId, msg, options, (r) => {
        clearTimeout(timeout);
        resolve(chrome.runtime.lastError
          ? { ok: false, error: friendlyTabError(chrome.runtime.lastError.message) }
          : r);
      });
    } catch {
      clearTimeout(timeout);
      resolve({ ok: false, error: 'tab message failed' });
    }
  });
}

// Resolve the active theme (manual override wins; else ask the tab), then ask
// the service worker for the matching stable version. `force` re-fetches.
async function refreshStatus(force) {
  let theme = state.dtThemeOverride;
  if (!theme) {
    const tab = await activeTab();
    if (tab && tab.id != null) {
      const r = await sendTab(tab.id, { type: 'getDetectedTheme' });
      if (r?.error) {
        themeEl.textContent = r.error;
        versionEl.textContent = '—';
        if (state.dtOverride) renderOverrideReport(null, r.error);
        return;
      }
      theme = r?.theme || null;
    }
  }
  if (!theme) {
    themeEl.textContent = 'not detected — pick one below';
    versionEl.textContent = '—';
    return;
  }
  themeEl.textContent = `${theme.brand} / ${theme.mode}${state.dtThemeOverride ? ' (manual)' : ''}`;
  versionEl.textContent = 'fetching…';
  const res = await sendSW({
    type: force ? 'refreshTokens' : 'getStableTokens',
    version: state.dtVersion,
    brand: theme.brand,
    mode: theme.mode,
  });
  versionEl.textContent =
    !res || res.error ? `unavailable (${(res && res.error) || 'no response'})` : res.resolvedVersion;
}

// Config is global; toggles are per-tab (asked from the service worker).
chrome.storage.local.get(['dtVersion', 'dtThemeOverride'], async (s) => {
  state.dtVersion = s.dtVersion || 'latest';
  state.dtThemeOverride = s.dtThemeOverride || null;

  const tab = await activeTab();
  const tabState = tab?.id != null ? await sendSW({ type: 'getTabState', tabId: tab.id }) : null;
  state.dtInspect = !!tabState?.dtInspect;
  state.dtOverride = !!tabState?.dtOverride;
  state.dtAvatarSwap = !!tabState?.dtAvatarSwap;
  state.dtReplace = !!tabState?.dtReplace;

  renderToggles();
  refreshStatus();
  if (state.dtOverride && tab?.id != null) {
    sendTab(tab.id, { type: 'getOverrideReport' }).then((r) =>
      renderOverrideReport(r?.report, r?.error || 'no report'),
    );
  }
  if (state.dtAvatarSwap && tab?.id != null) {
    sendTab(tab.id, { type: 'getAvatarSwapReport' }).then((r) =>
      renderAvatarReport(r?.report, r?.error || 'no Avatar report'),
    );
  }
});

inspectBtn.addEventListener('click', async () => {
  const next = !state.dtInspect;
  const tab = await activeTab();
  if (tab?.id == null) {
    renderOverrideReport(null, 'open target tab');
    return;
  }
  const response = await sendTab(tab.id, { type: 'setInspect', value: next }, { allFrames: true });
  if (response?.error) {
    renderOverrideReport(null, response.error);
    return;
  }
  state.dtInspect = next;
  sendSW({ type: 'setTabState', tabId: tab.id, patch: { dtInspect: next } });
  renderToggles();
});

overrideBtn.addEventListener('click', async () => {
  const next = !state.dtOverride;
  renderOverrideReport(null, next ? 'checking…' : '—');
  const tab = await activeTab();
  if (tab?.id == null) {
    renderOverrideReport(null, 'open target tab');
    return;
  }
  const response = await sendTab(tab.id, { type: 'setOverride', value: next }, { allFrames: true });
  if (response?.error || response?.ok === false) {
    renderOverrideReport(null, response?.error || 'not applied');
    return;
  }
  state.dtOverride = next;
  sendSW({ type: 'setTabState', tabId: tab.id, patch: { dtOverride: next } });
  renderToggles();
  renderOverrideReport(state.dtOverride ? response?.report : null);
});

avatarSwapBtn.addEventListener('click', async () => {
  const next = !state.dtAvatarSwap;
  renderAvatarReport(null, next ? 'checking…' : '—');
  const tab = await activeTab();
  if (tab?.id == null) {
    renderAvatarReport(null, 'open target tab');
    return;
  }
  const response = await sendTab(tab.id, { type: 'setAvatarSwap', value: next }, { allFrames: true });
  if (response?.error || response?.ok === false) {
    renderAvatarReport(null, response?.error || 'not applied');
    return;
  }
  state.dtAvatarSwap = next;
  sendSW({ type: 'setTabState', tabId: tab.id, patch: { dtAvatarSwap: next } });
  renderToggles();
  renderAvatarReport(state.dtAvatarSwap ? response?.report : null);
});

replaceBtn.addEventListener('click', async () => {
  const next = !state.dtReplace;
  const tab = await activeTab();
  if (tab?.id == null) {
    renderAvatarReport(null, 'open target tab');
    return;
  }
  const response = await sendTab(tab.id, { type: 'setReplace', value: next }, { allFrames: true });
  if (response?.error || response?.ok === false) {
    renderAvatarReport(null, response?.error || 'not applied');
    return;
  }
  state.dtReplace = next;
  sendSW({ type: 'setTabState', tabId: tab.id, patch: { dtReplace: next } });
  renderToggles();
  if (response?.report) {
    avatarStatusEl.textContent =
      `replaced ${response.report.replaced} sheet(s), ${response.report.skippedMixed} mixed skipped`;
    avatarStatusEl.title = JSON.stringify(response.report, null, 2);
  }
});

versionInput.addEventListener('change', () => {
  state.dtVersion = versionInput.value.trim() || 'latest';
  chrome.storage.local.set({ dtVersion: state.dtVersion });
  refreshStatus();
});

refreshBtn.addEventListener('click', () => refreshStatus(true));

themeSelect.addEventListener('change', () => {
  const val = themeSelect.value;
  // Split on the LAST hyphen so multi-hyphen brand names (e.g. high-desert) work.
  const i = val.lastIndexOf('-');
  state.dtThemeOverride = val ? { brand: val.slice(0, i), mode: val.slice(i + 1) } : null;
  chrome.storage.local.set({ dtThemeOverride: state.dtThemeOverride });
  refreshStatus();
});
