<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-chip
    :id="$attrs.id"
    :hide-close="$attrs.hideClose"
    :interactive="$attrs.interactive"
    :size="$attrs.size"
    :aria-label="$attrs.ariaLabel"
    :content-class="$attrs.contentClass"
    @click="$attrs.onClick"
    @close="$attrs.onClose"
  >
    <template
      v-if="$attrs.icon"
      #icon
    >
      <dt-icon
        :name="$attrs.icon"
        :size="iconSize"
      />
    </template>
    <template
      v-else-if="$attrs.avatar"
      #avatar
    >
      <dt-avatar
        :full-name="$attrs.avatar"
        :seed="$attrs.avatarSeed"
      />
    </template>
    <v-html :html="defaultSlot" />
  </dt-chip>
</template>

<script>
import DtChip from './chip.vue';
import { CHIP_ICON_SIZES } from './chip_constants.js';
import { DtIcon } from '@/components/icon';
import { DtAvatar } from '@/components/avatar';
import VHtml from '@/common/v_html';

export default {
  name: 'DtChipDefault',
  components: { DtAvatar, DtChip, DtIcon, VHtml },
  computed: {
    iconSize () {
      return CHIP_ICON_SIZES[this.$attrs.size];
    },
  },
};
</script>
