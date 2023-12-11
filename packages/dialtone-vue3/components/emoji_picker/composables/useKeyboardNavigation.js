import { ref } from 'vue';
import { EMOJIS_PER_ROW, ARROW_KEYS } from '@/components/emoji_picker/emoji_picker_constants';

export function useKeyboardNavigation () {
  const emojiRefs = ref([]);
  const emojiFilteredRefs = ref([]);
  const isFiltering = ref(false);
  const hoverFirstEmoji = ref(true);

  function _handleArrowLeft (indexTab, indexEmoji) {
    if (!focusEmoji(indexTab, indexEmoji - 1)) {
      if (emojiRefs.value[indexTab - 1]) {
        focusEmoji(indexTab - 1, emojiRefs.value[indexTab - 1].length - 1);
      } else {
        focusEmoji(emojiRefs.value.length - 1, emojiRefs.value[emojiRefs.value.length - 1].length - 1);
      }
    }
  }

  function _handleArrowRight (indexTab, indexEmoji) {
    if (!focusEmoji(indexTab, indexEmoji + 1)) {
      if (!focusEmoji(indexTab + 1, 0)) {
        focusEmoji(0, 0);
      }
    }
  }

  function _handleArrowLeftFiltered (indexTab, indexEmoji) {
    if (!focusEmoji(0, indexEmoji - 1)) {
      focusEmoji(0, emojiFilteredRefs.value.length - 1);
    }
  }

  function _handleArrowRightFiltered (indexTab, indexEmoji) {
    if (!focusEmoji(0, indexEmoji + 1)) {
      focusEmoji(0, 0);
    }
  }

  function _handleHorizontalNavigation (direction, indexTab, indexEmoji) {
    if (isFiltering.value) {
      if (direction === 'left') {
        _handleArrowLeftFiltered(indexTab, indexEmoji);
      } else if (direction === 'right') {
        _handleArrowRightFiltered(indexTab, indexEmoji);
      }
    } else {
      if (direction === 'left') {
        _handleArrowLeft(indexTab, indexEmoji);
      } else if (direction === 'right') {
        _handleArrowRight(indexTab, indexEmoji);
      }
    }
  }

  function focusEmoji (indexTab, indexEmoji) {
    const emojiRef = isFiltering.value
      ? emojiFilteredRefs.value?.[indexEmoji]
      : emojiRefs.value?.[indexTab]?.[indexEmoji];

    if (emojiRef) {
      emojiRef.focus();
      return true;
    }

    return false;
  }

  function setEmojiRef (el, indexTab, indexEmoji) {
    if (!emojiRefs.value[indexTab]) {
      emojiRefs.value[indexTab] = [];
    }
    emojiRefs.value[indexTab][indexEmoji] = el;
  }

  function setFilteredRef (el, index) {
    emojiFilteredRefs.value[index] = el;
  }

  function handleArrowNavigationFiltered (key, indexEmoji) {
    hoverFirstEmoji.value = false;

    if (key === ARROW_KEYS.ARROW_UP) {
      const position = indexEmoji % EMOJIS_PER_ROW;

      if (!focusEmoji(0, indexEmoji - EMOJIS_PER_ROW)) {
        const lastEmojiPosition =
        emojiFilteredRefs.value.length - (emojiFilteredRefs.value.length % EMOJIS_PER_ROW) + position;

        focusEmoji(0, lastEmojiPosition);

        if (!focusEmoji(0, lastEmojiPosition)) {
          focusEmoji(0, emojiFilteredRefs.value.length - 1);
        }
      }
    }

    if (key === ARROW_KEYS.ARROW_DOWN) {
      if (!focusEmoji(0, indexEmoji + EMOJIS_PER_ROW)) {
        const position = indexEmoji % EMOJIS_PER_ROW;

        if (emojiFilteredRefs.value?.[indexEmoji + (EMOJIS_PER_ROW - position)]) {
          focusEmoji(0, emojiFilteredRefs.value.length - 1);
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

  function handleArrowNavigation (key, indexTab, indexEmoji) {
    if (key === 'ArrowUp') {
      const position = indexEmoji % EMOJIS_PER_ROW;

      if (indexTab === 0) {
      // we are on the first emoji tab, then we should jump to the last row of the last emoji tab
        const numberOfMissingEmojis =
        EMOJIS_PER_ROW - (emojiRefs.value[emojiRefs.value.length - 1].length % EMOJIS_PER_ROW);

        const emojiToJump =
        emojiRefs.value[emojiRefs.value.length - 1].length + numberOfMissingEmojis - (EMOJIS_PER_ROW - position);

        if (!focusEmoji(emojiRefs.value.length - 1, emojiToJump)) {
        // if there is no emoji in this position, jump to the last emoji of the row
          focusEmoji(emojiRefs.value.length - 1, emojiRefs.value[emojiRefs.value.length - 1].length - 1);
        }
        return;
      }

      // if we are not on the first tab, we should jump to the previous row of the current tab
      if (!focusEmoji(indexTab, indexEmoji - EMOJIS_PER_ROW)) {
      // if there is no previous row, we should jump to emoji in the sampe position of the previous tab
        const previousTab = indexTab - 1 < 0 ? 0 : indexTab - 1;
        const emojisInPreviousTab = emojiRefs.value[previousTab].length;
        const lastEmojiPosition = emojisInPreviousTab - (emojisInPreviousTab % EMOJIS_PER_ROW) + position;

        if (!focusEmoji(previousTab, lastEmojiPosition)) {
        // if there is no emoji in this position, jump to the last emoji of the row
          focusEmoji(indexTab - 1, emojiRefs.value[indexTab - 1].length - 1);
        }
      }
    }

    if (key === 'ArrowDown') {
      if (!focusEmoji(indexTab, indexEmoji + EMOJIS_PER_ROW)) {
      // if cannot go down

        // Calculate position from cell 0 to cell 8
        const position = indexEmoji % EMOJIS_PER_ROW;

        // check if it exists a next row in the current tab
        if (emojiRefs.value?.[indexTab]?.[indexEmoji + (EMOJIS_PER_ROW - position)]) {
        // if it exists, we should focus the last emoji of the next row in the current tab
          focusEmoji(indexTab, emojiRefs.value[indexTab].length - 1);
        // if we are at the end of the list it will do nothing
        } else {
        // We don't have next row, we are in the last of the tab, then jump
        // to the next tab but in the equal emoji position in row 0.

          if (!focusEmoji(indexTab + 1, position)) {
          // We are on the bottom!, should jump to the same position emoji in the first row of the first tabset
          // if it doesn't has, jump to the last
            if (!focusEmoji(0, position)) {
              focusEmoji(0, emojiRefs.value[0].length - 1);
            }
          }
        }
      }
    }

    if (key === 'ArrowLeft') {
      _handleHorizontalNavigation('left', indexTab, indexEmoji);
    }

    if (key === 'ArrowRight') {
      _handleHorizontalNavigation('right', indexTab, indexEmoji);
    }
  }

  return {
    emojiFilteredRefs,
    isFiltering,
    hoverFirstEmoji,
    setEmojiRef,
    setFilteredRef,
    focusEmoji,
    handleArrowNavigationFiltered,
    handleArrowNavigation,
  };
}
