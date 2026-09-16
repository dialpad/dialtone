import DtcControlIterable from './control_iterable.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

describe('control_iterable.vue test', function () {
  let wrapper;

  beforeAll(function () {
    wrapper = mount(DtcControlIterable, {
      props: {
        value: [],
        generateItem: () => null,
      },
    });
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
  });
});
