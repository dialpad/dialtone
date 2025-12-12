<template>
  <dt-notice
    kind="warning"
    hide-close
    class="d-wmx100p d-my16"
  >
    <template #default>
      <dt-text as="p" kind="body" wrap="pretty">
        Before considering any typography utility, initially reach for the
        <router-link class="d-fw-semibold d-link d-link--muted" to="/components/text">
          DtText
        </router-link> component.
      </dt-text>
    </template>
  </dt-notice>
</template>

<script>
export default {
  name: 'FontUtilitiesNotice',
};
</script>
