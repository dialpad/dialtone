<template>
  <dt-notice
    kind="warning"
    class="d-wmx100p d-mt24"
    hide-close
    title="Consider DtStack instead"
  >
    Use the
    <router-link class="d-link d-link--muted" to="/components/stack">
      DtStack
    </router-link>
    component for most Flex-based layout implementations.
    Only resort to using Flex utilities when the Stack component is insufficient for your layout needs.
  </dt-notice>
</template>

<script>
export default {
  name: 'FlexStackNotice',
};
</script>
