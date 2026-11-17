import { act, render, screen, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { Mock } from 'vitest';
import { DtTab } from './Tab';
import { DtTabGroup, type DtTabGroupProps } from './TabGroup';
import { DtTabPanel } from './TabPanel';
import {
  TAB_LIST_IMPORTANCE_MODIFIERS,
  TAB_LIST_SIZE_MODIFIERS,
  TAB_ORIENTATION_MODIFIERS,
  TAB_SPREAD_MODIFIERS,
} from './TabsConstants';

interface TabOption {
  id: string;
  panelId: string;
  selected?: boolean;
  label?: string;
  disabled?: boolean;
  slot: string;
}

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

const optionTabs: TabOption[] = [
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

const renderTabs = (options: TabOption[]) => (
  <div>
    {options.map(option => (
      <DtTab
        key={option.id}
        id={option.id}
        panelId={option.panelId}
        selected={option.selected}
        label={option.label}
        disabled={option.disabled}
      >
        {option.slot}
      </DtTab>
    ))}
  </div>
);

const tabPanelComponents = () => (
  <div>
    {optionTabPanel.map(option => (
      <DtTabPanel
        key={option.id}
        id={option.id}
        tabId={option.tabId}
      >
        {option.slot}
      </DtTabPanel>
    ))}
  </div>
);

// Read when the group renders, as Vue's render function reads optionTabs.
function TabComponents () {
  return renderTabs(optionTabs);
}

type GroupProps = Partial<Omit<DtTabGroupProps, 'tabs' | 'children'>>;

const baseAttributes: GroupProps = {};

describe('DtTabGroup Tests', () => {
  // Like Vue's suite, this one shares `props` and `optionTabs` between tests and changes them as it goes, so each
  // test runs in the same state as its Vue original.
  let rendered: RenderResult | null = null;
  let tabList: HTMLElement;
  let tabs: HTMLElement[];
  let tabPanels: HTMLElement[];
  let attrs: GroupProps;
  let change: Mock<NonNullable<DtTabGroupProps['onChange']>>;
  let beforeChange: Mock<NonNullable<DtTabGroupProps['onBeforeChange']>>;
  let tabsSlot: () => ReactNode;

  const props: GroupProps = {
    label: 'area-label',
  };

  beforeEach(() => {
    attrs = baseAttributes;
    tabsSlot = () => <TabComponents />;
  });

  const _setWrappers = () => {
    tabList = screen.getByRole('tablist');
    tabPanels = screen.getAllByTestId('dt-tab-panel');
    tabs = screen.getAllByTestId('dt-tab');
  };

  const element = (groupProps: GroupProps) => {
    const { onBeforeChange, ...rest } = groupProps;
    return (
      <DtTabGroup
        {...rest}
        onChange={change}
        onBeforeChange={(event, payload) => {
          beforeChange(event, payload);
          onBeforeChange?.(event, payload);
        }}
        tabs={tabsSlot()}
      >
        {tabPanelComponents()}
      </DtTabGroup>
    );
  };

  // Vue's mount; the previous wrapper is unmounted first, rather than left in the document.
  const _mountWrapper = (groupProps: GroupProps = { ...props, ...attrs }) => {
    rendered?.unmount();
    change = vi.fn<NonNullable<DtTabGroupProps['onChange']>>();
    beforeChange = vi.fn<NonNullable<DtTabGroupProps['onBeforeChange']>>();
    rendered = render(element(groupProps));
    _setWrappers();
  };

  // Vue's setProps.
  const setProps = async (groupProps: GroupProps) => {
    await act(async () => { rendered?.rerender(element({ ...groupProps, ...attrs })); });
  };

  const focus = (el: HTMLElement) => act(() => el.focus());
  const click = (el: HTMLElement) => act(() => el.click());

  beforeEach(() => {
    _mountWrapper();
  });

  afterEach(() => {
    rendered?.unmount();
    rendered = null;
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(screen.getByTestId('dt-tab-group')).toBeInTheDocument();
    });

    it('should not emitted on mount', () => {
      expect(change).not.toHaveBeenCalled();
    });

    describe('Correct size modifiers', () => {
      beforeEach(() => {
        props.size = 'sm';
        _mountWrapper();
      });

      it('should have correct class modifier', () => {
        expect(tabList).toHaveClass(TAB_LIST_SIZE_MODIFIERS.sm);
      });
    });

    // The deprecated `inverted` prop isn't ported (conventions › Deprecated API); see skips.json.
    describe('Correct kind modifiers', () => {
      it.skip('should have correct kind modifier', () => {
        expect(tabList).toBeInTheDocument();
      });
    });

    describe('Correct importance modifiers', () => {
      beforeEach(() => {
        props.borderless = true;
        _mountWrapper();
      });

      it('should have correct importance modifier', () => {
        expect(tabList).toHaveClass(TAB_LIST_IMPORTANCE_MODIFIERS.borderless);
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

        expect(tabList).toHaveClass(TAB_SPREAD_MODIFIERS.grow);
      });

      it('should apply spread-equal modifier when spread is equal', () => {
        props.spread = 'equal';
        _mountWrapper();

        expect(tabList).toHaveClass(TAB_SPREAD_MODIFIERS.equal);
      });

      it('should not apply spread modifier when orientation is vertical', () => {
        props.spread = 'grow';
        props.orientation = 'vertical';
        _mountWrapper();

        expect(tabList).not.toHaveClass(TAB_SPREAD_MODIFIERS.grow);
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
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(tabPanels[1]).toHaveAttribute('aria-hidden', 'false');
      });
    });

    describe('When selected is updated', () => {
      beforeEach(async () => {
        _mountWrapper();
        // Simulating the third tab being set programmatically after the second tab was selected by a user.
        click(tabs[1]);
        props.selected = optionTabs[2].panelId;
        await setProps(props);
      });

      it('should override currently selected tab', async () => {
        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        expect(tabPanels[2]).toHaveAttribute('aria-hidden', 'false');
      });
    });

    describe('Correct selected state', () => {
      beforeEach(async () => {
        optionTabs[0].selected = true;
        optionTabs[1].selected = false;
        _mountWrapper();
      });

      it('selected element should be correct', () => {
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabPanels[0]).toHaveAttribute('aria-hidden', 'false');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        expect(tabPanels[1]).toHaveAttribute('aria-hidden', 'true');
      });
    });

    describe('Correct change event', () => {
      beforeEach(() => {
        click(tabs[1]);
      });

      it('should emitted on click', () => {
        expect(change).toHaveBeenCalledTimes(1);
      });
    });

    describe('Correct before-change event', () => {
      let clickEvent: Event | undefined;

      beforeEach(() => {
        const tabEl = tabs[1];
        tabEl.addEventListener('click', (event) => { clickEvent = event; });
        click(tabEl);
      });

      it('should emitted on click', () => {
        expect(beforeChange).toHaveBeenCalledTimes(1);
      });

      it('should emit the originating event and the target panel id, in order', () => {
        const [event, payload] = beforeChange.mock.calls[0];
        expect(event.nativeEvent).toBe(clickEvent);
        expect(payload).toEqual({ selected: optionTabs[1].panelId });
      });
    });

    describe('Correct key navigation', () => {
      describe('On arrow left', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{ArrowLeft}');
          await userEvent.keyboard(' ');
        });

        it('selected element should be correct', () => {
          expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
          expect(tabPanels[2]).toHaveAttribute('aria-hidden', 'false');
        });
      });

      describe('On double arrow left and space', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{ArrowLeft}');
          await userEvent.keyboard('{ArrowLeft}');
          await userEvent.keyboard(' ');
        });

        it('selected element should be correct', () => {
          expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
          expect(tabPanels[1]).toHaveAttribute('aria-hidden', 'false');
        });
      });

      describe('On right and enter', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{ArrowRight}');
          await userEvent.keyboard('{Enter}');
        });

        it('selected element should be correct', () => {
          expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
          expect(tabPanels[1]).toHaveAttribute('aria-hidden', 'false');
        });
      });

      describe('On double arrow right and enter', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{ArrowRight}');
          await userEvent.keyboard('{ArrowRight}');
          await userEvent.keyboard('{Enter}');
        });

        it('selected element should be correct', () => {
          expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
          expect(tabPanels[2]).toHaveAttribute('aria-hidden', 'false');
        });
      });

      describe('On keydown home and enter', () => {
        beforeEach(async () => {
          focus(tabs[2]);
          await userEvent.keyboard('{Home}');
          await userEvent.keyboard('{Enter}');
        });

        it('selected element should be correct', () => {
          expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
          expect(tabPanels[0]).toHaveAttribute('aria-hidden', 'false');
        });
      });

      describe('On keydown end and enter', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{End}');
          await userEvent.keyboard('{Enter}');
        });

        it('selected element should be correct', () => {
          expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
          expect(tabPanels[2]).toHaveAttribute('aria-hidden', 'false');
        });
      });
    });

    describe('When a tab is disabled', () => {
      const disabledTabs: TabOption[] = [
        { id: '1', panelId: '2', selected: true, slot: 'First' },
        { id: '3', panelId: '4', disabled: true, slot: 'Second' },
        { id: '5', panelId: '6', slot: 'Third' },
      ];

      beforeEach(() => {
        tabsSlot = () => renderTabs(disabledTabs);
        _mountWrapper({ label: 'area-label' });
      });

      it('should land on disabled tab on arrow right', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');

        expect(document.activeElement?.id).toBe('dt-tab-3');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      });

      it('should land on disabled tab on arrow left', async () => {
        focus(tabs[2]);
        await userEvent.keyboard('{ArrowLeft}');

        expect(document.activeElement?.id).toBe('dt-tab-3');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      });

      it('should not select disabled tab on enter', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{Enter}');

        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        expect(change).not.toHaveBeenCalled();
      });

      it('should not select disabled tab on space', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard(' ');

        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        expect(change).not.toHaveBeenCalled();
      });

      it('should focus first tab on home even if disabled', async () => {
        tabsSlot = () => renderTabs([
          { id: '1', panelId: '2', disabled: true, slot: 'First' },
          { id: '3', panelId: '4', selected: true, slot: 'Second' },
          { id: '5', panelId: '6', slot: 'Third' },
        ]);
        _mountWrapper({ label: 'area-label' });

        focus(tabs[2]);
        await userEvent.keyboard('{Home}');

        expect(document.activeElement?.id).toBe('dt-tab-1');
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });

      it('should focus last tab on end even if disabled', async () => {
        tabsSlot = () => renderTabs([
          { id: '1', panelId: '2', selected: true, slot: 'First' },
          { id: '3', panelId: '4', slot: 'Second' },
          { id: '5', panelId: '6', disabled: true, slot: 'Third' },
        ]);
        _mountWrapper({ label: 'area-label' });

        focus(tabs[0]);
        await userEvent.keyboard('{End}');

        expect(document.activeElement?.id).toBe('dt-tab-5');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('When a tab is disabled in auto activation mode', () => {
      const disabledTabs: TabOption[] = [
        { id: '1', panelId: '2', selected: true, slot: 'First' },
        { id: '3', panelId: '4', disabled: true, slot: 'Second' },
        { id: '5', panelId: '6', slot: 'Third' },
      ];

      beforeEach(() => {
        tabsSlot = () => renderTabs(disabledTabs);
        _mountWrapper({ label: 'area-label', activationMode: 'auto' });
      });

      it('should focus disabled tab but not auto-select it', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');

        expect(document.activeElement?.id).toBe('dt-tab-3');
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        expect(change).not.toHaveBeenCalled();
      });

      it('should auto-select enabled tab', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{ArrowRight}');

        expect(document.activeElement?.id).toBe('dt-tab-5');
        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        expect(change).toHaveBeenCalledTimes(1);
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

        click(tabs[1]);
      });

      it('Should prevent the change event', async () => {
        expect(beforeChange).toHaveBeenCalledTimes(1);
        expect(change).not.toHaveBeenCalled();
        expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  describe('Automatic activation mode', () => {
    beforeEach(() => {
      props.activationMode = 'auto';
      _mountWrapper();
    });

    it('should select tab on arrow right', async () => {
      focus(tabs[0]);
      await userEvent.keyboard('{ArrowRight}');

      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      expect(change).toHaveBeenCalledTimes(1);
    });

    it('should select tab on arrow left', async () => {
      focus(tabs[0]);
      await userEvent.keyboard('{ArrowLeft}');

      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
      expect(change).toHaveBeenCalledTimes(1);
    });

    it('should select first tab on home', async () => {
      focus(tabs[2]);
      await userEvent.keyboard('{Home}');

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(change).toHaveBeenCalledTimes(1);
    });

    it('should select last tab on end', async () => {
      focus(tabs[0]);
      await userEvent.keyboard('{End}');

      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
      expect(change).toHaveBeenCalledTimes(1);
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
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');

        expect(tabs[1]).toHaveAttribute('tabindex', '0');
        expect(tabs[0]).toHaveAttribute('tabindex', '-1');
      });

      it('should keep tabindex on focused tab after multiple arrows', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{ArrowRight}');

        expect(tabs[2]).toHaveAttribute('tabindex', '0');
        expect(tabs[0]).toHaveAttribute('tabindex', '-1');
        expect(tabs[1]).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('When selected prop changes externally', () => {
      beforeEach(async () => {
        _mountWrapper();
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
      });

      it('should reset tabindex to new selected tab', async () => {
        props.selected = optionTabs[2].panelId;
        await setProps(props);

        expect(tabs[2]).toHaveAttribute('tabindex', '0');
        expect(tabs[1]).toHaveAttribute('tabindex', '-1');
      });
    });

    describe('When focused tab is removed', () => {
      let tabOptions: TabOption[] = [];

      beforeEach(async () => {
        tabOptions = [
          { id: '1', panelId: '2', selected: true, slot: 'First' },
          { id: '3', panelId: '4', slot: 'Second' },
          { id: '5', panelId: '6', slot: 'Third' },
        ];

        tabsSlot = () => renderTabs(tabOptions);
        _mountWrapper({ label: 'area-label', ...attrs });

        // Focus third tab via arrow keys
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{ArrowRight}');

        // Remove the focused tab
        tabOptions = [tabOptions[0], tabOptions[1]];
        await setProps({ label: 'area-label' });
        _setWrappers();
      });

      it('should give tabindex 0 to the selected tab', () => {
        expect(tabs[0]).toHaveAttribute('tabindex', '0');
      });

      it('should give tabindex -1 to other tabs', () => {
        expect(tabs[1]).toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      focus(tabs[0]);
      await userEvent.keyboard('{Enter}');
    });

    it('should render correct attributes', () => {
      expect(tabList).toHaveAttribute('role', 'tablist');
      expect(tabList).toHaveAttribute('aria-label', props.label);
    });

    it('should have selected element', () => {
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    describe('Correct aria attributes', () => {
      describe('Attributes after arrow left', () => {
        let lastTab: HTMLElement;
        let lastPanel: HTMLElement;
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{ArrowLeft}');
          await userEvent.keyboard(' ');
          lastTab = tabs[2];
          lastPanel = tabPanels[2];
        });

        it('has correct attributes', () => {
          expect(lastTab.id).toBe(lastPanel.getAttribute('aria-labelledby'));
          expect(lastTab.getAttribute('aria-controls')).toBe(lastPanel.id);
          expect(lastTab).toHaveAttribute('aria-selected', 'true');
        });
      });

      describe('attributes after arrow right', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{ArrowRight}');
          await userEvent.keyboard('{Enter}');
        });

        it(
          'should have correct id for aria-labelledby and aria-controls',
          () => {
            expect(tabs[1].id).toBe(tabPanels[1].getAttribute('aria-labelledby'));
            expect(tabs[1].getAttribute('aria-controls')).toBe(tabPanels[1].id);
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
          },
        );
      });

      describe('attributes after keydown home', () => {
        beforeEach(async () => {
          focus(tabs[2]);
          await userEvent.keyboard('{Home}');
          await userEvent.keyboard('{Enter}');
        });

        it(
          'should have correct id for aria-labelledby and aria-controls',
          () => {
            expect(tabs[0].id).toBe(tabPanels[0].getAttribute('aria-labelledby'));
            expect(tabs[0].getAttribute('aria-controls')).toBe(tabPanels[0].id);
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
          },
        );
      });

      describe('attributes after keydown end', () => {
        beforeEach(async () => {
          focus(tabs[0]);
          await userEvent.keyboard('{End}');
          await userEvent.keyboard('{Enter}');
        });

        it(
          'should have correct id for aria-labelledby and aria-controls',
          () => {
            expect(tabs[2].id).toBe(tabPanels[2].getAttribute('aria-labelledby'));
            expect(tabs[2].getAttribute('aria-controls')).toBe(tabPanels[2].id);
            expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
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
      expect(tabList).toHaveClass(TAB_ORIENTATION_MODIFIERS.vertical);
    });

    it('should render the vertical class on the wrapper', () => {
      expect(screen.getByTestId('dt-tab-group')).toHaveClass('d-tab-neux--vertical');
    });

    it('should set aria-orientation to vertical', () => {
      expect(tabList).toHaveAttribute('aria-orientation', 'vertical');
    });

    describe('Keyboard navigation', () => {
      it('should navigate to next tab on arrow down', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{Enter}');

        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(tabPanels[1]).toHaveAttribute('aria-hidden', 'false');
      });

      it('should navigate to previous tab on arrow up', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowUp}');
        await userEvent.keyboard(' ');

        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        expect(tabPanels[2]).toHaveAttribute('aria-hidden', 'false');
      });

      it('should NOT navigate on arrow left', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowLeft}');
        await userEvent.keyboard('{Enter}');

        expect(change).not.toHaveBeenCalled();
      });

      it('should NOT navigate on arrow right', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowRight}');
        await userEvent.keyboard('{Enter}');

        expect(change).not.toHaveBeenCalled();
      });

      it('should navigate to first tab on home', async () => {
        focus(tabs[2]);
        await userEvent.keyboard('{Home}');
        await userEvent.keyboard('{Enter}');

        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      });

      it('should navigate to last tab on end', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{End}');
        await userEvent.keyboard('{Enter}');

        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('Auto activation mode', () => {
      beforeEach(() => {
        props.activationMode = 'auto';
        props.orientation = 'vertical';
        _mountWrapper();
      });

      it('should auto-select tab on arrow down', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowDown}');

        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        expect(change).toHaveBeenCalledTimes(1);
      });

      it('should auto-select tab on arrow up', async () => {
        focus(tabs[0]);
        await userEvent.keyboard('{ArrowUp}');

        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
        expect(change).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Horizontal orientation (default)', () => {
    beforeEach(() => {
      delete props.orientation;
      _mountWrapper();
    });

    it('should set aria-orientation to horizontal by default', () => {
      expect(tabList).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should not render the vertical class', () => {
      expect(tabList).not.toHaveClass(TAB_ORIENTATION_MODIFIERS.vertical);
    });

    it('should NOT navigate on arrow up', async () => {
      focus(tabs[0]);
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{Enter}');

      expect(change).not.toHaveBeenCalled();
    });

    it('should NOT navigate on arrow down', async () => {
      focus(tabs[0]);
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{Enter}');

      expect(change).not.toHaveBeenCalled();
    });
  });

  // Vue reads the group's provide object; here, what the tabs render from it (and, for spread, which no tab renders,
  // the state `onChange` reports).
  describe('Kind prop', () => {
    it('should default to "default"', () => {
      expect(tabs.find(tab => tab.getAttribute('aria-selected') === 'true')).toHaveClass('d-tab--is-selected');
      tabs.forEach(tab => expect(tab).not.toHaveClass('d-btn--active'));
    });

    it('should pass kind through groupContext', async () => {
      props.kind = 'muted';
      _mountWrapper();

      tabs.forEach(tab => expect(tab).toHaveClass('d-btn--muted'));
      expect(tabs.find(tab => tab.getAttribute('aria-selected') === 'true')).toHaveClass('d-btn--active');
    });
  });

  describe('Outlined prop', () => {
    it('should default to false', () => {
      tabs.forEach(tab => expect(tab).not.toHaveClass('d-btn--outlined'));
    });

    it('should pass outlined through groupContext', () => {
      props.outlined = true;
      _mountWrapper();

      expect(tabs.find(tab => tab.getAttribute('aria-selected') === 'true')).toHaveClass('d-btn--outlined');
    });
  });

  describe('Spread prop', () => {
    it('should pass spread through groupContext', () => {
      props.spread = 'grow';
      _mountWrapper();

      click(tabs.find(tab => tab.getAttribute('aria-selected') === 'false')!);

      expect(change).toHaveBeenCalledWith(expect.objectContaining({ spread: 'grow' }));
    });
  });

  describe('Extendability Tests', () => {
    describe('When tab list class is provided', () => {
      beforeEach(() => {
        props.tabListClass = 'my-custom-class';
        _mountWrapper();
      });

      it('should apply custom class to tab list', () => {
        expect(rendered?.container.querySelector('.my-custom-class')).toBe(tabList);
      });
    });

    describe('When tab list child props are provided', () => {
      beforeEach(() => {
        props.tabListChildProps = { some: 'prop' };
        _mountWrapper();
      });

      it('tab list should have provided child prop', () => {
        expect(tabList).toHaveAttribute('some', 'prop');
      });
    });
  });

  // React-only.
  describe('Change payload', () => {
    it('should report the group state after the change', () => {
      _mountWrapper({ label: 'area-label' });
      const unselected = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'false');

      click(tabs[unselected]);

      expect(change).toHaveBeenCalledWith({
        selected: optionTabs[unselected].panelId,
        disabled: false,
        size: 300,
        kind: 'default',
        outlined: false,
        orientation: 'horizontal',
        spread: 'none',
        focusedTabId: optionTabs[unselected].id,
      });
    });

    it('should not select a tab on click when the group is disabled', () => {
      _mountWrapper({ label: 'area-label', disabled: true });
      const selected = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
      const other = (selected + 1) % tabs.length;

      click(tabs[other]);

      expect(change).not.toHaveBeenCalled();
      expect(tabs[selected]).toHaveAttribute('aria-selected', 'true');
    });
  });
});
