<template>
  <div
    v-if="isShown"
    :class="[
      'd-toast',
      kindClass,
      $attrs.class,
      { 'd-toast--important': important },
    ]"
    data-qa="dt-toast"
    :aria-hidden="(!isShown).toString()"
  >
    <div class="d-toast__dialog">
      <dt-notice-icon
        v-if="showIcon"
        :kind="kind"
        :icon-class="iconClass"
        :class="{ 'd-notice__icon--has-title': headerText || $slots.header }"
        v-bind="toastListeners"
      >
        <!-- @slot Slot for custom icon -->
        <slot name="icon" />
      </dt-notice-icon>
      <dt-notice-content
        :header-id="headerId"
        :content-id="contentId"
        :header-text="headerText"
        :message="message"
        :header-class="headerClass"
        :content-class="contentClass"
        :role="role"
        v-bind="toastListeners"
      >
        <template #header>
          <!-- @slot Slot for the header -->
          <slot name="header" />
        </template>
        <!-- @slot the main textual content of the toast -->
        <slot />
      </dt-notice-content>
      <dt-notice-action
        :show-action="showAction"
        :show-close="showClose"
        :action-class="actionClass"
        v-bind="toastListeners"
        @close="$emit('close')"
      >
        <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
        <slot name="action" />
      </dt-notice-action>
    </div>
  </div>
</template>

<script>
import utils from '@/common/utils';
import { DtNoticeIcon, DtNoticeContent, DtNoticeAction, NOTICE_KINDS } from '@/components/Notice';
import { TOAST_ROLES } from '../ToastConstants.js';
import { extractVueListeners } from '@/common/utils/index.js';

export default {
  name: 'ToastLayoutDefault',

  components: {
    DtNoticeIcon,
    DtNoticeContent,
    DtNoticeAction,
  },

  inheritAttrs: false,

  props: {
    isShown: {
      type: Boolean,
      default: false,
    },

    /**
     * Sets an ID on the header element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the header.
     */
    headerId: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    /**
     * Sets an ID on the content element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the content.
     */
    contentId: {
      type: String,
      default () { return utils.getUniqueString(); },
    },

    /**
     * Header text of the toast. This can be left blank to remove the header from the toast entirely.
     */
    headerText: {
      type: String,
      default: undefined,
    },

    /**
     * Message of the toast. Overridden by default slot.
     */
    message: {
      type: String,
      default: '',
    },

    /**
     * Provides a role for the toast. 'status' is used by default to communicate a message. 'alert' is used to
     * communicate an important message like an error that does not contain any interactive elements.
     * @values status, alert
     */
    role: {
      type: String,
      default: 'status',
      validator: (role) => {
        return TOAST_ROLES.includes(role);
      },
    },

    /**
     * Severity level of the toast, sets the icon and background
     * @values base, critical, info, positive, warning
     */
    kind: {
      type: String,
      default: 'base',
      validator: (kind) => {
        return NOTICE_KINDS.includes(kind);
      },
    },

    /**
     * Used in scenarios where the message needs to visually dominate the screen.
     * @values true, false
     */
    important: {
      type: Boolean,
      default: false,
    },

    /**
     * Shows the close button in the toast
     * @values true, false
     */
    showClose: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the icon in the toast
     * @values true, false
     */
    showIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the action in the toast
     * @values true, false
     */
    showAction: {
      type: Boolean,
      default: true,
    },

    /**
     * Additional class name for the icon wrapper element.
     */
    iconClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the header wrapper element.
     */
    headerClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Additional class name for the action wrapper element.
     */
    actionClass: {
      type: [String, Array, Object],
      default: '',
    },
  },

  emits: ['close'],

  computed: {
    kindClass () {
      const kindClasses = {
        critical: 'd-toast--critical',
        info: 'd-toast--info',
        positive: 'd-toast--positive',
        warning: 'd-toast--warning',
        base: 'd-toast--base',
      };

      return kindClasses[this.kind];
    },

    toastListeners () {
      return extractVueListeners(this.$attrs);
    },
  },
};
</script>
