<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th
          scope="col"
          class="d-w40p"
        >
          Item
        </th>
        <th
          scope="col"
          class="d-w30p"
        >
          Applies to
        </th>
        <th scope="col">
          Description
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="({ item, applies, description }) in accessible"
        :key="item"
      >
        <th
          scope="row"
          class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100"
          v-text="item"
        />
        <td
          class="d-ff-mono d-fs-100"
          v-text="applies"
        />
        <td
          class="d-fs-100"
          v-html="description"
        />
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'ComponentAccessibleTable',
  props: {
    componentName: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      accessible: null,
    };
  },

  beforeMount () {
    import(`../../_data/${this.componentName}.json`).then((module) => {
      this.accessible = module.accessible;
    });
  },
};
</script>

<style scoped>

</style>
