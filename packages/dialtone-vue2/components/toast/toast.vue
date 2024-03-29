<template>
  <div
    v-if="isShown"
    :class="[
      'd-toast',
      kindClass,
      { 'd-toast--important': important },
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
      <dt-notice-content
        :title-id="titleId"
        :content-id="contentId"
        :title="title"
        :role="role"
        v-on="$listeners"
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
        :close-button-props="closeButtonProps"
        :visually-hidden-close="visuallyHiddenClose"
        :visually-hidden-close-label="visuallyHiddenCloseLabel"
        v-on="noticeActionListeners"
      >
        <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
        <slot name="action" />
      </dt-notice-action>
    </div>
  </div>
</template>

<script>
import { DtNoticeIcon, DtNoticeContent, DtNoticeAction, NOTICE_KINDS } from '@/components/notice';
import utils from '@/common/utils';
import { TOAST_ROLES, TOAST_MIN_DURATION } from './toast_constants.js';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';

/**
 * A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions.
 * It contains at-a-glance information about outcomes and can be paired with actions.
 * @see https://dialtone.dialpad.com/components/toast.html
 */
export default {
  name: 'DtToast',

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
     * Controls whether the toast is shown. If a valid duration is provided, the toast will disappear
     * after reaching the duration time, so it's convenient to use `.sync` modifier with this prop to update
     * the data in your component.
     * Supports .sync modifier
     * @values true, false
     */
    show: {
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

    /**
     * The duration in ms the toast will display before disappearing.
     * The toast won't disappear if the duration is not provided.
     * If it's provided, it should be equal to or greater than 6000.
     */
    duration: {
      type: Number,
      default: null,
      validator: (duration) => {
        return duration >= TOAST_MIN_DURATION;
      },
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
     * Sync show value
     *
     * @event update:show
     */
    'update:show',
  ],

  data () {
    return {
      isShown: false,
      minDuration: TOAST_MIN_DURATION,
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

    noticeActionListeners () {
      return {
        ...this.$listeners,

        close: event => {
          this.isShown = false;
          this.$emit('update:show', false);
          this.$emit('close', event);
        },
      };
    },

    shouldSetTimeout () {
      return !!this.duration && this.duration >= this.minDuration;
    },
  },

  watch: {
    show: {
      handler: function (show) {
        this.isShown = show;
        if (show) {
          this.setTimeout();
        } else {
          clearTimeout(this.displayTimer);
        }
      },

      immediate: true,
    },
  },

  destroyed () {
    if (this.shouldSetTimeout) {
      clearTimeout(this.displayTimer);
    }
  },

  methods: {
    setTimeout () {
      if (this.shouldSetTimeout) {
        this.displayTimer = setTimeout(() => {
          this.isShown = false;
          this.$emit('update:show', false);
        }, this.duration);
      }
    },
  },
};
</script>
