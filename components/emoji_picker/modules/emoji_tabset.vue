<template>
  <div class="d-emoji-picker__tabset">
    <dt-tab-group
      tab-list-class="d-emoji-picker__tabset-list"
      :selected="selectedTab"
    >
      <template #tabs>
        <dt-tab
          v-for="tab in tabs"
          :id="tab.id"
          :key="tab.id"
          :panel-id="tab.panelId"
          :label="tab.label"
          aria-controls="d-emoji-picker-list"
          @click.capture.stop="selectTabset(tab.id)"
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
]);

const TABS_DATA = [
  { label: 'Recently used', icon: 'clock' },
  { label: 'Smiley’s and people', icon: 'satisfied' },
  { label: 'Nature', icon: 'living-thing' },
  { label: 'Food', icon: 'food' },
  { label: 'Activity', icon: 'object' },
  { label: 'Travel', icon: 'transportation' },
  { label: 'Objects', icon: 'lightbulb' },
  { label: 'Symbols', icon: 'heart' },
  { label: 'Flags', icon: 'flag' },
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
</script>

<style lang="less">
.d-emoji-picker{
  &__tabset-list{
      gap: 4px;

      &::after{
        background-color: var(--black-200) !important;
      }

      button{
        padding: var(--space-400);

        &.d-tab--selected{
          &::after{
            height: var(--size-200);
          }
        }
    }
  }
}
</style>
