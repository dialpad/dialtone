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
        :size="size"
      >
        <html-fragment
          :html="avatar"
        />
      </dt-avatar>
    </template>
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
  </dt-chip>
</template>

<script>
import DtChip from './chip';
import { DtAvatar } from '@/components/avatar';
import { DtIcon } from '@/components/icon';
import { CHIP_ICON_SIZES } from '@/components/chip/chip_constants';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtChipDefault',
  components: { DtChip, DtAvatar, DtIcon, htmlFragment },
  computed: {
    iconSize () {
      return CHIP_ICON_SIZES[this.size];
    },
  },
};
</script>
