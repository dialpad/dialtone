import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BROWSER_THEME_COLOR_FALLBACK,
  normalizeBrowserThemeColor,
  resolveBrowserThemeColor,
  syncBrowserThemeColor,
} from './browserThemeColor.js';

// Minimal stand-ins for the DOM surface this module touches, passed through the
// module's own `document` / `window` options so no real DOM is needed.
const createNode = (tagName) => {
  const node = {
    tagName,
    children: [],
    attributes: {},
    parent: null,
    style: {
      properties: {},
      setProperty (name, value) {
        this.properties[name] = value;
      },
    },
    appendChild (child) {
      child.parent = node;
      node.children.push(child);

      return child;
    },
    removeChild (child) {
      node.children = node.children.filter(existing => existing !== child);
    },
    remove () {
      this.parent?.removeChild(this);
      this.parent = null;
    },
    setAttribute (name, value) {
      this.attributes[name] = value;
    },
    getAttribute (name) {
      return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null;
    },
    // Only selector this module uses is `meta[name="theme-color"]`.
    querySelectorAll () {
      return node.children.filter(
        child => child.tagName === 'meta' && child.attributes.name === 'theme-color',
      );
    },
  };

  return node;
};

const createFakeDocument = () => {
  const doc = createNode('#document');
  doc.head = createNode('head');
  doc.body = createNode('body');
  doc.documentElement = createNode('html');
  doc.createElement = tagName => createNode(tagName);

  return doc;
};

// Reports `backgroundColor` for the probe element regardless of input, standing in
// for the browser resolving `var(--dt-color-surface-secondary)` to a concrete color.
const createFakeWindow = (backgroundColor) => ({
  getComputedStyle: () => ({ backgroundColor }),
});

describe('normalizeBrowserThemeColor', () => {
  it('converts computed rgb to hex', () => {
    assert.equal(normalizeBrowserThemeColor('rgb(249, 249, 249)'), '#f9f9f9');
  });

  it('converts oklch to hex, which browser chrome cannot parse itself', () => {
    assert.equal(normalizeBrowserThemeColor('oklch(0.97 0 0)'), '#f5f5f5');
  });

  it('pads single-digit channels to two hex characters', () => {
    assert.equal(normalizeBrowserThemeColor('rgb(0, 0, 0)'), '#000000');
  });

  it('returns the input unchanged when it cannot be parsed', () => {
    assert.equal(normalizeBrowserThemeColor('not-a-color'), 'not-a-color');
  });
});

describe('resolveBrowserThemeColor', () => {
  it('falls back when there is no document (SSR)', () => {
    const color = resolveBrowserThemeColor({ document: undefined, window: undefined });

    assert.equal(color, BROWSER_THEME_COLOR_FALLBACK);
  });

  it('falls back when getComputedStyle is unavailable', () => {
    const color = resolveBrowserThemeColor({
      document: createFakeDocument(),
      window: {},
    });

    assert.equal(color, BROWSER_THEME_COLOR_FALLBACK);
  });

  it('falls back when the resolved color is transparent', () => {
    const color = resolveBrowserThemeColor({
      document: createFakeDocument(),
      window: createFakeWindow('rgba(0, 0, 0, 0)'),
    });

    assert.equal(color, BROWSER_THEME_COLOR_FALLBACK);
  });

  it('falls back when the resolved color is empty', () => {
    const color = resolveBrowserThemeColor({
      document: createFakeDocument(),
      window: createFakeWindow('   '),
    });

    assert.equal(color, BROWSER_THEME_COLOR_FALLBACK);
  });

  it('returns the resolved color as hex', () => {
    const color = resolveBrowserThemeColor({
      document: createFakeDocument(),
      window: createFakeWindow('rgb(18, 18, 18)'),
    });

    assert.equal(color, '#121212');
  });

  it('probes with the requested CSS variable', () => {
    const doc = createFakeDocument();
    let probeBackground;
    const win = {
      getComputedStyle: (probe) => {
        probeBackground = probe.style.properties['background-color'];

        return { backgroundColor: 'rgb(1, 2, 3)' };
      },
    };

    resolveBrowserThemeColor({ document: doc, window: win, cssVariableName: '--custom-surface' });

    assert.equal(probeBackground, 'var(--custom-surface)');
  });

  it('removes the probe element even after reading it', () => {
    const doc = createFakeDocument();

    resolveBrowserThemeColor({
      document: doc,
      window: createFakeWindow('rgb(18, 18, 18)'),
    });

    assert.deepEqual(doc.body.children, []);
  });

  it('honours a caller-supplied fallback', () => {
    const color = resolveBrowserThemeColor({
      document: undefined,
      window: undefined,
      fallback: '#abcdef',
    });

    assert.equal(color, '#abcdef');
  });
});

describe('syncBrowserThemeColor', () => {
  it('creates the meta tag when none exists', () => {
    const doc = createFakeDocument();

    syncBrowserThemeColor({ document: doc, window: createFakeWindow('rgb(18, 18, 18)') });

    const metas = doc.head.querySelectorAll();
    assert.equal(metas.length, 1);
    assert.equal(metas[0].getAttribute('content'), '#121212');
  });

  it('reuses the existing meta tag rather than adding another', () => {
    const doc = createFakeDocument();
    const existing = doc.createElement('meta');
    existing.setAttribute('name', 'theme-color');
    existing.setAttribute('content', '#000000');
    doc.head.appendChild(existing);

    syncBrowserThemeColor({ document: doc, window: createFakeWindow('rgb(18, 18, 18)') });

    assert.equal(doc.head.querySelectorAll().length, 1);
    assert.equal(existing.getAttribute('content'), '#121212');
  });

  it('drops duplicate meta tags, keeping the first', () => {
    const doc = createFakeDocument();
    const [first, second] = ['meta', 'meta'].map(() => {
      const meta = doc.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      doc.head.appendChild(meta);

      return meta;
    });

    syncBrowserThemeColor({ document: doc, window: createFakeWindow('rgb(18, 18, 18)') });

    const metas = doc.head.querySelectorAll();
    assert.equal(metas.length, 1);
    assert.equal(metas[0], first);
    assert.equal(second.parent, null);
  });

  it('does nothing when there is no document (SSR)', () => {
    assert.doesNotThrow(() => syncBrowserThemeColor({ document: undefined }));
  });
});
