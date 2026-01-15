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
        v-if="!hideIcon"
        :kind="kind"
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
        <template #titleOverride>
          <!-- @slot Allows you to override the title, only use this if you need to override
          with something other than text. Otherwise use the "title" prop. -->
          <slot name="titleOverride" />
        </template>
        <!-- @slot the main textual content of the toast -->
        <slot>
          {{ message }}
        </slot>
      </dt-notice-content>
      <dt-notice-action
        :hide-action="hideAction"
        :hide-close="hideClose"
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
     * @values base, error, info, success, warning
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
     * Hides the close button from the toast
     * @values true, false
     */
    hideClose: {
      type: Boolean,
      default: false,
    },

    /**
     * Hides the icon from the notice
     * @values true, false
     */
    hideIcon: {
      type: Boolean,
      default: false,
    },

    /**
     * Hides the action from the notice
     * @values true, false
     */
    hideAction: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  computed: {
    kindClass () {
      const kindClasses = {
        error: 'd-toast--error',
        info: 'd-toast--info',
        success: 'd-toast--success',
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
