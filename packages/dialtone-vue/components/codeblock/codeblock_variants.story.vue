<template>
  <div class="d-d-flex d-fd-column d-stack8">
    <div>
      <h4>Default (sm)</h4>
      <dt-codeblock :text="text" />
    </div>
    <div>
      <h4>xs</h4>
      <dt-codeblock
        :text="text"
        size="xs"
      />
    </div>
    <div>
      <h4>md</h4>
      <dt-codeblock
        :text="text"
        size="md"
      />
    </div>
    <div>
      <h4>lg</h4>
      <dt-codeblock
        :text="text"
        size="lg"
      />
    </div>
    <div>
      <h4>Bordered</h4>
      <dt-codeblock
        :text="text"
        bordered
      />
    </div>
  </div>
</template>

<script>
import DtCodeblock from './codeblock.vue';

export default {
  name: 'DtCodeblockVariants',
  components: { DtCodeblock },

  data () {
    return {
      text: 'function someFunction() {\n  return "some result";\n}',
    };
  },
};
</script>
