<template>
  <dt-recipe-callbar-button
    :id="$attrs.id"
    :active="$attrs.active"
    :aria-label="$attrs.ariaLabel"
    :circle="$attrs.circle"
    :importance="$attrs.importance"
    :disabled="$attrs.disabled"
    :danger="$attrs.danger"
    :button-class="$attrs.buttonClass"
    :text-class="$attrs.textClass"
    :button-width-size="$attrs.buttonWidthSize"
    @click="$attrs.onClick"
  >
    <template
      v-if="$attrs.tooltip"
      #tooltip
    >
      <span v-html="$attrs.tooltip" />
    </template>

    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />

    <template
      v-if="$attrs.icon"
      #icon
    >
      <dt-icon :name="$attrs.icon" />
    </template>
  </dt-recipe-callbar-button>
</template>

<script>
import DtRecipeCallbarButton from './callbar_button.vue';
import { DtIcon } from '@/components/icon';

export default {
  name: 'DtRecipeCallbarButtonDefault',
  components: { DtRecipeCallbarButton, DtIcon },
};
</script>
