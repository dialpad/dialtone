<template>
  <dt-item-layout>
    <template slot="left">
      <span
        v-if="$attrs.left"
        v-html="$attrs.left"
      />
    </template>
    <span
      v-if="$attrs.default"
      v-html="$attrs.default"
    />
    <template slot="subtitle">
      <span
        v-if="$attrs.subtitle"
        v-html="$attrs.subtitle"
      />
    </template>
    <template slot="bottom">
      <span
        v-if="$attrs.bottom"
        v-html="$attrs.bottom"
      />
    </template>
    <template slot="right">
      <span
        v-if="$attrs.right"
        v-html="$attrs.right"
      />
    </template>
    <template slot="selected">
      <span
        v-if="$attrs.selected"
        v-html="$attrs.selected"
      />
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
