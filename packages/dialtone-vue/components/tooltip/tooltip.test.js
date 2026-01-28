import { mount, flushPromises } from '@vue/test-utils';
import DtTooltip from './tooltip.vue';
import {
  TOOLTIP_KIND_MODIFIERS,
  TOOLTIP_DIRECTIONS,
} from './tooltip_constants';

const MOCK_GET_ROOT_NODE = () => document;

// jsdom doesn't like this.anchor?.getRootNode() so use document.body.
const baseProps = { delay: false, appendTo: document.body };
const baseSlots = {
  default: 'Test message',
  anchor: `<template #anchor="attrs"><button data-qa="dt-button" v-bind="attrs">Hover me</button></template>`,
};

let mockProps = {};
let mockSlots = {};

describe('DtTooltip tests', () => {
  let wrapper;
  let tooltipContainer;
  let tooltip;
  let tippyContent;
  let tippyBox;
  let anchor;

  const updateWrapper = () => {
    wrapper = mount(DtTooltip, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        stubs: {
          transition: false,
        },
      },
    });

    tooltipContainer = wrapper.find('[data-qa="dt-tooltip-container"]');
    tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');
    tippyContent = document.body.querySelector('.tippy-content');
    tippyBox = document.body.querySelector('.tippy-box');
    anchor = wrapper.find('[data-qa="dt-tooltip-anchor"]');

    // Mock getRootNode after wrapper is created
    wrapper.vm.$el.getRootNode = MOCK_GET_ROOT_NODE;
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
    // manually unmount or else the jsdom persists between tests
    wrapper.unmount();
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
        expect(tooltip).not.toBeNull();
      });

      it('should render the anchor', () => {
        expect(anchor.text()).toBe('Hover me');
      });

      it('should render the message', () => {
        expect(tooltip.textContent).toBe('Test message');
      });

      describe('When tooltip content is a space character', () => {
        it('should not render the content', async () => {
          wrapper.unmount();
          mockProps = { show: true, message: ' ' };
          updateWrapper();
          expect(tippyContent.getAttribute('data-state')).not.toBe('visible');
        });
      });

      describe('When inverted is true', () => {
        it('should have the inverted class set', async () => {
          await wrapper.setProps({ show: true, inverted: true });
          expect([...tooltip.classList].includes(TOOLTIP_KIND_MODIFIERS.inverted)).not.toBeNull();
        });
      });

      it.each(TOOLTIP_DIRECTIONS)('when placement is %s should have correct data-placement attribute', async (placement) => {
        wrapper.unmount();
        mockProps = { show: true, placement, fallbackPlacements: [] };
        updateWrapper();

        await flushPromises();
        tippyBox = document.body.querySelector('.tippy-box');

        expect(tippyBox.getAttribute('data-placement')).toBe(placement);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When show prop is true', () => {
      it('should display tooltip', async () => {
        mockProps = { show: true };
        updateWrapper();
        await flushPromises();

        expect(tippyContent.getAttribute('data-state')).toBe('visible');
      });
    });

    describe('When show prop is false', () => {
      it('should not display tooltip', async () => {
        mockProps = { show: true };
        updateWrapper();
        await wrapper.setProps({ show: false });

        expect(tippyContent.getAttribute('data-state')).not.toBe('visible');
      });
    });

    describe('When show prop is unset (default behaviour)', () => {
      beforeEach(() => {
        mockProps = { show: null };
        updateWrapper();
      });

      describe('When mouseenter tooltip', () => {
        it('should display tooltip', async () => {
          await anchor.trigger('mouseenter');
          await flushPromises();
          tippyContent = document.body.querySelector('.tippy-content');

          expect(tippyContent.getAttribute('data-state')).toBe('visible');
        });
      });

      describe('When mouseleave tooltip', () => {
        it('should hide tooltip', async () => {
          await anchor.trigger('mouseenter');
          await anchor.trigger('mouseleave');
          await flushPromises();
          tippyContent = document.body.querySelector('.tippy-content');

          expect(tippyContent.getAttribute('data-state')).not.toBe('visible');
        });
      });

      describe('When focusout tooltip', () => {
        it('should display tooltip', async () => {
          await anchor.trigger('mouseenter');
          await anchor.trigger('focusout');
          await flushPromises();
          tippyContent = document.body.querySelector('.tippy-content');

          expect(tippyContent.getAttribute('data-state')).not.toBe('visible');
        });
      });
    });

    describe('When enabled prop is false', () => {
      describe('When mouseenter on anchor', () => {
        it('should not display tooltip', async () => {
          mockProps = { enabled: false };
          updateWrapper();

          await anchor.trigger('mouseenter');
          await flushPromises();
          tippyContent = document.body.querySelector('.tippy-content');

          expect(tippyContent).toBeNull();
        });
      });
    });

    describe('Z-index behavior with modals', () => {
      afterEach(() => {
        // Clean up any modal elements added during tests
        const modals = document.querySelectorAll('.d-modal, .d-modal--transparent');
        modals.forEach(modal => modal.remove());
      });

      it('should have higher z-index when modal is present', async () => {
        // Create a mock modal element in the DOM
        const modalElement = document.createElement('div');
        modalElement.className = 'd-modal';
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.appendChild(modalElement);

        mockProps = { show: true };
        updateWrapper();
        await flushPromises();

        tippyBox = document.body.querySelector('.tippy-box');
        expect(tippyBox).not.toBeNull();

        // Get the z-index from the tooltip component's calculated value
        const tooltipZIndex = wrapper.vm.calculateAnchorZindex();

        // Modal z-index is 600, modal-element is 650, so tooltip should be 651
        expect(tooltipZIndex).toBe(651);
        expect(tooltipZIndex).toBeGreaterThan(650); // Greater than modal-element z-index
      });

      it('should have higher z-index when transparent modal is present', async () => {
        // Create a mock transparent modal element in the DOM
        const modalElement = document.createElement('div');
        modalElement.className = 'd-modal--transparent';
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.appendChild(modalElement);

        mockProps = { show: true };
        updateWrapper();
        await flushPromises();

        tippyBox = document.body.querySelector('.tippy-box');
        expect(tippyBox).not.toBeNull();

        // Get the z-index from the tooltip component's calculated value
        const tooltipZIndex = wrapper.vm.calculateAnchorZindex();

        expect(tooltipZIndex).toBe(651);
        expect(tooltipZIndex).toBeGreaterThan(650); // Greater than modal-element z-index
      });

      it('should have higher z-index when modal without aria-hidden is present', async () => {
        // Create a mock modal element without aria-hidden attribute
        const modalElement = document.createElement('div');
        modalElement.className = 'd-modal';
        document.body.appendChild(modalElement);

        mockProps = { show: true };
        updateWrapper();
        await flushPromises();

        tippyBox = document.body.querySelector('.tippy-box');
        expect(tippyBox).not.toBeNull();

        // Get the z-index from the tooltip component's calculated value
        const tooltipZIndex = wrapper.vm.calculateAnchorZindex();

        expect(tooltipZIndex).toBe(651);
        expect(tooltipZIndex).toBeGreaterThan(650); // Greater than modal-element z-index
      });

      it('should have default z-index when no modal is present', async () => {
        mockProps = { show: true };
        updateWrapper();
        await flushPromises();

        tippyBox = document.body.querySelector('.tippy-box');
        expect(tippyBox).not.toBeNull();

        // Get the z-index from the tooltip component's calculated value
        const tooltipZIndex = wrapper.vm.calculateAnchorZindex();

        // Default tooltip z-index should be 400
        expect(tooltipZIndex).toBe(400);
      });
    });
  });
});
