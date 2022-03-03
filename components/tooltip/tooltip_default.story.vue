<!-- eslint-disable vue/no-deprecated-v-bind-sync -->
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
        :placement="placement"
        :inverted="inverted"
        :message="message"
        :fallback-placements="fallbackPlacements"
        :offset="offset"
        :content-class="contentClass"
        :transition="transition"
        :show.sync="show"
        @shown="onShown"
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

  computed: {
    buttonKind () {
      return this.inverted ? 'inverted' : 'default';
    },
  },
};
</script>
