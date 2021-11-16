<template>
  <div
    id="components-radio--variants-container"
    class="d-pt64 d-px64"
  >
    <!-- Arrow Description -->
    <div
      v-for="(rowDirection, i) in TOOLTIP_DIRECTION_MODIFIERS"
      :key="i"
      class="d-mb64 d-d-flex d-jc-space-between d-ai-center"
    >
      <dt-tooltip
        v-for="direction in rowDirection"
        :key="direction"
        :arrow-direction="direction"
        :message="localMessage"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            class="d-w128"
          >
            {{ direction }}
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Text -->
      <dt-tooltip
        class="d-mb64"
        :message="localMessage"
      >
        <template #anchor>
          {{ localAnchor }}
        </template>
      </dt-tooltip>
    </div>
    <div class="d-fd-column d-pt24 d-d-flex d-jc-center">
      <!-- Open state -->
      <dt-tooltip
        class="d-mb64 d-mt16"
        :show="true"
        :hover="false"
        :message="localMessage"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
          >
            Open default state
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-bgc-purple-800 d-pt64 d-d-flex d-jc-center">
      <div class="d-py64">
        <!-- Inverted state -->
        <dt-tooltip
          :show="true"
          :hover="false"
          :inverted="true"
          :message="localMessage"
        >
          <template #anchor>
            <dt-button
              kind="inverted"
              importance="outlined"
            >
              Open inverted state
            </dt-button>
          </template>
        </dt-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import DtTooltip from './tooltip';
import { DtButton } from './../button';
import { TOOLTIP_DIRECTION_MODIFIERS } from './tooltip_constants';

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
  components: { DtTooltip, DtButton },
  data () {
    return {
      TOOLTIP_DIRECTION_MODIFIERS: sliceIntoChunks(TOOLTIP_DIRECTION_MODIFIERS, 3),
      localMessage: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
      localAnchor: 'Hover over me to see a tooltip',
    };
  },
};
</script>
