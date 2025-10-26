<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th
              scope="col"
              class="d-w40p d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Item
              </div>
            </th>
            <th
              scope="col"
              class="d-w30p d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Applies to
              </div>
            </th>
            <th
              scope="col"
              class="d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bc-default d-bbw1">
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
  </clamped-table-wrapper>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import ClampedTableWrapper from './ClampedTableWrapper.vue';

defineOptions({
  name: 'ComponentAccessibleTable',
});

const { componentName } = defineProps({
  componentName: {
    type: String,
    required: true,
  },
});

const accessible = ref(null);

onBeforeMount(async () => {
  const module = await import(`../../_data/${componentName}.json`);
  accessible.value = module.accessible;
});
</script>
