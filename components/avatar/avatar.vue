<template>
  <div
    :id="id"
    :class="avatarClasses"
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
import { DtIcon } from '@/components/icon';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_COLORS,
  AVATAR_GROUP_VALIDATOR,
} from './avatar_constants';

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
      internalColor: '',
    };
  },

  computed: {
    avatarClasses () {
      return [
        'd-avatar',
        AVATAR_SIZE_MODIFIERS[this.validatedSize],
        this.avatarClass,
        {
          'd-avatar--group': this.showGroup,
          [`d-avatar--color-${this.internalColor}`]: this.kind !== 'icon' && this.internalColor,
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

    formattedGroup () {
      return this.group > 99 ? '99+' : this.group;
    },

    validatedSize () {
      // TODO: Group only supports xs size for now. Remove this when we support other sizes.
      return this.group ? 'xs' : this.size;
    },
  },

  watch: {
    color: {
      handler: function () {
        this.getColor();
      },

      immediate: true,
    },

    seed: {
      handler: function () {
        this.getColor();
      },

      immediate: true,
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

    async getColor () {
      const color = this.color ?? await getRandomElement(AVATAR_COLORS, this.seed);
      this.internalColor = color;
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
