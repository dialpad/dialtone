import DtcNode from './node.vue';

import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

describe('node.vue test', function () {
  describe('When a globally registered directive is used in the slot template', function () {
    let wrapper;
    let mountedSpy;

    beforeEach(function () {
      mountedSpy = { called: false };

      wrapper = mount(DtcNode, {
        props: {
          template: '<div v-x-test></div>',
        },
        global: {
          directives: {
            'x-test': {
              mounted () { mountedSpy.called = true; },
            },
          },
        },
      });
    });

    afterEach(function () {
      wrapper.unmount();
    });

    it('Should fire the directive mounted hook', function () {
      expect(mountedSpy.called).toBe(true);
    });
  });

  describe('When a component is passed via the library prop', function () {
    let wrapper;

    beforeEach(function () {
      const StubComponent = {
        name: 'StubComponent',
        template: '<span class="stub-rendered">stub</span>',
      };

      wrapper = mount(DtcNode, {
        props: {
          template: '<stub-component />',
          library: { StubComponent },
        },
      });
    });

    afterEach(function () {
      wrapper.unmount();
    });

    it('Should render the library component', function () {
      expect(wrapper.find('.stub-rendered').exists()).toBe(true);
    });
  });
});
