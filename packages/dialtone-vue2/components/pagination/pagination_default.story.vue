<template>
  <dt-pagination
    :total-pages="$attrs.totalPages"
    :active-page="$attrs.activePage"
    :max-visible="$attrs.maxVisible"
    :aria-label="$attrs.ariaLabel"
    :prev-aria-label="$attrs.prevAriaLabel"
    :next-aria-label="$attrs.nextAriaLabel"
    :page-number-aria-label="getPageNumberAriaLabel"
    @change="$attrs.onChange"
  />
</template>

<script>
import DtPagination from './pagination.vue';

export default {
  name: 'DtPaginationDefault',
  components: { DtPagination },
  methods: {
    getPageNumberAriaLabel (page) {
      return page === this.$attrs.totalPages ? `Last page ${page}` : `Page ${page}`;
    },
  },
};
</script>
