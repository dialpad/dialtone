<template>
  <aside
    :class="noticeClass"
    data-qa="notice"
  >
    <dt-notice-icon
      :kind="kind"
    >
      <!-- @slot Slot for custom icon -->
      <slot name="icon" />
    </dt-notice-icon>
    <dt-notice-content
      :title-id="titleId"
      :content-id="contentId"
      :title="title"
      :role="role"
      v-on="$listeners"
    >
      <template #titleOverride>
        <!-- @slot Allows you to override the title, only use this if you need
        to override with something other than text. Otherwise use the "title" prop. -->
        <slot name="titleOverride" />
      </template>
      <!-- @slot the main textual content of the notice -->
      <slot />
    </dt-notice-content>
    <dt-notice-action
      :hide-close="hideClose"
      :close-button-props="closeButtonProps"
      :visually-hidden-close="visuallyHiddenClose"
      :visually-hidden-close-label="visuallyHiddenCloseLabel"
      v-on="$listeners"
    >
      <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
      <slot name="action" />
    </dt-notice-action>
  </aside>
</template>

<script>
import DtNoticeIcon from './notice_icon';
import DtNoticeContent from './notice_content';
import DtNoticeAction from './notice_action';
import { NOTICE_KINDS, NOTICE_ROLES } from './notice_constants.js';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';

/**
 * A notice is an informational and assistive message that appears inline with content.
 * @see https://dialpad.design/components/notice.html
 */
export default {
  name: 'DtNotice',

  components: {
    DtNoticeIcon,
    DtNoticeContent,
    DtNoticeAction,
  },

  mixins: [SrOnlyCloseButtonMixin],

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
     * Provides a role for the notice. 'status' is used to communicate a message. 'alert' is used to communicate an
     * important message that does not contain any interactive elements. 'alertdialog' is used to communicate an
     * important message that does contain interactive elements.
     * @values alert, alertdialog, status
     */
    role: {
      type: String,
      default: 'status',
      validate (role) {
        return NOTICE_ROLES.includes(role);
      },
    },

    /**
     * Used in scenarios where the message needs to visually dominate the screen.
     * This will also change the aria role from status to alert.
     * @values true, false
     */
    important: {
      type: Boolean,
      default: false,
    },

    /**
     * Severity level of the notice, sets the icon and background
     * @values base, error, info, success, warning
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
     * @values true, false
     */
    hideClose: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Close button click event
     *
     * @event close
     */
    'close',
  ],

  computed: {
    noticeClass () {
      const noticeKinds = {
        error: 'd-notice--error',
        info: 'd-notice--info',
        success: 'd-notice--success',
        warning: 'd-notice--warning',
        base: 'd-notice--base',
      };
      return [
        'd-notice',
        noticeKinds[this.kind],
        { 'd-notice--important': this.important },
      ];
    },
  },
};
</script>
