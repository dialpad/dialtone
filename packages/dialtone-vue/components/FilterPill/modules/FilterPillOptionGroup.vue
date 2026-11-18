<template>
  <!-- A list item wraps the group so the menu list never holds a ul directly. -->
  <li
    v-if="heading"
    role="none"
    class="d-filter-pill__menu-group"
  >
    <dt-list-item-group
      :heading="heading"
      heading-class="d-filter-pill__menu-heading"
    >
      <template #heading>
        <!-- Same DtText props as FilterPill's headerContent menu heading; keep them matched. -->
        <dt-text
          variant="label-xs"
          :size="100"
          strength="medium"
          tone="tertiary"
          :density="500"
        >
          {{ heading }}
        </dt-text>
      </template>
      <slot />
    </dt-list-item-group>
  </li>
  <!-- Ungrouped rows stay direct children of the menu list. -->
  <slot v-else />
</template>

<script setup lang="ts">
// @ts-nocheck
/**
 * Internal FilterPill section: a labelled DtListItemGroup when a heading is supplied,
 * otherwise the rows themselves with no wrapper.
 */
import { DtListItemGroup } from '@/components/ListItemGroup';
import { DtText } from '@/components/Text';

defineOptions({ name: 'DtFilterPillOptionGroup' });

defineProps({
  /** Group heading text; null renders the rows ungrouped. */
  heading: {
    type: String,
    default: null,
  },
});
</script>
