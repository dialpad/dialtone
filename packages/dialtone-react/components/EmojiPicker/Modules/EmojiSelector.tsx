import {
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react';
import { emojisGrouped as emojis } from '@dialpad/dialtone-emojis';
import { cx } from '../../../common/cx';
import { useKeyboardNavigation } from '../Composables/UseKeyboardNavigation';
import {
  ARROW_KEYS,
  CDN_URL,
  type EmojiPickerEmoji,
  type EmojiPickerSelectedEmoji,
  type EmojiPickerSkinTone,
} from '../EmojiPickerConstants';

export interface EmojiSelectorHandle {
  focusEmojiSelector: () => void;
  focusLastEmoji: () => void;
}

/** A tab to scroll to: a new object each time, so the same tab can be asked for twice. */
export interface SelectedTabset {
  tabId?: number;
}

export interface EmojiSelectorProps {
  /** The filter to apply to the emoji list */
  emojiFilter?: string;
  /** The skin tone to apply to the emoji list */
  skinTone: EmojiPickerSkinTone;
  /** The labels for the tabset */
  tabsetLabels: readonly string[];
  selectedTabset: SelectedTabset;
  /** The label for the search results tab */
  searchResultsLabel: string;
  searchNoResultsLabel: string;
  /** The list of recently used emojis */
  recentlyUsedEmojis?: readonly EmojiPickerEmoji[];
  /** The list of custom emojis */
  customEmojis?: readonly EmojiPickerEmoji[];
  /** Emitted when the user hovers over (or focuses) an emoji, and with null when they leave it */
  onHighlightedEmoji?: (emoji: EmojiPickerEmoji | null) => void;
  /** Emitted when the user selects an emoji */
  onSelectedEmoji?: (emoji: EmojiPickerSelectedEmoji) => void;
  /** Emitted when the user scrolls into an emoji tab */
  onScrollIntoTab?: (tabIndex: number) => void;
  /** Emitted when the user reaches the bottom of the list */
  onScrollBottomReached?: () => void;
  /** Emitted when the user reaches the end of the emoji list */
  onFocusSkinSelector?: () => void;
  /** Emitted when the user shift-tabs from the first tab of the emoji selector */
  onFocusSearchInput?: () => void;
  /** Keydown on the root, as Vue's fallthrough `@keydown` listener. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  ref?: Ref<EmojiSelectorHandle>;
}

/**
 * The list of tabs
 * This is used to display the tabs
 */
const TABS_DATA = ['Recently used', 'People', 'Nature', 'Food', 'Activity', 'Travel', 'Objects', 'Symbols', 'Flags',
  'Custom'];

const EMPTY: readonly EmojiPickerEmoji[] = [];

const debounceDelay = 300;

function getImgSrc (emoji: EmojiPickerEmoji) {
  if (emoji.date_added) { // if custom emoji
    return emoji.image;
  } else { // if regular emoji
    return CDN_URL + emoji.unicode_character + '.png';
  }
}

/**
 * Identifies an emoji of a tab, for React and for the buttons whose image failed. `shortname` is optional, so an
 * emoji without one falls back to its position and can't hide another.
 */
function imageKey (indexTab: number, emoji: EmojiPickerEmoji, indexEmoji: number) {
  return `${indexTab}:${emoji.shortname ?? `#${indexEmoji}`}`;
}

/**
 * Filters an array of emoji objects based on a search string that matches both the name and keywords.
 */
function searchByNameAndKeywords (currentEmojis: readonly EmojiPickerEmoji[], filter: string) {
  const searchStr = filter.toLowerCase();
  return currentEmojis.filter(obj => {
    const nameIncludesSearchStr = obj.name.toLowerCase().includes(searchStr);
    const keywordsIncludeSearchStr = (obj.keywords ?? []).some(keyword => keyword.toLowerCase().includes(searchStr));
    return nameIncludesSearchStr || keywordsIncludeSearchStr;
  });
}

export function EmojiSelector ({
  emojiFilter = '',
  skinTone,
  tabsetLabels,
  selectedTabset,
  searchResultsLabel,
  searchNoResultsLabel,
  recentlyUsedEmojis = EMPTY,
  customEmojis = EMPTY,
  onHighlightedEmoji,
  onSelectedEmoji,
  onScrollIntoTab,
  onScrollBottomReached,
  onFocusSkinSelector,
  onFocusSearchInput,
  onKeyDown,
  ref,
}: EmojiSelectorProps) {
  const {
    isFiltering,
    hoverFirstEmoji,
    setHoverFirstEmoji,
    setEmojiRef,
    setFilteredRef,
    focusEmoji,
    handleArrowNavigationFiltered,
    handleArrowNavigation,
  } = useKeyboardNavigation();

  /** The tab category label's element, the root the observer compares the tabs with. */
  const tabCategoryRef = useRef<HTMLDivElement>(null);
  /** The list's element, which scrolls. */
  const listRef = useRef<HTMLDivElement>(null);
  /** Each tab's group element, by position. */
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]);

  /**
   * The list of tab labels. Without recently used or custom emojis, their labels are removed.
   */
  let tabLabels = tabsetLabels.slice();
  if (!recentlyUsedEmojis.length) {
    tabLabels = tabsetLabels.slice(1);
  }
  if (!customEmojis.length) {
    tabLabels.pop();
  }

  /** The label of the fixed tab, updated as the list scrolls. */
  const [fixedLabel, setFixedLabel] = useState(tabLabels[0]);

  /**
   * The list of tabs. The difference between this and the tab labels is that this one sets the structure of tabs
   * and the tab labels set the labels.
   */
  const tabs = recentlyUsedEmojis.length ? TABS_DATA.slice() : TABS_DATA.slice(1);
  if (!customEmojis.length) {
    tabs.pop();
  }

  /**
   * Vue writes the recently used and custom emojis into the shared emoji data; here they join a copy, so instances
   * don't overwrite each other's lists.
   */
  const emojiGroups = useMemo<Record<string, readonly EmojiPickerEmoji[] | undefined>>(() => ({
    ...emojis,
    'Recently used': recentlyUsedEmojis,
    Custom: customEmojis,
  }), [recentlyUsedEmojis, customEmojis]);

  /**
   * The current emojis list, with the skin tone applied. Search results come from it.
   */
  const currentEmojis = useMemo<readonly EmojiPickerEmoji[]>(() => [
    ...emojis[`People${skinTone}`],
    ...emojis.Nature,
    ...emojis.Food,
    ...emojis[`Activity${skinTone}`],
    ...emojis.Travel,
    ...emojis[`Objects${skinTone}`],
    ...emojis.Symbols,
    ...emojis.Flags,
  ], [skinTone]);

  /**
   * The filter the search results were last computed with: Vue's filteredEmojis, which a skin tone change updates
   * at once and a filter change updates after a 300ms debounce. A new object each time, so each search runs its
   * hover.
   */
  const [search, setSearch] = useState(() => ({ filter: emojiFilter }));
  const [prevSkinTone, setPrevSkinTone] = useState(skinTone);
  if (skinTone !== prevSkinTone) {
    setPrevSkinTone(skinTone);
    setSearch({ filter: emojiFilter });
  }
  const filteredEmojis = useMemo(
    () => searchByNameAndKeywords(currentEmojis, search.filter),
    [currentEmojis, search],
  );

  /** Buttons whose image failed to load: Vue hides them. */
  const [brokenImages, setBrokenImages] = useState<ReadonlySet<string>>(() => new Set());

  const hoverEmoji = (emoji: EmojiPickerEmoji | null | undefined, isFirst = false) => {
    setHoverFirstEmoji(isFirst);
    onHighlightedEmoji?.(emoji ?? null);
  };

  function highlightEmoji (emoji: EmojiPickerEmoji | null) {
    onHighlightedEmoji?.(emoji);
  }

  function selectEmoji (emoji: EmojiPickerEmoji, event: MouseEvent | KeyboardEvent) {
    onSelectedEmoji?.({ ...emoji, shift_key: event.shiftKey });
  }

  /**
   * Scroll to the selected tab (1-based), and focus its first emoji.
   */
  function scrollToTab (tabIndex: number | undefined, focusFirstEmoji = true) {
    if (tabIndex === undefined) return;
    const tabElement = groupRefs.current[tabIndex - 1];
    const container = listRef.current;
    if (!container) return;

    container.scrollTop = tabIndex === 1 ? 0 : (tabElement?.offsetTop ?? 0) - 15;

    if (focusFirstEmoji) {
      focusEmoji(tabIndex - 1, 0);
    }
  }

  function focusEmojiSelector () {
    focusEmoji(0, 0);
  }

  function focusLastEmoji () {
    scrollToTab(tabs.length, true);
  }

  useImperativeHandle(ref, () => ({ focusEmojiSelector, focusLastEmoji }));

  // Before the effects below read it.
  useLayoutEffect(() => {
    isFiltering.current = !!emojiFilter;
  }, [isFiltering, emojiFilter]);

  // Vue's emojiFilter watcher: reset the scroll, clear the highlight when the filter is emptied, and search after the
  // debounce. Each change restarts the debounce.
  const prevFilter = useRef(emojiFilter);
  const onFilterChange = useEffectEvent(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
    // If the emoji filter is empty, emit null to remove the highlighted emoji of the previous search
    if (!emojiFilter) highlightEmoji(null);
  });
  useLayoutEffect(() => {
    if (prevFilter.current === emojiFilter) return;
    prevFilter.current = emojiFilter;
    onFilterChange();
  }, [emojiFilter]);
  // Every change of the filter searches again after the debounce, even back to the filter the results already
  // hold: the search hovers its first result, which clearing the filter had removed. Not on mount, as Vue's watcher.
  const debouncedFilter = useRef(emojiFilter);
  useEffect(() => {
    if (debouncedFilter.current === emojiFilter) return;
    debouncedFilter.current = emojiFilter;
    const timeout = setTimeout(() => setSearch({ filter: emojiFilter }), debounceDelay);
    return () => clearTimeout(timeout);
  }, [emojiFilter]);

  // Vue's nextTick after each search: hover the first result of a non-empty search.
  const onSearched = useEffectEvent(() => {
    if (search.filter) hoverEmoji(filteredEmojis[0], true);
  });
  useEffect(() => {
    onSearched();
  }, [search]);

  // Vue's selectedTabset watcher (not immediate).
  const prevSelectedTabset = useRef(selectedTabset);
  const onSelectedTabsetChange = useEffectEvent(() => scrollToTab(selectedTabset.tabId));
  useEffect(() => {
    if (prevSelectedTabset.current === selectedTabset) return;
    prevSelectedTabset.current = selectedTabset;
    onSelectedTabsetChange();
  }, [selectedTabset]);

  /**
   * The observer compares the label root with each child of the list, as they were on mount, and updates the fixed
   * label and the tab scrolled into. The children carry their position as `data-index`, as Vue sets it on mount.
   */
  const onIntersect = useEffectEvent((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const target = entry.target as HTMLElement;
      const index = parseInt(target.dataset.index ?? '');
      const category = tabCategoryRef.current;

      /**
       * If the target is positioned above the root, the fixed label becomes the label of the previous tab, or the
       * first tab if the current tab is the first one. If the target is positioned below the root, it becomes the
       * label of the current tab. If the target stops intersecting with the root and its index is 1 (the second tab),
       * it becomes the label of the first tab.
       * NOTES:
       * This last condition is needed because sometimes it is not detect the intersection between the root and the
       * target. We also provide a 50 pixels offset to the root element in the first condition to always get the
       * first tab if it has fewer emojis, because in some cases if you quickly scroll the observer does not detect it.
       */
      if (entry.isIntersecting && category && target.offsetTop <= category.offsetTop + 50) {
        setFixedLabel(tabLabels[index - 1] ?? tabLabels[0]);
        onScrollIntoTab?.(index - 1);
      } else if (category && entry.boundingClientRect.bottom <= category.getBoundingClientRect().bottom) {
        onScrollIntoTab?.(index);
        setFixedLabel(tabLabels[index]);
      } else if (index === 1) {
        onScrollIntoTab?.(index);
        setFixedLabel(tabLabels[0]);
      }
    });
  });
  useEffect(() => {
    const list = listRef.current;
    const category = tabCategoryRef.current;
    if (!list || !category) return;
    const observer = new IntersectionObserver(entries => onIntersect(entries));
    observer.observe(category);
    Array.from(list.children).forEach(child => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  const handleScroll = () => {
    const container = listRef.current;
    if (container && container.scrollTop + container.clientHeight >= container.scrollHeight) {
      onScrollBottomReached?.();
    }
  };

  const handleImageError = (key: string) => {
    setBrokenImages(previous => new Set(previous).add(key));
  };

  const handleKeyDownFilteredEmojis = (
    event: KeyboardEvent<HTMLButtonElement>,
    indexEmoji: number,
    emoji: EmojiPickerEmoji,
  ) => {
    event.preventDefault();

    if ((Object.values(ARROW_KEYS) as string[]).includes(event.key)) {
      handleArrowNavigationFiltered(event.key, indexEmoji);
      return;
    }

    switch (event.key) {
      case 'Tab':
        onFocusSkinSelector?.();
        break;
      case 'Enter':
        selectEmoji(emoji, event);
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    indexTab: number,
    indexEmoji: number,
    emoji: EmojiPickerEmoji,
  ) => {
    event.preventDefault();

    if ((Object.values(ARROW_KEYS) as string[]).includes(event.key)) {
      handleArrowNavigation(event.key, indexTab, indexEmoji);
      return;
    }

    switch (event.key) {
      case 'Tab':
        if (event.shiftKey) {
          if (focusEmoji(indexTab, 0) && indexTab > 0) {
            scrollToTab(indexTab, true);
          } else {
            scrollToTab(1, false);
            onFocusSearchInput?.();
          }
        } else {
          if (focusEmoji(indexTab + 1, 0)) {
            scrollToTab(indexTab + 1 + 1, false);
          } else {
            // We are on the last emoji tabset, jump to the skin selector
            onFocusSkinSelector?.();
          }
        }
        break;

      case 'Enter':
        selectEmoji(emoji, event);
        break;

      default:
        break;
    }
  };

  return (
    <div
      className="d-emoji-picker__selector"
      data-qa="dt-emoji-picker-selector"
      onKeyDown={onKeyDown}
    >
      <div
        id="d-emoji-picker-list"
        ref={listRef}
        className="d-emoji-picker__list"
        onScroll={handleScroll}
      >
        {emojiFilter
          ? (
            <p
              className="d-emoji-picker__search-label d-emoji-picker__alignment"
              data-qa="dt-emoji-picker-search-results-label"
            >
              {filteredEmojis.length > 0 ? searchResultsLabel : searchNoResultsLabel}
            </p>
          )
          : (
            <div
              ref={tabCategoryRef}
              className="d-emoji-picker__category d-emoji-picker__alignment"
              data-index="0"
            >
              <p data-qa="dt-emoji-picker-sticky-label">
                {fixedLabel}
              </p>
            </div>
          )}
        {tabLabels.map((tabLabel, indexTab) => {
          const tabEmojis = emojiGroups[tabs[indexTab] + skinTone] ?? emojiGroups[tabs[indexTab]] ?? EMPTY;
          return (
            <div
              key={indexTab}
              ref={(el) => { groupRefs.current[indexTab] = el; }}
              data-qa="dt-emoji-picker-group"
              className="d-emoji-picker__alignment"
              data-index={indexTab + 1}
              style={emojiFilter ? { display: 'none' } : undefined}
            >
              {indexTab > 0 && <p>{tabLabel}</p>}
              <div className="d-emoji-picker__tab">
                {tabEmojis.map((emoji, indexEmoji) => (
                  <button
                    key={imageKey(indexTab, emoji, indexEmoji)}
                    ref={el => (el ? setEmojiRef(el, indexTab, indexEmoji) : undefined)}
                    data-qa="dt-emoji-picker-emoji"
                    type="button"
                    aria-label={emoji.name}
                    style={brokenImages.has(imageKey(indexTab, emoji, indexEmoji)) ? { display: 'none' } : undefined}
                    onClick={event => selectEmoji(emoji, event)}
                    onFocus={() => highlightEmoji(emoji)}
                    onBlur={() => highlightEmoji(null)}
                    onMouseOver={() => highlightEmoji(emoji)}
                    onMouseLeave={() => highlightEmoji(null)}
                    onKeyDown={event => handleKeyDown(event, indexTab, indexEmoji, emoji)}
                  >
                    <img
                      className="d-icon d-icon--size-500"
                      alt={emoji.name}
                      aria-label={emoji.name}
                      title={emoji.name}
                      src={getImgSrc(emoji)}
                      onError={() => handleImageError(imageKey(indexTab, emoji, indexEmoji))}
                    />
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        {emojiFilter && (
          <div className="d-emoji-picker__alignment">
            <div
              className="d-emoji-picker__tab"
              data-qa="filtered-emojis"
            >
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={emoji.shortname}
                  ref={el => (el ? setFilteredRef(el, index) : undefined)}
                  data-qa="dt-emoji-picker-emoji"
                  type="button"
                  aria-label={emoji.name}
                  className={cx({ 'hover-emoji': index === 0 && hoverFirstEmoji })}
                  onClick={event => selectEmoji(emoji, event)}
                  onFocus={() => highlightEmoji(emoji)}
                  onBlur={() => highlightEmoji(null)}
                  onMouseOver={() => hoverEmoji(emoji)}
                  onMouseLeave={() => hoverEmoji(null)}
                  onKeyDown={event => handleKeyDownFilteredEmojis(event, index, emoji)}
                >
                  <img
                    className="d-icon d-icon--size-500"
                    alt={emoji.name}
                    aria-label={emoji.name}
                    title={emoji.name}
                    src={`${CDN_URL + emoji.unicode_character}.png`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
