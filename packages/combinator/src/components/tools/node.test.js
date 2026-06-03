import { describe, it, beforeEach, afterEach, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DtcNode from './node.vue';

describe('node.vue test', () => {
  describe('When a globally registered directive is used in the slot template', () => {
    let wrapper;
    let mountedSpy;

    beforeEach(() => {
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

    afterEach(() => {
      wrapper.unmount();
    });

    it('Should fire the directive mounted hook', () => {
      expect(mountedSpy.called).toBe(true);
    });
  });

  describe('When a component is passed via the library prop', () => {
    let wrapper;

    beforeEach(() => {
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

    afterEach(() => {
      wrapper.unmount();
    });

    it('Should render the library component', () => {
      expect(wrapper.find('.stub-rendered').exists()).toBe(true);
    });
  });
});
