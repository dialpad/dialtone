<template>
  <dt-item-layout
    :as="$attrs.as"
    :unstyled="$attrs.unstyled"
  >
    <template #left>
      <span
        v-if="$attrs.left"
        v-html="$attrs.left"
      />
    </template>
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
    <template #subtitle>
      <span
        v-if="$attrs.subtitle"
        v-html="$attrs.subtitle"
      />
    </template>
    <template #bottom>
      <span
        v-if="$attrs.bottom"
        v-html="$attrs.bottom"
      />
    </template>
    <template #right>
      <span
        v-if="$attrs.right"
        v-html="$attrs.right"
      />
    </template>
    <template #selected>
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
