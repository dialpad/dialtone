import Dom from './dom';

const ERROR_INVALID_LIST_ELEMENT = (
  'listElementKey is required or the referenced ' +
  'element doesn\'t exist. Received listElement: '
);

/**
 * Usage: `mixins: [keyboardNavigationMixin(options)]`
 *
 * This mixin provides some common data and methods to navigate a list of items
 * (such as a dropdown or select menu) by keyboard.
 *
 * To be effective, you must bind the onUpKey and onDownKey events, usually to
 * the root element of the component.
 *
 * @param listItemRole
 * @param indexKey
 * @param idKey
 * @param listElementKey
 * @param activeItemKey
 * @param openMethod
 * @param afterHighlightMethod
 * @param beginningOfListMethod
 * @param endOfListMethod
 * @param scrollToOnHighlight
 * @param focusOnKeyboardNavigation
 * @displayName Keyboard Navigation Mixin
 */
export default ({
  // Role of the list items in the component. This is used to identify the list items
  // so you must update this if the role of your list items is anything other than 'option'
  listItemRole = 'option',
  // Key of the data prop that will be added to the component.
  indexKey = 'highlightIndex',
  idKey = 'highlightId',
  // Key of the method that references the list element.
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
  // Focus the active element on keyboard navigation.
  focusOnKeyboardNavigation = false,
} = {}) => ({
  mixins: [Dom],

  data () {
    return {
      [indexKey]: -1,
      [idKey]: '',
      scrollToOnHighlight,
      focusOnKeyboardNavigation,
    };
  },

  provide () {
    return {
      highlightId: () => this[idKey],
    };
  },

  methods: {
    // Returns the list element
    // this[listElement]() can return a Vue component, in which case we need to target
    // the $el property, or it can simply be an html element.
    _getListElement () {
      return this[listElementKey]()?.$el || this[listElementKey]();
    },

    // Gets the length of all the items in the list, uses the listItemRole param to determine
    // whether an element is a list item.
    _itemsLength () {
      const listItems = this._getListItemNodes();

      if (listItems === null) {
        return 0;
      }

      return listItems.length;
    },

    // Gets all the list item nodes within the list element
    _getListItemNodes () {
      const listElement = this._getListElement();

      if (!listElement) {
        console.error(ERROR_INVALID_LIST_ELEMENT, listElement);
        return null;
      }

      return Array.from(listElement.querySelectorAll(`[role="${listItemRole}"], #sr-only-close-button`));
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

    onNavigationKey (key) {
      const listItems = this._getListItemNodes();

      const matchingItems = listItems.filter(item => {
        const content = item.textContent.trim().toLowerCase();
        return content.startsWith(key.toLowerCase());
      });

      if (matchingItems.length <= 0) {
        return;
      }

      const highlightedMatchingItemIndex = matchingItems.findIndex(item => {
        return this[indexKey] === listItems.indexOf(item);
      });

      const nextHighlightedItemIndex = listItems.indexOf(
        highlightedMatchingItemIndex < matchingItems.length - 1
          ? matchingItems[highlightedMatchingItemIndex + 1]
          : matchingItems[0],
      );

      this.setHighlightIndex(nextHighlightedItemIndex);
      this.scrollActiveItemIntoViewIfNeeded();
      this.focusActiveItemIfNeeded();
    },

    isValidLetter (key) {
      if (key.length > 1) {
        return false;
      }

      return (key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z');
    },

    jumpToBeginning () {
      this.setHighlightIndex(0);
    },

    jumpToEnd () {
      this.setHighlightIndex(this._itemsLength() - 1);
    },

    setHighlightIndex (num) {
      this[indexKey] = num;
      this[idKey] = this._getItemId(num);

      if (this._itemsLength() && afterHighlightMethod) {
        this[afterHighlightMethod](num);
      }
    },

    setHighlightId (id) {
      this[idKey] = id;
      this[indexKey] = this._getItemIndex(id);

      if (this._itemsLength() && afterHighlightMethod) {
        this[afterHighlightMethod](this._getItemIndex(id));
      }
    },

    _getItemIndex (id) {
      const listElement = this._getListElement();
      if (!listElement) {
        return;
      }

      const listItems = Array.from(listElement.querySelectorAll(`[role="${listItemRole}"], #sr-only-close-button`));
      return listItems.indexOf(listElement.querySelector(`#${id}`));
    },

    _getItemId (index) {
      const listElement = this._getListElement();
      if (!listElement) {
        return;
      }

      return listElement.querySelectorAll(`[role="${listItemRole}"], #sr-only-close-button`)[index]?.id;
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
