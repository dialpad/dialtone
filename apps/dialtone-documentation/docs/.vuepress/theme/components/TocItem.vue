<template>
  <RouterLink
    :class="[
      'd-btn d-btn--sm d-btn--muted d-w100p d-jc-flex-start',
      { 'd-fw-bold d-bgc-moderate': active },
      { 'd-fw-normal': !active },
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
