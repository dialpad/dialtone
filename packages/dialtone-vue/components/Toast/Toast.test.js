import { mount } from '@vue/test-utils';
import DtToast from './Toast.vue';
import { TOAST_MIN_DURATION } from './ToastConstants';
import DtNoticeAction from '../Notice/NoticeAction.vue';
import DtNoticeContent from '../Notice/NoticeContent.vue';
import DtNoticeIcon from '../Notice/NoticeIcon.vue';

const baseProps = { headerText: '', open: true };
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

  describe('When only headerText is provided (no message, no default slot)', () => {
    beforeEach(() => {
      mockProps = { headerText: 'Copied to clipboard' };
      updateWrapper();
    });

    it('does not render an empty message paragraph', () => {
      expect(wrapper.find('[data-qa="notice-content-message"]').exists()).toBe(false);
    });

    it('still renders the title', () => {
      expect(wrapper.find('[data-qa="notice-content-title"]').text()).toBe('Copied to clipboard');
    });
  });

  describe('When a message is provided', () => {
    beforeEach(() => {
      mockProps = { headerText: 'Title', message: 'Real message' };
      updateWrapper();
    });

    it('renders the message paragraph with the message text', () => {
      expect(wrapper.find('[data-qa="notice-content-message"]').text()).toBe('Real message');
    });
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
          headerId: 'headerId prop content',
          contentId: 'contentId prop content',
          headerText: '',
          message: 'message prop content',
          showClose: false,
        };

        updateWrapper();
      });

      it('headerId prop is passed down correctly', () => {
        expect(contentChild.props('headerId')).toBe(mockProps.headerId);
      });

      it('contentId prop is passed down correctly', () => {
        expect(contentChild.props('contentId')).toBe(mockProps.contentId);
      });

      it('headerText prop is passed down correctly', () => {
        expect(contentChild.props('headerText')).toBe(mockProps.headerText);
      });

      it('message prop is passed down correctly', () => {
        expect(contentChild.find('[data-qa="notice-content-message"]').text()).toBe(mockProps.message);
      });

      it('showClose prop is passed down correctly', () => {
        expect(actionChild.props('showClose')).toBe(mockProps.showClose);
      });
    });

    describe('When kind is not specified', () => {
      it('should use the default kind', () => {
        expect(toast.classes('d-toast--base')).toBe(true);
      });
    });

    describe('When kind is set to critical', () => {
      it('has correct class', () => {
        mockProps = { kind: 'critical' };

        updateWrapper();

        expect(toast.classes('d-toast--critical')).toBe(true);
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

        mockProps = { open: true, duration: 6500 };

        updateWrapper();

        vi.runAllTimers();

        await wrapper.vm.$nextTick();

        toast = wrapper.find('[data-qa="dt-toast"]');

        expect(toast.exists()).toBe(false);

        vi.useRealTimers();
      });

      it('should close the toast with close method', async () => {
        expect(toast.exists()).toBe(true);

        await wrapper.setProps({ open: false });

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
});
