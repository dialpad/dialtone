<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table d-fc-primary">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(value, className) in classes"
            :key="className"
          >
            <th scope="row">
              <dt-text as="span" kind="code" size="xs" class="d-docsite-code">
                {{ className }}
              </dt-text>
            </th>
            <td class="d-ws-break-spaces">
              <dt-stack direction="row" justify="between" align="center" gap="200">
                <dt-text as="span" kind="code" size="xs" class="d-fl-grow1">
                  {{ value }}
                </dt-text>
                <slot name="example" :class-name="className" />
              </dt-stack>
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
