<template>
  <dt-item-layout>
    <template slot="left">
      <span v-html="$attrs.left" />
    </template>
    <span v-html="$attrs.default" />
    <template slot="subtitle">
      <span v-html="$attrs.subtitle" />
    </template>
    <template slot="bottom">
      <span v-html="$attrs.bottom" />
    </template>
    <template slot="right">
      <span v-html="$attrs.right" />
    </template>
    <template slot="selected">
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
