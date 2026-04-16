<template>
  <aside
    :class="noticeClass"
    data-qa="notice"
  >
    <dt-notice-icon
      v-if="showIcon"
      :kind="kind"
      :class="{ 'd-notice__icon--has-title': headerText || $slots.header }"
    >
      <!-- @slot Slot for custom icon -->
      <slot name="icon" />
    </dt-notice-icon>
    <dt-notice-content
      :header-id="headerId"
      :content-id="contentId"
      :header-text="headerText"
      :role="role"
    >
      <template #header>
        <!-- @slot Slot for the header -->
        <slot name="header" />
      </template>
      <!-- @slot the main textual content of the notice -->
      <slot />
    </dt-notice-content>
    <dt-notice-action
      :show-action="showAction"
      :show-close="showClose"
      @close="$emit('close')"
    >
      <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
      <slot name="action" />
    </dt-notice-action>
  </aside>
</template>

<script>
import DtNoticeIcon from './notice_icon.vue';
import DtNoticeContent from './notice_content.vue';
import DtNoticeAction from './notice_action.vue';
import { NOTICE_KINDS, NOTICE_ROLES } from './notice_constants';

/**
 * A notice is an informational and assistive message that appears inline with content.
 * @see https://dialtone.dialpad.com/components/notice.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtNotice',

  components: {
    DtNoticeIcon,
    DtNoticeContent,
    DtNoticeAction,
  },

  props: {
    /**
     * Sets an ID on the header element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the header.
     */
    headerId: {
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
     * Header text of the notice. This can be left blank to remove the header from the notice entirely.
     */
    headerText: {
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
     * @values base, critical, info, positive, warning
     */
    kind: {
      type: String,
      default: 'base',
      validator (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },

    /**
     * Shows the close button in the notice
     * @values true, false
     */
    showClose: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the icon in the notice
     * @values true, false
     */
    showIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the action in the notice
     * @values true, false
     */
    showAction: {
      type: Boolean,
      default: true,
    },

    /**
     * Truncates the content instead of wrapping.
     * Used when the notice needs to have a fixed height.
     * @values true, false
     */
    truncateText: {
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

    /**
     * Native button click event
     *
     * @event click
     * @type {PointerEvent | KeyboardEvent}
     */
    'click',
  ],

  computed: {
    noticeClass () {
      const noticeKinds = {
        critical: 'd-notice--critical',
        info: 'd-notice--info',
        positive: 'd-notice--positive',
        warning: 'd-notice--warning',
        base: 'd-notice--base',
      };
      return [
        'd-notice',
        noticeKinds[this.kind],
        { 'd-notice--important': this.important, 'd-notice--truncate': this.truncateText },
      ];
    },
  },
};
</script>
