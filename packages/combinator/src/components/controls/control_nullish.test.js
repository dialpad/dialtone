import DtcControlNullish from './control_nullish.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { UNSET } from '@/src/lib/control';

const inputValue = UNSET;
const inputString = 'undefined';
const defaultString = 'null';

describe('control_nullish.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlNullish, { props });
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

    it('Should resolve to the correct selection key', function () {
      expect(wrapper.vm.selection).toBe(inputString);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should resolve to the default selection key', function () {
      expect(wrapper.vm.selection).toBe(defaultString);
    });
  });
});
