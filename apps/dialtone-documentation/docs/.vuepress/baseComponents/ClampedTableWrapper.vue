<template>
  <div class="dialtone-doc-table-clamped">
    <div
      v-dt-scrollbar
      :class="scrollClasses"
    >
      <slot />
    </div>
    <div
      v-if="!isExpanded"
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
import { computed, ref } from 'vue';

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

const isExpanded = ref(false);

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
