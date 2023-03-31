import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeCallbarButton from './callbar_button.vue';
import DtTooltip from '@/components/tooltip/tooltip';
import sinon from 'sinon';

// Constants
const basePropsData = {};

describe('DtRecipeCallbarButton Tests', function () {
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
  before(function () {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = sinon.spy();
    global.cancelAnimationFrame = sinon.spy();
    this.localVue = createLocalVue();
  });
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
    listeners = {};
    wrapper.destroy();
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
        assert.isTrue(button.classes().includes('d-bgc-transparent'));
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('When clicking on the button', function () {
      it('should call the click event listener', async function () {
        const clickStub = sinon.stub();
        listeners = { click: clickStub };
        _setWrappers();

        await button.find('button').trigger('click');
        await wrapper.vm.$nextTick();

        assert.isTrue(clickStub.called);
      });
    });
  });
});
