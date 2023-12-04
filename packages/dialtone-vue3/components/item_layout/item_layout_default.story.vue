<template>
  <dt-item-layout>
    <template #left>
      <span v-html="$attrs.left" />
    </template>
    <span v-html="defaultSlot" />
    <template #subtitle>
      <span v-html="$attrs.subtitle" />
    </template>
    <template #bottom>
      <span v-html="$attrs.bottom" />
    </template>
    <template #right>
      <span v-html="$attrs.right" />
    </template>
    <template #selected>
      <span v-html="$attrs.selected" />
    </template>
  </dt-item-layout>
</template>

<script>
import DtItemLayout from './item_layout.vue';

export default {
  name: 'DtItemLayoutDefault',
  components: { DtItemLayout },
};
</script>
