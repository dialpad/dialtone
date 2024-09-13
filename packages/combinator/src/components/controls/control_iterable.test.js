import DtcControlIterable from './control_iterable';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';

describe('control_iterable.vue test', function () {
  let wrapper;

  before(function () {
    wrapper = mount(DtcControlIterable, {
      props: {
        value: [],
        generateItem: () => null,
      },
    });
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      assert.isTrue(wrapper.exists());
    });
  });
});
