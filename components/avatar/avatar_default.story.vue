<template>
  <dt-avatar
    :id="args.id"
    :kind="args.kind"
    :size="args.size"
    :color="args.color"
    :src="args.src"
    :alt="args.alt"
  >
    <template
      v-if="args.default"
    >
      <component
        :is="args.default"
        v-if="args.kind === 'icon'"
      />
      <html-fragment
        v-else
        :html="args.default"
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
