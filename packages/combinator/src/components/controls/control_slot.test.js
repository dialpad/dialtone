import DtcControlSlot from './control_slot.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = 'textarea';

const inputValue = 'slot test';
const defaultValue = '';

describe('control_slot.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlSlot);
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    inputWrapper = wrapper.find(inputSelector);
  };

  beforeAll(function () {
    _mountWrapper();
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

    it('Should set the native input to control default', function () {
      expect(defaultValue).toBe(inputWrapper.element.value);
    });
  });
});
