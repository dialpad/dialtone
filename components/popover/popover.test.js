import { mount } from '@vue/test-utils';
import DtPopover from './popover.vue';
import SrOnlyCloseButton from '../../common/sr_only_close_button.vue';

const defaultSrOnlyCloseButtonLabel = 'Close popover';
const MOCK_DEFAULT_SLOT_MESSAGE = 'Message';
const MOCK_HEADER_CONTENT = 'Popover Title';
const MOCK_FOOTER_CONTENT = 'Popover Footer';

const baseProps = {
  id: 'popover-id',
  showCloseButton: true,
  initialFocusElement: 'first',
  visuallyHiddenCloseLabel: defaultSrOnlyCloseButtonLabel,
};
const baseSlots = {
  content: MOCK_DEFAULT_SLOT_MESSAGE,
  headerContent: MOCK_HEADER_CONTENT,
  footerContent: MOCK_FOOTER_CONTENT,
  anchor: '<template #anchor="{ attrs }">' +
                  '<button data-qa="dt-button" v-bind="attrs">Click me</button>' +
                '</template>',
};

let mockProps = {};
let mockSlots = {};

describe.skip('DtPopover Tests', () => {
  let wrapper;
  let popoverWindow;
  let anchor;
  let button;
  let mainContent;
  let headerContent;
  let footerContent;
  let closeButton;

  const updateWrapper = () => {
    wrapper = mount(DtPopover, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        stubs: {
          transition: false,
        },
      },
      attachTo: document.body,
    });

    popoverWindow = wrapper.findComponent({ ref: 'content' });
    anchor = wrapper.find('[data-qa="dt-popover-anchor"]');
    button = wrapper.find('[data-qa="dt-button"]');
    mainContent = popoverWindow.find('[data-qa="dt-popover-content"]');
    headerContent = wrapper.findComponent({ ref: 'popover__header' });
    footerContent = wrapper.findComponent({ ref: 'popover__footer' });
    closeButton = popoverWindow.find('[data-qa="dt-popover-close"]');
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    describe('When Popover is open', () => {
      beforeEach(async () => {
        await button.trigger('click');
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the popover', () => {
        expect(popoverWindow.exists()).toBe(true);
      });

      it('should render the main content', () => {
        mainContent = wrapper.findComponent({ ref: 'popover__content' });

        expect(mainContent.text()).toBe(MOCK_DEFAULT_SLOT_MESSAGE);
      });

      it('should render the header content', () => {
        headerContent = wrapper.findComponent({ ref: 'popover__header' });

        expect(headerContent.text()).toBe(MOCK_HEADER_CONTENT);
      });

      it('should render the footer content', () => {
        footerContent = wrapper.findComponent({ ref: 'popover__footer' });

        expect(footerContent.text()).toBe(MOCK_FOOTER_CONTENT);
      });

      it('should render the anchor slot', () => {
        expect(anchor.text()).toBe('Click me');
      });

      it('should not render the visually hidden close button', () => {
        const buttonExists = wrapper.findComponent(SrOnlyCloseButton).exists();

        expect(!buttonExists).toBe(true);
      });
    });

    // describe('When initialFocusElement is none', () => {
    //   it('should output error message', async () => {
    //     let consoleErrorSpy;
    //
    //     consoleErrorSpy = vi.spyOn(console, 'error').mockClear();
    //
    //     await wrapper.setProps({ initialFocusElement: 'none' });
    //
    //     expect(consoleErrorSpy).toBeCalledWith('If the popover is modal you must set the ' +
    //     'initialFocusElement prop. Possible values: "dialog", "first", HTMLElement');
    //
    //     consoleErrorSpy = null;
    //     console.error.mockRestore();
    //   });
    // });

    describe('When visuallyHiddenClose is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });

        await button.trigger('click');
      });

      it('should contain a visually hidden close button', () => {
        const buttonExists = wrapper.findComponent(SrOnlyCloseButton).exists();

        expect(buttonExists).toBe(true);
      });

      describe('When visuallyHiddenCloseLabel is null', () => {
        it('should raise a validation error', async () => {
          let consoleErrorSpy;

          consoleErrorSpy = vi.spyOn(console, 'error').mockClear();

          await wrapper.setProps({ visuallyHiddenCloseLabel: null });

          const message = `If visuallyHiddenClose prop is true, the component includes
           a visually hidden close button and you must set the visuallyHiddenCloseLabel prop.`;

          expect(consoleErrorSpy).toHaveBeenCalledWith(message);

          consoleErrorSpy = null;
          console.error.mockRestore();
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When open prop is true', () => {
      it('popover content is displayed', async () => {
        await wrapper.setProps({ open: true });

        expect(popoverWindow.isVisible()).toBe(true);
      });

      describe('When anchor is clicked', () => {
        it('should not close the popover', async () => {
          await button.trigger('click');

          expect(popoverWindow.isVisible()).toBe(true);
        });
      });
    });

    describe('When open prop is false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
      });

      it('popover content should not be displayed', async () => {
        expect(popoverWindow.isVisible()).toBe(false);
      });

      describe('When anchor is clicked', () => {
        it('should not open the popover', async () => {
          await button.trigger('click');

          expect(popoverWindow.isVisible()).toBe(false);
        });
      });

      describe('When anchor is clicked but it\'s disabled', () => {
        it('should not open the popover', async () => {
          button.element.disabled = 'disabled';
          await button.trigger('click');

          expect(popoverWindow.isVisible()).toBe(false);

          button.element.disabled = undefined;
        });
      });
    });

    describe('When openOnContext prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ openOnContext: true });
      });

      it('popover content should not be displayed', async () => {
        expect(popoverWindow.isVisible()).toBe(false);
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
        });

        it('should not open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(false);
        });
      });

      describe('When anchor is right-clicked', () => {
        it('should open the popover', async () => {
          await button.trigger('contextmenu');

          expect(popoverWindow.isVisible()).toBe(true);
        });
      });
    });

    describe('When open prop is unset (default behaviour)', () => {
      beforeEach(async () => {
        mockProps = { open: null };

        updateWrapper();
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
        });

        it('should open the popover', async () => {
          expect(popoverWindow.isVisible()).toBe(true);
        });

        describe('When a "dt-popover-close" event is emitted in the window object', () => {
          it('should close opened popover', async () => {
            await button.trigger('click');

            window.dispatchEvent(new window.Event('dt-popover-close'));

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When esc is pressed', () => {
          it('should close the popover', async () => {
            await popoverWindow.trigger('keydown', { key: 'Escape' });

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When close button is activated', () => {
          it('should close the popover', async () => {
            closeButton = wrapper.find('[data-qa="dt-popover-close"]');

            await closeButton.trigger('click');

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When sr-only close button is enabled and activated', () => {
          it('should close the popover', async () => {
            await wrapper.setProps({ visuallyHiddenClose: true });
            await wrapper.findComponent(SrOnlyCloseButton).trigger('click');

            expect(popoverWindow.isVisible()).toBe(false);
          });
        });
      });
    });
  });

  describe.skip('Accessibility Tests', () => {
    describe('When popover is open', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: true });
      });

      it('aria-expanded should be set correctly on the anchor', () => {
        expect(button.attributes('aria-expanded')).toBe('true');
      });

      it('aria-controls should be set correctly on the anchor', () => {
        expect(button.attributes('aria-controls')).toBe('popover-id');
      });

      it('aria-haspopup should be set correctly on the anchor', () => {
        expect(button.attributes('aria-haspopup')).toBe('dialog');
      });

      it('aria-hidden should be set correctly on the content window', () => {
        expect(popoverWindow.attributes('aria-hidden')).toBe('false');
      });

      it('aria-labelledby should be set correctly on the content window', () => {
        expect(popoverWindow.attributes('aria-labelledby')).toBe(wrapper.vm.labelledBy);
      });
    });

    describe('When popover is closed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
      });

      it('should have correct aria attributes on the anchor', async () => {
        expect(button.attributes('aria-expanded')).toBe('false');
      });

      it('should have correct aria attributes on the content window', async () => {
        expect(popoverWindow.attributes('aria-hidden')).toBe('true');
      });
    });
  });
});
