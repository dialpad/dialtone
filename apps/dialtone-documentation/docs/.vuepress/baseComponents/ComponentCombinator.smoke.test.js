import { mount } from '@vue/test-utils';
import { markRaw } from 'vue';
import { vi } from 'vitest';
import * as components from '@dialpad/dialtone-vue';
import * as icons from '@dialpad/dialtone-icons/vue';
import { DtcCombinator, variantBank } from '@dialpad/dialtone-combinator';
import allDocs from '@workspaceRoot/packages/dialtone-vue/dist/component-documentation.json';
import { settleCombinatorInitialization } from './combinatorSmokeTestUtils.js';

const library = markRaw({ ...components, ...icons });

beforeEach(() => vi.useFakeTimers({ loopLimit: 1000 }));
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
  window.localStorage.clear();
});

async function withPresetFixture (name, variants, preset, run) {
  const warnings = [];
  const target = document.createElement('div');
  document.body.append(target);
  let wrapper;
  let motionText;
  try {
    wrapper = mount(DtcCombinator, {
      attachTo: target,
      props: {
        component: markRaw(components[name]),
        documentation: allDocs.find(doc => doc.displayName === name),
        variants,
        library,
        preset,
      },
      global: {
        // Exercise the real target and its lifecycle; controls have separate focused tests.
        stubs: { DtcOptionBar: true, DtcCodePanel: true },
        config: { warnHandler: message => warnings.push(message) },
        mixins: [{
          mounted () {
            if (this.$options.name === 'DtMotionText') motionText = this;
          },
        }],
      },
    });
    const check = async expected => {
      await settleCombinatorInitialization(`${name}: ${expected}`, () => {
        // Loop playback is not initialization. Pause via the public API without changing preset props.
        if (motionText?.loop) motionText.pause();
      });
      const context = `${name}: ${expected}\n${warnings.slice(-3).join('\n')}`;
      expect(wrapper.vm.selectedVariant, context).toBe(expected);
      expect(wrapper.emitted('update:preset'), context).toBeUndefined();
    };
    await run(wrapper, check);
  } finally {
    wrapper?.unmount();
    target.remove();
  }
}

for (const [name, variants] of Object.entries(variantBank())) {
  const presets = Object.keys(variants).filter(preset => preset !== 'defaults' && preset !== 'exclusions');
  for (const preset of presets) {
    // A fresh target and clock keep delayed events tied to this preset, including the last case.
    it(`${name}: ${preset} initializes without emitting a custom edit`, async () => {
      await withPresetFixture(name, variants, preset, async (wrapper, check) => check(preset));
    }, 30000);
  }

  it(`${name} switches every preset without emitting a custom edit`, async () => {
    await withPresetFixture(name, variants, 'default', async (wrapper, check) => {
      await check('default');
      for (const preset of presets) {
        await wrapper.setProps({ preset });
        // Drain the current preset before moving on, so late work cannot be blamed on its successor.
        await check(preset);
      }
    });
  }, 30000);
}
