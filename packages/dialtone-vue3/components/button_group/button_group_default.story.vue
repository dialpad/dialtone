<template>
  <dt-button-group
    :alignment="$attrs.alignment"
    class="d-gg8"
  >
    <html-fragment
      v-if="defaultSlot"
      :html="defaultSlot"
    />
    <template v-else-if="$attrs.alignment === 'end'">
      <dt-button
        importance="outlined"
      >
        Cancel
      </dt-button>
      <dt-button
        importance="primary"
      >
        Confirm
      </dt-button>
    </template>
    <template v-else>
      <dt-button
        importance="primary"
      >
        Confirm
      </dt-button>
      <dt-button
        importance="outlined"
      >
        Cancel
      </dt-button>
    </template>
  </dt-button-group>
</template>

<script>
import DtButtonGroup from './button_group.vue';
import { DtButton } from '../button';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtButtonGroupDefault',
  components: { DtButtonGroup, DtButton, htmlFragment },
};
</script>
