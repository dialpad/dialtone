import { flushPromises, mount } from '@vue/test-utils';
import DtSplitButton from './split_button.vue';
import SplitButtonStart from './split_button-start.vue';
import SplitButtonEnd from './split_button-end.vue';
import { DtIconSend } from '@dialpad/dialtone-icons/vue';
import { DtTooltipDirective } from '@/directives/tooltip_directive';

const MOCK_START_BUTTON_STUB = vi.fn();
const MOCK_END_BUTTON_STUB = vi.fn();
const MOCK_START_TOOLTIP_TEXT = 'Start tooltip text';
const MOCK_END_TOOLTIP_TEXT = 'End tooltip text';
const MOCK_ROOT_CLASS = 'custom-class';

const baseProps = {
  endTooltipText: MOCK_END_TOOLTIP_TEXT,
};
const baseSlots = {
  default: () => 'Button text',
};
const baseAttrs = {};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};

describe('DtSplitButton Tests', function () {
  let wrapper;
  let startButton;
  let endButton;
  let startIconSlot;
  let endIconSlot;

  const updateWrapper = () => {
    wrapper = mount(DtSplitButton, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      global: {
        stubs: {
          transition: false,
        },
        plugins: [DtTooltipDirective],
        components: {
          SplitButtonStart,
          SplitButtonEnd,
          DtIconSend,
        },
      },
      attrs: { ...baseAttrs, ...mockAttrs },
      attachTo: document.body,
    });

    startButton = wrapper.find('[data-qa="dt-split-button-start"]');
    startIconSlot = startButton.find('[data-qa="dt-button-icon"]');
    endButton = wrapper.find('[data-qa="dt-split-button-end"]');
    endIconSlot = endButton.find('[data-qa="dt-button-icon"]');
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

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default props', () => {
      it('Should render the component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(startButton.exists()).toBe(true);
        expect(endButton.exists()).toBe(true);
        expect(endIconSlot.exists()).toBe(true);
      });

      it('Should render primary by default', async () => {
        // Default (no props) button should be d-btn--primary
        expect(startButton.classes().includes('d-btn--primary')).toBe(true);
        expect(endButton.classes().includes('d-btn--primary')).toBe(true);
      });
    });

    describe('When kind is set to critical', () => {
      it('Should have critical class', async () => {
        mockProps = { kind: 'critical' };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--critical')).toBe(true);
        expect(endButton.classes().includes('d-btn--critical')).toBe(true);
      });
    });

    describe('When importance is set to outlined', () => {
      it('Should have outlined class', async () => {
        mockProps = { importance: 'outlined' };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--outlined')).toBe(true);
        expect(endButton.classes().includes('d-btn--outlined')).toBe(true);
      });
    });

    describe('When startLoading is set to true', () => {
      it('Should have loading class', async () => {
        mockProps = { startLoading: true };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--loading')).toBe(true);
      });
    });

    describe('When startDisabled is set to true', () => {
      it('Should disable only the start button', async () => {
        mockProps = { startDisabled: true };

        updateWrapper();

        expect(startButton.attributes('disabled')).toBeDefined();
        expect(endButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('When endDisabled is set to true', () => {
      it('Should disable only the end button', async () => {
        mockProps = { endDisabled: true };

        updateWrapper();

        expect(startButton.attributes('disabled')).toBeUndefined();
        expect(endButton.attributes('disabled')).toBeDefined();
      });
    });

    describe('When disabled is set to true', () => {
      it('Should disable both buttons', async () => {
        mockProps = { disabled: true };

        updateWrapper();

        expect(startButton.attributes('disabled')).toBeDefined();
        expect(endButton.attributes('disabled')).toBeDefined();
      });
    });

    describe('When startActive is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { startActive: true };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When endActive is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { endActive: true };

        updateWrapper();

        expect(endButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When size is set to xl', () => {
      it('Class is set to the correct size', async () => {
        mockProps = { size: 'xl' };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--xl')).toBe(true);
        expect(endButton.classes().includes('d-btn--xl')).toBe(true);
      });
    });

    describe('When startIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { startIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('Should render the custom icon', () => {
        expect(startIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });

      it('Should render left by default', () => {
        expect(startIconSlot.classes().includes('d-btn__icon--left')).toBe(true);
      });

      describe('When startIconPosition is set to right', () => {
        it('Should have correct class', () => {
          mockProps = { startIconPosition: 'right' };

          updateWrapper();

          expect(startIconSlot.classes().includes('d-btn__icon--right')).toBe(true);
        });
      });
    });

    describe('When startIcon and startEndIcon slots are both set (dual icons)', () => {
      beforeEach(() => {
        mockSlots = { startIcon: '<dt-icon-send />', startEndIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('Should render start icon in the start button at start position', () => {
        const startIconSlot = startButton.find('[data-qa="dt-button-start-icon"]');

        expect(startIconSlot.exists()).toBe(true);
        expect(startIconSlot.findComponent(DtIconSend).exists()).toBe(true);
      });

      it('Should render end icon in the start button at end position', () => {
        const endIconSlot = startButton.find('[data-qa="dt-button-end-icon"]');

        expect(endIconSlot.exists()).toBe(true);
        expect(endIconSlot.findComponent(DtIconSend).exists()).toBe(true);
      });
    });

    describe('When endIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { endIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('should render the custom icon', () => {
        expect(endIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When startTooltipText is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { startTooltipText: MOCK_START_TOOLTIP_TEXT };
        await updateWrapper();
        await flushPromises();
        await startButton.trigger('mouseenter');

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip.textContent.trim()).toBe(MOCK_START_TOOLTIP_TEXT);
      });
    });

    describe('When endTooltipText is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { endTooltipText: MOCK_END_TOOLTIP_TEXT };
        await updateWrapper();
        await flushPromises();
        await endButton.trigger('mouseenter');

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip.textContent.trim()).toBe(MOCK_END_TOOLTIP_TEXT);
      });
    });
  });

  describe('showDivider Tests', () => {
    describe('When showDivider is true (default)', () => {
      it('Should not have no-divider class', () => {
        expect(wrapper.classes()).not.toContain('d-split-btn--no-divider');
      });
    });

    describe('When showDivider is false', () => {
      it('Should have no-divider class', () => {
        mockProps = { showDivider: false, importance: 'clear' };

        updateWrapper();

        expect(wrapper.classes()).toContain('d-split-btn--no-divider');
      });
    });

    describe('When showDivider is false and importance is not clear', () => {
      it('Should warn about invalid combination', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mockProps = { showDivider: false, importance: 'outlined' };

        updateWrapper();

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('show-divider prop set to false has no effect'),
        );
        warnSpy.mockRestore();
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When start button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onStartClicked: MOCK_START_BUTTON_STUB };

        updateWrapper();

        await startButton.trigger('click');
      });

      it('Should call listener', async () => {
        expect(MOCK_START_BUTTON_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit start-clicked event', () => {
        expect(wrapper.emitted()).toHaveProperty('start-clicked');
      });

      it('Should also emit deprecated alpha-clicked event', () => {
        expect(wrapper.emitted()).toHaveProperty('alpha-clicked');
      });
    });

    describe('When end button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onEndClicked: MOCK_END_BUTTON_STUB };

        updateWrapper();

        await endButton.trigger('click');
      });

      it('Should call listener', async () => {
        expect(MOCK_END_BUTTON_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit end-clicked event', () => {
        expect(wrapper.emitted()).toHaveProperty('end-clicked');
      });

      it('Should also emit deprecated omega-clicked event', () => {
        expect(wrapper.emitted()).toHaveProperty('omega-clicked');
      });
    });
  });

  describe('Backward Compatibility Tests', () => {
    describe('When deprecated alphaActive prop is used', () => {
      it('Should have active class', () => {
        mockProps = { alphaActive: true };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When deprecated omegaActive prop is used', () => {
      it('Should have active class', () => {
        mockProps = { omegaActive: true };

        updateWrapper();

        expect(endButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When deprecated alphaLoading prop is used', () => {
      it('Should have loading class', () => {
        mockProps = { alphaLoading: true };

        updateWrapper();

        expect(startButton.classes().includes('d-btn--loading')).toBe(true);
      });
    });

    describe('When deprecated alphaDisabled prop is used', () => {
      it('Should disable only the start button', () => {
        mockProps = { alphaDisabled: true };

        updateWrapper();

        expect(startButton.attributes('disabled')).toBeDefined();
        expect(endButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('When deprecated omegaDisabled prop is used', () => {
      it('Should disable only the end button', () => {
        mockProps = { omegaDisabled: true };

        updateWrapper();

        expect(startButton.attributes('disabled')).toBeUndefined();
        expect(endButton.attributes('disabled')).toBeDefined();
      });
    });

    describe('When deprecated alphaIcon slot is used', () => {
      it('Should render the custom icon', () => {
        mockSlots = { alphaIcon: '<dt-icon-send />' };

        updateWrapper();

        expect(startIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When deprecated omegaIcon slot is used', () => {
      it('Should render the custom icon', () => {
        mockSlots = { omegaIcon: '<dt-icon-send />' };

        updateWrapper();

        expect(endIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When deprecated alphaTooltipText prop is used', () => {
      it('Should pass the tooltip text to the alpha button', () => {
        mockProps = { alphaTooltipText: MOCK_START_TOOLTIP_TEXT };

        updateWrapper();

        const startComponent = wrapper.findComponent(SplitButtonStart);

        expect(startComponent.props('tooltipText')).toBe(MOCK_START_TOOLTIP_TEXT);
      });
    });

    describe('When deprecated omegaTooltipText prop is used', () => {
      it('Should pass the tooltip text to the omega button', () => {
        mockProps = { omegaTooltipText: MOCK_END_TOOLTIP_TEXT };

        updateWrapper();

        const endComponent = wrapper.findComponent(SplitButtonEnd);

        expect(endComponent.props('tooltipText')).toBe(MOCK_END_TOOLTIP_TEXT);
      });
    });

    describe('When deprecated alphaAriaLabel prop is used', () => {
      it('Should pass the aria-label to the alpha button', () => {
        mockProps = { alphaAriaLabel: 'Call action' };

        updateWrapper();

        expect(startButton.attributes('aria-label')).toBe('Call action');
      });
    });

    describe('When deprecated omegaAriaLabel prop is used', () => {
      it('Should pass the aria-label to the omega button', () => {
        mockProps = { omegaAriaLabel: 'More options' };

        updateWrapper();

        expect(endButton.attributes('aria-label')).toBe('More options');
      });
    });

    describe('When deprecated alphaIconPosition prop is used', () => {
      it('Should position the icon correctly', () => {
        mockSlots = { startIcon: '<dt-icon-send />' };
        mockProps = { alphaIconPosition: 'right' };

        updateWrapper();

        expect(startIconSlot.classes().includes('d-btn__icon--right')).toBe(true);
      });
    });

    describe('When deprecated alphaLabelClass prop is used', () => {
      it('Should apply the label class', () => {
        mockProps = { alphaLabelClass: 'custom-label-class' };

        updateWrapper();

        const labelEl = startButton.find('[data-qa="dt-button-label"]');

        expect(labelEl.classes().includes('custom-label-class')).toBe(true);
      });
    });

    describe('When both startIcon and alphaIcon slots are provided', () => {
      it('Should render startIcon (new name takes precedence)', () => {
        mockSlots = {
          startIcon: '<dt-icon-send />',
          alphaIcon: '<span data-qa="old-alpha-icon">Old</span>',
        };

        updateWrapper();

        expect(startIconSlot.findComponent(DtIconSend).exists()).toBe(true);
        expect(wrapper.find('[data-qa="old-alpha-icon"]').exists()).toBe(false);
      });
    });

    describe('When both endIcon and omegaIcon slots are provided', () => {
      it('Should render endIcon (new name takes precedence)', () => {
        mockSlots = {
          endIcon: '<dt-icon-send />',
          omegaIcon: '<span data-qa="old-omega-icon">Old</span>',
        };

        updateWrapper();

        expect(endIconSlot.findComponent(DtIconSend).exists()).toBe(true);
        expect(wrapper.find('[data-qa="old-omega-icon"]').exists()).toBe(false);
      });
    });

    describe('When both end and omega slots are provided', () => {
      it('Should render end slot (new name takes precedence)', () => {
        mockSlots = {
          end: '<span data-qa="new-end">New end</span>',
          omega: '<span data-qa="old-omega">Old omega</span>',
        };

        wrapper = mount(DtSplitButton, {
          props: { ...baseProps, ...mockProps },
          slots: { ...baseSlots, ...mockSlots },
          global: {
            stubs: { transition: false },
            plugins: [DtTooltipDirective],
            components: { SplitButtonStart, SplitButtonEnd, DtIconSend },
          },
          attrs: { ...baseAttrs, ...mockAttrs },
          attachTo: document.body,
        });

        expect(wrapper.find('[data-qa="new-end"]').exists()).toBe(true);
        expect(wrapper.find('[data-qa="old-omega"]').exists()).toBe(false);
      });
    });

    describe('When deprecated omega slot is used', () => {
      it('Should render the omega slot content', () => {
        mockSlots = { omega: '<span data-qa="custom-omega">Custom omega</span>' };

        wrapper = mount(DtSplitButton, {
          props: { ...baseProps, ...mockProps },
          slots: { ...baseSlots, ...mockSlots },
          global: {
            stubs: { transition: false },
            plugins: [DtTooltipDirective],
            components: { SplitButtonStart, SplitButtonEnd, DtIconSend },
          },
          attrs: { ...baseAttrs, ...mockAttrs },
          attachTo: document.body,
        });

        const customOmega = wrapper.find('[data-qa="custom-omega"]');

        expect(customOmega.exists()).toBe(true);
        expect(customOmega.text()).toBe('Custom omega');
      });
    });

    describe('When start button is clicked', () => {
      it('Should emit deprecated alpha-clicked event', async () => {
        await startButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('alpha-clicked');
      });
    });

    describe('When end button is clicked', () => {
      it('Should emit deprecated omega-clicked event', async () => {
        await endButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('omega-clicked');
      });
    });
  });

  describe('Navigation Tests', () => {
    describe('When startTo is provided', () => {
      it('Should forward to prop to the start DtButton', () => {
        mockProps = { startTo: '/some-route' };

        updateWrapper();

        const startComponent = wrapper.findComponent(SplitButtonStart);

        expect(startComponent.props('to')).toBe('/some-route');
      });
    });

    describe('When startTo is an object', () => {
      it('Should forward the route object to the start DtButton', () => {
        const route = { name: 'home', params: { id: 1 } };
        mockProps = { startTo: route };

        updateWrapper();

        const startComponent = wrapper.findComponent(SplitButtonStart);

        expect(startComponent.props('to')).toEqual(route);
      });
    });

    describe('When startHref is provided', () => {
      it('Should forward href prop to the start DtButton', () => {
        mockProps = { startHref: 'https://example.com' };

        updateWrapper();

        const startComponent = wrapper.findComponent(SplitButtonStart);

        expect(startComponent.props('href')).toBe('https://example.com');
      });
    });

    describe('When startTarget and startRel are provided', () => {
      it('Should forward target and rel props to the start DtButton', () => {
        mockProps = {
          startHref: 'https://example.com',
          startTarget: '_blank',
          startRel: 'noopener noreferrer',
        };

        updateWrapper();

        const startComponent = wrapper.findComponent(SplitButtonStart);

        expect(startComponent.props('target')).toBe('_blank');
        expect(startComponent.props('rel')).toBe('noopener noreferrer');
      });
    });

    describe('When startReplace is provided', () => {
      it('Should forward replace prop to the start DtButton', () => {
        mockProps = { startTo: '/some-route', startReplace: true };

        updateWrapper();

        const startComponent = wrapper.findComponent(SplitButtonStart);

        expect(startComponent.props('replace')).toBe(true);
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When a class is provided', () => {
      it('should include the class', () => {
        mockAttrs = { class: MOCK_ROOT_CLASS }

        updateWrapper();

        expect(wrapper.classes().includes(MOCK_ROOT_CLASS)).toBe(true);
      });
    });

    describe('When startLeadingClass is provided', () => {
      it('should apply custom class to the leading wrapper', () => {
        mockProps = { startLeadingClass: 'custom-leading' };
        mockSlots = { leading: 'Leading content' };

        updateWrapper();

        const leading = startButton.find('.d-btn__leading');

        expect(leading.exists()).toBe(true);
        expect(leading.classes()).toContain('custom-leading');
      });
    });

    describe('When startTrailingClass is provided', () => {
      it('should apply custom class to the trailing wrapper', () => {
        mockProps = { startTrailingClass: 'custom-trailing' };
        mockSlots = { trailing: 'Trailing content' };

        updateWrapper();

        const trailing = startButton.find('.d-btn__trailing');

        expect(trailing.exists()).toBe(true);
        expect(trailing.classes()).toContain('custom-trailing');
      });
    });

    describe('When leading slot is provided', () => {
      it('should render leading content through to start button', () => {
        mockSlots = { leading: '<span data-qa="test-leading">L</span>' };

        updateWrapper();

        expect(startButton.find('[data-qa="test-leading"]').exists()).toBe(true);
      });
    });

    describe('When trailing slot is provided', () => {
      it('should render trailing content through to start button', () => {
        mockSlots = { trailing: '<span data-qa="test-trailing">T</span>' };

        updateWrapper();

        expect(startButton.find('[data-qa="test-trailing"]').exists()).toBe(true);
      });
    });
  });
});
