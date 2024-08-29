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
          <component
            :is="tab.icon"
            size="400"
          />
        </dt-tab>
      </template>
    </dt-tab-group>
  </div>
</template>

<script>
import { DtTab, DtTabGroup } from '@/components/tabs';
import { EMOJI_PICKER_CATEGORIES } from '@/components/emoji_picker';
import {
  DtIconClock,
  DtIconSatisfied,
  DtIconLivingThing,
  DtIconFood,
  DtIconObject,
  DtIconTransportation,
  DtIconLightbulb,
  DtIconHeart,
  DtIconFlag,
} from '@dialpad/dialtone-icons/vue2';

export default {
  name: 'EmojiTabset',

  components: {
    DtTabGroup,
    DtTab,
  },

  props: {
    /**
     * Whether to show the recently used tab or not
     * @type {Boolean}
     * @default false
     */
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

    /**
     * The labels for the aria-label
     * @type {Array}
     * @required
     */
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
        { label: EMOJI_PICKER_CATEGORIES.MOST_RECENTLY_USED, icon: DtIconClock },
        { label: EMOJI_PICKER_CATEGORIES.SMILEYS_AND_PEOPLE, icon: DtIconSatisfied },
        { label: EMOJI_PICKER_CATEGORIES.NATURE, icon: DtIconLivingThing },
        { label: EMOJI_PICKER_CATEGORIES.FOOD, icon: DtIconFood },
        { label: EMOJI_PICKER_CATEGORIES.ACTIVITY, icon: DtIconObject },
        { label: EMOJI_PICKER_CATEGORIES.TRAVEL, icon: DtIconTransportation },
        { label: EMOJI_PICKER_CATEGORIES.OBJECTS, icon: DtIconLightbulb },
        { label: EMOJI_PICKER_CATEGORIES.SYMBOLS, icon: DtIconHeart },
        { label: EMOJI_PICKER_CATEGORIES.FLAGS, icon: DtIconFlag },
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

    // eslint-disable-next-line complexity
    handleKeyDown (event, tabId) {
      if (event.key === 'Enter') {
        this.selectTabset(tabId);
        if (this.tabsetRef[tabId - 1]) {
          this.tabsetRef[tabId - 1].blur();
        }
      }

      if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
          this.$emit('focus-skin-selector');
        } else {
          this.$emit('focus-search-input');
        }
      }

      if (event.key === 'ArrowDown') {
        this.$emit('focus-search-input');
      }
    },
  },
};
</script>
