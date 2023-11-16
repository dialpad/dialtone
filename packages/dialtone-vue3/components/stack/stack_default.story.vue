<template>
  <div>
    <dt-stack
      :direction="$attrs.direction"
      :as="stackElement"
      :gap="$attrs.gap"
    >
      <div class="d-bgc-magenta-100">
        Stack item 1
      </div>
      <div class="d-bgc-magenta-100">
        Stack item 2
      </div>
      <div class="d-bgc-magenta-100">
        Stack item 3
      </div>
    </dt-stack>
  </div>
</template>

<script>
import DtStack from './stack.vue';

export default {
  name: 'StackDefault',
  components: { DtStack },

  computed: {
    stackElement () {
      return this.$attrs.as ? this.$attrs.as : 'div';
    },
  },
};
</script>
