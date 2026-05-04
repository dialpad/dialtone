import { mount } from '@vue/test-utils';
import DtRecipeCallbarButton from './CallbarButton.vue';
import { DtTooltip } from '@/components/Tooltip';

// Constants
const baseProps = {};

describe('DtRecipeCallbarButton Tests', () => {
  // Wrappers
  let wrapper;
  let button;
  let tooltip;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.findComponent('.d-recipe-callbar-button');
    tooltip = wrapper.findComponent(DtTooltip);
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeCallbarButton, {
      props,
      attrs,
      slots,
      provide,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });
  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    describe('Default render', () => {
      it('should render the component', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should render a tooltip component', () => {
        expect(tooltip.exists()).toBeTruthy();
      });

      it('should render a muted button', () => {
        const buttonProps = button.props();
        expect(button.exists()).toBeTruthy();
        expect(buttonProps.kind).toBe('muted');
      });
    });

    describe('Button variants', () => {
      it('Should add appropriate class to icon when "active"', async () => {
        await wrapper.setProps({ active: true });
        expect(button.classes().includes('d-recipe-callbar-button--active')).toBe(true);
      });

      it('Should add appropriate class to icon when "circle"', async () => {
        await wrapper.setProps({ circle: true });
        expect(button.classes().includes('d-recipe-callbar-button--circle')).toBe(true);
        expect(button.props().importance).toBe('outlined');
      });

      it('Should add appropriate class to icon when "danger"', async () => {
        await wrapper.setProps({ danger: true });
        expect(button.classes().includes('d-recipe-callbar-button--danger')).toBe(true);
      });

      it('Should display a disabled button when "disabled"', async () => {
        await wrapper.setProps({ disabled: true });
        expect(button.classes().includes('d-btn--disabled')).toBe(true);
      });

      it(
        'Should add appropriate class to circle button when "importance"',
        async () => {
          await wrapper.setProps({ importance: 'clear', circle: 'true' });
          expect(button.classes().includes('d-recipe-callbar-button--circle')).toBe(true);
          expect(button.props().importance).toBe('clear');
        },
      );
    });
  });

  describe('Icon slot tests', () => {
    it('should render #blockStartIcon through to DtButton block-start-icon slot', () => {
      slots = { blockStartIcon: '<span data-qa="test-block-start-icon">B</span>' };
      _setWrappers();

      expect(button.find('[data-qa="dt-button-block-start-icon"]').exists()).toBe(true);
      expect(button.find('[data-qa="test-block-start-icon"]').exists()).toBe(true);
    });

    it('should render deprecated #icon through to DtButton block-start-icon slot', () => {
      slots = { icon: '<span data-qa="test-icon">I</span>' };
      _setWrappers();

      expect(button.find('[data-qa="dt-button-block-start-icon"]').exists()).toBe(true);
      expect(button.find('[data-qa="test-icon"]').exists()).toBe(true);
    });

    it('should prefer #blockStartIcon over deprecated #icon when both provided', () => {
      slots = {
        blockStartIcon: '<span data-qa="test-block-start-icon">B</span>',
        icon: '<span data-qa="test-icon">I</span>',
      };
      _setWrappers();

      expect(button.find('[data-qa="test-block-start-icon"]').exists()).toBe(true);
      expect(button.find('[data-qa="test-icon"]').exists()).toBe(false);
    });
  });

  describe('Interactivity Tests', () => {
    describe('When clicking on the button', () => {
      it('should call the click event listener', async () => {
        const clickStub = vi.fn();
        attrs = { onClick: clickStub };
        _setWrappers();

        await button.trigger('click');
        await wrapper.vm.$nextTick();

        expect(clickStub).toHaveBeenCalled();
      });
    });
  });
});
