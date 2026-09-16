<template>
  <dt-button
    :aria-label="ariaLabel"
    :size="100"
    importance="clear"
    kind="muted"
    @click="copyToClipboard"
  >
    <template #startIcon="{ iconSize }">
      <dt-icon
        :name="copied ? 'check' : 'copy'"
        :size="iconSize"
        :class="{ 'd-fc-positive': copied }"
      />
    </template>
    <template v-if="copied">
      Copied!
    </template>
    <slot v-else />
  </dt-button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  ariaLabel: { type: String, required: true },
});
const copied = ref(false);
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    copied.value = false;
  } catch {
    console.error('Error copying to clipboard', props.text);
  }
};
</script>

<style scoped lang="less">
</style>
