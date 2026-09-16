import DtcControlEvent from './control_event.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

describe('control_event.vue test', function () {
  let wrapper;

  beforeAll(function () {
    wrapper = mount(DtcControlEvent);
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
