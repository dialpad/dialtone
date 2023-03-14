<template>
  <dt-list-item
    :id="id"
    :role="role"
    element-type="div"
    data-qa="contact-info"
  >
    <template #left>
      <div
        class="d-ps-relative"
        data-qa="contact-info-left"
      >
        <dt-avatar
          v-if="avatarSrc"
          :size="avatarSize"
          :presence="presence"
        >
          <img
            data-qa="dt-contact-avatar"
            :src="avatarSrc"
            :alt="avatarInitials"
          >
        </dt-avatar>
        <dt-avatar
          v-else-if="avatarInitials"
          :size="avatarSize"
          :presence="presence"
        >
          {{ avatarInitials }}
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
import DtListItem from '@/components/list_item/list_item';
import DtAvatar from '@/components/avatar/avatar';
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
     * Optional avatar image url.
     * if provided, it's also required to provide a value in the `avatarInitials` prop to use
     * in the alt attribute of the avatar.
     */
    avatarSrc: {
      type: String,
      default: '',
    },

    /**
     * Initial letters to display in avatar if `avatarSrc` is empty.
     */
    avatarInitials: {
      type: String,
      default: '',
    },

    /**
     * Status color of user from contact.
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
  },
};
</script>
