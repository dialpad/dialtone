<template>
  <h3
    class="d-docsite--header-3"
    v-text="categoryName"
  />
  <table
    class="d-table dialtone-doc-table d-wmn512"
  >
    <thead>
      <tr>
        <th
          scope="col"
        >
          Name
        </th>
        <th
          scope="col"
          class="vue-api-table"
        >
          Description
        </th>
        <th
          v-if="withDefault"
          scope="col"
        >
          Default
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="({ name, description, type, defaultValue, values, required }) in sortedTableDataByName"
        :key="name"
      >
        <th
          scope="row"
          class="d-ff-mono d-fc-purple-400 d-fw-normal d-fs-100"
        >
          <dt-stack gap="300">
            <div>{{ name }}</div>
            <div
              v-if="required"
              class="d-fc-critical"
            >
              required
            </div>
          </dt-stack>
        </th>

        <td
          class="d-lh-300 vue-api-table"
        >
          <dt-stack
            v-if="description"
            gap="400"
          >
            <markdown-render :markdown="description" />
            <span v-if="type">
              <span class="d-ff-mono d-fs-100 d-lh-300">Type:</span> <dt-badge>{{ type }}</dt-badge>
            </span>
            <dt-stack
              v-if="values"
              direction="row"
              class="d-ai-center d-fw-wrap"
              gap="300"
            >
              <span class="d-ff-mono d-fs-100 d-lh-300">Values:</span>
              <dt-badge
                v-for="value in values"

                :key="`${name} ${value}`"
              >
                {{ value }}
              </dt-badge>
            </dt-stack>
          </dt-stack>
        </td>
        <td
          v-if="withDefault"
          class="d-fs-100"
        >
          <dt-badge v-if="defaultValue">
            {{ defaultValue }}
          </dt-badge>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import MarkdownRender from '@baseComponents/MarkdownRender.vue';
import { computed } from 'vue';

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
  // eslint-disable-next-line complexity
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
