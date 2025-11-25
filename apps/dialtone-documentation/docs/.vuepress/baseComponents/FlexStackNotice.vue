<template>
  <dt-notice
    kind="warning"
    class="d-wmx100p d-mt24"
    hide-close
    title="Use DtStack in favor of Flex CSS Utilities"
  >
    Use the
    <router-link class="d-link d-link--muted" to="/components/stack">
      DtStack
    </router-link>
    component for most Flex-based layout implementations. View
    <router-link class="d-link d-link--muted" to="/about/whats-new/posts/2025-11-24">
      Migrating from Flex CSS Utilities to DtStack
    </router-link>
    for more details.
  </dt-notice>
</template>

<script>
export default {
  name: 'FlexStackNotice',
};
</script>
