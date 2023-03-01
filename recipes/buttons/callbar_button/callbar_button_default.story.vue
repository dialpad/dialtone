<template>
  <dt-recipe-callbar-button
    :id="id"
    :active="active"
    :aria-label="ariaLabel"
    :circle="circle"
    :disabled="disabled"
    :danger="danger"
    :button-class="buttonClass"
    :button-width-size="buttonWidthSize"
    @click="onClick"
  >
    <template
      v-if="tooltip"
      slot="tooltip"
    >
      <span v-html="tooltip" />
    </template>

    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />

    <template
      v-if="icon"
      slot="icon"
    >
      <dt-icon :name="icon" />
    </template>
  </dt-recipe-callbar-button>
</template>

<script>
import DtRecipeCallbarButton from './callbar_button';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeCallbarButtonDefault',
  components: { DtRecipeCallbarButton, DtIcon },
};
</script>
