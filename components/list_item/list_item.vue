<template>
  <!-- slot with list item content goes here -->
  <li
    :id="id"
    :class="['hs-list-item', 'd-fs14', 'd-lh6', 'd-py6', 'd-px16', 'd-d-flex', 'd-ai-center',
             { 'hs-list-item-clickable': clickable, 'd-jc-space-between': this.$slots.iconRight }]"
    :tabindex="clickable ? 0 : -1"
    @keydown.enter="clicked"
    @keydown.space="clicked"
    @click="clicked"
  >
    <slot name="iconLeft" />
    <slot />
    <slot name="iconRight" />
  </li>
</template>

<script>
// A generic list item, can be made clickable with the clickable prop
// which will cause the component to emit a click event

import utils from '../utils';

export default {
  name: 'ListItem',

  props: {
    id: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    role: {
      type: String,
      default: 'listitem',
    },

    clickable: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['click'],

  methods: {
    // emit click event
    clicked () {
      this.$emit('click');
    },
  },
};
</script>

<style lang="less">
.hs-list-item[tabindex="-1"]:focus {
  outline: none;
}

.hs-list-item-clickable:hover,
.hs-list-item-clickable:focus {
  background-color: hsla(var(--primary-color--h), var(--primary-color--s), var(--primary-color--l), 0.1);
  cursor: pointer;
}
</style>
