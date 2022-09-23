<template>
  <div class="d-divide-y d-divide-purple-400">
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Separator in the end
      </p>
      <dt-pagination
        :total-pages="10"
        :aria-label="'pagination with separator in the end'"
        :prev-aria-label="'previous'"
        :next-aria-label="'next'"
        :page-number-aria-label="getPageNumberAriaLabel"
      />
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Separator in the beginning
      </p>
      <dt-pagination
        :total-pages="15"
        :active-page="13"
        :aria-label="'pagination with separator in the beginning'"
        :prev-aria-label="'previous'"
        :next-aria-label="'next'"
        :page-number-aria-label="getPageNumberAriaLabel"
      />
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Separator on both sides
      </p>
      <dt-pagination
        :total-pages="10"
        :active-page="5"
        :aria-label="'pagination with separator on both sides'"
        :prev-aria-label="'previous'"
        :next-aria-label="'next'"
        :page-number-aria-label="getPageNumberAriaLabel"
      />
    </div>
  </div>
</template>

<script>
import DtPagination from './pagination';

export default {
  name: 'DtPaginationVariants',
  components: { DtPagination },
  methods: {
    getPageNumberAriaLabel (page) {
      return `Page ${page}`;
    },
  },
};
</script>
