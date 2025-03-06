<template>
  <div class="d-hmx464 d-of-y-auto d-bb d-bc-black-200">
    <table class="d-table dialtone-doc-table d-fc-primary">
      <thead>
        <tr>
          <th class="d-w25p" scope="col">
            Class
          </th>
          <th scope="col">
            Output
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
</template>

<script setup>
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
