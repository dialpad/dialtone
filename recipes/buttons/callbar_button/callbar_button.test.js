import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtRecipeCallbarButton from './callbar_button.vue';
import DtTooltip from '@/components/tooltip/tooltip';
import sinon from 'sinon';

// Constants
const baseProps = {};

describe('DtRecipeCallbarButton Tests', function () {
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
    describe('Default render', function () {
      it('should render the component', function () {
        assert.exists(wrapper);
      });

      it('should render a tooltip component', function () {
        assert.exists(tooltip);
      });

      it('should render a muted button', function () {
        const buttonProps = button.props();
        assert.exists(button);
        assert.equal(buttonProps.kind, 'muted');
      });
    });

    describe('Button variants', function () {
      it('Should add appropriate class to icon when "active"', async function () {
        await wrapper.setProps({ active: true });
        assert.isTrue(button.classes().includes('dt-recipe-callbar-button--active'));
      });

      it('Should add appropriate class to icon when "circle"', async function () {
        await wrapper.setProps({ circle: true });
        assert.isTrue(button.classes().includes('dt-recipe-callbar-button--circle'));
        assert.equal(button.props().importance, 'outlined');
      });

      it('Should add appropriate class to icon when "danger"', async function () {
        await wrapper.setProps({ danger: true });
        assert.isTrue(button.classes().includes('dt-recipe-callbar-button--danger'));
      });

      it('Should display a disabled button when "disabled"', async function () {
        await wrapper.setProps({ disabled: true });
        assert.isTrue(button.classes().includes('d-btn--disabled'));
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('When clicking on the button', function () {
      it('should call the click event listener', async function () {
        const clickStub = sinon.stub();
        attrs = { onClick: clickStub };
        _setWrappers();

        await button.trigger('click');
        await wrapper.vm.$nextTick();

        assert.isTrue(clickStub.called);
      });
    });
  });
});
