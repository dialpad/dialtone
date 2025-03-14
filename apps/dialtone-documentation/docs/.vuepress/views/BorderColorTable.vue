<template>
  <table class="d-table dialtone-doc-table">
    <thead>
      <tr>
        <th scope="col" colspan="2">
          Color
        </th>
        <th scope="col">
          CSS variable
        </th>
        <th scope="col">
          CSS utility
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(border) in borders" :key="border.name">
        <th scope="row" class="d-pr0" colspan="2">
          <div class="d-d-flex d-ai-center d-gg16">
            <div
              :class="[
                'd-d-inline-flex d-p4 d-bar-pill',
                { 'd-bgc-contrast': border.utilityClass.includes('inverted') },
              ]"
            >
              <div :class="`d-bar-circle d-w42 d-h42 d-ba d-bas-solid d-baw4 ${border.utilityClass}`" />
            </div>
            <span class="d-lh-300 d-tt-capitalize" v-text="border.name" />
          </div>
        </th>
        <td class="d-code--sm d-docsite-code" v-text="border.token" />
        <td class="d-code--sm d-docsite-code" v-text="border.utilityClass" />
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { inject } from 'vue';
import { colorSorter, extractCSSVariableName } from '@utilities';
const utilityClassDocs = inject('utilityClassDocs');

const borders = Object.keys(utilityClassDocs)
  .filter(border => border.startsWith('d-bc-'))
  .sort(colorSorter)
  .reduce((result, border) => {
    result.add({
      name: border.replace('d-bc-', '').replace(/-/g, ' '),
      token: extractCSSVariableName(utilityClassDocs[border]),
      utilityClass: border,
    });
    return result;
  }, new Set());

defineOptions({
  name: 'BorderColorTable',
});
</script>
