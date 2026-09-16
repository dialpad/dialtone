<template>
  <dt-list-item
    v-for="item in items"
    :key="item.slug || item.link"
    role="menuitem"
    navigation-type="arrow-keys"
    :selected="isItemActive(item)"
    :wrapper-class="getItemWrapperClass(item)"
    @click="emit('navigate', $event, item)"
  >
    {{ item.title }}
  </dt-list-item>
</template>

<script setup>
import { computed } from 'vue';
import { flattenHeadersWithDepth } from '../utils/pageToc.js';

const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  activeHash: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['navigate']);

const items = computed(() => {
  return flattenHeadersWithDepth(props.headers);
});

function isItemActive (item) {
  return item.link === props.activeHash;
}

function getItemWrapperClass (item) {
  return [
    'd-tw-pretty',
    {
      'd-pis-250': item.depth === 1,
    },
  ];
}
</script>
