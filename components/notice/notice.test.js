import { mount } from '@vue/test-utils';
import DtNotice from './notice';
import DtNoticeAction from '../notice/notice_action';
import DtNoticeContent from '../notice/notice_content';
import DtNoticeIcon from '../notice/notice_icon';

// Constants
const baseProps = {
  title: '',
  closeButtonProps: { ariaLabel: 'close' },
};

const baseSlotsData = {
  default: 'default slot content',
  action: 'action slot content',
  icon: 'icon slot content',
};

describe('DtNotice tests', () => {
  let wrapper;

  let rootElement;
  let actionChild;
  let contentChild;
  let iconChild;

  const _setWrappers = () => {
    wrapper = mount(DtNotice, {
      props: baseProps,
      slots: baseSlotsData,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    rootElement = wrapper.find('aside');
    actionChild = wrapper.findComponent(DtNoticeAction);
    contentChild = wrapper.findComponent(DtNoticeContent);
    iconChild = wrapper.findComponent(DtNoticeIcon);
  };

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('Should render notice component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('action slot is passed down correctly', async () => {
        expect(actionChild.text()).toBe(baseSlotsData.action);
      });

      it('default slot is passed down correctly', async () => {
        expect(contentChild.text()).toBe(baseSlotsData.default);
      });

      it('icon slot is passed down correctly', async () => {
        expect(iconChild.text()).toBe(baseSlotsData.icon);
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
        expect(actionChild.props().closeButtonProps).toEqual({ ariaLabel: 'close' });
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
      beforeEach(async () => {
        await wrapper.setProps({ role: 'alert' });
      });

      it('Shows correct role', async () => {
        expect(contentChild.attributes('role')).toBe('alert');
      });
    });
  });
});
