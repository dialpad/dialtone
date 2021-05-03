import { createLocalVue, shallowMount } from '@vue/test-utils';
import { assert } from 'chai';
import sinon from 'sinon';
import BaseButton from './button.vue';
import EmptyComponentFixture from '../../tests/fixtures/component.vue';

describe('Handset button tests', function () {
  let wrapper;
  let button;
  let icon;
  let label;

  let buttonStub;
  let listeners;
  let propsData;

  let _setElements;

  describe('Tests without icon slot', function () {
    before(function () {
      this.localVue = createLocalVue();
    });

    beforeEach(function () {
      buttonStub = sinon.stub();
      listeners = { click: buttonStub };
      propsData = {};
      wrapper = shallowMount(BaseButton, { listeners, propsData, localVue: this.localVue });
      _setElements = function () {
        button = wrapper.find('.base-button__button');
        icon = wrapper.find('.base-button__icon');
        label = wrapper.find('.base-button__label');
      };
      _setElements();
    });

    it('Should render the native button', function () {
      assert.exists(wrapper, 'wrapper exists');
      assert.isTrue(button.exists(), '<button> native html must be rendered');
    });

    it('Should add appropriate main d-btn class to button based on props', async function () {
      // Default (no props) button should be d-btn--primary
      assert.isTrue(button.classes().includes('d-btn--primary'));

      // Test that main class is populated with input props
      let props = {
        circle: true,
        kind: 'danger',
        importance: 'primary',
        loading: true,
      };
      await wrapper.setProps(props);
      button = wrapper.find('.base-button__button');
      assert.isTrue(button.classes().includes('d-btn--circle--danger--primary--loading'));

      // Test that main class uses empty modifiers when bad props are passed in
      props = {
        circle: false,
        kind: 'fake kind',
        importance: 'fake importance',
        loading: false,
      };

      await wrapper.setProps(props);
      assert.isTrue(button.classes().includes('d-btn'));
    });

    it('Should add appropriate size class to button based on props', async function () {
      // Default (no props) button should be d-btn (i.e. medium size)
      assert.isTrue(button.classes().includes('d-btn'));

      // Test that main class is populated with input props
      let props = {
        circle: true,
        size: 'xl',
      };
      await wrapper.setProps(props);
      button = wrapper.find('.base-button__button');
      assert.isTrue(button.classes().includes('d-btn--circle--xl'));

      // Test that main class should use empty modifiers when provided props are not supported
      props = {
        circle: false,
        size: 'extra medium',
      };
      await wrapper.setProps(props);
      assert.isTrue(button.classes().includes('d-btn'));
    });

    it('Should add appropriate link class to button based on props', async function () {
      const props = { link: false };
      await wrapper.setProps(props);
      // If link is false, should not assign d-link classes to button
      assert.isEmpty(button.classes().filter(bc => bc.includes('d-link')));

      // Test that link class uses empty modifiers when provided props are not supported
      props.link = true;
      props.linkKind = 'fake kind';
      await wrapper.setProps(props);
      button = wrapper.find('.base-button__button');
      assert.isTrue(button.classes().includes('d-link'));

      // Test when all props are valid
      props.linkKind = 'danger';
      props.linkInverted = true;

      await wrapper.setProps(props);
      assert.isTrue(button.classes().includes('d-link--inverted--danger'));
    });

    it('Should call listener if associated action happens', async function () {
      assert.isFalse(buttonStub.called);
      await button.trigger('click');
      assert.isTrue(buttonStub.called);
      assert.equal(wrapper.emitted().click);
    });
  });

  describe('Tests with icon slot', function () {
    beforeEach(function () {
      buttonStub = sinon.stub();
      listeners = { click: buttonStub };
      propsData = {};
      wrapper = shallowMount(BaseButton, {
        listeners,
        propsData,
        slots: {
          icon: EmptyComponentFixture,
        },
        localVue: this.localVue,
      });
      _setElements();
    });

    it('Should add appropriate position class to button based on props', async function () {
      assert.isFalse(button.classes().includes('button__left-align'));

      await wrapper.setProps({ iconPosition: 'left-align' });

      button = wrapper.find('.base-button__button');
      assert.isTrue(button.classes().includes('button__left-align'));
    });

    it('Should add appropriate position class to icon based on props', async function () {
      await wrapper.setProps({ iconPosition: 'right-align' });

      icon = wrapper.find('.base-button__icon');
      assert.isTrue(icon.classes().includes('d-btn__icon--last'));
    });

    it('Should add appropriate position class to label based on props', async function () {
      await wrapper.setProps({ iconPosition: 'split-left' });

      label = wrapper.find('.base-button__label');
      assert.isTrue(label.classes().includes('d-flex1'));
      assert.isFalse(label.classes().includes('button__label__right-align'));

      await wrapper.setProps({ iconPosition: 'right-align' });

      label = wrapper.find('.base-button__label');
      assert.isTrue(label.classes().includes('d-flex1'));
      assert.isTrue(label.classes().includes('button__label__right-align'));
    });
  });
});
