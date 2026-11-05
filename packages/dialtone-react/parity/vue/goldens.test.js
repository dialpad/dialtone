// Vue side of DOM parity: renders every case of each unit in PARITY_UNITS and writes
// $PARITY_OUT/<unit>.json, which the React side compares against. Run through gate.mjs.
// Vitest's globals, not imports: this file runs under dialtone-vue's Vitest, which may be a different copy.
/* global vi, describe, it, expect, afterAll, document */
import fs from 'node:fs';
import path from 'node:path';
import { getCurrentInstance, h, provide } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import * as dialtone from '@/index.js';
import * as icons from '@dialpad/dialtone-icons/vue';
import { capture, capturedIdTokens, cleanHtml, idTokens, isGeneratedIn, maskedHtml, ROOT_ID, slotIdNamer } from '../normalize.mjs';
import { canonicalScope, casesFrom, jsonSafe, keepIdsOf, pascal, scopeKey } from '../cases.mjs';
import { EXTRA_CASES } from '../extra-cases.mjs';
import { FAKE_TIMERS, FIXED_RANDOM, settle } from '../settle.mjs';
import registry from '../../../combinator/src/variants/variants.js?raw';

const units = (process.env.PARITY_UNITS ?? '').split(',').filter(Boolean);
const outDir = process.env.PARITY_OUT;

// Slot strings are Vue templates (e.g. '<dt-button>Hover me</dt-button>'), so every Dialtone component is
// registered, and every DtIcon* as Combinator registers them; otherwise <dt-icon-*> stays an unknown element.
const isComponent = value => value && typeof value === 'object' && (value.render || value.setup);
const components = Object.fromEntries([
  ...Object.entries(dialtone).filter(([name, value]) => /^Dt[A-Z]/.test(name) && isComponent(value)),
  ...Object.entries(icons).filter(([name, value]) => name.startsWith('DtIcon') && isComponent(value)),
]);

const variantFiles = import.meta.glob('../../../combinator/src/variants/variants_*.js', { import: 'default' });

async function variantsOf (name) {
  const file = registry.match(new RegExp(`import Dt${name} from '\\./(variants_\\w+\\.js)'`))?.[1];
  return file ? variantFiles[`../../../combinator/src/variants/${file}`]() : null;
}

// Slot content can't be rendered faithfully on its own: it needs the scope the component passes (iconSize,
// item, inputProps) and the context the component provides (tab-group's groupContext). So the component is
// mounted through a wrapper that records both on every slot call, plus the provides the component didn't add
// (the app's), to tell its context apart. VTU merges attrs and props into one set of vnode props, so passing
// both as the wrapper's attrs hands the component exactly what mount() did.
// It also notes the vnodes each slot returned, so a Math.random call can be traced to slot content (an avatar
// in a slot), which the React side receives as static HTML and so never re-runs.
function recordingWrapper (Component, calls, slotVNodes) {
  return {
    inheritAttrs: false,
    render () {
      const base = getCurrentInstance()?.provides;
      const slots = Object.fromEntries(Object.entries(this.$slots).map(([name, slot]) => {
        const recorder = (...args) => {
          calls.push({ name, scope: withoutBranchKey(args[0]), provides: getCurrentInstance()?.provides, base });
          const out = slot(...args);
          tagVNodes(out, slotVNodes);
          return out;
        };
        // Vue would wrap a plain slot function in withCtx(), which makes this wrapper the current instance
        // while it runs. Marked as already normalized, it runs as the component that renders the slot.
        recorder._n = true;
        return [name, recorder];
      }));
      return h(Component, this.$attrs, slots);
    },
  };
}

// Vue's compiler passes a `key` to a slot inside v-if or v-for (renderSlot($slots, 'icon', { key: 0 })) for its own
// diffing. It isn't scope the component means to pass, and a React port has no equivalent, so it's dropped.
function withoutBranchKey (scope) {
  if (!scope || typeof scope !== 'object' || !Object.hasOwn(scope, 'key')) return scope;
  return Object.fromEntries(Reflect.ownKeys(scope).filter(k => k !== 'key').map(k => [k, scope[k]]));
}

function tagVNodes (vnodes, into) {
  for (const vnode of [vnodes].flat(Infinity)) {
    if (!vnode || typeof vnode !== 'object' || into.has(vnode)) continue;
    into.add(vnode);
    if (Array.isArray(vnode.children)) tagVNodes(vnode.children, into);
  }
}

// Whether the component instance running now was created by slot content, or is a descendant of one that was.
function inSlotContent (slotVNodes) {
  for (let instance = getCurrentInstance(); instance; instance = instance.parent) {
    if (slotVNodes.has(instance.vnode)) return true;
  }
  return false;
}

// Mounts the case, settles, hands the live document to `inspect`, then unmounts.
async function renderCase (Component, c, calls, inspect, slotVNodes = new WeakSet()) {
  vi.useFakeTimers(FAKE_TIMERS);
  try {
    const root = document.createElement('div');
    root.id = ROOT_ID;
    document.body.appendChild(root);
    const wrapper = mount(recordingWrapper(Component, calls, slotVNodes), {
      attrs: { ...c.attrs, ...c.props }, slots: c.slots, attachTo: root, global: { components },
    });
    await settle(ms => vi.advanceTimersByTimeAsync(ms));
    await flushPromises();
    inspect(document.body);
    wrapper.unmount();
  } finally {
    vi.useRealTimers();
    document.body.innerHTML = '';
  }
}

// Everything an instance can inject: provides inherit through the prototype chain, and keys can be symbols.
function allProvides (provides) {
  const out = new Map();
  for (let p = provides; p; p = Object.getPrototypeOf(p)) {
    for (const key of Reflect.ownKeys(p)) if (!out.has(key)) out.set(key, p[key]);
  }
  return out;
}

// What the component (or a component between it and the slot) provided, as opposed to the app.
function componentContext ({ provides, base }) {
  const app = allProvides(base);
  return new Map([...allProvides(provides)].filter(([key, value]) => !app.has(key) || app.get(key) !== value));
}

// Mounts one slot on its own with `scope`, inside a host that provides `provides`, and hands its host element to
// `inspect` before unmounting.
function mountSlot (template, scope, provides, inspect) {
  const Host = {
    setup () { for (const [key, value] of provides) provide(key, value); },
    render () { return h('div', this.$slots.default?.(scope)); },
  };
  const wrapper = mount(Host, { slots: { default: template }, global: { components } });
  try {
    return inspect(wrapper.element);
  } finally {
    wrapper.unmount();
  }
}

// Silences Vue's "injection not found" warnings while a slot renders without its context.
function quietly (fn) {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try { return fn(); } catch { return null; } finally { warn.mockRestore(); }
}

const difference = (b, a) => { const seen = new Set(a); return new Set(b.filter(t => !seen.has(t))); };

// One slot as static HTML for the React side to parse, rendered with the scope and the provided context it had
// in the real render. Rendered twice: an id or reference that differs between the two came from a counter, so
// it's renamed through the case's namer; one that doesn't (written in the template, or derived from it, like
// DtTab's dt-tab-<id>) stays, so links between slots resolve as in Vue's real render. `context` is true when
// the output changes without the component's context: the React side gets it already applied, so whether the
// port provides that context isn't compared, and the gate says so.
function renderSlot (template, call, ids) {
  const all = allProvides(call.provides);
  const first = mountSlot(template, call.scope, all, el => idTokens([el]));
  let masked = '';
  const html = mountSlot(template, call.scope, all, el => {
    masked = maskedHtml(el);
    const unstable = new Set([...ids.unstable, ...difference(idTokens([el]), first)]);
    return cleanHtml(el, { ...ids, unstable });
  });
  const own = componentContext(call);
  const app = new Map([...all].filter(([key]) => !own.has(key)));
  const context = own.size > 0 && quietly(() => mountSlot(template, call.scope, app, maskedHtml)) !== masked;
  return { html, context };
}

// The distinct scopes each slot was rendered with. Checks such as hasSlotContent() call a slot with an empty
// scope only to see whether it renders anything; those calls are dropped when the slot also had real ones.
// Emptiness is judged on the raw scope, since a scope of only functions serializes to {} but is real.
const hasKeys = scope => scope != null && Reflect.ownKeys(scope).length > 0;
function scopesBySlot (calls) {
  const bySlot = new Map();
  for (const call of calls) bySlot.set(call.name, [...(bySlot.get(call.name) ?? []), call]);
  return new Map([...bySlot].map(([name, list]) => {
    const real = list.some(call => hasKeys(call.scope)) ? list.filter(call => hasKeys(call.scope)) : list;
    const distinct = new Map();
    for (const call of real) if (!distinct.has(scopeKey(call.scope))) distinct.set(scopeKey(call.scope), call);
    return [name, [...distinct.values()]];
  }));
}

// Every string token in the scopes of a run's slot calls: compared across two runs to find the generated ones.
const scopeTokens = calls => calls
  .flatMap(call => JSON.stringify(jsonSafe(call.scope) ?? null).match(/[^\s"{}[\],:]+/g) ?? []);

// slotHtml for a slot rendered with no scope (or none that wasn't empty); slotRenders, one per distinct scope,
// for a slot rendered with one: the React side turns those into render props that check the scope its port
// passes. Every slot and scope render of the case shares one namer, so no two get the same id.
function slotsOf (c, calls, unstable) {
  const scopes = scopesBySlot(calls);
  const ids = { keep: new Set(keepIdsOf(c)), unstable, namer: slotIdNamer() };
  const generated = isGeneratedIn(ids);
  const slotHtml = {};
  const slotRenders = {};
  const slotContext = [];
  for (const [slot, tpl] of Object.entries(c.slots)) {
    // A slot the component never rendered still gets its content, rendered with no scope or context.
    const seen = scopes.get(slot) ?? [{ scope: {}, provides: null, base: null }];
    const renders = seen.map(call => {
      // The scope first, so an id the component passed in it is named before the slot's own ids.
      const scope = hasKeys(call.scope) ? canonicalScope(call.scope, generated, ids.namer) : null;
      return { scope, ...renderSlot(String(tpl), call, ids) };
    });
    if (renders.some(r => r.context)) slotContext.push(slot);
    if (renders.some(r => r.scope)) {
      slotRenders[slot] = renders.map(({ scope, html }) => ({ scope: scope ?? {}, html }));
    } else slotHtml[slot] = renders[0].html;
  }
  return {
    slotHtml,
    ...(Object.keys(slotRenders).length ? { slotRenders } : {}),
    ...(slotContext.length ? { slotContext } : {}),
  };
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
        // Slot renders pick at random too (an avatar in a slot), so the constant holds for the whole case. `picked`
        // counts the real render's calls from outside slot content.
        let counting = false;
        let picked = 0;
        const slotVNodes = new WeakSet();
        const random = vi.spyOn(Math, 'random').mockImplementation(() => {
          if (counting && !inSlotContent(slotVNodes)) picked++;
          return FIXED_RANDOM;
        });
        try {
          // Rendered twice: a dangling reference or scope value that differs between the two came from a counter.
          const firstCalls = [];
          let firstRefs = [];
          await renderCase(Component, c, firstCalls, body => { firstRefs = capturedIdTokens(body); });
          const calls = [];
          let html = '';
          let unstable = new Set();
          counting = true;
          await renderCase(Component, c, calls, body => {
            unstable = new Set([
              ...difference(capturedIdTokens(body), firstRefs),
              ...difference(scopeTokens(calls), scopeTokens(firstCalls)),
            ]);
            html = capture(body, { keepIds: keepIdsOf(c), unstable });
          }, slotVNodes);
          counting = false;
          // Whether the component picked at random: the React side then has to call Math.random too, or it may have
          // hardcoded the result FIXED_RANDOM gives.
          result.cases.push({ ...c, html, ...slotsOf(c, calls, unstable), ...(picked ? { random: true } : {}) });
          expect(html.length).toBeGreaterThan(0);
        } finally {
          random.mockRestore();
        }
      });
    }
  });
}
