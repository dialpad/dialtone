<template>
  <dt-item-layout
    :role="role"
    data-qa="contact-info"
    class="d-recipe-contact-info"
    content-class="d-recipe-contact-info__content"
    right-class="d-recipe-contact-info__right"
    unstyled
  >
    <template
      v-if="showAvatar"
      #left
    >
      <button
        class="d-recipe-contact-info__left"
        data-qa="contact-info-left"
        :aria-labelledby="avatarLabelledBy"
        @click="avatarClick"
      >
        <span
          v-if="avatarList"
          class="d-recipe-contact-info__avatars"
        >
          <dt-avatar
            v-for="(avatar, index) in avatarList"
            :key="index"
            :size="avatarSize"
            :seed="avatar.seed"
            :full-name="avatar.fullName"
            :image-src="avatar.src"
            image-alt=""
            :overlay-text="avatar.text"
            :avatar-class="[
              {
                'd-recipe-contact-info__avatar-stacked': index > 0,
                'd-recipe-contact-info__avatar-halo': !!avatar.halo,
              },
            ]"
          >
            <template #icon="{ iconSize }">
              <!-- @slot Slot for avatar icon in a list -->
              <slot
                name="avatarIcon"
                :icon-size="iconSize"
              />
            </template>
            <template
              v-if="avatar.icon"
              #overlayIcon
            >
              <component :is="avatar.icon" />
            </template>
          </dt-avatar>
        </span>
        <dt-avatar
          v-else
          :size="avatarSize"
          :full-name="avatarFullName"
          :image-src="avatarSrc"
          image-alt=""
          :seed="avatarSeed"
          :color="avatarColor"
          :presence="presence"
        >
          <template #icon="{ iconSize }">
            <!-- @slot Slot for avatar icon in a list -->
            <slot
              name="avatarIcon"
              :icon-size="iconSize"
            />
          </template>
        </dt-avatar>
      </button>
    </template>
    <template #default>
      <div
        class="d-recipe-contact-info__header"
        data-qa="contact-info-header"
      >
        <!-- @slot Slot for header information -->
        <slot name="header" />
      </div>
    </template>

    <template #subtitle>
      <div
        class="d-recipe-contact-info__subtitle"
        data-qa="contact-info-subtitle"
      >
        <!-- @slot Slot for subtitle information -->
        <slot name="subtitle" />
      </div>
    </template>

    <template
      v-if="$slots.bottom"
      #bottom
    >
      <div
        class="d-recipe-contact-info__bottom"
        data-qa="contact-info-bottom"
      >
        <!-- @slot Slot for information at the bottom -->
        <slot name="bottom" />
      </div>
    </template>

    <template
      v-if="$slots.right"
      #right
    >
      <div data-qa="contact-info-right">
        <!-- @slot Slot for the right content -->
        <slot name="right" />
      </div>
    </template>
  </dt-item-layout>
</template>

<script>
import DtItemLayout from '@/components/item_layout/item_layout.vue';
import DtAvatar from '@/components/avatar/avatar.vue';

export default {
  name: 'DtRecipeContactInfo',

  components: {
    DtAvatar,
    DtItemLayout,
  },

  /* inheritAttrs: false is generally an option we want to set on library
    components. This allows any attributes passed in that are not recognized
    as props to be passed down to another element or component using v-bind:$attrs
    more info: https://vuejs.org/v2/api/#inheritAttrs */
  // inheritAttrs: false,

  props: {
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
     * Avatar's full name, used to extract initials
     * to display in avatar if `avatarSrc` and `avatarIcon` are empty.
     */
    avatarFullName: {
      type: String,
      default: '',
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
     * The aria-labelledby of the button containing avatars
     */
    avatarLabelledBy: {
      type: String,
      default: '',
    },

    /**
     * Avatar color to display if `avatarSrc` is empty.
     */
    avatarColor: {
      type: String,
      default: null,
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
     * `fullName` - full name, used to extract initials to display in avatar<br>
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
