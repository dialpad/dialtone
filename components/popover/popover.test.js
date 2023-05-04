
import { createLocalVue, mount } from '@vue/test-utils';
import DtPopover from './popover.vue';
import SrOnlyCloseButton from '../../common/sr_only_close_button';
import {
  itBehavesLikeVisuallyHiddenCloseButtonExists,
  itBehavesLikeVisuallyHiddenCloseLabelIsNull,
} from '@/tests/shared_examples/sr_only_close_button';
import { cleanSpy, initializeSpy } from '@/tests/shared_examples/validation';

describe('DtPopover Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let popoverWindow;
  let anchor;
  let button;
  let mainContent;
  let headerContent;
  let footerContent;
  let closeButton;
  const defaultSrOnlyCloseButtonLabel = 'Close popover';
  const defaultSlotMessage = 'Message';

  const _clearChildWrappers = () => {
    popoverWindow = null;
    anchor = null;
    button = null;
    mainContent = null;
    headerContent = null;
    footerContent = null;
    closeButton = null;
  };

  // Helpers
  const _setChildWrappers = () => {
    popoverWindow = wrapper.findComponent({ ref: 'content' });
    anchor = wrapper.findComponent({ ref: 'anchor' });
    button = wrapper.find('[data-qa="dt-button"]');
    mainContent = wrapper.findComponent({ ref: 'popover__content' });
    headerContent = wrapper.findComponent({ ref: 'popover__header' });
    footerContent = wrapper.findComponent({ ref: 'popover__footer' });
    closeButton = wrapper.find('[data-qa="dt-popover-close"]');
  };

  const transitionStub = () => ({
    render: function (h) {
      return this.$options._renderChildren;
    },
  });

  const _mountWrapper = () => {
    wrapper = mount(DtPopover, {
      propsData: {
        id: 'popover-id',
        showCloseButton: true,
        initialFocusElement: 'first',
        visuallyHiddenCloseLabel: defaultSrOnlyCloseButtonLabel,
      },
      slots: {
        content: defaultSlotMessage,
        headerContent: 'Popover Title',
        footerContent: 'Popover Footer',
      },
      scopedSlots: {
        anchor: '<button data-qa="dt-button" v-bind="props.attrs">Click me</button>',
      },
      localVue: testContext.localVue,
      stubs: {
        // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
        transition: transitionStub(),
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    _mountWrapper();
  });

  afterEach(async () => {
    // close to unmount tippy
    await wrapper.setProps({ open: false });
    wrapper.destroy();
    _clearChildWrappers();
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
        _setChildWrappers();
      });
      it(
        'should render the component',
        () => { expect(wrapper.exists()).toBe(true); },
      );
      it(
        'should render the popover',
        () => { expect(popoverWindow.exists()).toBe(true); },
      );
      it('should render the main content', () => {
        expect(mainContent.text()).toBe(defaultSlotMessage);
      });
      it('should render the header content', () => {
        expect(headerContent.text()).toBe('Popover Title');
      });
      it('should render the footer content', () => {
        expect(footerContent.text()).toBe('Popover Footer');
      });
      it('should render the anchor slot', () => {
        expect(anchor.text()).toBe('Click me');
      });
      it('should not render the visually hidden close button', () => {
        itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper, false);
      });
      // these tests will not observe focus changes under any circumstances?? spent too many hours on this junk.
      // it('focus should be on the first focusable element in the dialog', async function () {
      //   // initialFocusElement set to 'first' by default for these tests.
      //   assert.strictEqual(document.activeElement.id, 'innerButton1');
      // });
    });

    // describe('When initialFocusElement is "dialog"', function () {
    //   beforeEach(async function () {
    //     await wrapper.setProps({ initialFocusElement: 'dialog' });
    //     _setChildWrappers();
    //   });

    //   describe('When Popover is opened', function () {
    //     beforeEach(async function () {
    //       await button.trigger('click');
    //       _setChildWrappers();
    //     });

    //     it('focus should be on the dialog itself', async function () {
    //       // assert.strictEqual(document.activeElement, popoverWindow.$el);
    //     });
    //   });
    // });

    // describe('When initialFocusElement is set to the innerButton2 HTMLElement', function () {
    //   let innerButton2;
    //   beforeEach(async function () {
    //     const innerButton2 = wrapper.find('#innerButton2');
    //     await wrapper.setProps({ initialFocusElement: innerButton2 });
    //     _setChildWrappers();
    //   });

    //   describe('When Popover is opened', function () {
    //     beforeEach(async function () {
    //       await button.trigger('click');
    //       _setChildWrappers();
    //     });

    //     it('the focus should be on innerButton2', async function () {
    //       assert.strictEqual(document.activeElement.id, innerButton2.id);
    //     });
    //   });
    // });

    describe('When initialFocusElement is none', () => {
      let consoleErrorSpy;
      beforeEach(async () => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockClear();
        await wrapper.setProps({ initialFocusElement: 'none' });
      });

      afterEach(() => {
        consoleErrorSpy = null;
        console.error.mockRestore();
      });

      it('should output error message', async () => {
        expect(consoleErrorSpy).toBeCalledWith('If the popover is modal you must set the ' +
        'initialFocusElement prop. Possible values: "dialog", "first", HTMLElement');
      });
    });

    describe('When visuallyHiddenClose is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ visuallyHiddenClose: true });
        await button.trigger('click');
        _setChildWrappers();
      });

      it('should contain a visually hidden close button', () => {
        itBehavesLikeVisuallyHiddenCloseButtonExists(wrapper);
      });

      describe('When visuallyHiddenCloseLabel is null', () => {
        beforeEach(async () => {
          initializeSpy();
          await wrapper.setProps({ visuallyHiddenCloseLabel: null });
        });

        afterEach(() => {
          cleanSpy();
        });

        itBehavesLikeVisuallyHiddenCloseLabelIsNull();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When open prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: true });
        _setChildWrappers();
      });

      it('popover content is displayed', () => {
        expect(popoverWindow.isVisible()).toBe(true);
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should not close the popover', () => {
          expect(popoverWindow.isVisible()).toBe(true);
        });
      });
    });

    describe('When open prop is false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
        _setChildWrappers();
      });

      it('popover content should not be displayed', async () => {
        expect(popoverWindow.isVisible()).toBe(false);
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should not open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(false);
        });
      });

      describe('When anchor is clicked but it\'s disabled', () => {
        beforeEach(async () => {
          button.element.disabled = 'disabled';
          await button.trigger('click');
          _setChildWrappers();
        });

        afterEach(() => {
          button.element.disabled = undefined;
        });

        it('should not open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(false);
        });
      });
    });

    describe('When openOnContext prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ openOnContext: true });
        _setChildWrappers();
      });

      it('popover content should not be displayed', async () => {
        expect(popoverWindow.isVisible()).toBe(false);
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should not open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(false);
        });
      });

      describe('When anchor is right-clicked', () => {
        beforeEach(async () => {
          await button.trigger('contextmenu');
          _setChildWrappers();
        });

        it('should open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(true);
        });
      });
    });

    describe('When open prop is unset (default behaviour)', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: null });
        _setChildWrappers();
      });

      describe('When anchor is clicked', () => {
        beforeEach(async () => {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should open the popover', () => {
          expect(popoverWindow.isVisible()).toBe(true);
        });

        describe('When a "dt-popover-close" event is emitted in the window object', () => {
          beforeEach(async () => {
            window.dispatchEvent(new window.Event('dt-popover-close'));
          });

          it('should close opened popover', async () => {
            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When esc is pressed', () => {
          beforeEach(async () => {
            await popoverWindow.trigger('keydown', { key: 'Escape' });
            _setChildWrappers();
          });

          it('should close the popover', () => {
            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When close button is activated', () => {
          beforeEach(async () => {
            await closeButton.trigger('click');
            _setChildWrappers();
          });

          it('should close the popover', () => {
            expect(popoverWindow.isVisible()).toBe(false);
          });
        });

        describe('When sr-only close button is enabled and activated', () => {
          beforeEach(async () => {
            await wrapper.setProps({ visuallyHiddenClose: true });
            _setChildWrappers();
            await wrapper.findComponent(SrOnlyCloseButton).trigger('click');
          });

          it('should close the popover', () => {
            expect(popoverWindow.isVisible()).toBe(false);
          });
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When popover is open', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: true });
        _setChildWrappers();
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
      it(
        'aria-labelledby should be set correctly on the content window',
        () => {
          expect(popoverWindow.attributes('aria-labelledby')).toBe(wrapper.vm.labelledBy);
        },
      );
    });

    describe('When popover is closed', () => {
      beforeEach(async () => {
        await wrapper.setProps({ open: false });
        _setChildWrappers();
      });

      it('should have correct aria attributes on the anchor', async () => {
        expect(button.attributes('aria-expanded')).toBe('false');
      });

      it(
        'should have correct aria attributes on the content window',
        async () => {
          expect(popoverWindow.attributes('aria-hidden')).toBe('true');
        },
      );
    });
  });
});
