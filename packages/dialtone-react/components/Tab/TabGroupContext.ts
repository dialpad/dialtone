import { createContext, useContext } from 'react';
import type { TabGroupKind, TabListSize, TabOrientation, TabSpread } from './TabsConstants';

/** What DtTabGroup shares with its tabs and panels: Vue's injected `groupContext`. */
export interface TabGroupState {
  /** The id of the displayed tab panel. */
  selected: string;
  /** Whether the whole group is disabled. */
  disabled: boolean;
  size: TabListSize;
  kind: TabGroupKind;
  outlined: boolean;
  orientation: TabOrientation;
  spread: TabSpread;
  /** The last-focused tab's id, for the roving tabindex. */
  focusedTabId: string | null;
}

export interface TabGroupContextValue {
  /** Vue's `groupContext`. */
  groupContext: TabGroupState;
  /** Vue's `setFocus`: records the focused tab's id (or null). */
  setFocus: (focusId: string | null) => void;
  /**
   * Selects a tab panel by id. Vue's DtTab assigns `groupContext.selected` itself when it mounts `selected`; a React
   * context can't be written to, so the group passes this setter.
   */
  setSelected: (panelId: string) => void;
}

/** DtTabGroup's initial `provideObj`, for a tab or panel rendered outside a group. */
export const DEFAULT_TAB_GROUP_STATE: TabGroupState = {
  selected: '',
  disabled: false,
  size: 300,
  kind: 'default',
  outlined: false,
  orientation: 'horizontal',
  spread: 'none',
  focusedTabId: null,
};

export const TabGroupContext = createContext<TabGroupContextValue>({
  groupContext: DEFAULT_TAB_GROUP_STATE,
  setFocus: () => {},
  setSelected: () => {},
});

export const useTabGroupContext = () => useContext(TabGroupContext);
