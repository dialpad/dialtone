import { flushPromises, mount } from '@vue/test-utils';
import DtSplitButton from './split_button.vue';
import SplitButtonAlpha from './split_button-alpha.vue';
import SplitButtonOmega from './split_button-omega.vue';
import { DtIconSend } from '@dialpad/dialtone-icons/vue3';
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
  let alphaButton;
  let omegaButton;
  let alphaIconSlot;
  let omegaIconSlot;

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
          SplitButtonAlpha,
          SplitButtonOmega,
          DtIconSend,
        },
      },
      attrs: { ...baseAttrs, ...mockAttrs },
      attachTo: document.body,
    });

    alphaButton = wrapper.find('[data-qa="dt-split-button-alpha"]');
    alphaIconSlot = alphaButton.find('[data-qa="dt-button-icon"]');
    omegaButton = wrapper.find('[data-qa="dt-split-button-omega"]');
    omegaIconSlot = omegaButton.find('[data-qa="dt-button-icon"]');
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
        expect(alphaButton.exists()).toBe(true);
        expect(omegaButton.exists()).toBe(true);
        expect(omegaIconSlot.exists()).toBe(true);
      });

      it('Should render primary by default', async () => {
        // Default (no props) button should be d-btn--primary
        expect(alphaButton.classes().includes('d-btn--primary')).toBe(true);
        expect(omegaButton.classes().includes('d-btn--primary')).toBe(true);
      });
    });

    describe('When kind is set to danger', () => {
      it('Should have danger class', async () => {
        mockProps = { kind: 'danger' };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--danger')).toBe(true);
        expect(omegaButton.classes().includes('d-btn--danger')).toBe(true);
      });
    });

    describe('When importance is set to outlined', () => {
      it('Should have outlined class', async () => {
        mockProps = { importance: 'outlined' };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--outlined')).toBe(true);
        expect(omegaButton.classes().includes('d-btn--outlined')).toBe(true);
      });
    });

    describe('When startLoading is set to true', () => {
      it('Should have loading class', async () => {
        mockProps = { startLoading: true };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--loading')).toBe(true);
      });
    });

    describe('When startDisabled is set to true', () => {
      it('Should disable only the start button', async () => {
        mockProps = { startDisabled: true };

        updateWrapper();

        expect(alphaButton.attributes('disabled')).toBeDefined();
        expect(omegaButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('When endDisabled is set to true', () => {
      it('Should disable only the end button', async () => {
        mockProps = { endDisabled: true };

        updateWrapper();

        expect(alphaButton.attributes('disabled')).toBeUndefined();
        expect(omegaButton.attributes('disabled')).toBeDefined();
      });
    });

    describe('When disabled is set to true', () => {
      it('Should disable both buttons', async () => {
        mockProps = { disabled: true };

        updateWrapper();

        expect(alphaButton.attributes('disabled')).toBeDefined();
        expect(omegaButton.attributes('disabled')).toBeDefined();
      });
    });

    describe('When startActive is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { startActive: true };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When endActive is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { endActive: true };

        updateWrapper();

        expect(omegaButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When size is set to xl', () => {
      it('Class is set to the correct size', async () => {
        mockProps = { size: 'xl' };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--xl')).toBe(true);
        expect(omegaButton.classes().includes('d-btn--xl')).toBe(true);
      });
    });

    describe('When startIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { startIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('Should render the custom icon', () => {
        expect(alphaIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });

      it('Should render left by default', () => {
        expect(alphaIconSlot.classes().includes('d-btn__icon--left')).toBe(true);
      });

      describe('When startIconPosition is set to right', () => {
        it('Should have correct class', () => {
          mockProps = { startIconPosition: 'right' };

          updateWrapper();

          expect(alphaIconSlot.classes().includes('d-btn__icon--right')).toBe(true);
        });
      });
    });

    describe('When startIcon and startEndIcon slots are both set (dual icons)', () => {
      beforeEach(() => {
        mockSlots = { startIcon: '<dt-icon-send />', startEndIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('Should render start icon in the alpha button at start position', () => {
        const startIconSlot = alphaButton.find('[data-qa="dt-button-start-icon"]');

        expect(startIconSlot.exists()).toBe(true);
        expect(startIconSlot.findComponent(DtIconSend).exists()).toBe(true);
      });

      it('Should render end icon in the alpha button at end position', () => {
        const endIconSlot = alphaButton.find('[data-qa="dt-button-end-icon"]');

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
        expect(omegaIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When startTooltipText is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { startTooltipText: MOCK_START_TOOLTIP_TEXT };
        await updateWrapper();
        await flushPromises();
        await alphaButton.trigger('mouseenter');

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip.textContent.trim()).toBe(MOCK_START_TOOLTIP_TEXT);
      });
    });

    describe('When endTooltipText is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { endTooltipText: MOCK_END_TOOLTIP_TEXT };
        await updateWrapper();
        await flushPromises();
        await omegaButton.trigger('mouseenter');

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip.textContent.trim()).toBe(MOCK_END_TOOLTIP_TEXT);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When start button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onStartClicked: MOCK_START_BUTTON_STUB };

        updateWrapper();

        await alphaButton.trigger('click');
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

        await omegaButton.trigger('click');
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

        expect(alphaButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When deprecated omegaActive prop is used', () => {
      it('Should have active class', () => {
        mockProps = { omegaActive: true };

        updateWrapper();

        expect(omegaButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When deprecated alphaLoading prop is used', () => {
      it('Should have loading class', () => {
        mockProps = { alphaLoading: true };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--loading')).toBe(true);
      });
    });

    describe('When deprecated alphaDisabled prop is used', () => {
      it('Should disable only the start button', () => {
        mockProps = { alphaDisabled: true };

        updateWrapper();

        expect(alphaButton.attributes('disabled')).toBeDefined();
        expect(omegaButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('When deprecated omegaDisabled prop is used', () => {
      it('Should disable only the end button', () => {
        mockProps = { omegaDisabled: true };

        updateWrapper();

        expect(alphaButton.attributes('disabled')).toBeUndefined();
        expect(omegaButton.attributes('disabled')).toBeDefined();
      });
    });

    describe('When deprecated alphaIcon slot is used', () => {
      it('Should render the custom icon', () => {
        mockSlots = { alphaIcon: '<dt-icon-send />' };

        updateWrapper();

        expect(alphaIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When deprecated omegaIcon slot is used', () => {
      it('Should render the custom icon', () => {
        mockSlots = { omegaIcon: '<dt-icon-send />' };

        updateWrapper();

        expect(omegaIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When deprecated alphaTooltipText prop is used', () => {
      it('Should pass the tooltip text to the alpha button', () => {
        mockProps = { alphaTooltipText: MOCK_START_TOOLTIP_TEXT };

        updateWrapper();

        const alphaComponent = wrapper.findComponent(SplitButtonAlpha);

        expect(alphaComponent.props('tooltipText')).toBe(MOCK_START_TOOLTIP_TEXT);
      });
    });

    describe('When deprecated omegaTooltipText prop is used', () => {
      it('Should pass the tooltip text to the omega button', () => {
        mockProps = { omegaTooltipText: MOCK_END_TOOLTIP_TEXT };

        updateWrapper();

        const omegaComponent = wrapper.findComponent(SplitButtonOmega);

        expect(omegaComponent.props('tooltipText')).toBe(MOCK_END_TOOLTIP_TEXT);
      });
    });

    describe('When deprecated alphaAriaLabel prop is used', () => {
      it('Should pass the aria-label to the alpha button', () => {
        mockProps = { alphaAriaLabel: 'Call action' };

        updateWrapper();

        expect(alphaButton.attributes('aria-label')).toBe('Call action');
      });
    });

    describe('When deprecated omegaAriaLabel prop is used', () => {
      it('Should pass the aria-label to the omega button', () => {
        mockProps = { omegaAriaLabel: 'More options' };

        updateWrapper();

        expect(omegaButton.attributes('aria-label')).toBe('More options');
      });
    });

    describe('When deprecated alphaIconPosition prop is used', () => {
      it('Should position the icon correctly', () => {
        mockSlots = { startIcon: '<dt-icon-send />' };
        mockProps = { alphaIconPosition: 'right' };

        updateWrapper();

        expect(alphaIconSlot.classes().includes('d-btn__icon--right')).toBe(true);
      });
    });

    describe('When deprecated alphaLabelClass prop is used', () => {
      it('Should apply the label class', () => {
        mockProps = { alphaLabelClass: 'custom-label-class' };

        updateWrapper();

        const labelEl = alphaButton.find('[data-qa="dt-button-label"]');

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

        expect(alphaIconSlot.findComponent(DtIconSend).exists()).toBe(true);
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

        expect(omegaIconSlot.findComponent(DtIconSend).exists()).toBe(true);
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
            components: { SplitButtonAlpha, SplitButtonOmega, DtIconSend },
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
            components: { SplitButtonAlpha, SplitButtonOmega, DtIconSend },
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
        await alphaButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('alpha-clicked');
      });
    });

    describe('When end button is clicked', () => {
      it('Should emit deprecated omega-clicked event', async () => {
        await omegaButton.trigger('click');

        expect(wrapper.emitted()).toHaveProperty('omega-clicked');
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When a rootClass is provided', () => {
      it('should include the root class', () => {
        mockProps = { rootClass: MOCK_ROOT_CLASS }

        updateWrapper();

        expect(wrapper.classes().includes(MOCK_ROOT_CLASS)).toBe(true);
      });
    });

    describe('When startLeadingClass is provided', () => {
      it('should apply custom class to the leading wrapper', () => {
        mockProps = { startLeadingClass: 'custom-leading' };
        mockSlots = { leading: 'Leading content' };

        updateWrapper();

        const leading = alphaButton.find('.d-btn__leading');

        expect(leading.exists()).toBe(true);
        expect(leading.classes()).toContain('custom-leading');
      });
    });

    describe('When startTrailingClass is provided', () => {
      it('should apply custom class to the trailing wrapper', () => {
        mockProps = { startTrailingClass: 'custom-trailing' };
        mockSlots = { trailing: 'Trailing content' };

        updateWrapper();

        const trailing = alphaButton.find('.d-btn__trailing');

        expect(trailing.exists()).toBe(true);
        expect(trailing.classes()).toContain('custom-trailing');
      });
    });

    describe('When leading slot is provided', () => {
      it('should render leading content through to alpha button', () => {
        mockSlots = { leading: '<span data-qa="test-leading">L</span>' };

        updateWrapper();

        expect(alphaButton.find('[data-qa="test-leading"]').exists()).toBe(true);
      });
    });

    describe('When trailing slot is provided', () => {
      it('should render trailing content through to alpha button', () => {
        mockSlots = { trailing: '<span data-qa="test-trailing">T</span>' };

        updateWrapper();

        expect(alphaButton.find('[data-qa="test-trailing"]').exists()).toBe(true);
      });
    });
  });
});
