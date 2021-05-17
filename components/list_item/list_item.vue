<template>
  <!-- slot with list item content goes here -->
  <li
    :id="id"
    :class="['dt-list-item', 'd-fs14', 'd-lh6', 'd-py6', 'd-px16', 'd-d-flex', 'd-ai-center',
             { 'dt-list-item-clickable': clickable, 'd-jc-space-between': this.$slots.iconRight }]"
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
.dt-list-item[tabindex="-1"]:focus {
  outline: none;
}

.dt-list-item-clickable:hover,
.dt-list-item-clickable:focus {
  background-color: hsla(var(--primary-color--h), var(--primary-color--s), var(--primary-color--l), 0.1);
  cursor: pointer;
}
</style>
