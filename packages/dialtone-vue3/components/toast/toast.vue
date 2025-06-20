<template>
  <component
    :is="selectedLayout"
    :is-shown="isShown"
    :title-id="titleId"
    :content-id="contentId"
    :title="title"
    :message="message"
    :role="role"
    :kind="kind"
    :important="important"
    :close-button-props="closeButtonProps"
    :hide-close="hideClose"
    :hide-icon="hideIcon"
    :hide-action="hideAction"
    v-bind="$attrs"
    @close="handleClose"
  >
    <!-- @slot Slot for custom icon -->
    <template #icon>
      <slot name="icon" />
    </template>
    <template #titleOverride>
      <!-- @slot Allows you to override the title, only use this if you need to override
          with something other than text. Otherwise use the "title" prop. -->
      <slot name="titleOverride" />
    </template>
    <!-- @slot the main textual content of the toast -->
    <slot>
      {{ message }}
    </slot>
    <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
    <template #action>
      <slot name="action" />
    </template>
  </component>
</template>

<script>
import { TOAST_MIN_DURATION, TOAST_LAYOUTS } from './toast_constants.js';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';
import ToastLayoutDefault from './layouts/toast_layout_default.vue';
import ToastLayoutAlternate from './layouts/toast_layout_alternate.vue';

/**
 * A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions.
 * It contains at-a-glance information about outcomes and can be paired with actions.
 * @see https://dialtone.dialpad.com/components/toast.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtToast',

  components: {
    ToastLayoutDefault,
    ToastLayoutAlternate,
  },

  mixins: [SrOnlyCloseButtonMixin],

  inheritAttrs: false,

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
     * Title header of the toast. This can be left blank to remove the title from the toast entirely.
     */
    title: {
      type: String,
      default: undefined,
    },

    /**
     * Message of the toast. Overridden by default slot.
     */
    message: {
      type: String,
      default: undefined,
    },

    /**
     * Provides a role for the toast. 'status' is used by default to communicate a message. 'alert' is used to
     * communicate an important message like an error that does not contain any interactive elements.
     * @values status, alert
     */
    role: {
      type: String,
      default: 'status',
    },

    /**
     * Severity level of the toast, could be different depending on which toast layout is used.
     * @values base, error, info, success, warning, gradient
     */
    kind: {
      type: String,
      default: undefined,
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
     * after reaching the duration time, so it's convenient to use `v-model` with this prop to update
     * the data in your component.
     * Supports v-model
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
      default: undefined,
    },

    /**
     * Hides the close button from the toast
     * @values true, false
     */
    hideClose: {
      type: Boolean,
      default: undefined,
    },

    /**
     * Hides the icon from the notice
     * @values true, false
     */
    hideIcon: {
      type: Boolean,
      default: undefined,
    },

    /**
     * Hides the action from the notice
     * @values true, false
     */
    hideAction: {
      type: Boolean,
      default: undefined,
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

    /**
     * The layout / styling you wish to use for the toast.
     * @values default, alternate
     */
    layout: {
      type: String,
      default: 'default',
      validator: (layout) => {
        return TOAST_LAYOUTS.includes(layout);
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
    shouldSetTimeout () {
      return !!this.duration && this.duration >= this.minDuration;
    },

    selectedLayout () {
      return this.layout === 'alternate' ? ToastLayoutAlternate : ToastLayoutDefault;
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

  unmounted () {
    clearTimeout(this.displayTimer);
  },

  methods: {
    closeToast (event) {
      this.$emit('update:show', false);
      this.$emit('close', event);
    },

    setTimeout () {
      if (this.shouldSetTimeout) {
        this.displayTimer = setTimeout(() => {
          this.isShown = false;
          this.$emit('update:show', false);
        }, this.duration);
      }
    },

    handleClose () {
      this.isShown = false;
      this.$emit('close');
      this.$emit('update:show', false);
    },
  },
};
</script>
