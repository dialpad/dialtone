import { assert } from 'chai';
import sinon from 'sinon';
import { createLocalVue, mount } from '@vue/test-utils';
import DtPopover from './popover.vue';
import { DtButton } from '../button';
import { flushPromises } from '../utils';
import {
  POPOVER_HORIZONTAL_ALIGNMENT,
  POPOVER_VERTICAL_ALIGNMENT,
} from './popover_constants';
// RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
// Need to mock them to avoid error
global.requestAnimationFrame = sinon.spy();
global.cancelAnimationFrame = sinon.spy();

// use 180ms as default duration for fade animation
const awaitLazyShowUpdated = () => new Promise(resolve => setTimeout(resolve, 180));

describe('Dialtone Vue Popover tests', function () {
  // Wrappers
  let wrapper;
  let popoverContainer;
  let popover;
  let popoverComponent;
  let anchor;
  let button;
  let content;
  let title;
  let actionButton;
  const defaultSlotMessage = 'Message';
  const getValueUpdateShow = () => {
    const values = popoverComponent.emitted()['update:open'];
    if (values) {
      const lastIndex = values.length - 1;

      return values[lastIndex][0];
    }
  };

  // Helpers
  const _setWrappers = () => {
    popoverContainer = wrapper.find('[data-qa="dt-popover-container"]');
    popover = wrapper.find('[data-qa="dt-popover"]');
    anchor = wrapper.find('[data-qa="dt-popover-anchor"]');
    content = wrapper.find('[data-qa="dt-popover-content"]');
    button = wrapper.find('[data-qa="dt-button"]');
    title = wrapper.find('[data-qa="dt-popover-title"]');
    actionButton = wrapper.find('[data-qa="dt-popover-actions"]');
    popoverComponent = wrapper.findComponent({ name: 'DtPopover' });
  };

  const popoverWrapper = {
    props: {
      open: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        syncOpen: this.open,
      };
    },
    watch: {
      open (open) {
        this.syncOpen = open;
      },
    },
    render (h) {
      const self = this;
      return h('div', [
        h(
          DtPopover, {
            props: {
              ...self.$attrs,
              open: self.syncOpen,
              closeButtonProps: {
                ariaLabel: 'Close Popover',
              },
              id: 'popover-id',
            },
            on: {
              'update:open' (open) {
                self.syncOpen = open;
              },
            },
            scopedSlots: {
              anchor: ({ attrs }) => {
                return h(DtButton, {
                  on: {
                    click: () => {
                      self.syncOpen = !self.syncOpen;
                    },
                  },
                  attrs,
                }, 'Anchor Slot');
              },
            },
          },
          [
            h('div', { slot: 'content' }, defaultSlotMessage),
            h('div', { slot: 'title' }, 'Popover Title'),
            h(DtButton, {
              slot: 'headerActions',
              attrs: { 'data-qa': 'dt-popover-actions' },
            }, 'Action Button'),
          ],
        ),
      ]);
    },
  };

  const _mountWrapper = (open = false) => {
    wrapper = mount(popoverWrapper, {
      localVue: createLocalVue(),
      stubs: {
        transition: false,
      },
      propsData: {
        open,
      },
    });
    _setWrappers();
  };

  before(function () {
    this.localVue = createLocalVue();
    _mountWrapper();
  });

  const escape = () => {
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(keyboardEvent);
  };

  describe('Presentation Tests', function () {
    // Setup
    beforeEach(async function () {
      await wrapper.setProps({
        open: true,
      });
    });

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    it('should render the container', function () { assert.isTrue(popoverContainer.exists()); });
    it('should render the popover', function () { assert.isTrue(popover.exists()); });
    it('should set default classes', function () {
      assert.exists(popover.classes('dt-popover__content--align-right'));
      assert.exists(popover.classes('dt-popover__content--valign-bottom'));
    });
  });

  describe('When an arrow direction is provided', function () {
    POPOVER_VERTICAL_ALIGNMENT.filter(v => v).forEach(verticalAlignment => {
      POPOVER_HORIZONTAL_ALIGNMENT.filter(v => v).forEach(horizontalAlignment =>
        describe(`When direction is ${verticalAlignment}-${horizontalAlignment}`, function () {
          beforeEach(async function () {
            await wrapper.setProps({
              fixedVerticalAlignment: verticalAlignment,
              fixedAlignment: horizontalAlignment,
            });
          });

          it('should have correct arrow direction class', async function () {
            assert.exists(popover.classes(`dt-popover__content--align-${horizontalAlignment}`));
            assert.exists(popover.classes(`dt-popover__content--valign-${verticalAlignment}`));
          });
        }));
    });
  });

  describe('Message provided via slot', function () {
    beforeEach(function () {
      _mountWrapper(true);
    });
    it('should render the message', function () {
      assert.strictEqual(content.text(), defaultSlotMessage);
    });
  });

  describe('Title slot', function () {
    beforeEach(async function () {
      _mountWrapper(true);
    });
    it('should render the title slot', function () {
      assert.strictEqual(title.text(), 'Popover Title');
    });
  });

  describe('Actions slot', function () {
    beforeEach(function () {
      _mountWrapper(true);
    });
    it('should render the action slot', function () {
      assert.strictEqual(actionButton.text(), 'Action Button');
    });
  });

  describe('Anchor slot', function () {
    beforeEach(function () {
      _mountWrapper();
    });
    it('should render the anchor slot', async function () {
      assert.strictEqual(anchor.text(), 'Anchor Slot');
    });
  });

  describe('Interactivity Tests', function () {
    describe('When popover show prop was set', function () {
      beforeEach(function () {
        _mountWrapper(true);
      });

      it('should show popover', function () {
        assert.strictEqual(popover.attributes('aria-hidden'), 'false');
      });
    });

    describe('When popover show prop wasn\'t set', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          open: false,
        });
        _mountWrapper();
      });

      it('should hide popover', async function () {
        assert.strictEqual(popover.attributes('aria-hidden'), 'true');
      });
    });

    describe('When trigger is mouseover and escape was pressed ', function () {
      beforeEach(async function () {
        _mountWrapper(true);
        await button.trigger('focus');
        await flushPromises();
        await escape();
        await awaitLazyShowUpdated();
      });

      it('should hide popover', async function () {
        assert.isFalse(getValueUpdateShow());
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('Correct aria-labels', function () {
      beforeEach(function () {
        _mountWrapper();
      });
      it('should have correct aria-labels on a anchor', async function () {
        assert.strictEqual(button.attributes('aria-controls'), 'popover-id');
        assert.strictEqual(button.attributes('aria-haspopup'), 'dialog');
      });

      it('should have correct aria-labels on a content', async function () {
        assert.strictEqual(popover.attributes('aria-labelledby'), popoverComponent.vm.labelledBy);
      });
    });
    describe('When popover open', function () {
      beforeEach(function () {
        _mountWrapper(true);
      });

      it('should have correct aria-labels on a anchor', async function () {
        assert.strictEqual(button.attributes('aria-expanded'), 'true');
      });

      it('should have correct aria-labels on a content', async function () {
        assert.strictEqual(popover.attributes('aria-hidden'), 'false');
      });
    });

    describe('When popover hide', function () {
      beforeEach(function () {
        _mountWrapper();
      });

      it('should have correct aria-labels on a anchor', async function () {
        assert.strictEqual(button.attributes('aria-expanded'), 'false');
      });

      it('should have correct aria-labels on a content', async function () {
        assert.strictEqual(popover.attributes('aria-hidden'), 'true');
      });
    });
  });
});
