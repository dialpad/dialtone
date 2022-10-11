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
      <component :is="icon" />
    </template>
    <template
      v-else-if="avatar"
      slot="avatar"
    >
      <dt-avatar
        class="d-avatar--purple-200"
        v-html="avatar"
      />
    </template>
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
  </dt-chip>
</template>

<script>
import DtChip from './chip';
import DtAvatar from '../avatar/avatar';
import icon from '@/common/mixins/icon';

export default {
  name: 'DtChipDefault',
  components: { DtChip, DtAvatar },
  mixins: [icon],
};
</script>
