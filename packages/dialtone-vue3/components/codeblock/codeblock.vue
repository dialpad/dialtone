<template>
  <pre>
    <code
      class="d-codeblock"
    >{{ text }}</code>
  </pre>
</template>

<script>
export default {
  compatConfig: { MODE: 3 },
  name: 'DtCodeblock',

  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>
