<template>
  <component
    :is="clickable ? 'button' : 'div'"
    :id="id"
    :class="avatarClasses"
    data-qa="dt-avatar"
    v-bind="groupCountDataAttr"
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
    <svg
      v-if="includeClipPath"
      width="0"
      height="0"
      class="d-avatar__clip"
    >
      <defs>
        <!-- AVATAR PRESENCE CLIPS -->
        <clipPath
          v-if="presence && validatedSize === 'xs'"
          id="dt-avatar-xs-presence-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.57454
              C0.96524 0.56226 0.92785 0.55556 0.88889 0.55556
              C0.70479 0.55556 0.55556 0.70479 0.55556 0.88889
              C0.55556 0.92786 0.56231 0.96524 0.5746 1
              H0V0H1V0.57454Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'xs' && clickable"
          id="dt-avatar-xs-presence-clickable-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.59019
              C0.95587 0.56465 0.90465 0.55 0.85 0.55
              C0.68431 0.55 0.55 0.68431 0.55 0.85
              C0.55 0.90466 0.56469 0.95586 0.59023 1
              H0V0H1V0.59019Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'sm'"
          id="dt-avatar-sm-presence-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.64701
              C0.95565 0.60754 0.8807 0.58333 0.83333 0.58333
              C0.69391 0.58333 0.58333 0.69391 0.58333 0.83333
              C0.58333 0.88071 0.60759 0.95565 0.64705 1
              H0V0H1V0.64701Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'sm' && clickable"
          id="dt-avatar-sm-presence-clickable-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.68025
              C0.9585 0.61792 0.88735 0.57692 0.80769 0.57692
              C0.66727 0.57692 0.57692 0.66727 0.57692 0.80769
              C0.57692 0.88736 0.61796 0.9585 0.68033 1
              H0V0H1V0.68025Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'md'"
          id="dt-avatar-md-presence-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.73996
              C0.96641 0.68962 0.90897 0.65625 0.84375 0.65625
              C0.73978 0.65625 0.65625 0.73978 0.65625 0.84375
              C0.65625 0.90898 0.68964 0.96641 0.74002 1
              H0V0H1V0.73996Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'md' && clickable"
          id="dt-avatar-md-presence-clickable-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.82353
              C1 0.72607 0.921 0.64706 0.82353 0.64706
              C0.72607 0.64706 0.64706 0.72607 0.64706 0.82353
              C0.64706 0.921 0.72607 1 0.82353 1
              H0V0H1V0.82353Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'lg'"
          id="dt-avatar-lg-presence-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 1H0V0H1V1Z
              M0.85417 0.72917
              C0.78513 0.72917 0.72917 0.78513 0.72917 0.85417
              C0.72917 0.9232 0.78513 0.97917 0.85417 0.97917
              C0.9232 0.97917 0.97917 0.9232 0.97917 0.85417
              C0.97917 0.78513 0.9232 0.72917 0.85417 0.72917Z
            "
          />
        </clipPath>
        <clipPath
          v-if="presence && validatedSize === 'lg' && clickable"
          id="dt-avatar-lg-presence-clickable-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 1H0V0H1V1Z
              M0.84 0.72
              C0.77373 0.72 0.72 0.77373 0.72 0.84
              C0.72 0.90627 0.77373 0.96 0.84 0.96
              C0.90627 0.96 0.96 0.90627 0.96 0.84
              C0.96 0.77373 0.90627 0.72 0.84 0.72Z
            "
          />
        </clipPath>
        <!-- AVATAR GROUP CLIPS -->
        <clipPath
          v-if="
            showGroup &&
              groupCountDataAttr['data-group-count'] !== 'double' &&
              groupCountDataAttr['data-group-count'] !== 'triple'
          "
          id="dt-avatar-group-single-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.44759C0.98176 0.44557 0.96212 0.44444 0.94444 0.44444
              C0.66817 0.44444 0.44444 0.66817 0.44444 0.94444
              C0.44444 0.96212 0.44557 0.98176 0.44759 1H0V0H1V0.44759Z
            "
          />
        </clipPath>
        <clipPath
          v-if="showGroup && groupCountDataAttr['data-group-count'] === 'double'"
          id="dt-avatar-group-double-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.44759
              C0.98176 0.44557 0.96323 0.44444 0.94444 0.44444
              H0.72222
              C0.44608 0.44444 0.22222 0.6683 0.22222 0.94444
              C0.22222 0.96323 0.22335 0.98176 0.22537 1
              H0V0H1V0.44759Z
            "
          />
        </clipPath>
        <clipPath
          v-if="showGroup && groupCountDataAttr['data-group-count'] === 'triple'"
          id="dt-avatar-group-triple-clip"
          clipPathUnits="objectBoundingBox"
        >
          <path
            clip-rule="evenodd"
            d="
              M1 0.44759C0.98176 0.44557 0.96211 0.44444 0.94444 0.44444
              H0.27778C0.175 0.44444 0.07945 0.47546 0 0.52868
              V0H1V0.44759Z
            "
          />
        </clipPath>
      </defs>
    </svg>
  </component>
</template>

<script>
import { getUniqueString, getRandomElement } from '@/common/utils';
import { DtPresence } from '../presence';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_RANDOM_COLORS,
  AVATAR_GROUP_VALIDATOR,
  AVATAR_ICON_SIZES,
} from './avatar_constants';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants.js';
import { extractInitialsFromName } from './utils';

/**
 * An avatar is a visual representation of a user or object.
 * @see https://dialtone.dialpad.com/components/avatar.html
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
     * Set the avatar background to a specific color. If undefined will randomize the color which can be deterministic
     * if the seed prop is set.
     */
    color: {
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
     * Limit to 2 digits max, more than 99 will be rendered as “99+”.
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
    };
  },

  computed: {
    hasOverlayIcon () {
      return !!this.$slots.overlayIcon;
    },

    iconDataQa () {
      return 'dt-avatar-icon';
    },

    avatarClasses () {
      return [
        'd-avatar',
        AVATAR_SIZE_MODIFIERS[this.validatedSize],
        this.avatarClass,
        {
          'd-avatar--group': this.showGroup,
          [`d-avatar--color-${this.getColor()}`]: !this.isIconType(),
          'd-avatar--clickable': this.clickable,
        },
      ];
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

    groupCountDataAttr () {
      if (!this.showGroup) return null;

      let countCategory;
      if (this.group <= 9) {
        countCategory = 'single';
      } else if (this.group <= 99) {
        countCategory = 'double';
      } else {
        countCategory = 'triple';
      }

      return { 'data-group-count': countCategory };
    },

    validatedSize () {
      // TODO: Group only supports xs size for now. Remove this when we support other sizes.
      return this.group ? 'xs' : this.size;
    },

    showImage () {
      return this.imageLoadedSuccessfully !== false && this.imageSrc;
    },

    includeClipPath () {
      return this.showGroup || (this.presence && this.presence !== 'none');
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
  },

  methods: {
    isIconType () {
      return this.$scopedSlots.icon && this.$scopedSlots.icon();
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

      if (this.validatedSize === 'xs') {
        this.formattedInitials = '';
      } else if (this.validatedSize === 'sm') {
        this.formattedInitials = initials[0];
      } else {
        this.formattedInitials = initials;
      }
    },

    getColor () {
      return this.color ?? getRandomElement(AVATAR_RANDOM_COLORS, this.seed);
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
