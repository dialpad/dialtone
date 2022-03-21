<template>
  <dt-avatar
    :id="$attrs.id"
    :kind="$attrs.kind"
    :size="$attrs.size"
    :color="$attrs.color"
    :src="$attrs.src"
    :alt="$attrs.alt"
  >
    <template
      v-if="defaultSlot"
      #default
    >
      <component
        :is="defaultSlot"
        v-if="$attrs.kind === 'icon'"
      />
      <html-fragment
        v-else
        :html="defaultSlot"
      />
    </template>
  </dt-avatar>
</template>

<script>
import DtAvatar from './avatar';
import icon from '@/common/mixins/icon';
import { htmlFragment } from '@/common/utils';

export default {
  name: 'DtAvatarDefault',
  components: { DtAvatar, htmlFragment },
  mixins: [icon],
};
</script>
