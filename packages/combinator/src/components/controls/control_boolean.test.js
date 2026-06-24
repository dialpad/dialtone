import DtcControlBoolean from './control_boolean.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

const inputSelector = '[data-qa=dtc-control-boolean-input]';

const inputValue = true;

describe('control_boolean.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = mount(DtcControlBoolean, { props });
  };

  beforeAll(function () {
    _mountWrapper();
  });

  describe('When a value is provided', function () {
    beforeEach(async function () {
      await wrapper.setProps({ value: inputValue });
    });

    it('Should set the toggle aria-checked to value', function () {
      expect(wrapper.find(inputSelector).attributes('aria-checked')).toBe(String(inputValue));
    });
  });

  describe('When no truthy value is provided', function () {
    it.each([undefined, null])('Should render the toggle unchecked for %s', function (value) {
      _mountWrapper({ value });

      expect(wrapper.find(inputSelector).attributes('aria-checked')).toBe('false');
    });
  });
});
