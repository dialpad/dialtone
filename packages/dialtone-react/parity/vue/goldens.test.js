// Vue side of DOM parity: renders every case of each unit in PARITY_UNITS and writes
// $PARITY_OUT/<unit>.json, which the React side compares against. Run through gate.mjs.
// Vitest's globals, not imports: this file runs under dialtone-vue's Vitest, which may be a different copy.
/* global vi, describe, it, expect, afterAll, document */
import fs from 'node:fs';
import path from 'node:path';
import { h } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import * as dialtone from '@/index.js';
import { capture, cleanHtml, ROOT_ID } from '../normalize.mjs';
import { casesFrom, keepIdsOf, pascal } from '../cases.mjs';
import { EXTRA_CASES } from '../extra-cases.mjs';
import { FAKE_TIMERS, settle } from '../settle.mjs';
import registry from '../../../combinator/src/variants/variants.js?raw';

const units = (process.env.PARITY_UNITS ?? '').split(',').filter(Boolean);
const outDir = process.env.PARITY_OUT;

// Slot strings are Vue templates (e.g. '<dt-button>Hover me</dt-button>'), so every Dialtone component is registered.
const components = Object.fromEntries(Object.entries(dialtone)
  .filter(([name, value]) => /^Dt[A-Z]/.test(name) && value && typeof value === 'object' && (value.render || value.setup)));

const variantFiles = import.meta.glob('../../../combinator/src/variants/variants_*.js', { import: 'default' });

async function variantsOf (name) {
  const file = registry.match(new RegExp(`import Dt${name} from '\\./(variants_\\w+\\.js)'`))?.[1];
  return file ? variantFiles[`../../../combinator/src/variants/${file}`]() : null;
}

async function renderCase (Component, c) {
  vi.useFakeTimers(FAKE_TIMERS);
  try {
    const root = document.createElement('div');
    root.id = ROOT_ID;
    document.body.appendChild(root);
    const wrapper = mount(Component, {
      props: c.props, attrs: c.attrs, slots: c.slots, attachTo: root, global: { components },
    });
    await settle(ms => vi.advanceTimersByTimeAsync(ms));
    await flushPromises();
    const html = capture(document.body, { keepIds: keepIdsOf(c) });
    wrapper.unmount();
    return html;
  } finally {
    vi.useRealTimers();
    document.body.innerHTML = '';
  }
}

// Each slot string rendered on its own, as static HTML for the React side to parse.
function renderSlot (template) {
  const Host = { render () { return h('div', this.$slots.default?.()); } };
  const wrapper = mount(Host, { slots: { default: template }, global: { components } });
  const html = cleanHtml(wrapper.element);
  wrapper.unmount();
  return html;
}

for (const unit of units) {
  const name = pascal(unit);
  const Component = dialtone[`Dt${name}`];
  const variants = await variantsOf(name);
  const cases = variants ? [...casesFrom(variants), ...(EXTRA_CASES[unit] ?? [])] : [];
  const result = { unit, vueName: name, cases: [] };

  describe(unit, () => {
    afterAll(() => {
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, `${unit}.json`), JSON.stringify(result, null, 2));
    });

    it('has a Vue component and Combinator presets', () => {
      expect(Component, `no Dt${name} export in dialtone-vue`).toBeTruthy();
      expect(cases.length, `no Combinator variants for Dt${name}`).toBeGreaterThan(0);
    });

    for (const c of cases) {
      it(c.name, async () => {
        const html = await renderCase(Component, c);
        const slotHtml = Object.fromEntries(Object.entries(c.slots)
          .map(([slot, tpl]) => [slot, renderSlot(String(tpl))]));
        result.cases.push({ ...c, html, slotHtml });
        expect(html.length).toBeGreaterThan(0);
      });
    }
  });
}
