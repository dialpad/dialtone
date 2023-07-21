<template>
  <dt-list-item
    :id="id"
    :role="role"
    element-type="div"
    data-qa="contact-info"
    class="dt-contact-info"
  >
    <template #left>
      <div
        v-if="showAvatar"
        class="d-ps-relative"
        data-qa="contact-info-left"
      >
        <div
          v-if="avatarList"
          class="d-mrn4 d-d-flex d-fd-row"
        >
          <div
            v-for="(avatar, index) in avatarList"
            :key="index"
          >
            <dt-avatar
              :size="avatarSize"
              :seed="avatar.seed"
              :initials="avatar.initials"
              :overlay-icon="avatar.icon"
              :overlay-text="avatar.text"
              overlay-class="d-mn4 d-ba d-baw4 d-bc-black-100 d-box-unset"
              :avatar-class="['d-baw4 d-bar-pill d-ba d-bc-black-100', {
                'd-mln24': index > 0,
                'd-bc-brand': !!avatar.halo,
              }]"
            >
              <img
                v-if="avatar.src"
                data-qa="dt-contact-avatar"
                :src="avatar.src"
                :alt="avatar.initials"
              >
              <div v-else-if="avatar.initials">
                {{ avatar.initials }}
              </div>
              <dt-icon
                v-else
                :name="avatarIcon"
              />
            </dt-avatar>
          </div>
        </div>
        <dt-avatar
          v-else
          :size="avatarSize"
          :initials="avatarInitials"
          :seed="avatarSeed"
          :presence="presence"
        >
          <img
            v-if="avatarSrc"
            data-qa="dt-contact-avatar"
            :src="avatarSrc"
            :initials="avatarInitials"
            :seed="avatarSeed"
            :alt="avatarInitials"
          >
          <div v-else-if="avatarInitials">
            {{ avatarInitials }}
          </div>
          <dt-icon
            v-else
            :name="avatarIcon"
          />
        </dt-avatar>
      </div>
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
import DtIcon from '@/components/icon/icon.vue';
import utils from '@/common/utils';

export default {
  name: 'DtRecipeContactInfo',

  components: {
    DtAvatar,
    DtIcon,
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
     * if provided, it's also required to provide a value in the `avatarInitials` prop to use
     * in the alt attribute of the avatar.
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
     * Initial letters to display in avatar if `avatarSrc` is empty.
     */
    avatarInitials: {
      type: String,
      default: '',
    },

    /**
     * Avatar icon to display if `avatarSrc` and `avatarInitials` are empty.
     */
    avatarIcon: {
      type: String,
      default: 'user',
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
     * `initials` - Initial letters to display in avatar (required if src is empty)<br>
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
};
</script>

<style scoped>
.dt-contact-info :deep(.dt-item-layout--content) {
  /*
  DP-74536: Add `min-width` to make the width of "contact info" adjustable.
  */
  min-width: var(--space-825);
}
.dt-contact-info :deep(.dt-item-layout--left) {
  /*
  DP-74536: To make 'Avatar' in fixed position when resizing the window.
  */
  min-width: var(--space-650);
  justify-content: flex-start;
}
.dt-contact-info :deep(.dt-item-layout--right) {
  /*
  DP-74536: Remove `min-width` which cause extra unused empty space on the right of "contact info".
  */
  min-width: 0;
}
</style>
