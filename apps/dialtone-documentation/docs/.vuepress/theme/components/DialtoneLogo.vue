<template>
  <router-link
    class="d-btn h:d-bgc-transparent d-py6 d-w216 d-jc-flex-start"
    title="Go back to the homepage"
    to="/"
  >
    <svg-loader :illustration="true" name="dialpad-logo" />
  </router-link>
</template>

<script setup>
import SvgLoader from '../../baseComponents/SvgLoader.vue';

</script>
