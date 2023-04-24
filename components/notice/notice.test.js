import { createLocalVue, shallowMount } from '@vue/test-utils';

import DtNotice from './notice';

// Constants
const basePropsData = {
  title: 'Notice Title',
  closeButtonProps: { ariaLabel: 'close' },
};

const baseSlotsData = {
  default: 'default slot content',
  action: 'action slot content',
  icon: 'icon slot content',
};

describe('DtNotice tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  let wrapper;

  let rootElement;
  let actionChildStub;
  let contentChildStub;
  let iconChildStub;

  const _setWrappers = () => {
    wrapper = shallowMount(DtNotice, {
      propsData: basePropsData,
      slots: baseSlotsData,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    rootElement = wrapper.find('aside');
    actionChildStub = wrapper.find('dt-notice-action-stub');
    contentChildStub = wrapper.find('dt-notice-content-stub');
    iconChildStub = wrapper.find('dt-notice-icon-stub');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('action slot is passed down correctly', async () => {
        expect(actionChildStub.text()).toBe(baseSlotsData.action);
      });

      it('default slot is passed down correctly', async () => {
        expect(contentChildStub.text()).toBe(baseSlotsData.default);
      });

      it('icon slot is passed down correctly', async () => {
        expect(iconChildStub.text()).toBe(baseSlotsData.icon);
      });
    });

    describe('When important is false', () => {
      it('Has correct class', () => {
        expect(rootElement.classes('d-notice--important')).toBe(false);
      });
    });

    describe('When important is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ important: true });
      });

      it('Has correct class', async () => {
        expect(rootElement.classes('d-notice--important')).toBe(true);
      });
    });

    describe('When kind is not specified', () => {
      it('Does not add notice kind class', async () => {
        expect(rootElement.classes('d-notice--')).toBe(false);
      });
    });

    describe('When kind is set to error', () => {
      beforeEach(async () => {
        await wrapper.setProps({ kind: 'error' });
      });

      it('Has correct class', async () => {
        expect(rootElement.classes('d-notice--error')).toBe(true);
      });
    });

    describe('When closeButtonProps is passed', () => {
      it('Has correct class', async () => {
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
      beforeEach(async () => {
        await wrapper.setProps({ role: 'alert' });
      });

      it('Shows correct role', async () => {
        expect(contentChildStub.attributes('role')).toBe('alert');
      });
    });
  });
});
