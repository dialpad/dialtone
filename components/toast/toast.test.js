import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtToast from './toast.vue';
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
const basePropsData = {};
const baseSlotsData = {};

describe('DtToast Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let toast;
  let actionChildStub;
  let contentChildStub;
  let iconChildStub;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    toast = wrapper.find('[data-qa="dt-toast"]');
    actionChildStub = wrapper.find('dt-notice-action-stub');
    contentChildStub = wrapper.find('dt-notice-content-stub');
    iconChildStub = wrapper.find('dt-notice-icon-stub');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtToast, {
      propsData,
      attrs,
      slots,
      localVue: testContext.localVue,
    });
  };

  const _showToast = async () => {
    await wrapper.setProps({ show: true });
    await wrapper.vm.$nextTick();
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Teardown
  afterEach(() => {
    propsData = { ...basePropsData };
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
        expect(actionChildStub.text()).toBe(slots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChildStub.text()).toBe(slots.default);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChildStub.text()).toBe(slots.icon);
      });
    });

    describe('When the toast renders with props', () => {
      // Test Setup
      beforeEach(async () => {
        propsData = {
          ...basePropsData,
          titleId: 'titleId prop content',
          contentId: 'contentId prop content',
          title: 'title prop content',
          message: 'message prop content',
          hideClose: true,
        };
        _setWrappers();
        await _showToast();
      });

      it('titleId prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(contentChildStub, 'titleId', propsData.titleId);
      });

      it('contentId prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(contentChildStub, 'contentId', propsData.contentId);
      });

      it('title prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(contentChildStub, 'title', propsData.title);
      });

      it('message prop is passed down correctly', () => {
        expect(contentChildStub.text()).toBe(propsData.message);
      });

      it('hideClose prop is passed down correctly', () => {
        itBehavesLikePassesChildProp(actionChildStub, 'hideClose', propsData.hideClose);
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
        propsData = { ...basePropsData, kind: 'error' };
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
        propsData = { ...basePropsData, important: true };
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
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it('should show the toast', async () => {
        await _showToast();

        expect(toast.exists()).toBe(true);

        jest.runAllTimers();
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
        propsData = { ...basePropsData, duration };
        _setWrappers();
        jest.useFakeTimers();
      });

      afterEach(() => {
        jest.useRealTimers();
      });

      it(
        'should close the toast after duration time is finished',
        async () => {
          await _showToast();

          expect(toast.exists()).toBe(true);

          jest.runAllTimers();
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
        expect(contentChildStub.attributes('role')).toBe(role);
      });

      it('should have aria-hidden set to false when toast is shown', () => {
        expect(toast.attributes('aria-hidden')).toBe('false');
      });
    });

    describe('When role is alert', () => {
      // Test Setup
      beforeEach(async () => {
        propsData = { ...basePropsData, role: 'alert' };
        _setWrappers();
        await _showToast();
      });

      it('shows correct role', () => {
        expect(contentChildStub.attributes('role')).toBe('alert');
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
      propsData[childPropName] = propValue;
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
        element = actionChildStub;
      });
      itBehavesLikePassesChildPropLocal();
    });
  });
});
