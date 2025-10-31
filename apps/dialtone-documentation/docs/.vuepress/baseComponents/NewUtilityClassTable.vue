<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table d-fc-primary">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th class="d-w25p d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Class
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Output
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(value, className) in classes"
            :key="className"
          >
            <th
              scope="row"
              class="d-code--sm d-docsite-code"
              v-text="className"
            />
            <td
              class="d-code--sm d-ws-break-spaces"
            >
              <div class="d-d-flex d-jc-space-between d-ai-center d-gg16">
                <span class="d-fl-grow1 d-code--sm" v-text="value" />
                <slot name="example" :class-name="className" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </clamped-table-wrapper>
</template>

<script setup>
import ClampedTableWrapper from './ClampedTableWrapper.vue';

defineOptions({
  name: 'NewUtilityClassTable',
});

const { classes } = defineProps({
  classes: {
    type: Object,
    required: true,
  },
});
</script>
