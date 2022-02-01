<template>
  <div
    id="forms-radio--variants-container"
    class="d-pt64 d-px64"
  >
    <!-- Arrow Description -->
    <div
      v-for="(rowDirection, i) in TOOLTIP_DIRECTIONS"
      :key="i"
      class="d-mb64 d-d-flex d-jc-center d-ai-center"
    >
      <dt-tooltip
        v-for="direction in rowDirection"
        :key="direction"
        :arrow-direction="direction"
        :message="localMessage"
        :offset="[0, 0]"
        class="d-mx64"
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
        :offset="[0, 0]"
      >
        <template #anchor>
          <span>{{ localAnchor }}</span>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Open state -->
      <dt-tooltip
        class="d-mb64 d-mt16"
        :message="localMessage"
        trigger="click"
        hide-on-click
        :offset="[0, 0]"
        show
      >
        <template #anchor>
          <dt-button
            importance="outlined"
          >
            {{ openDefaultState }}
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Open state -->
      <dt-tooltip
        class="d-mb64 d-mt16"
        :message="localMessage"
        trigger="click"
        hide-on-click="toggle"
        :offset="[0, 0]"
        show
      >
        <template #anchor>
          <dt-button
            importance="outlined"
          >
            {{ openDefaultState }}
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-bgc-purple-800 d-pt64 d-d-flex d-jc-center">
      <div class="d-py64">
        <!-- Inverted state -->
        <dt-tooltip
          show
          :inverted="true"
          trigger="click"
          :message="localMessage"
          hide-on-click="toggle"
          :offset="[0, 0]"
        >
          <template #anchor>
            <dt-button
              kind="inverted"
              importance="outlined"
            >
              {{ openInvertedState }}
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
  components: { DtTooltip, DtButton },
  data () {
    return {
      TOOLTIP_DIRECTIONS: sliceIntoChunks(TOOLTIP_DIRECTIONS, 3),
      localMessage: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
      localAnchor: 'Hover over me to see a tooltip',
      openDefaultState: 'Open default state on click',
      openInvertedState: 'Open inverted state on click',
    };
  },
};
</script>
