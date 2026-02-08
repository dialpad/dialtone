<template>
  <h3
    class="d-docsite--header-3"
    v-text="categoryName"
  />

  <clamped-table-wrapper>
    <div>
      <table
        class="d-table dialtone-doc-table d-wmn512"
      >
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th
              scope="col"
              class="d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bbw1">
                Name
              </div>
            </th>
            <th
              v-if="withDefault"
              scope="col"
              class="d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bbw1">
                Default
              </div>
            </th>
            <th
              scope="col"
              class="vue-api-table d-p0 d-bbw0"
            >
              <div class="d-p16 d-bb d-bbw1">
                Type
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="({ name, description, type, defaultValue, values, required }) in sortedTableDataByName"
            :key="name"
            class="d-va-baseline"
          >
            <th scope="row">
              <dt-stack gap="300">
                <code class="d-code--sm d-docsite-code">
                  {{ name }}
                </code>
                <div
                  v-if="required"
                  class="d-fc-critical d-fw-normal"
                >
                  required
                </div>
              </dt-stack>
            </th>

            <td v-if="withDefault">
              <code v-if="defaultValue" class="d-code--sm d-docsite-code">
                {{ defaultValue }}
              </code>
            </td>

            <td class="vue-api-table">
              <dt-stack gap="350">
                <dt-stack
                  v-if="values"
                  direction="row"
                  align="baseline"
                  class="d-fw-wrap"
                  gap="350"
                >
                  <template
                    v-for="(value, index) in values"
                    :key="`${name} ${value}`"
                  >
                    <dt-text v-if="index > 0" tone="muted" as="span" kind="body" size="xs">
                      |
                    </dt-text>
                    <code class="d-code--sm d-docsite-code">"{{ value }}"</code>
                  </template>
                </dt-stack>
                <span v-else-if="type">
                  <code class="d-code--sm d-docsite-code">
                    {{ type }}
                  </code>
                </span>
                <dt-text
                  v-if="description"
                  as="p"
                  kind="body"
                  size="sm"
                  wrap="balance"
                >
                  <markdown-render
                    :markdown="description"
                  />
                </dt-text>
              </dt-stack>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </clamped-table-wrapper>
</template>

<script setup>
import MarkdownRender from '@baseComponents/MarkdownRender.vue';
import { computed } from 'vue';
import ClampedTableWrapper from './ClampedTableWrapper.vue';

const props = defineProps({
  categoryName: {
    type: String,
    required: true,
  },
  tableData: {
    type: Object,
    required: true,
  },
});

// boolean that determines if the tableData object has a default slot value to add that column in the table
const withDefault = computed(() => {
  return props.tableData.some((item) => item.defaultValue);
});

const sortedTableDataByName = computed(() => {
  if (!props.tableData) return null;

  return sortDataByKey([...props.tableData], 'name', 'required');
});

const sortDataByKey = (data, nameKey, requiredKey) => {
  return data.sort((a, b) => {
    const aIsRequired = !!a[requiredKey];
    const bIsRequired = !!b[requiredKey];

    // always have required at top
    if (aIsRequired && !bIsRequired) {
      return -1;
    } else if (!aIsRequired && bIsRequired) {
      return 1;
    } else {
      if (a[nameKey] < b[nameKey]) return -1;
      if (a[nameKey] > b[nameKey]) return 1;
    }
    return 0;
  });
};
</script>
