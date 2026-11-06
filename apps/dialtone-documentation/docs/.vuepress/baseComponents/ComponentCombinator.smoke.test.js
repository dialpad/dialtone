import { flushPromises, mount } from '@vue/test-utils';
import { markRaw, nextTick } from 'vue';
import * as components from '@dialpad/dialtone-vue';
import * as icons from '@dialpad/dialtone-icons/vue';
import { DtcCombinator, variantBank } from '@dialpad/dialtone-combinator';
import allDocs from '@workspaceRoot/packages/dialtone-vue/dist/component-documentation.json';

const library = markRaw({ ...components, ...icons });

for (const [name, variants] of Object.entries(variantBank())) {
  it(`${name} initializes all presets without emitting a custom edit`, async () => {
    const warnings = [];
    const target = document.createElement('div');
    document.body.append(target);
    const wrapper = mount(DtcCombinator, {
      attachTo: target,
      props: {
        component: markRaw(components[name]),
        documentation: allDocs.find(doc => doc.displayName === name),
        variants,
        library,
      },
      // Exercise the real target and its lifecycle; controls have separate focused tests.
      global: {
        stubs: { DtcOptionBar: true, DtcCodePanel: true },
        // Keep verbose fixture warnings as failure context instead of logging the entire component library.
        config: { warnHandler: message => warnings.push(message) },
      },
    });
    try {
      const presets = Object.keys(variants).filter(preset => preset !== 'defaults' && preset !== 'exclusions');
      for (const preset of presets) {
        await wrapper.setProps({ preset });
        await nextTick();
        await flushPromises();
        // Editor create events and other deferred initialization run after the first render tick.
        await new Promise(resolve => setTimeout(resolve, 60));
        await flushPromises();
        const context = `${name}: ${preset}\n${warnings.slice(-3).join('\n')}`;
        expect(wrapper.vm.selectedVariant, context).toBe(preset);
        expect(wrapper.emitted('update:preset'), context).toBeUndefined();
      }
    } finally {
      wrapper.unmount();
      target.remove();
      window.localStorage.clear();
    }
  }, 30000);
}
