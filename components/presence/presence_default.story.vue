<template>
  <dt-presence
    :presence="presence"
    :sr-text="srText"
  />
</template>

<script>
import DtPresence from './presence.vue';

export default {
  name: 'Presence',
  components: { DtPresence },
};
</script>
