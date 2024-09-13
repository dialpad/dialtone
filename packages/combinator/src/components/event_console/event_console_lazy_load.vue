<template>
  <span>
    <span v-if="!show">
      <slot name="prefix" />
      <dt-button
        class="dtc-theme__button dtc-theme__interactive d-p4"
        size="sm"
        importance="clear"
        @click="toggle"
      >
        <template #icon>
          <IconExpand />
        </template>
      </dt-button>
      <slot name="suffix" />
    </span>
    <span v-else>
      <dt-button
        class="dtc-theme__button dtc-theme__interactive d-p0"
        size="xl"
        importance="clear"
        @click="toggle"
      >
        <template #icon>
          <IconCollapse />
        </template>
      </dt-button>
    </span>
    <dt-lazy-show :show="show">
      <slot />
    </dt-lazy-show>
  </span>
</template>

<script setup>
import IconExpand from 'dialtone-icons/IconMenuHorizontal';
import IconCollapse from 'dialtone-icons/IconArrowAccordion';

import { DtButton, DtLazyShow } from '@dialpad/dialtone-vue';

import { ref } from 'vue';

const emit = defineEmits(['toggle']);

const show = ref(false);

function toggle () {
  show.value = !show.value;
  emit('toggle', show.value);
}
</script>

<script>
/**
 * The lazy load provides generic functionality to not render content until the expand button is pressed.
 */
export default {
  name: 'DtcEventConsoleLazyLoad',
};
</script>
