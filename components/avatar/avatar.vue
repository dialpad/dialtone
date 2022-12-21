<template>
  <div
    :id="id"
    :class="[
      'd-avatar',
      AVATAR_KIND_MODIFIERS[kind],
      AVATAR_SIZE_MODIFIERS[size],
      avatarClass,
    ]"
    :style="initialKindStyle"
    data-qa="dt-avatar"
  >
    <!-- @slot Slot for avatar content -->
    <slot v-if="showDefaultSlot" />
    <span v-else-if="showInitials">
      {{ formattedInitials }}
    </span>
    <dt-presence
      v-if="presence"
      :presence="presence"
      :class="[
        'd-avatar__presence',
        AVATAR_PRESENCE_SIZE_MODIFIERS[size],
      ]"
      v-bind="presenceProps"
      data-qa="dt-presence"
    />
  </div>
</template>

<script>
import { getUniqueString, getRandomElement } from '@/common/utils';
import Vue from 'vue';
import { DtPresence } from '../presence';
import seedrandom from 'seedrandom';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_ANGLES,
  GRADIENT_COLORS,
  MAX_GRADIENT_COLORS,
  MAX_GRADIENT_COLORS_100,
} from './avatar_constants.js';

/**
 * An avatar is a visual representation of a user or object.
 * @see https://dialpad.design/components/avatar.html
 */
export default {
  name: 'DtAvatar',
  components: { DtPresence },

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
     * Pass in a seed to get the random color generation based on that string. For example if you pass in a
     * user ID as the string it will return the same randomly generated colors every time for that user.
     */
    seed: {
      type: String,
      default: undefined,
    },

    /**
     * The size of the avatar
     * @values xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: 'md',
      validator: (size) => Object.keys(AVATAR_SIZE_MODIFIERS).includes(size),
    },

    /**
     * Used to customize the avatar container
     */
    avatarClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Determines whether to show the presence indicator for
     * Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline',
     * or 'active'. By default, it's null and nothing is shown.
     */
    presence: {
      type: String,
      default: null,
    },

    /**
     * A set of props to be passed into the presence component.
     */
    presenceProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Initials to be shown in the avatar. Used as fallback if image fails to load.
     */
    initials: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      // initials, image or icon
      kind: 'image',
      AVATAR_SIZE_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
      AVATAR_PRESENCE_SIZE_MODIFIERS,
      imageLoadedSuccessfully: null,
      slottedInitials: '',
      formattedInitials: '',
    };
  },

  computed: {
    showDefaultSlot () {
      return this.kind !== 'initials' && this.imageLoadedSuccessfully !== false;
    },

    showInitials () {
      return this.kind === 'initials' || this.initials;
    },

    initialKindStyle () {
      const randomGradientColorStops = this.randomizeGradientColorStops();
      return {
        '--avatar-gradient-angle': `${this.randomizeGradientAngle()}deg`,
        '--avatar-gradient-stop-1': `var(--${randomGradientColorStops[0]})`,
        '--avatar-gradient-stop-2': `var(--${randomGradientColorStops[1]})`,
        '--avatar-gradient-stop-3': `var(--${randomGradientColorStops[2]})`,
      };
    },
  },

  mounted () {
    this.init();
  },

  updated () {
    if (this.kind === 'initials') {
      this.slottedInitials = this.$slots.default[0].text || this.$slots.default[0].textContent;
      this.formatInitials(this.slottedInitials);
    }
  },

  methods: {
    init () {
      const firstChild = this.$el.firstChild;

      if (firstChild) {
        this.setKind(firstChild);

        if (this.kind === 'image') {
          firstChild.classList.add('d-avatar__image');
          this.validateImageAttrsPresence();

          firstChild.addEventListener('error', () => {
            this.formatInitials(this.initials);
            this.imageLoadedSuccessfully = false;
          });

          firstChild.addEventListener('load', () => {
            firstChild.classList.add('d-avatar--image-loaded');
            this.imageLoadedSuccessfully = true;
          });
        }

        if (this.kind === 'initials') {
          this.slottedInitials = firstChild.text || firstChild.textContent;
          this.formatInitials(this.slottedInitials);
        }
      }
    },

    formatInitials (initials) {
      if (!initials) return;

      if (this.size === 'xs') {
        this.formattedInitials = '';
      } else if (this.size === 'sm') {
        this.formattedInitials = initials.trim()[0];
      } else {
        this.formattedInitials = initials.trim().slice(0, 2);
      }
    },

    setKind (element) {
      if (this.isSvgType(element)) { this.kind = 'icon'; return; }
      if (this.isImageType(element)) { this.kind = 'image'; return; }
      this.kind = 'initials';
    },

    isSvgType (element) {
      return element?.tagName?.toUpperCase() === 'SVG';
    },

    isImageType (element) {
      return element?.tagName?.toUpperCase() === 'IMG';
    },

    randomizeGradientAngle () {
      return getRandomElement(AVATAR_ANGLES, this.seed);
    },

    randomizeGradientColorStops () {
      const colors = new Set();

      let count = 0;
      // get 3 unique colors, 2 from colorsWith100 and one from colorsWith200
      while (colors.size < MAX_GRADIENT_COLORS) {
        // add count to the seed since we are looking for 3 unique colors. If the seed makes it always
        // return the same color we'll get an infinite loop.
        const seedForColor = this.seed === undefined ? undefined : this.seed + count.toString();
        if (colors.size === MAX_GRADIENT_COLORS_100) {
          colors.add(getRandomElement(GRADIENT_COLORS.with200, seedForColor));
        } else {
          colors.add(getRandomElement(GRADIENT_COLORS.with100, seedForColor));
        }
        count++;
      }
      const rng = seedrandom(this.seed);
      const shuffledColors = Array.from(colors).sort(() => 0.5 - rng());

      return shuffledColors;
    },

    validateImageAttrsPresence () {
      const isSrcMissing = !this.$el.firstChild.getAttribute('src');
      const isAltMissing = !this.$el.firstChild.getAttribute('alt');

      if (isSrcMissing || isAltMissing) {
        Vue.util.warn('src and alt attributes are required for image avatars', this);
      }
    },
  },
};
</script>

<style lang="less">
.d-avatar--image-loaded {
  background-color: transparent;
  background-image: unset;
}
</style>
