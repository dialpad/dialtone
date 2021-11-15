<template>
  <div
    :class="[
      'd-fl-center d-fd-column d-pt64',
      {
        'd-bgc-purple-800 d-pb64': inverted,
      },
    ]"
  >
    <div class="d-pt32">
      <dt-tooltip
        :id="id"
        :message="message"
        :arrow-direction="arrowDirection"
        :show="show"
        :inverted="inverted"
        :hover="hover"
      >
        <template v-if="defaultSlot">
          {{ defaultSlot }}
        </template>
        <template #anchor>
          <dt-button
            importance="outlined"
            :kind="buttonKind"
          >
            {{ anchor }}
          </dt-button>
        </template>
      </dt-tooltip>
    </div>
  </div>
</template>

<script>
import { DtTooltip } from './';
import { DtButton } from '../button';

export default {
  name: 'DtTooltipDefault',

  components: { DtTooltip, DtButton },

  computed: {
    buttonKind () {
      return this.inverted ? 'inverted' : 'default';
    },
  },
};
</script>
