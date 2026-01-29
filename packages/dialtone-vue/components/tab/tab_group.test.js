import { mount } from '@vue/test-utils';
import DtTabGroup from './tab_group.vue';
import DtTabPanel from './tab_panel.vue';
import DtTab from './tab.vue';
import { returnFirstEl } from '@/common/utils';
import { TAB_LIST_KIND_MODIFIERS, TAB_LIST_SIZE_MODIFIERS, TAB_LIST_IMPORTANCE_MODIFIERS } from './tabs_constants';
import { h } from 'vue';

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
  render () {
    return h('div', {}, optionTabPanel.map(option => h(DtTabPanel, { id: option.id, tabId: option.tabId }, () => option.slot)));
  },
};

const tabComponents = {
  render () {
    return h('div', {}, optionTabs.map(option => h(DtTab, { id: option.id, panelId: option.panelId, selected: option.selected, label: option.label }, () => option.slot)));
  },
};

const baseAttributes = {};

describe('DtTabGroup Tests', () => {
  // Wrappers
  let wrapper;
  let tabList;
  let tabs;
  let tabPanels;
  let attrs;

  const props = {
    label: 'area-label',
  };

  beforeEach(() => {
    attrs = baseAttributes;
  });

  const _setWrappers = () => {
    tabList = wrapper.find('[role="tablist"]');
    tabPanels = wrapper.findAllComponents(DtTabPanel);
    tabs = wrapper.findAllComponents(DtTab);
  };

  const _mountWrapper = () => {
    wrapper = mount(DtTabGroup, {
      attachTo: document.body,
      props,
      attrs,
      slots: {
        default: tabPanelComponents,
        tabs: tabComponents,
      },
    });
    _setWrappers();
  };

  beforeEach(() => {
    _mountWrapper();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    // Setup
    beforeAll(async () => {
      _mountWrapper();
    });

    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should not emitted on mount', () => {
      expect(wrapper.emitted('change')).toBeUndefined();
    });

    describe('Correct size modifiers', () => {
      beforeEach(() => {
        props.size = 'sm';
        _mountWrapper();
      });

      it('should have correct class modifier', () => {
        expect(tabList.classes(TAB_LIST_SIZE_MODIFIERS.sm)).toBe(true);
      });
    });

    describe('Correct kind modifiers', () => {
      beforeEach(() => {
        props.inverted = true;
        _mountWrapper();
      });

      it('should have correct kind modifier', () => {
        expect(tabList.classes(TAB_LIST_KIND_MODIFIERS.inverted)).toBe(true);
      });
    });

    describe('Correct importance modifiers', () => {
      beforeEach(() => {
        props.borderless = true;
        _mountWrapper();
      });

      it('should have correct importance modifier', () => {
        expect(tabList.classes(TAB_LIST_IMPORTANCE_MODIFIERS.borderless)).toBe(true);
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When selected is provided', () => {
      beforeEach(() => {
        props.selected = optionTabs[1].panelId;
        _mountWrapper();
      });

      it('should set initially selected tab', () => {
        expect(wrapper.vm.provideObj.selected).toBe(optionTabs[1].panelId);
        expect(tabs.at(1).attributes('aria-selected')).toBe('true');
      });
    });

    describe('When selected is updated', () => {
      beforeEach(async () => {
        _mountWrapper();
        // Simulating the third tab being set programmatically after the second tab was selected by a user.
        returnFirstEl(tabs.at(1).vm.$el).click();
        props.selected = optionTabs[2].panelId;
        await wrapper.setProps(props);
      });

      it('should override currently selected tab', async () => {
        expect(wrapper.vm.provideObj.selected).toBe(optionTabs[2].panelId);
        expect(tabs.at(2).attributes('aria-selected')).toBe('true');
      });
    });

    describe('Correct selected state', () => {
      beforeEach(async () => {
        optionTabs[0].selected = true;
        optionTabs[1].selected = false;
        _mountWrapper();
      });

      it('selected element should be correct', () => {
        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
        expect(tabPanels.at(0).attributes('aria-hidden')).toBe('false');
        expect(tabs.at(1).attributes('aria-selected')).toBe('false');
        expect(tabPanels.at(1).attributes('aria-hidden')).toBe('true');
      });
    });

    describe('Correct change event', () => {
      beforeEach(() => {
        returnFirstEl(tabs.at(1).vm.$el).click();
      });

      it('should emitted on click', () => {
        expect(wrapper.emitted('change').length).toBe(1);
      });
    });

    describe('Correct before-change event', () => {
      beforeEach(() => {
        returnFirstEl(tabs.at(1).vm.$el).click();
      });

      it('should emitted on click', () => {
        expect(wrapper.emitted('before-change').length).toBe(1);
      });
    });

    describe('Correct key navigation', () => {
      describe('On keyup left', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keyup.left');
          await tabList.trigger('keyup.space');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(2).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(2).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On double keyup left and space', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keyup.left');
          await tabList.trigger('keyup.left');
          await tabList.trigger('keyup.space');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(1).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(1).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On right and enter', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keyup.right');
          await tabList.trigger('keyup.enter');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(1).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(1).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On double keyup right and enter', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keyup.right');
          await tabList.trigger('keyup.right');
          await tabList.trigger('keyup.enter');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(2).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(2).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On keydown home and enter', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(2).vm.$el).focus();
          await tabList.trigger('keydown.home');
          await tabList.trigger('keyup.enter');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(0).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(0).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On keydown end and enter', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.end');
          await tabList.trigger('keyup.enter');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(2).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(2).attributes('aria-hidden')).toBe('false');
        });
      });
    });

    describe('When before-change prevents default event', () => {
      beforeEach(async () => {
        attrs = {
          onBeforeChange: (event) => {
            event.preventDefault();
          },
        };

        _mountWrapper();

        returnFirstEl(tabs.at(0).vm.$el).click();
      });

      it('Should prevent the change event', async () => {
        expect(wrapper.emitted('change')).toBeUndefined();
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keyup.enter');
    });

    it('should render correct attributes', () => {
      expect(tabList.attributes('role')).toBe('tablist');
      expect(tabList.attributes('aria-label')).toBe(props.label);
    });

    it('should have selected element', () => {
      expect(tabs.at(0).attributes('aria-selected')).toBe('true');
    });

    describe('Correct aria attributes', () => {
      describe('Attributes after keyup left', () => {
        let lastTab;
        let lastPanel;
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keyup.left');
          await tabList.trigger('keyup.space');
          lastTab = tabs.at(2).attributes();
          lastPanel = tabPanels.at(2).attributes();
        });

        it('has correct attributes', () => {
          expect(lastTab.id).toBe(lastPanel['aria-labelledby']);
          expect(lastTab['aria-controls']).toBe(lastPanel.id);
        });
      });

      describe('attributes after keyup right', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keyup.right');
          await tabList.trigger('keyup.enter');
        });

        it(
          'should have correct id for aria-labelledby and aria-controls',
          () => {
            const tabAttrs = tabs.at(1).attributes();
            const tabPanelAttrs = tabPanels.at(1).attributes();
            expect(tabAttrs.id).toBe(tabPanelAttrs['aria-labelledby']);
            expect(tabAttrs['aria-controls']).toBe(tabPanelAttrs.id);
          },
        );
      });

      describe('attributes after keydown home', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(2).vm.$el).focus();
          await tabList.trigger('keydown.home');
          await tabList.trigger('keyup.enter');
        });

        it(
          'should have correct id for aria-labelledby and aria-controls',
          () => {
            const tabAttrs = tabs.at(0).attributes();
            const tabPanelAttrs = tabPanels.at(0).attributes();
            expect(tabAttrs.id).toBe(tabPanelAttrs['aria-labelledby']);
            expect(tabAttrs['aria-controls']).toBe(tabPanelAttrs.id);
          },
        );
      });

      describe('attributes after keydown end', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.end');
          await tabList.trigger('keyup.enter');
        });

        it(
          'should have correct id for aria-labelledby and aria-controls',
          () => {
            const tabAttrs = tabs.at(2).attributes();
            const tabPanelAttrs = tabPanels.at(2).attributes();
            expect(tabAttrs.id).toBe(tabPanelAttrs['aria-labelledby']);
            expect(tabAttrs['aria-controls']).toBe(tabPanelAttrs.id);
          },
        );
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When tab list class is provided', () => {
      beforeEach(() => {
        props.tabListClass = 'my-custom-class';
        _mountWrapper();
      });

      it('should apply custom class to tab list', () => {
        expect(wrapper.find('.my-custom-class').html()).toBe(tabList.html());
      });
    });

    describe('When tab list child props are provided', () => {
      beforeEach(() => {
        props.tabListChildProps = { some: 'prop' };
        _mountWrapper();
      });

      it('tab list should have provided child prop', () => {
        expect(tabList.attributes('some')).toBe('prop');
      });
    });
  });
});
