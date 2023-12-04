<template>
  <div class="d-emoji-picker__tabset">
    <dt-tab-group
      tab-list-class="d-emoji-picker__tabset-list"
      :selected="selectedTab"
    >
      <template #tabs>
        <dt-tab
          v-for="(tab, index) in tabs"
          :id="tab.id"
          :ref="`tabsetRef-${index}`"
          :key="tab.id"
          :panel-id="tab.panelId"
          :label="tab.label"
          aria-controls="d-emoji-picker-list"
          :tabindex="index + 1"
          @click.capture.stop="selectTabset(tab.id)"
          @keydown="handleKeyDown($event, tab.id)"
        >
          <dt-icon
            size="400"
            :name="tab.icon"
          />
        </dt-tab>
      </template>
    </dt-tab-group>
  </div>
</template>

<script>
import DtTabGroup from '@/components/tabs/tab_group.vue';
import DtTab from '@/components/tabs/tab.vue';
import DtIcon from '@/components/icon/icon.vue';
import { EMOJI_PICKER_CATEGORIES } from '@/components/emoji_picker/emoji_picker_constants';

export default {
  name: 'EmojiTabset',

  components: {
    DtTabGroup,
    DtTab,
    DtIcon,
  },

  props: {
    showRecentlyUsedTab: {
      type: Boolean,
      default: false,
    },

    scrollIntoTab: {
      type: Number,
      required: true,
    },

    isScrolling: {
      type: Boolean,
      default: false,
    },

    emojiFilter: {
      type: String,
      default: '',
    },

    tabSetLabels: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      selectedTab: '1',
      tabsetRef: [],
      TABS_DATA: [
        { label: EMOJI_PICKER_CATEGORIES.MOST_RECENTLY_USED, icon: 'clock' },
        { label: EMOJI_PICKER_CATEGORIES.SMILEYS_AND_PEOPLE, icon: 'satisfied' },
        { label: EMOJI_PICKER_CATEGORIES.NATURE, icon: 'living-thing' },
        { label: EMOJI_PICKER_CATEGORIES.FOOD, icon: 'food' },
        { label: EMOJI_PICKER_CATEGORIES.ACTIVITY, icon: 'object' },
        { label: EMOJI_PICKER_CATEGORIES.TRAVEL, icon: 'transportation' },
        { label: EMOJI_PICKER_CATEGORIES.OBJECTS, icon: 'lightbulb' },
        { label: EMOJI_PICKER_CATEGORIES.SYMBOLS, icon: 'heart' },
        { label: EMOJI_PICKER_CATEGORIES.FLAGS, icon: 'flag' },
      ],
    };
  },

  computed: {
    tabs () {
      const tabsData = this.showRecentlyUsedTab ? this.TABS_DATA : this.TABS_DATA.slice(1);
      return tabsData.map((tab, index) => ({
        ...tab,
        label: this.tabSetLabels[index],
        id: (index + 1).toString(),
        panelId: (index + 1).toString(),
      }));
    },

    isSearching () {
      return this.emojiFilter.length > 0;
    },
  },

  watch: {
    scrollIntoTab: function (newVal) {
      if (!this.isScrolling && !this.isSearching) {
        this.selectedTab = (newVal + 1).toString();
      }
    },

    isSearching: function (newVal) {
      if (newVal) {
        this.selectedTab = null;
      }
    },
  },

  mounted () {
    this.$nextTick(() => {
      this.setTabsetRef();
    });
  },

  methods: {
    selectTabset (id) {
      if (!this.isScrolling) {
        this.selectedTab = id;
      }
      this.$emit('selected-tabset', id);
    },

    setTabsetRef () {
      this.tabs.forEach((skin, index) => {
        const refKey = `tabsetRef-${index}`;
        if (this.$refs[refKey]) {
          this.$set(this.tabsetRef, index, this.$refs[refKey][0].$el);
        }
      });
    },

    focusTabset () {
      if (this.tabsetRef[0]) {
        this.tabsetRef[0].focus();
      }
    },

    handleKeyDown (event, tabId) {
      if (event.key === 'Enter') {
        this.selectTabset(tabId);
        if (this.tabsetRef[tabId - 1]) {
          this.tabsetRef[tabId - 1].blur();
        }
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        this.$emit('focus-search-input');
      }

      if (event.key === 'ArrowDown') {
        this.$emit('focus-search-input');
      }
    },
  },
};
</script>
