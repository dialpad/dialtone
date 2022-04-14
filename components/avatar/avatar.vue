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
    <slot />
  </div>
</template>

<script>
import { warn } from 'vue';
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
      // initials, image or icon
      kind: 'initials',
      AVATAR_SIZE_MODIFIERS,
      AVATAR_COLOR_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
    };
  },

  mounted () {
    this.init();
  },

  updated () {
    this.init();
  },

  methods: {
    init () {
      const firstChild = this.$el.children[0];
      if (firstChild) {
        this.validateElementType(firstChild);
        this.setKind(firstChild);
        this.validateImageAttrsPresence();
      }
    },

    setKind (element) {
      if (this.isSvgType(element)) this.kind = 'icon';
      if (this.isImageType(element)) this.kind = 'image';
      if (this.isInitialsType(element)) this.kind = 'initials';
    },

    isSvgType (element) {
      return element?.tagName?.toUpperCase() === 'SVG';
    },

    isImageType (element) {
      return element?.tagName?.toUpperCase() === 'IMG';
    },

    isInitialsType (element) {
      return element?.nodeType === Node.TEXT_NODE;
    },

    validateElementType (element) {
      if (this.isInitialsType(element) || this.isSvgType(element) || this.isImageType(element)) return;
      warn('img, svg, and raw text are the only valid elements to put inside the avatar', this);
    },

    validateImageAttrsPresence () {
      if (this.kind === 'image') {
        // Check that default slot image required attributes are provided
        if (!this.$el.children[0].getAttribute('src') || !this.$el.children[0].getAttribute('alt')) {
          warn('src and alt attributes are required for image avatars', this);
        }
      }
    },
  },
};
</script>
