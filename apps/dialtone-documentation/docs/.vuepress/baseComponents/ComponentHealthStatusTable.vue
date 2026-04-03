<template>
  <dt-stack gap="200" direction="row" class="d-bgc-secondary d-p-200 d-py-100 d-bar8 d-ba d-bc-subtle d-my-200">
    <dt-stack direction="row" gap="100">
      <dt-icon
        class="d-fc-success"
        name="check-circle"
        size="300"
      />
      <dt-text kind="label" strength="medium">
        Ready
      </dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="100">
      <dt-icon
        class="d-fc-warning"
        name="tools"
        size="300"
      />
      <dt-text kind="label" strength="medium">
        In progress
      </dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="100">
      <dt-icon
        class="d-fc-critical"
        name="box-select"
        size="300"
      />
      <dt-text kind="label" strength="medium">
        Planned
      </dt-text>
    </dt-stack>
    <dt-stack direction="row" gap="100">
      <dt-icon
        class="d-fc-muted"
        name="box"
        size="300"
      />
      <dt-text kind="label" strength="medium">
        N/A
      </dt-text>
    </dt-stack>
  </dt-stack>
  <table class="d-table">
    <thead>
      <tr>
        <th scope="col">
          Component
        </th>
        <th scope="col">
          CSS
        </th>
        <th scope="col">
          Vue
        </th>
        <th scope="col">
          Figma
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="component in componentsStatus"
        :key="component.name"
      >
        <th scope="row">
          <dt-link :to="component.url">
            {{ component.name }}
          </dt-link>
        </th>
        <td
          tabindex="0"
          :aria-label="`${component.name} CSS ${component.css}`"
        >
          <dt-icon
            :class="statusColor[component.css]"
            :name="statusIcon[component.css]"
          />
        </td>
        <td
          tabindex="0"
          :aria-label="`${component.name} VUE ${component.vue}`"
        >
          <dt-icon
            :class="statusColor[component.vue]"
            :name="statusIcon[component.vue]"
          />
        </td>
        <td
          tabindex="0"
          :aria-label="`${component.name} FIGMA ${component.figma}`"
        >
          <dt-icon
            :class="statusColor[component.figma]"
            :name="statusIcon[component.figma]"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  componentsStatus: {
    type: Array,
    default: () => [],
  },
});
const statusIcon = {
  Ready: 'check-circle',
  'In progress': 'tools',
  Planned: 'box-select',
  'N/A': 'box',
};
const statusColor = {
  Ready: 'd-fc-success',
  'In progress': 'd-fc-warning',
  Planned: 'd-fc-critical',
  'N/A': 'd-fc-muted',
};
</script>
