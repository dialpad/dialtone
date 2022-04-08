import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtNotice from './notice';
import DtNoticeAction from '../notice/notice_action';
import DtNoticeContent from '../notice/notice_content';
import DtNoticeIcon from '../notice/notice_icon';

// Constants
const baseProps = {
  title: 'Notice Title',
  closeButtonProps: { ariaLabel: 'close' },
};

const baseSlotsData = {
  default: 'default slot content',
  action: 'action slot content',
  icon: 'icon slot content',
};

describe('DtNotice tests', function () {
  let wrapper;

  let rootElement;
  let actionChild;
  let contentChild;
  let iconChild;
  let message;

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
    message = wrapper.find('[data-qa="notice-content-message"]');
  };

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default content', function () {
      it('Should render notice component', function () {
        assert.isTrue(wrapper.exists());
      });

      it('action slot is passed down correctly', async function () {
        assert.strictEqual(actionChild.text(), baseSlotsData.action);
      });

      it('default slot is passed down correctly', async function () {
        assert.strictEqual(message.text(), baseSlotsData.default);
      });

      it('icon slot is passed down correctly', async function () {
        assert.strictEqual(iconChild.text(), baseSlotsData.icon);
      });
    });

    describe('When important is false', function () {
      it('Has correct class', function () {
        assert.strictEqual(rootElement.classes('d-notice--important'), false);
      });
    });

    describe('When important is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ important: true });
      });

      it('Has correct class', async function () {
        assert.strictEqual(rootElement.classes('d-notice--important'), true);
      });
    });

    describe('When kind is not specified', function () {
      it('Does not add notice kind class', async function () {
        assert.strictEqual(rootElement.classes('d-notice--'), false);
      });
    });

    describe('When kind is set to error', function () {
      beforeEach(async function () {
        await wrapper.setProps({ kind: 'error' });
      });

      it('Has correct class', async function () {
        assert.strictEqual(rootElement.classes('d-notice--error'), true);
      });
    });

    describe('When closeButtonProps is passed', function () {
      it('Has correct class', async function () {
        assert.deepEqual(actionChild.vm.closeButtonProps, { ariaLabel: 'close' });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When rendered with default content', function () {
      it('Shows correct role', function () {
        assert.strictEqual(contentChild.attributes('role'), 'status');
      });
    });

    describe('When role is alert', function () {
      beforeEach(async function () {
        await wrapper.setProps({ role: 'alert' });
      });

      it('Shows correct role', async function () {
        assert.strictEqual(contentChild.attributes('role'), 'alert');
      });
    });
  });
});
