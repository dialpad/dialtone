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
        :class="{ 'd-notice__icon--has-title': title || $slots.title }"
        v-bind="toastListeners"
      >
        <!-- @slot Slot for custom icon -->
        <slot name="icon" />
      </dt-notice-icon>
      <dt-notice-content
        :title-id="titleId"
        :content-id="contentId"
        :title="title"
        :role="role"
        v-bind="toastListeners"
      >
        <template #title>
          <!-- @slot Slot for the title -->
          <slot name="title" />
        </template>
        <!-- @slot the main textual content of the toast -->
        <slot>
          {{ message }}
        </slot>
      </dt-notice-content>
      <dt-notice-action
        :show-action="showAction"
        :show-close="showClose"
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
import { DtNoticeIcon, DtNoticeContent, DtNoticeAction, NOTICE_KINDS } from '@/components/notice';
import { TOAST_ROLES } from '../toast_constants.js';
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
     * Sets an ID on the title element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the title.
     */
    titleId: {
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
     * Title header of the toast. This can be left blank to remove the title from the toast entirely.
     */
    title: {
      type: String,
      default: '',
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
