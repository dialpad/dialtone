<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-filter-pill label="Custom popover">
      <template #content="{ close }">
        <dt-stack gap="200">
          <span>Use custom content without a filter array.</span>
          <dt-button @click="close">
            Close custom popover
          </dt-button>
        </dt-stack>
      </template>
    </dt-filter-pill>
    <dt-filter-pill
      label="Custom dropdown"
      use-dropdown
    >
      <template #content="{ close }">
        <dt-list-item
          role="menuitem"
          navigation-type="arrow-keys"
          @click="close"
        >
          Close custom dropdown
        </dt-list-item>
      </template>
    </dt-filter-pill>
  </dt-stack>
</template>

<script>
import DtFilterPill from './FilterPill.vue';
import { DtButton } from '@/components/Button';
import { DtListItem } from '@/components/ListItem';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtFilterPillCustomContent',
  components: { DtFilterPill, DtButton, DtListItem, DtStack },
};
</script>
