import { useCallback, useRef, useState } from 'react';
import { ARROW_KEYS, EMOJIS_PER_ROW } from '../EmojiPickerConstants';

type EmojiElement = HTMLElement | undefined;

/** Drops the trailing slots left empty by unmounted elements, so `length` counts the elements still rendered. */
function trim<T> (list: (T | undefined)[]) {
  while (list.length && list[list.length - 1] === undefined) list.pop();
}

/**
 * Arrow-key navigation over the emoji grid, by tab and by position, or over the search results when filtering.
 * Vue keeps the elements in refs its template fills; here callback refs register them and unregister them on unmount,
 * so the lists hold only rendered emojis.
 */
export function useKeyboardNavigation () {
  const emojiRefs = useRef<EmojiElement[][]>([]);
  const emojiFilteredRefs = useRef<EmojiElement[]>([]);
  // Read by focusEmoji, which effects and handlers call: the caller keeps it in sync with its filter.
  const isFiltering = useRef(false);
  const [hoverFirstEmoji, setHoverFirstEmoji] = useState(true);

  const tabLength = (indexTab: number) => emojiRefs.current[indexTab]?.length ?? 0;
  const lastTab = () => emojiRefs.current.length - 1;

  const focusEmoji = useCallback((indexTab: number, indexEmoji: number) => {
    const emojiRef = isFiltering.current
      ? emojiFilteredRefs.current[indexEmoji]
      : emojiRefs.current[indexTab]?.[indexEmoji];

    if (emojiRef) {
      emojiRef.focus();
      return true;
    }

    return false;
  }, []);

  function _handleArrowLeft (indexTab: number, indexEmoji: number) {
    if (!focusEmoji(indexTab, indexEmoji - 1)) {
      if (emojiRefs.current[indexTab - 1]) {
        focusEmoji(indexTab - 1, tabLength(indexTab - 1) - 1);
      } else {
        focusEmoji(lastTab(), tabLength(lastTab()) - 1);
      }
    }
  }

  function _handleArrowRight (indexTab: number, indexEmoji: number) {
    if (!focusEmoji(indexTab, indexEmoji + 1)) {
      if (!focusEmoji(indexTab + 1, 0)) {
        focusEmoji(0, 0);
      }
    }
  }

  function _handleArrowLeftFiltered (indexEmoji: number) {
    if (!focusEmoji(0, indexEmoji - 1)) {
      focusEmoji(0, emojiFilteredRefs.current.length - 1);
    }
  }

  function _handleArrowRightFiltered (indexEmoji: number) {
    if (!focusEmoji(0, indexEmoji + 1)) {
      focusEmoji(0, 0);
    }
  }

  function _handleHorizontalNavigation (direction: 'left' | 'right', indexTab: number, indexEmoji: number) {
    if (isFiltering.current) {
      if (direction === 'left') {
        _handleArrowLeftFiltered(indexEmoji);
      } else {
        _handleArrowRightFiltered(indexEmoji);
      }
    } else {
      if (direction === 'left') {
        _handleArrowLeft(indexTab, indexEmoji);
      } else {
        _handleArrowRight(indexTab, indexEmoji);
      }
    }
  }

  /** A callback ref for the emoji at `indexEmoji` of tab `indexTab`; its cleanup unregisters it. */
  const setEmojiRef = (el: HTMLElement, indexTab: number, indexEmoji: number) => {
    if (!emojiRefs.current[indexTab]) {
      emojiRefs.current[indexTab] = [];
    }
    emojiRefs.current[indexTab][indexEmoji] = el;
    return () => {
      const tab = emojiRefs.current[indexTab];
      if (tab?.[indexEmoji] !== el) return;
      tab[indexEmoji] = undefined;
      trim(tab);
      while (emojiRefs.current.length && !emojiRefs.current[emojiRefs.current.length - 1]?.length) {
        emojiRefs.current.pop();
      }
    };
  };

  /** A callback ref for the search result at `index`; its cleanup unregisters it. */
  const setFilteredRef = (el: HTMLElement, index: number) => {
    emojiFilteredRefs.current[index] = el;
    return () => {
      if (emojiFilteredRefs.current[index] !== el) return;
      emojiFilteredRefs.current[index] = undefined;
      trim(emojiFilteredRefs.current);
    };
  };

  function handleArrowNavigationFiltered (key: string, indexEmoji: number) {
    setHoverFirstEmoji(false);
    const filteredLength = emojiFilteredRefs.current.length;

    if (key === ARROW_KEYS.ARROW_UP) {
      const position = indexEmoji % EMOJIS_PER_ROW;

      if (!focusEmoji(0, indexEmoji - EMOJIS_PER_ROW)) {
        const lastEmojiPosition = filteredLength - (filteredLength % EMOJIS_PER_ROW) + position;

        if (!focusEmoji(0, lastEmojiPosition)) {
          focusEmoji(0, filteredLength - 1);
        }
      }
    }

    if (key === ARROW_KEYS.ARROW_DOWN) {
      if (!focusEmoji(0, indexEmoji + EMOJIS_PER_ROW)) {
        const position = indexEmoji % EMOJIS_PER_ROW;

        if (emojiFilteredRefs.current[indexEmoji + (EMOJIS_PER_ROW - position)]) {
          focusEmoji(0, filteredLength - 1);
        } else {
          focusEmoji(0, position);
        }
      }
    }

    if (key === ARROW_KEYS.ARROW_LEFT) {
      _handleHorizontalNavigation('left', 0, indexEmoji);
    }

    if (key === ARROW_KEYS.ARROW_RIGHT) {
      _handleHorizontalNavigation('right', 0, indexEmoji);
    }
  }

  function handleArrowNavigation (key: string, indexTab: number, indexEmoji: number) {
    if (key === ARROW_KEYS.ARROW_UP) {
      const position = indexEmoji % EMOJIS_PER_ROW;

      if (indexTab === 0) {
        // we are on the first emoji tab, then we should jump to the last row of the last emoji tab
        const lastTabLength = tabLength(lastTab());
        const numberOfMissingEmojis = EMOJIS_PER_ROW - (lastTabLength % EMOJIS_PER_ROW);
        const emojiToJump = lastTabLength + numberOfMissingEmojis - (EMOJIS_PER_ROW - position);

        if (!focusEmoji(lastTab(), emojiToJump)) {
          // if there is no emoji in this position, jump to the last emoji of the row
          focusEmoji(lastTab(), lastTabLength - 1);
        }
        return;
      }

      // if we are not on the first tab, we should jump to the previous row of the current tab
      if (!focusEmoji(indexTab, indexEmoji - EMOJIS_PER_ROW)) {
        // if there is no previous row, we should jump to emoji in the same position of the previous tab
        const previousTab = indexTab - 1 < 0 ? 0 : indexTab - 1;
        const emojisInPreviousTab = tabLength(previousTab);
        const lastEmojiPosition = emojisInPreviousTab - (emojisInPreviousTab % EMOJIS_PER_ROW) + position;

        if (!focusEmoji(previousTab, lastEmojiPosition)) {
          // if there is no emoji in this position, jump to the last emoji of the row
          focusEmoji(indexTab - 1, tabLength(indexTab - 1) - 1);
        }
      }
    }

    if (key === ARROW_KEYS.ARROW_DOWN) {
      if (!focusEmoji(indexTab, indexEmoji + EMOJIS_PER_ROW)) {
        // Calculate position from cell 0 to cell 8
        const position = indexEmoji % EMOJIS_PER_ROW;

        // check if it exists a next row in the current tab
        if (emojiRefs.current[indexTab]?.[indexEmoji + (EMOJIS_PER_ROW - position)]) {
          // if it exists, we should focus the last emoji of the next row in the current tab
          focusEmoji(indexTab, tabLength(indexTab) - 1);
        } else {
          // We don't have next row, we are in the last of the tab, then jump
          // to the next tab but in the equal emoji position in row 0.
          if (!focusEmoji(indexTab + 1, position)) {
            // We are on the bottom!, should jump to the same position emoji in the first row of the first tabset
            // if it doesn't has, jump to the last
            if (!focusEmoji(0, position)) {
              focusEmoji(0, tabLength(0) - 1);
            }
          }
        }
      }
    }

    if (key === ARROW_KEYS.ARROW_LEFT) {
      _handleHorizontalNavigation('left', indexTab, indexEmoji);
    }

    if (key === ARROW_KEYS.ARROW_RIGHT) {
      _handleHorizontalNavigation('right', indexTab, indexEmoji);
    }
  }

  return {
    emojiFilteredRefs,
    isFiltering,
    hoverFirstEmoji,
    setHoverFirstEmoji,
    setEmojiRef,
    setFilteredRef,
    focusEmoji,
    handleArrowNavigationFiltered,
    handleArrowNavigation,
  };
}
