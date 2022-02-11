<template>
  <div
    :id="id"
    :class="[
      'd-avatar',
      AVATAR_KIND_MODIFIERS[kind],
      AVATAR_SIZE_MODIFIERS[size],
      AVATAR_COLOR_MODIFIERS[color],
      avatarClass,
    ]"
    data-qa="dt-avatar"
  >
    <!-- @slot Slot for avatar content -->
    <slot>
      <img
        data-qa="dt-avatar-image"
        v-bind="$attrs"
        :alt="$attrs.alt"
      >
    </slot>
  </div>
</template>

<script>
import Vue from 'vue';
import {
  AVATAR_SIZE_MODIFIERS,
  AVATAR_COLOR_MODIFIERS,
  AVATAR_KIND_MODIFIERS,
} from './avatar_constants.js';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtAvatar',

  inheritAttrs: false,

  props: {
    /**
     * Id of the avatar content wrapper element
     */
    id: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * Applies variant class to the avatar
     */
    kind: {
      type: String,
      default: 'default',
      validator: (kind) => Object.keys(AVATAR_KIND_MODIFIERS).includes(kind),
    },

    /**
     * The size of the avatar
     */
    size: {
      type: String,
      default: 'md',
      validator: (size) => Object.keys(AVATAR_SIZE_MODIFIERS).includes(size),
    },

    /**
     * The color of the avatar
     */
    color: {
      type: String,
      default: 'base',
      validator: (color) => Object.keys(AVATAR_COLOR_MODIFIERS).includes(color),
    },

    /**
     * Used to customize the avatar container
     */
    avatarClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  data () {
    return {
      AVATAR_SIZE_MODIFIERS,
      AVATAR_COLOR_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
    };
  },

  mounted () {
    this.validateImageAttrsPresence();
  },

  beforeUpdate () {
    this.validateImageAttrsPresence();
  },

  methods: {
    validateImageAttrsPresence () {
      if (this.kind === 'default' && !this.$slots.default) {
        // Check that default slot image required attributes are provided
        if (!this.$attrs.src || !this.$attrs.alt) {
          Vue.util.warn('src and alt attributes are required for image avatars', this);
        }
      }
    },
  },
};
</script>
