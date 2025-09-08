<template>
  <div v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
    <div>
      <table class="d-table dialtone-doc-table d-fc-primary">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th class="d-w25p d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bbw1">
                Class
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bbw1">
                Output
              </div>
            </th>
          </tr>
        </thead>
        <slot name="content" />
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UtilityClassTable',
};
</script>
