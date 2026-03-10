<template>
  <dt-notice
    kind="warning"
    hide-close
    class="d-wmx100p d-my16"
    title="Use DtText in favor CSS Utilities"
  >
    <template #default>
      Reach for the
      <dt-link kind="muted" to="/components/text">
        DtText
      </dt-link>
      component before considering any typography utility.
    </template>
  </dt-notice>
</template>

<script>
export default {
  name: 'FontUtilitiesNotice',
};
</script>
