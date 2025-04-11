<!-- eslint-disable vue/no-bare-strings-in-template -->
<!-- stub for the new alternate toast layout -->
<template>
  <div
    v-if="isShown"
    :class="[
      'd-toast',
      'd-toast-alternate',
      kindClass,
    ]"
    data-qa="dt-toast"
    :aria-hidden="(!isShown).toString()"
  >
    <div class="d-toast__dialog">
      <dt-notice-icon
        v-if="!hideIcon"
        :kind="kind"
        v-on="$listeners"
      >
        <!-- @slot Slot for custom icon -->
        <slot name="icon" />
      </dt-notice-icon>
      <div>
        <p> {{ kind }}</p>
      </div>
      <div>
        {{ getCurrentTime() }}
      </div>
    </div>
  </div>
</template>

<script>
import utils from '@/common/utils';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import { DtNoticeIcon } from '@/components/notice';
import { TOAST_ROLES } from '../toast_constants.js';
export default {
  name: 'ToastLayoutAlternate',

  components: {
    DtNoticeIcon,
  },

  mixins: [SrOnlyCloseButtonMixin],

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
     * @values base, success, error, gradient
     */
    kind: {
      type: String,
      default: 'base',
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
     * Props for the toast close button.
     */
    closeButtonProps: {
      type: Object,
      default: () => ({}),
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

  computed: {
    kindClass () {
      const kindClasses = {
        assist: 'd-toast--assist',
        chat: 'd-toast--chat',
        playbook: 'd-toast--playbook',
        success: 'd-toast--positive',
        error: 'd-toast--failure',
        warning: 'd-toast--neutral',
      };

      return kindClasses[this.kind];
    },
  },

  methods: {
    getCurrentTime () {
      const time = new Date();
      let hours = time.getHours();
      const minutes = time.getMinutes().toString().padStart(2, '0');
      const amPm = hours >= 12 ? 'pm' : 'am';

      // Convert to 12-hour format
      hours = (hours % 12) || 12; // Convert 0 to 12 for midnight
      hours = hours.toString().padStart(2, '0'); // Ensure two digits for hours

      return `${hours}:${minutes}${amPm}`;
    },
  },
};
</script>
