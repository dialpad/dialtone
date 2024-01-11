import { mount } from '@vue/test-utils';
import DtHovercard from './hovercard.vue';

const MOCK_DEFAULT_SLOT_MESSAGE = 'Message';
const MOCK_HEADER_CONTENT = 'Hovercard Title';
const MOCK_FOOTER_CONTENT = 'Hovercard Footer';

const baseProps = { id: 'hovercard-1' };
const baseAttrs = {};
const baseSlots = {
  content: MOCK_DEFAULT_SLOT_MESSAGE,
  headerContent: MOCK_HEADER_CONTENT,
  footerContent: MOCK_FOOTER_CONTENT,
};

const baseScopedSlots = {
  anchor: '<template #anchor="{ attrs }">' +
          '<button data-qa="dt-button" v-bind="attrs">Hover me</button>' +
          '</template>',
};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtHovercard Tests', () => {
  let anchor;
  let hovercardWindow;
  let content;
  let button;
  let wrapper;

  const updateWrapper = () => {
    wrapper = mount(DtHovercard, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      scopedSlots: { ...baseScopedSlots },
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });

    hovercardWindow = wrapper.find('[data-qa="dt-hovercard"]');
    anchor = wrapper.find('[data-qa="dt-hovercard-anchor"]');
    content = wrapper.find('[data-qa="dt-popover-content"]');
    button = wrapper.find('[data-qa="dt-button"]');
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.runAllTimers();
    updateWrapper();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When mouseenter on anchor', () => {
      beforeEach(async () => {
        vi.useFakeTimers();
        await anchor.trigger('mouseenter');
        vi.runAllTimers();
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the hovercard content', () => {
        content = wrapper.find('[data-qa="dt-hovercard-content"]');

        expect(content.text()).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });

      it('should render the anchor slot', () => {
        expect(anchor.text()).toBe('Hover me');
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When mouse leave on anchor', () => {
      it('hovercard is not displayed', async () => {
        vi.useFakeTimers();
        await anchor.trigger('mouseenter');
        vi.runAllTimers();
        await anchor.trigger('mouseleave');
        vi.runAllTimers();
        content = wrapper.find('[data-qa="dt-hovercard-content"]');

        expect(content.isVisible()).toBe(false);
      });
    });

    describe('When mouse enter on hovercard', () => {
      it('should still display the hovercard', async () => {
        await anchor.trigger('mouseenter');
        await hovercardWindow.trigger('mouseenter');
        content = wrapper.find('[data-qa="dt-hovercard-content"]');

        expect(content.text()).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });
    });

    describe('When focusin on anchor', () => {
      it('hovercard is not displayed', async () => {
        await anchor.trigger('focusin');
        content = wrapper.find('[data-qa="dt-hovercard-content"]');

        expect(content.isVisible()).toBe(false);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When hovercard is open', () => {
      beforeEach(async () => {
        vi.useFakeTimers();
        await anchor.trigger('mouseenter');
      });

      it('shows correct role', () => {
        vi.runAllTimers();
        hovercardWindow = wrapper.find('[data-qa="dt-hovercard__dialog"]');
        expect(hovercardWindow.attributes('role')).toBe('dialog');
      });

      it('aria-controls should be set correctly on the anchor', () => {
        expect(button.attributes('aria-controls')).toBe('hovercard-1');
      });

      it('aria-haspopup should be set correctly on the anchor', () => {
        expect(button.attributes('aria-haspopup')).toBe('dialog');
      });
    });
  });
});
