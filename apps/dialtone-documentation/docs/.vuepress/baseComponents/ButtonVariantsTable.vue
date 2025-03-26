<script setup>
console.log(window.DIALTONE_CONSTANTS);

const kindModifiers = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_KIND_MODIFIERS);
const importanceModifiers = Object.keys(window.DIALTONE_CONSTANTS.BUTTON_IMPORTANCE_MODIFIERS);

const importanceDescriptions = {
  clear: 'Default level of importance. Typically used for secondary or minimally important actions.',
  outlined: 'Slightly more important than clear, presenting a contrasting border and transparent background.',
  primary: 'Highest level of importance, presenting a solid background color.',
};
const kindDescriptions = {
  default: 'Our default button colors.',
  danger: 'Potentially destructive or otherwise critical actions.',
  positive: 'Used to communicate positive actions.',
  inverted: 'Use for placement on non-white, dark backgrounds.',
  muted: 'For non-primary actions and contexts where base style may not work.',
};
</script>

<template>
  <table class="d-table dialtone-doc-table d-mb16">
    <colgroup>
      <col>
      <col class="d-w25p">
      <col class="d-w25p">
      <col class="d-w25p">
    </colgroup>
    <thead>
      <tr>
        <th class="d-ta-left d-va-top" />
        <th v-for="importance in importanceModifiers" :key="importance" class="d-ta-left d-va-top">
          {{ importance }}
          <div class="d-fw-normal d-tt-none d-fs-200 d-lh-200">
            {{ importanceDescriptions[importance] }}
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="kind in kindModifiers" :key="kind">
        <th class="d-ta-left d-pl0" scope="row">
          <a class="d-link d-fs-100 d-fw-medium d-d-block d-mb4 d-tt-uppercase" :href="`#${kind}`">
            <strong>{{ kind }}</strong>
          </a>
          <div class="d-fw-normal d-lh-200">
            {{ kindDescriptions[kind] }}
          </div>
        </th>
        <td
          v-for="importance in importanceModifiers"
          :key="importance"
          :class="[
            'd-ta-center',
            { 'd-bgc-contrast': kind === 'inverted' },
          ]"
        >
          <dt-button v-if="importance !== 'primary' || kind !== 'muted'" :importance="importance" :kind="kind">
            Place call
          </dt-button>
          <span v-else>N/A</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
