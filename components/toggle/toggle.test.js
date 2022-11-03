import { createLocalVue, shallowMount } from '@vue/test-utils';
import { assert } from 'chai';
import DtToggle from './toggle.vue';
import sinon from 'sinon';
import Vue from 'vue';
import {
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';

// Constants
const basePropsData = {};
const baseSlotData = { default: 'My Toggle Label' };

describe('DtToggle Tests', function () {
  // Wrappers
  let wrapper;
  let button;
  let label;
  let icon;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = baseSlotData;
  let provide = {};
  let listeners = {};

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.find('button');
    label = wrapper.find('[data-qa="toggle-label"]');
    icon = wrapper.find('.d-toggle__inner');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtToggle, {
      propsData,
      attrs,
      slots,
      provide,
      listeners,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = baseSlotData;
    provide = {};
    listeners = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('Common toggle button attrs', function () {
      // Test Setup
      beforeEach(function () {
        _setWrappers();
      });
      it('should exist', function () { assert.isTrue(wrapper.exists()); });
      it('should have d-toggle class', function () {
        assert.isTrue(button.classes().includes('d-toggle'));
      });
      it('should have type button', function () { assert.strictEqual(button.attributes('type'), 'button'); });
      it('should have role switch', function () { assert.strictEqual(button.attributes('role'), 'switch'); });

      it('should show the icon', function () {
        assert.isTrue(icon.exists());
      });

      it('should hide the icon when showIcon prop is false', async function () {
        await wrapper.setProps({ showIcon: false });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
        assert.isFalse(icon.exists());
      });

      describe('disabled behaviour', function () {
        it('should set correct disabled attributes when disabled prop is false', function () {
          assert.strictEqual(button.attributes('aria-disabled'), 'false');
          assert.isUndefined(button.attributes().disabled);
          assert.isFalse(button.classes().includes('d-toggle--disabled'));
        });

        it('should set correct disabled attributes when disabled prop is true', async function () {
          await wrapper.setProps({ disabled: true });
          assert.strictEqual(button.attributes('aria-disabled'), 'true');
          assert.equal(button.attributes().disabled, 'disabled');
          assert.isTrue(button.classes().includes('d-toggle--disabled'));
        });

        it('should set correct size class', async function () {
          await wrapper.setProps({ size: 'sm' });
          assert.isTrue(button.classes().includes('d-toggle--small'));
        });
      });
    });
    describe('Unchecked Toggle', function () {
      // Test Setup
      beforeEach(function () {
        propsData = {
          ...basePropsData,
          checked: false,
        };
        _setWrappers();
      });

      it('should exist', function () { assert.isTrue(wrapper.exists()); });

      describe('checked behaviour', function () {
        it('should set correct checked attributes when checked prop is false', function () {
          assert.strictEqual(button.attributes('aria-checked'), 'false');
          assert.isFalse(button.classes().includes('d-toggle--checked'));
        });
      });

      describe('label behaviour', function () {
        it('should exist', function () { assert.isTrue(label.exists()); });
        it('should match provided label prop', function () { assert.strictEqual(label.text(), slots.default); });
      });
    });

    describe('Checked Toggle', function () {
      // Test Setup
      beforeEach(function () {
        propsData = {
          ...basePropsData,
          checked: true,
          disabled: false,
        };
        _setWrappers();
      });

      it('should exist', function () { assert.isTrue(wrapper.exists()); });

      describe('checked behaviour', function () {
        it('should set correct checked attributes when checked prop is true', function () {
          assert.strictEqual(button.attributes('aria-checked'), 'true');
          assert.isTrue(button.classes().includes('d-toggle--checked'));
        });
      });

      describe('label behaviour', function () {
        it('should exist', function () { assert.isTrue(label.exists()); });
        it('should match provided label prop', function () { assert.strictEqual(label.text(), slots.default); });
      });
    });

    describe('Indeterminate Toggle', function () {
      // Test Setup
      beforeEach(function () {
        propsData = {
          ...basePropsData,
          checked: 'mixed',
        };
        _setWrappers();
      });

      it('should set indeterminate state when checked prop is mixed', function () {
        assert.isTrue(button.classes().includes('d-toggle--indeterminate'));
      });

      it('should set the correct aria-checked attribute', function () {
        assert.equal(button.attributes('aria-checked'), 'mixed');
      });
    });

    describe('Accessibility Tests', function () {
      describe('aria-label validations', function () {
        const warningMessage = 'You must provide an aria-label when there is no label passed';

        before(function () {
          Vue.config.silent = true;
          sinon.spy(Vue.util, 'warn');
        });

        after(function () {
          Vue.util.warn.restore();
          Vue.config.silent = false;
        });

        describe('should not throw a Vue error if a label is provided', function () {
          before(function () {
            propsData = basePropsData;
            slots = { default: 'My Label' };
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('should not throw a Vue error if a label is not provided, but an aria-label attr exists', function () {
          before(function () {
            propsData = { ...basePropsData };
            attrs = { 'aria-label': 'my label' };
            slots = {};
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('When neither ariaLabel attr nor a default slot exists', function () {
          before(function () {
            propsData = { ...basePropsData };
            attrs = {};
            slots = {};
            _setWrappers();
          });
          itBehavesLikeRaisesSingleVueWarning(warningMessage);
        });
      });
    });
  });
});
