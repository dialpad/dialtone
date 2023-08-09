<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-chip
    :id="id"
    :hide-close="hideClose"
    :close-button-props="closeButtonProps"
    :aria-label="ariaLabel"
    :interactive="interactive"
    :size="size"
    :content-class="contentClass"
    @click="onClick"
    @close="onClose"
  >
    <template
      v-if="icon"
      slot="icon"
    >
      <dt-icon
        :name="icon"
        :size="iconSize"
      />
    </template>
    <template
      v-else-if="avatar"
      slot="avatar"
    >
      <dt-avatar
        :full-name="avatar"
        :seed="avatarSeed"
      />
    </template>
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
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
      return CHIP_ICON_SIZES[this.size ?? 'md'];
    },
  },
};
</script>
