<template>
  <dt-codeblock :text="text" />
</template>

<script>
import DtCodeblock from './codeblock.vue';

export default {
  name: 'DtCodeblockDefault',
  components: { DtCodeblock },
};
</script>
