<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-avatar
      :full-name="name"
      :image-src="avatarSrc"
      :image-alt="name"
      size="xs"
    />
    <span class="mention-suggestion-name">
      {{ name }}
    </span>
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

<style lang="less" scoped>
.mention-suggestion-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
