<template>
  <dt-popover
    ref="popover"
    :content-width="contentWidth"
    :open="isOpen"
    :has-caret="false"
    :fixed-vertical-alignment="fixedVerticalAlignment"
    :fixed-alignment="fixedAlignment"
    :padding="padding"
    role="menu"
    v-on="$listeners"
    @update:open="updateInitialHighlightIndex"
    @keydown.esc.stop="onEscapeKey"
    @keydown.enter="onEnterKey"
    @keydown.space="onSpaceKey"
    @keydown.up.stop.prevent="onUpKeyPress"
    @keydown.down.prevent="onDownKeyPress"
    @keydown.home.stop.prevent="onHomeKey"
    @keydown.end.stop.prevent="onEndKey"
  >
    <template #anchor="props">
      <!-- @slot Anchor element that activates the dropdown -->
      <slot
        ref="anchor"
        name="anchor"
        :toggle-open="toggle"
        v-bind="props"
      />
    </template>
    <template #content>
      <ul
        :id="listId"
        ref="listWrapper"
        class="d-p0 d-ps-relative"
        data-qa="dt-dropdown-list-wrapper"
        @mouseleave="clearHighlightIndex"
        @mouseover.capture="onMouseHighlight"
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
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtDropdown',

  components: {
    DtPopover,
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
  ],

  props: {
    /**
     * Optional prop to manage dropdown opening. Supports .sync modifier.
     */
    open: {
      type: Boolean,
      default: false,
    },

    /**
     * Padding size class for the dropdown.
     */
    padding: {
      type: String,
      default: 'none',
    },

    /**
     * Width configuration for the dropdown. 'anchor' is one possible string value.
     * If passed, the dropdown will be set same width with anchor element
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
     * Fixed vertical alignment of the dropdown content. If passed, the dropdown
     * will always display anchored to the top or bottom of the anchor element.
     * If null, the content will be positioned on whichever side has the most
     * available space relative to the root Vue element. String values must be
     * one of `top` or `bottom`.
     */
    fixedVerticalAlignment: {
      type: String,
      default: null,
    },

    /**
     * Fixed horizontal alignment of the dropdown content. If passed, the
     * dropdown will always display anchored to the left, center or right of the
     * anchor element. If null, the content will be positioned on whichever
     * side has the most available space relative to the root Vue element.
     */
    fixedAlignment: {
      type: String,
      default: 'left',
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

  emits: ['escape', 'highlight', 'update:open'],

  data () {
    return {
      LIST_ITEM_NAVIGATION_TYPES,
      isOpen: this.open,
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

  watch: {
    open (newValue) {
      this.isOpen = newValue;
    },
  },

  methods: {
    onMouseHighlight (e) {
      const liElement = e.target.closest('li');

      if (liElement && liElement.classList.contains('dt-list-item--hoverable') && this.highlightId !== liElement.id) {
        this.setHighlightId(liElement.id);
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
        this.$emit('update:open', true);
      } else {
        this.clearHighlightIndex();

        this.isOpen = false;
        this.$emit('update:open', false);
      }
    },

    toggle () {
      this.isOpen = !this.isOpen;
    },

    close () {
      this.isOpen = false;
    },

    onSpaceKey () {
      if (!this.isOpen) {
        this.openedWithKeyboard = true;
      }
    },

    onEnterKey () {
      if (!this.isOpen) {
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

    onEscapeKey () {
      this.isOpen = false;
      this.$emit('escape');
    },
  },
};
</script>
