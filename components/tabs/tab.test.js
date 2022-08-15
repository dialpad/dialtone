import { assert } from 'chai';
import sinon from 'sinon';
import { mount } from '@vue/test-utils';
import DtTab from './tab.vue';
import { TAB_IMPORTANCE_MODIFIERS } from './tabs_constants.js';

describe('DtTab Tests', function () {
  // Wrappers
  let wrapper;
  let tab;
  const panelId = '2';
  const label = 'area-label';
  const id = '1';
  const defaultSlot = 'Message Slot';

  const slots = { default: defaultSlot };
  const groupContext = {
    disabled: false,
    selected: '',
  };
  const propsData = {
    id,
    panelId,
    label,
  };
  const _setWrappers = () => {
    tab = wrapper.find('[data-qa="dt-tab"]');
  };
  const changeContentPanel = sinon.spy();
  const _mountWrapper = () => {
    wrapper = mount(DtTab, {
      slots,
      propsData,
      global: {
        provide: {
          setFocus: sinon.spy(),
          groupContext,
          changeContentPanel,
        },
      },
    });
    _setWrappers();
  };

  describe('Presentation Tests', function () {
    // Setup
    _mountWrapper();

    it('should render the component', function () {
      assert.exists(wrapper, 'wrapper exists');
    });

    it('should have default class', function () {
      assert.isTrue(tab.classes('d-tab'));
    });

    it('should render the slot', function () {
      assert.strictEqual(tab.text(), defaultSlot);
    });

    describe('Selected by default', function () {
      beforeEach(function () {
        propsData.selected = true;
        _mountWrapper();
      });

      it('changeContentPanel should be called with valid data', function () {
        assert.isTrue(changeContentPanel.calledWith({
          selected: propsData.panelId,
          selectOverride: true,
        }));
      });
    });

    describe('Attributes', function () {
      it('id should match the provided id', function () {
        assert.strictEqual(tab.attributes('id'), `dt-tab-${id}`);
      });

      it('tabindex should be -1 ', function () {
        assert.strictEqual(tab.attributes('tabindex'), '-1');
      });

      it('should not be disabled', function () {
        assert.strictEqual(tab.attributes('disabled'), undefined);
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('Selected state', function () {
      beforeEach(function () {
        groupContext.selected = panelId;
        _mountWrapper();
      });

      it('tab classes should content selected class', function () {
        assert.isTrue(tab.classes(TAB_IMPORTANCE_MODIFIERS.selected));
      });
    });

    describe('Unselected state', function () {
      beforeEach(function () {
        groupContext.selected = '';
        _mountWrapper();
      });

      it('tab classes should not content selected class', function () {
        assert.isFalse(tab.classes(TAB_IMPORTANCE_MODIFIERS.selected));
      });
    });

    describe('Disabled state', function () {
      beforeEach(function () {
        _mountWrapper();
      });

      describe('Disabled by inject', function () {
        before(function () {
          groupContext.disabled = true;
        });

        after(function () {
          groupContext.disabled = false;
        });

        it('should be disabled', function () {
          assert.strictEqual(tab.element.disabled, true);
        });
      });

      describe('Disabled by prop', function () {
        before(function () {
          propsData.disabled = true;
        });

        after(function () {
          propsData.disabled = false;
        });

        it('disabled attribute should be "true"', function () {
          assert.strictEqual(tab.element.disabled, true);
        });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('Default A11y Attrs', function () {
      it('aria-selected should be "false"', function () {
        assert.strictEqual(tab.attributes('aria-selected'), 'false');
      });

      it('aria-controls should content the panel id', function () {
        assert.strictEqual(tab.attributes('aria-controls'), `dt-panel-${panelId}`);
      });

      it('aria-label should match the provided label', function () {
        assert.strictEqual(tab.attributes('aria-label'), label);
      });

      it('role should be tab', function () {
        assert.strictEqual(tab.attributes('role'), 'tab');
      });
    });

    describe('When panel is selected', function () {
      beforeEach(function () {
        groupContext.selected = panelId;
        _mountWrapper();
      });

      it('aria-selected should be "true"', function () {
        assert.strictEqual(tab.attributes('aria-selected'), 'true');
      });

      it('tabindex should be 0', function () {
        assert.strictEqual(tab.attributes('tabindex'), '0');
      });
    });

    describe('When panel is unselected', function () {
      beforeEach(function () {
        groupContext.selected = '';
        _mountWrapper();
      });

      it('aria-selected should be "false"', function () {
        assert.strictEqual(tab.attributes('aria-selected'), 'false');
      });

      it('tabindex should be -1', function () {
        assert.strictEqual(tab.attributes('tabindex'), '-1');
      });
    });
  });
});
