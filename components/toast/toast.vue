<template>
  <aside class="d-toast-wrapper">
    <div
      v-if="!hidden"
      :class="[
        'd-toast',
        kindClass,
        { 'd-toast--important': important },
      ]"
      data-qa="dt-toast"
      :aria-hidden="hidden.toString()"
    >
      <div class="d-toast__dialog">
        <dt-notice-icon
          :kind="kind"
        >
          <!-- @slot Use a custom icon -->
          <slot name="icon" />
        </dt-notice-icon>
        <dt-notice-content
          :title-id="titleId"
          :content-id="contentId"
          :title="title"
          :role="role"
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
          :hide-close="hideClose"
          :close-button-props="closeButtonProps"
          @close="$emit('close')"
        >
          <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
          <slot name="action" />
        </dt-notice-action>
      </div>
    </div>
  </aside>
</template>

<script>
import DtNoticeIcon from '../notice/notice_icon';
import DtNoticeContent from '../notice/notice_content';
import DtNoticeAction from '../notice/notice_action';
import { NOTICE_KINDS } from '../notice/notice_constants';
import util from '@/common/utils';
import { TOAST_ROLES } from './toast_constants';

export default {
  name: 'DtToast',

  components: {
    DtNoticeIcon,
    DtNoticeContent,
    DtNoticeAction,
  },

  props: {
    /**
     * Sets an ID on the title element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the title.
     */
    titleId: {
      type: String,
      default () { return util.getUniqueString(); },
    },

    /**
     * Sets an ID on the content element of the component. Useful for aria-describedby
     * or aria-labelledby or any other reason you may need an id to refer to the content.
     */
    contentId: {
      type: String,
      default () { return util.getUniqueString(); },
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
     */
    hideClose: {
      type: Boolean,
      default: false,
    },

    /**
     * The duration in ms the toast will display before disappearing.
     * Defaults to 6000 ms and the prop validation is that provided duration is equal to or greater than 6000.
     */
    duration: {
      type: Number,
      default: 6000,
      validator: (duration) => {
        return duration >= 6000;
      },
    },
  },

  emits: ['close', 'click'],

  data () {
    return {
      hidden: true,
    };
  },

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
  },

  unmounted () {
    clearTimeout(this.displayTimer);
  },

  methods: {
    show () {
      this.hidden = false;
      this.displayTimer = setTimeout(() => {
        this.hidden = true;
      }, this.duration);
    },

    close () {
      this.hidden = true;
      clearTimeout(this.displayTimer);
    },
  },
};
</script>
