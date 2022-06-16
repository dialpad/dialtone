import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtToast from './toast.vue';
import DtNoticeAction from '../notice/notice_action';
import DtNoticeContent from '../notice/notice_content';
import DtNoticeIcon from '../notice/notice_icon';
import {
  itBehavesLikeDoesNotHaveClass,
  itBehavesLikeHasCorrectClass,
} from '../../tests/shared_examples/classes';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../tests/shared_examples/validation';
import { useFakeTimers } from 'sinon';
import {
  itBehavesLikePassesChildProp,
} from '../../tests/shared_examples/extendability';
import { TOAST_MIN_DURATION } from './toast_constants';

// Constants
const baseProps = {};
const baseSlotsData = {};

describe('DtToast Tests', function () {
  // Wrappers
  let wrapper;
  let toast;
  let actionChild;
  let contentChild;
  let iconChild;
  let message;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    toast = wrapper.find('[data-qa="dt-toast"]');
    actionChild = wrapper.findComponent(DtNoticeAction);
    contentChild = wrapper.findComponent(DtNoticeContent);
    iconChild = wrapper.findComponent(DtNoticeIcon);
    message = wrapper.find('[data-qa="notice-content-message"]');
  };
  let clock;

  const _setWrappers = () => {
    wrapper = mount(DtToast, {
      props,
      attrs,
      slots,
    });
  };

  const _showToast = async () => {
    await wrapper.setProps({ show: true });
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  };

  // Teardown
  afterEach(function () {
    props = { ...baseProps };
    attrs = {};
    slots = { ...baseSlotsData };
  });

  describe('Presentation Tests', function () {
    describe('When the toast renders', function () {
      // Test Setup
      beforeEach(async function () {
        _setWrappers();
        await _showToast();
      });

      it('should exist', function () { assert.exists(wrapper); });
      it('should render the toast', function () { assert.isTrue(toast.exists()); });
    });

    describe('When the toast renders with slots', function () {
      // Test Setup
      beforeEach(async function () {
        slots = {
          ...baseSlotsData,
          default: 'default slot content',
          action: 'action slot content',
          icon: 'icon slot content',
        };
        _setWrappers();
        await _showToast();
      });

      it('action slot is passed down correctly', function () {
        assert.strictEqual(actionChild.text(), slots.action);
      });

      it('default slot is passed down correctly', function () {
        assert.strictEqual(contentChild.text(), slots.default);
      });

      it('icon slot is passed down correctly', function () {
        assert.strictEqual(iconChild.text(), slots.icon);
      });
    });

    describe('When the toast renders with props', function () {
      // Test Setup
      beforeEach(async function () {
        props = {
          ...baseProps,
          titleId: 'titleId prop content',
          contentId: 'contentId prop content',
          title: 'title prop content',
          message: 'message prop content',
          hideClose: true,
        };
        _setWrappers();
        await _showToast();
      });

      it('titleId prop is passed down correctly', function () {
        itBehavesLikePassesChildProp(contentChild, 'titleId', props.titleId);
      });

      it('contentId prop is passed down correctly', function () {
        itBehavesLikePassesChildProp(contentChild, 'contentId', props.contentId);
      });

      it('title prop is passed down correctly', function () {
        itBehavesLikePassesChildProp(contentChild, 'title', props.title);
      });

      it('message prop is passed down correctly', function () {
        assert.strictEqual(message.text(), props.message);
      });

      it('hideClose prop is passed down correctly', function () {
        itBehavesLikePassesChildProp(actionChild, 'hideClose', props.hideClose);
      });
    });

    describe('When kind is not specified', function () {
      // Test Setup
      beforeEach(async function () {
        _setWrappers();
        await _showToast();
      });

      it('should use the default kind', function () {
        itBehavesLikeHasCorrectClass(toast, 'd-toast--base');
      });
    });

    describe('When kind is set to error', function () {
      // Test Setup
      beforeEach(async function () {
        props = { ...baseProps, kind: 'error' };
        _setWrappers();
        await _showToast();
      });

      it('has correct class', function () {
        itBehavesLikeHasCorrectClass(toast, 'd-toast--error');
      });
    });

    describe('When important is not provided', function () {
      // Test Setup
      beforeEach(async function () {
        _setWrappers();
        await _showToast();
      });

      it('doesnt have important class', function () {
        itBehavesLikeDoesNotHaveClass(toast, 'd-toast--important');
      });
    });

    describe('When important is true', function () {
      // Test Setup
      beforeEach(async function () {
        props = { ...baseProps, important: true };
        _setWrappers();
        await _showToast();
      });

      it('has correct class', function () {
        itBehavesLikeHasCorrectClass(toast, 'd-toast--important');
      });
    });

    describe('When duration is not provided', function () {
      // Test Environment
      const duration = TOAST_MIN_DURATION;

      // Test Setup
      beforeEach(function () {
        _setWrappers();
        clock = useFakeTimers(global);
      });

      afterEach(function () {
        clock.restore();
      });

      it('should show the toast', async function () {
        await _showToast();

        assert.isTrue(toast.exists());

        clock.tick(duration);
        await wrapper.vm.$nextTick();
        _setChildWrappers();

        assert.isTrue(toast.exists());
      });
    });

    describe('When duration is provided', function () {
      // Test Environment
      const duration = 6500;

      // Test Setup
      beforeEach(function () {
        props = { ...baseProps, duration };
        _setWrappers();
        clock = useFakeTimers(global);
      });

      afterEach(function () {
        clock.restore();
      });

      it('should close the toast after duration time is finished', async function () {
        await _showToast();

        assert.isTrue(toast.exists());

        clock.tick(duration + 1);
        await wrapper.vm.$nextTick();
        _setChildWrappers();

        assert.isFalse(toast.exists());
      });

      it('should close the toast with close method', async function () {
        await _showToast();

        assert.isTrue(toast.exists());

        await wrapper.setProps({ show: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();

        assert.isFalse(toast.exists());
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When rendered with default content', function () {
      // Test Environment
      const role = DtToast.props.role.default;

      // Test Setup
      beforeEach(async function () {
        _setWrappers();
        await _showToast();
      });

      it('shows correct default role', function () {
        assert.strictEqual(contentChild.attributes('role'), role);
      });

      it('should have aria-hidden set to false when toast is shown', function () {
        assert.strictEqual(toast.attributes('aria-hidden'), 'false');
      });
    });

    describe('When role is alert', function () {
      // Test Setup
      beforeEach(async function () {
        props = { ...baseProps, role: 'alert' };
        _setWrappers();
        await _showToast();
      });

      it('shows correct role', function () {
        assert.strictEqual(contentChild.attributes('role'), 'alert');
      });
    });
  });

  describe('Validation Tests', function () {
    // Test Setup
    beforeEach(function () {
      _setWrappers();
    });

    describe('Role Validator', function () {
      // Test Environment
      const prop = DtToast.props.role;

      describe('When provided role is in TOAST_ROLES', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided role is not in TOAST_ROLES', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_ROLE`);
      });
    });

    describe('Kind Validator', function () {
      // Test Environment
      const prop = DtToast.props.kind;

      describe('When provided kind is in NOTICE_KINDS', function () {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided kind is not in NOTICE_KINDS', function () {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_KIND`);
      });
    });

    describe('Duration Validator', function () {
      // Test Environment
      const prop = DtToast.props.duration;
      const duration = TOAST_MIN_DURATION;

      describe('When provided duration is a valid duration', function () {
        itBehavesLikePassesCustomPropValidation(prop, duration);
      });

      describe('When provided duration is not a valid duration', function () {
        itBehavesLikeFailsCustomPropValidation(prop, duration - 1);
      });
    });
  });

  describe('Extendability Tests', function () {
    // Test Environment
    let element;
    let propName;
    const propValue = {
      ariaLabel: 'close',
    };

    // Helpers
    const _setupChildPropsTest = async (childPropName) => {
      props[childPropName] = propValue;
      _setWrappers();
      await _showToast();
    };

    // Shared Examples
    const itBehavesLikePassesChildPropLocal = () => {
      it('should pass down provided child prop', function () {
        assert.deepEqual(element.props(propName), propValue, 'has passed down child prop');
      });
    };

    describe('When close button child props are provided', function () {
      beforeEach(async function () {
        propName = 'closeButtonProps';
        await _setupChildPropsTest(propName);
        element = actionChild;
      });
      itBehavesLikePassesChildPropLocal();
    });
  });
});
