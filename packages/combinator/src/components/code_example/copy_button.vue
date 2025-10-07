<template>
  <dt-tooltip
    :message="message"
    :sticky="true"
  >
    <template #anchor>
      <dt-button
        :aria-label="ariaLabel"
        :circle="!$slots.default"
        size="xs"
        importance="clear"
        kind="muted"
        @click="copyToClipboard"
      >
        <template #icon="{ iconSize }">
          <dt-icon-copy
            :size="iconSize"
          />
        </template>
        <slot />
      </dt-button>
    </template>
  </dt-tooltip>
</template>

<script setup>
import { ref } from 'vue';
import { DtButton, DtTooltip } from '@dialpad/dialtone-vue';
import DtIconCopy from '@dialpad/dialtone-icons/vue3/copy';

const props = defineProps({
  text: { type: String, required: true },
  ariaLabel: { type: String, required: true },
});
const message = ref(props.ariaLabel);
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text);
    message.value = 'Copied';
    await new Promise(resolve => setTimeout(resolve, 750));
    message.value = props.ariaLabel;
  } catch {
    console.error('Error copying to clipboard', props.text);
  }
};
</script>

<style scoped lang="less">
</style>
