import DtcControlBoolean from './control_boolean.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = '[data-qa=dtc-control-boolean-input]';

const inputValue = true;
const defaultValue = DtcControlBoolean.props.value.default();

describe('control_boolean.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = mount(DtcControlBoolean, { props });
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
      await wrapper.setProps({ value: inputValue });
    });

    it('Should set the toggle aria-checked to value', function () {
      expect(wrapper.find(inputSelector).attributes('aria-checked')).toBe(String(inputValue));
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the toggle aria-checked to control default', function () {
      expect(wrapper.find(inputSelector).attributes('aria-checked')).toBe(String(defaultValue));
    });
  });

  describe('When a nullable boolean value is routed to the boolean control', function () {
    beforeEach(function () {
      _mountWrapper({ value: null });
    });

    it('Should render the toggle unchecked', function () {
      expect(wrapper.find(inputSelector).exists()).toBe(true);
      expect(wrapper.find(inputSelector).attributes('aria-checked')).toBe('false');
    });
  });
});
