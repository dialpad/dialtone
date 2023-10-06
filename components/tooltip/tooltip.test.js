import { createLocalVue, mount } from '@vue/test-utils';
import DtTooltip from './tooltip.vue';
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTIONS,
} from './tooltip_constants';

const MOCK_TRANSITION_STUB = () => ({
  render: function (h) {
    return this.$options._renderChildren;
  },
});

const baseProps = { delay: false };
const baseSlots = {
  default: 'Test message',
};
const baseScopedSlots = {
  anchor: '<button data-qa="dt-button" v-bind="props.attrs">Hover me</button>',
};

let mockProps = {};
let mockSlots = {};
let mockScopedSlots = {};
const testContext = {};

describe('DtTooltip tests', () => {
  let wrapper;
  let tooltipContainer;
  let tooltip;
  let anchor;
  let onMount;

  const updateWrapper = () => {
    wrapper = mount(DtTooltip, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
      stubs: {
        // this gets around transition async problems. See https://v1.test-utils.vuejs.org/guides/common-tips.html
        transition: MOCK_TRANSITION_STUB(),
      },
      scopedSlots: { ...baseScopedSlots, ...mockScopedSlots },
    });

    tooltipContainer = wrapper.find('[data-qa="dt-tooltip-container"]');
    tooltip = wrapper.findComponent({ ref: 'content' });
    anchor = wrapper.findComponent({ ref: 'anchor' });
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
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
    mockScopedSlots = {};
  });

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  describe('Presentation Tests', () => {
    describe('when tooltip is open', () => {
      beforeEach(() => {
        mockProps = { show: true };

        updateWrapper();
      });

      it('should render the component', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('should render the container', () => {
        expect(tooltipContainer.exists()).toBe(true);
      });

      it('should render the tooltip', () => {
        expect(tooltip.exists()).toBe(true);
      });

      it('should render the anchor', () => {
        expect(anchor.text()).toBe('Hover me');
      });

      it('should set default classes', () => {
        expect(tooltip.classes('d-tooltip__arrow-tippy--top')).toBe(true);
      });

      it('should render the message', () => {
        expect(tooltip.text()).toBe('Test message');
      });

      describe('When inverted is true', () => {
        it('should have the inverted class set', () => {
          mockProps = { inverted: true };

          updateWrapper();

          expect(tooltip.classes(TOOLTIP_KIND_MODIFIERS.inverted)).toBe(true);
        });
      });

      describe('When a placement is provided', () => {
        TOOLTIP_DIRECTIONS.forEach(placement =>
          describe(`When direction is ${placement}`, () => {
            it('should have correct arrow direction class', () => {
              mockProps = { placement };

              updateWrapper();

              expect(tooltip.classes(`d-tooltip__arrow-tippy--${placement}`)).toBe(true);
            });
          }));
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      onMount = vi.spyOn(DtTooltip.methods, 'onMount').mockClear();
    });

    afterEach(() => {
      onMount.mockRestore();
    });

    describe('When show prop is true', () => {
      it('should display tooltip', async () => {
        await wrapper.setProps({ show: true });

        expect(tooltip.isVisible()).toBe(true);
      });
    });

    describe('When show prop is false', () => {
      it('should display tooltip', async () => {
        await wrapper.setProps({ show: false });

        expect(tooltip.isVisible()).toBe(false);
      });
    });

    describe('When show prop is unset (default behaviour)', () => {
      beforeEach(() => {
        mockProps = { show: null };

        updateWrapper();
      });

      describe('When mouseenter tooltip', () => {
        it('should display tooltip', async () => {
          await wrapper.setProps({ delay: false });
          await anchor.trigger('mouseenter');

          expect(tooltip.isVisible()).toBe(true);
        });
      });

      describe('When mouseleave tooltip', () => {
        it('should hide tooltip', async () => {
          await anchor.trigger('mouseleave');

          expect(tooltip.isVisible()).toBe(false);
        });
      });

      describe('When focusout tooltip', () => {
        it('should display tooltip', async () => {
          await anchor.trigger('focusout');

          expect(tooltip.isVisible()).toBe(false);
        });
      });
    });
  });
});
