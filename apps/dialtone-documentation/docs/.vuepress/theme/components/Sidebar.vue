<template>
  <h2 class="d-vi-visible-sr">
    Local navigation
  </h2>
  <dt-stack
    v-if="sidebarItems.length"
    as="ul"
    class="dialtone-sidebar__list"
    gap="300"
  >
    <div class="d-pb8">
      <dt-input
        ref="searchInput"
        v-model="inputValue"
        aria-label="Search"
        placeholder="Search"
        type="search"
        @input="focusedIndex = -1"
      >
        <template #leftIcon="{ iconSize }">
          <dt-icon name="search" :size="iconSize" />
        </template>
        <template v-if="inputValue.length !== 0" #rightIcon="{ clear }">
          <dt-button
            v-dt-tooltip="'Clear search'"
            kind="muted"
            importance="clear"
            size="xs"
            aria-label="Clear search"
            @click="clear"
          >
            <template #icon="{ iconSize }">
              <dt-icon name="close" :size="iconSize" />
            </template>
          </dt-button>
        </template>
      </dt-input>
    </div>
    <sidebar-item
      v-for="item in filteredItems"
      :key="item.link || item.text"
      :item="item"
      :is-single-page="item.isSinglePage"
      :depth="0"
      :open-items="openItems"
      @toggle="handleToggle"
    />
    <li v-if="filteredItems.length === 0 && inputValue.trim()">
      <dt-empty-state
        size="sm"
        :header-text="`No results found for &quot;${inputValue}&quot;`"
        class="d-w100p"
      >
        <template #icon>
          <dt-icon name="search" size="500" />
        </template>
      </dt-empty-state>
    </li>
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useSidebarItems } from '../composables/useSidebarItems';

const route = useRoute();
const router = useRouter();
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);

// Track which items are open (by their link or text as key)
const openItems = ref(new Set());

// Track search input value
const inputValue = ref('');

// Track which item is focused via keyboard navigation (-1 means no focus)
const focusedIndex = ref(-1);

// Ref to the search input element
const searchInput = ref(null);

// Recursive filter function for sidebar items
const filterItems = (items, searchTerm) => {
  if (!searchTerm) return items;

  const term = searchTerm.toLowerCase().trim();
  if (!term) return items;

  const filtered = [];

  items.forEach(item => {
    // Check if current item matches (text or keywords)
    const itemMatches = item.text.toLowerCase().includes(term) ||
      (item.keywords?.some(keyword =>
        keyword.toLowerCase().includes(term)
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

// No longer need focusedItemLink computed - using native focus instead

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

// Global keyboard event handler for sidebar navigation
const handleKeydown = (event) => {
  // Only handle keyboard navigation when search is active with results
  if (!inputValue.value.trim() || flattenedFilteredItems.value.length === 0) {
    return;
  }

  console.log(`Key pressed: ${event.key}, current focusedIndex: ${focusedIndex.value}, total items: ${flattenedFilteredItems.value.length}`);

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      console.log('ArrowDown - before increment:', focusedIndex.value);
      // Move focus down, wrap to beginning if at end
      if (focusedIndex.value < flattenedFilteredItems.value.length - 1) {
        focusedIndex.value++;
        console.log('Incremented to:', focusedIndex.value);
      } else {
        focusedIndex.value = 0;
        console.log('Wrapped to 0');
      }
      break;

    case 'ArrowUp':
      event.preventDefault();
      console.log('ArrowUp - before decrement:', focusedIndex.value);
      // Move focus up, wrap to end if at beginning
      if (focusedIndex.value > 0) {
        focusedIndex.value--;
        console.log('Decremented to:', focusedIndex.value);
      } else {
        focusedIndex.value = flattenedFilteredItems.value.length - 1;
        console.log('Wrapped to end:', focusedIndex.value);
      }
      break;

    case 'Enter':
      event.preventDefault();
      console.log('Enter pressed, navigating to index:', focusedIndex.value);
      // Navigate to focused item
      if (focusedIndex.value >= 0 && focusedIndex.value < flattenedFilteredItems.value.length) {
        const focusedItem = flattenedFilteredItems.value[focusedIndex.value];
        if (focusedItem.link) {
          console.log('Navigating to:', focusedItem.link);
          router.push(focusedItem.link);
        }
      }
      break;

    case 'Escape':
      event.preventDefault();
      console.log('Escape pressed, clearing search and returning focus to input');
      // Clear search and focus, return to input
      inputValue.value = '';
      focusedIndex.value = -1;
      // Return focus to search input
      nextTick(() => {
        if (searchInput.value?.$el) {
          const inputElement = searchInput.value.$el.querySelector('input');
          if (inputElement) {
            inputElement.focus();
          }
        }
      });
      break;
  }
};

// Initialize open items and set up keyboard handling after mount
onMounted(() => {
  openItems.value = computeOpenItems(sidebarItems.value, route.path);
  // Add global keyboard listener
  document.addEventListener('keydown', handleKeydown);
});

// Clean up keyboard listener on unmount
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
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

    // Get the item we want to focus
    const targetItem = flattenedFilteredItems.value[newIndex];
    console.log(`Trying to focus item at index ${newIndex}: ${targetItem.text} (link: ${targetItem.link})`);

    // Query for the button with matching data-sidebar-link attribute
    const button = document.querySelector(`.dialtone-sidebar__list [data-sidebar-link="${targetItem.link}"]`);

    if (button) {
      console.log(`Found button, calling focus()`);
      button.focus();
      button.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    } else {
      console.log(`Button not found in DOM for link: ${targetItem.link}`);
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
  box-shadow: var(--dt-shadow-focus-inset);
}
</style>
