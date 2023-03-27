<template>
  <pre>
    <code
      class="d-d-block d-bgc-secondary d-ws-pre-wrap d-p8 d-ba
      d-bc-subtle d-bar8 d-fs-200 d-ff-mono d-lh-400 d-fc-secondary"
    >{{ text }}</code>
  </pre>
</template>

<script>
export default {
  name: 'DtCodeblock',

  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
