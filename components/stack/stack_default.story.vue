<template>
  <dt-stack
    :direction="direction"
    :as="stackElement"
    :gap="gap"
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
</template>

<script>
import DtStack from './stack.vue';

export default {
  name: 'StackDefault',
  components: { DtStack },

  computed: {
    stackElement () {
      return this.as ? this.as : 'div';
    },
  },
};
</script>
