import DtcControlNumber from './control_number.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = 'input';

const inputValue = 5;
const defaultValue = DtcControlNumber.props.value.default();

describe('control_number.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlNumber);
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
      expect(inputWrapper.element.value).toBe(String(inputValue));
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the native input to control default', function () {
      expect(inputWrapper.element.value).toBe(String(defaultValue));
    });
  });
});
