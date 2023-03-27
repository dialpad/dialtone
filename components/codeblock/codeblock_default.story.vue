<template>
  <dt-codeblock :text="$attrs.text" />
</template>

<script>
import DtCodeblock from './codeblock';

export default {
  name: 'DtCodeblockDefault',
  components: { DtCodeblock },
};
</script>
