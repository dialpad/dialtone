<template>
  <dt-stack
    direction="row"
    gap="200"
    align="stretch"
    class="d-h-400"
  >
    <dt-stack
      :direction="$attrs.direction"
      :as="$attrs.as"
      :wrap="$attrs.wrap"
      :gap="$attrs.gap"
      :align="$attrs.align"
      :justify="$attrs.justify"
      :align-self="$attrs.alignSelf"
    >
      <dt-box
        v-for="item in 2"
        :key="item"
        surface="moderate-opaque"
        padding="100"
        border-radius="300"
      >
        Stack item {{ item }}
      </dt-box>
    </dt-stack>
    <dt-box
      surface="moderate-opaque"
      padding="100"
      border-radius="300"
      class="d-fl1"
    >
      Sibling that sets the row height
    </dt-box>
  </dt-stack>
</template>

<script>
import DtBox from '@/components/Box/Box.vue';
import DtStack from './Stack.vue';

export default {
  name: 'StackAlignSelf',
  components: { DtBox, DtStack },
  inheritAttrs: false,
};
</script>
