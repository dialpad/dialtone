import DtcControlSlot from './control_slot.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = 'textarea';
const addButtonSelector = '[aria-label="Add value"]';
const clearButtonSelector = '[aria-label="Remove value"]';

const inputValue = 'slot test';
const defaultValue = '';

describe('control_slot.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = (props = {}) => {
    wrapper?.unmount();
    wrapper = mount(DtcControlSlot, {
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

    it('Should render the label and add button without the textarea', function () {
      expect(wrapper.text()).toContain('Label');
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
      expect(inputWrapper.exists()).toBe(false);
      expect(wrapper.find(clearButtonSelector).exists()).toBe(false);
    });

    it('Should expand, focus, and collapse on empty blur', async function () {
      await wrapper.find(addButtonSelector).trigger('click');
      _setChildWrappers();

      expect(inputWrapper.exists()).toBe(true);
      expect(defaultValue).toBe(inputWrapper.element.value);
      expect(document.activeElement).toBe(inputWrapper.element);

      await inputWrapper.trigger('blur');
      _setChildWrappers();

      expect(inputWrapper.exists()).toBe(false);
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
    });

    it('Should stay expanded on blur when a value has been entered', async function () {
      await wrapper.find(addButtonSelector).trigger('click');
      _setChildWrappers();
      await inputWrapper.setValue(inputValue);
      await wrapper.setProps({ value: inputValue });
      await inputWrapper.trigger('blur');
      _setChildWrappers();

      expect(inputWrapper.exists()).toBe(true);
      expect(inputWrapper.element.value).toBe(inputValue);
    });
  });

  describe('When clearing the value', function () {
    it('Should emit null and collapse after the value is cleared', async function () {
      _mountWrapper({ value: inputValue });
      await wrapper.find(clearButtonSelector).trigger('click');
      await wrapper.setProps({ value: null });
      _setChildWrappers();

      expect(wrapper.emitted('update:value')[0]).toEqual([null]);
      expect(inputWrapper.exists()).toBe(false);
      expect(wrapper.find(addButtonSelector).exists()).toBe(true);
    });

    it('Should not expose an add action for required values', function () {
      _mountWrapper({
        required: true,
        value: null,
      });

      expect(wrapper.find(addButtonSelector).exists()).toBe(false);
      expect(wrapper.find(inputSelector).exists()).toBe(true);
      expect(wrapper.find(clearButtonSelector).attributes('disabled')).toBeDefined();
    });
  });
});
