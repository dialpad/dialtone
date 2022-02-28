<template>
  <div
    :class="[
      'd-fl-center d-fd-column d-pt64',
      {
        'd-bgc-purple-800 d-pb64': inverted,
      },
    ]"
  >
    <div class="d-pt16">
      <dt-tooltip
        :id="id"
        :arrow-direction="arrowDirection"
        :inverted="inverted"
        :show="showSync"
        :message="message"
        :flip="flip"
        :offset="offset"
        :append-to="appendTo"
        :interactive="interactive"
        :content-class="contentClass"
        :flip-boundary="flipBoundary"
        :interactive-border="interactiveBorder"
        :trigger="trigger"
        :hide-on-click="hideOnClick"
        :transition="transition"
        @update:show="updateShow"
      >
        <template #anchor="{ attrs }">
          <dt-button
            importance="outlined"
            :kind="buttonKind"
            v-bind="attrs"
          >
            {{ anchor }}
          </dt-button>
        </template>
        <template v-if="defaultSlot">
          {{ defaultSlot }}
        </template>
      </dt-tooltip>
    </div>
  </div>
</template>

<script>
import DtTooltip from './tooltip';
import { DtButton } from '../button';

export default {
  name: 'TooltipDefault',
  components: {
    DtTooltip,
    DtButton,
  },

  inheritAttrs: false,

  data: () => ({
    showSync: false,
  }),

  computed: {
    buttonKind () {
      return this.inverted ? 'inverted' : 'default';
    },
  },

  watch: {
    show: {
      immediate: true,
      handler (show) {
        this.showSync = show;
      },
    },
  },

  methods: {
    updateShow (event) {
      this.showSync = event;
      this.onClose(event);
    },
  },
};
</script>
