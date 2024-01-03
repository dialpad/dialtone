<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-avatar
      :full-name="name"
      :image-src="avatarSrc"
      size="xs"
    />
    {{ name }}
  </dt-stack>
</template>

<script>
import { DtAvatar } from '@/components/avatar';
import { DtStack } from '@/components/stack';

export default {
  name: 'MentionSuggestion',
  components: {
    DtAvatar,
    DtStack,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    name () {
      return this.item.name;
    },

    avatarSrc () {
      return this.item.avatarSrc;
    },
  },
};
</script>
