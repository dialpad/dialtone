<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-ibs-0">
          <tr>
            <th
              scope="col"
              class="d-w40p d-p-0 d-bbw0"
            >
              <div class="d-p-200 d-bb d-bbw1">
                Item
              </div>
            </th>
            <th
              scope="col"
              class="d-w30p d-p-0 d-bbw0"
            >
              <div class="d-p-200 d-bb d-bbw1">
                Applies to
              </div>
            </th>
            <th
              scope="col"
              class="d-p-0 d-bbw0"
            >
              <div class="d-p-200 d-bb d-bbw1">
                Description
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="({ item, applies, description }) in accessible"
            :key="item"
            valign="baseline"
          >
            <th scope="row">
              <dt-text
                as="span"
                kind="code"
                :size="100"
                class="d-docsite-code"
              >
                {{ item }}
              </dt-text>
            </th>
            <td>
              <dt-text
                as="code"
                kind="code"
                :size="100"
                class="code-example--inline"
              >
                {{ applies }}
              </dt-text>
            </td>
            <td>
              <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -->
              <dt-text kind="body" :size="200" v-html="description" />
            </td>
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
  name: 'ComponentAccessibleTable',
});

const { componentName } = defineProps({
  componentName: {
    type: String,
    required: true,
  },
});

const { data: accessible } = useComponentTableData(componentName, 'accessible');
</script>
