<template>
  <dt-button
    :to="to"
    :active="active"
    importance="clear"
    kind="muted"
    size="xs"
    label-class="d-jc-flex-start d-fw-normal d-tw-pretty"
    class="d-w100p"
  >
    {{ text }}
  </dt-button>
</template>

<script setup>
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
