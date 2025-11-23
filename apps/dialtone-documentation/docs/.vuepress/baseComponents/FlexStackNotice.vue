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
    component for most Flex-based layout implementations. Flex CSS Utilities can
    still be used on the Stack component for properties not available on the Stack component.
  </dt-notice>
</template>

<script>
export default {
  name: 'FlexStackNotice',
};
</script>
