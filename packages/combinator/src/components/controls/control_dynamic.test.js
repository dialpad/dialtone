import DtcControlDynamic from './control_dynamic';
import DtcControlNumber from '@/src/components/controls/control_number';
import DtcControlString from '@/src/components/controls/control_string';

import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import { UNSET } from '@/src/lib/control';

const selectionSelector = '[data-qa=dtc-control-dynamic-selection]';
const inputSelector = 'select';

const testControls = {
  string: {
    value: 'string test',
    component: DtcControlString,
  },
  number: {
    value: 17,
    component: DtcControlNumber,
  },
  true: {
    value: true,
  },
  false: {
    value: false,
  },
  null: {
    value: null,
  },
  undefined: {
    value: undefined,
  },
};

const defaultValue = undefined;

describe('control_dynamic.vue test', function () {
  let wrapper;
  let selectionWrapper;
  let inputWrapper;

  const _mountWrapper = () => {
    wrapper = mount(DtcControlDynamic);
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    selectionWrapper = wrapper?.find(selectionSelector);
    inputWrapper = selectionWrapper?.find(inputSelector);
  };

  before(function () {
    _mountWrapper();
  });

  describe('When mounted', function () {
    beforeEach(async function () {
      await wrapper.setProps({
        value: defaultValue,
      });
    });

    it('Should render successfully', function () {
      assert.isTrue(wrapper.exists());
    });
  });

  Object.entries(testControls).forEach(([control, { value, component }]) => {
    describe(
      `When provided value is '${value === UNSET ? `${UNSET.toString()}` : value}' {${typeof value}}`,
      function () {
        beforeEach(function () {
          wrapper = mount(DtcControlDynamic, {
            props: {
              value,
            },
          });
          _setChildWrappers();
        });

        it(`Should set selection to '${control}'`, function () {
          assert.equal(inputWrapper.element.value, control);
        });

        if (component) {
          it(`Should set the generated control to '${component.name}'`, function () {
            assert.exists(wrapper.findComponent(component));
          });
        }
      },
    );
  });
});
