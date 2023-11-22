<template>
  <dt-codeblock :text="$attrs.text" />
</template>

<script>
import { DtCodeblock } from '@dialpad/dialtone-vue';

export default {
  name: 'DtCodeblockDefault',
  components: { DtCodeblock },
};
</script>
