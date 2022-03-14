<template>
  <div
    role="combobox"
    :aria-expanded="showList.toString()"
    :aria-controls="listId"
    :aria-owns="listId"
    aria-haspopup="listbox"
    @keydown.esc.stop="onEscapeKey"
    @keydown.enter.exact="onEnterKey"
    @keydown.up.stop.prevent="onUpKey"
    @keydown.down.stop.prevent="onDownKey"
    @keydown.home.stop.prevent="onHomeKey"
    @keydown.end.stop.prevent="onEndKey"
  >
    <div data-qa="dt-combobox-input-wrapper">
      <!-- @slot Slot for the combobox input element -->
      <slot
        name="input"
        :input-props="inputProps"
      />
    </div>
    <div
      v-if="showList"
      ref="listWrapper"
      data-qa="dt-combobox-list-wrapper"
      @mouseleave="clearHighlightIndex"
      @focusout="clearHighlightIndex"
      @mousemove.capture="onMouseHighlight"
    >
      <!-- @slot Slot for the combobox list element -->
      <slot
        name="list"
        :list-props="listProps"
        :opened="onOpen"
      />
    </div>
  </div>
</template>

<script>
import KeyboardNavigation from '@/common/mixins/keyboard_list_navigation';
import { getUniqueString } from '@/common/utils';

export default {
  name: 'DtCombobox',

  mixins: [
    KeyboardNavigation({
      indexKey: 'highlightIndex',
      idKey: 'highlightId',
      listElementKey: 'getListElement',
      afterHighlightMethod: 'afterHighlight',
      beginningOfListMethod: 'beginningOfListMethod',
      endOfListMethod: 'endOfListMethod',
      activeItemKey: 'activeItemEl',
    }),
  ],

  props: {
    /**
     * String to use for the list's aria-label.
     */
    listAriaLabel: {
      type: String,
      required: true,
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
     * Determines when to show the list element and also controls the aria-expanded attribute.
     */
    showList: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['select', 'escape', 'highlight'],

  data () {
    return {
      // If the list is rendered at the root, rather than as a child
      // of this component, this is the ref to that dom element. Set
      // by the onOpen method.
      outsideRenderedListRef: null,
    };
  },

  computed: {
    inputProps () {
      return {
        'aria-activedescendant': this.activeItemId,
        'aria-controls': this.listId,
      };
    },

    listProps () {
      return {
        role: 'listbox',
        id: this.listId,
        // The list has to be positioned relatively so that the auto-scroll can
        // calculate the correct offset for the list items.
        class: 'd-ps-relative',
        'aria-label': this.listAriaLabel,
      };
    },

    beginningOfListMethod () {
      return this.onBeginningOfList || this.jumpToEnd;
    },

    endOfListMethod () {
      return this.onEndOfList || this.jumpToBeginning;
    },

    activeItemId () {
      if (!this.showList || this.highlightIndex < 0) {
        return;
      }
      return this.highlightId;
    },

    activeItemEl () {
      return this.getListElement().querySelector('#' + this.highlightId);
    },
  },

  watch: {
    showList (showList) {
      // When the list's visibility changes reset the highlight index.
      this.$nextTick(function () {
        this.setInitialHighlightIndex();
      });

      if (!showList && this.outsideRenderedListRef) {
        this.outsideRenderedListRef.removeEventListener('mousemove', this.onMouseHighlight);
        this.outsideRenderedListRef = null;
      }
    },
  },

  methods: {
    onMouseHighlight (e) {
      const liElement = e.target.closest('li');

      if (liElement && this.highlightId !== liElement.id) {
        this.setHighlightId(liElement.id);
      }
    },

    getListElement () {
      return this.outsideRenderedListRef ?? this.$refs.listWrapper.querySelector(`#${this.listId}`);
    },

    clearHighlightIndex () {
      this.setHighlightIndex(-1);
    },

    afterHighlight () {
      this.$emit('highlight', this.highlightIndex);
    },

    onEnterKey () {
      if (this.showList && this.highlightIndex >= 0) {
        this.$emit('select', this.highlightIndex);
      }
    },

    onEscapeKey () {
      this.$emit('escape');
    },

    onOpen (open, contentRef) {
      this.outsideRenderedListRef = contentRef;
      this.outsideRenderedListRef?.addEventListener('mousemove', this.onMouseHighlight);
    },

    setInitialHighlightIndex () {
      if (this.showList) {
        // When the list's is shown, reset the highlight index.
        this.setHighlightIndex(0);
      }
    },
  },
};
</script>
