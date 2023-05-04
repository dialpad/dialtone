import { mount } from '@vue/test-utils';
import DtRecipeCallbarButtonWithPopover from './callbar_button_with_popover.vue';
import DtRecipeCallbarButton from '../callbar_button/callbar_button.vue';
import DtPopover from '@/components/popover/popover.vue';

// Constants
const baseProps = {
  arrowButtonLabel: 'arrowButton',
};

describe('DtRecipeCallbarButtonWithPopover Tests', () => {
  // Wrappers
  let wrapper;
  let arrow;
  let button;
  let popover;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.findComponent(DtRecipeCallbarButton);
    arrow = wrapper.findComponent('.dt-recipe--callbar-button-with-popover--arrow');
    popover = wrapper.findComponent(DtPopover);
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeCallbarButtonWithPopover, {
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
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );
    it(
      'should render the button',
      () => { expect(button.exists()).toBe(true); },
    );
    it(
      'should render the popover',
      () => { expect(popover.exists()).toBe(true); },
    );
    it('should render the arrow', () => { expect(arrow.exists()).toBe(true); });

    it('should not render the arrow if disabled', async () => {
      await wrapper.setProps({ disabled: true });
      _setChildWrappers();

      expect(arrow.exists()).toBe(false);
    });

    it(
      'should render the arrow if disabled but the forceShowArrow prop is true',
      async () => {
        await wrapper.setProps({ disabled: true, forceShowArrow: true });
        _setChildWrappers();

        expect(arrow.exists()).toBe(true);
      },
    );

    it(
      'should propagate disabled, active and danger props to the button component',
      async () => {
        await wrapper.setProps({ disabled: true, active: true, danger: true });
        _setChildWrappers();

        const buttonProps = button.props();

        expect(buttonProps.disabled).toBe(true);
        expect(buttonProps.active).toBe(true);
        expect(buttonProps.danger).toBe(true);
      },
    );

    it(
      'should propagate placement, initialFocusElement and showCloseButton props to the popover component',
      async () => {
        await wrapper.setProps({
          placement: 'mock',
          initialFocusElement: '#mock',
          showCloseButton: true,
        });
        _setChildWrappers();

        const popoverProps = popover.props();

        expect(popoverProps.showCloseButton).toBe(true);
        expect(popoverProps.placement).toEqual('mock');
        expect(popoverProps.initialFocusElement).toEqual('#mock');
      },
    );
  });

  describe('Interactivity Tests', () => {
    describe('When clicking on the button', () => {
      it(
        'should trigger the "arrowClick" event when no listener attached',
        async () => {
          await button.trigger('click');
          const arrowClickEvents = wrapper.emitted().arrowClick;
          expect(arrowClickEvents.length).toEqual(1);
        },
      );

      it('should trigger the "click" event when at least one listener is attached', async function () {
        const clickStub = jest.fn();
        attrs = { onClick: clickStub };
        _setWrappers();

        await button.trigger('click');

        const clickEvents = wrapper.emitted().click;
        expect(clickEvents.length).toEqual(1);
        expect(clickStub).toHaveBeenCalled();
      },
      );
    });

    describe('When clicking on the arrow', function () {
      let clickStub;
      beforeEach(async function () {
        clickStub = jest.fn();
        attrs = { onArrowClick: clickStub };
        _setWrappers();

        await arrow.trigger('click');
      });

      it('should pass the open prop to the popover, so it opens', () => {
        expect(wrapper.vm.open).toBe(true);
      });

      it('should trigger the "arrowClick" event', () => {
        const arrowClickEvents = wrapper.emitted().arrowClick;
        expect(arrowClickEvents.length).toEqual(1);
      });
    });
  });
});
