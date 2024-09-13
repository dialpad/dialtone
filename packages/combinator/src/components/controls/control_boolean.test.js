import DtcControlBoolean from './control_boolean';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';

const inputSelector = '[data-qa=dtc-control-boolean-input]';

const inputValue = true;
const defaultValue = DtcControlBoolean.props.value.default();

describe('control_boolean.vue test', function () {
  let wrapper;
  let inputWrapper;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlBoolean);
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
      assert.equal(inputValue, inputWrapper.element.checked);
    });
  });

  describe('When a value is not provided', function () {
    beforeEach(function () {
      _mountWrapper();
    });

    it('Should set the native input to control default', function () {
      assert.equal(defaultValue, inputWrapper.element.checked);
    });
  });
});
