// React side of DOM parity: renders every case from the Vue goldens ($PARITY_GOLDENS/<unit>.json) through the
// unit's parity map and compares canonical HTML. One generic test for every unit; run through gate.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { StrictMode, createElement, type ReactElement } from 'react';
import { act, render } from '@testing-library/react';
import parse from 'html-react-parser';
import { capture, pretty, ROOT_ID, SLOT_ID } from '../normalize.mjs';
import { bindScope, jsonSafe, keepIdsOf, scopeKey } from '../cases.mjs';
import { FAKE_TIMERS, FIXED_RANDOM, settle } from '../settle.mjs';
import type { Deviations, ParityMap, SlotContent } from '../types';

// The Vue goldens render <transition> as Vue Test Utils' default stub: the child as it is, no classes, no hooks. So
// DtTransition is stubbed the same way here (normalize.mjs unwraps Vue's <transition-stub> element).
vi.mock('../../common/transition/DtTransition', () => import('./transition-stub'));

interface Case {
  name: string;
  props: Record<string, unknown>;
  slots: Record<string, unknown>;
  attrs: Record<string, unknown>;
  html: string;
  /** Slots Vue rendered with no scope: their HTML. */
  slotHtml: Record<string, string>;
  /** Slots Vue rendered with a scope: the scope and the HTML for each distinct one. */
  slotRenders?: Record<string, { scope: unknown; html: string }[]>;
  /** Slots whose HTML has the component's injected context applied (counted by the gate). */
  slotContext?: string[];
  /** The Vue component called Math.random. */
  random?: true;
}

// Slot HTML is serialized with each element's real name, so SVG's camelCase ones (clipPath, linearGradient) arrive
// intact; htmlparser2 would lowercase them, and React would then create a <clippath> that no SVG knows.
const PARSE_OPTIONS = { htmlparser2: { lowerCaseTags: false } };
const parseSlot = (html: string) => parse(html, PARSE_OPTIONS);

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
  const contents: [string, SlotContent][] = [
    ...Object.entries(c.slotHtml).map(([slot, html]): [string, SlotContent] => [slot, parseSlot(html)]),
    ...Object.entries(c.slotRenders ?? {}).map(([slot, renders]): [string, SlotContent] => [slot, renderProp(renders)]),
  ];
  for (const [slot, content] of contents) {
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

// A slot Vue rendered with a scope becomes a render prop that returns the HTML Vue rendered for the same scope,
// so the scope the port passes is compared, not just what it renders. Where Vue's scope carried a generated id
// (inputProps' aria-controls), the golden has a slot-id name: it matches any id the port passes there, and the
// HTML gets the port's id, so links between the slot and the component resolve as they do in the port. A scope
// Vue never rendered the slot with renders a marker element, so it fails as a DOM diff that names the scope rather
// than silently rendering nothing.
function renderProp (renders: { scope: unknown; html: string }[]) {
  return (scope: unknown) => {
    const actual = jsonSafe(scope);
    for (const r of renders) {
      const bound = bindScope(actual, r.scope, SLOT_ID);
      if (!bound) continue;
      let html = r.html;
      // A name is slot-id-<n>: no regex syntax, and never part of a longer token.
      for (const [name, id] of bound) html = html.replace(new RegExp(`(?<![\\w-])${name}(?![\\w-])`, 'g'), () => id);
      return parseSlot(html);
    }
    return createElement('parity-unmatched-scope', { 'data-scope': scopeKey(scope) });
  };
}

async function renderElement (element: ReactElement, keepIds?: ReturnType<typeof keepIdsOf>) {
  vi.useFakeTimers(FAKE_TIMERS as Parameters<typeof vi.useFakeTimers>[0]);
  const random = vi.spyOn(Math, 'random').mockReturnValue(FIXED_RANDOM);
  try {
    const root = document.createElement('div');
    root.id = ROOT_ID;
    document.body.appendChild(root);
    // StrictMode, so effects that create library instances (tippy) must survive being run twice.
    const { unmount } = render(createElement(StrictMode, null, element), { container: root });
    await act(async () => { await settle(ms => vi.advanceTimersByTimeAsync(ms)); });
    const html = capture(document.body, { keepIds });
    unmount();
    return { html, picked: random.mock.calls.length > 0 };
  } finally {
    random.mockRestore();
    vi.useRealTimers();
    document.body.innerHTML = '';
  }
}

const renderCase = (map: ParityMap, c: Case) =>
  renderElement(createElement(map.component, toProps(c, map)), keepIdsOf(c));

// React's first `await act(…)` calls Math.random once, lazily, to set up its task queue (enqueueTask), so the first
// case of a run counted that call as the port's. Warm up with an element that never picks, then check that a second
// render of it picks nothing: otherwise the check below would pass for a port that never picks.
beforeAll(async () => {
  await renderElement(createElement('span'));
  const { picked } = await renderElement(createElement('span'));
  expect(picked, 'the harness calls Math.random by itself, so it can\'t tell whether a port does').toBe(false);
});

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
        const { html, picked } = await renderCase(map, c);
        expect(pretty(html)).toBe(pretty(deviation?.react ?? c.html));
        // Math.random returns a constant on both sides, so a port that hardcodes what Vue picks with it would
        // otherwise match.
        if (c.random && !deviation?.noRandom) {
          expect(picked, 'the Vue component calls Math.random in this case, but the React render never did: pick the same way Vue does rather than hardcoding the result').toBe(true);
        }
      });
    }
  });
}
