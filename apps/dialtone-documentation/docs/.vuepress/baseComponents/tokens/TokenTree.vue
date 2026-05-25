<template>
  <div v-for="subNodeKey in visibleSubNodeKeys()" :key="subNodeKey">
    <token-table
      v-if="isChild(subNodeKey) && hasContent(subNodeKey)"
      :category="category"
      :tokens="node[subNodeKey]"
      :mode="props.mode"
      :hide-deprecated="props.hideDeprecated"
    />
    <div v-else-if="!isChild(subNodeKey)">
      <component
        :is="`h${level}`"
        :id="getHeaderId(subNodeKey)"
        :class="`d-docsite--header-${level} d-tt-capitalize`"
        tabindex="-1"
      >
        <a
          :href="`#${getHeaderId(subNodeKey)}`"
          class="header-anchor d-link d-docsite--link d-link"
        >#</a>
        {{ subNodeKey }}
      </component>
      <TokenTree
        :node="node[subNodeKey]"
        :category="category === null ? subNodeKey : category"
        :level="level + 1"
        :mode="props.mode"
        :hide-deprecated="props.hideDeprecated"
      />
    </div>
  </div>
</template>

<script setup>
import TokenTable from '@baseComponents/tokens/TokenTable.vue';

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },

  category: {
    type: String,
    default: null,
  },

  level: {
    type: Number,
    required: true,
  },

  mode: {
    type: String,
    required: true,
  },

  hideDeprecated: {
    type: Boolean,
    default: true,
  },
});

const isChild = (key) => (key === '_children');

const isVisibleToken = (token) => !token.hidden && !(props.hideDeprecated && token.deprecated);

const hasContent = (key) => props.node[key].some(isVisibleToken);

const hasVisibleContent = (node) => {
  if (Array.isArray(node)) return node.some(isVisibleToken);
  if (node._children?.some(isVisibleToken)) return true;
  return Object.keys(node).some(key => key !== '_children' && hasVisibleContent(node[key]));
};

const visibleSubNodeKeys = () => Object.keys(props.node)
  .filter(key => isChild(key) || hasVisibleContent(props.node[key]));

const getHeaderId = (key) => (props.category === null ? key : `${props.category}-${key}`);
</script>
