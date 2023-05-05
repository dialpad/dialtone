import { createLocalVue, mount } from '@vue/test-utils';
import DtTooltip from './tooltip.vue';
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTIONS,
} from './tooltip_constants';

describe('DtTooltip tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let tooltipContainer;
  let tooltip;
  let anchor;
  let onMount;

  const restoreSpy = function () {
    onMount.mockRestore();
  };

  const setOnMount = function () {
    onMount = vi.spyOn(DtTooltip.methods, 'onMount').mockClear();
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
    anchor = wrapper.findComponent({ ref: 'anchor' });
  };

  const transitionStub = () => ({
    render: function (h) {
      return this.$options._renderChildren;
    },
  });

  const _mountWrapper = () => {
    wrapper = mount(DtTooltip, {
      stubs: {
        // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
        transition: transitionStub(),
      },
      propsData: {
        delay: false,
      },
      slots: {
        default: 'Test message',
      },
      scopedSlots: {
        anchor: '<button data-qa="dt-button" v-bind="props.attrs">Hover me</button>',
      },
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
    testContext.localVue = createLocalVue();
  });

  beforeEach(async () => {
    _mountWrapper();
  });

  afterEach(async () => {
    // close to unmount tippy
    await wrapper.setProps({ show: false });
    wrapper.destroy();
    _clearChildWrappers();
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    describe('when tooltip is open', () => {
      beforeEach(async () => {
        await wrapper.setProps({ show: true });
        _setChildWrappers();
      });

      it(
        'should render the component',
        () => { expect(wrapper.exists()).toBe(true); },
      );
      it(
        'should render the container',
        () => { expect(tooltipContainer.exists()).toBe(true); },
      );
      it(
        'should render the tooltip',
        () => { expect(tooltip.exists()).toBe(true); },
      );
      it(
        'should render the anchor',
        () => { expect(anchor.text()).toBe('Hover me'); },
      );
      it('should set default classes', () => {
        expect(tooltip.classes('d-tooltip__arrow-tippy--top')).toBe(true);
      });
      it('should render the message', async () => {
        expect(tooltip.text()).toBe('Test message');
      });

      describe('When inverted is true', () => {
        beforeEach(async () => {
          await wrapper.setProps({ inverted: true });
          _setChildWrappers();
        });
        it('should have the inverted class set', () => {
          expect(tooltip.classes(TOOLTIP_KIND_MODIFIERS.inverted)).toBe(true);
        });
      });

      describe('When a placement is provided', () => {
        TOOLTIP_DIRECTIONS.forEach(placement => describe(`When direction is ${placement}`, () => {
          beforeEach(async () => {
            await wrapper.setProps({ placement });
          });

          it('should have correct arrow direction class', async () => {
            expect(tooltip.classes(`d-tooltip__arrow-tippy--${placement}`)).toBe(true);
          });
        }));
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(setOnMount);
    afterEach(restoreSpy);

    describe('When show prop is true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ show: true });
      });

      it('should display tooltip', async () => {
        expect(tooltip.isVisible()).toBe(true);
      });
    });

    describe('When show prop is false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ show: false });
      });

      it('should display tooltip', async () => {
        expect(tooltip.isVisible()).toBe(false);
      });
    });

    describe('When show prop is unset (default behaviour)', () => {
      beforeEach(async () => {
        await wrapper.setProps({ show: null });
        _setChildWrappers();
      });

      describe('When mouseenter tooltip', () => {
        beforeEach(async () => {
          await wrapper.setProps({ delay: false });
          await anchor.trigger('mouseenter');
        });

        it('should display tooltip', () => {
          expect(tooltip.isVisible()).toBe(true);
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
      //       assert.isFalse(tooltip.isVisible());
      //     });
      //   });
      // });

      describe('When mouseleave tooltip', () => {
        beforeEach(async () => {
          await anchor.trigger('mouseleave');
        });

        it('should hide tooltip', () => {
          expect(tooltip.isVisible()).toBe(false);
        });
      });

      describe('When focusout tooltip', () => {
        beforeEach(async () => {
          await anchor.trigger('focusout');
        });

        it('should display tooltip', () => {
          expect(tooltip.isVisible()).toBe(false);
        });
      });
    });
  });
});
