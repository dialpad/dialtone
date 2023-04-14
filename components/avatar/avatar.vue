<template>
  <div
    :id="id"
    :class="avatarClasses"
    :style="initialKindStyle"
    data-qa="dt-avatar"
  >
    <div
      ref="canvas"
      :class="[canvasClass, 'd-avatar__canvas']"
    >
      <!-- @slot Slot for avatar content -->
      <slot v-if="showDefaultSlot" />
      <span
        v-if="showInitials"
        class="d-ps-absolute d-zi-base"
        :class="AVATAR_KIND_MODIFIERS.initials"
      >
        {{ formattedInitials }}
      </span>
    </div>
    <div
      v-if="overlayIcon || overlayText"
      :class="overlayClasses"
    >
      <dt-icon
        v-if="overlayIcon"
        class="d-fc-white d-w100p"
        :name="overlayIcon"
      />
      <p
        v-else-if="overlayText"
        class="d-fs-200 d-fw-bold d-fc-white d-w100p d-ta-center"
      >
        {{ overlayText }}
      </p>
    </div>
    <span
      v-if="showGroup"
      class="d-avatar__count d-zi-base"
      data-qa="dt-avatar-count"
    >{{ formattedGroup }}</span>
    <dt-presence
      v-if="presence && !showGroup"
      :presence="presence"
      class="d-zi-base"
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
import { warn } from 'vue';
import { getUniqueString, getRandomElement } from '@/common/utils';
import { DtPresence } from '../presence';
import DtIcon from '@/components/icon/icon';
import seedrandom from 'seedrandom';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_ANGLES,
  GRADIENT_COLORS,
  MAX_GRADIENT_COLORS,
  MAX_GRADIENT_COLORS_100,
  AVATAR_GROUP_VALIDATOR,
} from './avatar_constants.js';

/**
 * An avatar is a visual representation of a user or object.
 * @see https://dialpad.design/components/avatar.html
 */
export default {
  name: 'DtAvatar',
  components: { DtPresence, DtIcon },

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
     * Set classes on the avatar canvas. Wrapper around the core avatar image.
     */
    canvasClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Determines whether to show the presence indicator for
     * Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline',
     * or 'active'. By default, it's null and nothing is shown.
     * @values null, busy, away, offline, active
     */
    presence: {
      type: String,
      default: AVATAR_PRESENCE_STATES.NONE,
      validator: (state) => {
        return Object.values(AVATAR_PRESENCE_STATES).includes(state);
      },
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

    /**
     * Determines whether to show a gradient background for the avatar.
     */
    gradient: {
      type: Boolean,
      default: true,
    },

    /**
     * Determines whether to show a group avatar.
     * Limit to 2 digits max, more than 99 will be rendered as “99+”.
     * if the number is 1 or less it would just show the regular avatar as if group had not been set.
     */
    group: {
      type: Number,
      default: undefined,
      validator: (group) => AVATAR_GROUP_VALIDATOR(group),
    },

    /**
     * The icon that overlays the avatar
     */
    overlayIcon: {
      type: String,
      default: '',
    },

    /**
     * The text that overlays the avatar
     */
    overlayText: {
      type: String,
      default: '',
    },

    /**
     * Used to customize the avatar overlay
     */
    overlayClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  data () {
    return {
      // initials, image or icon
      kind: null,
      AVATAR_SIZE_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
      AVATAR_PRESENCE_SIZE_MODIFIERS,
      imageLoadedSuccessfully: null,
      slottedInitials: '',
      formattedInitials: '',
      initializing: false,
    };
  },

  computed: {
    avatarClasses () {
      return [
        'd-avatar',
        AVATAR_SIZE_MODIFIERS[this.validatedSize],
        this.avatarClass,
        {
          'd-avatar--no-gradient': !this.gradient,
          'd-avatar--group': this.showGroup,
        },
      ];
    },

    overlayClasses () {
      return [
        'd-bgc-black-900 d-o70 d-ps-absolute d-w100p d-h100p d-d-flex d-ai-center d-bar-circle d-zi-base',
        this.overlayClass,
      ];
    },

    showDefaultSlot () {
      return this.kind !== 'initials' ||
      (this.kind === 'image' && this.imageLoadedSuccessfully === true);
    },

    showInitials () {
      return this.kind === 'initials' ||
      (this.kind === 'image' && this.initials && this.imageLoadedSuccessfully !== true);
    },

    showGroup () {
      return AVATAR_GROUP_VALIDATOR(this.group);
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

    formattedGroup () {
      return this.group > 99 ? '99+' : this.group;
    },

    validatedSize () {
      // TODO: Group only supports xs size for now. Remove this when we support other sizes.
      return this.group ? 'xs' : this.size;
    },
  },

  mounted () {
    this.init();
  },

  updated () {
    this.init();
  },

  methods: {
    async init () {
      if (this.initializing) return;
      this.kind = null;
      await this.$nextTick();
      const firstChild = this.$refs.canvas?.children[0] || this.$refs.canvas;
      this.formatInitials(this.initials);
      if (firstChild) {
        this.setKind(firstChild);
        this.kindHandler(firstChild);
      }
      this.initializing = true;
      await this.$nextTick();
      this.initializing = false;
    },

    // eslint-disable-next-line complexity
    kindHandler (el) {
      switch (this.kind) {
        case 'image':
          el.classList.add('d-avatar__image');
          this.validateImageAttrsPresence();
          this.setImageListeners(el);
          break;
        case 'icon':
          el.classList.add(AVATAR_KIND_MODIFIERS.icon);
          break;
        case 'initials':
          if (!el.textContent) return;
          this.slottedInitials = el.textContent;
          this.formatInitials(this.slottedInitials.trim() || this.initials);
          break;
      }
    },

    setImageListeners (el) {
      el.addEventListener('load', () => this._loadedImageEventHandler(el), { once: true });
      el.addEventListener('error', () => this._erroredImageEventHandler(el), { once: true });
    },

    formatInitials (initials) {
      if (!initials || this.validatedSize === 'xs') {
        this.formattedInitials = '';
      } else if (this.validatedSize === 'sm') {
        this.formattedInitials = initials.trim()[0];
      } else {
        this.formattedInitials = initials.trim().slice(0, 2);
      }
    },

    setKind (element) {
      if (this.isIconType(element)) { this.kind = 'icon'; return; }
      if (this.isImageType(element)) { this.kind = 'image'; return; }
      this.kind = 'initials';
    },

    isIconType (element) {
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
      return Array.from(colors).sort(() => 0.5 - rng()); // shuffle colors
    },

    validateImageAttrsPresence () {
      const isSrcMissing = !this.$refs.canvas.children[0].getAttribute('src');

      // If alt set to empty string consider it valid, as this is a valid case if the
      // image is already described by something else (ex: visible description)
      // eslint-disable-next-line no-unneeded-ternary
      const isAltMissing = this.$refs.canvas.children[0].getAttribute('alt') === null;

      if (isSrcMissing || isAltMissing) {
        warn('src and alt attributes are required for image avatars', this);
      }
    },

    _loadedImageEventHandler (el) {
      this.imageLoadedSuccessfully = true;
      el.classList.remove('d-d-none');
      el.classList.add('d-avatar--image-loaded');
    },

    _erroredImageEventHandler (el) {
      this.imageLoadedSuccessfully = false;
      el.classList.remove('d-avatar--image-loaded');
      el.classList.add('d-d-none');
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
