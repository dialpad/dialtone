import { mount } from '@vue/test-utils';
import DtTabGroup from './tab_group.vue';
import DtTabPanel from './tab_panel.vue';
import DtTab from './tab.vue';
import { returnFirstEl } from '@/common/utils';
import { TAB_LIST_KIND_MODIFIERS, TAB_LIST_SIZE_MODIFIERS, TAB_LIST_IMPORTANCE_MODIFIERS, TAB_ORIENTATION_MODIFIERS, TAB_SPREAD_MODIFIERS } from './tabs_constants';
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

    describe('Correct spread modifiers', () => {
      afterEach(() => {
        delete props.spread;
        delete props.orientation;
      });

      it('should apply spread modifier when spread is grow', () => {
        props.spread = 'grow';
        _mountWrapper();

        expect(tabList.classes(TAB_SPREAD_MODIFIERS.grow)).toBe(true);
      });

      it('should apply spread-equal modifier when spread is equal', () => {
        props.spread = 'equal';
        _mountWrapper();

        expect(tabList.classes(TAB_SPREAD_MODIFIERS.equal)).toBe(true);
      });

      it('should not apply spread modifier when orientation is vertical', () => {
        props.spread = 'grow';
        props.orientation = 'vertical';
        _mountWrapper();

        expect(tabList.classes(TAB_SPREAD_MODIFIERS.grow)).toBe(false);
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
      describe('On arrow left', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.left');
          await tabList.trigger('keydown.space');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(2).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(2).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On double arrow left and space', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.left');
          await tabList.trigger('keydown.left');
          await tabList.trigger('keydown.space');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(1).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(1).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On right and enter', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.right');
          await tabList.trigger('keydown.enter');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(1).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(1).attributes('aria-hidden')).toBe('false');
        });
      });

      describe('On double arrow right and enter', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.right');
          await tabList.trigger('keydown.right');
          await tabList.trigger('keydown.enter');
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
          await tabList.trigger('keydown.enter');
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
          await tabList.trigger('keydown.enter');
        });

        it('selected element should be correct', () => {
          expect(tabs.at(2).attributes('aria-selected')).toBe('true');
          expect(tabPanels.at(2).attributes('aria-hidden')).toBe('false');
        });
      });
    });

    describe('When a tab is disabled', () => {
      const disabledTabComponents = {
        render () {
          return h('div', {}, [
            h(DtTab, { id: '1', panelId: '2', selected: true }, () => 'First'),
            h(DtTab, { id: '3', panelId: '4', disabled: true }, () => 'Second'),
            h(DtTab, { id: '5', panelId: '6' }, () => 'Third'),
          ]);
        },
      };

      beforeEach(() => {
        wrapper = mount(DtTabGroup, {
          attachTo: document.body,
          props: { label: 'area-label' },
          slots: {
            tabs: disabledTabComponents,
            default: tabPanelComponents,
          },
        });
        _setWrappers();
      });

      it('should land on disabled tab on arrow right', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');

        expect(document.activeElement.id).toBe('dt-tab-3');
        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
      });

      it('should land on disabled tab on arrow left', async () => {
        returnFirstEl(tabs.at(2).vm.$el).focus();
        await tabList.trigger('keydown.left');

        expect(document.activeElement.id).toBe('dt-tab-3');
        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
      });

      it('should not select disabled tab on enter', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');
        await tabList.trigger('keydown.enter');

        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
        expect(tabs.at(1).attributes('aria-selected')).toBe('false');
        expect(wrapper.emitted('change')).toBeUndefined();
      });

      it('should not select disabled tab on space', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');
        await tabList.trigger('keydown.space');

        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
        expect(tabs.at(1).attributes('aria-selected')).toBe('false');
        expect(wrapper.emitted('change')).toBeUndefined();
      });

      it('should focus first tab on home even if disabled', async () => {
        const firstDisabledTabs = {
          render () {
            return h('div', {}, [
              h(DtTab, { id: '1', panelId: '2', disabled: true }, () => 'First'),
              h(DtTab, { id: '3', panelId: '4', selected: true }, () => 'Second'),
              h(DtTab, { id: '5', panelId: '6' }, () => 'Third'),
            ]);
          },
        };

        wrapper.unmount();
        wrapper = mount(DtTabGroup, {
          attachTo: document.body,
          props: { label: 'area-label' },
          slots: {
            tabs: firstDisabledTabs,
            default: tabPanelComponents,
          },
        });
        _setWrappers();

        returnFirstEl(tabs.at(2).vm.$el).focus();
        await tabList.trigger('keydown.home');

        expect(document.activeElement.id).toBe('dt-tab-1');
        expect(tabs.at(1).attributes('aria-selected')).toBe('true');
      });

      it('should focus last tab on end even if disabled', async () => {
        const lastDisabledTabs = {
          render () {
            return h('div', {}, [
              h(DtTab, { id: '1', panelId: '2', selected: true }, () => 'First'),
              h(DtTab, { id: '3', panelId: '4' }, () => 'Second'),
              h(DtTab, { id: '5', panelId: '6', disabled: true }, () => 'Third'),
            ]);
          },
        };

        wrapper.unmount();
        wrapper = mount(DtTabGroup, {
          attachTo: document.body,
          props: { label: 'area-label' },
          slots: {
            tabs: lastDisabledTabs,
            default: tabPanelComponents,
          },
        });
        _setWrappers();

        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.end');

        expect(document.activeElement.id).toBe('dt-tab-5');
        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
      });
    });

    describe('When a tab is disabled in auto activation mode', () => {
      const disabledTabComponents = {
        render () {
          return h('div', {}, [
            h(DtTab, { id: '1', panelId: '2', selected: true }, () => 'First'),
            h(DtTab, { id: '3', panelId: '4', disabled: true }, () => 'Second'),
            h(DtTab, { id: '5', panelId: '6' }, () => 'Third'),
          ]);
        },
      };

      beforeEach(() => {
        wrapper = mount(DtTabGroup, {
          attachTo: document.body,
          props: { label: 'area-label', activationMode: 'auto' },
          slots: {
            tabs: disabledTabComponents,
            default: tabPanelComponents,
          },
        });
        _setWrappers();
      });

      it('should focus disabled tab but not auto-select it', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');

        expect(document.activeElement.id).toBe('dt-tab-3');
        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
        expect(wrapper.emitted('change')).toBeUndefined();
      });

      it('should auto-select enabled tab', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');
        await tabList.trigger('keydown.right');

        expect(document.activeElement.id).toBe('dt-tab-5');
        expect(tabs.at(2).attributes('aria-selected')).toBe('true');
        expect(wrapper.emitted('change').length).toBe(1);
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

  describe('Automatic activation mode', () => {
    beforeEach(() => {
      props.activationMode = 'auto';
      _mountWrapper();
    });

    it('should select tab on arrow right', async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keydown.right');

      expect(tabs.at(1).attributes('aria-selected')).toBe('true');
      expect(wrapper.emitted('change').length).toBe(1);
    });

    it('should select tab on arrow left', async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keydown.left');

      expect(tabs.at(2).attributes('aria-selected')).toBe('true');
      expect(wrapper.emitted('change').length).toBe(1);
    });

    it('should select first tab on home', async () => {
      returnFirstEl(tabs.at(2).vm.$el).focus();
      await tabList.trigger('keydown.home');

      expect(tabs.at(0).attributes('aria-selected')).toBe('true');
      expect(wrapper.emitted('change').length).toBe(1);
    });

    it('should select last tab on end', async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keydown.end');

      expect(tabs.at(2).attributes('aria-selected')).toBe('true');
      expect(wrapper.emitted('change').length).toBe(1);
    });
  });

  describe('Roving tabindex', () => {
    describe('In manual mode', () => {
      beforeEach(() => {
        props.selected = optionTabs[0].panelId;
        delete props.activationMode;
        _mountWrapper();
      });

      it('should move tabindex to focused tab on arrow right', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');

        expect(tabs.at(1).attributes('tabindex')).toBe('0');
        expect(tabs.at(0).attributes('tabindex')).toBe('-1');
      });

      it('should keep tabindex on focused tab after multiple arrows', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');
        await tabList.trigger('keydown.right');

        expect(tabs.at(2).attributes('tabindex')).toBe('0');
        expect(tabs.at(0).attributes('tabindex')).toBe('-1');
        expect(tabs.at(1).attributes('tabindex')).toBe('-1');
      });
    });

    describe('When selected prop changes externally', () => {
      beforeEach(async () => {
        _mountWrapper();
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');
      });

      it('should reset tabindex to new selected tab', async () => {
        props.selected = optionTabs[2].panelId;
        await wrapper.setProps(props);

        expect(tabs.at(2).attributes('tabindex')).toBe('0');
        expect(tabs.at(1).attributes('tabindex')).toBe('-1');
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keydown.enter');
    });

    it('should render correct attributes', () => {
      expect(tabList.attributes('role')).toBe('tablist');
      expect(tabList.attributes('aria-label')).toBe(props.label);
    });

    it('should have selected element', () => {
      expect(tabs.at(0).attributes('aria-selected')).toBe('true');
    });

    describe('Correct aria attributes', () => {
      describe('Attributes after arrow left', () => {
        let lastTab;
        let lastPanel;
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.left');
          await tabList.trigger('keydown.space');
          lastTab = tabs.at(2).attributes();
          lastPanel = tabPanels.at(2).attributes();
        });

        it('has correct attributes', () => {
          expect(lastTab.id).toBe(lastPanel['aria-labelledby']);
          expect(lastTab['aria-controls']).toBe(lastPanel.id);
        });
      });

      describe('attributes after arrow right', () => {
        beforeEach(async () => {
          returnFirstEl(tabs.at(0).vm.$el).focus();
          await tabList.trigger('keydown.right');
          await tabList.trigger('keydown.enter');
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
          await tabList.trigger('keydown.enter');
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
          await tabList.trigger('keydown.enter');
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

  describe('Vertical orientation', () => {
    beforeEach(() => {
      props.orientation = 'vertical';
      _mountWrapper();
    });

    it('should render the vertical class on the tablist', () => {
      expect(tabList.classes(TAB_ORIENTATION_MODIFIERS.vertical)).toBe(true);
    });

    it('should render the vertical class on the wrapper', () => {
      expect(wrapper.find('[data-qa="dt-tab-group"]').classes('d-tab-neux--vertical')).toBe(true);
    });

    it('should set aria-orientation to vertical', () => {
      expect(tabList.attributes('aria-orientation')).toBe('vertical');
    });

    describe('Keyboard navigation', () => {
      it('should navigate to next tab on arrow down', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.down');
        await tabList.trigger('keydown.enter');

        expect(tabs.at(1).attributes('aria-selected')).toBe('true');
        expect(tabPanels.at(1).attributes('aria-hidden')).toBe('false');
      });

      it('should navigate to previous tab on arrow up', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.up');
        await tabList.trigger('keydown.space');

        expect(tabs.at(2).attributes('aria-selected')).toBe('true');
        expect(tabPanels.at(2).attributes('aria-hidden')).toBe('false');
      });

      it('should NOT navigate on arrow left', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.left');
        await tabList.trigger('keydown.enter');

        expect(wrapper.emitted('change')).toBeUndefined();
      });

      it('should NOT navigate on arrow right', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.right');
        await tabList.trigger('keydown.enter');

        expect(wrapper.emitted('change')).toBeUndefined();
      });

      it('should navigate to first tab on home', async () => {
        returnFirstEl(tabs.at(2).vm.$el).focus();
        await tabList.trigger('keydown.home');
        await tabList.trigger('keydown.enter');

        expect(tabs.at(0).attributes('aria-selected')).toBe('true');
      });

      it('should navigate to last tab on end', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.end');
        await tabList.trigger('keydown.enter');

        expect(tabs.at(2).attributes('aria-selected')).toBe('true');
      });
    });

    describe('Auto activation mode', () => {
      beforeEach(() => {
        props.activationMode = 'auto';
        props.orientation = 'vertical';
        _mountWrapper();
      });

      it('should auto-select tab on arrow down', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.down');

        expect(tabs.at(1).attributes('aria-selected')).toBe('true');
        expect(wrapper.emitted('change').length).toBe(1);
      });

      it('should auto-select tab on arrow up', async () => {
        returnFirstEl(tabs.at(0).vm.$el).focus();
        await tabList.trigger('keydown.up');

        expect(tabs.at(2).attributes('aria-selected')).toBe('true');
        expect(wrapper.emitted('change').length).toBe(1);
      });
    });
  });

  describe('Horizontal orientation (default)', () => {
    beforeEach(() => {
      delete props.orientation;
      _mountWrapper();
    });

    it('should set aria-orientation to horizontal by default', () => {
      expect(tabList.attributes('aria-orientation')).toBe('horizontal');
    });

    it('should not render the vertical class', () => {
      expect(tabList.classes(TAB_ORIENTATION_MODIFIERS.vertical)).toBe(false);
    });

    it('should NOT navigate on arrow up', async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keydown.up');
      await tabList.trigger('keydown.enter');

      expect(wrapper.emitted('change')).toBeUndefined();
    });

    it('should NOT navigate on arrow down', async () => {
      returnFirstEl(tabs.at(0).vm.$el).focus();
      await tabList.trigger('keydown.down');
      await tabList.trigger('keydown.enter');

      expect(wrapper.emitted('change')).toBeUndefined();
    });
  });

  describe('Kind prop', () => {
    it('should default to "default"', () => {
      expect(wrapper.vm.provideObj.kind).toBe('default');
    });

    it('should pass kind through groupContext', async () => {
      props.kind = 'muted';
      _mountWrapper();

      expect(wrapper.vm.provideObj.kind).toBe('muted');
    });
  });

  describe('Outlined prop', () => {
    it('should default to false', () => {
      expect(wrapper.vm.provideObj.outlined).toBe(false);
    });

    it('should pass outlined through groupContext', () => {
      props.outlined = true;
      _mountWrapper();

      expect(wrapper.vm.provideObj.outlined).toBe(true);
    });
  });

  describe('Spread prop', () => {
    it('should pass spread through groupContext', () => {
      props.spread = 'grow';
      _mountWrapper();

      expect(wrapper.vm.provideObj.spread).toBe('grow');
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
