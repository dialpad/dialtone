// React side of DOM parity: renders every case from the Vue goldens ($PARITY_GOLDENS/<unit>.json) through the
// unit's parity map and compares canonical HTML. One generic test for every unit; run through gate.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { StrictMode, createElement } from 'react';
import { act, render } from '@testing-library/react';
import parse from 'html-react-parser';
import { capture, pretty, ROOT_ID } from '../normalize.mjs';
import { keepIdsOf } from '../cases.mjs';
import { FAKE_TIMERS, settle } from '../settle.mjs';
import type { Deviations, ParityMap } from '../types';

interface Case {
  name: string;
  props: Record<string, unknown>;
  slots: Record<string, unknown>;
  attrs: Record<string, unknown>;
  html: string;
  slotHtml: Record<string, string>;
}

const units = (process.env.PARITY_UNITS ?? '').split(',').filter(Boolean);
const goldensDir = process.env.PARITY_GOLDENS ?? '';
const maps = import.meta.glob<{ default: ParityMap }>('../../components/*/*.parity.tsx');
const deviationFiles = import.meta.glob<{ default: Deviations }>('../../components/*/deviations.json');

const camel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
const styleObject = (css: string) => Object.fromEntries(css.split(';').map(d => d.trim()).filter(Boolean)
  .map(d => { const i = d.indexOf(':'); return [camel(d.slice(0, i).trim()), d.slice(i + 1).trim()]; }));

// A Vue case → React props, by the conventions: same names, class → className, style → object,
// default slot → children, named slots → props of the same name, unless the parity map says otherwise.
function toProps (c: Case, map: ParityMap) {
  const props: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(c.props)) {
    props[map.props?.[name] ?? name] = map.values?.[name] ? map.values[name](value) : value;
  }
  for (const [name, value] of Object.entries(c.attrs)) {
    if (name === 'class') props.className = value;
    else if (name === 'style') props.style = styleObject(String(value));
    else props[map.props?.[name] ?? name] = value;
  }
  for (const [slot, html] of Object.entries(c.slotHtml)) {
    const content = parse(html);
    const target = map.slots?.[slot];
    if (typeof target === 'function') {
      const [prop, value] = target(content);
      props[prop] = value;
    } else {
      props[target ?? (slot === 'default' ? 'children' : slot)] = content;
    }
  }
  return props;
}

async function renderCase (map: ParityMap, c: Case) {
  vi.useFakeTimers(FAKE_TIMERS as Parameters<typeof vi.useFakeTimers>[0]);
  try {
    const root = document.createElement('div');
    root.id = ROOT_ID;
    document.body.appendChild(root);
    // StrictMode, so effects that create library instances (tippy) must survive being run twice.
    const { unmount } = render(createElement(StrictMode, null, createElement(map.component, toProps(c, map))), { container: root });
    await act(async () => { await settle(ms => vi.advanceTimersByTimeAsync(ms)); });
    const html = capture(document.body, { keepIds: keepIdsOf(c) });
    unmount();
    return html;
  } finally {
    vi.useRealTimers();
    document.body.innerHTML = '';
  }
}

for (const unit of units) {
  const golden = JSON.parse(fs.readFileSync(path.join(goldensDir, `${unit}.json`), 'utf8')) as { vueName: string; cases: Case[] };
  const name = golden.vueName;
  const loadMap = maps[`../../components/${name}/${name}.parity.tsx`];
  const deviations: Deviations = (await deviationFiles[`../../components/${name}/deviations.json`]?.())?.default ?? {};

  describe(unit, () => {
    it('has a parity map', () => {
      expect(loadMap, `components/${name}/${name}.parity.tsx is missing`).toBeTruthy();
    });

    it('has no deviations for cases that no longer exist', () => {
      const unknown = Object.keys(deviations).filter(k => !golden.cases.some(c => c.name === k));
      expect(unknown).toEqual([]);
    });

    for (const c of golden.cases) {
      it(c.name, async () => {
        const deviation = deviations[c.name];
        expect(deviation === undefined || deviation.reason.trim().length > 0, 'every deviation needs a reason').toBe(true);
        if (deviation?.skip) return;
        const map = (await loadMap()).default;
        const html = await renderCase(map, c);
        expect(pretty(html)).toBe(pretty(deviation?.react ?? c.html));
      });
    }
  });
}
