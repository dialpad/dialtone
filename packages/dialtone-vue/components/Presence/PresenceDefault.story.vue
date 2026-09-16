<template>
  <dt-presence
    :presence="$attrs.presence"
    :sr-text="$attrs.srText"
    :show-icon="$attrs.showIcon"
  />
</template>

<script>
import DtPresence from './Presence.vue';

export default {
  name: 'DtPresenceDefaultStory',
  components: { DtPresence },
};
</script>
