<!-- eslint-disable max-len -->
<template>
  <dt-empty-state
    size="md"
    header-text="TBD"
    class="d-w100p d-p128"
  >
    <template #icon="{ iconSize }">
      <dt-icon name="box" :size="iconSize" class="d-fc-tertiary" />
    </template>
  </dt-empty-state>
</template>

<script setup>
function sendAnalyticsEvent () {
  if (!window.gtag) return;
  window.gtag('event', 'click', { event_name: 'get_started_button_clicked' });
}
</script>
