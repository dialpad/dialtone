<template>
  <dt-stack gap="300">
    <dt-stack
      v-for="size in sizes"
      :key="`emoji-size${size}`"
      gap="200"
      direction="row"
    >
      <dt-emoji
        code=":smile:"
        :size="size"
      />
      <label :for="`emoji-size${size}`">size {{ size }}</label>
    </dt-stack>
  </dt-stack>
</template>

<script>
import { DtEmoji } from './';
import { DtStack } from '@/components/stack';
import { ICON_SIZE_MODIFIERS } from '@/components/icon';

export default {
  name: 'DtEmojiDefault',
  components: { DtEmoji, DtStack },
  data () {
    return {
      sizes: Object.keys(ICON_SIZE_MODIFIERS),
    };
  },
};
</script>
