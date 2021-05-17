<template>
  <component
    :is="elementType"
    v-click-outside="() => close('click-outside')"
    class="d-p-relative dt-popover"
  >
    <div
      :id="!ariaLabelledby && labelledBy"
      ref="anchor"
    >
      <!-- @slot Anchor element that activates the popover. -->
      <slot
        name="anchor"
        :attrs="{
          'aria-expanded': open.toString(),
          'aria-controls': id,
          'aria-haspopup': role,
        }"
      />
    </div>
    <dt-lazy-show
      :id="id"
      ref="container"
      :role="role"
      :aria-hidden="!open"
      :aria-labelledby="labelledBy"
      :aria-label="ariaLabel"
      :aria-modal="isDialog"
      :transition="transition"
      :show="open"
      :class="[
        'd-border',
        'd-border-color--ash-dark',
        'd-border-radius--sm',
        'd-bgc-white d-box-shadow--md',
        'd-mt4',
        'd-p-absolute',
        'd-z-index--popover',
        'hs-popover__content',
        `hs-popover__content--align-${alignment}`,
        `hs-popover__content--valign-${verticalAlignment}`,
        `hs-popover__content--pad-${padding}`,
        contentClass,
      ]"
      tabindex="-1"
      v-on="dialogListeners"
    >
      <!-- @slot Content that is displayed in the popover when it is open. -->
      <slot name="content" />

      <div
        v-if="hasCaret"
        class="d-bgc-white d-mtn4 d-border-top d-border-left d-border-color--ash-dark dt-popover__caret"
      />
    </dt-lazy-show>
  </component>
</template>

<script>
import { DtLazyShow } from '../lazy_show';
import {
  POPOVER_PADDING_CLASSES,
  POPOVER_ROLES,
  POPOVER_HORIZONTAL_ALIGNMENT,
  POPOVER_VERTICAL_ALIGNMENT,
} from './popover_constants';
import util from '../utils';
import clickOutside from 'v-click-outside';
import Modal from '../mixins/modal.js';

export default {
  name: 'DtPopover',

  /********************
   * CHILD COMPONENTS *
   ********************/
  components: {
    DtLazyShow,
  },

  directives: {
    clickOutside: clickOutside.directive,
  },

  mixins: [Modal],

  /******************
   *     PROPS      *
   ******************/
  props: {
    /**
     * Element type (tag name) of the root element of the component.
     */
    elementType: {
      type: String,
      default: 'div',
    },

    /**
     * Additional class name for the content wrapper element.
     */
    contentClass: {
      type: String,
      default: '',
    },

    /**
     * Whether or not the popover content is shown. Supports .sync modifier.
     */
    open: {
      type: Boolean,
      required: true,
    },

    /**
     * Padding size class for the popover content.
     */
    padding: {
      type: String,
      default: 'large',
      validator: (padding) => {
        return POPOVER_PADDING_CLASSES.includes(padding);
      },
    },

    /**
     * Whether or not a carat (arrow) should be shown from the content pointing
     * at the anchor.
     */
    hasCaret: {
      type: Boolean,
      default: true,
    },

    /**
     * Named transition when the content display is toggled.
     * @see DtLazyShow
     */
    transition: {
      type: String,
      default: 'fade',
    },

    /**
     * Fixed horizontal alignment of the popover content. If passed, the
     * popover will always display anchored to the left or right of the
     * anchor element. If null, the content will be positioned on whichever
     * side has the most available space relative to the root Vue element.
     * String values must be one of `left` or `right`.
     */
    fixedAlignment: {
      type: String,
      default: null,
      validator: (align) => {
        return POPOVER_HORIZONTAL_ALIGNMENT.includes(align);
      },
    },

    /**
     * Fixed vertical alignment of the popover content. If passed, the popover
     * will always display anchored to the top or bottom of the anchor element.
     * If null, the content will be positioned on whichever side has the most
     * available space relative to the root Vue element. String values must be
     * one of `top` or `bottom`.
     */
    fixedVerticalAlignment: {
      type: String,
      default: null,
      validator: (align) => {
        return POPOVER_VERTICAL_ALIGNMENT.includes(align);
      },
    },

    /**
     * `id` of the popover content wrapper element.
     * @default [String] automatically generated unique string.
     */
    id: {
      type: String,
      default () {
        return util.getUniqueString('DtPopover__content');
      },
    },

    /**
     * ARIA role for the content of the popover. Defaults to "dialog".
     * @see https://www.w3.org/TR/wai-aria/#aria-haspopup
     */
    role: {
      type: String,
      default: 'dialog',
      validator: (role) => {
        return POPOVER_ROLES.includes(role);
      },
    },

    /**
     * ID of the element that serves as the label for the popover content.
     * Defaults to the "anchor" element; this exists to provide a different
     * ID of the label element if, for example, the anchor slot contains
     * other items that do not serve as a label. You should provide this
     * or ariaLabel, but not both.
     */
    ariaLabelledby: {
      type: String,
      default: null,
    },

    /**
     * Descriptive label for the popover content. You should provide this
     * or ariaLabelledby, but not both.
     */
    ariaLabel: {
      type: String,
      default: null,
    },

    focusAnchorOnClose: {
      type: Boolean,
      default: true,
    },
  },

  emits: [
    'update:open',
  ],

  /******************
   *      DATA      *
   ******************/
  data () {
    return {
      autoAlignment: 'left',
      autoVerticalAlignment: 'bottom',
    };
  },

  computed: {
    alignment () {
      return this.fixedAlignment || this.autoAlignment;
    },

    verticalAlignment () {
      return this.fixedVerticalAlignment || this.autoVerticalAlignment;
    },

    labelledBy () {
      // aria-labelledby should be set only if aria-labelledby is passed as a prop, or if
      // there is no aria-label and the labelledby should point to the anchor.
      return this.ariaLabelledby || (!this.ariaLabel && util.getUniqueString('DtPopover__anchor'));
    },

    isDialog () {
      return this.role === 'dialog';
    },

    dialogListeners (e) {
      if (this.isDialog) {
        return {
          keydown: (e) => {
            if (e.key === 'Tab') {
              this.trapFocus(e);
            }
            if (e.key === 'Escape') {
              this.close('esc');
            }
          },
        };
      }
      return null;
    },
  },

  watch: {
    open (isOpen, wasOpen) {
      this.manageFocusOnOpenClose();
      this.closedByClickOutside = false;
      if (!isOpen || (this.fixedAlignment && this.fixedVerticalAlignment)) {
        return;
      }
      this.updateAlignment();
    },
  },

  /******************
   *     METHODS    *
   ******************/
  methods: {

    manageFocusOnOpenClose () {
      if (!this.isDialog) {
        return;
      }
      if (this.open) {
        return this.focusFirstElement(this.$refs.container.$el);
      }
      if (this.focusAnchorOnClose && !this.closedByClickOutside) {
        this.focusFirstElement(this.$refs.anchor);
      }
    },

    trapFocus (e) {
      this.focusTrappedTabPress(e, this.$refs.container.$el);
    },

    close (method) {
      /**
       * Emitted when the `open` property changes, such as when the user clicks
       * outside the popover content.
       * @type {Event}
       */
      if (method === 'click-outside') {
        this.closedByClickOutside = true;
      }
      this.$emit('update:open', false);
    },

    async updateAlignment () {
      // Reset autoAlignment to the default, let it render, then check if it's outside the page boundary.
      this.autoAlignment = 'left';
      this.autoVerticalAlignment = 'bottom';
      await this.$nextTick();
      const popoverBoundary = this.$refs.container.$el.getBoundingClientRect();
      const pageBoundary = this.$root.$el.getBoundingClientRect();

      if (popoverBoundary.right > pageBoundary.right) {
        // Dropdown is clipping off the page, so we want to align however it has the most space.
        // Since the page x-scrolls at low widths, check with the scrollWidth rather than just page-right.
        const pageScrollWidth = this.$root.$el.scrollWidth;
        const anchorBoundary = this.$refs.anchor.getBoundingClientRect();
        const spaceOnLeft = anchorBoundary.left - pageBoundary.left;
        const spaceOnRight = (pageBoundary.left + pageScrollWidth) - anchorBoundary.right;
        this.autoAlignment = spaceOnRight < spaceOnLeft ? 'right' : 'left';
      }

      if (popoverBoundary.bottom > pageBoundary.bottom) {
        const pageScrollHeight = this.$root.$el.scrollHeight;
        const anchorBoundary = this.$refs.anchor.getBoundingClientRect();
        const spaceAbove = anchorBoundary.top - pageBoundary.top;
        const spaceBelow = (pageBoundary.top + pageScrollHeight) - anchorBoundary.bottom;
        this.autoVerticalAlignment = spaceAbove < spaceBelow ? 'bottom' : 'top';
      }
    },
  },
};
</script>

<style lang="less">
  @import "../../css/dialtone.less";

  .dt-popover__content {
    &--align-right {
      right: @su0;

      .dt-popover__caret {
        right: @su24;
      }
    }

    &--valign-top {
      bottom: 100%;
      margin-top: @su0;
      margin-bottom: @su4;

      .dt-popover__caret {
        top: auto;
        bottom: -@su4;
        transform: rotate(225deg);
      }
    }

    &--pad-none {
      padding: @su0;
    }

    &--pad-small {
      padding: @su8;
    }

    &--pad-medium {
      padding: @su16;
    }

    &--pad-large {
      padding: @su24;
    }
  }

  .dt-popover__caret {
    top: @su0;
    height: @su6;
    width: @su6;
    transform: rotate(45deg);
    position: absolute;
  }
</style>
