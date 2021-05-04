<template>
  <aside
    :class="bannerClass"
    :role="role"
    @keydown.tab="trapFocus"
  >
    <div
      class="d-banner__dialog"
      :aria-labelledby="titleId"
      :aria-describedby="contentId"
    >
      <hs-notice-icon
        :kind="kind"
        v-on="$listeners"
      >
        <!-- @slot Use a custom icon -->
        <slot name="icon" />
      </hs-notice-icon>
      <hs-notice-content
        :title-id="titleId"
        :content-id="contentId"
        :title="title"
        v-on="$listeners"
      >
        <template #titleOverride>
          <!-- @slot Allows you to override the title, only use this if you need to override with something other than text. Otherwise use the "title" prop. -->
          <slot name="titleOverride" />
        </template>
        <!-- @slot the main textual content of the banner -->
        <slot />
      </hs-notice-content>
      <hs-notice-action
        :hide-close="hideClose"
        :close-button-props="closeButtonProps"
        v-on="$listeners"
      >
        <!-- @slot Enter a possible action for the user to take, such as a link to another page -->
        <slot name="action" />
      </hs-notice-action>
    </div>
  </aside>
</template>
<script>
import HsNoticeIcon from '../notice/notice_icon';
import HsNoticeContent from '../notice/notice_content';
import HsNoticeAction from '../notice/notice_action';
import { NOTICE_KINDS } from '../notice/notice_constants';
import Modal from '../mixins/modal.js';
import util from '../utils';

export default {
  name: 'HsBanner',

  components: {
    HsNoticeIcon,
    HsNoticeContent,
    HsNoticeAction,
  },

  mixins: [Modal],

  props: {
    /**
     * Sets an ID on the title element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the title.
     */
    titleId: {
      type: String,
      default () { return util.getUniqueString(); },
    },
    /**
     * Sets an ID on the content element of the component. Useful for aria-describedby or aria-labelledby or any other reason you may need an id to refer to the content.
     */
    contentId: {
      type: String,
      default () { return util.getUniqueString(); },
    },
    /**
     * Title header of the notice. This can be left blank to remove the title from the notice entirely.
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * Used in scenarios where the message needs to visually dominate the screen. This will also change the aria role from status to alertdialog.
     * and will modally trap the keyboard focus in the dialog as soon as it displays.
     */
    important: {
      type: Boolean,
      default: false,
    },
    /**
     * Pins the banner to the top of the window and pushes all app content down.
     */
    pinned: {
      type: Boolean,
      default: false,
    },
    /**
     * Severity level of the notice, sets the icon and background
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
     */
    hideClose: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    role () {
      return this.important ? 'alertdialog' : 'status';
    },

    bannerClass () {
      return ['d-banner',
        `d-banner--${this.kind}`,
        {
          'd-banner--important': this.important,
          'd-banner--pinned': this.pinned,
        },
      ];
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
