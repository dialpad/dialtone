import DtcControlBoolean from './control_boolean.vue';
import { DtToggle } from '@dialpad/dialtone-vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

const inputValue = true;
const defaultValue = DtcControlBoolean.props.value.default();

describe('control_boolean.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlBoolean, { props });
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

    it('Should set the toggle to value', function () {
      expect(wrapper.findComponent(DtToggle).props('modelValue')).toBe(inputValue);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the toggle to control default', function () {
      expect(wrapper.findComponent(DtToggle).props('modelValue')).toBe(defaultValue);
    });
  });
});
