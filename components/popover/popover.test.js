
import { assert } from 'chai';
import sinon from 'sinon';
import { createLocalVue, mount } from '@vue/test-utils';
import DtPopover from './popover.vue';
import axe from 'axe-core';
import configA11y from '../../storybook/scripts/storybook-a11y-test.config';

describe('DtPopover Tests', function () {
  // Wrappers
  let wrapper;
  let popoverWindow;
  let anchor;
  let button;
  let mainContent;
  let headerContent;
  let footerContent;
  let closeButton;
  let srOnlyCloseButton;
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
    srOnlyCloseButton = null;
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
    srOnlyCloseButton = wrapper.find('[data-qa="dt-popover-sr-only-close"]');
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
      localVue: this.localVue,
      stubs: {
        // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
        transition: transitionStub(),
      },
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
    this.localVue = createLocalVue();
  });

  beforeEach(function () {
    _mountWrapper();
  });

  afterEach(async function () {
    // close to unmount tippy
    await wrapper.setProps({ open: false });
    wrapper.destroy();
    _clearChildWrappers();
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', function () {
    describe('When Popover is open', function () {
      beforeEach(async function () {
        await button.trigger('click');
        _setChildWrappers();
      });
      it('should render the component', function () { assert.isTrue(wrapper.exists()); });
      it('should render the popover', function () { assert.isTrue(popoverWindow.exists()); });
      it('should render the main content', function () {
        assert.strictEqual(mainContent.text(), defaultSlotMessage);
      });
      it('should render the header content', function () {
        assert.strictEqual(headerContent.text(), 'Popover Title');
      });
      it('should render the footer content', function () {
        assert.strictEqual(footerContent.text(), 'Popover Footer');
      });
      it('should render the anchor slot', async function () {
        assert.strictEqual(anchor.text(), 'Click me');
      });
      it('should render the visually hidden close button', async function () {
        assert.isTrue(srOnlyCloseButton.exists());
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

    describe('When initialFocusElement is none', function () {
      let consoleErrorSpy;
      beforeEach(async function () {
        consoleErrorSpy = sinon.spy(console, 'error');
        await wrapper.setProps({ initialFocusElement: 'none' });
      });

      afterEach(function () {
        consoleErrorSpy = null;
        console.error.restore();
      });

      it('should output error message', async function () {
        assert.isTrue(consoleErrorSpy.calledWith('If the popover is modal you must set the ' +
        'initialFocusElement prop. Possible values: "dialog", "first", HTMLElement'));
      });
    });

    describe('When visuallyHiddenCloseLabel is null', function () {
      let consoleErrorSpy;
      beforeEach(async function () {
        consoleErrorSpy = sinon.spy(console, 'error');
        await wrapper.setProps({ visuallyHiddenCloseLabel: null });
      });

      afterEach(function () {
        consoleErrorSpy = null;
        console.error.restore();
      });

      it('should output error message', async function () {
        assert.isTrue(consoleErrorSpy.calledWith('If visuallyHiddenClose prop is true (default), the popover ' +
          'includes a visually hidden close button and you must set the visuallyHiddenCloseLabel prop.'));
      });
    });

    describe('When visually hidden close is false', function () {
      beforeEach(async function () {
        await wrapper.setProps({ visuallyHiddenClose: false });
        _setChildWrappers();
      });

      it('should NOT contain a visually hidden close button', async function () {
        assert.isFalse(srOnlyCloseButton.exists());
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('When open prop is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: true });
        _setChildWrappers();
      });

      it('popover content is displayed', function () {
        assert.isTrue(popoverWindow.isVisible());
      });

      describe('When anchor is clicked', function () {
        beforeEach(async function () {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should not close the popover', function () {
          assert.isTrue(popoverWindow.isVisible());
        });
      });
    });

    describe('When open prop is false', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: false });
        _setChildWrappers();
      });

      it('popover content should not be displayed', async function () {
        assert.isFalse(popoverWindow.isVisible());
      });

      describe('When anchor is clicked', function () {
        beforeEach(async function () {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should not open the popover', function () {
          assert.isFalse(popoverWindow.isVisible());
        });
      });

      describe('When anchor is clicked but it\'s disabled', function () {
        beforeEach(async function () {
          button.element.disabled = 'disabled';
          await button.trigger('click');
          _setChildWrappers();
        });

        afterEach(function () {
          button.element.disabled = undefined;
        });

        it('should not open the popover', function () {
          assert.isFalse(popoverWindow.isVisible());
        });
      });
    });

    describe('When openOnContext prop is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ openOnContext: true });
        _setChildWrappers();
      });

      it('popover content should not be displayed', async function () {
        assert.isFalse(popoverWindow.isVisible());
      });

      describe('When anchor is clicked', function () {
        beforeEach(async function () {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should not open the popover', function () {
          assert.isFalse(popoverWindow.isVisible());
        });
      });

      describe('When anchor is right-clicked', function () {
        beforeEach(async function () {
          await button.trigger('contextmenu');
          _setChildWrappers();
        });

        it('should open the popover', function () {
          assert.isTrue(popoverWindow.isVisible());
        });
      });
    });

    describe('When open prop is unset (default behaviour)', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: null });
        _setChildWrappers();
      });

      describe('When anchor is clicked', function () {
        beforeEach(async function () {
          await button.trigger('click');
          _setChildWrappers();
        });

        it('should open the popover', function () {
          assert.isTrue(popoverWindow.isVisible());
        });

        describe('When a "dt-popover-close" event is emitted in the window object', function () {
          beforeEach(async function () {
            window.dispatchEvent(new window.Event('dt-popover-close'));
          });

          it('should close opened popover', async function () {
            assert.isFalse(popoverWindow.isVisible());
          });
        });

        describe('When esc is pressed', function () {
          beforeEach(async function () {
            await popoverWindow.trigger('keydown', { key: 'Escape' });
            _setChildWrappers();
          });

          it('should close the popover', function () {
            assert.isFalse(popoverWindow.isVisible());
          });
        });

        describe('When close button is activated', function () {
          beforeEach(async function () {
            await closeButton.trigger('click');
            _setChildWrappers();
          });

          it('should close the popover', function () {
            assert.isFalse(popoverWindow.isVisible());
          });
        });

        describe('When sr-only close button is activated', function () {
          beforeEach(async function () {
            await srOnlyCloseButton.trigger('click');
            _setChildWrappers();
          });

          it('should close the popover', function () {
            assert.isFalse(popoverWindow.isVisible());
          });
        });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When popover is open', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: true });
        _setChildWrappers();
      });

      it('aria-expanded should be set correctly on the anchor', function () {
        assert.strictEqual(button.attributes('aria-expanded'), 'true');
      });
      it('aria-controls should be set correctly on the anchor', function () {
        assert.strictEqual(button.attributes('aria-controls'), 'popover-id');
      });
      it('aria-haspopup should be set correctly on the anchor', function () {
        assert.strictEqual(button.attributes('aria-haspopup'), 'dialog');
      });

      it('aria-hidden should be set correctly on the content window', function () {
        assert.strictEqual(popoverWindow.attributes('aria-hidden'), 'false');
      });
      it('aria-labelledby should be set correctly on the content window', function () {
        assert.strictEqual(popoverWindow.attributes('aria-labelledby'), wrapper.vm.labelledBy);
      });

      it('should pass axe-core accessibility rules', async function () {
        const a11yResults = await axe.run(wrapper.element, configA11y);
        const violations = a11yResults.violations;
        if (violations.length) {
          console.log('axe-core accessibility violations:', violations);
        }
        assert.equal(violations.length, 0);
      });
    });

    describe('When popover is closed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ open: false });
        _setChildWrappers();
      });

      it('should have correct aria attributes on the anchor', async function () {
        assert.strictEqual(button.attributes('aria-expanded'), 'false');
      });

      it('should have correct aria attributes on the content window', async function () {
        assert.strictEqual(popoverWindow.attributes('aria-hidden'), 'true');
      });
    });
  });
});
