<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <dt-chip
    :id="$attrs.id"
    :hide-close="$attrs.hideClose"
    :close-button-props="$attrs.closeButtonProps"
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
      <component :is="$attrs.icon" />
    </template>
    <template
      v-else-if="$attrs.avatar"
      #avatar
    >
      <dt-avatar
        color="purple-200"
      >
        <v-html :html="$attrs.avatar" />
      </dt-avatar>
    </template>
    <v-html :html="defaultSlot" />
  </dt-chip>
</template>

<script>
import DtChip from './chip';
import DtAvatar from '../avatar/avatar';
import icon from '@/common/mixins/icon';
import VHtml from '@/common/v_html';

export default {
  name: 'DtChipDefault',
  components: { DtChip, VHtml, DtAvatar },
  mixins: [icon],
};
</script>
