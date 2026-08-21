<template>
  <dt-stack
    class="dialtone-sidebar__list d-h100p"
    @keydown="handleKeydown"
  >
    <sidebar-header
      ref="searchInput"
      v-model="inputValue"
      :results-id="SIDEBAR_SEARCH_RESULTS_ID"
      :active-result-id="activeResultId"
    />
    <dt-box class="d-fl1" scrollbar="move">
      <dt-stack
        :id="SIDEBAR_SEARCH_RESULTS_ID"
        gap="150"
      >
        <sidebar-group
          v-for="group in visibleGroups"
          :key="group.key"
          :items="group.items"
          :presentation="group.presentation"
          :path-prefix="group.key"
          :open-items="openItems"
          :active-item-path="activeItemPath"
          :search-active="isSearchActive"
          @toggle="handleToggle"
        />
        <dt-empty-state
          v-if="visibleGroups.length === 0 && inputValue.trim()"
          :size="200"
          :header-text="`No results found for &quot;${inputValue}&quot;`"
          class="d-w100p"
        >
          <template #icon>
            <dt-icon name="search" size="500" />
          </template>
        </dt-empty-state>
      </dt-stack>
    </dt-box>
    <sidebar-footer />
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SidebarGroup from './SidebarGroup.vue';
import SidebarFooter from './SidebarFooter.vue';
import SidebarHeader from './SidebarHeader.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useSidebarItems } from '../composables/useSidebarItems';
import {
  canReceiveCharacterInput,
  isSidebarSearchShortcut,
} from '../utils/sidebarShortcuts';
import {
  collectOpenItemKeys,
  collectOpenItemKeysForRoute,
  filterNavItems,
  flattenNavigableItems,
  wrapHighlightIndex,
} from '../utils/sidebarSearch.js';
import { isExternalUrl } from '../utils/isExternalUrl';

const route = useRoute();
const router = useRouter();
const SIDEBAR_SEARCH_RESULTS_ID = 'dialtone-sidebar-search-results';
const SIDEBAR_SEARCH_RESULT_ID_PREFIX = 'dialtone-sidebar-search-result-';
const items = useThemeLocaleData().value.sidebar;
const sidebarGroups = useSidebarItems(items);

// Track which items are open (by their link or text as key)
const openItems = ref(new Set());

// Track search input value
const inputValue = ref('');

// Track which search result is highlighted while focus remains in the input.
const highlightIndex = ref(-1);

// Ref to the search input element
const searchInput = ref(null);

const focusSearchInput = () => searchInput.value?.focus();
const isModifiedKeypress = (event) => {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
};
const handleSearchShortcut = (event) => {
  if (!isSidebarSearchShortcut(event)) return;

  const target = event.target instanceof Element ? event.target : document.activeElement;

  if (canReceiveCharacterInput(target)) return;

  event.preventDefault();
  nextTick(focusSearchInput);
};

const filteredGroups = computed(() => sidebarGroups.value.map(group => ({
  ...group,
  items: inputValue.value.trim()
    ? filterNavItems(group.items, inputValue.value)
    : group.items,
})));
const visibleGroups = computed(() => filteredGroups.value.filter(group => group.items.length));
const displayItems = computed(() => sidebarGroups.value.flatMap(group => group.items));
const filteredDisplayItems = computed(() => filteredGroups.value.flatMap(group => group.items));
const isSearchActive = computed(() => Boolean(inputValue.value.trim()));

// Leaf links in the order arrow keys walk them.
const flattenedFilteredItems = computed(() => filteredGroups.value.flatMap(group => (
  flattenNavigableItems(group.items, group.key)
)));
const activeItem = computed(() => flattenedFilteredItems.value[highlightIndex.value]);
const activeItemPath = computed(() => {
  return activeItem.value?.itemPath;
});
const activeResultId = computed(() => {
  return activeItemPath.value
    ? `${SIDEBAR_SEARCH_RESULT_ID_PREFIX}${activeItemPath.value}`
    : undefined;
});

const activateHighlightedItem = (event) => {
  const link = activeItem.value?.item.link;
  if (isModifiedKeypress(event) || !link) return;

  event.preventDefault();
  if (isExternalUrl(link)) {
    window.open(link, '_blank', 'noopener,noreferrer');
    return;
  }

  router.push(link);
};

// Combobox-style result navigation keeps DOM focus in the search input.
const handleKeydown = (event) => {
  if (!isSearchActive.value) {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    inputValue.value = '';
    highlightIndex.value = -1;
    nextTick(focusSearchInput);
    return;
  }

  if (flattenedFilteredItems.value.length === 0) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      highlightIndex.value = wrapHighlightIndex(highlightIndex.value, 1, flattenedFilteredItems.value.length);
      break;

    case 'ArrowUp':
      event.preventDefault();
      highlightIndex.value = wrapHighlightIndex(highlightIndex.value, -1, flattenedFilteredItems.value.length);
      break;

    case 'Enter':
      activateHighlightedItem(event);
      break;
  }
};

// Initialize open items after mount
onMounted(() => {
  openItems.value = collectOpenItemKeysForRoute(displayItems.value, route.path);
  document.addEventListener('keydown', handleSearchShortcut);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleSearchShortcut);
});

// Update open items when route changes
watch(() => route.path, (newPath) => {
  // Clear search and keyboard highlight when navigating to a different page
  inputValue.value = '';
  highlightIndex.value = -1;
  openItems.value = collectOpenItemKeysForRoute(displayItems.value, newPath);
});

// Watch search input to control expansion state
watch(inputValue, (newValue) => {
  if (newValue && newValue.trim()) {
    // Search is active - expand all parents containing matches
    openItems.value = collectOpenItemKeys(filteredDisplayItems.value);
  } else {
    // Search cleared - revert to route-based expansion
    openItems.value = collectOpenItemKeysForRoute(displayItems.value, route.path);
  }
});

// Reset keyboard highlight whenever the result set changes — this is the only
// place that does it, including on every keystroke (filterNavItems returns a new array).
watch(filteredGroups, () => {
  highlightIndex.value = -1;
});

// Handle toggle from child components
const handleToggle = (itemKey, shouldOpen, peerKeys = []) => {
  const newSet = new Set(openItems.value);
  if (shouldOpen) {
    peerKeys.forEach(peerKey => newSet.delete(peerKey));
    newSet.add(itemKey);
  } else {
    newSet.delete(itemKey);
  }
  openItems.value = newSet;
};
</script>

<style>
.dialtone-sidebar__list .dialtone-shell-btn:focus-visible {
  box-shadow: none;
  --button-color-background: var(--dt-shell-action-color-background-secondary-hover);
}
</style>
