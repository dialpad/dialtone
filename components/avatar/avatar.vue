<template>
  <div
    :id="id"
    :class="avatarClasses"
    data-qa="dt-avatar"
  >
    <div
      ref="canvas"
      :class="[canvasClass, 'd-avatar__canvas', { 'd-avatar--image-loaded': imageLoadedSuccessfully }]"
    >
      <img
        v-if="showImage"
        ref="avatarImage"
        class="d-avatar__image"
        data-qa="dt-avatar-image"
        :src="imageSrc"
        :alt="imageAlt || fullName"
      >
      <dt-icon
        v-else-if="iconName"
        :name="iconName"
        :size="iconSize"
        :class="[iconClass, AVATAR_KIND_MODIFIERS.icon]"
        data-qa="dt-avatar-icon"
      />
      <span
        v-else
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
        class="d-avatar__overlay-icon"
        :name="overlayIcon"
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
  </div>
</template>

<script>
import { getUniqueString, getRandomElement } from '@/common/utils';
import { DtPresence } from '../presence';
import { DtIcon } from '@/components/icon';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_COLORS,
  AVATAR_GROUP_VALIDATOR,
} from './avatar_constants';
import { getIconNames } from '@/common/storybook_utils.js';
import { ICON_SIZE_MODIFIERS } from '@/components/icon/icon_constants.js';
import { extractInitialsFromName } from './utils';

const ICONS_LIST = getIconNames();

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

    /**
     * Source of the image
     */
    imageSrc: {
      type: String,
      default: '',
    },

    /**
     * Alt attribute of the image, by default
     * it'd be the full name
     */
    imageAlt: {
      type: String,
      default: '',
    },

    /**
     * Icon name to be displayed on the avatar
     */
    iconName: {
      type: String,
      default: undefined,
      validator: (name) => ICONS_LIST.includes(name),
    },

    /**
     * Icon size to be displayed on the avatar
     * @values 100, 200, 300, 400, 500, 600, 700, 800
     */
    iconSize: {
      type: String,
      default: '500',
      validator: (size) => Object.keys(ICON_SIZE_MODIFIERS).includes(size),
    },

    /**
     * Full name used to extract initials and set alt attribute.
     */
    fullName: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      AVATAR_SIZE_MODIFIERS,
      AVATAR_KIND_MODIFIERS,
      AVATAR_PRESENCE_SIZE_MODIFIERS,
      imageLoadedSuccessfully: null,
      formattedInitials: '',
      initializing: false,
    };
  },

  computed: {
    isNotIconType () {
      return !this.iconName;
    },

    avatarClasses () {
      return [
        'd-avatar',
        AVATAR_SIZE_MODIFIERS[this.validatedSize],
        this.avatarClass,
        {
          'd-avatar--group': this.showGroup,
          [`d-avatar--color-${this.getColor()}`]: this.isNotIconType,
        },
      ];
    },

    overlayClasses () {
      return [
        'd-avatar__overlay',
        this.overlayClass,
      ];
    },

    showGroup () {
      return AVATAR_GROUP_VALIDATOR(this.group);
    },

    formattedGroup () {
      return this.group > 99 ? '99+' : this.group;
    },

    validatedSize () {
      // TODO: Group only supports xs size for now. Remove this when we support other sizes.
      return this.group ? 'xs' : this.size;
    },

    showImage () {
      return this.imageLoadedSuccessfully !== false && this.imageSrc;
    },
  },

  watch: {
    fullName: {
      immediate: true,
      handler (newName) {
        this.formatInitials(newName);
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
    async setImageListeners () {
      await this.$nextTick();
      const el = this.$refs.avatarImage;
      if (!el) return;

      el.addEventListener('load', () => this._loadedImageEventHandler(el), { once: true });
      el.addEventListener('error', () => this._erroredImageEventHandler(el), { once: true });
    },

    formatInitials (string) {
      const initials = extractInitialsFromName(string);

      if (this.validatedSize === 'xs') {
        this.formattedInitials = '';
      } else if (this.validatedSize === 'sm') {
        this.formattedInitials = initials[0];
      } else {
        this.formattedInitials = initials;
      }
    },

    getColor () {
      return this.color ?? getRandomElement(AVATAR_COLORS, this.seed);
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
      if (this.imageSrc && !(this.fullName || this.imageAlt)) {
        throw new Error('full-name or image-alt must be set if image-src is provided');
      }
    },
  },
};
</script>

<style lang="less">
//TODO: Move these classes to dialtone and document.

.d-avatar--image-loaded {
  background-color: transparent;
  background-image: unset;
}

.d-avatar__count {
  z-index: var(--zi-base);
}

.d-avatar__presence {
  z-index: var(--zi-base);
}

.d-avatar__overlay {
  background-color: var(--dt-color-surface-contrast-opaque);
  opacity: var(--dt-opacity-900);
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dt-size-radius-circle);
  z-index: var(--zi-base);
}

.d-avatar__overlay-icon {
  color: var(--dt-color-foreground-primary-inverted);
  width: 100%;
}

.d-avatar__overlay-text {
  color: var(--dt-color-foreground-primary-inverted);
  font-weight: var(--dt-font-weight-bold);
  font-size: var(--dt-font-size-200);
  width: 100%;
  text-align: center;
}
</style>
