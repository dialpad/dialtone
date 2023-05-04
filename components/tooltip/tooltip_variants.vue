<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
  <div
    id="forms-radio--variants-container"
    class="d-pt128 d-px64"
  >
    <!-- Arrow Description -->
    <div
      v-for="(rowDirection, i) in TOOLTIP_DIRECTIONS"
      :key="i"
      class="d-mb128 d-d-flex d-jc-center d-ai-center"
    >
      <div
        v-for="direction in rowDirection"
        :key="direction"
      >
        <dt-tooltip
          v-if="direction !== null"
          :transition="transition"
          :placement="direction"
          :message="localMessage"
          :show="show"
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
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Text -->
      <dt-tooltip
        class="d-mb64 d-mt64"
        :transition="transition"
        :message="localMessage"
        :show="show"
      >
        <template #anchor>
          <dt-button link>
            Link Tooltip
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
    <div class="d-d-flex d-jc-center d-w100p">
      <!-- Open state -->
      <dt-tooltip
        class="d-mb64 d-mt32"
        :transition="transition"
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
    </div>
    <div class="d-bgc-purple-600 d-pt64 d-d-flex d-jc-center">
      <div class="d-py64">
        <!-- Inverted state -->
        <dt-tooltip
          :inverted="true"
          :transition="transition"
          :message="localMessage"
          :show="show"
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
    </div>
  </div>
</template>

<script>
import DtTooltip from './tooltip.vue';
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
      TOOLTIP_DIRECTIONS: sliceIntoChunks(this.customDirections || TOOLTIP_DIRECTIONS, 3),

      localMessage: `This is a simple tooltip. The tooltip can be positioned in multiple areas too!`,
      show1: this.show ?? false,
    };
  },
};
</script>
