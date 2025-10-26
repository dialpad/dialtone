<template>
  <div class="dialtone-doc-table-clamped">
    <div
      v-dt-scrollbar
      class="
        dialtone-doc-table-clamped__scroll
        d-hmx464
        d-bar8
        d-ba
        d-bc-subtle
      "
    >
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
    </div>
    <div class="dialtone-doc-table-clamped__more">
      <dt-button
        class="dialtone-doc-table-clamped__more-btn"
        kind="muted"
        importance="outlined"
        icon-position="right"
        size="sm"
      >
        Show all
        <template #icon>
          <dt-icon name="arrow-down" size="100" />
        </template>
      </dt-button>
    </div>
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

<style scoped lang="less">
.dialtone-doc-table-clamped {
  position: relative;

  &__more {
    background-color: var(--dt-color-surface-secondary);
    position: absolute;
    bottom: -16px;
    left: 50%;
    transform: translateX(-50%);
  }
  &__more-btn {
    box-shadow: var(--dt-shadow-medium);
  }
}
</style>
