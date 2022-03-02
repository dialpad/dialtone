import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtPopover from './popover.vue';

describe('Dialtone Vue Popover tests', function () {
  // Wrappers
  let wrapper;
  let popoverWindow;
  let anchor;
  let button;
  let mainContent;
  let headerContent;
  let footerContent;
  let closeButton;
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
    });
    _setChildWrappers();
  };

  before(function () {
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

  describe('Presentation Tests', function () {
    describe('When Popover is open', function () {
      beforeEach(async function () {
        await button.trigger('mouseup');
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
          await button.trigger('mouseup');
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
          await button.trigger('mouseup');
          _setChildWrappers();
        });

        it('should not open the popover', function () {
          assert.isFalse(popoverWindow.isVisible());
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
          await button.trigger('mouseup');
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
