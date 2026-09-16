<template>
  <dt-stack
    direction="row"
    gap="100"
  >
    <dt-emoji
      size="200"
      :code="item.code"
    />
    {{ item.code }}
  </dt-stack>
</template>

<script>
import { DtEmoji } from '@/components/Emoji';
import { DtStack } from '@/components/Stack';

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
