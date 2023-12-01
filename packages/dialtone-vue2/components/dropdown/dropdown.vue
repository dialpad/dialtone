<template>
  <dt-popover
    ref="popover"
    :content-width="contentWidth"
    :open="open"
    :placement="placement"
    :initial-focus-element="openedWithKeyboard ? 'first' : 'dialog'"
    :fallback-placements="fallbackPlacements"
    padding="none"
    role="menu"
    :append-to="appendTo"
    :modal="modal"
    :max-height="maxHeight"
    :max-width="maxWidth"
    :open-with-arrow-keys="shouldOpenWithArrowKeys"
    :open-on-context="openOnContext"
    :tether="tether"
    :transition="transition"
    v-on="dropdownListeners"
  >
    <template #anchor="{ attrs }">
      <!-- @slot Anchor element that activates the dropdown -->
      <slot
        ref="anchor"
        name="anchor"
        v-bind="attrs"
      />
    </template>
    <template #content="{ close }">
      <!-- eslint-disable max-len -->
      <!-- eslint-disable-next-line vuejs-accessibility/mouse-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
      <ul
        :id="listId"
        ref="listWrapper"
        :class="listClasses"
        data-qa="dt-dropdown-list-wrapper"
        @mouseleave="clearHighlightIndex"
        @mousemove.capture="onMouseHighlight"
      >
        <!-- @slot Slot for the list component -->
        <slot
          name="list"
          :close="close"
        />
        <sr-only-close-button
          v-if="showVisuallyHiddenClose"
          :visually-hidden-close-label="visuallyHiddenCloseLabel"
          :tabindex="isArrowKeyNav ? -1 : 0"
          @close="close"
        />
      </ul>
    </template>
  </dt-popover>
</template>

<script>
import KeyboardNavigation from '../../common/mixins/keyboard_list_navigation';
import { DtPopover } from '@/components/popover';
import { LIST_ITEM_NAVIGATION_TYPES } from '@/components/list_item/list_item_constants';
import {
  DROPDOWN_PADDING_CLASSES,
} from './dropdown_constants';
import {
  POPOVER_APPEND_TO_VALUES,
} from '@/components/popover/popover_constants';
import { getUniqueString } from '@/common/utils';
import { EVENT_KEYNAMES } from '@/common/constants';
import SrOnlyCloseButtonMixin from '../../common/mixins/sr_only_close_button.js';
import SrOnlyCloseButton from '@/common/sr_only_close_button.vue';

export default {
  name: 'DtDropdown',

  components: {
    DtPopover,
    SrOnlyCloseButton,
  },

  mixins: [
    KeyboardNavigation({
      indexKey: 'highlightIndex',
      idKey: 'highlightId',
      listElementKey: 'getListElement',
      listItemRole: 'menuitem',
      afterHighlightMethod: 'afterHighlight',
      beginningOfListMethod: 'beginningOfListMethod',
      endOfListMethod: 'endOfListMethod',
      activeItemKey: 'activeItemEl',
      focusOnKeyboardNavigation: true,
    }),
    SrOnlyCloseButtonMixin,
  ],

  props: {
    /**
     * Controls whether the dropdown is shown. Leaving this null will have the dropdown trigger on click by default.
     * If you set this value, the default trigger behavior will be disabled and you can control it as you need.
     * Supports .sync modifier
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
     * Opens the dropdown on right click (context menu). If you set this value to `true`,
     * the default trigger behavior will be disabled.
     */
    openOnContext: {
      type: Boolean,
      default: false,
    },

    /**
     * Vertical padding size around the list element.
     * @values none, small, large
     */
    padding: {
      type: String,
      default: 'small',
      validator: (padding) => {
        return Object.keys(DROPDOWN_PADDING_CLASSES).some((item) => item === padding);
      },
    },

    /**
     * Determines modal state, dropdown has a modal overlay preventing interaction with elements
     * below it, but it is invisible.
     */
    modal: {
      type: Boolean,
      default: true,
    },

    /**
     * Width configuration for the popover content. When its value is 'anchor',
     * the popover content will have the same width as the anchor.
     * @values null, anchor
     */
    contentWidth: {
      type: String,
      default: null,
    },

    /**
     * Determines maximum height for the popover before overflow.
     * Possible units rem|px|em
     */
    maxHeight: {
      type: String,
      default: '',
    },

    /**
     * Determines maximum width for the popover before overflow.
     * Possible units rem|px|%|em
     */
    maxWidth: {
      type: String,
      default: '',
    },

    /**
     * Sets an ID on the list element of the component. Used by several aria attributes
     * as well as when deriving the IDs for each item.
     */
    listId: {
      type: String,
      default () { return getUniqueString(); },
    },

    /**
     * The type of navigation that this component should support.
     * - "arrow-keys" for items that are navigated with UP/DOWN keys.
     * - "tab" for items that are navigated using the TAB key.
     * - "none" for static items that are not interactive.
     * @values arrow-keys, tab, none
     */
    navigationType: {
      type: String,
      default: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
      validator: (t) => Object.values(LIST_ITEM_NAVIGATION_TYPES).includes(t),
    },

    /**
     * If the dropdown does not fit in the direction described by "placement",
     * it will attempt to change it's direction to the "fallbackPlacements".
     *
     * @values top, top-start, top-end,
     * right, right-start, right-end,
     * left, left-start, left-end,
     * bottom, bottom-start, bottom-end,
     * auto, auto-start, auto-end
     * */
    fallbackPlacements: {
      type: Array,
      default: () => {
        return ['auto'];
      },
    },

    /**
     * The direction the dropdown displays relative to the anchor.
     */
    placement: {
      type: String,
      default: 'bottom',
    },

    /**
     * A method that will be called when the selection goes past the beginning of the list.
     */
    onBeginningOfList: {
      type: Function,
      default: null,
    },

    /**
     * A method that will be called when the selection goes past the end of the list.
     */
    onEndOfList: {
      type: Function,
      default: null,
    },

    /**
     * Additional class for the wrapper list element.
     */
    listClass: {
      type: [String, Array, Object],
      default: '',
    },

    /**
     * Sets the element to which the popover is going to append to.
     * 'body' will append to the nearest body (supports shadow DOM).
     * @values 'body', 'parent', HTMLElement,
     */
    appendTo: {
      type: [HTMLElement, String],
      default: 'body',
      validator: appendTo => {
        return POPOVER_APPEND_TO_VALUES.includes(appendTo) ||
            (appendTo instanceof HTMLElement);
      },
    },

    /**
     * If set to false the dialog will display over top of the anchor when there is insufficient space.
     * If set to true it will never move from its position relative to the anchor and will clip instead.
     * <a
     *   class="d-link"
     *   href="https://popper.js.org/docs/v2/modifiers/prevent-overflow/#tether"
     *   target="_blank"
     * >
     *   Popper.js docs
     * </a>
     * @values true, false
     */
    tether: {
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
  },

  emits: [
    /**
     * Event fired when the highlight changes
     *
     * @event highlight
     * @type {Number}
     */
    'highlight',

    /**
     * Event fired when dropdown is shown or hidden
     *
     * @event opened
     * @type {Boolean | Array}
     */
    'opened',

    /**
     * Event fired to sync the open prop with the parent component
     * @event update:open
     */
    'update:open',
  ],

  data () {
    return {
      LIST_ITEM_NAVIGATION_TYPES,
      DROPDOWN_PADDING_CLASSES,
      EVENT_KEYNAMES,
      openedWithKeyboard: false,
      isOpen: null,
    };
  },

  computed: {
    dropdownListeners () {
      return {
        ...this.$listeners,

        opened: isPopoverOpen => {
          this.updateInitialHighlightIndex(isPopoverOpen);
        },

        keydown: event => {
          const eventCode = event.code;

          switch (eventCode) {
            case EVENT_KEYNAMES.up:
            case EVENT_KEYNAMES.arrowup:
              this.onUpKeyPress(event);
              event.stopPropagation();
              event.preventDefault();
              break;
            case EVENT_KEYNAMES.down:
            case EVENT_KEYNAMES.arrowdown:
              this.onDownKeyPress(event);
              event.stopPropagation();
              event.preventDefault();
              break;
            case EVENT_KEYNAMES.space:
            case EVENT_KEYNAMES.spacebar:
              this.onSpaceKey();
              break;
            case EVENT_KEYNAMES.enter:
              this.onEnterKey();
              break;
            case EVENT_KEYNAMES.home:
              this.onHomeKeyPress(event);
              event.stopPropagation();
              event.preventDefault();
              break;
            case EVENT_KEYNAMES.end:
              this.onEndKeyPress(event);
              event.stopPropagation();
              event.preventDefault();
              break;
            default:
              this.onKeyPress(event);
              break;
          }

          this.$emit('keydown', event);
        },
      };
    },

    beginningOfListMethod () {
      return this.onBeginningOfList || this.jumpToEnd;
    },

    endOfListMethod () {
      return this.onEndOfList || this.jumpToBeginning;
    },

    activeItemEl () {
      return this.getListElement().querySelector('#' + this.highlightId);
    },

    isArrowKeyNav () {
      return this.navigationType === this.LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS;
    },

    listClasses () {
      return [
        'd-ps-relative',
        'd-stack2',
        'd-m4',
        'd-px0',
        DROPDOWN_PADDING_CLASSES[this.padding],
        this.listClass,
        { 'd-context-menu-list': this.openOnContext },
      ];
    },

    shouldOpenWithArrowKeys () {
      return !this.openOnContext;
    },
  },

  methods: {
    onMouseHighlight (e) {
      const liElement = e.target.closest('li');

      if (liElement && liElement.role && this.highlightId !== liElement.id) {
        this.setHighlightId(liElement.id);
        liElement.focus();
      }
    },

    getListElement () {
      return this.$refs.listWrapper;
    },

    clearHighlightIndex () {
      this.setHighlightIndex(-1);
    },

    afterHighlight () {
      if (this.visuallyHiddenClose && this.highlightIndex === this._itemsLength() - 1) {
        return;
      }

      this.$emit('highlight', this.highlightIndex);
    },

    updateInitialHighlightIndex (isPopoverOpen) {
      this.isOpen = isPopoverOpen;

      if (isPopoverOpen) {
        if (this.openedWithKeyboard && this.isArrowKeyNav) {
          this.setHighlightIndex(0);
        }
        this.$emit('opened', true);
      } else {
        this.clearHighlightIndex();
        this.openedWithKeyboard = false;
        this.$emit('opened', false);
      }
    },

    onSpaceKey () {
      if (!this.open) {
        this.openedWithKeyboard = true;
      }
    },

    onEnterKey () {
      if (!this.open) {
        this.openedWithKeyboard = true;
      }
    },

    onUpKeyPress () {
      if (!this.isOpen) {
        this.openedWithKeyboard = true;
        return;
      }
      if (this.isArrowKeyNav) {
        return this.onUpKey();
      }
    },

    onDownKeyPress () {
      if (!this.isOpen) {
        this.openedWithKeyboard = true;
        return;
      }
      if (this.isArrowKeyNav) {
        return this.onDownKey();
      }
    },

    onHomeKeyPress () {
      if (!this.isOpen || !this.isArrowKeyNav) {
        return;
      }

      return this.onHomeKey();
    },

    onEndKeyPress () {
      if (!this.isOpen || !this.isArrowKeyNav) {
        return;
      }

      return this.onEndKey();
    },

    onKeyPress (e) {
      if (!this.isOpen || !this.isArrowKeyNav || !this.isValidCharacter(e.key)) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      return this.onNavigationKey(e.key);
    },
  },
};
</script>

<style lang="less">
.d-context-menu-list {
  width: var(--dt-size-850);
}
</style>
