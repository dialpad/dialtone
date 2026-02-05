<template>
  <dt-notice
    kind="warning"
    hide-close
    class="d-wmx100p d-my16"
    title="Use DtText in favor CSS Utilities"
  >
    <template #default>
      Reach for the
      <router-link class="d-fw-semibold d-link d-link--muted" to="/components/text">
        DtText
      </router-link>
      component before considering any typography utility.
    </template>
  </dt-notice>
</template>

<script>
export default {
  name: 'FontUtilitiesNotice',
};
</script>
