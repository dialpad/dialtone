import DtcControlEvent from './control_event.vue';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';

describe('control_event.vue test', function () {
  let wrapper;

  before(function () {
    wrapper = mount(DtcControlEvent);
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      assert.isTrue(wrapper.exists());
    });
  });
});
