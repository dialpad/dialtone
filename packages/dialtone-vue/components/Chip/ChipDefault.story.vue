<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-chip
    :id="$attrs.id"
    :variant="$attrs.variant"
    :emphasis="$attrs.emphasis"
    :disabled="$attrs.disabled"
    :show-close="$attrs.showClose"
    :interactive="$attrs.interactive"
    :size="$attrs.size"
    :aria-label="$attrs.ariaLabel"
    :remove-button-aria-label="$attrs.removeButtonAriaLabel"
    :content-class="$attrs.contentClass"
    :leading-class="$attrs.leadingClass"
    :trailing-class="$attrs.trailingClass"
    :start-icon-class="$attrs.startIconClass"
    :start-avatar-class="$attrs.startAvatarClass"
    :end-icon-class="$attrs.endIconClass"
    @click="$attrs.onClick"
    @close="$attrs.onClose"
  >
    <template
      v-if="$attrs.startIcon"
      #startIcon
    >
      <dt-icon
        :name="$attrs.startIcon"
        :size="iconSize"
      />
    </template>
    <v-html :html="defaultSlot" />
    <template
      v-if="$attrs.endIcon"
      #endIcon
    >
      <dt-icon
        :name="$attrs.endIcon"
        :size="iconSize"
      />
    </template>
  </dt-chip>
</template>

<script>
import DtChip from './Chip.vue';
import { CHIP_ICON_SIZES } from './ChipConstants.js';
import { DtIcon } from '@/components/Icon';
import VHtml from '@/common/v_html';

export default {
  name: 'DtChipDefault',
  components: { DtChip, DtIcon, VHtml },
  computed: {
    iconSize () {
      return CHIP_ICON_SIZES[this.$attrs.size];
    },
  },
};
</script>
