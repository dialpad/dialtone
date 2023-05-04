<template>
  <dt-pagination
    :total-pages="totalPages"
    :active-page="activePage"
    :max-visible="maxVisible"
    :aria-label="ariaLabel"
    :prev-aria-label="prevAriaLabel"
    :next-aria-label="nextAriaLabel"
    :page-number-aria-label="getPageNumberAriaLabel"
    @change="onChange"
  />
</template>

<script>
import DtPagination from './pagination.vue';

export default {
  name: 'DtPaginationDefault',
  components: { DtPagination },
  methods: {
    getPageNumberAriaLabel (page) {
      return page === this.totalPages ? `Last page ${page}` : `Page ${page}`;
    },
  },
};
</script>
