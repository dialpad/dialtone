import { assert } from 'chai';
import sinon from 'sinon';
import { mount } from '@vue/test-utils';
import DtTooltip from './tooltip.vue';
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTIONS,
} from './tooltip_constants';

describe('DtTooltip tests', function () {
  // Wrappers
  let wrapper;
  let tooltipContainer;
  let tooltip;
  let anchor;
  let onMount;

  const restoreSpy = function () {
    onMount.restore();
  };

  const setOnMount = function () {
    onMount = sinon.spy(DtTooltip.methods, 'onMount');
  };

  const _clearChildWrappers = () => {
    tooltipContainer = null;
    tooltip = null;
    anchor = null;
  };

  // Helpers
  const _setChildWrappers = () => {
    tooltipContainer = wrapper.find('[data-qa="dt-tooltip-container"]');
    tooltip = wrapper.findComponent({ ref: 'content' });
    anchor = wrapper.find('[data-qa="dt-tooltip-anchor"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtTooltip, {
      global: {
        stubs: {
          transition: false,
        },
      },
      slots: {
        default: 'Test message',
        anchor: `<template #anchor="attrs"><button data-qa="dt-button" v-bind="attrs">Hover me</button></template>`,
      },
    });
    _setChildWrappers();
  };

  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
  });

  beforeEach(async function () {
    _mountWrapper();
  });

  afterEach(async function () {
    // close to unmount tippy
    await wrapper.setProps({ show: false });
    wrapper.unmount();
    _clearChildWrappers();
  });

  after(function () {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', function () {
    describe('when tooltip is open', function () {
      beforeEach(async function () {
        await wrapper.setProps({ show: true });
        _setChildWrappers();
      });

      it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
      it('should render the container', function () { assert.isTrue(tooltipContainer.exists()); });
      it('should render the tooltip', function () { assert.isTrue(tooltip.exists()); });
      it('should render the anchor', function () { assert.strictEqual(anchor.text(), 'Hover me'); });
      it('should set default classes', function () {
        assert.isTrue(tooltip.classes('d-tooltip__arrow-tippy--top'));
      });
      it('should render the message', async function () {
        assert.strictEqual(tooltip.text(), 'Test message');
      });

      describe('When inverted is true', function () {
        beforeEach(async function () {
          await wrapper.setProps({ inverted: true });
          _setChildWrappers();
        });
        it('should have the inverted class set', function () {
          assert.isTrue(tooltip.classes(TOOLTIP_KIND_MODIFIERS.inverted));
        });
      });

      describe('When a placement is provided', function () {
        TOOLTIP_DIRECTIONS.forEach(placement => describe(`When direction is ${placement}`, function () {
          beforeEach(async function () {
            await wrapper.setProps({ placement });
          });

          it('should have correct arrow direction class', async function () {
            assert.isTrue(tooltip.classes(`d-tooltip__arrow-tippy--${placement}`));
          });
        }));
      });
    });
  });

  describe('Interactivity Tests', function () {
    beforeEach(setOnMount);
    afterEach(restoreSpy);

    describe('When show prop is true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ show: true });
      });

      it('should display tooltip', async function () {
        assert.isTrue(tooltip.isVisible());
      });
    });

    describe('When show prop is false', function () {
      beforeEach(async function () {
        await wrapper.setProps({ show: false });
      });

      it('should display tooltip', async function () {
        assert.isFalse(tooltip.isVisible());
      });
    });

    describe('When show prop is unset (default behaviour)', function () {
      beforeEach(async function () {
        await wrapper.setProps({ show: null });
        _setChildWrappers();
      });

      describe('When mouseenter tooltip', function () {
        beforeEach(async function () {
          await anchor.trigger('mouseenter');
        });

        it('should display tooltip', function () {
          assert.isTrue(tooltip.isVisible());
        });
      });

      // jsdom does not yet support :focus-visible, commenting this out for now...
      // describe('When focusin tooltip', function () {
      //   beforeEach(async function () {
      //     await anchor.trigger('focusin');
      //   });

      //   it('should display tooltip', function () {
      //     assert.isTrue(tooltip.isVisible());
      //   });

      //   describe('When escape is pressed', function () {
      //     beforeEach(async function () {
      //       await anchor.trigger('keydown', { key: 'Escape' });
      //     });

      //     it('should hide tooltip', function () {
      //       assert.isFalse(wrapper.vm.isShown);
      //     });
      //   });
      // });

      describe('When mouseleave tooltip', function () {
        beforeEach(async function () {
          await anchor.trigger('mouseleave');
        });

        it('should hide tooltip', function () {
          assert.isFalse(tooltip.isVisible());
        });
      });

      describe('When focusout tooltip', function () {
        beforeEach(async function () {
          await anchor.trigger('focusout');
        });

        it('should display tooltip', function () {
          assert.isFalse(tooltip.isVisible());
        });
      });
    });
  });
});
