/**
 * Usage: `mixins: [keyboardNavigationMixin(options)]`
 *
 * This mixin provides some common data and methods to navigate a list of items
 * (such as a dropdown or select menu) by keyboard. The component should have
 * a computed prop of `items`, which is configurable.
 *
 * To be effective, you must bind the onUpKey and onDownKey events, usually to
 * the root element of the component, and utilize the `highlightIndex` data
 * to focus the item at that index.
 */
import Dom from '../mixins/dom';

export default ({
  // Role of the list items in the component. This is used to identify the list items
  // so you must update this if the role of your list items is anything other than 'option'
  listItemRole = 'option',
  // Key of the data prop that will be added to the component.
  indexKey = 'highlightIndex',
  // Key of the computed prop that references the list element.
  listElementKey = 'listRef',
  // Optional, Key of the computed prop that references the currently active item element.
  activeItemKey = '',
  // Optional, name of the method that toggles the list visibility. Used for
  // opening the list when up or down is pressed.
  openMethod = null,
  // Optional, method to call when the highlightIndex is changed.
  afterHighlightMethod = null,
  // Optional, method to call when the highlightIndex goes past the beginning of the list.
  beginningOfListMethod = null,
  // Optional, method to call when the highlightIndex goes past the end of the list.
  endOfListMethod = null,
  // Scroll the active element into view when highlighted by a keyboard event.
  scrollToOnHighlight = true,
  // Focus the active element on keyboard navigation
  focusOnKeyboardNavigation = false,
} = {}) => ({
  mixins: [Dom],

  data () {
    return {
      [indexKey]: 0,
      scrollToOnHighlight: scrollToOnHighlight,
      focusOnKeyboardNavigation: focusOnKeyboardNavigation,
    };
  },

  methods: {
    // Returns the list element
    // this[listElement] can be a Vue component, in which case we need to target
    // the $el property, or it can simply be an html element.
    _getListElement () {
      return this[listElementKey]?.$el || this[listElementKey];
    },

    // Gets the length of all the items in the list, uses the listItemRole param to determine
    // whether an element is a list item.
    _itemsLength () {
      const listElement = this._getListElement();

      if (!listElement) {
        console.error(`listElementKey is required or the referenced element doesn't exist. Received ',
          listElement: `, listElement);

        return 0;
      }

      return listElement.querySelectorAll(`[role="${listItemRole}"]`).length;
    },

    onUpKey () {
      if (openMethod) {
        this[openMethod](true);
      }
      if (this[indexKey] > 0) {
        this.setHighlightIndex(this[indexKey] - 1);
      } else if (beginningOfListMethod) {
        this[beginningOfListMethod]();
      }
      this.scrollActiveItemIntoViewIfNeeded();
      this.focusActiveItemIfNeeded();
    },

    onDownKey () {
      if (openMethod) {
        this[openMethod](true);
      }
      if (this[indexKey] < this._itemsLength() - 1) {
        this.setHighlightIndex(this[indexKey] + 1);
      } else if (endOfListMethod) {
        this[endOfListMethod]();
      }
      this.scrollActiveItemIntoViewIfNeeded();
      this.focusActiveItemIfNeeded();
    },

    onHomeKey () {
      this.jumpToBeginning();
      this.scrollActiveItemIntoViewIfNeeded();
      this.focusActiveItemIfNeeded();
    },

    onEndKey () {
      this.jumpToEnd();
      this.scrollActiveItemIntoViewIfNeeded();
      this.focusActiveItemIfNeeded();
    },

    jumpToBeginning () {
      this.setHighlightIndex(0);
    },

    jumpToEnd () {
      this.setHighlightIndex(this._itemsLength() - 1);
    },

    async setHighlightIndex (num) {
      this[indexKey] = num;
      if (this._itemsLength() && afterHighlightMethod) {
        await this.$nextTick();
        this[afterHighlightMethod](num);
      }
    },

    scrollActiveItemIntoViewIfNeeded () {
      if (!this.scrollToOnHighlight) {
        return;
      }
      const activeItemEl = this[activeItemKey];
      if (activeItemEl) {
        // When listElementKey is not passed,
        // scrollElementIntoViewIfNeeded will default to the immediate wrapper of the item.
        const listElement = this._getListElement();
        this.scrollElementIntoViewIfNeeded(activeItemEl, null, null, listElement);
      }
    },

    focusActiveItemIfNeeded () {
      if (!this.focusOnKeyboardNavigation) {
        return;
      }
      const activeItemEl = this[activeItemKey];
      if (activeItemEl) {
        activeItemEl.focus();
      }
    },
  },
});
