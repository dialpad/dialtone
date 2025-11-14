<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th
              class="d-w40p d-p0 d-bbw0"
              scope="col"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Class
              </div>
            </th>
            <th
              class="d-w30p d-p0 d-bbw0"
              scope="col"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Applies to
              </div>
            </th>
            <th
              class="d-p0 d-bbw0"
              scope="col"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Description
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="({ class: className, applies, description }) in classes"
            :key="className"
          >
            <th
              scope="row"
              class="d-code--sm d-docsite-code"
              v-text="`.${className}`"
            />
            <td class="d-code--sm">
              <span
                class="code-example--inline"
                v-text="applies"
              />
            </td>
            <td
              class="d-fs-100 d-lh-300"
              v-text="description"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </clamped-table-wrapper>
</template>

<script setup>
import ClampedTableWrapper from './ClampedTableWrapper.vue';
import { useComponentTableData } from '../composables/useComponentTableData.js';

defineOptions({
  name: 'ComponentClassTable',
});

const { componentName } = defineProps({
  componentName: {
    type: String,
    required: true,
  },
});

const { data: classes } = useComponentTableData(componentName, 'classes');
</script>
