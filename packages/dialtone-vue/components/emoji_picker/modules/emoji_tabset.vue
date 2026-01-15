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
          :ref="el => { if (el) setTabsetRef(el) }"
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

<script setup>
import { computed, ref, watch } from 'vue';
import { DtTab, DtTabGroup } from '@/components/tab';
import { returnFirstEl } from '@/common/utils';
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
} from '@dialpad/dialtone-icons/vue3';

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

  /**
   * Whether to show the custom emojis tab or not
   * @type {Boolean}
   * @default false
   */
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
});

const emits = defineEmits([
  /**
   * Emitted when a tab is selected
   * @event selected-tabset
   * @param {String} tabId - The name of the tab that was selected
   */
  'selected-tabset',

  'focus-search-input',
  'focus-skin-selector',
]);

const TABS_DATA = [
  { label: props.tabSetLabels[0], icon: DtIconClock },
  { label: props.tabSetLabels[1], icon: DtIconSatisfied },
  { label: props.tabSetLabels[2], icon: DtIconLivingThing },
  { label: props.tabSetLabels[3], icon: DtIconFood },
  { label: props.tabSetLabels[4], icon: DtIconObject },
  { label: props.tabSetLabels[5], icon: DtIconTransportation },
  { label: props.tabSetLabels[6], icon: DtIconLightbulb },
  { label: props.tabSetLabels[7], icon: DtIconHeart },
  { label: props.tabSetLabels[8], icon: DtIconFlag },
  { label: props.tabSetLabels[9], icon: DtIconDialpadStar },
];

const tabs = computed(() => {
  const tabsData = props.showRecentlyUsedTab ? TABS_DATA : TABS_DATA.slice(1);
  // if showCustomEmojisTab is false remove last index of TABS_DATA
  if (!props.showCustomEmojisTab) {
    tabsData.pop();
  }

  return tabsData.map((tab, index) => ({
    ...tab,
    // IDs on dt-tab component need to be on string
    id: (index + 1).toString(),
    panelId: (index + 1).toString(),
  }));
});

const isSearching = computed(() => props.emojiFilter.length > 0);

const selectedTab = ref('1');

const tabsetRef = ref([]);

watch(() => props.scrollIntoTab,
  () => {
    if (!isSearching.value) {
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
  // IDs on scrollToTab need to be on number
  const parseId = parseInt(id);
  // IDs on dt-tab component need to be on string
  selectedTab.value = id;
  emits('selected-tabset', parseId);
}

function setTabsetRef (ref) {
  // We push the $el, because $el is the button inside the dt-tab component
  // and we need the button to focus it
  tabsetRef.value.push(returnFirstEl(ref.$el));
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
    if (event.shiftKey) {
      emits('focus-skin-selector');
    } else {
      emits('focus-search-input');
    }
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
