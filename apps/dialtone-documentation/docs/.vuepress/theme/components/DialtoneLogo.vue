<template>
  <router-link
    class="d-btn d-btn--muted h:d-bgc-transparent d-py6 d-px12 d-w216 d-jc-flex-start"
    title="Go back to the homepage"
    to="/"
  >
    <dt-stack gap="450" direction="row">
      <dt-icon
        name="dialpad-ai-color-reversed"
        size="500"
      />
      <span class="d-fs-300 d-fw-bold">Dialtone</span>
      <!-- <svg-loader :illustration="true" name="dialpad-logo" /> -->
    </dt-stack>
  </router-link>
</template>

<script setup>
import SvgLoader from '../../baseComponents/SvgLoader.vue';

</script>
