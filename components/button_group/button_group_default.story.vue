<template>
  <dt-button-group
    :alignment="$attrs.alignment"
  >
    <html-fragment
      v-if="defaultSlot"
      :html="defaultSlot"
    />
    <template v-else>
      <dt-button
        class="d-mr6"
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
