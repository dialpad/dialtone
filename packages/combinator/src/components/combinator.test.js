import DtcCombinator from './combinator.vue';

import { assert } from 'chai';
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
          assert.isTrue(wrapper.exists());
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

        assert.strictEqual(renderer.props('options').props.modelValue, !initialValue);
      });

      it('does not mutate options.props for non-update events (e.g. "change")', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });
        const before = JSON.stringify(renderer.props('options').props);

        await renderer.vm.$emit('event', 'change', 'something');
        await nextTick();

        assert.strictEqual(JSON.stringify(renderer.props('options').props), before);
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

        assert.strictEqual(renderer.props('options').props.modelValue, 'hello');
      });

      it('reflects subsequent updates (simulates typing character by character)', async function () {
        const renderer = wrapper.findComponent({ name: 'DtcRenderer' });

        for (const value of ['h', 'he', 'hel', 'hell', 'hello']) {
          await renderer.vm.$emit('event', 'update:modelValue', value);
          await nextTick();
        }

        assert.strictEqual(renderer.props('options').props.modelValue, 'hello');
      });
    });
  });
});
