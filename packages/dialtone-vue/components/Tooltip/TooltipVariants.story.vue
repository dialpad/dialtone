<!-- eslint-disable vue/no-bare-strings-in-template -->
<template>
  <div
    id="forms-radio--variants-container"
    class="d-pbs-200 d-px-800"
  >
    <dt-stack
      direction="row"
      justify="center"
      class="d-w100p d-mbe-800 d-my-400"
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
      class="d-my-200"
    >
      <div
        v-for="direction in rowDirection"
        :key="direction"
        class="d-mx-100"
      >
        <dt-tooltip
          v-if="direction !== null"
          :transition="$attrs.transition"
          :placement="direction"
          :message="localMessage"
          :open="$attrs.showTooltip"
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
        class="d-mx-100"
        :transition="transition"
        :message="localMessage"
        :open="$attrs.showTooltip"
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
        class="d-my-100"
        :transition="$attrs.transition"
        :message="localMessage"
        :open="$attrs.showTooltip"
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
      gap="200"
      class="d-w100p d-pbs-800"
    >
      <!-- Without arrow -->
      <dt-tooltip
        class="d-my-100"
        :show-arrow="false"
        :transition="$attrs.transition"
        :message="i18n.$t('DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE')"
      >
        <template #anchor>
          <dt-button importance="outlined">
            {{ i18n.$t('DIALTONE_TOOLTIP_WITHOUT_ARROW_LABEL') }}
          </dt-button>
        </template>
      </dt-tooltip>
      <!-- Without arrow, bottom -->
      <dt-tooltip
        class="d-my-100"
        placement="bottom"
        :show-arrow="false"
        :transition="$attrs.transition"
        :message="i18n.$t('DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE')"
      >
        <template #anchor>
          <dt-button importance="outlined">
            {{ i18n.$t('DIALTONE_TOOLTIP_WITHOUT_ARROW_BOTTOM_LABEL') }}
          </dt-button>
        </template>
      </dt-tooltip>
      <!-- Without arrow, open -->
      <dt-tooltip
        class="d-my-100"
        placement="top"
        :show-arrow="false"
        :transition="$attrs.transition"
        :message="i18n.$t('DIALTONE_TOOLTIP_WITHOUT_ARROW_MESSAGE')"
        :open="true"
      >
        <template #anchor>
          <dt-button importance="outlined">
            {{ i18n.$t('DIALTONE_TOOLTIP_WITHOUT_ARROW_OPEN_LABEL') }}
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
        class="d-my-100"
        :transition="$attrs.transition"
        :message="localMessage"
        :open="show1"
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
        class="d-my-100"
        theme="purple"
        :transition="$attrs.transition"
        :message="localMessage"
        :open="$attrs.showTooltip"
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
      class="d-bgc-contrast d-py-100"
    >
      <div class="d-py-800">
        <!-- Inverted state -->
        <dt-tooltip
          :inverted="true"
          :transition="$attrs.transition"
          :message="localMessage"
          :open="$attrs.showTooltip"
        >
          <template #anchor>
            <dt-button
              v-dt-mode:invert
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
      :open="$attrs.showTooltip"
    >
      This is a tooltip with external anchor, the actual dt-tooltip component
      is at the end of this page
    </dt-tooltip>
  </div>
</template>

<script>
import DtTooltip from './Tooltip.vue';
import { DtStack } from '@/components/Stack';
import { DtButton } from './../Button';
import { DtIcon } from './../Icon';
import { TOOLTIP_DIRECTIONS } from './TooltipConstants';
import { DialtoneLocalization } from '@/localization';

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

      i18n: new DialtoneLocalization(),
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
