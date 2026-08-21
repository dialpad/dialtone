<template>
  <dt-collapsible
    v-if="hasChildren"
    :open="isOpen"
    element-type="li"
    class="d-w100p"
    anchor-class="d-w100p"
  >
    <template #anchor="{ attrs }">
      <sidebar-item-row
        :id="labelId"
        :item="item"
        :depth="depth"
        :presentation="presentation"
        :active="isActive"
        :highlighted="isHighlighted"
        :collapsible-attrs="attrs"
        :open="isOpen"
        :first-nested-child="firstNestedChild"
        collapsible
        @click="handleClick"
      />
    </template>
    <template #content>
      <dt-stack
        as="ul"
        :aria-labelledby="labelId"
        gap="25"
        :class="{ 'd-pbs-50': depth === 0 || depth === 1 }"
      >
        <sidebar-item
          v-for="(subItem, index) in subItems"
          :key="subItem.link || subItem.text"
          :item="subItem"
          :depth="depth + 1"
          :open-items="openItems"
          :item-path="`${itemPath}.${index}`"
          :peer-keys="subItemKeys"
          :active-item-path="activeItemPath"
          :search-active="searchActive"
          :presentation="presentation"
          :nested="Boolean(subItem.children?.length)"
          :first-nested-child="nested && index === 0 && !subItem.children?.length"
          @toggle="forwardToggle"
        />
      </dt-stack>
    </template>
  </dt-collapsible>

  <li v-else>
    <sidebar-item-row
      :id="resultId"
      :item="item"
      :depth="depth"
      :presentation="presentation"
      :active="isActive"
      :highlighted="isHighlighted"
      :first-nested-child="firstNestedChild"
    />
  </li>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SidebarItemRow from './SidebarItemRow.vue';
import { isDescendantOfNavCollection } from '../utils/navRoutes.js';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  nested: {
    type: Boolean,
    default: false,
  },
  firstNestedChild: {
    type: Boolean,
    default: false,
  },
  depth: {
    type: Number,
    default: 0,
  },
  openItems: {
    type: Set,
    required: true,
  },
  itemPath: {
    type: String,
    required: true,
  },
  peerKeys: {
    type: Array,
    default: () => [],
  },
  activeItemPath: {
    type: String,
    default: null,
  },
  searchActive: {
    type: Boolean,
    default: false,
  },
  presentation: {
    type: String,
    default: 'primary',
  },
});

const emit = defineEmits(['toggle']);
const route = useRoute();

const subItems = computed(() => props.item.children || []);
const hasChildren = computed(() => subItems.value.length > 0);
const subItemKeys = computed(() => subItems.value
  .filter(item => item.children?.length)
  .map(item => item.link || item.text));
const itemKey = computed(() => props.item.link || props.item.text);
const isOpen = computed(() => props.openItems.has(itemKey.value));
const isHighlighted = computed(() => (
  props.searchActive && props.activeItemPath === props.itemPath
));
const isGroupingOnlyParent = computed(() => (
  hasChildren.value && props.item.link === subItems.value[0].link
));
const isRouteActive = computed(() => {
  if (!props.item.link || isGroupingOnlyParent.value) return false;
  if (isDescendantOfNavCollection(props.item.link, route.path)) return true;

  return route.path === props.item.link;
});
const isActive = computed(() => (
  props.searchActive ? isHighlighted.value : isRouteActive.value
));
const labelId = computed(() => `sidebar-label-${props.itemPath.replace(/\./g, '-')}`);
const resultId = computed(() => `dialtone-sidebar-search-result-${props.itemPath}`);

function handleClick (event) {
  event.preventDefault();
  emit('toggle', itemKey.value, !isOpen.value, props.peerKeys);
}

function forwardToggle (itemKey, shouldOpen, peerKeys) {
  emit('toggle', itemKey, shouldOpen, peerKeys);
}
</script>
