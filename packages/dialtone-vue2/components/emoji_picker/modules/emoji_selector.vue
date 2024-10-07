<template>
  <div
    class="d-emoji-picker__selector"
  >
    <div
      id="d-emoji-picker-list"
      ref="listRef"
      class="d-emoji-picker__list"
    >
      <p
        v-if="emojiFilter"
        class="d-emoji-picker__search-label d-emoji-picker__alignment"
      >
        {{ filteredEmojis.length > 0 ? searchResultsLabel : searchNoResultsLabel }}
      </p>
      <div
        v-else
        ref="tabCategoryRef"
        class="d-emoji-picker__category d-emoji-picker__alignment"
      >
        <p>
          {{ fixedLabel }}
        </p>
      </div>
      <div
        v-for="(tabLabel, indexTab) in tabLabels"
        v-show="!emojiFilter"
        :key="indexTab"
        :ref="`tabLabelRef-${indexTab}`"
        class="d-emoji-picker__alignment"
      >
        <p
          v-if="indexTab"
        >
          {{ tabLabel.label }}
        </p>
        <div
          class="d-emoji-picker__tab"
        >
          <button
            v-for="(emoji, indexEmoji) in
            (emojis[tabs[indexTab] + skinTone] ? emojis[tabs[indexTab] + skinTone] : emojis[tabs[indexTab]])"
            :key="emoji.shortname"
            :ref="`emojiRef-${indexTab}`"
            type="button"
            :aria-label="emoji.name"
            @click="$emit('selected-emoji', emoji)"
            @focusin="$emit('highlighted-emoji', emoji)"
            @focusout="$emit('highlighted-emoji', null)"
            @mouseover="$emit('highlighted-emoji', emoji)"
            @mouseleave="$emit('highlighted-emoji', null)"
            @keydown="event => handleKeyDown(event, indexTab, indexEmoji, emoji)"
          >
            <img
              class="d-icon d-icon--size-500"
              :alt="emoji.name"
              :aria-label="emoji.name"
              :title="emoji.name"
              :src="getImgSrc(emoji.unicode_character)"
              @error="handleImageError"
            >
          </button>
        </div>
      </div>
      <div
        v-if="emojiFilter"
        class="d-emoji-picker__alignment"
      >
        <div
          class="d-emoji-picker__tab "
          data-qa="filtered-emojis"
        >
          <button
            v-for="(emoji, index) in filteredEmojis"
            :key="emoji.shortname"
            :ref="`filteredEmoji-${index}`"
            type="button"
            :aria-label="emoji.name"
            :class="{
              'hover-emoji': (index === 0 && hoverFirstEmoji),
            }"
            @click="$emit('selected-emoji', emoji)"
            @focusin="$emit('highlighted-emoji', emoji)"
            @focusout="$emit('highlighted-emoji', null)"
            @mouseover="hoverEmoji(emoji)"
            @mouseleave="hoverEmoji(null)"
            @keydown="event => handleKeyDownFilteredEmojis(event, index, emoji)"
          >
            <img
              class="d-icon d-icon--size-500"
              :alt="emoji.name"
              :aria-label="emoji.name"
              :title="emoji.name"
              :src="`${CDN_URL + emoji.unicode_character}.png`"
            >
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable max-lines */
import { emojisGrouped as emojisImported } from '@dialpad/dialtone-emojis';
import { CDN_URL, EMOJIS_PER_ROW } from '@/components/emoji_picker';

export default {
  name: 'EmojiSelector',

  props: {
    emojiFilter: {
      type: String,
      default: '',
    },

    skinTone: {
      type: String,
      required: true,
    },

    tabSetLabels: {
      type: Array,
      required: true,
    },

    selectedTabset: {
      type: Object,
      required: true,
    },

    searchResultsLabel: {
      type: String,
      required: true,
    },

    searchNoResultsLabel: {
      type: String,
      required: true,
    },

    recentlyUsedEmojis: {
      type: Array,
      default: () => [],
    },
  },

  data () {
    return {
      tabLabelsRefs: [],
      emojiRefs: [],
      emojiFilteredRefs: [],
      isFiltering: false,
      hoverFirstEmoji: true,
      fixedLabel: '',
      filteredEmojis: [],
      TABS_DATA: ['Recently used', 'People', 'Nature', 'Food', 'Activity', 'Travel', 'Objects', 'Symbols', 'Flags'],
      tabLabelObserver: null,
    };
  },

  computed: {
    /* eslint-disable-next-line complexity */
    currentEmojis () {
      return [
        ...this.emojis[`People${this.skinTone}`] || [],
        ...this.emojis.Nature || [],
        ...this.emojis.Food || [],
        ...this.emojis[`Activity${this.skinTone}`] || [],
        ...this.emojis.Travel || [],
        ...this.emojis[`Objects${this.skinTone}`] || [],
        ...this.emojis.Symbols || [],
        ...this.emojis.Flags || [],
      ];
    },

    emojis () {
      return emojisImported;
    },

    CDN_URL () {
      return CDN_URL;
    },

    tabLabels () {
      return this.recentlyUsedEmojis.length
        ? this.tabSetLabels.map((label) => ({ label }))
        : this.tabSetLabels.slice(1).map((label) => ({ label }));
    },

    tabs () {
      return this.recentlyUsedEmojis.length ? this.TABS_DATA : this.TABS_DATA.slice(1);
    },
  },

  watch: {
    currentEmojis: {
      handler () {
        this.searchByNameAndKeywords();
      },

      immediate: true,
    },

    recentlyUsedEmojis: {
      handler (newValue) {
        this.emojis['Recently used'] = newValue;
      },

      immediate: true,
    },

    emojiFilter: {
      handler (newFilter) {
        this.resetScroll();
        if (newFilter) {
          this.isFiltering = true;
        } else {
          this.isFiltering = false;
          this.$emit('highlighted-emoji', null);
        }

        this.debouncedSearch();
      },
    },

    selectedTabset: {
      handler (newValue) {
        this.scrollToTab(newValue.tabId);
      },

      deep: true,
    },
  },

  created () {
    this.debouncedSearch = this.debounce(this.searchByNameAndKeywords, 300);
  },

  mounted () {
    this.$nextTick(() => {
      this.setupEmojiRefs();
      this.setupFilteredRefs();
      this.setupTabLabelRefs();
      this.setTabLabelObserver();
    });
  },

  beforeDestroy () {
    if (this.tabLabelObserver) {
      this.tabLabelObserver.disconnect();
    }
  },

  methods: {
    setupTabLabelRefs () {
      this.tabSetLabels?.forEach((_, index) => {
        const refKey = `tabLabelRef-${index}`;
        if (this.$refs[refKey]) {
          this.$set(this.tabLabelsRefs, index, { ref: this.$refs[refKey] });
        }
      });
    },

    setupFilteredRefs () {
      // it is necessary to clean the array before setting the new refs
      this.emojiFilteredRefs = [];

      this.filteredEmojis.forEach((emoji, index) => {
        const refKey = `filteredEmoji-${index}`;
        if (this.$refs[refKey]) {
          this.setFilteredRef(this.$refs[refKey], index);
        }
      });
    },

    setupEmojiRefs () {
      for (let i = 0; i < this.tabs.length; i++) {
        const refKey = `emojiRef-${i}`;
        if (this.$refs[refKey]) {
          this.$refs[refKey].forEach((el, indexEmoji) => {
            if (el) {
              this.setEmojiRef(el, i, indexEmoji);
            }
          });
        }
      }
    },

    searchByNameAndKeywords () {
      const searchStr = this.emojiFilter.toLowerCase();
      this.filteredEmojis = this.currentEmojis.filter(function (obj) {
        const nameIncludesSearchStr = obj.name.toLowerCase().includes(searchStr);
        const keywordsIncludeSearchStr = obj.keywords.some(function (keyword) {
          return keyword.toLowerCase().includes(searchStr);
        });
        return nameIncludesSearchStr || keywordsIncludeSearchStr;
      });
      this.$nextTick(function () {
        if (searchStr) {
          this.hoverEmoji(this.filteredEmojis[0], true);
          this.setupFilteredRefs();
        }
      });
    },

    debounce: function (fn, delay) {
      if (delay === undefined) { delay = 300; }
      let timeout;
      return function () {
        const args = []; let len = arguments.length;
        while (len--) args[len] = arguments[len];

        clearTimeout(timeout);
        timeout = setTimeout(function () {
          fn.apply(undefined, args);
        }, delay);
      };
    },

    getImgSrc: function (emoji) {
      return this.CDN_URL + emoji + '.png';
    },

    handleImageError: function (event) {
      event.target.parentNode.style.display = 'none';
    },

    scrollToTab: function (tabIndex, focusFirstEmoji) {
      const vm = this;
      if (focusFirstEmoji === undefined) { focusFirstEmoji = true; }
      const tabElement = vm.tabLabelsRefs[tabIndex - 1].ref[0];

      vm.$nextTick(function () {
        const container = vm.$refs.listRef;
        const offsetTop = tabIndex === 1 ? 0 : tabElement.offsetTop - 15;

        container.scrollTop = offsetTop;

        if (focusFirstEmoji) {
          vm.focusEmoji(tabIndex - 1, 0);
        }
      });
    },

    resetScroll: function () {
      const container = this.$refs.listRef;
      container.scrollTop = 0;
    },

    focusEmojiSelector: function () {
      this.focusEmoji(0, 0);
    },

    hoverEmoji (emoji, isFirst) {
      if (isFirst === undefined) { isFirst = false; }
      this.hoverFirstEmoji = isFirst;
      this.$emit('highlighted-emoji', emoji);
    },

    setEmojiRef: function (el, indexTab, indexEmoji) {
      if (!this.emojiRefs[indexTab]) {
        this.$set(this.emojiRefs, indexTab, []);
      }
      this.$set(this.emojiRefs[indexTab], indexEmoji, el);
    },

    setFilteredRef: function (el, index) {
      this.$set(this.emojiFilteredRefs, index, el);
    },

    focusEmoji: function (indexTab, indexEmoji) {
      // eslint-disable-next-line max-len
      const emojiRef = this.isFiltering ? this.emojiFilteredRefs[indexEmoji]?.[0] : this.emojiRefs[indexTab] && this.emojiRefs[indexTab][indexEmoji];
      if (emojiRef) {
        emojiRef.focus();
        return true;
      }

      return false;
    },

    // eslint-disable-next-line complexity
    handleKeyDown: function (event, indexTab, indexEmoji, emoji) {
      event.preventDefault();

      if (event.key === 'ArrowUp') {
        const position = indexEmoji % EMOJIS_PER_ROW;

        if (indexTab === 0) {
          // we are on the first emoji tab, then we should jump to the last row of the last emoji tab
          const numberOfMissingEmojis =
        EMOJIS_PER_ROW - (this.emojiRefs[this.emojiRefs.length - 1].length % EMOJIS_PER_ROW);

          const emojiToJump =
        this.emojiRefs[this.emojiRefs.length - 1].length + numberOfMissingEmojis - (EMOJIS_PER_ROW - position);

          if (!this.focusEmoji(this.emojiRefs.length - 1, emojiToJump)) {
            // if there is no emoji in this position, jump to the last emoji of the row
            this.focusEmoji(this.emojiRefs.length - 1, this.emojiRefs[this.emojiRefs.length - 1].length - 1);
          }
          return;
        }

        // if we are not on the first tab, we should jump to the previous row of the current tab
        if (!this.focusEmoji(indexTab, indexEmoji - EMOJIS_PER_ROW)) {
          // if there is no previous row, we should jump to emoji in the sampe position of the previous tab
          const previousTab = indexTab - 1 < 0 ? 0 : indexTab - 1;
          const emojisInPreviousTab = this.emojiRefs[previousTab].length;
          const lastEmojiPosition = emojisInPreviousTab - (emojisInPreviousTab % EMOJIS_PER_ROW) + position;

          if (!this.focusEmoji(previousTab, lastEmojiPosition)) {
            // if there is no emoji in this position, jump to the last emoji of the row
            this.focusEmoji(indexTab - 1, this.emojiRefs[indexTab - 1].length - 1);
          }
        }
      }

      if (event.key === 'ArrowDown') {
        if (!this.focusEmoji(indexTab, indexEmoji + EMOJIS_PER_ROW)) {
          // if cannot go down

          // Calculate position from cell 0 to cell 8
          const position = indexEmoji % EMOJIS_PER_ROW;

          // check if it exists a next row in the current tab
          if (this.emojiRefs?.[indexTab]?.[indexEmoji + (EMOJIS_PER_ROW - position)]) {
            // if it exists, we should focus the last emoji of the next row in the current tab
            this.focusEmoji(indexTab, this.emojiRefs[indexTab].length - 1);
            // if we are at the end of the list it will do nothing
          } else {
            // We don't have next row, we are in the last of the tab, then jump
            // to the next tab but in the equal emoji position in row 0.

            if (!this.focusEmoji(indexTab + 1, position)) {
              // We are on the bottom!, should jump to the same position emoji in the first row of the first tabset
              // if it doesn't has, jump to the last
              if (!this.focusEmoji(0, position)) {
                this.focusEmoji(0, this.emojiRefs[0].length - 1);
              }
            }
          }
        }
      }

      if (event.key === 'ArrowLeft') {
        this.handleHorizontalNavigation('left', indexTab, indexEmoji);
      }

      if (event.key === 'ArrowRight') {
        this.handleHorizontalNavigation('right', indexTab, indexEmoji);
      }

      if (event.key === 'Tab' && !event.shiftKey) {
        if (this.focusEmoji(indexTab + 1, 0)) {
          this.scrollToTab((indexTab + 1) + 1, false);
        } else {
          // We are on the last emoji tabset, jump to the skin selector
          this.$emit('focus-skin-selector');
        }
      }

      if (event.key === 'Tab' && event.shiftKey) {
        if (this.focusEmoji(indexTab, 0) && indexTab > 0) {
          this.scrollToTab(indexTab, true);
        } else {
          this.scrollToTab(1, false);
          this.$emit('focus-search-input');
        }
      }

      if (event.key === 'Enter') {
        this.$emit('selected-emoji', emoji);
      }
    },

    /* eslint-disable-next-line complexity */
    handleHorizontalNavigation: function (direction, indexTab, indexEmoji) {
      if (this.isFiltering) {
        if (direction === 'left') {
          this.handleArrowLeftFiltered(indexTab, indexEmoji);
        } else if (direction === 'right') {
          this.handleArrowRightFiltered(indexTab, indexEmoji);
        }
      } else {
        if (direction === 'left') {
          this.handleArrowLeft(indexTab, indexEmoji);
        } else if (direction === 'right') {
          this.handleArrowRight(indexTab, indexEmoji);
        }
      }
    },

    handleArrowLeftFiltered: function (indexTab, indexEmoji) {
      if (!this.focusEmoji(0, indexEmoji - 1)) {
        this.focusEmoji(0, this.emojiFilteredRefs.length - 1);
      }
    },

    handleArrowRightFiltered: function (indexTab, indexEmoji) {
      if (!this.focusEmoji(0, indexEmoji + 1)) {
        this.focusEmoji(0, 0);
      }
    },

    handleArrowLeft: function (indexTab, indexEmoji) {
      if (!this.focusEmoji(indexTab, indexEmoji - 1)) {
        if (this.emojiRefs[indexTab - 1]) {
          this.focusEmoji(indexTab - 1, this.emojiRefs[indexTab - 1].length - 1);
        } else {
          this.focusEmoji(this.emojiRefs.length - 1, this.emojiRefs[this.emojiRefs.length - 1].length - 1);
        }
      }
    },

    handleArrowRight: function (indexTab, indexEmoji) {
      if (!this.focusEmoji(indexTab, indexEmoji + 1)) {
        if (!this.focusEmoji(indexTab + 1, 0)) {
          this.focusEmoji(0, 0);
        }
      }
    },

    /* eslint-disable-next-line complexity */
    handleKeyDownFilteredEmojis (event, indexEmoji, emoji) {
      event.preventDefault();
      this.hoverFirstEmoji = false;

      if (event.key === 'ArrowUp') {
        const position = indexEmoji % EMOJIS_PER_ROW;
        if (!this.focusEmoji(0, indexEmoji - EMOJIS_PER_ROW)) {
          const lastEmojiPosition =
          this.emojiFilteredRefs.length - (this.emojiFilteredRefs.length % EMOJIS_PER_ROW) + position;

          this.focusEmoji(0, lastEmojiPosition);

          if (!this.focusEmoji(0, lastEmojiPosition)) {
            this.focusEmoji(0, this.emojiFilteredRefs.length - 1);
          }
        }
      }

      if (event.key === 'ArrowDown') {
        if (!this.focusEmoji(0, indexEmoji + EMOJIS_PER_ROW)) {
          const position = indexEmoji % EMOJIS_PER_ROW;

          if (this.emojiFilteredRefs?.[indexEmoji + (EMOJIS_PER_ROW - position)]) {
            this.focusEmoji(0, this.emojiFilteredRefs.length - 1);
          } else {
            this.focusEmoji(0, position);
          }
        }
      }

      if (event.key === 'ArrowLeft') {
        this.handleHorizontalNavigation('left', 0, indexEmoji);
      }

      if (event.key === 'ArrowRight') {
        this.handleHorizontalNavigation('right', 0, indexEmoji);
      }

      if (event.key === 'Tab') {
        this.$emit('focus-skin-selector');
      }

      if (event.key === 'Enter') {
        this.$emit('selected-emoji', emoji);
      }
    },

    setTabLabelObserver () {
      this.tabLabelObserver = new IntersectionObserver(entries => {
        /* eslint-disable-next-line complexity */
        entries.forEach(entry => {
          const { target } = entry;
          const index = parseInt(target.dataset.index);

          if (entry.isIntersecting && target.offsetTop <= this.$refs.tabCategoryRef?.offsetTop + 50) {
            this.fixedLabel = this.tabLabels[index - 1]?.label ?? this.tabLabels[0]?.label;
            this.$emit('scroll-into-tab', index - 1);
          } else if (entry.boundingClientRect.bottom <= this.$refs.tabCategoryRef?.getBoundingClientRect().bottom) {
            this.$emit('scroll-into-tab', index);
            this.fixedLabel = this.tabLabels[index]?.label;
          } else if (index === 1) {
            this.$emit('scroll-into-tab', index);
            this.fixedLabel = this.tabLabels[0]?.label;
          }
        });
      });

      this.tabLabelObserver.observe(this.$refs.tabCategoryRef);

      Array.from(this.$refs.listRef.children).forEach((child, index) => {
        this.tabLabelObserver.observe(child);
        child.dataset.index = index;
      });
    },

    focusLastEmoji () {
      this.scrollToTab(this.tabs.length, true);
    },

  },

};
</script>
