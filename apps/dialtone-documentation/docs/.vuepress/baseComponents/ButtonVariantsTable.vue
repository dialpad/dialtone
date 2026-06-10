<script setup>
import { inject } from 'vue';

// Provided by registerDialtoneVue via app.provide('dialtoneConstants', ...).
// Available in both SSR and client; falls back to empty object when not yet set.
const CONSTANTS = inject('dialtoneConstants', {});

const kindModifiers = Object.keys(CONSTANTS.BUTTON_KIND_MODIFIERS ?? {});
const importanceModifiers = Object.keys(CONSTANTS.BUTTON_IMPORTANCE_MODIFIERS ?? {});

const importanceDescriptions = {
  clear: 'Default level of importance. Typically used for secondary or minimally important actions.',
  outlined: 'Slightly more important than clear, presenting a contrasting border and transparent background.',
  primary: 'Highest level of importance, presenting a solid background color.',
};
const kindDescriptions = {
  default: 'Default button colors.',
  critical: 'Potentially destructive or otherwise critical actions.',
  positive: 'Used to communicate positive, confirmatory, or success-related actions.',
  inverted: 'Use for placement on non-white, dark backgrounds.',
  muted: 'For non-primary actions and contexts where base style may not work.',
  unstyled: 'Raw button devoid of any style.',
};
</script>

<template>
  <table class="d-table dialtone-doc-table d-mbe-200">
    <colgroup>
      <col>
      <col class="d-w25p">
      <col class="d-w25p">
      <col class="d-w25p">
    </colgroup>
    <thead>
      <tr>
        <th class="d-ta-left d-va-top" aria-hidden="true" />
        <th v-for="importance in importanceModifiers" :key="importance" class="d-ta-left d-va-top">
          <div class="d-mbe-75 d-tt-uppercase">
            {{ importance }}
          </div>
          <dt-text kind="body" :size="200" density="200" tone="tertiary" class="d-tt-none">
            {{ importanceDescriptions[importance] }}
          </dt-text>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="kind in kindModifiers" :key="kind">
        <th class="d-ta-left d-pis-0" scope="row">
          <a class="d-link d-fs-100 d-fw-medium d-d-block d-mbe-50 d-tt-uppercase" :href="`#${kind}`">
            <strong>{{ kind }}</strong>
          </a>
          <dt-text kind="body" :size="200" density="200">
            {{ kindDescriptions[kind] }}
          </dt-text>
        </th>
        <td
          v-for="importance in importanceModifiers"
          :key="importance"
          :class="[
            'd-ta-center',
            { 'd-bgc-contrast': kind === 'inverted' },
          ]"
        >
          <span v-if="kind === 'unstyled'">N/A</span>
          <dt-button v-else-if="importance !== 'primary' || kind !== 'muted'" :importance="importance" :kind="kind">
            Place call
          </dt-button>
          <span v-else>N/A</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
