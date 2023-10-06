import { mount } from '@vue/test-utils';
import DtToast from './toast.vue';
import { TOAST_MIN_DURATION } from './toast_constants';
import DtNoticeAction from '../notice/notice_action.vue';
import DtNoticeContent from '../notice/notice_content.vue';
import DtNoticeIcon from '../notice/notice_icon.vue';

const baseProps = { title: '', show: true };
const baseSlots = {};

let mockProps = {};
let mockSlots = {};

describe('DtToast Tests', () => {
  let wrapper;
  let toast;
  let actionChild;
  let contentChild;
  let iconChild;

  const updateWrapper = () => {
    wrapper = mount(DtToast, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
    });

    toast = wrapper.find('[data-qa="dt-toast"]');
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
    describe('When the toast renders', () => {
      it('should exist', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should render the toast', () => {
        expect(toast.exists()).toBe(true);
      });
    });

    describe('When the toast renders with slots', () => {
      beforeEach(() => {
        mockSlots = {
          default: 'default slot content',
          action: 'action slot content',
          icon: 'icon slot content',
        };

        updateWrapper();
      });

      it('action slot is passed down correctly', () => {
        expect(actionChild.text()).toBe(mockSlots.action);
      });

      it('default slot is passed down correctly', () => {
        expect(contentChild.text()).toBe(mockSlots.default);
      });

      it('icon slot is passed down correctly', () => {
        expect(iconChild.text()).toBe(mockSlots.icon);
      });
    });

    describe('When the toast renders with props', () => {
      beforeEach(() => {
        mockProps = {
          titleId: 'titleId prop content',
          contentId: 'contentId prop content',
          title: '',
          message: 'message prop content',
          hideClose: true,
        };

        updateWrapper();
      });

      it('titleId prop is passed down correctly', () => {
        expect(contentChild.props('titleId')).toBe(mockProps.titleId);
      });

      it('contentId prop is passed down correctly', () => {
        expect(contentChild.props('contentId')).toBe(mockProps.contentId);
      });

      it('title prop is passed down correctly', () => {
        expect(contentChild.props('title')).toBe(mockProps.title);
      });

      it('message prop is passed down correctly', () => {
        expect(contentChild.text()).toBe(mockProps.message);
      });

      it('hideClose prop is passed down correctly', () => {
        expect(actionChild.props('hideClose')).toBe(mockProps.hideClose);
      });
    });

    describe('When kind is not specified', () => {
      it('should use the default kind', () => {
        expect(toast.classes('d-toast--base')).toBe(true);
      });
    });

    describe('When kind is set to error', () => {
      it('has correct class', () => {
        mockProps = { kind: 'error' };

        updateWrapper();

        expect(toast.classes('d-toast--error')).toBe(true);
      });
    });

    describe('When important is not provided', () => {
      it('doesnt have important class', () => {
        expect(toast.classes('d-toast--important')).toBe(false);
      });
    });

    describe('When important is true', () => {
      it('has correct class', () => {
        mockProps = { important: true };

        updateWrapper();

        expect(toast.classes('d-toast--important')).toBe(true);
      });
    });

    describe('When duration is not provided', () => {
      it('should show the toast', () => {
        expect(toast.exists()).toBe(true);
      });
    });

    describe('When duration is provided', () => {
      it('should close the toast after duration time is finished', async () => {
        vi.useFakeTimers();

        expect(toast.exists()).toBe(true);

        mockProps = { show: true, duration: 6500 };

        updateWrapper();

        vi.runAllTimers();

        await wrapper.vm.$nextTick();

        toast = wrapper.find('[data-qa="dt-toast"]');

        expect(toast.exists()).toBe(false);

        vi.useRealTimers();
      });

      it('should close the toast with close method', async () => {
        expect(toast.exists()).toBe(true);

        await wrapper.setProps({ show: false });

        toast = wrapper.find('[data-qa="dt-toast"]');

        expect(toast.exists()).toBe(false);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      const MOCK_ROLE = DtToast.props.role.default;

      it('shows correct default role', () => {
        expect(contentChild.attributes('role')).toBe(MOCK_ROLE);
      });

      it('should have aria-hidden set to false when toast is shown', () => {
        expect(toast.attributes('aria-hidden')).toBe('false');
      });
    });

    describe('When role is alert', () => {
      it('shows correct role', () => {
        mockProps = { role: 'alert' };

        updateWrapper();

        expect(contentChild.attributes('role')).toBe('alert');
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Role Validator', () => {
      const MOCK_PROP = DtToast.props.role;

      describe('When provided role is in TOAST_ROLES', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_PROP.default)).toBe(true);
        });
      });

      describe('When provided role is not in TOAST_ROLES', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator(`INVALID_ROLE`)).toBe(false);
        });
      });
    });

    describe('Kind Validator', () => {
      const MOCK_PROP = DtToast.props.kind;

      describe('When provided kind is in NOTICE_KINDS', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_PROP.default)).toBe(true);
        });
      });

      describe('When provided kind is not in NOTICE_KINDS', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator(`INVALID_KIND`)).toBe(false);
        });
      });
    });

    describe('Duration Validator', () => {
      const MOCK_PROP = DtToast.props.duration;
      const MOCK_DURATION = TOAST_MIN_DURATION;

      describe('When provided duration is a valid duration', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_DURATION)).toBe(true);
        });
      });

      describe('When provided duration is not a valid duration', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_DURATION - 1)).toBe(false);
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    let MOCK_ELEMENT;
    let MOCK_PROP_NAME;
    const MOCK_PROP_VALUE = {
      ariaLabel: 'close',
    };

    describe('When close button child props are provided', () => {
      it('should pass down provided child prop', () => {
        MOCK_PROP_NAME = 'closeButtonProps';

        mockProps = { closeButtonProps: MOCK_PROP_VALUE };

        updateWrapper();

        MOCK_ELEMENT = actionChild;

        expect(MOCK_ELEMENT.props(MOCK_PROP_NAME)).toStrictEqual(MOCK_PROP_VALUE);
      });
    });
  });
});
