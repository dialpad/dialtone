<template>
  <dt-codeblock
    :text="$attrs.text"
    :bordered="$attrs.bordered"
    :size="$attrs.size"
  />
</template>

<script>
import DtCodeblock from './Codeblock.vue';

export default {
  name: 'DtCodeblockDefault',
  components: { DtCodeblock },
};
</script>
