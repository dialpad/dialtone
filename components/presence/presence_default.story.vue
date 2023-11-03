<template>
  <dt-presence
    :presence="$attrs.presence"
    :sr-text="$attrs.srText"
  />
</template>

<script>
import DtPresence from './presence.vue';

export default {
  name: 'Presence',
  components: { DtPresence },
};
</script>
