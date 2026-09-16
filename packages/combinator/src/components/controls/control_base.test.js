import DtcControlBase from './control_base.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

describe('control_base.vue test', function () {
  let wrapper;

  beforeAll(function () {
    wrapper = mount(DtcControlBase);
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
