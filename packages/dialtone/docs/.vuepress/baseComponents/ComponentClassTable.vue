<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th
          class="d-w40p"
          scope="col"
        >
          Class
        </th>
        <th
          class="d-w30p"
          scope="col"
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
        v-for="({ class: className, applies, description }) in classes"
        :key="className"
      >
        <th
          scope="row"
          class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100"
          v-text="`.${className}`"
        />
        <td class="d-ff-mono d-fs-100 d-lh-300">
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
</template>

<!-- TODO: Refactor ComponentClassTable and ComponentAccessibleTable to avoid code repetition -->
<script>
export default {
  name: 'ComponentClassTable',
  props: {
    componentName: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      classes: null,
    };
  },

  beforeMount () {
    import(`../../_data/${this.componentName}.json`).then((module) => {
      this.classes = module.classes;
    });
  },
};
</script>

<style scoped>

</style>
