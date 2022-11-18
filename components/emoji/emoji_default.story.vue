<template>
  <dt-emoji
    :code="code"
    :size="size"
    :img-class="imgClass"
    :aria-label="ariaLabel"
    :show-skeleton="showSkeleton"
  />
</template>

<script>
import DtEmoji from './emoji';

export default {
  name: 'DtEmojiDefault',
  components: { DtEmoji },
};
</script>
