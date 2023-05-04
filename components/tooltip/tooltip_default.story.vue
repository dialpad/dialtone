<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
<template>
  <div
    :class="[
      'd-fl-center d-fd-column d-pt64',
      {
        'd-bgc-purple-600 d-pb64': $attrs.inverted,
      },
    ]"
  >
    <div class="d-pt16">
      <dt-tooltip
        :id="$attrs.id"
        :placement="$attrs.placement"
        :inverted="$attrs.inverted"
        :message="$attrs.message"
        :fallback-placements="$attrs.fallbackPlacements"
        :offset="$attrs.offset"
        :sticky="$attrs.sticky"
        :content-class="$attrs.contentClass"
        :content-appear="$attrs.contentAppear"
        :transition="$attrs.transition"
        :show.sync="$attrs.show"
        :delay="delay"
        @shown="$attrs.onShown"
      >
        <template #anchor>
          <dt-button
            importance="outlined"
            :kind="buttonKind"
          >
            {{ $attrs.anchor }}
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
import DtTooltip from './tooltip.vue';
import { DtButton } from '../button';

export default {
  name: 'TooltipDefault',
  components: {
    DtTooltip,
    DtButton,
  },

  inheritAttrs: false,

  computed: {
    buttonKind () {
      return this.$attrs.inverted ? 'inverted' : 'default';
    },
  },
};
</script>
