import DtcControlString from './control_string.vue';

import { expect } from 'vitest';
import {
  mountClearableControl,
  ADD_BUTTON_SELECTOR as addButtonSelector,
  REMOVE_BUTTON_SELECTOR as clearButtonSelector,
} from '@/src/lib/test/utils_test';

const inputSelector = 'input';

const inputValue = 'string test';

describe('control_string.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mountClearableControl(DtcControlString, props);
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    inputWrapper = wrapper.find(inputSelector);
  };

  beforeEach(function () {
    _mountWrapper();
  });

  afterEach(function () {
    wrapper?.unmount();
  });

  describe('When a value is provided', function () {
    beforeEach(async function () {
      await wrapper.setProps({
        value: inputValue,
      });
      _setChildWrappers();
    });

    it('Should set the native input to value', function () {
      expect(inputValue).toBe(inputWrapper.element.value);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should render the label and add button without the input', function () {
      expect(wrapper.text()).toContain('Label');
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
      expect(inputWrapper.exists()).toBe(false);
      expect(wrapper.find(clearButtonSelector).exists()).toBe(false);
    });
  });

  describe('When clearing the value', function () {
    it('Should emit null when cleared', async function () {
      _mountWrapper({ value: inputValue });
      await wrapper.find(clearButtonSelector).trigger('click');

      expect(wrapper.emitted('update:value')[0]).toEqual([null]);
    });
  });

  describe('When deleting the input value', function () {
    it('Should keep the input rendered until blur', async function () {
      _mountWrapper({ value: inputValue });

      await inputWrapper.setValue('');
      await wrapper.setProps({ value: '' });
      _setChildWrappers();

      expect(inputWrapper.exists()).toBe(true);

      await inputWrapper.trigger('blur');
      _setChildWrappers();

      expect(inputWrapper.exists()).toBe(false);
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
    });
  });
});
