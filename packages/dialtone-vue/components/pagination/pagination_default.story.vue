<template>
  <dt-pagination
    :aria-label="$attrs.ariaLabel"
    :total-pages="$attrs.totalPages"
    :active-page="$attrs.activePage"
    :max-visible="$attrs.maxVisible"
    :hide-edges="$attrs.hideEdges"
    @change="$attrs.onChange"
  />
</template>

<script>
import DtPagination from './pagination.vue';

export default {
  name: 'DtPaginationDefault',
  components: { DtPagination },
};
</script>
