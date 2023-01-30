import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtTabPanel from './tab_panel.vue';
import { flushPromises } from '@/common/utils';

describe('DtTabPanel Tests', function () {
  // Wrappers
  let wrapper;
  let tabPanel;
  const defaultSlot = 'Panel Slot';

  const slots = { default: defaultSlot };
  const groupContext = {
    disabled: false,
    selected: '',
  };
  const propsData = {
    id: '1',
    tabId: '2',
  };
  const _setWrappers = () => {
    tabPanel = wrapper.find('[data-qa="dt-tab-panel"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtTabPanel, {
      slots,
      propsData,
      global: {
        provide: {
          groupContext,
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

    it('should render the default slot', function () {
      assert.strictEqual(tabPanel.text(), defaultSlot);
    });

    describe('Attributes', function () {
      it('id attribute should be content the prop id', function () {
        assert.strictEqual(tabPanel.attributes('id'), `dt-panel-${propsData.id}`);
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('Selected state', function () {
      beforeEach(function () {
        groupContext.selected = propsData.id;
        _mountWrapper();
      });

      it('default slot should be shown', function () {
        assert.strictEqual(tabPanel.text(), defaultSlot);
      });
    });

    describe('Hidden state', function () {
      beforeEach(function () {
        groupContext.selected = propsData.id;
        _mountWrapper();
      });

      describe('Hidden by prop', function () {
        before(function () {
          propsData.hidden = true;
        });

        after(function () {
          propsData.hidden = false;
        });

        it('aria-hidden should be "true"', function () {
          assert.strictEqual(tabPanel.attributes('aria-hidden'), 'true');
        });
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('Unselected aria-hidden', function () {
      beforeEach(function () {
        groupContext.selected = propsData.id;
        _mountWrapper();
      });

      it('aria-hidden should be "false"', function () {
        assert.strictEqual(tabPanel.attributes('aria-hidden'), 'false');
      });
    });

    describe('Default A11y Attrs', function () {
      beforeEach(function () {
        groupContext.selected = '';
        _mountWrapper();
      });

      it('aria-hidden should be "true"', function () {
        assert.strictEqual(tabPanel.attributes('aria-hidden'), 'true');
      });

      it('aria-labelledby should be match the tab id', function () {
        assert.strictEqual(tabPanel.attributes('aria-labelledby'), `dt-tab-${propsData.tabId}`);
      });

      it('role should be "tabpanel"', function () {
        assert.strictEqual(tabPanel.attributes('role'), 'tabpanel');
      });

      it('tabindex should be "0" if the first element is not focusable', function () {
        assert.strictEqual(tabPanel.attributes('tabindex'), '0');
      });
    });

    describe('When the first element is focusable', function () {
      beforeEach(async function () {
        slots.default = '<div><button>Focusable Slot</button></div>';
        await _mountWrapper();
        await flushPromises();
        _setWrappers();
      });

      it('tabindex should be "-1"', function () {
        assert.strictEqual(tabPanel.attributes('tabindex'), '-1');
      });
    });

    describe(`When there is a focusable element but it isn't the first element`, function () {
      beforeEach(async function () {
        slots.default = '<h1>Content</h1><div><button>Focusable Slot</button></div>';
        await _mountWrapper();
        await flushPromises();
        _setWrappers();
      });

      it('tabindex should be "0"', function () {
        assert.strictEqual(tabPanel.attributes('tabindex'), '0');
      });
    });
  });
});
