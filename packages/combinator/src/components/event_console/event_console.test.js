import DtcEventConsole from './event_console.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

describe('event_console.vue test', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = mount(DtcEventConsole);
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper).toBeTruthy();
    });
  });
});
