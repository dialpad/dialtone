import { mount } from '@vue/test-utils';
import DtRecipeCallbarButton from './callbar_button.vue';
import DtTooltip from '@/components/tooltip/tooltip.vue';

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
    button = wrapper.findComponent('.dt-recipe-callbar-button');
    tooltip = wrapper.findComponent(DtTooltip);
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeCallbarButton, {
      props,
      attrs,
      slots,
      provide,
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
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
        expect(buttonProps.kind).toEqual('muted');
      });
    });

    describe('Button variants', () => {
      it('Should add appropriate class to icon when "active"', async () => {
        await wrapper.setProps({ active: true });
        expect(button.classes().includes('dt-recipe-callbar-button--active')).toBe(true);
      });

      it('Should add appropriate class to icon when "circle"', async () => {
        await wrapper.setProps({ circle: true });
        expect(button.classes().includes('dt-recipe-callbar-button--circle')).toBe(true);
        expect(button.props().importance).toEqual('outlined');
      });

      it('Should add appropriate class to icon when "danger"', async () => {
        await wrapper.setProps({ danger: true });
        expect(button.classes().includes('dt-recipe-callbar-button--danger')).toBe(true);
      });

      it('Should display a disabled button when "disabled"', async () => {
        await wrapper.setProps({ disabled: true });
        expect(button.classes().includes('d-btn--disabled')).toBe(true);
        expect(button.classes().includes('d-bgc-transparent')).toBe(true);
      });

      it(
        'Should add appropriate class to circle button when "importance"',
        async () => {
          await wrapper.setProps({ importance: 'clear', circle: 'true' });
          expect(button.classes().includes('dt-recipe-callbar-button--circle')).toBe(true);
          expect(button.props().importance).toEqual('clear');
        },
      );
    });
  });

  describe('Interactivity Tests', () => {
    describe('When clicking on the button', () => {
      it('should call the click event listener', async () => {
        const clickStub = jest.fn();
        attrs = { onClick: clickStub };
        _setWrappers();

        await button.trigger('click');
        await wrapper.vm.$nextTick();

        expect(clickStub).toHaveBeenCalled();
      });
    });
  });
});
