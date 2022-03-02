<template>
  <dt-avatar
    :id="id"
    :kind="kind"
    :size="size"
    :color="color"
    :src="src"
    :alt="alt"
  >
    <template
      v-if="defaultSlot"
      slot="default"
    >
      <component
        :is="defaultSlot"
        v-if="kind === 'icon'"
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
