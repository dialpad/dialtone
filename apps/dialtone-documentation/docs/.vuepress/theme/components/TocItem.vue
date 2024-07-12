<template>
  <RouterLink
    :class="[
      'd-btn d-btn--sm d-btn--muted d-fw-normal d-w100p d-jc-flex-start',
      { 'd-btn--active': active },
    ]"
    :to="to"
  >
    {{ text }}
  </RouterLink>
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
