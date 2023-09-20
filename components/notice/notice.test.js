import { createLocalVue, shallowMount } from '@vue/test-utils';

import DtNotice from './notice.vue';

const baseProps = {
  title: 'Notice Title',
  closeButtonProps: { ariaLabel: 'close' },
};

const baseSlots = {
  default: 'default slot content',
  action: 'action slot content',
  icon: 'icon slot content',
};

let mockProps = {};
let mockSlots = {};
const testContext = {};

describe('DtNotice tests', () => {
  let wrapper;
  let rootElement;
  let actionChildStub;
  let contentChildStub;
  let iconChildStub;

  const updateWrapper = () => {
    wrapper = shallowMount(DtNotice, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    rootElement = wrapper.find('aside');
    actionChildStub = wrapper.find('dt-notice-action-stub');
    contentChildStub = wrapper.find('dt-notice-content-stub');
    iconChildStub = wrapper.find('dt-notice-icon-stub');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('action slot is passed down correctly', () => {
        expect(actionChildStub.text()).toBe(baseSlots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChildStub.text()).toBe(baseSlots.default);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChildStub.text()).toBe(baseSlots.icon);
      });
    });

    describe('When important is false', () => {
      it('Has correct class', () => {
        expect(rootElement.classes('d-notice--important')).toBe(false);
      });
    });

    describe('When important is true', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ important: true });

        expect(rootElement.classes('d-notice--important')).toBe(true);
      });
    });

    describe('When kind is not specified', () => {
      it('Does not add notice kind class', () => {
        expect(rootElement.classes('d-notice--')).toBe(false);
      });
    });

    describe('When kind is set to error', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ kind: 'error' });

        expect(rootElement.classes('d-notice--error')).toBe(true);
      });
    });

    describe('When closeButtonProps is passed', () => {
      it('Has correct class', () => {
        expect(actionChildStub.props().closeButtonProps).toEqual({ ariaLabel: 'close' });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      it('Shows correct role', () => {
        expect(contentChildStub.attributes('role')).toBe('status');
      });
    });

    describe('When role is alert', () => {
      it('Shows correct role', async () => {
        await wrapper.setProps({ role: 'alert' });

        expect(contentChildStub.attributes('role')).toBe('alert');
      });
    });
  });
});
