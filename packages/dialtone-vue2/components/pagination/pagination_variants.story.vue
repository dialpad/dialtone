<template>
  <div class="d-divide-y d-divide-purple-400">
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Separator in the end
      </p>
      <dt-pagination
        :total-pages="10"
        aria-label="pagination with separator in the end"
      />
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Separator in the beginning
      </p>
      <dt-pagination
        :total-pages="15"
        :active-page="13"
        aria-label="pagination with separator in the beginning"
      />
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Separator on both sides
      </p>
      <dt-pagination
        :total-pages="10"
        :active-page="5"
        aria-label="pagination with separator on both sides"
      />
    </div>
    <div class="d-m32">
      <p class="d-my16 d-fs-200 d-fw-bold">
        Hide edges
      </p>
      <dt-pagination
        :total-pages="10"
        :active-page="5"
        aria-label="pagination with separator on both sides"
        :hide-edges="true"
      />
    </div>
  </div>
</template>

<script>
import DtPagination from './pagination.vue';

export default {
  name: 'DtPaginationVariants',
  components: { DtPagination },
};
</script>
