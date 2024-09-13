import DtcCombinator from './combinator';

import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
import { getSupportedComponents } from '@/src/lib/test/utils_test';
import documentation from '@/node_modules/@dialpad/dialtone-vue/dist/component-documentation.json';

describe('combinator.vue test', function () {
  const testComponents = getSupportedComponents();

  let wrapper;

  describe(`Supported component tests`, function () {
    testComponents.forEach(component => {
      describe(`When mounted with component '${component.name}'`, function () {
        beforeEach(function () {
          wrapper = shallowMount(DtcCombinator, {
            props: {
              component,
              documentation,
              variants: {},
            },
          });
        });

        afterEach(function () {
          wrapper.unmount();
        });

        it('Should render successfully', function () {
          assert.isTrue(wrapper.exists());
        });
      });
    });
  });
});
