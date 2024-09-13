import DtcControlSelection from './control_selection';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';

const inputSelector = 'select';
const optionSelector = 'option';

const selections = [
  'selection1',
  'selection2',
  'selection3',
];

const inputValue = selections[1];

describe('control_selection.vue test', function () {
  let wrapper;
  let inputWrapper;
  let optionWrappers;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlSelection, {
      props: {
        value: inputValue,
        validValues: selections,
      },
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    inputWrapper = wrapper.find(inputSelector);
    optionWrappers = wrapper.findAll(optionSelector);
  };

  before(function () {
    _mountWrapper();
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      assert.isTrue(wrapper.exists());
    });
  });

  describe('When rendering the native select', function () {
    describe('Should create option elements for each selection', function () {
      selections.forEach(selection => {
        it(`Should have a matching option element for selection '${selection}'`, function () {
          const optionValues = optionWrappers.map(optionWrapper => {
            return optionWrapper.element.value;
          });
          assert.isTrue(optionValues.includes(selection));
        });
      });
    });

    describe('When a value is provided', function () {
      it('Should set the native input to value', function () {
        assert.equal(inputValue, inputWrapper.element.value);
      });
    });
  });
});
