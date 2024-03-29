<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
  <aside
    :class="bannerClass"
    :style="bannerBackgroundImage"
    @keydown.tab="trapFocus"
  >
    <div
      class="d-banner__dialog"
      :class="dialogClass"
      :role="role"
      :aria-labelledby="titleId"
      :aria-describedby="contentId"
    >
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
        v-on="$listeners"
      >
        <template #titleOverride>
          <!-- eslint-disable-next-line max-len -->
          <!-- @slot Allows you to override the title, only use this if you need to override with something other than text. Otherwise use the "title" prop. -->
          <slot name="titleOverride" />
        </template>
        <!-- @slot the main textual content of the banner -->
        <slot />
      </dt-notice-content>
      <dt-notice-action
        :hide-action="hideAction"
        :hide-close="hideClose"
        :close-button-props="closeButtonProps"
        :visually-hidden-close="visuallyHiddenClose"
        :visually-hidden-close-label="visuallyHiddenCloseLabel"
        v-on="$listeners"
      >
        <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
        <slot name="action" />
      </dt-notice-action>
    </div>
  </aside>
</template>

<script>
import { DtNoticeIcon, DtNoticeContent, DtNoticeAction, NOTICE_KINDS } from '@/components/notice';
import Modal from '@/common/mixins/modal';
import utils from '@/common/utils';
import SrOnlyCloseButtonMixin from '@/common/mixins/sr_only_close_button';

/**
 * Banners are a type of notice, delivering system and engagement messaging.
 * These are highly intrusive notices and should be used sparingly and appropriately.
 * @see https://dialtone.dialpad.com/components/banner.html
 */
export default {
  name: 'DtBanner',

  components: {
    DtNoticeIcon,
    DtNoticeContent,
    DtNoticeAction,
  },

  mixins: [Modal, SrOnlyCloseButtonMixin],

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
     * Title header of the notice. This can be left blank to remove the title from the notice entirely.
     */
    title: {
      type: String,
      default: '',
    },

    /**
     * Used in scenarios where the message needs to visually dominate the screen.
     * This will also change the aria role from status to alertdialog.
     * and will modally trap the keyboard focus in the dialog as soon as it displays.
     * @values true, false
     */
    important: {
      type: Boolean,
      default: false,
    },

    /**
     * Pins the banner to the top of the window and pushes all app content down.
     * @values true, false
     */
    pinned: {
      type: Boolean,
      default: false,
    },

    /**
     * Severity level of the notice, sets the icon and background
     * @values base, error, info, success, warning
     */
    kind: {
      type: String,
      default: 'base',
      validate (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },

    /**
     * Props for the notice close button.
     */
    closeButtonProps: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Hides the close button from the notice
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
     * Inner dialog class
     */
    dialogClass: {
      type: String,
      default: '',
    },

    /**
     * Banner background image
     */
    backgroundImage: {
      type: String,
      default: '',
    },

    /**
     * Background image size, follows the background-size CSS property values
     * <a class="d-link" href="https://developer.mozilla.org/en-US/docs/Web/CSS/background-size" target="_blank">
     *   CSS background-sizes
     * </a>
     */
    backgroundSize: {
      type: String,
      default: 'cover',
    },
  },

  emits: [
    /**
     * Close button click event
     *
     * @event close
     */
    'close',
  ],

  computed: {
    role () {
      return this.important ? 'alertdialog' : 'status';
    },

    bannerClass () {
      const kindClasses = {
        error: 'd-banner--error',
        info: 'd-banner--info',
        success: 'd-banner--success',
        warning: 'd-banner--warning',
        base: 'd-banner--base',
      };

      return [
        'd-banner',
        kindClasses[this.kind],
        {
          'd-banner--important': this.important,
          'd-banner--pinned': this.pinned,
        },
      ];
    },

    bannerBackgroundImage () {
      if (this.backgroundImage === '') return null;

      return `background-image: url(${this.backgroundImage});
              background-size: ${this.backgroundSize};`;
    },
  },

  mounted () {
    if (this.important) {
      this.focusFirstElement();
    }
  },

  methods: {
    trapFocus (e) {
      if (this.important) {
        this.focusTrappedTabPress(e);
      }
    },
  },
};
</script>
