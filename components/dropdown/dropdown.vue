<template>
  <dt-popover
    ref="popover"
    :content-width="contentWidth"
    :open="open"
    :placement="placement"
    initial-focus-element="first"
    :fallback-placements="fallbackPlacements"
    padding="none"
    role="menu"
    :modal="modal"
    v-bind="$attrs"
    @opened="updateInitialHighlightIndex"
    @keydown.enter="onEnterKey"
    @keydown.space="onSpaceKey"
    @keydown.up.stop.prevent="onUpKeyPress"
    @keydown.down.prevent="onDownKeyPress"
    @keydown.home.stop.prevent="onHomeKey"
    @keydown.end.stop.prevent="onEndKey"
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
      <ul
        :id="listId"
        ref="listWrapper"
        :class="['d-ps-relative', 'd-px0', DROPDOWN_PADDING_CLASSES[padding]]"
        data-qa="dt-dropdown-list-wrapper"
        @mouseleave="clearHighlightIndex"
        @mousemove.capture="onMouseHighlight"
      >
        <!-- @slot Slot for the list component -->
        <slot
          name="list"
          :close="close"
        />
      </ul>
    </template>
  </dt-popover>
</template>

<script>
import KeyboardNavigation from '@/common/mixins/keyboard_list_navigation';
import { DtPopover } from '../popover';
import { LIST_ITEM_NAVIGATION_TYPES } from '../list_item/list_item_constants';
import {
  DROPDOWN_PADDING_CLASSES,
} from './dropdown_constants';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtDropdown',

  components: {
    DtPopover,
  },

  inheritAttrs: false,

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
  ],

  props: {
    /**
     * Controls whether the dropdown is shown. Leaving this null will have the dropdown trigger on click by default.
     * If you set this value, the default trigger behavior will be disabled and you can control it as you need.
     * Supports v-model
     */
    open: {
      type: Boolean,
      default: null,
    },

    /**
     * Vertical padding size around the list element.
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
     */
    contentWidth: {
      type: String,
      default: null,
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
     */
    navigationType: {
      type: String,
      default: LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS,
      validator: (t) => Object.values(LIST_ITEM_NAVIGATION_TYPES).includes(t),
    },

    /**
     * If the dropdown does not fit in the direction described by "placement",
     * it will attempt to change it's direction to the "fallbackPlacements".
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
  },

  emits: ['highlight', 'update:open', 'opened'],

  data () {
    return {
      LIST_ITEM_NAVIGATION_TYPES,
      DROPDOWN_PADDING_CLASSES,
      openedWithKeyboard: false,
    };
  },

  computed: {
    beginningOfListMethod () {
      return this.onBeginningOfList || this.jumpToEnd;
    },

    endOfListMethod () {
      return this.onEndOfList || this.jumpToBeginning;
    },

    activeItemEl () {
      return this.getListElement().querySelector('#' + this.highlightId);
    },
  },

  methods: {
    onMouseHighlight (e) {
      const liElement = e.target.closest('li');

      if (liElement && this.highlightId !== liElement.id) {
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
      this.$emit('highlight', this.highlightIndex);
    },

    updateInitialHighlightIndex (isPopoverOpen) {
      if (isPopoverOpen) {
        if (this.openedWithKeyboard && this.navigationType === this.LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS) {
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
      if (this.navigationType === this.LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS) {
        return this.onUpKey();
      }
    },

    onDownKeyPress () {
      if (this.navigationType === this.LIST_ITEM_NAVIGATION_TYPES.ARROW_KEYS) {
        return this.onDownKey();
      }
    },
  },
};
</script>
