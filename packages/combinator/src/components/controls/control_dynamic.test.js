import DtcControlDynamic from './control_dynamic.vue';
import DtcControlNumber from '@/src/components/controls/control_number.vue';
import DtcControlString from '@/src/components/controls/control_string.vue';

import { expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import { UNSET } from '@/src/lib/control';

const testControls = {
  string: {
    value: 'string test',
    component: DtcControlString,
  },
  number: {
    value: 17,
    component: DtcControlNumber,
  },
  true: { value: true },
  false: { value: false },
  null: { value: null },
  undefined: { value: undefined },
};

describe('control_dynamic.vue test', function () {
  let wrapper;

  const _mountWrapper = (props = {}) => {
    wrapper = shallowMount(DtcControlDynamic, { props });
  };

  beforeAll(function () {
    _mountWrapper();
  });

  describe('When mounted', function () {
    it('Should render successfully', function () {
      expect(wrapper.exists()).toBe(true);
    });
  });

  Object.entries(testControls).forEach(([control, { value, component }]) => {
    describe(
      `When provided value is '${value === UNSET ? `${UNSET.toString()}` : value}' {${typeof value}}`,
      function () {
        beforeEach(function () {
          _mountWrapper({ value });
        });

        it(`Should resolve selection to '${control}'`, function () {
          expect(wrapper.vm.selectedControl).toBe(control);
        });

        if (component) {
          it(`Should render the generated control '${component.name}'`, function () {
            expect(wrapper.findComponent(component).exists()).toBe(true);
          });
        }
      },
    );
  });
});
