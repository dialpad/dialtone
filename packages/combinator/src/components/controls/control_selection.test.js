import DtcControlSelection from './control_selection.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { nextTick } from 'vue';
import {
  mountClearableControl,
  ADD_BUTTON_SELECTOR as addButtonSelector,
  REMOVE_BUTTON_SELECTOR as clearButtonSelector,
} from '@/src/lib/test/utils_test';

const selections = ['selection1', 'selection2', 'selection3'];
const anchorButtonSelector = '.d-w100p';

const manySelections = [
  'alpha',
  'beta',
  'gamma',
  'delta',
  'epsilon',
  'zeta',
  'eta',
];

const inputValue = selections[1];

describe('control_selection.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlSelection, {
      props: {
        value: inputValue,
        validValues: selections,
        ...props,
      },
    });
  };

  beforeAll(function () {
    _mountWrapper();
  });

  describe('When the selection is empty', function () {
    it('Should display a non-breaking space to hold the label height', function () {
      _mountWrapper({ value: null });

      expect(wrapper.vm.selectedLabel).toBe('\u00A0');
    });
  });

  describe('selectFirst', function () {
    beforeEach(function () {
      _mountWrapper({
        validValues: manySelections,
        defaultValue: manySelections[0],
        disabledValues: new Set(['alpha']),
      });
    });

    it('Should skip disabled options and select the first enabled one', function () {
      wrapper.vm.query = '';
      const closeSpy = vi.fn();
      wrapper.vm.selectFirst(closeSpy);
      // 'alpha' is disabled — next enabled is 'beta'
      const emitted = wrapper.emitted('update:value');
      expect(emitted).toBeTruthy();
      expect(emitted[0][0]).toBe('beta');
    });
  });

  describe('Clearable collapsed state', function () {
    let behaviorWrapper;

    const mountBehaviorWrapper = (props = {}) => {
      behaviorWrapper?.unmount();
      behaviorWrapper = mountClearableControl(DtcControlSelection, {
        value: null,
        validValues: selections,
        ...props,
      });
    };

    afterEach(function () {
      behaviorWrapper?.unmount();
    });

    it('Should render the label and add button without the dropdown when empty', function () {
      mountBehaviorWrapper();

      expect(behaviorWrapper.text()).toContain('Label');
      expect(behaviorWrapper.find(addButtonSelector).exists()).toBe(true);
      expect(behaviorWrapper.find(anchorButtonSelector).exists()).toBe(false);
      expect(behaviorWrapper.find(clearButtonSelector).exists()).toBe(false);
    });

    it('Should collapse on dropdown close when the selection is still empty', async function () {
      mountBehaviorWrapper();

      await behaviorWrapper.find(addButtonSelector).trigger('click');
      await nextTick();
      behaviorWrapper.findComponent({ name: 'DtDropdown' }).vm.$emit('opened', false);
      await nextTick();

      expect(behaviorWrapper.find(anchorButtonSelector).exists()).toBe(false);
      expect(behaviorWrapper.find(addButtonSelector).exists()).toBe(true);
    });

    it('Should open the dropdown when the add button is clicked', async function () {
      mountBehaviorWrapper();

      await behaviorWrapper.find(addButtonSelector).trigger('click');
      await nextTick();

      expect(behaviorWrapper.findComponent({ name: 'DtDropdown' }).props('open')).toBe(true);
    });

    it('Should collapse when an external reset clears the selection', async function () {
      mountBehaviorWrapper();

      await behaviorWrapper.find(addButtonSelector).trigger('click');
      await behaviorWrapper.setProps({ value: selections[0] });
      expect(behaviorWrapper.find(anchorButtonSelector).exists()).toBe(true);

      await behaviorWrapper.setProps({ value: null });

      expect(behaviorWrapper.find(anchorButtonSelector).exists()).toBe(false);
      expect(behaviorWrapper.find(addButtonSelector).exists()).toBe(true);
    });
  });
});
