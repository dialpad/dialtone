import DtcControlString from './control_string';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';

const inputSelector = 'input';

const inputValue = 'string test';
const defaultValue = DtcControlString.props.value.default();

describe('control_string.vue test', function () {
  let wrapper;
  let inputWrapper;

  beforeEach(function () {
    wrapper = mount(DtcControlString);
  });

  const _mountWrapper = () => {
    wrapper = mount(DtcControlString);
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
      _setChildWrappers();
    });

    it('Should set the native input to value', function () {
      assert.equal(inputValue, inputWrapper.element.value);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the native input to control default', function () {
      assert.equal(defaultValue, inputWrapper.element.value);
    });
  });
});
