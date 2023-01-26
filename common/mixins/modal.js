const focusableAttrs = ':not(:disabled):not([aria-disabled="true"])';
const tabbableAttrs = `${focusableAttrs}:not([tabindex="-1"])`;
const focusableElementsList = `button,[href],input,select,textarea,details,[tabindex]`;

/**
 * This mixin provides the methods to automatically trap tab focus within
 * the component this mixin is on, meaning it is not possible to tab out
 * of the component without dismissing it.
 *
 * Useful for accessibility reasons on things like important actionable alerts.
 *
 * Use focusFirstElement to focus on the first tabbable element within your component, and call
 * focusTrappedTabPress every time tab is pressed to trap tab within this
 * component.
 *
 * Note that focusFirstElement WILL focus elements with tabindex="-1",
 * however focusTrappedTabPress will not.
 * @displayName Modal Mixin
 */
export default {
  methods: {
    /**
     * get the first focusable element in your component, includes tabindex="-1".
     * @param {object} el - optional - ref of dom element to trap focus on.
     *  will default to the root node of the vue component
     */
    async getFirstFocusableElement (el) {
      await this.$nextTick();
      const focusableElements = this._getFocusableElements(el, true);
      return this._getFirstFocusElement(focusableElements);
    },

    /**
     * set focus to the first focusable element in your component, includes tabindex="-1".
     * @param {object} el - optional - ref of dom element to trap focus on.
     *  will default to the root node of the vue component
     */
    async focusFirstElement (el) {
      const elToFocus = await this.getFirstFocusableElement(el);
      elToFocus?.focus({ preventScroll: true });
    },

    /**
     * internal use only.
     *
     * @param focusableElements - list of focusable elements
     * @returns {*} - first DOM element that is focusable.
     * @private
     */
    _getFirstFocusElement (focusableElements) {
      if (!focusableElements.length) {
        return;
      }
      let firstFocusEl = focusableElements[0];
      // If first element is a checkbox, put focus on the selected checkbox or the first checkbox if none are selected.
      if (firstFocusEl.matches('[type="radio"]:not(:checked)')) {
        firstFocusEl = focusableElements.find(el => el.checked && el.name === firstFocusEl.name) || firstFocusEl;
      }
      return firstFocusEl;
    },

    /**
     * internal use only.
     *
     * gets all the focusable elements within the component
     * and sets the first and last of those elements.
     *
     * @param {object} el - the root dom element to find focusable elements in.
     * @param {bool} includeNegativeTabIndex - will include tabindex="-1" in the list of focusable elements.
     */
    _getFocusableElements (el = this.$el, includeNegativeTabIndex = false) {
      const focusableContent = [...el.querySelectorAll(focusableElementsList)];
      return focusableContent.filter((fc) => {
        const style = window.getComputedStyle(fc);
        return style.getPropertyValue('display') !== 'none' &&
          style.getPropertyValue('visibility') !== 'hidden' &&
          fc.matches(includeNegativeTabIndex ? focusableAttrs : tabbableAttrs);
      });
    },

    /**
     * tabs to the next element contained within your component, does not include tabindex="-1".
     * @param {object} e - keypress event
     * @param {object} el - optional - ref of dom element to trap focus on.
     *  will default to the root node of the vue component
     */
    focusTrappedTabPress (e, el) {
      const isTabPressed = e.key === 'Tab';

      if (!isTabPressed) {
        return;
      }

      const focusableElements = this._getFocusableElements(el);
      if (!focusableElements.length) {
        e.preventDefault();
        return;
      }

      const firstFocusableElement = this._getFirstFocusElement(focusableElements);
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    },
  },
};
