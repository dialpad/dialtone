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
          :ref="el => { if (el) setTabsetRef(el) }"
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

<script setup>
import DtTabGroup from '@/components/tabs/tab_group.vue';
import DtTab from '@/components/tabs/tab.vue';
import DtIcon from '@/components/icon/icon.vue';
import { computed, ref, toRefs, watch } from 'vue';
import { EMOJI_CATEGORIES } from '@/components/emoji_picker/emoji_picker_constants';

const props = defineProps({
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
  tabsetLabels: {
    type: Array,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when a tab is selected
   * @event selected-tabset
   * @param {String} tabId - The name of the tab that was selected
   */
  'selected-tabset',

  'focus-search-input',
]);

const TABS_DATA = [
  { label: EMOJI_CATEGORIES.MOST_RECENTLY_USED, icon: 'clock' },
  { label: EMOJI_CATEGORIES.SMILEYS_AND_PEOPLE, icon: 'satisfied' },
  { label: EMOJI_CATEGORIES.NATURE, icon: 'living-thing' },
  { label: EMOJI_CATEGORIES.FOOD, icon: 'food' },
  { label: EMOJI_CATEGORIES.ACTIVITY, icon: 'object' },
  { label: EMOJI_CATEGORIES.TRAVEL, icon: 'transportation' },
  { label: EMOJI_CATEGORIES.OBJECTS, icon: 'lightbulb' },
  { label: EMOJI_CATEGORIES.SYMBOLS, icon: 'heart' },
  { label: EMOJI_CATEGORIES.FLAGS, icon: 'flag' },
];

const tabs = computed(() => {
  const tabsData = props.showRecentlyUsedTab ? TABS_DATA : TABS_DATA.slice(1);

  return tabsData.map((tab, index) => ({
    ...tab,
    label: props.tabsetLabels[index],
    id: (index + 1).toString(),
    panelId: (index + 1).toString(),
  }));
});

const isSearching = computed(() => props.emojiFilter.length > 0);

const selectedTab = ref('1');

const { isScrolling } = toRefs(props);

const tabsetRef = ref([]);

watch(() => props.scrollIntoTab,
  () => {
    if (!isScrolling.value && !isSearching.value) {
      selectedTab.value = (props.scrollIntoTab + 1).toString();
    }
  });

watch(isSearching,
  () => {
    if (isSearching.value) {
      selectedTab.value = null;
    }
  });

/**
 * We are using .capture.stop modifiers on the click event
 * because we don't want to trigger the click event of the
 * dt-tab component
 */
function selectTabset (id) {
  if (!isScrolling.value) {
    selectedTab.value = id;
  }
  emits('selected-tabset', id);
}

function setTabsetRef (ref) {
  // We push the $el, because $el is the button inside the dt-tab component
  // and we need the button to focus it
  tabsetRef.value.push(ref.$el);
}

function focusTabset () {
  tabsetRef.value[0].focus();
}

function handleKeyDown (event, tabId) {
  if (event.key === 'Enter') {
    selectTabset(tabId);
    // We blur because seems like the tab component override the selected prop, and it removes the selected style
    tabsetRef.value[tabId - 1].blur();
  }

  if (event.key === 'Tab') {
    event.preventDefault();
    emits('focus-search-input');
  }

  if (event.key === 'ArrowDown') {
    // Jump to search input
    emits('focus-search-input');
  }
}

defineExpose({
  focusTabset,
});
</script>
