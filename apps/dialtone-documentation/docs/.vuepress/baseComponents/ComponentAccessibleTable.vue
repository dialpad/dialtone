<template>
  <div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th
              scope="col"
              class="d-w40p d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bbw1">
                Item
              </div>
            </th>
            <th
              scope="col"
              class="d-w30p d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bbw1">
                Applies to
              </div>
            </th>
            <th
              scope="col"
              class="d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bbw1">
                Description
              </div>
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
              class="d-code--sm d-docsite-code"
              v-text="item"
            />
            <td
              class="d-code--sm"
              v-text="applies"
            />
            <td
              class="d-fs-100"
              v-html="description"
            />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
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
