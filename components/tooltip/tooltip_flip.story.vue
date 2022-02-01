<template>
  <div class="d-m64">
    <div
      ref="container"
      class="container"
    >
      <div class="some-text" />
      <div class="some-text">
        <dt-tooltip
          v-if="parentNode"
          :id="id"
          arrow-direction="top"
          class="tooltip"
          :flip-boundary="parentNode"
          :flip="flip"
          :offset="offset"
          :append-to="appendTo"
          :interactive="interactive"
          :interactive-border="interactiveBorder"
          trigger="click"
          hide-on-click="toggle"
          :show="show"
        >
          <template #anchor="{ attrs }">
            <dt-button
              importance="outlined"
              :kind="buttonKind"
              v-bind="attrs"
            >
              Click me to see a tooltip
            </dt-button>
          </template>
          <template #default>
            <div>
              {{ defaultSlot }}
            </div>
          </template>
        </dt-tooltip>
      </div>
      <div class="some-text" />
    </div>
  </div>
</template>

<script>
import DtTooltip from './tooltip';
import { DtButton } from '../button';

export default {
  name: 'TooltipFlip',
  components: {
    DtTooltip,
    DtButton,
  },

  data: () => ({
    parentNode: null,
  }),

  computed: {
    buttonKind () {
      return this.inverted ? 'inverted' : 'default';
    },
  },

  mounted () {
    this.parentNode = this.$refs.container;
  },
};
</script>

<style scoped lang="less">
.tooltip-holder {
  margin: 150px;
}

.container {
  position: relative;
  width: 800px;
  height: 300px;
  background-color: var(--black-025);
  padding: 10px;
  border-radius: 10px;
  overflow-y: scroll;
  overscroll-behavior: contain;
  border: 2px dashed #ff6b81;
}

.some-text {
  height: 400px;
  cursor: pointer;
  padding: 100px 10px 0;

}

.tooltip {
  margin-left: 4px;
}
</style>
