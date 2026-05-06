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
          v-if="showIcon"
          :kind="kind"
          :icon-class="iconClass"
          size="200"
          v-bind="toastListeners"
        >
          <slot name="icon" />
        </dt-toast-layout-alternate-icon>
        <dt-notice-content
          :header-id="headerId"
          :content-id="contentId"
          :header-text="headerText"
          :header-class="headerClass"
          :content-class="contentClass"
          :role="role"
          v-bind="toastListeners"
        >
          <template #header>
            <slot name="header" />
          </template>
        </dt-notice-content>

        <!-- Close Button -->
        <dt-notice-action
          :show-action="false"
          :show-close="showClose"
          :action-class="actionClass"
          :button-size="100"
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
import DtToastLayoutAlternateIcon from './ToastLayoutAlternateIcon.vue';
import { DtNoticeAction, DtNoticeContent } from '@/components/Notice';
import { TOAST_ROLES, TOAST_ALTERNATE_KINDS } from '../ToastConstants.js';
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
     * @values base, critical, info, positive, warning, gradient
     */
    kind: {
      type: String,
      default: 'base',
      validator: (kind) => {
        return TOAST_ALTERNATE_KINDS.includes(kind);
      },
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

  computed: {
    kindClass () {
      const kindClasses = {
        critical: 'd-toast-alternate--critical',
        info: 'd-toast-alternate--info',
        positive: 'd-toast-alternate--positive',
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
