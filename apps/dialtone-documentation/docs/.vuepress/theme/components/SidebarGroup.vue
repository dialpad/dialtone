<template>
  <dt-stack
    as="ul"
    :gap="groupGap"
    :class="{ 'd-px-1': presentation === 'promoted' }"
  >
    <sidebar-item
      v-for="(item, index) in items"
      :key="item.link || item.text"
      :item="item"
      :depth="0"
      :open-items="openItems"
      :item-path="`${pathPrefix}.${index}`"
      :peer-keys="peerKeys"
      :active-item-path="activeItemPath"
      :search-active="searchActive"
      :presentation="presentation"
      @toggle="forwardToggle"
    />
  </dt-stack>
</template>

<script setup>
import { computed } from 'vue';
import SidebarItem from './SidebarItem.vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  presentation: {
    type: String,
    default: 'primary',
  },
  pathPrefix: {
    type: String,
    required: true,
  },
  openItems: {
    type: Set,
    required: true,
  },
  activeItemPath: {
    type: String,
    default: null,
  },
  searchActive: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle']);

const groupGap = computed(() => props.presentation === 'promoted' ? '0' : '50');
const peerKeys = computed(() => props.items
  .filter(item => item.children?.length)
  .map(item => item.link || item.text));

function forwardToggle (itemKey, shouldOpen, peerKeys) {
  emit('toggle', itemKey, shouldOpen, peerKeys);
}
</script>
