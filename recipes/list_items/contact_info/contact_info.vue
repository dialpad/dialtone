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
          size="lg"
        >
          <img
            data-qa="dt-contact-avatar"
            :src="avatarSrc"
            :alt="avatarInitials"
          >
        </dt-avatar>
        <dt-avatar
          v-else-if="avatarInitials"
          size="lg"
        >
          {{ avatarInitials }}
        </dt-avatar>
        <div
          v-if="showUserStatus"
          :class="[
            'd-ba',
            'd-bc-white',
            'd-baw2',
            'd-bar2',
            'd-ps-absolute',
            'd-bn1',
            'd-rn1',
            'd-w20p',
            'd-h20p',
            USER_STATUS_COLOR_MODIFIERS[userStatusColor],
          ]"
          data-qa="contact-info-user-status"
        >
          &nbsp;
        </div>
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
import { USER_STATUS_COLOR_MODIFIERS } from './contact_info_constants';
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
     */
    userStatusColor: {
      type: String,
      default: 'none',
      validator: (color) => Object.keys(USER_STATUS_COLOR_MODIFIERS).includes(color),
    },
  },

  data () {
    return {
      USER_STATUS_COLOR_MODIFIERS,
    };
  },

  computed: {
    showUserStatus () {
      return this.userStatusColor !== 'none';
    },
  },
};
</script>
