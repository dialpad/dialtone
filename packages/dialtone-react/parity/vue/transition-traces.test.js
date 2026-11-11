// Records Vue's <Transition> on parity/transition-scenarios.mjs into parity/transition-traces.json, which
// DtTransition's tests compare against. Re-record after a Vue upgrade:
//   cd packages/dialtone-vue && PARITY_VUE_TESTS=transition-traces.test.js \
//     pnpm exec vitest run --config ../dialtone-react/parity/vue/vitest.config.mjs
/* global vi, it, expect, document */
import fs from 'node:fs';
import path from 'node:path';
import { h, nextTick, Transition, vShow, withDirectives } from 'vue';
import { mount } from '@vue/test-utils';
import { SCENARIOS, run } from '../transition-scenarios.mjs';
import { FAKE_TIMERS } from '../settle.mjs';

const out = {};
for (const [name, scenario] of Object.entries(SCENARIOS)) {
  it(name, async () => {
    vi.useFakeTimers(FAKE_TIMERS);
    let wrapper;
    const adapter = {
      async mount (props, show, style, vIf) {
        const child = { 'data-qa': 'x', class: 'base', style };
        const Host = {
          props: ['show'],
          render () {
            const content = () => (vIf
              ? (this.show ? h('div', child) : null)
              : withDirectives(h('div', child), [[vShow, this.show]]));
            // The template compiler marks a transition around v-show `persisted`; a render function has to.
            return h(Transition, vIf ? props : { ...props, persisted: true }, { default: content });
          },
        };
        wrapper = mount(Host, { props: { show }, attachTo: document.body, global: { stubs: { transition: false } } });
        await nextTick();
      },
      async set (show) { await wrapper.setProps({ show }); },
      async advance (ms) { vi.advanceTimersByTime(ms); await nextTick(); },
      async fire (el, type) { el?.dispatchEvent(new Event(type)); await nextTick(); },
      async unmount () { wrapper.unmount(); },
    };
    out[name] = await run(adapter, scenario);
    vi.useRealTimers();
    expect(out[name].length).toBeGreaterThan(0);
  });
}

it('writes the traces', () => {
  expect(Object.keys(out)).toHaveLength(Object.keys(SCENARIOS).length);
  // Run from packages/dialtone-vue (Vite serves this file under /@fs/, so import.meta.url isn't a file path).
  fs.writeFileSync(path.resolve('../dialtone-react/parity/transition-traces.json'), `${JSON.stringify(out, null, 1)}\n`);
});
