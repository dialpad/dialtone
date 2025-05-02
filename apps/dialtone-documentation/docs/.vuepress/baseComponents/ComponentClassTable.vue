<template>
  <div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
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
  </div>
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
