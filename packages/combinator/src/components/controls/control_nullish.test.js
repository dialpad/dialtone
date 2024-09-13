import DtcControlNullish from './control_nullish';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import { UNSET } from '@/src/lib/control';

const inputSelector = 'select';

const inputValue = UNSET;

const inputString = 'undefined';
const defaultString = 'null';

describe('control_nullish.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlNullish);
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    inputWrapper = wrapper.find(inputSelector);
  };

  before(function () {
    _mountWrapper();
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      assert.isTrue(wrapper.exists());
    });
  });

  describe('When a value is provided', function () {
    beforeEach(async function () {
      await wrapper.setProps({
        value: inputValue,
      });
    });

    it('Should set the native input to value', function () {
      assert.equal(inputString, inputWrapper.element.value);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the native input to control default', function () {
      assert.equal(defaultString, inputWrapper.element.value);
    });
  });
});
