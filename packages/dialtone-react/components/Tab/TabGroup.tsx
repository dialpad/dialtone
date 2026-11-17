import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useIndicatorAnimation, type IndicatorSnapshot } from '../../common/use-indicator-animation';
import { TabGroupContext, type TabGroupContextValue, type TabGroupState } from './TabGroupContext';
import {
  TAB_LIST_IMPORTANCE_MODIFIERS,
  TAB_LIST_SIZE_MODIFIERS,
  TAB_ORIENTATION_MODIFIERS,
  TAB_SPREAD_MODIFIERS,
  type TabActivationMode,
  type TabGroupKind,
  type TabListSize,
  type TabOrientation,
  type TabSpread,
} from './TabsConstants';

/** The event that asked for a tab change: a click on the tab list, or Enter or Space on it. */
export type DtTabGroupChangeEvent = MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>;

/** What `onChange` reports: the group's state after the change, as Vue's `change` event does. */
export type DtTabGroupChangePayload = TabGroupState;

/** Props for the tab list: any attribute or handler of a `<div>`, as Vue's `v-bind` object takes. */
export type DtTabListChildProps = HTMLAttributes<HTMLDivElement> & Record<string, unknown>;

interface DtTabGroupOwnProps {
  /** Identifies the tab group */
  label?: string;

  /** The id of the selected tab panel which should be displayed */
  selected?: string;

  /**
   * If true, disables the tab group
   * @values true, false
   */
  disabled?: boolean;

  /**
   * If true, applies borderless styles to the tab group
   * @values true, false
   */
  borderless?: boolean;

  /**
   * Controls how tabs distribute available space within the tab list.
   * @values none, grow, equal
   */
  spread?: TabSpread;

  /**
   * The orientation of the tab list
   * @values horizontal, vertical
   */
  orientation?: TabOrientation;

  /**
   * If provided, applies size styles to the tab group
   * @values 100, 200, 300, 400, 500
   */
  size?: TabListSize;

  /** Pass through classes, used to customize the tab list */
  tabsClass?: ClassValue;

  /**
   * Pass through classes, used to customize the tab list
   * @deprecated Use tabsClass
   */
  tabListClass?: ClassValue;

  /** Pass through props, used to customize the tab list */
  tabListChildProps?: DtTabListChildProps;

  /**
   * The visual style kind applied to tabs within this group.
   * Maps to specific DtButton kind/importance combinations for selected/unselected states.
   * @values default, muted
   */
  kind?: TabGroupKind;

  /**
   * If true, the selected tab renders with outlined importance instead of clear.
   * @values true, false
   */
  outlined?: boolean;

  /**
   * Controls whether tabs are selected on focus (auto) or on click/keypress (manual)
   * @values auto, manual
   */
  activationMode?: TabActivationMode;

  /**
   * If true, the selection indicator animates between tabs on click.
   * @values true, false
   */
  showIndicatorTransition?: boolean;

  /** Slot for Tabs */
  tabs?: ReactNode;

  /** Default slot for Panel */
  children?: ReactNode;

  /** Change tab event with the arguments: selected id of the current tab and disabled value */
  onChange?: (payload: DtTabGroupChangePayload) => void;

  /**
   * Before change tab event, useful to perform validations and prevent changing tabs if necessary.
   * Receives the originating event (call `event.preventDefault()` to cancel the change) and the target tab's panel id
   * as `selected`.
   */
  onBeforeChange?: (event: DtTabGroupChangeEvent, payload: { selected: string }) => void;

  /** The root `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

export type DtTabGroupProps = DtTabGroupOwnProps & Omit<HTMLAttributes<HTMLDivElement>, keyof DtTabGroupOwnProps>;

interface TabItem {
  context: HTMLElement;
  panelId: string | undefined;
  tabId: string | undefined;
  isSelected: boolean;
  isDisabled: boolean;
}

const modifierOf = (modifiers: Readonly<Record<string, string>>, key: string) =>
  (Object.hasOwn(modifiers, key) ? modifiers[key] : undefined);

/** Vue's getTabChildren(): the tabs as the DOM has them, read when needed. */
function getTabChildren (tabList: HTMLElement | null): TabItem[] {
  if (!tabList) return [];
  return Array.from(tabList.querySelectorAll<HTMLElement>('[role="tab"]')).map(el => ({
    context: el,
    panelId: el.getAttribute('aria-controls')?.replace('dt-panel-', ''),
    tabId: el.getAttribute('id')?.replace('dt-tab-', ''),
    isSelected: el.getAttribute('aria-selected') === 'true',
    isDisabled: el.getAttribute('aria-disabled') === 'true',
  }));
}

/**
 * Tabs allow users to navigation between grouped content in different views while within the same page context.
 * @see https://dialtone.dialpad.com/components/tabs.html
 */
export function DtTabGroup ({
  label = '',
  selected = '',
  disabled = false,
  borderless = false,
  spread = 'none',
  orientation = 'horizontal',
  size = 300,
  tabsClass = '',
  tabListClass,
  tabListChildProps = {},
  kind = 'default',
  outlined = false,
  activationMode = 'manual',
  showIndicatorTransition = true,
  tabs,
  children,
  className,
  onChange,
  onBeforeChange,
  ref,
  ...attrs
}: DtTabGroupProps) {
  const [tabList, setTabList] = useState<HTMLDivElement | null>(null);
  const indicator = useIndicatorAnimation(tabList, '--tab-indicator-duration', '--tab-indicator-easing');

  // The displayed panel: the `selected` prop, a tab mounted `selected`, or the user's choice, whichever came last.
  const [selectedPanel, setSelectedPanel] = useState(selected);
  const [focusedTabId, setFocusedTabId] = useState<string | null>(null);
  // Vue's `selected` watcher: a new `selected` prop overrides the current selection and resets the roving tabindex.
  const [prevSelected, setPrevSelected] = useState(selected);
  if (selected !== prevSelected) {
    setPrevSelected(selected);
    setSelectedPanel(selected);
    setFocusedTabId(null);
  }

  const groupContext = useMemo<TabGroupState>(() => ({
    selected: selectedPanel,
    disabled,
    size,
    kind,
    outlined,
    orientation,
    spread,
    focusedTabId,
  }), [selectedPanel, disabled, size, kind, outlined, orientation, spread, focusedTabId]);

  const setFocus = useCallback((focusId: string | null) => setFocusedTabId(focusId), []);
  const contextValue = useMemo<TabGroupContextValue>(
    () => ({ groupContext, setFocus, setSelected: setSelectedPanel }),
    [groupContext, setFocus],
  );

  // Vue animates on $nextTick, once the new selection is in the DOM: the pending animation waits for that commit.
  const pendingAnimation = useRef<{ old: IndicatorSnapshot; newEl: HTMLElement } | null>(null);
  useLayoutEffect(() => {
    const pending = pendingAnimation.current;
    if (!pending) return;
    pendingAnimation.current = null;
    const { old, newEl } = pending;

    let hideProps: Keyframe = { backgroundColor: 'transparent' };
    let indicatorExtra: Keyframe = {};
    let pseudoElement: '::before' | '::after' = '::after';

    if (outlined) {
      hideProps = { borderColor: 'transparent', backgroundColor: 'transparent' };
      indicatorExtra = { boxShadow: `inset 0 0 0 ${old.style.borderWidth} ${old.style.borderColor}` };
      pseudoElement = '::before';
    } else if (kind === 'muted') {
      indicatorExtra = { backgroundColor: old.style.backgroundColor };
      pseudoElement = '::before';
    }

    indicator.animate({ oldRect: old.rect, newEl, orientation, hideProps, indicatorExtra, pseudoElement });
  });

  const emitChange = (item: TabItem) => {
    // Vue emits its provide object after the change: the new panel, and the tab that was just focused.
    onChange?.({ ...groupContext, selected: item.panelId ?? '', focusedTabId: item.tabId ?? null });
  };

  const transitionIndicator = (panelId: string, newContext: HTMLElement) => {
    if (!showIndicatorTransition) {
      setSelectedPanel(panelId);
      return;
    }
    const old = indicator.snapshot('[aria-selected="true"]');
    setSelectedPanel(panelId);
    if (old) pendingAnimation.current = { old, newEl: newContext };
  };

  // The focused tab, or else the selected one, or else the first.
  const getFocusedTabIndex = (items: TabItem[]) => {
    const index = items.findIndex(item => (focusedTabId ? item.tabId === focusedTabId : item.isSelected));
    return index === -1 ? 0 : index;
  };

  const selectFocusOnTab = (items: TabItem[], index: number) => {
    const item = items[index];
    item.context.focus();
    if (activationMode === 'auto' && !item.isDisabled) {
      indicator.cancel();
      setSelectedPanel(item.panelId ?? '');
      emitChange(item);
    }
  };

  const navigate = (direction: 1 | -1) => {
    const items = getTabChildren(tabList);
    if (!items.length) return;
    const index = getFocusedTabIndex(items);
    selectFocusOnTab(items, (index + direction + items.length) % items.length);
  };

  const selectTab = (event: DtTabGroupChangeEvent) => {
    const items = getTabChildren(tabList);
    const tabEl = (event.target as Element).closest('[role="tab"]');
    const index = tabEl ? items.findIndex(item => item.context === tabEl) : getFocusedTabIndex(items);

    if (index === -1) return;
    const item = items[index];
    if (!item || item.isDisabled) return;
    if (selectedPanel === item.panelId) return;

    const panelId = item.panelId ?? '';
    onBeforeChange?.(event, { selected: panelId });
    if (event.isDefaultPrevented() || event.nativeEvent.defaultPrevented) return;

    // Prevent keyboard defaults (Space scroll, Enter form submit) after confirming the tab change will proceed
    event.preventDefault();

    transitionIndicator(panelId, item.context);
    item.context.focus();
    emitChange(item);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        if (orientation === 'horizontal') navigate(-1);
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal') navigate(1);
        break;
      case 'ArrowUp':
        if (orientation === 'vertical') {
          event.preventDefault();
          navigate(-1);
        }
        break;
      case 'ArrowDown':
        if (orientation === 'vertical') {
          event.preventDefault();
          navigate(1);
        }
        break;
      case 'Enter':
      case ' ':
        selectTab(event);
        break;
      case 'Home': {
        event.preventDefault();
        const items = getTabChildren(tabList);
        if (items.length) selectFocusOnTab(items, 0);
        break;
      }
      case 'End': {
        event.preventDefault();
        const items = getTabChildren(tabList);
        if (items.length) selectFocusOnTab(items, items.length - 1);
        break;
      }
    }
    tabListChildProps.onKeyDown?.(event);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    selectTab(event);
    tabListChildProps.onClick?.(event);
  };

  const {
    className: childClassName,
    onKeyDown: _onKeyDown,
    onClick: _onClick,
    ...childProps
  } = tabListChildProps;

  return (
    <TabGroupContext.Provider value={contextValue}>
      <div
        data-qa="dt-tab-group"
        className={cx('d-tab-neux', { 'd-tab-neux--vertical': orientation === 'vertical' }, className)}
        {...attrs}
        ref={ref}
      >
        <div
          {...childProps}
          ref={setTabList}
          className={cx(
            'd-tablist',
            modifierOf(TAB_LIST_SIZE_MODIFIERS, String(size)),
            modifierOf(TAB_ORIENTATION_MODIFIERS, orientation),
            orientation !== 'vertical' && modifierOf(TAB_SPREAD_MODIFIERS, spread),
            { [TAB_LIST_IMPORTANCE_MODIFIERS.borderless]: borderless },
            tabListClass ?? tabsClass,
            childClassName,
          )}
          role="tablist"
          aria-label={label}
          aria-orientation={orientation}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
        >
          {tabs}
        </div>
        {children}
      </div>
    </TabGroupContext.Provider>
  );
}
