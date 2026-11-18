import { useImperativeHandle, useRef, useState, type ComponentType, type KeyboardEvent, type Ref } from 'react';
import {
  DtIconClock,
  DtIconDialpadStar,
  DtIconFlag,
  DtIconFood,
  DtIconHeart,
  DtIconLightbulb,
  DtIconLivingThing,
  DtIconObject,
  DtIconSatisfied,
  DtIconTransportation,
  type DtIconProps,
} from '../../../icons';
import { DtTab, DtTabGroup } from '../../Tab';

export interface EmojiTabsetHandle {
  focusTabset: () => void;
}

export interface EmojiTabsetProps {
  /** Whether to show the recently used tab or not */
  showRecentlyUsedTab?: boolean;
  /** Whether to show the custom emojis tab or not */
  showCustomEmojisTab?: boolean;
  scrollIntoTab: number;
  emojiFilter?: string;
  /** The labels for the aria-label */
  tabSetLabels: readonly string[];
  /** Emitted when a tab is selected, with the tab's number (1-based) */
  onSelectedTabset?: (tabId: number) => void;
  onFocusSearchInput?: () => void;
  onFocusSkinSelector?: () => void;
  /** Keydown on the root, as Vue's fallthrough `@keydown` listener. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  ref?: Ref<EmojiTabsetHandle>;
}

const TAB_ICONS: readonly ComponentType<DtIconProps>[] = [
  DtIconClock,
  DtIconSatisfied,
  DtIconLivingThing,
  DtIconFood,
  DtIconObject,
  DtIconTransportation,
  DtIconLightbulb,
  DtIconHeart,
  DtIconFlag,
  DtIconDialpadStar,
];

export function EmojiTabset ({
  showRecentlyUsedTab = false,
  showCustomEmojisTab = false,
  scrollIntoTab,
  emojiFilter = '',
  tabSetLabels,
  onSelectedTabset,
  onFocusSearchInput,
  onFocusSkinSelector,
  onKeyDown,
  ref,
}: EmojiTabsetProps) {
  const tabsData = TAB_ICONS.map((icon, index) => ({ label: tabSetLabels[index], icon }));
  const shownTabs = showRecentlyUsedTab ? tabsData : tabsData.slice(1);
  // if showCustomEmojisTab is false remove the last tab
  if (!showCustomEmojisTab) {
    shownTabs.pop();
  }
  const tabs = shownTabs.map((tab, index) => ({
    ...tab,
    // IDs on dt-tab component need to be on string
    id: (index + 1).toString(),
    panelId: (index + 1).toString(),
  }));

  const isSearching = emojiFilter.length > 0;

  const [selectedTab, setSelectedTab] = useState<string | null>('1');

  // Vue's scrollIntoTab watcher: the tab scrolled into is selected, unless searching.
  const [prevScrollIntoTab, setPrevScrollIntoTab] = useState(scrollIntoTab);
  if (scrollIntoTab !== prevScrollIntoTab) {
    setPrevScrollIntoTab(scrollIntoTab);
    if (!isSearching) setSelectedTab((scrollIntoTab + 1).toString());
  }

  // Vue's isSearching watcher: searching deselects every tab.
  const [prevIsSearching, setPrevIsSearching] = useState(isSearching);
  if (isSearching !== prevIsSearching) {
    setPrevIsSearching(isSearching);
    if (isSearching) setSelectedTab(null);
  }

  // The tabs' buttons, by position, to focus them.
  const tabsetRef = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>([]);

  function focusTabset () {
    tabsetRef.current[0]?.focus();
  }

  useImperativeHandle(ref, () => ({ focusTabset }), []);

  /**
   * The click is handled in the capture phase and stopped, as Vue's `.capture.stop` does, so the tab group doesn't
   * select the tab itself.
   */
  function selectTabset (id: string) {
    // IDs on scrollToTab need to be on number
    const parseId = parseInt(id);
    // IDs on dt-tab component need to be on string
    setSelectedTab(id);
    onSelectedTabset?.(parseId);
  }

  function handleKeyDown (event: KeyboardEvent<HTMLElement>, tabId: string) {
    if (event.key === 'Enter') {
      selectTabset(tabId);
      // We blur because seems like the tab component override the selected prop, and it removes the selected style
      tabsetRef.current[parseInt(tabId) - 1]?.blur();
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        onFocusSkinSelector?.();
      } else {
        onFocusSearchInput?.();
      }
    }

    if (event.key === 'ArrowDown') {
      // Jump to search input
      onFocusSearchInput?.();
    }
  }

  return (
    <div
      className="d-emoji-picker__tabset"
      data-qa="dt-emoji-picker-tabset"
      onKeyDown={onKeyDown}
    >
      <DtTabGroup
        selected={selectedTab ?? ''}
        size={200}
        spread="equal"
        tabsClass="d-emoji-picker__tabset-list"
        tabs={tabs.map(({ id, panelId, label, icon: Icon }, index) => (
          <DtTab
            id={id}
            key={id}
            ref={(el) => { tabsetRef.current[index] = el; }}
            label={label}
            panelId={panelId}
            tabIndex={index + 1}
            aria-controls="d-emoji-picker-list"
            onKeyDown={event => handleKeyDown(event, id)}
            onClickCapture={(event) => {
              event.stopPropagation();
              selectTabset(id);
            }}
          >
            <Icon size="400" />
          </DtTab>
        ))}
      />
    </div>
  );
}
