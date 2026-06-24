import DtcControlDynamic from './control_dynamic.vue';
import DtcControlNumber from '@/src/components/controls/control_number.vue';
import DtcControlString from '@/src/components/controls/control_string.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

const testControls = {
  string: {
    value: 'string test',
    component: DtcControlString,
  },
  number: {
    value: 17,
    component: DtcControlNumber,
  },
};

describe('control_dynamic.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlDynamic, { props });
  };

  beforeAll(function () {
    _mountWrapper();
  });

  Object.entries(testControls)
    .forEach(([, { value, component }]) => {
      describe(`When provided value is '${value}' {${typeof value}}`, function () {
        beforeEach(function () {
          _mountWrapper({ value });
        });

        it(`Should render the generated control '${component.name}'`, function () {
          expect(wrapper.findComponent(component).exists()).toBe(true);
        });
      });
    });
});
