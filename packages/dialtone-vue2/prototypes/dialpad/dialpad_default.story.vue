<template>
  <dialpad-layout>
    <template #leftbar>
      <dialpad-leftbar />
    </template>
  </dialpad-layout>
</template>

<script>
import DialpadLayout from './dialpad_layout.vue';
import DialpadLeftbar from './leftbar/dialpad_leftbar.vue';

export default {
  name: 'DialpadDefault',
  components: {
    DialpadLayout,
    DialpadLeftbar,
  },
};
</script>
