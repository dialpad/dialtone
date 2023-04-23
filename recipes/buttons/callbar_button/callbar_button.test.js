import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeCallbarButton from './callbar_button.vue';
import DtTooltip from '@/components/tooltip/tooltip';

// Constants
const basePropsData = {};

describe('DtRecipeCallbarButton Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let button;
  let tooltip;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};
  let listeners = {};

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.findComponent('.dt-recipe-callbar-button');
    tooltip = wrapper.findComponent(DtTooltip);
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeCallbarButton, {
      propsData,
      attrs,
      slots,
      provide,
      listeners,
      attachTo: document.body,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = jest.fn();
    global.cancelAnimationFrame = jest.fn();
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
    listeners = {};
    wrapper.destroy();
  });

  describe('Presentation Tests', () => {
    describe('Default render', () => {
      it('should render the component', () => {
        assert.exists(wrapper);
      });

      it('should render a tooltip component', () => {
        assert.exists(tooltip);
      });

      it('should render a muted button', () => {
        const buttonProps = button.props();
        assert.exists(button);
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
        }
      );
    });
  });

  describe('Interactivity Tests', () => {
    describe('When clicking on the button', () => {
      it('should call the click event listener', async () => {
        const clickStub = jest.fn();
        listeners = { click: clickStub };
        _setWrappers();

        await button.find('button').trigger('click');
        await wrapper.vm.$nextTick();

        expect(clickStub.called).toBe(true);
      });
    });
  });
});
