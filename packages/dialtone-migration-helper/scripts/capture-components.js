// Dialtone component capture — paste this whole file into the DevTools console
// of the running Firespotter app. It captures DOM structure, classes, computed
// styles, component-scoped custom properties, and all matching CSS rules for:
// avatar, presence, badge, button, banner — then downloads a JSON file.
//
// Run once per page that shows component variants (feed, settings, admin, …),
// on BOTH branches (master and next). The diff script compares the files.
(() => {
  'use strict';

  const BRANCH = window.prompt('Branch label?', 'master') || 'unknown';

  const COMPONENTS = {
    avatar: '.d-avatar',
    presence: '.d-presence',
    badge: '.d-badge',
    button: '.d-btn',
    banner: '.d-banner',
  };

  // Regex used both for CSS-rule harvesting and custom-property filtering.
  const COMPONENT_SEL_RE = /\.d-(?:avatar|presence|badge|btn|banner)(?:$|[\s.:,[>+~#)]|--|__)/;
  const COMPONENT_TOKEN_RE = /^--(?:dt-)?(?:avatar|presence|badge|btn|button|banner)/;

  const PROBE_PROPS = [
    'display', 'position', 'width', 'height', 'min-width', 'min-height',
    'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
    'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    'border-radius', 'border-width', 'border-color', 'border-style',
    'background-color', 'color', 'fill', 'font-size', 'font-weight',
    'line-height', 'gap', 'box-shadow', 'opacity', 'cursor',
    'inset-block-start', 'inset-block-end', 'inset-inline-start', 'inset-inline-end',
    'mask-image', 'outline-width', 'outline-color',
  ];

  // Structural fingerprint: tag + sorted d-*/sr-only classes, recursive over
  // element children. App-specific class NAMES are excluded (they vary per
  // instance) but their count is included so shape changes stay visible.
  function shapeOf(el) {
    const dtClasses = [...el.classList]
      .filter((c) => c.startsWith('d-') || c === 'sr-only')
      .sort()
      .join('.');
    const appClassCount = [...el.classList].filter(
      (c) => !c.startsWith('d-') && c !== 'sr-only',
    ).length;
    const kids = [...el.children].map(shapeOf);
    return (
      `${el.tagName.toLowerCase()}[${dtClasses}]` +
      (appClassCount ? `+${appClassCount}app` : '') +
      (kids.length ? `(${kids.join(',')})` : '')
    );
  }

  function probeStyles(el) {
    const cs = getComputedStyle(el);
    const styles = {};
    for (const p of PROBE_PROPS) {
      const v = cs.getPropertyValue(p);
      if (v) styles[p] = v;
    }
    return styles;
  }

  function componentTokens(el) {
    const cs = getComputedStyle(el);
    const tokens = {};
    for (let i = 0; i < cs.length; i++) {
      const name = cs[i];
      if (name.startsWith('--') && COMPONENT_TOKEN_RE.test(name)) {
        const v = cs.getPropertyValue(name).trim();
        if (v) tokens[name] = v;
      }
    }
    return tokens;
  }

  function attrsOf(el) {
    const out = {};
    for (const a of el.attributes) {
      if (a.name === 'class' || a.name === 'style') continue;
      out[a.name] = a.value;
    }
    return out;
  }

  // Full example: outerHTML + per-node styles for the root and every
  // descendant that carries a d-* class.
  function captureExample(root) {
    const nodes = [{ path: '(root)', el: root }];
    for (const el of root.querySelectorAll('*')) {
      if ([...el.classList].some((c) => c.startsWith('d-') || c === 'sr-only')) {
        const cls = [...el.classList].filter((c) => c.startsWith('d-') || c === 'sr-only');
        nodes.push({ path: `${el.tagName.toLowerCase()}.${cls.join('.')}`, el });
      }
    }
    return {
      outerHTML: root.outerHTML,
      allClasses: [...root.classList],
      attrs: attrsOf(root),
      nodes: nodes.map(({ path, el }) => ({
        path,
        classes: [...el.classList],
        attrs: attrsOf(el),
        styles: probeStyles(el),
        tokens: componentTokens(el),
      })),
    };
  }

  function isVisible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  // ── Collect component instances, deduped by structural signature ─────────
  const components = {};
  for (const [name, selector] of Object.entries(COMPONENTS)) {
    const groups = new Map();
    for (const el of document.querySelectorAll(selector)) {
      if (!isVisible(el)) continue;
      const sig = shapeOf(el);
      if (!groups.has(sig)) groups.set(sig, { signature: sig, count: 0, examples: [] });
      const g = groups.get(sig);
      g.count += 1;
      if (g.examples.length < 3) g.examples.push(captureExample(el));
    }
    components[name] = {
      totalVisible: [...groups.values()].reduce((n, g) => n + g.count, 0),
      uniqueSignatures: groups.size,
      groups: [...groups.values()],
    };
  }

  // ── Harvest every CSS rule targeting the 5 components ────────────────────
  // Walks @layer/@media/@supports recursively, records the context stack and
  // the sheet source so app-owned overrides are distinguishable from Dialtone.
  const cssRules = [];
  function walkRules(rules, context, source) {
    for (const rule of rules) {
      if (rule.selectorText && rule.style) {
        if (COMPONENT_SEL_RE.test(rule.selectorText)) {
          cssRules.push({
            selector: rule.selectorText,
            css: rule.style.cssText,
            context: context.join(' > ') || null,
            source,
          });
        }
      }
      if (rule.cssRules) {
        const label =
          rule.name ? `@${rule.constructor.name.replace('CSS', '').replace('Rule', '').toLowerCase()} ${rule.name}` :
          rule.conditionText ? `@media ${rule.conditionText}` :
          rule.constructor.name;
        walkRules(rule.cssRules, [...context, label], source);
      }
    }
  }
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { continue; }
    if (rules) walkRules(rules, [], sheet.href || '(inline/bundled)');
  }
  for (const sheet of document.adoptedStyleSheets || []) {
    try { walkRules(sheet.cssRules, [], '(adopted)'); } catch { /* skip */ }
  }

  // ── Download ──────────────────────────────────────────────────────────────
  const payload = {
    branch: BRANCH,
    url: location.href,
    page: location.pathname,
    capturedAt: new Date().toISOString(),
    theme: {
      brand: document.documentElement.getAttribute('data-dt-brand') || null,
      mode:
        document.documentElement.getAttribute('data-dt-mode') ||
        document.documentElement.getAttribute('data-dt-theme') ||
        null,
    },
    components,
    cssRules,
  };

  const pageSlug = (location.pathname.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root').slice(0, 40);
  const filename = `dt-capture-${BRANCH}-${pageSlug}-${Date.now()}.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);

  console.log(`dt-capture: ${filename}`);
  for (const [name, data] of Object.entries(components)) {
    console.log(`  ${name}: ${data.totalVisible} visible, ${data.uniqueSignatures} unique structures`);
  }
  console.log(`  css rules captured: ${cssRules.length}`);
})();
