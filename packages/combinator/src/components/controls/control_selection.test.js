import DtcControlSelection from './control_selection.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

const selections = [
  'selection1',
  'selection2',
  'selection3',
];

const inputValue = selections[1];

describe('control_selection.vue test', function () {
  let wrapper;

  const _mountWrapper = () => {
    wrapper = shallowMount(DtcControlSelection, {
      props: {
        value: inputValue,
        validValues: selections,
      },
    });
  };

  beforeAll(function () {
    _mountWrapper();
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('When rendering options', function () {
    describe('Should create an option for each selection', function () {
      selections.forEach(selection => {
        it(`Should have an option for selection '${selection}'`, function () {
          expect(wrapper.props('validValues').includes(selection)).toBe(true);
        });
      });
    });

    describe('When a value is provided', function () {
      it('Should set the value to the provided value', function () {
        expect(wrapper.props('value')).toBe(inputValue);
      });
    });
  });
});
