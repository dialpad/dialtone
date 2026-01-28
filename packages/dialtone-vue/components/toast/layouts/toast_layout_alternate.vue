<template>
  <div
    v-if="isShown"
    :class="[
      'd-toast-alternate',
      $attrs.class,
      kindClass,
    ]"
    data-qa="dt-toast"
    :aria-hidden="(!isShown).toString()"
  >
    <div class="d-toast-alternate__dialog">
      <div class="d-toast-alternate__header">
        <dt-toast-layout-alternate-icon
          v-if="!hideIcon"
          :kind="kind"
          size="200"
          v-bind="toastListeners"
        >
          <slot name="icon" />
        </dt-toast-layout-alternate-icon>
        <dt-notice-content
          :title-id="titleId"
          :content-id="contentId"
          :title="title"
          :role="role"
          v-bind="toastListeners"
        >
          <template #titleOverride>
            <slot name="titleOverride" />
          </template>
        </dt-notice-content>

        <!-- Close Button -->
        <dt-notice-action
          :hide-action="true"
          :hide-close="hideClose"
          button-size="xs"
          v-bind="toastListeners"
          @close="$emit('close')"
        />
      </div>
      <!-- Content Section -->
      <div class="d-toast-alternate__content">
        <slot>
          {{ message }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/common/utils';
import DtToastLayoutAlternateIcon from './toast_layout_alternate_icon.vue';
import { DtNoticeAction, DtNoticeContent } from '@/components/notice';
import { TOAST_ROLES, TOAST_ALTERNATE_KINDS } from '../toast_constants.js';
import { extractVueListeners } from '@/common/utils/index.js';

export default {
  name: 'ToastLayoutAlternate',

  components: {
    DtNoticeAction,
    DtNoticeContent,
    DtToastLayoutAlternateIcon,
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
     * @values base, error, info, success, warning, gradient
     */
    kind: {
      type: String,
      default: 'base',
      validator: (kind) => {
        return TOAST_ALTERNATE_KINDS.includes(kind);
      },
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
  },

  computed: {
    kindClass () {
      const kindClasses = {
        error: 'd-toast-alternate--error',
        info: 'd-toast-alternate--info',
        success: 'd-toast-alternate--success',
        warning: 'd-toast-alternate--warning',
        gradient: 'd-toast-alternate--gradient',
      };

      return kindClasses[this.kind];
    },

    toastListeners () {
      return extractVueListeners(this.$attrs);
    },
  },
};
</script>
