import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import {
  itBehavesLikeAppliesClassToChild,
  itBehavesLikeAppliesChildProp,
} from '../../tests/shared_examples/extendability';
import DtTabGroup from './tab_group.vue';
import DtTabPanel from './tab_panel.vue';
import DtTab from './tab.vue';
import { TAB_LIST_KIND_MODIFIERS, TAB_LIST_SIZE_MODIFIERS, TAB_LIST_IMPORTANCE_MODIFIERS } from './tabs_constants';

const optionTabPanel = [
  {
    id: '2',
    tabId: '1',
    slot: 'First Panel',
  },
  {
    id: '4',
    tabId: '3',
    slot: 'Second Panel',
  },
  {
    id: '6',
    tabId: '5',
    slot: 'Third Panel',
  },
];

const optionTabs = [
  {
    id: '1',
    panelId: '2',
    slot: 'First',
  },
  {
    id: '3',
    panelId: '4',
    selected: true,
    slot: 'Second',
  },
  {
    id: '5',
    panelId: '6',
    label: 'Third Label',
    slot: 'Third',
  },
];

const tabPanelComponents = {
  functional: true,
  render (h) {
    return optionTabPanel.map(option => h(DtTabPanel, { props: option }, option.slot));
  },
};

const tabComponents = {
  functional: true,
  render (h) {
    return optionTabs.map(option => h(DtTab, { props: option }, option.slot));
  },
};

describe('DtTabGroup Tests', function () {
  // Wrappers
  let wrapper;
  let tabList;
  let tabs;
  let tabPanels;

  const propsData = {
    label: 'area-label',
  };

  const _setWrappers = () => {
    tabList = wrapper.find('[role="tablist"]');
    tabPanels = wrapper.findAllComponents(DtTabPanel);
    tabs = wrapper.findAllComponents(DtTab);
  };

  const _mountWrapper = () => {
    wrapper = mount(DtTabGroup, {
      attachTo: document.body,
      localVue: createLocalVue(),
      propsData,
      slots: {
        default: tabPanelComponents,
        tabs: tabComponents,
      },
    });
    _setWrappers();
  };

  describe('Presentation Tests', function () {
    // Setup
    before(async function () {
      _mountWrapper();
    });

    it('should render the component', function () {
      assert.exists(wrapper, 'wrapper exists');
    });

    it('should not emitted on mount', function () {
      assert.strictEqual(wrapper.emitted('change'), undefined);
    });

    describe('Correct size modifiers', function () {
      beforeEach(function () {
        propsData.size = 'sm';
        _mountWrapper();
      });

      it('should have correct class modifier', function () {
        assert.isTrue(tabList.classes(TAB_LIST_SIZE_MODIFIERS.sm));
      });
    });

    describe('Correct kind modifiers', function () {
      beforeEach(function () {
        propsData.inverted = true;
        _mountWrapper();
      });

      it('should have correct kind modifier', function () {
        assert.isTrue(tabList.classes(TAB_LIST_KIND_MODIFIERS.inverted));
      });
    });

    describe('Correct importance modifiers', function () {
      beforeEach(function () {
        propsData.borderless = true;
        _mountWrapper();
      });

      it('should have correct importance modifier', function () {
        assert.isTrue(tabList.classes(TAB_LIST_IMPORTANCE_MODIFIERS.borderless));
      });
    });
  });

  describe('Interactivity Tests', function () {
    describe('When selected is provided', function () {
      beforeEach(function () {
        propsData.selected = optionTabs[1].panelId;
        _mountWrapper();
      });

      it('should set initially selected tab', function () {
        assert.strictEqual(wrapper.vm.provideObj.selected, optionTabs[1].panelId);
        assert.strictEqual(tabs.at(1).attributes('aria-selected'), 'true');
      });
    });

    describe('When selected is updated', function () {
      beforeEach(async function () {
        _mountWrapper();
        // Simulating the third tab being set programmatically after the second tab was selected by a user.
        tabs.at(1).vm.$el.click();
        propsData.selected = optionTabs[2].panelId;
        await wrapper.setProps(propsData);
      });

      it('should override currently selected tab', async function () {
        assert.strictEqual(wrapper.vm.provideObj.selected, optionTabs[2].panelId);
        assert.strictEqual(tabs.at(2).attributes('aria-selected'), 'true');
      });
    });

    describe('Correct selected state', function () {
      beforeEach(async function () {
        optionTabs[0].selected = true;
        optionTabs[1].selected = false;
        _mountWrapper();
      });

      it('selected element should be correct', function () {
        assert.strictEqual(tabs.at(0).attributes('aria-selected'), 'true');
        assert.strictEqual(tabPanels.at(0).attributes('aria-hidden'), 'false');
        assert.strictEqual(tabs.at(1).attributes('aria-selected'), 'false');
        assert.strictEqual(tabPanels.at(1).attributes('aria-hidden'), 'true');
      });
    });

    describe('Correct change event', function () {
      beforeEach(function () {
        tabs.at(1).vm.$el.click();
      });

      it('should emitted on click', function () {
        assert.strictEqual(wrapper.emitted('change').length, 1);
      });
    });

    describe('Correct key navigation', function () {
      describe('On keyup left', function () {
        beforeEach(async function () {
          tabs.at(0).vm.$el.focus();
          await tabList.trigger('keyup.left');
          await tabList.trigger('keyup.space');
        });

        it('selected element should be correct', function () {
          assert.strictEqual(tabs.at(2).attributes('aria-selected'), 'true');
          assert.strictEqual(tabPanels.at(2).attributes('aria-hidden'), 'false');
        });

        describe('On double keyup left and space', function () {
          beforeEach(async function () {
            tabs.at(0).vm.$el.focus();
            await tabList.trigger('keyup.left');
            await tabList.trigger('keyup.left');
            await tabList.trigger('keyup.space');
          });

          it('aria-selected should be "true"', function () {
            assert.strictEqual(tabs.at(1).attributes('aria-selected'), 'true');
          });

          it('aria-hidden should be "false"', function () {
            assert.strictEqual(tabPanels.at(1).attributes('aria-hidden'), 'false');
          });
        });
      });

      describe('On right and enter', function () {
        beforeEach(async function () {
          tabs.at(0).vm.$el.focus();
          await tabList.trigger('keyup.right');
          await tabList.trigger('keyup.enter');
        });

        it('aria-selected should be "true"', function () {
          assert.strictEqual(tabs.at(1).attributes('aria-selected'), 'true');
        });

        it('aria-hidden should be "false"', function () {
          assert.strictEqual(tabPanels.at(1).attributes('aria-hidden'), 'false');
        });

        describe('On double keyup right and enter', function () {
          beforeEach(async function () {
            tabs.at(0).vm.$el.focus();
            await tabList.trigger('keyup.right');
            await tabList.trigger('keyup.right');
            await tabList.trigger('keyup.enter');
          });

          it('aria-selected should be "true"', function () {
            assert.strictEqual(tabs.at(2).attributes('aria-selected'), 'true');
          });

          it('aria-hidden should be "false"', function () {
            assert.strictEqual(tabPanels.at(2).attributes('aria-hidden'), 'false');
          });
        });
      });

      describe('On keydown home and enter', function () {
        beforeEach(async function () {
          tabs.at(2).vm.$el.focus();
          await tabList.trigger('keydown.home');
          await tabList.trigger('keyup.enter');
        });

        it('aria-selected should be "true"', function () {
          assert.strictEqual(tabs.at(0).attributes('aria-selected'), 'true');
        });

        it('aria-hidden should be "false"', function () {
          assert.strictEqual(tabPanels.at(0).attributes('aria-hidden'), 'false');
        });
      });

      describe('On keydown end and enter', function () {
        beforeEach(async function () {
          tabs.at(0).vm.$el.focus();
          await tabList.trigger('keydown.end');
          await tabList.trigger('keyup.enter');
        });

        it('aria-selected should be "true"', function () {
          assert.strictEqual(tabs.at(2).attributes('aria-selected'), 'true');
        });

        it('aria-hidden should be "false"', function () {
          assert.strictEqual(tabPanels.at(2).attributes('aria-hidden'), 'false');
        });
      });
    });
  });

  describe('Accessibility Tests', function () {
    beforeEach(async function () {
      tabs.at(0).vm.$el.focus();
      await tabList.trigger('keyup.enter');
    });

    it('should render correct attributes', function () {
      assert.strictEqual(tabList.attributes('role'), 'tablist');
      assert.strictEqual(tabList.attributes('aria-label'), propsData.label);
    });

    it('should have selected element', function () {
      assert.strictEqual(tabs.at(0).attributes('aria-selected'), 'true');
    });

    describe('Correct aria attributes', function () {
      describe('Attributes after keyup left', function () {
        let lastTab;
        let lastPanel;
        beforeEach(async function () {
          tabs.at(0).vm.$el.focus();
          await tabList.trigger('keyup.left');
          await tabList.trigger('keyup.space');
          lastTab = tabs.at(2).attributes();
          lastPanel = tabPanels.at(2).attributes();
        });

        it('has correct attributes', function () {
          assert.strictEqual(lastTab.id, lastPanel['aria-labelledby']);
          assert.strictEqual(lastTab['aria-controls'], lastPanel.id);
        });
      });

      describe('attributes after keyup right', function () {
        beforeEach(async function () {
          tabs.at(0).vm.$el.focus();
          await tabList.trigger('keyup.right');
          await tabList.trigger('keyup.enter');
        });

        it('should have correct id for aria-labelledby and aria-controls', function () {
          const tabAttrs = tabs.at(1).attributes();
          const tabPanelAttrs = tabPanels.at(1).attributes();
          assert.strictEqual(tabAttrs.id, tabPanelAttrs['aria-labelledby']);
          assert.strictEqual(tabAttrs['aria-controls'], tabPanelAttrs.id);
        });
      });

      describe('attributes after keydown home', function () {
        beforeEach(async function () {
          tabs.at(2).vm.$el.focus();
          await tabList.trigger('keydown.home');
          await tabList.trigger('keyup.enter');
        });

        it('should have correct id for aria-labelledby and aria-controls', function () {
          const tabAttrs = tabs.at(0).attributes();
          const tabPanelAttrs = tabPanels.at(0).attributes();
          assert.strictEqual(tabAttrs.id, tabPanelAttrs['aria-labelledby']);
          assert.strictEqual(tabAttrs['aria-controls'], tabPanelAttrs.id);
        });
      });

      describe('attributes after keydown end', function () {
        beforeEach(async function () {
          tabs.at(0).vm.$el.focus();
          await tabList.trigger('keydown.end');
          await tabList.trigger('keyup.enter');
        });

        it('should have correct id for aria-labelledby and aria-controls', function () {
          const tabAttrs = tabs.at(2).attributes();
          const tabPanelAttrs = tabPanels.at(2).attributes();
          assert.strictEqual(tabAttrs.id, tabPanelAttrs['aria-labelledby']);
          assert.strictEqual(tabAttrs['aria-controls'], tabPanelAttrs.id);
        });
      });
    });
  });

  describe('Extendability Tests', function () {
    describe('When tab list class is provided', function () {
      beforeEach(function () {
        propsData.tabListClass = 'my-custom-class';
        _mountWrapper();
      });

      it('should apply custom class to tab list', function () {
        itBehavesLikeAppliesClassToChild(wrapper, '.my-custom-class', tabList);
      });
    });

    describe('When tab list child props are provided', function () {
      beforeEach(function () {
        propsData.tabListChildProps = { some: 'prop' };
        _mountWrapper();
      });

      it('tab list should have provided child prop', function () {
        itBehavesLikeAppliesChildProp(tabList, 'some', 'prop');
      });
    });
  });
});
