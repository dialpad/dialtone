<template>
  <dt-stack
    class="dialtone-sidebar__list d-h100p"
    @keydown="handleKeydown"
  >
    <DtBox
      padding-block-start="450"
      padding-block-end="100"
    >
      <DtStack gap="100">
        <DtStack
          v-if="viewport.pick({
            default: false,
            lg: true,
          })"
          direction="row"
          justify="space-between"
          gap="200"
          class="d-pis-150 d-pie-100"
        >
          <DtBox padding-block-start="50">
            <dt-link
              title="Dialtone homepage"
              :underline="false"
              to="/"
            >
              <DtIllustration name="dialpad-logo" class="d-h-50 d-w-auto" />
            </dt-link>
          </DtBox>
          <dt-button
            v-dt-tooltip:bottom="'Toggle Navigation'"
            kind="muted"
            importance="clear"
            aria-label="Toggle Navigation"
          >
            <template #startIcon="{ iconSize }">
              <dt-icon name="sidebar-close" :size="iconSize" />
            </template>
          </dt-button>
        </DtStack>
        <dt-input
          ref="searchInput"
          v-model="inputValue"
          aria-label="Search"
          aria-autocomplete="list"
          :aria-controls="SIDEBAR_SEARCH_RESULTS_ID"
          :aria-activedescendant="activeResultId"
          placeholder="Search"
          type="search"
          end-icon-class="d-pie-25"
          @update:model-value="highlightIndex = -1"
        >
          <template #startIcon="{ iconSize }">
            <DtBox class="d-d-flex" padding-inline-start="50">
              <dt-icon name="search" :size="iconSize" />
            </DtBox>
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
              class="d-mie-n75 d-px-100 d-bgc-moderate d-baw0"
              shortcut="∕"
              screen-reader-text="Type / (slash) to focus search field"
            />
          </template>
        </dt-input>
      </DtStack>
    </DtBox>
    <DtBox class="d-fl1" scrollbar="move">
      <DtStack
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
      </DtStack>
    </DtBox>
    <DtBox
      v-if="viewport.above('lg')"
    >
      <DtStack gap="125">
        <DtBox padding-inline-start="100" padding-inline-end="50" padding-block-start="100">
          <DtStack direction="row" gap="100" justify="space-between">
            <DtBox
              v-dt-mode:light
              surface="secondary"
              border-radius="450"
              border-width="100"
              border-color="subtle"
              padding-block="1"
              class="d-d-flex d-of-hidden"
            >
              <svg-loader name="dialtone-logo" class="d-w-125" />
            </DtBox>
            <DtStack gap="25" direction="row">
              <dt-button
                v-dt-tooltip="'Storybook'"
                href="https://dialtone.dialpad.com/vue"
                target="_blank"
                rel="noreferrer noopener"
                kind="muted"
                importance="clear"
                aria-label="Open Storybook"
              >
                <template #startIcon="{ iconSize }">
                  <dt-icon name="storybook" :size="iconSize" />
                </template>
              </dt-button>
              <dt-button
                v-dt-tooltip="'Github Repository'"
                href="https://github.com/dialpad/dialtone"
                target="_blank"
                rel="noreferrer noopener"
                kind="muted"
                importance="clear"
                aria-label="Open GitHub repository"
              >
                <template #startIcon="{ iconSize }">
                  <dt-icon name="github" :size="iconSize" />
                </template>
              </dt-button>
            </DtStack>
          </DtStack>
        </DtBox>
        <dt-segmented-control
          :model-value="currentMode"
          aria-label="Appearance mode"
          @update:model-value="setMode"
        >
          <dt-segmented-control-item v-dt-tooltip="`Mode: System`" value="system" label="System">
            <template #startIcon="{ iconSize }">
              <dt-icon name="laptop-2" :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item v-dt-tooltip="`Mode: Light`" value="light" label="Light">
            <template #startIcon="{ iconSize }">
              <dt-icon name="sun" :size="iconSize" />
            </template>
          </dt-segmented-control-item>
          <dt-segmented-control-item v-dt-tooltip="`Mode: Dark`" value="dark" label="Dark">
            <template #startIcon="{ iconSize }">
              <dt-icon name="moon" :size="iconSize" />
            </template>
          </dt-segmented-control-item>
        </dt-segmented-control>
        <DtStack direction="row" gap="1">
          <dt-button
            class="d-w100p"
            href="https://dialpad.com/app/messages/agxzfnViZXItdm9pY2VyGAsSC1RleHRNZXNzYWdlGIDA3KvmyP0IDA"
            target="_blank"
            rel="noreferrer noopener"
            kind="muted"
            importance="clear"
            size="200"
          >
            dialtone
            <template #startIcon="{ iconSize }">
              <dt-icon name="hash-bold" :size="iconSize" />
            </template>
          </dt-button>
          <dt-button
            class="d-w100p"
            href="https://dialpad.atlassian.net/servicedesk/customer/portal/123/create/465"
            target="_blank"
            rel="noreferrer noopener"
            kind="muted"
            importance="clear"
            size="200"
          >
            Request
            <template #startIcon="{ iconSize }">
              <dt-icon name="hand-filled" :size="iconSize" />
            </template>
          </dt-button>
          <dt-button
            class="d-w100p"
            href="https://dialpad.atlassian.net/secure/CreateIssue.jspa?issuetype=1&pid=12508"
            target="_blank"
            rel="noreferrer noopener"
            kind="muted"
            importance="clear"
            size="200"
          >
            Bug
            <template #startIcon>
              <svg
                class="d-icon--size-200 d-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 20v-9" />
                <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
                <path d="M14.12 3.88 16 2" />
                <path d="M21 21a4 4 0 0 0-3.81-4" />
                <path d="M21 5a4 4 0 0 1-3.55 3.97" />
                <path d="M22 13h-4" />
                <path d="M3 21a4 4 0 0 1 3.81-4" />
                <path d="M3 5a4 4 0 0 0 3.55 3.97" />
                <path d="M6 13H2" />
                <path d="m8 2 1.88 1.88" />
                <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
              </svg>
            </template>
          </dt-button>
        </DtStack>
      </DtStack>
    </DtBox>
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import SidebarItem from './SidebarItem.vue';
import { useThemeLocaleData } from '@vuepress/plugin-theme-data/client';
import { useSidebarItems } from '../composables/useSidebarItems';
import { useThemeManager } from '../composables/useThemeManager';
import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
import {
  canReceiveCharacterInput,
  isSidebarSearchShortcut,
} from '../utils/sidebarShortcuts';

const route = useRoute();
const SIDEBAR_SEARCH_RESULTS_ID = 'dialtone-sidebar-search-results';
const SIDEBAR_SEARCH_RESULT_ID_PREFIX = 'dialtone-sidebar-search-result-';
const items = useThemeLocaleData().value.sidebar;
const sidebarItems = useSidebarItems(items);
const viewport = useViewportBreakpoints();
const { currentMode, setMode } = useThemeManager();

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
const isSearchActive = computed(() => Boolean(inputValue.value.trim()));
const filteredItemKeys = computed(() => {
  return filteredItems.value
    .filter(item => item.children?.length)
    .map(item => item.link || item.text);
});

// Flatten filtered items into a sequential list for keyboard navigation
const flattenedFilteredItems = computed(() => {
  const flattened = [];

  const traverse = (items, parentPath = '') => {
    items.forEach((item, index) => {
      const itemPath = parentPath ? `${parentPath}.${index}` : String(index);

      if (item.link && !item.children?.length) {
        flattened.push(itemPath);
      }

      if (item.children && item.children.length > 0) {
        traverse(item.children, itemPath);
      }
    });
  };

  traverse(filteredItems.value);
  return flattened;
});
const activeItemPath = computed(() => {
  return flattenedFilteredItems.value[highlightIndex.value];
});
const activeResultId = computed(() => {
  return activeItemPath.value
    ? `${SIDEBAR_SEARCH_RESULT_ID_PREFIX}${activeItemPath.value}`
    : undefined;
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
      if (highlightIndex.value < flattenedFilteredItems.value.length - 1) {
        highlightIndex.value++;
      } else {
        highlightIndex.value = 0;
      }
      break;

    case 'ArrowUp':
      event.preventDefault();
      if (highlightIndex.value > 0) {
        highlightIndex.value--;
      } else {
        highlightIndex.value = flattenedFilteredItems.value.length - 1;
      }
      break;

    case 'Enter':
      if (!isModifiedKeypress(event) && highlightIndex.value >= 0) {
        event.preventDefault();
        const highlightedItemPath = flattenedFilteredItems.value[highlightIndex.value];
        const button = getSidebarButton(highlightedItemPath);
        if (button) button.click();
      }
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
  // Clear search and keyboard highlight when navigating to a different page
  inputValue.value = '';
  highlightIndex.value = -1;
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

// Reset keyboard highlight when filtered results change
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
