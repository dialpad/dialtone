import { mount } from '@vue/test-utils';
import DtSplitButton from './split_button.vue';
import SplitButtonAlpha from './split_button-alpha.vue';
import SplitButtonOmega from './split_button-omega.vue';
import { DtIconSend } from '@dialpad/dialtone-icons/vue3';
import { DtTooltipDirective } from '@/directives/tooltip';

const MOCK_ALPHA_BUTTON_STUB = vi.fn();
const MOCK_OMEGA_BUTTON_STUB = vi.fn();
const MOCK_ALPHA_TOOLTIP_TEXT = 'Alpha tooltip text';
const MOCK_OMEGA_TOOLTIP_TEXT = 'Omega tooltip text';

const baseProps = {
  omegaTooltipText: MOCK_OMEGA_TOOLTIP_TEXT,
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

    describe('When loading is set to true', () => {
      it('Should have loading class', async () => {
        mockProps = { alphaLoading: true };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--loading')).toBe(true);
      });
    });

    describe('When alpha-active is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { alphaActive: true };

        updateWrapper();

        expect(alphaButton.classes().includes('d-btn--active')).toBe(true);
      });
    });

    describe('When omega-active is set to true', () => {
      it('Should have active class', async () => {
        mockProps = { omegaActive: true };

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

    describe('When alphaIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { alphaIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('Should render the custom icon', () => {
        expect(alphaIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });

      it('Should render left by default', () => {
        expect(alphaIconSlot.classes().includes('d-btn__icon--left')).toBe(true);
      });

      describe('When alpha-icon-position is set to right', () => {
        it('Should have correct class', () => {
          mockProps = { alphaIconPosition: 'right' };

          updateWrapper();

          expect(alphaIconSlot.classes().includes('d-btn__icon--right')).toBe(true);
        });
      });
    });

    describe('When omegaIcon slot is set', () => {
      beforeEach(() => {
        mockSlots = { omegaIcon: '<dt-icon-send />' };

        updateWrapper();
      });

      it('should render the custom icon', () => {
        expect(omegaIconSlot.findComponent(DtIconSend).classes().includes('d-icon--send')).toBe(true);
      });
    });

    describe('When alpha-tooltip-text is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { alphaTooltipText: MOCK_ALPHA_TOOLTIP_TEXT };
        await updateWrapper();
        await alphaButton.trigger('mouseenter');

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip.textContent.trim()).toBe(MOCK_ALPHA_TOOLTIP_TEXT);
      });
    });

    describe('When omega-tooltip-text is set', () => {
      it('Should render the tooltip with correct text', async () => {
        mockProps = { omegaTooltipText: MOCK_OMEGA_TOOLTIP_TEXT };
        await updateWrapper();
        await omegaButton.trigger('mouseenter');

        const tooltip = document.body.querySelector('[data-qa="dt-tooltip"]');

        expect(tooltip.textContent.trim()).toBe(MOCK_OMEGA_TOOLTIP_TEXT);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When alpha button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onAlphaClicked: MOCK_ALPHA_BUTTON_STUB };

        updateWrapper();

        await alphaButton.trigger('click');
      });

      it('Should call listener', async () => {
        expect(MOCK_ALPHA_BUTTON_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit alpha-clicked event', () => {
        expect(wrapper.emitted()).toHaveProperty('alpha-clicked');
      });
    });

    describe('When omega button is clicked', () => {
      beforeEach(async () => {
        mockAttrs = { onOmegaClicked: MOCK_OMEGA_BUTTON_STUB };

        updateWrapper();

        await omegaButton.trigger('click');
      });

      it('Should call listener', async () => {
        expect(MOCK_OMEGA_BUTTON_STUB).toHaveBeenCalledTimes(1);
      });

      it('Should emit omega-clicked event', () => {
        expect(wrapper.emitted()).toHaveProperty('omega-clicked');
      });
    });
  });
});
