<script setup>
import { inject } from 'vue';
import { extractCSSVariableName, sortUtilityClassesByCategory } from '@utilities';

const tokensDocs = inject('tokensDocs');
const utilityClassDocs = inject('utilityClassDocs');
const isBaseColorClass = (string) => /d-(bgc|fc|bc|bgg)-\w+-\d{2,4}$/.test(string);
const currentMode = inject('currentMode');

const props = defineProps({
  /**
   * List of colors to exclude from the table
   */
  excludedColors: {
    type: Array,
    default: () => [],
  },

  /**
   * Class prefix to filter the extracted docs
   */
  classPrefix: {
    type: String,
    required: true,
  },
});

/**
 *
 * @param excludedColors
 * @param classPrefix
 * @returns {object[]}
 */
function processColorsDocs (excludedColors, classPrefix) {
  // Get all utility classes that match the class prefix, are not excluded colors and are not base color classes
  let filteredClasses = Object.keys(utilityClassDocs)
    .filter(className =>
      className.startsWith(classPrefix) &&
      !excludedColors.some(color => className.includes(color)) &&
      !isBaseColorClass(className),
    );

  filteredClasses = sortUtilityClassesByCategory(filteredClasses);

  return Array.from(filteredClasses
    .reduce((result, color) => {
      const tokenName = extractCSSVariableName(utilityClassDocs[color]);
      const colorName = color.replace(classPrefix, '').replace(/-/g, ' ');
      const token = tokensDocs[tokenName]?.[`dp-${currentMode.value}`];

      result.add({
        name: colorName,
        tokenName,
        utilityClass: color,
        description: token?.description,
      });
      return result;
    }, new Set()));
}

const colors = processColorsDocs(props.excludedColors, props.classPrefix);
</script>

<template>
  <div v-if="colors.length" v-dt-scrollbar class="d-hmx464 d-bar8 d-ba d-bc-subtle">
    <div>
      <table class="d-table dialtone-doc-table">
        <thead class="d-bgc-primary d-ps-sticky d-zi-base1 d-t0">
          <tr>
            <th class="d-p0 d-bbw0" colspan="3" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                Color
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                CSS variable
              </div>
            </th>
            <th class="d-p0 d-bbw0" scope="col">
              <div class="d-p16 d-bb d-bc-default d-bbw1">
                CSS utility
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(color, index) in colors" :key="`${color.utilityClass}-${index}`">
            <th class="d-pr0" colspan="2" scope="row">
              <dt-stack direction="row" align="center" gap="500" data-migrate-outline>
                <slot :color="color" name="example" />
              </dt-stack>
            </th>
            <th class="d-lh-300" scope="row">
              <span class="d-tt-capitalize" v-text="color.name" />
              <span v-if="color.description" class="d-d-block d-fw-normal d-fs-100" v-text="color.description" />
            </th>
            <td class="d-code--sm d-docsite-code" v-text="color.tokenName ? `var(${color.tokenName})` : '-'" />
            <td class="d-code--sm d-docsite-code" v-text="color.utilityClass" />
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
