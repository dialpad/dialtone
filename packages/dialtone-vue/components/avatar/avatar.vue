<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :id="id"
    :class="avatarClasses"
    :style="avatarStyles"
    :data-avatar-family="computedFamily"
    :data-avatar-variant="computedVariant"
    data-qa="dt-avatar"
    @click="handleClick"
  >
    <div
      ref="canvas"
      :class="[
        canvasClass,
        'd-avatar__canvas',
        { 'd-avatar--image-loaded': imageLoadedSuccessfully },
      ]"
    >
      <img
        v-if="showImage"
        ref="avatarImage"
        class="d-avatar__image"
        data-qa="dt-avatar-image"
        :src="imageSrc"
        :alt="imageAlt"
      >
      <div
        v-else-if="isIconType()"
        :class="[iconClass, AVATAR_KIND_MODIFIERS.icon]"
        :aria-label="clickable ? iconAriaLabel : ''"
        :data-qa="iconDataQa"
        :role="clickable ? 'button' : ''"
      >
        <!-- @slot Slot for avatar icon. It will display if no imageSrc is provided -->
        <slot
          name="icon"
          :icon-size="iconSize || AVATAR_ICON_SIZES[size]"
        />
      </div>
      <span
        v-else
        :class="[AVATAR_KIND_MODIFIERS.initials]"
      >
        {{ formattedInitials }}
      </span>
    </div>
    <div
      v-if="hasOverlayIcon || overlayText"
      :class="overlayClasses"
    >
      <!-- @slot Slot for overlay icon. -->
      <slot
        v-if="hasOverlayIcon"
        name="overlayIcon"
      />
      <p
        v-else-if="overlayText"
        class="d-avatar__overlay-text"
      >
        {{ overlayText }}
      </p>
    </div>
    <span
      v-if="showGroup"
      class="d-avatar__count"
      data-qa="dt-avatar-count"
    >{{ formattedGroup }}</span>
    <dt-presence
      v-if="presence && !showGroup"
      :presence="presence"
      :class="[
        'd-avatar__presence',
        AVATAR_PRESENCE_SIZE_MODIFIERS[size],
      ]"
      v-bind="presenceProps"
      data-qa="dt-presence"
    />
  </component>
</template>

<script>
import { getUniqueString, hasSlotContent } from '@/common/utils';
import { DtPresence } from '../presence';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_GROUP_VALIDATOR,
  AVATAR_ICON_SIZES,
  AVATAR_FAMILY_COUNT,
  AVATAR_VARIANT_COUNT,
  colorToFamilyVariant,
  getRandomFamilyVariant,
  computeAvatarHex,
} from './avatar_constants';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants.js';
import { extractInitialsFromName } from './utils';

/**
 * An avatar is a visual representation of a user or object.
 * @see https://dialtone.dialpad.com/components/avatar.html
 */
export default {
  compatConfig: { MODE: 3 },
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
     * Avatar color family (1-12). Each family represents a different hue offset from the theme's anchor.
     * Families: 1=Red, 2=Orange, 3=Amber, 4=Yellow-Green, 5=Green, 6=Teal, 7=Cyan, 8=Blue, 9=Indigo, 10=Purple, 11=Magenta, 12=Pink
     * If not provided, will be randomized (deterministically if seed is set).
     * @values 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
     */
    family: {
      type: Number,
      default: undefined,
      validator: (val) => val >= 1 && val <= AVATAR_FAMILY_COUNT,
    },

    /**
     * Avatar color variant (0-9). Controls lightness/chroma within the family.
     * 0 = darkest, 9 = lightest. Variants 0-5 have light text, 6-9 have dark text.
     * If not provided, will be randomized (deterministically if seed is set).
     * @values 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
     */
    variant: {
      type: Number,
      default: undefined,
      validator: (val) => val >= 0 && val < AVATAR_VARIANT_COUNT,
    },

    /**
     * Avatar color code. Converted internally to family/variant.
     * Format: family (1-12) * 100 + variant (0-9) * 10, e.g., '540' = family 5, variant 4.
     * If undefined, will randomize (deterministically if seed is set).
     * Prefer using family/variant props directly for new code.
     */
    color: {
      type: String,
      default: undefined,
    },

    /**
     * The size of the avatar.
     * T-shirt sizes (xs, sm, md, lg, xl) are deprecated and will be removed in the next major version.
     * Please use the numeric scale instead.
     * @values 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, xs, sm, md, lg, xl
     */
    size: {
      type: [String, Number],
      default: 300,
      validator: (size) => Object.keys(AVATAR_SIZE_MODIFIERS).includes(String(size)),
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
     * Pass through classes. Used to customize the avatar icon
     */
    iconClass: {
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
     * Determines whether to show a group avatar.
     * Limit to 2 digits max, more than 99 will be rendered as "99+".
     * if the number is 1 or less it would just show the regular avatar as if group had not been set.
     */
    group: {
      type: Number,
      default: undefined,
      validator: (group) => AVATAR_GROUP_VALIDATOR(group),
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

    /**
     * Source of the image
     */
    imageSrc: {
      type: String,
      default: '',
    },

    /**
     * Alt attribute of the image, required if imageSrc is provided.
     * Can be set to '' (empty string) if the image is described
     * in text nearby
     */
    imageAlt: {
      type: String,
      default: undefined,
    },

    /**
     * Icon size to be displayed on the avatar
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    iconSize: {
      type: String,
      default: '',
      validator: (size) => !size || Object.keys(ICON_SIZE_MODIFIERS).includes(size),
    },

    /**
     * Full name used to extract initials.
     */
    fullName: {
      type: String,
      default: '',
    },

    /**
     * Makes the avatar focusable and clickable,
     * emits a click event when clicked.
     */
    clickable: {
      type: Boolean,
      default: false,
    },

    /**
     * Descriptive label for the icon.
     * To avoid a11y issues, set this prop if clickable and iconName are set.
     */
    iconAriaLabel: {
      type: String,
      default: undefined,
    },
  },

  emits: [
    /**
     * Avatar click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  data () {
    return {
      AVATAR_SIZE_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
      AVATAR_PRESENCE_SIZE_MODIFIERS,
      AVATAR_ICON_SIZES,
      imageLoadedSuccessfully: null,
      formattedInitials: '',
      initializing: false,
      hasSlotContent,
      anchorHue: 0,
    };
  },

  computed: {
    hasOverlayIcon () {
      return hasSlotContent(this.$slots.overlayIcon);
    },

    iconDataQa () {
      return 'dt-avatar-icon';
    },

    /**
     * Compute family from props, color prop, or random
     */
    computedFamily () {
      // Icon-type avatars don't use color
      if (this.isIconType()) return undefined;

      // Explicit family prop takes precedence
      if (this.family !== undefined) return this.family;

      // Color prop (converted to family/variant)
      if (this.color !== undefined) {
        const parsed = colorToFamilyVariant(this.color);
        if (parsed) return parsed.family;
      }

      // Random based on seed
      const random = getRandomFamilyVariant(this.seed);
      return random.family;
    },

    /**
     * Compute variant from props, color prop, or random
     */
    computedVariant () {
      // Icon-type avatars don't use color
      if (this.isIconType()) return undefined;

      // Explicit variant prop takes precedence
      if (this.variant !== undefined) return this.variant;

      // Color prop (converted to family/variant)
      if (this.color !== undefined) {
        const parsed = colorToFamilyVariant(this.color);
        if (parsed) return parsed.variant;
      }

      // Random based on seed
      const random = getRandomFamilyVariant(this.seed);
      return random.variant;
    },

    avatarClasses () {
      return [
        'd-avatar',
        this.$attrs.class,
        AVATAR_SIZE_MODIFIERS[this.validatedSize],
        this.avatarClass,
        {
          'd-avatar--group': this.showGroup,
          'd-avatar--group-digits-2': this.showGroup && this.group > 9 && this.group < 100,
          'd-avatar--group-digits-3': this.showGroup && this.group > 99,
          'd-avatar--clickable': this.clickable,
          'd-avatar--presence': this.presence && !this.showGroup,
        },
      ];
    },

    /**
     * Compute inline styles for fallback color
     * oklch() in CSS will override this in modern browsers
     */
    avatarStyles () {
      const styles = { ...this.$attrs.style };

      // Only compute fallback for non-icon avatars with valid family/variant
      if (!this.isIconType() && this.computedFamily && this.computedVariant !== undefined) {
        const fallbackHex = computeAvatarHex(this.computedFamily, this.computedVariant, this.anchorHue);
        styles['--avatar-color-background'] = fallbackHex;
      }

      return Object.keys(styles).length > 0 ? styles : undefined;
    },

    overlayClasses () {
      return [
        'd-avatar__overlay',
        this.overlayClass,
        { 'd-avatar__overlay-icon': this.hasOverlayIcon },
      ];
    },

    showGroup () {
      return AVATAR_GROUP_VALIDATOR(this.group);
    },

    formattedGroup () {
      return this.group > 99 ? '99+' : this.group;
    },

    validatedSize () {
      // TODO: Group only supports size 100 for now. Remove this when we support other sizes.
      return this.group ? 100 : this.size;
    },

    showImage () {
      return this.imageLoadedSuccessfully !== false && this.imageSrc;
    },
  },

  watch: {
    fullName: {
      immediate: true,
      handler () {
        this.formatInitials();
      },
    },

    size: {
      immediate: true,
      handler () {
        this.formatInitials();
      },
    },

    group: {
      immediate: true,
      handler () {
        this.formatInitials();
      },
    },

    imageSrc (newSrc) {
      this.imageLoadedSuccessfully = null;
      if (!newSrc) return;

      this.validateProps();
      this.setImageListeners();
    },
  },

  mounted () {
    this.validateProps();
    this.setImageListeners();
    this.readAnchorHue();
  },

  methods: {
    isIconType () {
      return hasSlotContent(this.$slots.icon);
    },

    async setImageListeners () {
      await this.$nextTick();
      const el = this.$refs.avatarImage;
      if (!el) return;

      el.addEventListener('load', () => this._loadedImageEventHandler(el), { once: true });
      el.addEventListener('error', () => this._erroredImageEventHandler(el), { once: true });
    },

    formatInitials () {
      const initials = extractInitialsFromName(this.fullName);
      const size = String(this.validatedSize);

      // xs/100 are too small for initials
      if (size === 'xs' || size === '100') {
        this.formattedInitials = '';
      // sm/150/200 show single initial
      } else if (size === 'sm' || size === '150' || size === '200') {
        this.formattedInitials = initials[0];
      } else {
        this.formattedInitials = initials;
      }
    },

    /**
     * Read the anchor hue from CSS custom property for fallback computation
     */
    readAnchorHue () {
      try {
        const hueValue = getComputedStyle(document.documentElement)
          .getPropertyValue('--dt-avatar-anchor-hue')
          .trim();
        this.anchorHue = parseFloat(hueValue) || 0;
      } catch {
        this.anchorHue = 0;
      }
    },

    _loadedImageEventHandler (el) {
      this.imageLoadedSuccessfully = true;
      el.classList.remove('d-d-none');
    },

    _erroredImageEventHandler (el) {
      this.imageLoadedSuccessfully = false;
      el.classList.add('d-d-none');
    },

    validateProps () {
      if (this.imageSrc && this.imageAlt === undefined) {
        console.error('image-alt required if image-src is provided. Can be set to "" (empty string) if the image is described in text nearby');
      }
    },

    handleClick (e) {
      if (!this.clickable) return;
      this.$emit('click', e);
    },
  },
};
</script>
