<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col">
          Size
        </th>
        <th
          scope="col"
          class="d-w25p"
        >
          Variable
        </th>
        <th
          scope="col"
          class="d-w25p"
        >
          Class
        </th>
        <th
          scope="col"
          class="d-w35p"
        >
          Examples
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="size in iconSizes"
        :key="size"
      >
        <th scope="row">
          {{ size.size }}
        </th>
        <td class="d-ff-mono d-fs-100">
          {{ size.variable }}
        </td>
        <td class="d-ff-mono d-fs-100">
          .{{ size.class }}
        </td>
        <td>
          <div class="d-d-flex d-ai-center d-mxn2">
            <component
              :is="exampleIcon"
              :class="size.class"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'IconSizesTable',
  data: () => ({
    iconSizes: [],
  }),

  async created () {
    const module = await import('../../_data/icons-sizes.json');
    this.iconSizes = module.v6;
    this.exampleIcon = defineAsyncComponent(() => import('../../../lib/dist/vue/icons/IconPhone.vue'));
  },
};
</script>

<style scoped>

</style>
