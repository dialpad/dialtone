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
        v-if="showIcon"
        :kind="kind"
        :class="{ 'd-notice__icon--has-title': title || $slots.title }"
      >
        <!-- @slot Slot for custom icon -->
        <slot name="icon" />
      </dt-notice-icon>
      <dt-notice-content
        :title-id="titleId"
        :content-id="contentId"
        :title="title"
      >
        <template #title>
          <!-- @slot Slot for the title -->
          <slot name="title" />
        </template>
        <!-- @slot the main textual content of the banner -->
        <slot />
      </dt-notice-content>
      <dt-notice-action
        :show-action="showAction"
        :show-close="showClose"
        @close="$emit('close')"
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

/**
 * Banners are a type of notice, delivering system and engagement messaging.
 * These are highly intrusive notices and should be used sparingly and appropriately.
 * @see https://dialtone.dialpad.com/components/banner.html
 */
export default {
  compatConfig: { MODE: 3 },
  name: 'DtBanner',

  components: {
    DtNoticeIcon,
    DtNoticeContent,
    DtNoticeAction,
  },

  mixins: [Modal],

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
     * @values base, critical, info, positive, warning
     */
    kind: {
      type: String,
      default: 'base',
      validator (kind) {
        return NOTICE_KINDS.includes(kind);
      },
    },

    /**
     * Shows the close button in the banner
     * @values true, false
     */
    showClose: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the icon in the banner
     * @values true, false
     */
    showIcon: {
      type: Boolean,
      default: true,
    },

    /**
     * Shows the action in the banner
     * @values true, false
     */
    showAction: {
      type: Boolean,
      default: true,
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
        critical: 'd-banner--critical',
        info: 'd-banner--info',
        positive: 'd-banner--positive',
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
