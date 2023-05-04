<!-- eslint-disable vuejs-accessibility/no-static-element-interactions -->
<template>
  <div
    @keydown.esc.stop="onKeyValidation($event, 'onEscapeKey')"
    @keydown.enter.exact="onKeyValidation($event, 'onEnterKey')"
    @keydown.up.stop.prevent="onKeyValidation($event, 'onUpKey')"
    @keydown.down.stop.prevent="onKeyValidation($event, 'onDownKey')"
    @keydown.home.stop.prevent="onKeyValidation($event, 'onHomeKey')"
    @keydown.end.stop.prevent="onKeyValidation($event, 'onEndKey')"
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
      <combobox-loading-list
        v-if="loading && !listRenderedOutside"
        v-bind="listProps"
      />
      <combobox-empty-list
        v-else-if="emptyList && (emptyStateMessage || hasSlotContent($slots.emptyListItem)) && !listRenderedOutside"
        v-bind="listProps"
        :message="emptyStateMessage"
        :item-class="emptyStateClass"
      >
        <slot name="emptyListItem" />
      </combobox-empty-list>
      <!-- @slot Slot for the combobox list element -->
      <slot
        v-else
        name="list"
        :list-props="listProps"
        :opened="onOpen"
        :clear-highlight-index="clearHighlightIndex"
      />
    </div>
  </div>
</template>

<script>
import KeyboardNavigation from '../../common/mixins/keyboard_list_navigation';
import { getUniqueString, hasSlotContent } from '@/common/utils';
import ComboboxLoadingList from './combobox_loading-list.vue';
import ComboboxEmptyList from './combobox_empty-list.vue';
import { LABEL_SIZES } from '@/components/combobox/combobox_constants';

/**
 * A combobox is a semantic component that displays an input element combined with a listbox,
 * which enables the user to select items from the list.
 * @see https://dialpad.design/components/combobox.html
 */
export default {
  name: 'DtCombobox',

  components: {
    ComboboxLoadingList,
    ComboboxEmptyList,
  },

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
     * String to use for the input label.
     */
    label: {
      type: String,
      required: true,
    },

    /**
     * Determines visibility of input label.
     * @values true, false
     */
    labelVisible: {
      type: Boolean,
      default: true,
    },

    /**
     * Size of the input, one of `xs`, `sm`, `md`, `lg`, `xl`
     * @values null, xs, sm, md, lg, xl
     */
    size: {
      type: String,
      default: null,
      validator: (t) => Object.values(LABEL_SIZES).includes(t),
    },

    /**
     * Description for the input
     */
    description: {
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
     * @values true, false
     */
    showList: {
      type: Boolean,
      default: false,
    },

    /**
     * If the list is rendered outside the component, like when using popover as the list wrapper.
     * @values true, false
     */
    listRenderedOutside: {
      type: Boolean,
      default: false,
    },

    /**
     * Determines when to show the skeletons and also controls aria-busy attribute.
     * @values true, false
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Sets the list to an empty state, and displays the message from prop `emptyStateMessage`.
     * @values true, false
     */
    emptyList: {
      type: Boolean,
      default: false,
    },

    /**
     * Message to show when the list is empty
     */
    emptyStateMessage: {
      type: String,
      default: '',
    },

    /**
     * Additional class name for the empty list element.
     * Can accept all of String, Object, and Array, i.e. has the
     * same api as Vue's built-in handling of the class attribute.
     */
    emptyStateClass: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Programmatically click on the active list item element when a selection
     * comes from keyboard navigation, i.e. pressing the "Enter" key.
     * @values true, false
     */
    clickOnSelect: {
      type: Boolean,
      default: false,
    },
  },

  emits: [
    /**
     * Event fired when item selected
     *
     * @event select
     * @type {Number}
     */
    'select',

    /**
     * Event fired when pressing escape
     *
     * @event escape
     */
    'escape',

    /**
     * Event fired when the highlight changes
     *
     * @event highlight
     * @type {Number}
     */
    'highlight',

    /**
     * Event fired when list is shown or hidden
     *
     * @event opened
     * @type {Boolean}
     */
    'opened',
  ],

  data () {
    return {
      // If the list is rendered at the root, rather than as a child
      // of this component, this is the ref to that dom element. Set
      // by the onOpen method.
      outsideRenderedListRef: null,
      hasSlotContent,
    };
  },

  computed: {
    inputProps () {
      return {
        label: this.label,
        labelVisible: this.labelVisible,
        size: this.size,
        description: this.description,
        role: 'combobox',
        'aria-label': this.label,
        'aria-expanded': this.showList.toString(),
        'aria-owns': this.listId,
        'aria-haspopup': 'listbox',
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
        'aria-label': this.label,
      };
    },

    beginningOfListMethod () {
      return this.onBeginningOfList || this.jumpToEnd;
    },

    endOfListMethod () {
      return this.onEndOfList || this.jumpToBeginning;
    },

    activeItemId () {
      if (!this.showList || this.highlightIndex < 0 || this.loading) {
        return;
      }
      return this.highlightId;
    },

    activeItemEl () {
      if (!this.highlightId) return '';
      return this.getListElement().querySelector('#' + this.highlightId);
    },
  },

  watch: {
    showList (showList) {
      // When the list's visibility changes reset the highlight index.

      if (!this.listRenderedOutside) {
        this.setInitialHighlightIndex();
        this.$emit('opened', showList);
      }

      if (!showList && this.outsideRenderedListRef) {
        this.outsideRenderedListRef.removeEventListener('mousemove', this.onMouseHighlight);
        this.outsideRenderedListRef = null;
      }
    },

    loading (loading) {
      this.$nextTick(() => {
        this.setInitialHighlightIndex();
      });
    },

    $props: {
      deep: true,
      immediate: true,
      handler () {
        this.validateEmptyListProps();
      },
    },
  },

  created () {
    this.validateEmptyListProps();
  },

  methods: {
    onMouseHighlight (e) {
      if (this.loading) return;

      const liElement = e.target.closest('li');

      if (liElement && this.highlightId !== liElement.id) {
        this.setHighlightId(liElement.id);
      }
    },

    getListElement () {
      return this.outsideRenderedListRef ?? this.$refs.listWrapper?.querySelector(`#${this.listId}`);
    },

    clearHighlightIndex () {
      if (this.showList) {
        this.setHighlightIndex(-1);
      }
    },

    afterHighlight () {
      if (this.loading) return;
      this.$emit('highlight', this.highlightIndex);
    },

    onEnterKey () {
      if (this.loading || this.emptyList) return;

      if (this.highlightIndex >= 0) {
        this.$emit('select', this.highlightIndex);

        if (this.clickOnSelect) {
          this.activeItemEl?.click();
        }
      }
    },

    onEscapeKey () {
      this.$emit('escape');
    },

    onOpen (open, contentRef) {
      this.outsideRenderedListRef = contentRef;
      this.outsideRenderedListRef?.addEventListener('mousemove', this.onMouseHighlight);
      this.$emit('opened', open);

      if (open) {
        this.setInitialHighlightIndex();
      }
    },

    onKeyValidation (e, eventHandler) {
      if (!this.showList || !this.getListElement()) return;

      this[eventHandler](e);
    },

    setInitialHighlightIndex () {
      if (!this.showList) return;
      this.$nextTick(() => {
      // When the list's is shown, reset the highlight index.
      // If the list is loading, set to -1
        this.setHighlightIndex(this.loading ? -1 : 0);
      });
    },

    validateEmptyListProps () {
      if (this.$slots.emptyListItem) { return; }

      if ((this.emptyList && !this.emptyStateMessage) || (!this.emptyList && this.emptyStateMessage)) {
        console.error(`Invalid props: you must pass both props emptyList and emptyStateMessage to show the
      empty message.`);
      }
    },
  },
};
</script>
