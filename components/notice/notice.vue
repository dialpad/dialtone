<template>
  <aside
    :class="noticeClass"
    :role="role"
    v-on="$listeners"
  >
    <hs-notice-icon
      :kind="kind"
      v-on="$listeners"
    >
      <!-- @slot Use a custom icon -->
      <slot name="icon" />
    </hs-notice-icon>
    <hs-notice-content
      :title-id="titleId"
      :content-id="contentId"
      :title="title"
      v-on="$listeners"
    >
      <template #titleOverride>
        <!-- @slot Allows you to override the title, only use this if you need
        to override with something other than text. Otherwise use the "title" prop. -->
        <slot name="titleOverride" />
      </template>
      <!-- @slot the main textual content of the notice -->
      <slot />
    </hs-notice-content>
    <hs-notice-action
      :hide-close="hideClose"
      :close-button-props="closeButtonProps"
      v-on="$listeners"
    >
      <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
      <slot name="action" />
    </hs-notice-action>
  </aside>
</template>
<script>
import HsNoticeIcon from './notice_icon';
import HsNoticeContent from './notice_content';
import HsNoticeAction from './notice_action';
import { NOTICE_KINDS } from './notice_constants.js';

export default {
  name: 'HsNotice',

  components: {
    HsNoticeIcon,
    HsNoticeContent,
    HsNoticeAction,
  },

  props: {
    /**
     * Sets an ID on the title element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the title.
     */
    titleId: {
      type: String,
      default: undefined,
    },
    /**
     * Sets an ID on the content element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the content.
     */
    contentId: {
      type: String,
      default: undefined,
    },
    /**
     * Title header of the notice. This can be left blank to remove the title from the notice entirely.
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * Used in scenarios where the message needs to visually dominate the screen.
     * This will also change the aria role from status to alert.
     */
    important: {
      type: Boolean,
      default: false,
    },
    /**
     * Severity level of the notice, sets the icon and background
     */
    kind: {
      type: String,
      default: 'base',
      validate (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },
    /**
     * Props for the notice close button.
     */
    closeButtonProps: {
      type: Object,
      default: () => ({}),
    },
    /**
     * Hides the close button from the notice
     */
    hideClose: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    noticeClass () {
      return [
        'd-notice',
        `d-notice--${this.kind}`,
        { 'd-notice--important': this.important },
      ];
    },
    role () {
      return this.important ? 'alert' : 'status';
    },
  },
};
</script>
