<template>
  <div class="d-w100p d-h100p">
    <slot name="content" />
    <div class="d-pe-none">
      <div class="d-h100p">
        <slot name="overlay" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DtcOverlay',
};
</script>
