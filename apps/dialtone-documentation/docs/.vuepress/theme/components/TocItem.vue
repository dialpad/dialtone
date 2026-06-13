<template>
  <dt-button
    :href="to"
    :active="active"
    :aria-current="active ? 'location' : undefined"
    importance="clear"
    kind="muted"
    :size="100"
    label-class="d-jc-flex-start d-fw-normal d-tw-pretty"
    class="d-w100p"
    @click="emit('navigate', $event)"
  >
    {{ text }}
  </dt-button>
</template>

<script setup>
const emit = defineEmits(['navigate']);

defineProps({
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: false,
  },
});
</script>
