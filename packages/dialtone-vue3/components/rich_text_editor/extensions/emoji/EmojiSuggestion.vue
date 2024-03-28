<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-emoji
      size="200"
      :code="item.code"
    />
    {{ item.code }}
  </dt-stack>
</template>

<script>
import { DtEmoji } from '@/components/emoji';
import { DtStack } from '@/components/stack';

export default {
  name: 'EmojiSuggestion',
  components: {
    DtEmoji,
    DtStack,
  },

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
