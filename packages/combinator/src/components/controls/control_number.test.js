import DtcControlNumber from './control_number.vue';

import { expect } from 'vitest';
import {
  mountClearableControl,
  REMOVE_BUTTON_SELECTOR as clearButtonSelector,
} from '@/src/lib/test/utils_test';

const inputSelector = 'input';

const inputValue = 5;
const defaultValue = DtcControlNumber.props.value.default;

describe('control_number.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mountClearableControl(DtcControlNumber, props);
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

  describe('When clearing the value', function () {
    it('Should disable the clear button for required values', function () {
      _mountWrapper({
        required: true,
        value: inputValue,
      });

      const clearButton = wrapper.find(clearButtonSelector);
      expect(clearButton.attributes('disabled')).toBeDefined();
      expect(clearButton.classes()).not.toContain('d-o0');
    });
  });
});
