<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
  <div
    id="forms-radio--variants-container"
    class="d-pt-200 d-px-800"
  >
    <dt-stack
      direction="row"
      justify="center"
      class="d-w100p d-mb-800 d-mt-400"
    >
      <dt-button
        id="external-tooltip-anchor"
        importance="outlined"
      >
        External anchor
      </dt-button>
    </dt-stack>
    <!-- Arrow Description -->
    <dt-stack
      v-for="(rowDirection, i) in TOOLTIP_DIRECTIONS"
      :key="i"
      direction="row"
      justify="center"
      align="center"
      class="d-mb-200"
    >
      <div
        v-for="direction in rowDirection"
        :key="direction"
      >
        <dt-tooltip
          v-if="direction !== null"
          :transition="$attrs.transition"
          :placement="direction"
          :message="localMessage"
          :show="$attrs.showTooltip"
          class="d-mx-800"
        >
          <template #anchor>
            <dt-button
              importance="outlined"
              class="d-w-200"
            >
              {{ direction }}
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </dt-stack>
    <dt-stack
      direction="row"
      justify="center"
      align="center"
      class="d-w100p"
    >
      <div id="circle-button-tooltip-label">
        Circle button tooltip
      </div>
      <dt-tooltip
        class="d-ml-50"
        :transition="transition"
        :message="localMessage"
        :show="$attrs.showTooltip"
      >
        <template #anchor>
          <dt-button
            aria-labelledby="circle-button-tooltip-label"
            circle
            importance="outlined"
          >
            <template #startIcon>
              <dt-icon
                name="dp-phone"
                size="300"
              />
            </template>
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
    <dt-stack
      direction="row"
      justify="center"
      class="d-w100p"
    >
      <!-- Text -->
      <dt-tooltip
        class="d-mb-800 d-mt-800"
        :transition="$attrs.transition"
        :message="localMessage"
        :show="$attrs.showTooltip"
      >
        <template #anchor>
          <dt-button link>
            Link Tooltip
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
    <dt-stack
      direction="row"
      justify="center"
      class="d-w100p"
    >
      <!-- Open state -->
      <dt-tooltip
        class="d-mb-800 d-mt-400"
        :transition="$attrs.transition"
        :message="localMessage"
        :show="show1"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            @click="show1 = !show1"
          >
            Open on click
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
    <dt-stack
      direction="row"
      justify="center"
      class="d-w100p"
    >
      <!-- Custom Theme -->
      <dt-tooltip
        class="d-mb-800 d-mt-400"
        theme="purple"
        :transition="$attrs.transition"
        :message="localMessage"
        :show="$attrs.showTooltip"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
          >
            Custom Theme
          </dt-button>
        </template>
      </dt-tooltip>
    </dt-stack>
    <dt-stack
      direction="row"
      justify="center"
      class="d-bgc-contrast d-pt-800"
    >
      <div class="d-py-800">
        <!-- Inverted state -->
        <dt-tooltip
          :inverted="true"
          :transition="$attrs.transition"
          :message="localMessage"
          :show="$attrs.showTooltip"
        >
          <template #anchor>
            <dt-button
              kind="inverted"
              importance="outlined"
            >
              Inverted
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </dt-stack>
    <dt-tooltip
      :transition="transition"
      external-anchor="#external-tooltip-anchor"
      :show="$attrs.showTooltip"
    >
      This is a tooltip with external anchor, the actual dt-tooltip component
      is at the end of this page
    </dt-tooltip>
  </div>
</template>

<script>
import DtTooltip from './tooltip.vue';
import { DtStack } from '@/components/stack';
import { DtButton } from './../button';
import { DtIcon } from './../icon';
import { TOOLTIP_DIRECTIONS } from './tooltip_constants';

function sliceIntoChunks (arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export default {
  name: 'TooltipVariants',
  components: { DtTooltip, DtIcon, DtButton, DtStack },
  data () {
    return {
      TOOLTIP_DIRECTIONS: sliceIntoChunks(this.$attrs.customDirections || TOOLTIP_DIRECTIONS, 3),

      localMessage: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
      show1: this.$attrs.showTooltip ?? false,
    };
  },
};
</script>

<style>
.tippy-box[data-theme~='purple'] > .tippy-svg-arrow {
  fill: var(--dt-color-purple-200);
}
.tippy-box[data-theme~='purple'] .d-tooltip {
  background-color: var(--dt-color-purple-200);
  color: var(--dt-color-foreground-primary);
}
</style>
