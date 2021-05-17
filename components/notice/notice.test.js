import { assert } from 'chai';
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

describe('DtNotice tests', function () {
  let wrapper;

  let rootElement;
  let actionChildStub;
  let contentChildStub;
  let iconChildStub;

  const _setWrappers = () => {
    wrapper = shallowMount(DtNotice, {
      propsData: basePropsData,
      slots: baseSlotsData,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  const _setChildWrappers = () => {
    rootElement = wrapper.find('aside');
    actionChildStub = wrapper.find('dt-notice-action-stub');
    contentChildStub = wrapper.find('dt-notice-content-stub');
    iconChildStub = wrapper.find('dt-notice-icon-stub');
  };

  before(function () {
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    _setWrappers();
  });

  describe('Presentation Tests', function () {
    describe('When rendered with default content', function () {
      it('Should render notice component', function () {
        assert.isTrue(wrapper.exists());
      });

      it('action slot is passed down correctly', async function () {
        assert.strictEqual(actionChildStub.text(), baseSlotsData.action);
      });

      it('default slot is passed down correctly', async function () {
        assert.strictEqual(contentChildStub.text(), baseSlotsData.default);
      });

      it('icon slot is passed down correctly', async function () {
        assert.strictEqual(iconChildStub.text(), baseSlotsData.icon);
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
        assert.deepEqual(actionChildStub.props().closeButtonProps, { ariaLabel: 'close' });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When rendered with default content', function () {
      it('Shows correct role', function () {
        assert.strictEqual(rootElement.attributes().role, 'status');
      });
    });

    describe('When important is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ important: true });
      });
      it('Shows correct role', async function () {
        assert.strictEqual(rootElement.attributes().role, 'alert');
      });
    });
  });
});
