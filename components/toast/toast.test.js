import { mount } from '@vue/test-utils';
import DtToast from './toast.vue';
import DtNoticeAction from '../notice/notice_action.vue';
import DtNoticeContent from '../notice/notice_content.vue';
import DtNoticeIcon from '../notice/notice_icon.vue';
import {
  itBehavesLikeDoesNotHaveClass,
  itBehavesLikeHasCorrectClass,
} from '../../tests/shared_examples/classes';
import {
  itBehavesLikeFailsCustomPropValidation,
  itBehavesLikePassesCustomPropValidation,
} from '../../tests/shared_examples/validation';
import {
  itBehavesLikePassesChildProp,
} from '../../tests/shared_examples/extendability';
import { TOAST_MIN_DURATION } from './toast_constants';

// Constants
const baseProps = {
  title: '',
};
const baseSlotsData = {};

describe('DtToast Tests', () => {
  // Wrappers
  let wrapper;
  let toast;
  let actionChild;
  let contentChild;
  let iconChild;

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
  };

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

  describe('Presentation Tests', () => {
    describe('When the toast renders', () => {
      // Test Setup
      beforeEach(async () => {
        _setWrappers();
        await _showToast();
      });

      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });
      it('should render the toast', () => { expect(toast.exists()).toBe(true); });
    });

    describe('When the toast renders with slots', () => {
      // Test Setup
      beforeEach(async () => {
        slots = {
          ...baseSlotsData,
          default: 'default slot content',
          action: 'action slot content',
          icon: 'icon slot content',
        };
        _setWrappers();
        await _showToast();
      });

      it('action slot is passed down correctly', () => {
        expect(actionChild.text()).toBe(slots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChild.text()).toBe(slots.default);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChild.text()).toBe(slots.icon);
      });
    });

    describe('When the toast renders with props', () => {
      // Test Setup
      beforeEach(async () => {
        props = {
          ...baseProps,
          titleId: 'titleId prop content',
          contentId: 'contentId prop content',
          title: '',
          message: 'message prop content',
          hideClose: true,
        };
        _setWrappers();
        await _showToast();
      });

      it('titleId prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(contentChild, 'titleId', props.titleId);
      });

      it('contentId prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(contentChild, 'contentId', props.contentId);
      });

      it('title prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(contentChild, 'title', props.title);
      });

      it('message prop is passed down correctly', () => {
        expect(contentChild.text()).toBe(props.message);
      });

      it('hideClose prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(actionChild, 'hideClose', props.hideClose);
      });
    });

    describe('When kind is not specified', () => {
      // Test Setup
      beforeEach(async () => {
        _setWrappers();
        await _showToast();
      });

      it('should use the default kind', () => {
        itBehavesLikeHasCorrectClass(toast, 'd-toast--base');
      });
    });

    describe('When kind is set to error', () => {
      // Test Setup
      beforeEach(async () => {
        props = { ...baseProps, kind: 'error' };
        _setWrappers();
        await _showToast();
      });

      it('has correct class', () => {
        itBehavesLikeHasCorrectClass(toast, 'd-toast--error');
      });
    });

    describe('When important is not provided', () => {
      // Test Setup
      beforeEach(async () => {
        _setWrappers();
        await _showToast();
      });

      it('doesnt have important class', () => {
        itBehavesLikeDoesNotHaveClass(toast, 'd-toast--important');
      });
    });

    describe('When important is true', () => {
      // Test Setup
      beforeEach(async () => {
        props = { ...baseProps, important: true };
        _setWrappers();
        await _showToast();
      });

      it('has correct class', () => {
        itBehavesLikeHasCorrectClass(toast, 'd-toast--important');
      });
    });

    describe('When duration is not provided', () => {
      // Test Setup
      beforeEach(() => {
        _setWrappers();
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should show the toast', async () => {
        await _showToast();

        expect(toast.exists()).toBe(true);

        vi.runAllTimers();
        await wrapper.vm.$nextTick();
        _setChildWrappers();

        expect(toast.exists()).toBe(true);
      });
    });

    describe('When duration is provided', () => {
      // Test Environment
      const duration = 6500;

      // Test Setup
      beforeEach(() => {
        props = { ...baseProps, duration };
        _setWrappers();
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it(
        'should close the toast after duration time is finished',
        async () => {
          await _showToast();

          expect(toast.exists()).toBe(true);

          vi.runAllTimers();
          await wrapper.vm.$nextTick();
          _setChildWrappers();

          expect(toast.exists()).toBe(false);
        },
      );

      it('should close the toast with close method', async () => {
        await _showToast();

        expect(toast.exists()).toBe(true);

        await wrapper.setProps({ show: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();

        expect(toast.exists()).toBe(false);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      // Test Environment
      const role = DtToast.props.role.default;

      // Test Setup
      beforeEach(async () => {
        _setWrappers();
        await _showToast();
      });

      it('shows correct default role', () => {
        expect(contentChild.attributes('role')).toBe(role);
      });

      it('should have aria-hidden set to false when toast is shown', () => {
        expect(toast.attributes('aria-hidden')).toBe('false');
      });
    });

    describe('When role is alert', () => {
      // Test Setup
      beforeEach(async () => {
        props = { ...baseProps, role: 'alert' };
        _setWrappers();
        await _showToast();
      });

      it('shows correct role', () => {
        expect(contentChild.attributes('role')).toBe('alert');
      });
    });
  });

  describe('Validation Tests', () => {
    // Test Setup
    beforeEach(() => {
      _setWrappers();
    });

    describe('Role Validator', () => {
      // Test Environment
      const prop = DtToast.props.role;

      describe('When provided role is in TOAST_ROLES', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided role is not in TOAST_ROLES', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_ROLE`);
      });
    });

    describe('Kind Validator', () => {
      // Test Environment
      const prop = DtToast.props.kind;

      describe('When provided kind is in NOTICE_KINDS', () => {
        itBehavesLikePassesCustomPropValidation(prop, prop.default);
      });

      describe('When provided kind is not in NOTICE_KINDS', () => {
        itBehavesLikeFailsCustomPropValidation(prop, `INVALID_KIND`);
      });
    });

    describe('Duration Validator', () => {
      // Test Environment
      const prop = DtToast.props.duration;
      const duration = TOAST_MIN_DURATION;

      describe('When provided duration is a valid duration', () => {
        itBehavesLikePassesCustomPropValidation(prop, duration);
      });

      describe('When provided duration is not a valid duration', () => {
        itBehavesLikeFailsCustomPropValidation(prop, duration - 1);
      });
    });
  });

  describe('Extendability Tests', () => {
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
      it('should pass down provided child prop', () => {
        itBehavesLikePassesChildProp(element, propName, propValue);
      });
    };

    describe('When close button child props are provided', () => {
      beforeEach(async () => {
        propName = 'closeButtonProps';
        await _setupChildPropsTest(propName);
        element = actionChild;
      });
      itBehavesLikePassesChildPropLocal();
    });
  });
});
