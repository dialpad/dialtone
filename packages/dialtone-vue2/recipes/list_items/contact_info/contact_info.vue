<template>
  <dt-list-item
    :id="id"
    :role="role"
    element-type="div"
    data-qa="contact-info"
    class="dt-contact-info"
  >
    <template #left>
      <button
        v-if="showAvatar"
        class="dt-contact-info__left"
        data-qa="contact-info-left"
        :aria-labelledby="avatarAriaLabel"
        @click="avatarClick"
      >
        <span
          v-if="avatarList"
          class="dt-contact-info--avatars"
        >
          <dt-avatar
            v-for="(avatar, index) in avatarList"
            :key="index"
            :size="avatarSize"
            :seed="avatar.seed"
            :full-name="avatar.fullName"
            :image-src="avatar.src"
            :icon-name="avatarIcon"
            :overlay-icon="avatar.icon"
            :overlay-text="avatar.text"
            :avatar-class="[{ 'd-mln24': index > 0, 'd-bc-brand': !!avatar.halo }]"
          />
        </span>
        <dt-avatar
          v-else
          :size="avatarSize"
          :full-name="avatarFullName"
          :image-src="avatarSrc"
          :icon-name="avatarIcon"
          :seed="avatarSeed"
          :presence="presence"
        />
      </button>
    </template>
    <template #default>
      <div data-qa="contact-info-header">
        <!-- @slot Slot for header information -->
        <slot name="header" />
      </div>
    </template>

    <template #subtitle>
      <div data-qa="contact-info-subtitle">
        <!-- @slot Slot for subtitle information -->
        <slot name="subtitle" />
      </div>
    </template>

    <template #bottom>
      <div data-qa="contact-info-bottom">
        <!-- @slot Slot for information at the bottom -->
        <slot name="bottom" />
      </div>
    </template>

    <template #right>
      <div data-qa="contact-info-right">
        <!-- @slot Slot for the right content -->
        <slot name="right" />
      </div>
    </template>
  </dt-list-item>
</template>

<script>
import DtListItem from '@/components/list_item/list_item.vue';
import DtAvatar from '@/components/avatar/avatar.vue';
import utils from '@/common/utils';

export default {
  name: 'DtRecipeContactInfo',

  components: {
    DtAvatar,
    DtListItem,
  },

  /* inheritAttrs: false is generally an option we want to set on library
    components. This allows any attributes passed in that are not recognized
    as props to be passed down to another element or component using v-bind:$attrs
    more info: https://vuejs.org/v2/api/#inheritAttrs */
  // inheritAttrs: false,

  props: {
    /**
     * Id for the item.
     */
    id: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    /**
     * String to use for the item's role.
     */
    role: {
      type: String,
      default: '',
    },

    /**
     * Display avatar if `showAvatar` property is true.
     */
    showAvatar: {
      type: Boolean,
      default: true,
    },

    /**
     * Optional avatar image url.
     */
    avatarSrc: {
      type: String,
      default: '',
    },

    /**
     * Avatar seed, set this to the user's ID to get the same avatar background gradient each time it is displayed.
     */
    avatarSeed: {
      type: String,
      default: null,
    },

    /**
     * Avatar's full name, used as alt attribute for image and
     * to extract initials to display in avatar if `avatarSrc` and `avatarIcon` are empty.
     */
    avatarFullName: {
      type: String,
      default: '',
    },

    /**
     * Avatar icon to display if `avatarSrc` is empty.
     */
    avatarIcon: {
      type: String,
      default: null,
    },

    /**
     * The size of the avatar
     * @values xs, sm, md, lg, xl
     */
    avatarSize: {
      type: String,
      default: 'lg',
    },

    /**
     * The aria label of the avatar
     */
    avatarAriaLabel: {
      type: String,
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
      default: null,
    },

    /**
     * Showing multiple avatars in contact info.
     * The props of array items are: <br>
     * `src` - avatar image url (optional) <br>
     * `fullName` - full name, used as alt attribute for image and extract initials to display in avatar<br>
     *  if `avatarSrc` and `avatarIcon` are empty<br>
     * `seed` - determines uniqueness of avatar background <br>
     * `text` - text that overlays the avatar (optional) <br>
     * `icon` - icon that overlays the avatar (optional) <br>
     * `halo` - halo highlight around the avatar. boolean true/false
     */
    avatarList: {
      type: Array,
      default: null,
    },
  },

  emits: ['avatar-click'],

  methods: {
    avatarClick () {
      this.$emit('avatar-click');
    },
  },
};
</script>

<style lang="less" scoped>
.dt-contact-info {
  --contact-info-avatar-border-color: var(--dt-color-surface-primary);

  display: flex;

  &:deep(.dt-item-layout) {
    flex: 1 1 0;
  }

  &:deep(.dt-item-layout--content) {
    /*
    DP-74536: Add `min-width` to make the width of "contact info" adjustable.
    */
    min-width: var(--dt-space-825);
  }

  &:deep(.dt-item-layout--left) {
    /*
    DP-74536: To make 'Avatar' in fixed position when resizing the window.
    */
    min-width: var(--dt-space-650);
    justify-content: flex-start;
    align-items: center;
  }

  &:deep(.dt-item-layout--right) {
    /*
    DP-74536: Remove `min-width` which cause extra unused empty space on the right of "contact info".
    */
    min-width: 0;
    align-items: center;
  }

  &__left {
    position: relative;
    background-color: transparent;
    background-image: none;
    border-width: 0;
    cursor: pointer;
  }

  &--avatars {
    margin-right: var(--dt-space-300-negative);
    display: flex;
    flex-direction: row;

    .d-avatar {
      border-radius: var(--dt-size-radius-pill);
      border: var(--dt-size-300) solid var(--contact-info-avatar-border-color);
      box-sizing: unset;
    }
  }
}
</style>
