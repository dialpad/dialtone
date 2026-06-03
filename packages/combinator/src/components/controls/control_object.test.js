import DtcControlObject from './control_object.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const itemKeySelector = '[data-qa=dtc-control-object-item-key]';
const itemKeyInputSelector = 'input';

const itemValueSelector = '[data-qa=dtc-control-object-item-value]';
const itemValueInputSelector = 'input';

const inputValues = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
  key4: 4,
};

describe('control_object.vue test', function () {
  let wrapper;
  let itemKeyWrappers;
  let itemKeyInputWrappers;
  let itemValueWrappers;
  let itemValueInputWrappers;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlObject);
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    itemKeyWrappers = wrapper.findAll(itemKeySelector);
    itemKeyInputWrappers = itemKeyWrappers.map(itemWrapper => itemWrapper.find(itemKeyInputSelector));
    itemValueWrappers = wrapper.findAll(itemValueSelector);
    itemValueInputWrappers = itemValueWrappers.map(itemWrapper => itemWrapper.find(itemValueInputSelector));
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
        value: inputValues,
      });
      _setChildWrappers();
    });

    it('Should generate a key control and a value control for each object entry', function () {
      expect(Object.keys(inputValues).length).toBe(itemKeyWrappers.length);
      expect(Object.values(inputValues).length).toBe(itemValueWrappers.length);
    });

    // Checking if each key-value pair passed to the component has native inputs with a matching values
    describe('Should have matching control and native input values', function () {
      Object.entries(inputValues).forEach(([inputKey, inputValue]) => {
        it(`Should have a matching native input for key '${inputKey}'`, function () {
          const itemKeys = itemKeyInputWrappers.map(inputWrapper => {
            return inputWrapper.element.value;
          });

          expect(itemKeys.includes(inputKey)).toBe(true);
        });

        it(`Should have a matching native input for value '${inputValue}'`, function () {
          const itemValues = itemValueInputWrappers.map(inputWrapper => {
            return inputWrapper.element.value;
          });
          expect(itemValues.includes(inputValue.toString())).toBe(true);
        });
      });
    });
  });
});
