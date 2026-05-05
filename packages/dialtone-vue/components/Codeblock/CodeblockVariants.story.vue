<template>
  <dt-stack gap="100">
    <div>
      <h4>Default (sm)</h4>
      <dt-codeblock :text="text" />
    </div>
    <div>
      <h4>xs</h4>
      <dt-codeblock
        :text="text"
        :size="100"
      />
    </div>
    <div>
      <h4>md</h4>
      <dt-codeblock
        :text="text"
        :size="300"
      />
    </div>
    <div>
      <h4>lg</h4>
      <dt-codeblock
        :text="text"
        :size="400"
      />
    </div>
    <div>
      <h4>Bordered</h4>
      <dt-codeblock
        :text="text"
        bordered
      />
    </div>
  </dt-stack>
</template>

<script>
import DtCodeblock from './Codeblock.vue';
import { DtStack } from '@/components/Stack';

export default {
  name: 'DtCodeblockVariants',
  components: { DtCodeblock, DtStack },

  data () {
    return {
      text: 'function someFunction() {\n  return "some result";\n}',
    };
  },
};
</script>
