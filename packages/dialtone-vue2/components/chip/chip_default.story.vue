<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-chip
    :id="$attrs.id"
    :hide-close="$attrs.hideClose"
    :close-button-props="$attrs.closeButtonProps"
    :aria-label="$attrs.ariaLabel"
    :interactive="$attrs.interactive"
    :size="$attrs.size"
    :content-class="$attrs.contentClass"
    @click="$attrs.onClick"
    @close="$attrs.onClose"
  >
    <template
      v-if="$attrs.icon"
      slot="icon"
    >
      <dt-icon
        :name="$attrs.icon"
        :size="iconSize"
      />
    </template>
    <template
      v-else-if="$attrs.avatar"
      slot="avatar"
    >
      <dt-avatar
        :full-name="$attrs.avatar"
        :seed="$attrs.avatarSeed"
      />
    </template>
    <span
      v-if="$attrs.default"
      v-html="$attrs.default"
    />
  </dt-chip>
</template>

<script>
import DtChip from './chip.vue';
import { DtIcon } from '@/components/icon';
import { CHIP_ICON_SIZES } from '@/components/chip/chip_constants';
import DtAvatar from '@/components/avatar/avatar.vue';

export default {
  name: 'DtChipDefault',
  components: { DtAvatar, DtChip, DtIcon },
  computed: {
    iconSize () {
      return CHIP_ICON_SIZES[this.size];
    },
  },
};
</script>
