<template>
  <div class="d-emoji-picker__tabset">
    <dt-tab-group
      :selected="selectedTab"
      size="sm"
      tab-list-class="d-emoji-picker__tabset-list"
    >
      <template #tabs>
        <dt-tab
          v-for="(tab, index) in tabs"
          :id="tab.id"
          :key="tab.id"
          :ref="`tabsetRef-${index}`"
          :label="tab.label"
          :panel-id="tab.panelId"
          :tabindex="index + 1"
          aria-controls="d-emoji-picker-list"
          @keydown="handleKeyDown($event, tab.id)"
          @click.capture.stop="selectTabset(tab.id)"
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
import { DtTab, DtTabGroup } from '@/components/tab';
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
  DtIconDialpadStar,
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

    showCustomEmojisTab: {
      type: Boolean,
      default: false,
    },

    scrollIntoTab: {
      type: Number,
      required: true,
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
        { label: this.tabSetLabels[0], icon: DtIconClock },
        { label: this.tabSetLabels[1], icon: DtIconSatisfied },
        { label: this.tabSetLabels[2], icon: DtIconLivingThing },
        { label: this.tabSetLabels[3], icon: DtIconFood },
        { label: this.tabSetLabels[4], icon: DtIconObject },
        { label: this.tabSetLabels[5], icon: DtIconTransportation },
        { label: this.tabSetLabels[6], icon: DtIconLightbulb },
        { label: this.tabSetLabels[7], icon: DtIconHeart },
        { label: this.tabSetLabels[8], icon: DtIconFlag },
        { label: this.tabSetLabels[9], icon: DtIconDialpadStar },
      ],
    };
  },

  computed: {
    tabs () {
      // if showRecentlyUsedTab is false remove first index of TABS_DATA
      const tabsData = this.showRecentlyUsedTab ? this.TABS_DATA : this.TABS_DATA.slice(1);
      // if showCustomEmojisTab is false remove last index of TABS_DATA
      if (!this.showCustomEmojisTab) {
        tabsData.pop();
      }

      return tabsData.map((tab, index) => ({
        ...tab,
        // IDs on dt-tab component need to be on string
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
      if (!this.isSearching) {
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
      // IDs on scrollToTab need to be on number
      const parseId = parseInt(id);
      // IDs on dt-tab component need to be on string
      this.selectedTab = id;
      this.$emit('selected-tabset', parseId);
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
