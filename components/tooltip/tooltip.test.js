import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtTooltip from './tooltip.vue';
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTION_MODIFIERS,
} from './tooltip_constants';

describe('Dialtone Vue Tooltip tests', function () {
  // Wrappers
  let wrapper;
  let tooltipContainer;
  let tooltip;
  let anchor;
  let slots = { anchor: 'Anchor Slot' };

  // Helpers
  const _setWrappers = () => {
    tooltipContainer = wrapper.find('[data-qa="dt-tooltip-container"]');
    tooltip = wrapper.find('[data-qa="dt-tooltip"]');
    anchor = wrapper.find('[data-qa="dt-tooltip-anchor"]');
  };

  const _mountWrapper = () => {
    wrapper = shallowMount(DtTooltip, {
      localVue: createLocalVue(),
      slots,
    });
    _setWrappers();
  };

  const mouseover = () => wrapper.trigger('mouseover');
  const focus = () => wrapper.trigger('focus.capture');
  const blur = () => wrapper.trigger('blur.capture');
  const escape = () => wrapper.trigger('keyup.esc');

  describe('Presentation Tests', function () {
    // Setup
    _mountWrapper();

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    it('should render the container', function () { assert.isTrue(tooltipContainer.exists()); });
    it('should render the tooltip', function () { assert.isTrue(tooltip.exists()); });
    it('should be set default classes', function () {
      assert.isTrue(tooltip.classes('d-tooltip__arrow--bottom-center'));
      assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.hide));
      assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.hover));
    });
  });

  describe('When an arrow direction is provided', function () {
    TOOLTIP_DIRECTION_MODIFIERS.forEach(arrowDirection => describe(`When direction is ${arrowDirection}`, function () {
      beforeEach(async function () {
        await wrapper.setProps({ arrowDirection });
      });

      it('should have correct arrow direction class', async function () {
        assert.isTrue(tooltip.classes(`d-tooltip__arrow--${arrowDirection}`));
      });
    }));
  });

  describe('Message provided via prop', function () {
    it('should render the message', async function () {
      await wrapper.setProps({ message: 'Message Prop' });
      assert.strictEqual(tooltip.text(), 'Message Prop');
    });
  });

  describe('Message provided via slot', function () {
    before(function () {
      slots = { ...slots, default: 'Message Slot' };
      _mountWrapper();
    });
    it('should render the message', async function () {
      await wrapper.setProps({ message: 'Message Slot' });
      assert.strictEqual(tooltip.text(), 'Message Slot');
    });
  });

  describe('Anchor slot', function () {
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
    describe('Show state', function () {
      it('should be visible', async function () {
        await wrapper.setProps({ show: true, hover: false });
        wrapper.vm.$nextTick(() => {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'false');
          assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.show));
        });
      });
      it('should be closed', async function () {
        await wrapper.setProps({ show: false, hover: false });
        wrapper.vm.$nextTick(() => {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
          assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.hide));
        });
      });
      it('should be invisible', async function () {
        await wrapper.setProps({ show: true, hover: true });
        wrapper.vm.$nextTick(() => {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
          assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.hide));
        });
      });
    });
    describe('on mouseover', function () {
      before(async function () {
        await blur();
        await mouseover();
      });

      it('shows tooltip', async function () {
        assert.isTrue(tooltip.attributes('aria-hidden') === 'false');
        assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.show));
      });
    });

    describe('on focus', function () {
      before(async function () { await focus(); });

      it('shows tooltip', async function () {
        assert.isTrue(tooltip.attributes('aria-hidden') === 'false');
        assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.show));
      });
    });

    describe('on blur', function () {
      before(async function () { await blur(); });

      it('hide tooltip', async function () {
        assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
        assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.hide));
      });
    });

    describe('on escape', function () {
      before(async function () { await blur(); });

      describe('escape on focus', function () {
        before(async function () { await focus(); await escape(); });

        it('hide tooltip', async function () {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
          assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.hide));
        });
      });

      describe('escape on mouseover', function () {
        before(async function () { await mouseover(); await escape(); });

        it('hide tooltip', async function () {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
          assert.isTrue(tooltip.classes().includes(TOOLTIP_KIND_MODIFIERS.hide));
        });
      });
    });

    describe('When the tooltip is going to be hidden', function () {
      it('should emit a sync-able update event', async function () {
        // Test setup
        wrapper = shallowMount(DtTooltip, {
          localVue: createLocalVue(),
          propsData: {
            show: true,
            hover: false,
          },
          slots,
        });
        _setWrappers();

        const syncEvent = 'update:show';
        assert.isEmpty(wrapper.emitted());

        await escape();
        assert.equal(wrapper.emitted()[syncEvent].length, 1);
        assert.isFalse(wrapper.emitted()[syncEvent][0][0]);

        await blur();
        assert.equal(wrapper.emitted()[syncEvent].length, 2);
        assert.isFalse(wrapper.emitted()[syncEvent][1][0]);
      });
    });
  });

  describe('Accessibility Tests', function () {
    beforeEach(async function () {
      // Test setup
      wrapper = shallowMount(DtTooltip, {
        localVue: createLocalVue(),
        slots,
      });
      _setWrappers();

      await blur();
    });
    describe('When anchor has focus', function () {
      beforeEach(async function () {
        await focus();
      });

      it('has focus', async function () {
        assert.isTrue(tooltip.attributes('aria-hidden') === 'false');
      });

      describe('When anchor has blur', function () {
        beforeEach(async function () {
          await blur();
        });
        it('hide tooltip', function () {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
        });
      });

      describe('When escape pressed', function () {
        beforeEach(async function () {
          await escape();
        });
        it('hide tooltip', function () {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
        });
      });
    });

    describe('When anchor has mouseover', function () {
      beforeEach(async function () {
        await mouseover();
      });

      it('has mouseover', async function () {
        assert.isTrue(tooltip.attributes('aria-hidden') === 'false');
      });

      describe('When anchor has blur', function () {
        beforeEach(async function () {
          await blur();
        });
        it('hide tooltip', function () {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
        });
      });

      describe('When escape was pressed', function () {
        beforeEach(async function () {
          await escape();
        });
        it('hide tooltip', function () {
          assert.isTrue(tooltip.attributes('aria-hidden') === 'true');
        });
      });
    });
  });
});
