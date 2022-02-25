import { assert } from 'chai';
import sinon from 'sinon';
import { createLocalVue, mount } from '@vue/test-utils';
import DtTooltip from './tooltip.vue';
import { DtButton } from '../button';
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTIONS,
} from './tooltip_constants';
import { flushPromises } from '@/common/utils';

// RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
// Need to mock them to avoid error
global.requestAnimationFrame = sinon.spy();
global.cancelAnimationFrame = sinon.spy();

// use 180ms as default duration for fade animation
const awaitLazyShowUpdated = () => new Promise(resolve => setTimeout(resolve, 180));

describe('Dialtone Vue Tooltip tests', function () {
  // Wrappers
  let wrapper;
  let tooltipContainer;
  let tooltip;
  let tooltipComponent;
  let anchor;
  let button;
  let defaultSlotMessage = '';
  let onMount;

  const restoreSpy = function () {
    onMount.restore();
  };

  const setOnMount = function () {
    onMount = sinon.spy(DtTooltip.methods, 'onMount');
  };

  const getValueUpdateShow = () => {
    const values = tooltipComponent.emitted()['update:show'];
    if (values) {
      const lastIndex = values.length - 1;

      return values[lastIndex][0];
    }
  };

  // Helpers
  const _setWrappers = () => {
    tooltipContainer = wrapper.find('[data-qa="dt-tooltip-container"]');
    tooltip = wrapper.find('[data-qa="dt-tooltip"]');
    anchor = wrapper.find('[data-qa="dt-tooltip-anchor"]');
    button = wrapper.find('[data-qa="dt-button"]');
    tooltipComponent = wrapper.findComponent({ name: 'Tooltip' });
  };

  const tooltipWrapper = {
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        syncShow: this.show,
      };
    },
    watch: {
      show (show) {
        this.syncShow = show;
      },
    },
    render (h) {
      const self = this;
      return h('div', [
        h(
          DtTooltip, {
            props: {
              ...self.$attrs,
              show: self.syncShow,
            },
            on: {
              'update:show' (show) {
                self.syncShow = show;
              },
            },
          },
          [h(DtButton, { slot: 'anchor' }, 'Anchor Slot'), defaultSlotMessage],
        ),
      ]);
    },
  };

  const _mountWrapper = () => {
    wrapper = mount(tooltipWrapper, {
      localVue: createLocalVue(),
      stubs: {
        transition: false,
      },
    });
    _setWrappers();
  };

  before(function () {
    this.localVue = createLocalVue();
  });

  const focus = async () => {
    await button.trigger('focus');
    await flushPromises();
  };

  const escape = () => {
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(keyboardEvent);
  };

  const mouseover = async () => {
    await button.trigger('mouseover');
    await flushPromises();
  };

  describe('Presentation Tests', function () {
    // Setup
    _mountWrapper();

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    it('should render the container', function () { assert.isTrue(tooltipContainer.exists()); });
    it('should render the tooltip', function () { assert.isTrue(tooltip.exists()); });
    it('should set default classes', function () {
      assert.isTrue(tooltip.classes('d-tooltip__arrow-tippy--top'));
    });
  });

  describe('When a placement is provided', function () {
    TOOLTIP_DIRECTIONS.forEach(placement => describe(`When direction is ${placement}`, function () {
      beforeEach(async function () {
        await wrapper.setProps({ placement: placement });
      });

      it('should have correct arrow direction class', async function () {
        assert.isTrue(tooltip.classes(`d-tooltip__arrow-tippy--${placement}`));
      });
    }));
  });

  describe('Message provided via prop', function () {
    beforeEach(function () {
      _mountWrapper();
    });
    it('should render the message', async function () {
      await wrapper.setProps({ message: 'Message Prop', show: true });
      assert.strictEqual(tooltip.text(), 'Message Prop');
    });
  });

  describe('Message provided via slot', function () {
    beforeEach(async function () {
      defaultSlotMessage = 'Message Slot';
      _mountWrapper();
      await wrapper.setProps({ message: 'Message Prop', show: true });
    });
    afterEach(function () {
      defaultSlotMessage = '';
    });
    it('should render the message', async function () {
      assert.strictEqual(tooltip.text(), defaultSlotMessage);
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

  describe('Visibility props', function () {
    it('should has inverted class', async function () {
      await wrapper.setProps({ inverted: true });
      assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.inverted));
    });
  });

  describe('Interactivity Tests', function () {
    beforeEach(setOnMount);
    afterEach(restoreSpy);

    describe('When tooltip show prop was set', function () {
      beforeEach(async function () {
        _mountWrapper();
      });

      it('should show tooltip', async function () {
        await wrapper.setProps({ show: true });
        assert.isTrue(tooltip.attributes('aria-hidden') === 'false');
      });
    });

    describe('When tooltip show prop wasn\'t set', function () {
      beforeEach(async function () {
        _mountWrapper();
      });

      it('should hide tooltip', async function () {
        await wrapper.setProps({ show: false });
        await awaitLazyShowUpdated();
        assert.strictEqual(tooltip.text(), '');
      });
    });

    describe('When mouseover tooltip', function () {
      beforeEach(async function () {
        _mountWrapper();
        await wrapper.setProps({ trigger: 'mouseover' });
        await mouseover();
        await wrapper.vm.$nextTick();
      });

      it('should show tooltip', async function () {
        assert.isTrue(onMount.called);
      });
    });

    describe('When focus tooltip', function () {
      it('should show tooltip', async function () {
        _mountWrapper();
        await wrapper.setProps({ trigger: 'focus' });
        await focus();
        await wrapper.vm.$nextTick();
        assert.isTrue(onMount.called);
      });
    });

    describe('When trigger is focus and escape was pressed', function () {
      beforeEach(async function () {
        await wrapper.setProps({ trigger: 'focus' });
        await focus();
        await escape();
        await awaitLazyShowUpdated();
      });

      it('should hide tooltip', function () {
        assert.isFalse(getValueUpdateShow());
      });
    });

    describe('When trigger is mouseover and escape was pressed ', function () {
      beforeEach(async function () {
        await wrapper.setProps({ trigger: 'mouseover' });
        await mouseover();
        await escape();
        await awaitLazyShowUpdated();
      });

      it('should hide tooltip', async function () {
        assert.isFalse(getValueUpdateShow());
      });
    });
  });
  //
  describe('Accessibility Tests', function () {
    beforeEach(function () {
      setOnMount();
      _mountWrapper();
    });

    afterEach(restoreSpy);

    describe('When anchor has focus', function () {
      beforeEach(async function () {
        await focus();
        await wrapper.vm.$nextTick();
      });

      it('should show tooltip', async function () {
        assert.isTrue(onMount.called);
      });

      describe('When escape pressed', function () {
        beforeEach(async function () {
          await focus();
          await escape();
          await awaitLazyShowUpdated();
        });

        it('should hide tooltip', function () {
          assert.isFalse(getValueUpdateShow());
        });
      });
    });

    describe('When anchor has mouseover', function () {
      it('should show tooltip', async function () {
        await wrapper.setProps({ trigger: 'mouseover' });
        await mouseover();
        await wrapper.vm.$nextTick();

        assert.isTrue(onMount.called);
      });

      describe('When escape pressed', function () {
        beforeEach(async function () {
          await wrapper.setProps({ trigger: 'focus' });
          await focus();
          await escape();
          await awaitLazyShowUpdated();
        });

        it('should hide tooltip', function () {
          assert.isFalse(getValueUpdateShow());
        });
      });
    });
  });
});
