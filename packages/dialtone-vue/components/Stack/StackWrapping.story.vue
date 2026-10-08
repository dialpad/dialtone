<template>
  <dt-box
    inline-size="500"
    max-inline-size="100p"
  >
    <dt-stack
      :direction="$attrs.direction"
      :as="$attrs.as"
      :gap="$attrs.gap"
      :align="$attrs.align"
      :justify="$attrs.justify"
      :wrap="$attrs.wrap"
    >
      <dt-box
        v-for="item in 3"
        :key="item"
        inline-size="200"
        surface="moderate-opaque"
        padding="100"
        border-radius="300"
      >
        Stack item {{ item }}
      </dt-box>
    </dt-stack>
  </dt-box>
</template>

<script>
import DtBox from '@/components/Box/Box.vue';
import DtStack from './Stack.vue';

export default {
  name: 'StackWrapping',
  components: { DtBox, DtStack },
};
</script>
