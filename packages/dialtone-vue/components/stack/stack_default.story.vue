<template>
  <div class="d-ba d-bc-default">
    <dt-stack
      :direction="$attrs.direction"
      :as="stackElement"
      :gap="$attrs.gap"
      :align="$attrs.align"
      :justify="$attrs.justify"
    >
      <div class="d-bgc-moderate-opaque">
        Stack item 1
      </div>
      <div class="d-bgc-moderate-opaque">
        Stack item 2a<br>
        Stack item 2b
      </div>
      <div class="d-bgc-moderate-opaque">
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
