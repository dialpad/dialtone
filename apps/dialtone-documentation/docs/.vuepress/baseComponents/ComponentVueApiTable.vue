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
            v-for="item in sortedTableDataByName"
            :key="item.name"
            class="d-va-baseline"
          >
            <th scope="row">
              <dt-stack gap="300">
                <dt-text as="code" kind="code" size="xs" class="d-docsite-code">
                  {{ item.name }}
                </dt-text>
                <dt-text
                  v-if="item.required"
                  tone="critical"
                  strength="normal"
                >
                  required
                </dt-text>
                <span v-if="item.deprecated">
                  <dt-badge
                    type="critical"
                    kind="label"
                    text="Deprecated"
                  />
                </span>
              </dt-stack>
            </th>

            <td v-if="withDefault">
              <dt-text v-if="item.defaultValue" as="code" kind="code" size="xs" class="d-docsite-code">
                {{ item.defaultValue }}
              </dt-text>
            </td>

            <td class="vue-api-table">
              <dt-stack gap="350">
                <dt-stack
                  v-if="item.values"
                  direction="row"
                  align="baseline"
                  class="d-fw-wrap"
                  gap="350"
                >
                  <template
                    v-for="(value, index) in item.values"
                    :key="`${item.name} ${value}`"
                  >
                    <dt-text v-if="index > 0" tone="muted" as="span" kind="body" size="xs">
                      |
                    </dt-text>
                    <dt-text as="code" kind="code" size="xs" class="d-docsite-code">
                      "{{ value }}"
                    </dt-text>
                  </template>
                </dt-stack>
                <dt-text v-else-if="item.type" as="code" kind="code" size="xs" class="d-docsite-code">
                  {{ item.type }}
                </dt-text>
                <dt-text
                  v-if="item.description"
                  as="p"
                  kind="body"
                  size="sm"
                  wrap="balance"
                >
                  <markdown-render
                    :markdown="item.description"
                  />
                </dt-text>
                <dt-text
                  v-if="item.deprecated && item.deprecatedMessage"
                  as="p"
                  kind="body"
                  size="sm"
                  tone="critical"
                >
                  {{ item.deprecatedMessage }}
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
    const aIsDeprecated = !!a.deprecated;
    const bIsDeprecated = !!b.deprecated;

    // Required first, deprecated last, then alphabetical
    if (aIsRequired !== bIsRequired) return aIsRequired ? -1 : 1;
    if (aIsDeprecated !== bIsDeprecated) return aIsDeprecated ? 1 : -1;
    if (a[nameKey] < b[nameKey]) return -1;
    if (a[nameKey] > b[nameKey]) return 1;
    return 0;
  });
};
</script>
