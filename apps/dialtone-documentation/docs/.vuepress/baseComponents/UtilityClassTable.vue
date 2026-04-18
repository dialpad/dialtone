<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table d-fc-primary">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
          <tr>
            <th class="d-w25p d-p-0 d-bbw0" scope="col">
              <div class="d-p-200 d-bb d-bbw1">
                Class
              </div>
            </th>
            <th class="d-p-0 d-bbw0" scope="col">
              <div class="d-p-200 d-bb d-bbw1">
                Output
              </div>
            </th>
            <th v-if="showRendered" class="d-p-0 d-bbw0 d-ta-right" scope="col">
              <div class="d-p-200 d-bb d-bbw1">
                REM
              </div>
            </th>
            <th v-if="showRendered" class="d-p-0 d-bbw0 d-ta-right" scope="col">
              <div class="d-p-200 d-bb d-bbw1">
                PX
              </div>
            </th>
          </tr>
        </thead>
        <slot name="content" />
      </table>
    </div>
  </clamped-table-wrapper>
</template>

<script setup>
import ClampedTableWrapper from './ClampedTableWrapper.vue';

defineOptions({
  name: 'UtilityClassTable',
});

defineProps({
  showRendered: {
    type: Boolean,
    default: false,
  },
});
</script>
