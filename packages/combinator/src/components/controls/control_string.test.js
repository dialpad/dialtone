import DtcControlString from './control_string.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = 'input';

const inputValue = 'string test';
const defaultValue = typeof DtcControlString.props.value.default === 'function'
  ? DtcControlString.props.value.default()
  : DtcControlString.props.value.default;

describe('control_string.vue test', function () {
  let wrapper;
  let inputWrapper;

  beforeEach(function () {
    wrapper = mount(DtcControlString, {
      slots: {
        default: 'Label',
      },
    });
  });

  const _mountWrapper = (props = {}) => {
    wrapper = mount(DtcControlString, {
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

  describe('When clearing the value', function () {
    it('Should render a clear button', function () {
      _mountWrapper();

      expect(wrapper.find('[aria-label="Remove value"]').exists()).toBe(true);
    });

    it('Should emit null when cleared', function () {
      _mountWrapper({ value: inputValue });
      wrapper.vm.clearValue();

      expect(wrapper.emitted('update:value')[0]).toEqual([null]);
    });

    it('Should disable the clear button for empty values', function () {
      _mountWrapper();

      expect(wrapper.vm.clearDisabled).toBe(true);
    });

    it('Should disable the clear button for required values', function () {
      wrapper = mount(DtcControlString, {
        props: {
          required: true,
          value: inputValue,
        },
        slots: {
          default: 'Label',
        },
      });

      expect(wrapper.vm.clearDisabled).toBe(true);
    });
  });
});
