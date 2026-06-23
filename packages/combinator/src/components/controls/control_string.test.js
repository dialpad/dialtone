import DtcControlString from './control_string.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = 'input';
const addButtonSelector = '[aria-label="Add value"]';
const clearButtonSelector = '[aria-label="Remove value"]';

const inputValue = 'string test';

describe('control_string.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mount(DtcControlString, {
      attachTo: document.body,
      props,
      slots: {
        default: 'Label',
      },
    });
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

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
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
});
