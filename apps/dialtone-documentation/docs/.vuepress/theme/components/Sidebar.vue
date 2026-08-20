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
        ref="listRef"
        as="ul"
        gap="50"
      >
        <sidebar-item
          v-for="(item, index) in filteredItems"
          :key="item.link || item.text"
          :item="item"
          :depth="0"
          :open-items="openItems"
          :item-path="String(index)"
          :peer-keys="filteredItemKeys"
          :active-item-path="activeItemPath"
          :search-active="isSearchActive"
          @toggle="handleToggle"
        />
        <li v-if="filteredItems.length === 0 && inputValue.trim()">
          <dt-empty-state
            :size="200"
            :header-text="`No results found for &quot;${inputValue}&quot;`"
            class="d-w100p"
          >
            <template #icon>
              <dt-icon name="search" size="500" />
            </template>
          </dt-empty-state>
        </li>
      </dt-stack>
    </dt-box>
    <sidebar-footer />
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
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
  flattenNavigableItemPaths,
  wrapHighlightIndex,
} from '../utils/sidebarSearch.js';

const route = useRoute();
const SIDEBAR_SEARCH_RESULTS_ID = 'dialtone-sidebar-search-results';
const SIDEBAR_SEARCH_RESULT_ID_PREFIX = 'dialtone-sidebar-search-result-';
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);

// Track which items are open (by their link or text as key)
const openItems = ref(new Set());

// Track search input value
const inputValue = ref('');

// Track which search result is highlighted while focus remains in the input.
const highlightIndex = ref(-1);

// Ref to the search input element
const searchInput = ref(null);

// Ref to the list element wrapping the sidebar items — scopes DOM lookups to
// this instance's subtree.
const listRef = ref(null);

const focusSearchInput = () => searchInput.value?.focus();
const isModifiedKeypress = (event) => {
  return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
};
const getSidebarButton = (itemPath) => listRef.value?.$el?.querySelector(
  `[data-sidebar-path="${itemPath}"]`,
);

const handleSearchShortcut = (event) => {
  if (!isSidebarSearchShortcut(event)) return;

  const target = event.target instanceof Element ? event.target : document.activeElement;

  if (canReceiveCharacterInput(target)) return;

  event.preventDefault();
  nextTick(focusSearchInput);
};

// Computed property for filtered sidebar items
const filteredItems = computed(() => {
  if (!inputValue.value || !inputValue.value.trim()) {
    return sidebarItems.value;
  }
  return filterNavItems(sidebarItems.value, inputValue.value);
});
const isSearchActive = computed(() => Boolean(inputValue.value.trim()));
const filteredItemKeys = computed(() => {
  return filteredItems.value
    .filter(item => item.children?.length)
    .map(item => item.link || item.text);
});

// Item paths of the leaf links, in the order arrow keys walk them.
const flattenedFilteredItems = computed(() => flattenNavigableItemPaths(filteredItems.value));
const activeItemPath = computed(() => {
  return flattenedFilteredItems.value[highlightIndex.value];
});
const activeResultId = computed(() => {
  return activeItemPath.value
    ? `${SIDEBAR_SEARCH_RESULT_ID_PREFIX}${activeItemPath.value}`
    : undefined;
});

// Clicking the highlighted row's button routes through its own handler, so Enter and
// mouse activation stay in sync.
const activateHighlightedItem = (event) => {
  if (isModifiedKeypress(event) || highlightIndex.value < 0) return;

  event.preventDefault();
  getSidebarButton(flattenedFilteredItems.value[highlightIndex.value])?.click();
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
  openItems.value = collectOpenItemKeysForRoute(sidebarItems.value, route.path);
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
  openItems.value = collectOpenItemKeysForRoute(sidebarItems.value, newPath);
});

// Watch search input to control expansion state
watch(inputValue, (newValue) => {
  if (newValue && newValue.trim()) {
    // Search is active - expand all parents containing matches
    openItems.value = collectOpenItemKeys(filteredItems.value);
  } else {
    // Search cleared - revert to route-based expansion
    openItems.value = collectOpenItemKeysForRoute(sidebarItems.value, route.path);
  }
});

// Reset keyboard highlight whenever the result set changes — this is the only
// place that does it, including on every keystroke (filterNavItems returns a new array).
watch(filteredItems, () => {
  highlightIndex.value = -1;
});

// Scroll the highlighted item into view without moving focus from the input.
watch(highlightIndex, async (newIndex) => {
  if (newIndex >= 0 && newIndex < flattenedFilteredItems.value.length) {
    // Wait for DOM to update
    await nextTick();

    const targetItemPath = flattenedFilteredItems.value[newIndex];
    const button = getSidebarButton(targetItemPath);

    if (button) {
      button.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }
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
