import { mount } from '@vue/test-utils';

import DtNotice from './notice.vue';
import DtNoticeAction from '../notice/notice_action.vue';
import DtNoticeContent from '../notice/notice_content.vue';
import DtNoticeIcon from '../notice/notice_icon.vue';

const baseProps = {
  title: '',
};

const baseSlots = {
  default: 'default slot content',
  action: 'action slot content',
  icon: 'icon slot content',
};

let mockProps = {};
let mockSlots = {};

describe('DtNotice tests', () => {
  let wrapper;
  let rootElement;
  let actionChild;
  let contentChild;
  let iconChild;

  const updateWrapper = () => {
    wrapper = mount(DtNotice, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    rootElement = wrapper.find('aside');
    actionChild = wrapper.findComponent(DtNoticeAction);
    contentChild = wrapper.findComponent(DtNoticeContent);
    iconChild = wrapper.findComponent(DtNoticeIcon);
  };

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
        expect(actionChild.text()).toBe(baseSlots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChild.text()).toBe(baseSlots.default);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChild.text()).toBe(baseSlots.icon);
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

    describe('When kind is set to critical', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ kind: 'critical' });

        expect(rootElement.classes('d-notice--critical')).toBe(true);
      });
    });

    describe('When kind is set to positive', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ kind: 'positive' });

        expect(rootElement.classes('d-notice--positive')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      it('Shows correct role', () => {
        expect(contentChild.attributes('role')).toBe('status');
      });
    });

    describe('When role is alert', () => {
      it('Shows correct role', async () => {
        await wrapper.setProps({ role: 'alert' });

        expect(contentChild.attributes('role')).toBe('alert');
      });
    });
  });
});
