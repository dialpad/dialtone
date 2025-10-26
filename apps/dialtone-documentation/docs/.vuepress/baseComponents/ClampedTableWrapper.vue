<template>
  <dt-stack gap="400" class="dialtone-doc-table-clamped">
    <dt-input
      v-model="inputSearchValue"
      aria-label="Search table"
      placeholder="Search table"
      type="search"
      root-class="d-w332"
    >
      <template #leftIcon="{ iconSize }">
        <dt-icon name="search" :size="iconSize" />
      </template>
      <template v-if="inputSearchValue.length !== 0" #rightIcon>
        <dt-stack class="d-pr1">
          <dt-button
            v-dt-tooltip="`Clear`"
            kind="muted"
            importance="clear"
            size="xs"
            aria-label="Clear search"
            @click="clearSearch"
          >
            <template #icon>
              <dt-icon name="close" size="100" />
            </template>
          </dt-button>
        </dt-stack>
      </template>
    </dt-input>
    <dt-empty-state
      v-if="showEmptyState"
      size="sm"
      :header-text="`No results found`"
      class="d-w100p d-ba d-bc-subtle d-bar8 d-pt32"
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
      class="dialtone-doc-table-clamped__more"
    >
      <dt-button
        class="dialtone-doc-table-clamped__more-btn"
        kind="muted"
        importance="outlined"
        icon-position="right"
        size="sm"
        @click="handleExpand"
      >
        {{ buttonLabel }}
        <template #icon="{ iconSize }">
          <dt-icon :name="iconName" :size="iconSize" />
        </template>
      </dt-button>
    </div>
  </dt-stack>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

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
    default: 'd-hmx464',
  },
});

const inputSearchValue = ref('');
const showEmptyState = ref(false);

// Track clamp state and DOM reference for measuring content height.
const isExpanded = ref(false);
const isExpandable = ref(false);
const scrollRef = ref(null);

// Move these into component scope to prevent memory leaks
const resizeObserver = ref(null);
const timers = {
  resizeObserver: null,
  windowResize: null,
  searchDebounce: null,
};

const DEFAULT_MAX_HEIGHT = 464;
const HEIGHT_FUDGE_PX = 8;
const RESIZE_DEBOUNCE_MS = 100;

// Memoized base classes for performance
const BASE_SCROLL_CLASSES = [
  'dialtone-doc-table-clamped__scroll',
  'd-bar8',
  'd-ba',
  'd-bc-subtle',
];

// Parse the numeric value from the provided max-height utility class.
const resolvedMaxHeight = computed(() => {
  const match = maxHeightClass.match(/d-hmx(\d+)/);

  if (!match) {
    return DEFAULT_MAX_HEIGHT;
  }

  const [, heightString] = match;

  const parsedHeight = Number.parseInt(heightString, 10);

  return Number.isNaN(parsedHeight) ? DEFAULT_MAX_HEIGHT : parsedHeight;
});

const expandThreshold = computed(() => Math.max(resolvedMaxHeight.value - HEIGHT_FUDGE_PX, 0));

const shouldShowButton = computed(() => !isExpanded.value && isExpandable.value);

const scrollClasses = computed(() => [
  ...BASE_SCROLL_CLASSES,
  {
    [maxHeightClass]: !isExpanded.value,
    'd-hmx-auto': isExpanded.value,
  },
]);

const handleExpand = () => {
  isExpanded.value = true;
};

// Determine whether the content exceeds the max-height threshold.
const updateExpandable = () => {
  const wrapper = scrollRef.value;

  if (!wrapper) {
    isExpandable.value = false;
    return;
  }

  const scrollHeight = wrapper.scrollHeight ?? 0;

  isExpandable.value = scrollHeight > expandThreshold.value;
};

const handleResize = () => {
  clearTimeout(timers.windowResize);
  timers.windowResize = setTimeout(() => {
    updateExpandable();
  }, RESIZE_DEBOUNCE_MS);
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
    updateExpandable();
  });
};

// Filter table rows based on search term
const filterTableRows = (rows, searchTerm) => {
  let visibleCount = 0;
  
  rows.forEach(row => {
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

// Perform search filtering on table rows (simplified orchestrator)
const performSearch = () => {
  const searchTerm = inputSearchValue.value.toLowerCase().trim();

  // If no search term, reset everything
  if (!searchTerm) {
    return resetSearch();
  }

  // If we're showing empty state, we need to hide it first to access the table
  if (showEmptyState.value) {
    showEmptyState.value = false;
    // Wait for DOM to update before searching
    nextTick(() => performSearch());
    return;
  }

  const table = scrollRef.value?.querySelector('table');
  if (!table) return;

  // Clear existing highlights
  removeHighlights(table);

  // Get all rows and filter them
  const rows = table.querySelectorAll('tbody tr');
  
  // NOTE: We must use DOM manipulation here because the table content comes from a slot
  // and we cannot control it via Vue's template reactivity. Using CSS classes is cleaner
  // than inline styles and follows Vue best practices as much as possible given the constraint.
  const visibleCount = filterTableRows(rows, searchTerm);
  
  // Apply highlights to visible rows
  if (visibleCount > 0) {
    applySearchHighlights(rows, searchTerm);
  }

  // Update empty state
  showEmptyState.value = visibleCount === 0 && rows.length > 0;

  // Recalculate expandability after filtering
  if (!showEmptyState.value) {
    nextTick(() => updateExpandable());
  }
};

// Debounced search handler
const handleSearch = () => {
  clearTimeout(timers.searchDebounce);
  timers.searchDebounce = setTimeout(() => {
    performSearch();
  }, 200); // 200ms debounce for search
};

// Clear search and reset table
const clearSearch = () => {
  inputSearchValue.value = '';
  resetSearch();
};

// Watch for search input changes
watch(inputSearchValue, () => {
  handleSearch();
});

onMounted(() => {
  window.addEventListener('resize', handleResize, { passive: true });

  nextTick(() => {
    updateExpandable();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const wrapper = scrollRef.value;

    if (!wrapper) {
      return;
    }

    // Keep the expandable state in sync with dynamic slot content changes.
    // Debounced to avoid excessive recalculation during rapid resizes.
    resizeObserver.value = new ResizeObserver(() => {
      clearTimeout(timers.resizeObserver);
      timers.resizeObserver = setTimeout(() => {
        updateExpandable();
      }, RESIZE_DEBOUNCE_MS);
    });

    resizeObserver.value.observe(wrapper);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  
  // Clear all timers
  clearTimeout(timers.resizeObserver);
  clearTimeout(timers.windowResize);
  clearTimeout(timers.searchDebounce);

  // Disconnect and clean up ResizeObserver
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
    resizeObserver.value = null;
  }
});
</script>

<style scoped lang="less">
.dialtone-doc-table-clamped {
  position: relative;

  :deep(mark) {
    outline: var(--dt-size-border-100) solid var(--dt-color-surface-warning);
  }

  &__more {
    position: absolute;
    bottom: var(--dt-space-500-negative);
    left: var(--dt-size-50-percent);
    transform: translateX(calc(var(--dt-size-50-percent) * -1));
  }

  &__more-btn {
    background-color: var(--dt-color-surface-secondary);
    box-shadow: var(--dt-shadow-small);
  }
}
</style>
