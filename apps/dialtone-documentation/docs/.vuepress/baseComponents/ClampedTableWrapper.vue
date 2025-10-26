<template>
  <div class="dialtone-doc-table-clamped">
    <div
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
        <template #icon>
          <dt-icon :name="iconName" size="100" />
        </template>
      </dt-button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

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

// Track clamp state and DOM reference for measuring content height.
const isExpanded = ref(false);
const isExpandable = ref(false);
const scrollRef = ref(null);
let resizeObserver;

const DEFAULT_MAX_HEIGHT = 464;
const HEIGHT_FUDGE_PX = 8;

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
  'dialtone-doc-table-clamped__scroll',
  'd-bar8',
  'd-ba',
  'd-bc-subtle',
  {
    [maxHeightClass]: !isExpanded.value,
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
  updateExpandable();
};

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
    resizeObserver = new ResizeObserver(() => {
      updateExpandable();
    });

    resizeObserver.observe(wrapper);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);

  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = undefined;
  }
});
</script>

<style scoped lang="less">
.dialtone-doc-table-clamped {
  position: relative;

  &__more {
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
  }

  &__more-btn {
    background-color: var(--dt-color-surface-secondary);
    box-shadow: var(--dt-shadow-small);
  }
}
</style>
