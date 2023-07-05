<template>
  <dt-item-layout>
    <template slot="left">
      <span v-html="left" />
    </template>
    <span v-html="defaultSlot" />
    <template slot="subtitle">
      <span v-html="subtitle" />
    </template>
    <template slot="bottom">
      <span v-html="bottom" />
    </template>
    <template slot="right">
      <span v-html="right" />
    </template>
    <template slot="selected">
      <span v-html="selected" />
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
