import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtRecipeCallbarButtonWithPopover from './callbar_button_with_popover';
import DtRecipeCallbarButton from '../callbar_button/callbar_button';
import DtPopover from '@/components/popover/popover';
import sinon from 'sinon';

// Constants
const baseProps = {
  arrowButtonLabel: 'arrowButton',
};

describe('DtRecipeCallbarButtonWithPopover Tests', function () {
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
  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
  });
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', function () {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */

    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    it('should render the button', function () { assert.isTrue(button.exists()); });
    it('should render the popover', function () { assert.isTrue(popover.exists()); });
    it('should render the arrow', function () { assert.isTrue(arrow.exists()); });

    it('should not render the arrow if disabled', async function () {
      await wrapper.setProps({ disabled: true });
      _setChildWrappers();

      assert.isFalse(arrow.exists());
    });

    it('should render the arrow if disabled but the forceShowArrow prop is true', async function () {
      await wrapper.setProps({ disabled: true, forceShowArrow: true });
      _setChildWrappers();

      assert.isTrue(arrow.exists());
    });

    it('should propagate disabled, active and danger props to the button component', async function () {
      await wrapper.setProps({ disabled: true, active: true, danger: true });
      _setChildWrappers();

      const buttonProps = button.props();

      assert.isTrue(buttonProps.disabled);
      assert.isTrue(buttonProps.active);
      assert.isTrue(buttonProps.danger);
    });

    it('should propagate placement, initialFocusElement and showCloseButton props to the popover component',
      async function () {
        await wrapper.setProps({
          placement: 'mock',
          initialFocusElement: '#mock',
          showCloseButton: true,
        });
        _setChildWrappers();

        const popoverProps = popover.props();

        assert.isTrue(popoverProps.showCloseButton);
        assert.equal(popoverProps.placement, 'mock');
        assert.equal(popoverProps.initialFocusElement, '#mock');
      });
  });

  describe('Interactivity Tests', function () {
    describe('When clicking on the button', function () {
      it('should trigger the "arrowClick" event when no listener attached', async function () {
        await button.trigger('click');
        const arrowClickEvents = wrapper.emitted().arrowClick;
        assert.equal(arrowClickEvents.length, 1);
      });

      it('should trigger the "click" event when at least one listener is attached', async function () {
        const clickStub = sinon.stub();
        attrs = { onClick: clickStub };
        _setWrappers();

        await button.trigger('click');

        const clickEvents = wrapper.emitted().click;
        assert.equal(clickEvents.length, 1);
        assert.isTrue(clickStub.called);
      });
    });

    describe('When clicking on the arrow', function () {
      let clickStub;
      beforeEach(async function () {
        clickStub = sinon.stub();
        attrs = { onArrowClick: clickStub };
        _setWrappers();

        await arrow.trigger('click');
      });

      it('should pass the open prop to the popover, so it opens', function () {
        assert.isTrue(wrapper.vm.open);
      });

      it('should trigger the "arrowClick" event', function () {
        const arrowClickEvents = wrapper.emitted().arrowClick;
        assert.equal(arrowClickEvents.length, 1);
        assert.isTrue(clickStub.called);
      });
    });
  });
});
