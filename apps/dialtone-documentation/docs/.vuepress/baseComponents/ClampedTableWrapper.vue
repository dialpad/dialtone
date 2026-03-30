<template>
  <dt-stack gap="100" class="dialtone-doc-table-clamped d-ps-relative" role="region" aria-label="Searchable table">
    <dt-stack v-if="shouldShowSearch" role="search" direction="row" align="center" gap="200">
      <dt-input
        v-model="inputSearchValue"
        aria-label="Search table"
        placeholder="Search table"
        type="search"
        root-class="d-w-500"
        @keydown.escape="handleEscapeKey"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon name="search" :size="iconSize" />
        </template>
        <template v-if="inputSearchValue.length !== 0" #endIcon>
          <dt-stack class="d-pie-1">
            <dt-button
              v-dt-tooltip="`Clear`"
              kind="muted"
              importance="clear"
              :size="100"
              aria-label="Clear search"
              @click="clearSearch"
            >
              <template #startIcon>
                <dt-icon name="close" size="100" />
              </template>
            </dt-button>
          </dt-stack>
        </template>
      </dt-input>
      <dt-toggle v-if="hasDeprecatedRows" v-model="hideDeprecated" wrapper-class="d-g-100" size="sm">
        <dt-text kind="label" size="xs" strength="normal">
          Hide deprecated
        </dt-text>
      </dt-toggle>
    </dt-stack>
    <dt-empty-state
      v-if="showEmptyState"
      :size="200"
      :header-text="`No results found`"
      class="d-w100p d-ba d-bc-subtle d-bar8 d-pbs-400"
    >
      <template #icon="{ iconSize }">
        <!-- maybe alt icon? -->
        <dt-icon name="box" :size="iconSize" />
      </template>
    </dt-empty-state>
    <div
      v-else
      ref="scrollRef"
      v-dt-scrollbar
      :class="scrollClasses"
    >
      <slot />
    </div>
    <div
      v-if="shouldShowButton"
      class="dialtone-doc-table-clamped__more d-ps-absolute d-bn8 d-l50p"
      aria-hidden="true"
    >
      <dt-button
        class="dialtone-doc-table-clamped__more-btn d-bgc-secondary d-bs-sm"
        kind="muted"
        importance="outlined"
        :size="100"
        @click="() => handleExpand(scrollRef)"
      >
        {{ buttonLabel }}
        <template #endIcon="{ iconSize }">
          <dt-icon :name="iconName" :size="iconSize" />
        </template>
      </dt-button>
    </div>
    <!-- ARIA live region for search results announcement -->
    <div class="d-vi-visible-sr" role="status" aria-live="polite" aria-atomic="true">
      {{ searchResultsAnnouncement }}
    </div>
  </dt-stack>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useDocExpandable } from '../composables/useDocExpandable.js';

defineOptions({
  name: 'ClampedTableWrapper',
});

const { buttonLabel, iconName, maxHeightClass } = defineProps({
  buttonLabel: {
    type: String,
    default: 'Show all',
  },
  iconName: {
    type: String,
    default: 'arrow-down',
  },
  maxHeightClass: {
    type: String,
    default: 'd-hmx-700',
  },
});

// Configuration constants
const SEARCH_VISIBILITY_THRESHOLD = 4; // Min rows to show search
const SEARCH_DEBOUNCE_MS = 200; // Debounce delay for search input

const inputSearchValue = ref('');
const showEmptyState = ref(false);
const searchResultsAnnouncement = ref('');
const shouldShowSearch = ref(true);
const hasDeprecatedRows = ref(false);
const hideDeprecated = ref(true);

// DOM reference for measuring content height
const scrollRef = ref(null);

// Expandable functionality from composable
const { isExpanded, shouldShowButton, handleExpand, updateExpandable, initExpandable } = useDocExpandable({
  maxHeightClass,
});

// Separate concerns: timers vs observers
const timers = {
  searchDebounce: null,
};

const observers = {
  searchResize: null,
};

// Memoized base classes for performance
const BASE_SCROLL_CLASSES = [
  'dialtone-doc-table-clamped__scroll',
  'd-bar8',
  'd-ba',
  'd-bc-subtle',
];

const scrollClasses = computed(() => [
  ...BASE_SCROLL_CLASSES,
  {
    [maxHeightClass]: !isExpanded.value,
    'd-hmx-auto': isExpanded.value,
  },
]);

// Wrapper to update expandable state with current scroll ref
const updateExpandableState = () => {
  if (scrollRef.value) {
    updateExpandable(scrollRef.value);
  }
};

// Check if search should be shown based on table row count
const checkSearchVisibility = () => {
  const table = scrollRef.value?.querySelector('table');
  if (table) {
    const rows = table.querySelectorAll('tbody tr');
    shouldShowSearch.value = rows.length >= SEARCH_VISIBILITY_THRESHOLD;
  }
};

// Find all deprecated badge elements in the table
const findDeprecatedBadges = () => {
  const table = scrollRef.value?.querySelector('table');
  if (!table) return [];
  return [...table.querySelectorAll('[data-qa="dt-badge"]')].filter(
    badge => badge.textContent.trim() === 'Deprecated',
  );
};

// Detect if any rows contain a deprecated badge
const checkForDeprecatedRows = () => {
  hasDeprecatedRows.value = findDeprecatedBadges().length > 0;
};

// Get all rows that contain a deprecated badge
const getDeprecatedRows = () => {
  return findDeprecatedBadges().map(badge => badge.closest('tr')).filter(Boolean);
};

// Toggle visibility of deprecated rows
const toggleDeprecatedRows = () => {
  const rows = getDeprecatedRows();
  rows.forEach(row => {
    row.toggleAttribute('hidden', hideDeprecated.value);
  });
  nextTick(() => updateExpandableState());
};

// Highlight matching text in table cells
const highlightMatches = (element, searchTerm) => {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false,
  );

  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    const text = textNode.textContent;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    const matches = text.match(regex);
    if (!matches) return;

    // Split text by matches and create nodes
    const parts = text.split(regex);
    const fragment = document.createDocumentFragment();

    parts.forEach((part) => {
      if (part) {
        // Check if this part is a match (case-insensitive)
        if (matches.some(match => match.toLowerCase() === part.toLowerCase())) {
          const mark = document.createElement('mark');
          mark.className = 'd-bgc-warning d-bar2 d-fc-primary';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      }
    });

    textNode.parentNode.replaceChild(fragment, textNode);
  });
};

// Remove all highlight marks
const removeHighlights = (element) => {
  const marks = element.querySelectorAll('mark');
  marks.forEach(mark => {
    const parent = mark.parentNode;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
  });

  // Normalize text nodes that may have been split
  element.normalize();
};

// Reset search - clear all filters and highlights
const resetSearch = () => {
  showEmptyState.value = false;
  nextTick(() => {
    const table = scrollRef.value?.querySelector('table');
    if (table) {
      removeHighlights(table);
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        row.classList.remove('d-d-none');
      });
    }
    updateExpandableState();
  });
};

// Filter table rows based on search term
const filterTableRows = (rows, searchTerm) => {
  let visibleCount = 0;

  rows.forEach(row => {
    // Skip rows hidden by the deprecated toggle
    if (row.hasAttribute('hidden')) return;

    const rowText = row.textContent?.toLowerCase() || '';
    const isMatch = rowText.includes(searchTerm);
    row.classList.toggle('d-d-none', !isMatch);
    if (isMatch) visibleCount++;
  });

  return visibleCount;
};

// Apply highlights to visible rows
const applySearchHighlights = (rows, searchTerm) => {
  rows.forEach(row => {
    // Only highlight visible rows
    if (!row.classList.contains('d-d-none')) {
      row.querySelectorAll('td, th').forEach(cell => {
        highlightMatches(cell, searchTerm);
      });
    }
  });
};

/**
 * Prepare search context by validating and retrieving table elements.
 * @returns {Object|null} Search context with table and rows, or null if unavailable
 */
const prepareSearchContext = () => {
  const table = scrollRef.value?.querySelector('table');
  if (!table) return null;

  const rows = table.querySelectorAll('tbody tr');
  if (!rows.length) return null;

  return { table, rows };
};

/**
 * Update UI state based on search results.
 * @param {number} visibleCount - Number of visible rows after filtering
 * @param {string} searchTerm - The search term used
 * @param {number} totalRows - Total number of rows searched
 */
const updateSearchResultsUI = (visibleCount, searchTerm, totalRows) => {
  // Update empty state
  showEmptyState.value = visibleCount === 0 && totalRows > 0;

  // Announce search results for screen readers
  if (showEmptyState.value) {
    searchResultsAnnouncement.value = `No results found for ${searchTerm}`;
  } else if (visibleCount === 1) {
    searchResultsAnnouncement.value = `1 result found for ${searchTerm}`;
  } else {
    searchResultsAnnouncement.value = `${visibleCount} results found for ${searchTerm}`;
  }

  // Recalculate expandability after filtering
  if (!showEmptyState.value) {
    nextTick(() => updateExpandableState());
  }
};

/**
 * Handle deferred search when empty state is currently shown.
 * Hides empty state and reschedules search after DOM update.
 */
const handleDeferredSearch = () => {
  showEmptyState.value = false;
  nextTick(() => performSearch());
};

/**
 * Orchestrate search operation across table rows.
 * Delegates to helper functions for each concern.
 */
const performSearch = () => {
  const searchTerm = inputSearchValue.value.toLowerCase().trim();

  // Early returns for simple cases
  if (!searchTerm) {
    return resetSearch();
  }

  if (showEmptyState.value) {
    return handleDeferredSearch();
  }

  // Prepare search context
  const context = prepareSearchContext();
  if (!context) return;

  const { table, rows } = context;

  // Clear previous search state
  removeHighlights(table);

  // Execute search and get results
  // NOTE: DOM manipulation required because table content comes from slots.
  // We cannot control slot content via Vue's template reactivity.
  const visibleCount = filterTableRows(rows, searchTerm);

  // Apply visual feedback for matches
  if (visibleCount > 0) {
    applySearchHighlights(rows, searchTerm);
  }

  // Update UI based on results
  updateSearchResultsUI(visibleCount, searchTerm, rows.length);
};

// Debounced search handler
const handleSearch = () => {
  clearTimeout(timers.searchDebounce);
  timers.searchDebounce = setTimeout(() => {
    performSearch();
  }, SEARCH_DEBOUNCE_MS);
};

// Clear search and reset table
const clearSearch = () => {
  inputSearchValue.value = '';
  resetSearch();
  searchResultsAnnouncement.value = 'Search cleared';
};

// Handle Escape key to clear search
const handleEscapeKey = () => {
  if (inputSearchValue.value) {
    clearSearch();
  }
};

// Watch for search input changes
watch(inputSearchValue, () => {
  handleSearch();
});

// Watch for deprecated toggle changes
watch(hideDeprecated, () => {
  toggleDeprecatedRows();
});

// Watch for search state changes and update expandable
watch(showEmptyState, () => {
  if (!showEmptyState.value) {
    nextTick(() => updateExpandableState());
  }
});

onMounted(() => {
  nextTick(() => {
    checkSearchVisibility();
    checkForDeprecatedRows();
    toggleDeprecatedRows();

    // Initialize expandable functionality
    if (scrollRef.value) {
      initExpandable(scrollRef.value);
    }

    // Set up additional observer for search visibility
    if (typeof ResizeObserver !== 'undefined' && scrollRef.value) {
      const searchObserver = new ResizeObserver(() => {
        checkSearchVisibility();
      });
      searchObserver.observe(scrollRef.value);

      // Store observer for cleanup
      observers.searchResize = searchObserver;
    }
  });
});

onBeforeUnmount(() => {
  // Clear search timer
  clearTimeout(timers.searchDebounce);

  // Disconnect search observer
  if (observers.searchResize) {
    observers.searchResize.disconnect();
  }

  // Composable handles its own cleanup via onBeforeUnmount
});
</script>

<style scoped lang="less">
.dialtone-doc-table-clamped {

  :deep(mark) {
    outline: var(--dt-size-border-100) solid var(--dt-color-surface-warning); // no outline css utility available
  }

  &__more {
    transform: translateX(calc(var(--dt-layout-50-percent) * -1)); // Transform kept as custom
  }

}
</style>
