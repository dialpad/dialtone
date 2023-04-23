<template>
  <div class="d-m64">
    <div
      ref="container"
      class="container"
    >
      <div class="some-text" />
      <div class="some-text">
        <dt-tooltip
          :id="id"
          :placement="placement"
          class="tooltip"
          :fallback-placements="['right', 'bottom']"
          :offset="offset"
          :show="true"
        >
          <template
            slot="anchor"
            slot-scope="{ attrs }"
          >
            <dt-button
              importance="outlined"
              :kind="buttonKind"
              v-bind="attrs"
            >
              Click me to see a tooltip
            </dt-button>
          </template>
          <template slot="default">
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
import DtTooltip from './tooltip.vue';
import { DtButton } from '../button';

export default {
  name: 'TooltipFlip',
  components: {
    DtTooltip,
    DtButton,
  },

  computed: {
    buttonKind () {
      return this.inverted ? 'inverted' : 'default';
    },
  },

  mounted () {
    this.$refs.container.scrollTo(0, this.$refs.container.scrollHeight / 3);
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
  background-color: var(--black-050);
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
