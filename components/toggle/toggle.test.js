import { mount } from '@vue/test-utils';
import { assert } from 'chai';
import DtToggle from './toggle.vue';
import sinon from 'sinon';
import {
  itBehavesLikeDoesNotRaiseAnyVueWarnings,
  itBehavesLikeRaisesSingleVueWarning,
} from '../../tests/shared_examples/validation';

// Constants
const baseProps = {};
const baseSlotData = { default: 'My Toggle Label' };

describe('DtToggle Tests', function () {
  // Wrappers
  let wrapper;
  let button;
  let label;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = baseSlotData;

  // Helpers
  const _setChildWrappers = () => {
    button = wrapper.find('button');
    label = wrapper.find('[data-qa="toggle-label"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtToggle, {
      props,
      attrs,
      slots,
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {});

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = baseSlotData;
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

      describe('disabled behaviour', function () {
        it('should set correct disabled attributes when disabled prop is false', function () {
          assert.strictEqual(button.attributes('aria-disabled'), 'false');
          assert.isUndefined(button.attributes().disabled);
          assert.isFalse(button.classes().includes('d-toggle--disabled'));
        });

        it('should set correct disabled attributes when disabled prop is true', async function () {
          await wrapper.setProps({ disabled: true });
          assert.strictEqual(button.attributes('aria-disabled'), 'true');
          assert.strictEqual(button.element.disabled, true);
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
        props = {
          ...baseProps,
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
        props = {
          ...baseProps,
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

    describe('Accessibility Tests', function () {
      describe('aria-label validations', function () {
        const warningMessage = '[Vue warn]: You must provide an aria-label when there is no label passed';

        // Test Setup
        before(function () {
          sinon.spy(console, 'warn');
        });

        // Test Teardown
        after(function () {
          console.warn.restore();
        });

        describe('should not throw a Vue error if a label is provided', function () {
          before(function () {
            props = baseProps;
            slots = { default: 'My Label' };
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('should not throw a Vue error if a label is not provided, but an aria-label attr exists', function () {
          before(function () {
            props = { ...baseProps };
            attrs = { 'aria-label': 'my label' };
            slots = {};
            _setWrappers();
          });
          itBehavesLikeDoesNotRaiseAnyVueWarnings();
        });

        describe('When neither ariaLabel attr nor a default slot exists', function () {
          before(function () {
            props = { ...baseProps };
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
