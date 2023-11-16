import { ref } from 'vue';

export function useKeyboardNavigation (emits) {
  const emojiRefs = ref([]);
  const emojiFilteredRefs = ref([]);

  const isFiltering = ref(false);

  const hoverFirstEmoji = ref(true);

  function hoverEmoji (emoji, isFirst = false) {
    hoverFirstEmoji.value = isFirst;
    emits('highlighted-emoji', emoji);
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

  function focusEmoji (indexTab, indexEmoji) {
    const emojiRef = isFiltering.value ? emojiFilteredRefs.value?.[indexEmoji] : emojiRefs.value?.[indexTab]?.[indexEmoji];

    if (emojiRef) {
      emojiRef.focus();
      return true;
    }

    return false;
  }

  function handleArrowLeft (indexTab, indexEmoji) {
    if (!focusEmoji(indexTab, indexEmoji - 1)) {
      if (emojiRefs.value[indexTab - 1]) {
        focusEmoji(indexTab - 1, emojiRefs.value[indexTab - 1].length - 1);
      } else {
        focusEmoji(emojiRefs.value.length - 1, emojiRefs.value[emojiRefs.value.length - 1].length - 1);
      }
    }
  }

  function handleArrowRight (indexTab, indexEmoji) {
    if (!focusEmoji(indexTab, indexEmoji + 1)) {
      if (!focusEmoji(indexTab + 1, 0)) {
        focusEmoji(0, 0);
      }
    }
  }

  function handleArrowLeftFiltered (indexTab, indexEmoji) {
    if (!focusEmoji(0, indexEmoji - 1)) {
      focusEmoji(0, emojiFilteredRefs.value.length - 1);
    }
  }

  function handleArrowRightFiltered (indexTab, indexEmoji) {
    if (!focusEmoji(0, indexEmoji + 1)) {
      focusEmoji(0, 0);
    }
  }

  function handleHorizontalNavigation (direction, indexTab, indexEmoji) {
    if (isFiltering.value) {
      if (direction === 'left') {
        handleArrowLeftFiltered(indexTab, indexEmoji);
      } else if (direction === 'right') {
        handleArrowRightFiltered(indexTab, indexEmoji);
      }
    } else {
      if (direction === 'left') {
        handleArrowLeft(indexTab, indexEmoji);
      } else if (direction === 'right') {
        handleArrowRight(indexTab, indexEmoji);
      }
    }
  }

  return {
    emojiRefs,
    emojiFilteredRefs,
    isFiltering,
    hoverFirstEmoji,
    setEmojiRef,
    setFilteredRef,
    hoverEmoji,
    focusEmoji,
    handleHorizontalNavigation,
  };
}
