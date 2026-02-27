<template>
  <dt-stack
    gap="500"
    class="d-px8"
  >
    <h2>Variants</h2>
    <table class="d-table d-bt d-bb d-bbw2">
      <thead>
        <tr>
          <td class="d-ba d-bc-default">
            &nbsp;
          </td>
          <th
            v-for="importance in importanceList"
            :key="importance"
            class="d-ta-center d-br"
          >
            {{ importance }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="kind in variantKinds"
          :key="kind"
        >
          <th
            class="d-ta-right d-ba d-brw2"
            scope="row"
          >
            <span
              class="d-headline--eyebrow"
              v-text="kind"
            />
          </th>
          <td
            v-for="importance in importanceList"
            :key="`${kind}-${importance}`"
            class="d-ta-center d-br d-bc-default"
          >
            <abbr
              v-if="isInvalidCombination({ kind, importance })"
              class="d-td-none d-fs-100"
              title="Not applicable"
            >N/A</abbr>
            <dt-button
              v-else
              :kind="kind"
              :importance="importance"
            >
              Place Call
            </dt-button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Unstyled -->
    <h2>Unstyled</h2>
    <div>
      <dt-button kind="unstyled">
        Unstyled
      </dt-button>
    </div>

    <!-- Sizes -->
    <h2>Sizes</h2>
    <dt-stack
      direction="row"
      gap="400"
    >
      <dt-button
        v-for="size in sizes"
        :key="size"
        :size="size"
      >
        {{ size }}
      </dt-button>
    </dt-stack>

    <!-- Icon positions -->
    <h2>Icon positions</h2>
    <dt-stack
      direction="row"
      gap="400"
    >
      <dt-button
        v-for="position in iconPositions"
        :key="position"
        :icon-position="position"
      >
        <template #icon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
        {{ position }}
      </dt-button>
      <!-- Circle -->
      <dt-button
        importance="outlined"
        circle
        aria-label="Icon only"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
      </dt-button>
      <!-- Icon only -->
      <dt-button aria-label="Icon only">
        <template #startIcon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
      </dt-button>

      <!-- Icon Left -->
      <dt-button>
        <template #startIcon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
        Icon Left
      </dt-button>

      <!-- Icon Right -->
      <dt-button>
        <template #endIcon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
        Icon Right
      </dt-button>

      <!-- Icon Top -->
      <dt-button>
        <template #blockStartIcon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
        Icon Top
      </dt-button>

      <!-- Icon Bottom -->
      <dt-button>
        <template #blockEndIcon="{ iconSize }">
          <dt-icon
            name="download"
            :size="iconSize"
          />
        </template>
        Icon Bottom
      </dt-button>
    </dt-stack>
    <div class="d-flow8">
      <!-- Loading -->
      <dt-button loading>
        Button
      </dt-button>
    </div>

    <!-- Link -->
    <h2>Link</h2>
    <div>
      <dt-button link>
        Link Button
      </dt-button>
    </div>

    <!-- Active -->
    <h2>Active</h2>
    <dt-stack
      direction="row"
      gap="400"
    >
      <dt-button active>
        Active button
      </dt-button>
      <dt-button
        active
        kind="danger"
      >
        Active Danger button
      </dt-button>
      <dt-button
        active
        kind="positive"
      >
        Active Positive button
      </dt-button>
    </dt-stack>

    <!-- Disabled -->
    <h2>Disabled</h2>
    <table class="d-table d-bt d-bb d-bbw2">
      <thead>
        <tr>
          <td class="d-ba d-bc-default">
            &nbsp;
          </td>
          <th
            v-for="importance in importanceList"
            :key="importance"
            class="d-ta-center d-br"
          >
            {{ importance }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="kind in disabledKinds"
          :key="kind"
        >
          <th
            class="d-ta-right d-ba d-brw2"
            scope="row"
          >
            <span
              class="d-headline--eyebrow"
              v-text="kind"
            />
          </th>
          <td
            v-for="importance in importanceList"
            :key="`disabled-${kind}-${importance}`"
            class="d-ta-center d-br d-bc-default"
          >
            <abbr
              v-if="isInvalidCombination({ kind, importance })"
              class="d-td-none d-fs-100"
              title="Not applicable"
            >N/A</abbr>
            <dt-button
              v-else
              :kind="kind"
              :importance="importance"
              disabled
            >
              {{ kind }} / {{ importance }}
            </dt-button>
          </td>
        </tr>
      </tbody>
    </table>
  </dt-stack>
</template>

<script>
import DtButton from './button.vue';
import { DtIcon } from '@/components/icon';
import DtStack from '../stack/stack.vue';
import {
  BUTTON_IMPORTANCE_MODIFIERS,
  BUTTON_KIND_MODIFIERS,
  BUTTON_SIZE_MODIFIERS,
  ICON_POSITION_MODIFIERS,
  INVALID_COMBINATION,
} from './button_constants';

export default {
  name: 'ButtonVariants',
  components: { DtButton, DtIcon, DtStack },

  data () {
    return {
      sizes: Object.keys(BUTTON_SIZE_MODIFIERS),
      importanceList: Object.keys(BUTTON_IMPORTANCE_MODIFIERS),
      iconPositions: Object.keys(ICON_POSITION_MODIFIERS),
      variantKinds: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'unstyled' && k !== 'inverted'),
      disabledKinds: Object.keys(BUTTON_KIND_MODIFIERS).filter(k => k !== 'unstyled' && k !== 'inverted'),
    };
  },

  methods: {
    isInvalidCombination ({ kind, importance }) {
      return INVALID_COMBINATION.some(c =>
        !c.circle && c.kind === kind && c.importance === importance,
      );
    },
  },
};
</script>
