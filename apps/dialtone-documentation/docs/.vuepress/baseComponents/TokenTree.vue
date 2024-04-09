<template>
  <div v-for="subNodeKey in Object.keys(node)" :key="subNodeKey">
    <token-table
      v-if="isChild(subNodeKey) && hasContent(subNodeKey)"
      :category="category"
      :tokens="node[subNodeKey]"
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
      />
    </div>
  </div>
</template>

<script setup>
import TokenTable from '@baseComponents/TokenTable.vue';

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
});

const isChild = (key) => (key === '_children');

const hasContent = (key) => (props.node[key].length > 0);

const getHeaderId = (key) => (props.category === null ? key : `${props.category}-${key}`);
</script>
