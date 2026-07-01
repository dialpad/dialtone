import DtcCombinator from './combinator.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { getSupportedComponents } from '@/src/lib/test/utils_test';
import { DtInput, DtToggle } from '@dialpad/dialtone-vue';
import allDocs from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';

const documentation = allDocs;
const toggleDoc = allDocs.find(d => d.displayName === 'DtToggle');
const inputDoc = allDocs.find(d => d.displayName === 'DtInput');

describe('combinator.vue test', function () {
  const testComponents = getSupportedComponents();

  let wrapper;

  afterEach(function () {
    window.localStorage.clear();
  });

  describe(`Supported component tests`, function () {
    testComponents.forEach(component => {
      describe(`When mounted with component '${component.name}'`, function () {
        beforeEach(function () {
          wrapper = shallowMount(DtcCombinator, {
            props: {
              component,
              documentation,
              variants: {},
            },
          });
        });

        afterEach(function () {
          wrapper.unmount();
        });

        it('Should render successfully', function () {
          expect(wrapper.exists()).toBe(true);
        });
      });
    });
  });

  describe('v-model writeback', function () {
    describe('boolean modelValue (DtToggle)', function () {
      beforeEach(function () {
        wrapper = shallowMount(DtcCombinator, {
          props: {
            component: DtToggle,
            documentation: toggleDoc,
            variants: {},
          },
        });
      });

      afterEach(function () {
        wrapper.unmount();
      });

      it('updates options.props when the renderer emits an update:modelValue event', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });
        const initialValue = renderer.props('options').props.modelValue;

        await renderer.vm.$emit('event', 'update:modelValue', !initialValue);
        await nextTick();

        expect(renderer.props('options').props.modelValue).toBe(!initialValue);
      });

      it('does not mutate options.props for non-update events (e.g. "change")', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });
        const before = JSON.stringify(renderer.props('options').props);

        await renderer.vm.$emit('event', 'change', 'something');
        await nextTick();

        expect(JSON.stringify(renderer.props('options').props)).toBe(before);
      });
    });

    describe('string modelValue (DtInput)', function () {
      beforeEach(function () {
        wrapper = shallowMount(DtcCombinator, {
          props: {
            component: DtInput,
            documentation: inputDoc,
            variants: {},
          },
        });
      });

      afterEach(function () {
        wrapper.unmount();
      });

      it('updates options.props when the renderer emits an update:modelValue event', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });

        await renderer.vm.$emit('event', 'update:modelValue', 'hello');
        await nextTick();

        expect(renderer.props('options').props.modelValue).toBe('hello');
      });

      it('reflects subsequent updates (simulates typing character by character)', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });

        for (const value of ['h', 'he', 'hel', 'hell', 'hello']) {
          await renderer.vm.$emit('event', 'update:modelValue', value);
          await nextTick();
        }

        expect(renderer.props('options').props.modelValue).toBe('hello');
      });
    });
  });

  describe('control display settings', function () {
    beforeEach(function () {
      wrapper = shallowMount(DtcCombinator, {
        props: {
          component: DtToggle,
          documentation: toggleDoc,
          variants: {},
        },
      });
    });

    afterEach(function () {
      wrapper.unmount();
    });

    it('persists control display settings and passes them to new component views', async function () {
      const optionBar = wrapper.findComponent({ name: 'DtcOptionBar' });

      expect(optionBar.props('settings').controls.hideDeprecated).toBe(true);

      await optionBar.vm.$emit('update:settings', (model) => {
        model.controls.hideDeprecated = false;
      });
      await nextTick();

      expect(window.localStorage.getItem('dialtoneCombinatorControlsHideDeprecated')).toBe('false');

      const nextWrapper = shallowMount(DtcCombinator, {
        props: {
          component: DtInput,
          documentation: inputDoc,
          variants: {},
        },
      });

      expect(nextWrapper.findComponent({ name: 'DtcOptionBar' }).props('settings').controls.hideDeprecated).toBe(false);
      nextWrapper.unmount();
    });
  });
});
