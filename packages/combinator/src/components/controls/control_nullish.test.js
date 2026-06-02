import DtcControlNullish from './control_nullish.vue';
import DtcControlSelection from './control_selection.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { UNSET } from '@/src/lib/control';

const inputValue = UNSET;
const inputString = 'undefined';
const defaultString = 'null';

describe('control_nullish.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlNullish, { props });
    inputWrapper = wrapper.findComponent(DtcControlSelection);
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
      inputWrapper = wrapper.findComponent(DtcControlSelection);
    });

    it('Should set the native input to value', function () {
      expect(inputWrapper.props('value')).toBe(inputString);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the native input to control default', function () {
      expect(inputWrapper.props('value')).toBe(defaultString);
    });
  });
});
