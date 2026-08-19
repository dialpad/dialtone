<template>
  <dt-stack
    class="dialtone-sidebar__list d-h100p"
    gap="50"
    @keydown="handleKeydown"
  >
    <DtBox
      padding-block-end="100"
      padding-block-start="200"
    >
      <DtStack gap="150">
        <DtBox border-width="100" padding="100" border-radius="400">
          <DtText as="p" variant="body-sm" align="center" tone="muted">
            Logo
          </DtText>
        </DtBox>
        <dt-input
          ref="searchInput"
          v-model="inputValue"
          aria-label="Search"
          placeholder="Search"
          type="search"
          end-icon-class="d-pie-25"
          @update:model-value="focusedIndex = -1"
        >
          <template #startIcon="{ iconSize }">
            <dt-icon name="search" :size="iconSize" />
          </template>
          <template #endIcon="{ clear }">
            <dt-button
              v-if="inputValue.length !== 0"
              v-dt-tooltip="'Clear search'"
              kind="muted"
              importance="clear"
              :size="100"
              aria-label="Clear search"
              @click="clear"
            >
              <template #startIcon="{ iconSize }">
                <dt-icon name="close" :size="iconSize" />
              </template>
            </dt-button>
            <dt-keyboard-shortcut
              v-else-if="viewport.above('lg')"
              class="d-mie-n75"
              shortcut="/"
              screen-reader-text="Slash"
            />
          </template>
        </dt-input>
      </DtStack>
    </DtBox>
    <DtBox class="d-fl1" scrollbar="move">
      <DtStack
        ref="listRef"
        as="ul"
        gap="50"
      >
        <sidebar-item
          v-for="item in filteredItems"
          :key="item.link || item.text"
          :item="item"
          :depth="0"
          :open-items="openItems"
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
      </DtStack>
    </DtBox>
    <DtBox border-width="100" padding="100" border-radius="400">
      <DtText as="p" variant="body-sm" align="center" tone="muted">
        meta
      </DtText>
    </DtBox>
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useSidebarItems } from '../composables/useSidebarItems';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import {
  canReceiveCharacterInput,
  isSidebarSearchShortcut,
} from '../utils/sidebarShortcuts';

const route = useRoute();
const router = useRouter();
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);
const viewport = useViewportBreakpoints();

// Track which items are open (by their link or text as key)
const openItems = ref(new Set());

// Track search input value
const inputValue = ref('');

// Track which item is focused via keyboard navigation (-1 means no focus)
const focusedIndex = ref(-1);

// Ref to the search input element
const searchInput = ref(null);

// Ref to the list element wrapping the sidebar items — scopes DOM lookups to
// this instance's subtree.
const listRef = ref(null);

const focusSearchInput = () => searchInput.value?.focus();

const handleSearchShortcut = (event) => {
  if (!isSidebarSearchShortcut(event)) return;

  const target = event.target instanceof Element ? event.target : document.activeElement;

  if (canReceiveCharacterInput(target)) return;

  event.preventDefault();
  nextTick(focusSearchInput);
};

// Strip separators and case for fuzzy matching.
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

// Recursive filter function for sidebar items
const filterItems = (items, searchTerm) => {
  if (!searchTerm) return items;

  const term = searchTerm.trim();
  if (!term) return items;

  const normalizedTerm = normalize(term);
  if (!normalizedTerm) return [];

  const filtered = [];

  items.forEach(item => {
    // Check if current item matches (text or keywords)
    const itemMatches = normalize(item.text).includes(normalizedTerm) ||
      (item.keywords?.some(keyword =>
        normalize(keyword).includes(normalizedTerm),
      ) ?? false);

    // Recursively filter children if they exist
    const filteredChildren = item.children
      ? filterItems(item.children, searchTerm)
      : [];

    // Include item if:
    // 1. Item text matches, OR
    // 2. Any children match (filteredChildren.length > 0)
    if (itemMatches || filteredChildren.length > 0) {
      filtered.push({
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : item.children,
      });
    }
  });

  return filtered;
};

// Computed property for filtered sidebar items
const filteredItems = computed(() => {
  if (!inputValue.value || !inputValue.value.trim()) {
    return sidebarItems.value;
  }
  return filterItems(sidebarItems.value, inputValue.value);
});

// Flatten filtered items into a sequential list for keyboard navigation
const flattenedFilteredItems = computed(() => {
  const flattened = [];

  const traverse = (items) => {
    items.forEach(item => {
      // Add items that have links (navigable items)
      if (item.link) {
        flattened.push(item);
      }
      // Recursively traverse children if they exist
      if (item.children && item.children.length > 0) {
        traverse(item.children);
      }
    });
  };

  traverse(filteredItems.value);
  return flattened;
});

// Compute which items should be open during search
const computeOpenItemsForSearch = (items) => {
  const open = new Set();

  const traverse = (itemsList) => {
    itemsList.forEach(item => {
      // If item has children, it should be opened to show them
      if (item.children && item.children.length > 0) {
        open.add(item.link || item.text);
        // Recursively process children
        traverse(item.children);
      }
    });
  };

  traverse(items);
  return open;
};

// Check if current route is within an item's tree
const isRouteInTree = (item, routePath) => {
  if (!item.children) return false;
  if (routePath === item.link) return true;

  const checkChildren = (children) => {
    return children.some(child => {
      if (routePath === child.link) return true;

      // Special case: Treat blog posts as children of What's New
      if (child.link === '/dialtone/whats-new/' && routePath.startsWith('/dialtone/whats-new/posts/')) {
        return true;
      }

      if (child.children) return checkChildren(child.children);
      return false;
    });
  };

  return checkChildren(item.children);
};

// Find all items that should be open based on route
const computeOpenItems = (items, routePath) => {
  const open = new Set();

  const traverse = (itemsList) => {
    itemsList.forEach(item => {
      if (item.children) {
        if (isRouteInTree(item, routePath)) {
          open.add(item.link || item.text);
        }
        traverse(item.children);
      }
    });
  };

  traverse(items);
  return open;
};

// Keyboard navigation for search results — bound to the sidebar root, so it
// only fires while focus is within the sidebar (input or item buttons)
const handleKeydown = (event) => {
  // Only handle keyboard navigation when search is active with results
  if (!inputValue.value.trim() || flattenedFilteredItems.value.length === 0) {
    return;
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      if (focusedIndex.value < flattenedFilteredItems.value.length - 1) {
        focusedIndex.value++;
      } else {
        focusedIndex.value = 0;
      }
      break;

    case 'ArrowUp':
      event.preventDefault();
      if (focusedIndex.value > 0) {
        focusedIndex.value--;
      } else {
        focusedIndex.value = -1;
        nextTick(focusSearchInput);
      }
      break;

    case 'Enter':
      event.preventDefault();
      if (focusedIndex.value >= 0 && focusedIndex.value < flattenedFilteredItems.value.length) {
        const focusedItem = flattenedFilteredItems.value[focusedIndex.value];
        if (focusedItem.link) {
          router.push(focusedItem.link);
        }
      }
      break;

    case 'Escape':
      event.preventDefault();
      inputValue.value = '';
      focusedIndex.value = -1;
      // Return focus to search input
      nextTick(focusSearchInput);
      break;
  }
};

// Initialize open items after mount
onMounted(() => {
  openItems.value = computeOpenItems(sidebarItems.value, route.path);
  document.addEventListener('keydown', handleSearchShortcut);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleSearchShortcut);
});

// Update open items when route changes
watch(() => route.path, (newPath) => {
  // Clear search and keyboard focus when navigating to a different page
  inputValue.value = '';
  focusedIndex.value = -1;
  openItems.value = computeOpenItems(sidebarItems.value, newPath);
});

// Watch search input to control expansion state
watch(inputValue, (newValue) => {
  if (newValue && newValue.trim()) {
    // Search is active - expand all parents containing matches
    openItems.value = computeOpenItemsForSearch(filteredItems.value);
  } else {
    // Search cleared - revert to route-based expansion
    openItems.value = computeOpenItems(sidebarItems.value, route.path);
  }
});

// Reset keyboard focus when filtered results change
watch(filteredItems, () => {
  focusedIndex.value = -1;
});

// Focus and scroll item when keyboard focus changes
watch(focusedIndex, async (newIndex) => {
  if (newIndex >= 0 && newIndex < flattenedFilteredItems.value.length) {
    // Wait for DOM to update
    await nextTick();

    const targetItem = flattenedFilteredItems.value[newIndex];
    const button = listRef.value?.$el?.querySelector(`[data-sidebar-link="${targetItem.link}"]`);

    if (button) {
      button.focus();
      button.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    }
  }
});

// Handle toggle from child components
const handleToggle = (itemKey, shouldOpen) => {
  const newSet = new Set(openItems.value);
  if (shouldOpen) {
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
