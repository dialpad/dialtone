import DtcEventConsole from './event_console';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';

describe('event_console.vue test', function () {
  let wrapper;

  beforeEach(function () {
    wrapper = mount(DtcEventConsole);
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      assert.exists(wrapper);
    });
  });
});
