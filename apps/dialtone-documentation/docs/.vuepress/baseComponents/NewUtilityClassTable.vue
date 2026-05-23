<template>
  <clamped-table-wrapper>
    <div>
      <table class="d-table dialtone-doc-table d-fc-primary">
        <thead class="d-bgc-default d-ps-sticky d-zi-base1 d-ibs-0">
          <tr>
            <th class="d-w25p d-p-0 d-bbw0" scope="col">
              <div class="d-p-200 d-bb d-bbw1">
                Class
              </div>
            </th>
            <th class="d-p-0 d-bbw0" scope="col">
              <div class="d-p-200 d-bb d-bbw1">
                Output
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="{ className, output, deprecated } in enrichedClasses"
            :key="className"
          >
            <th scope="row">
              <dt-stack direction="row" align="center" gap="100" class="d-fw-wrap">
                <dt-text as="span" kind="code" :size="100" class="d-docsite-code">
                  {{ className }}
                </dt-text>
                <dt-badge v-if="deprecated" type="critical" class="d-ff-sans">
                  Deprecated
                </dt-badge>
              </dt-stack>
            </th>
            <td class="d-ws-break-spaces">
              <dt-stack direction="row" justify="between" align="center" gap="200">
                <dt-text as="span" kind="code" :size="100" class="d-fl-grow1">
                  {{ output }}
                </dt-text>
                <slot name="example" :class-name="className" />
              </dt-stack>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </clamped-table-wrapper>
</template>

<script setup>
import { computed } from 'vue';
import ClampedTableWrapper from './ClampedTableWrapper.vue';

defineOptions({
  name: 'NewUtilityClassTable',
});

const { classes } = defineProps({
  classes: {
    type: Object,
    required: true,
  },
});

// Substring patterns that mark a utility class as deprecated. Token-driven
// deprecation isn't yet plumbed through to utilityClassDocs, so this list is
// the source of truth for the auto-extracted tables. Add patterns as new
// renames land.
//   -success / -error / -danger : renamed semantic colors (DLT-3157, DLT-3331)
//   -inverted                    : deprecated in favor of the v-dt-mode directive
const DEPRECATED_SUBSTRINGS = ['-success', '-error', '-danger', '-inverted'];

// Base color utility classes (e.g. d-fc-red-600, d-bgc-black-1000) are
// deprecated in favor of semantic colors. Regex matches the same shape used
// by the eslint `deprecated-base-color-classes` rule and postcss-docs config.
const BASE_COLOR_PATTERN = /^d-(bgc|fc|bc|divide)-\w+-\d{2,4}$/;

function isDeprecated (className) {
  if (BASE_COLOR_PATTERN.test(className)) return true;
  return DEPRECATED_SUBSTRINGS.some(s => className.includes(s));
}

const enrichedClasses = computed(() =>
  Object.entries(classes).map(([className, output]) => ({
    className,
    output,
    deprecated: isDeprecated(className),
  })),
);
</script>
