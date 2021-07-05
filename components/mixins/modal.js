const nonFocusableAttrs = 'not(:disabled):not([aria-disabled="true"]):not([tabindex="-1"])';
const focusableElementsList = `button:${nonFocusableAttrs},
                           [href]:${nonFocusableAttrs},
                           input:${nonFocusableAttrs},
                           select:${nonFocusableAttrs},
                           textarea:${nonFocusableAttrs},
                           details:${nonFocusableAttrs},
                           [tabindex]:not([tabindex="-1"])`;

/**
 * this mixin provides the methods to automatically trap tab focus within
 * the component this mixin is on, meaning it is not possible to tab out
 * of the component without dismissing it. Useful for accessibility reasons
 * on things like important actionable alerts. Use focusFirstElement to
 * focus on the first tabbable element within your component, and call
 * focusTrappedTabPress every time tab is pressed to trap tab within this
 * component.
 */
export default {
  methods: {
    /**
     * set focus to the first focusable element in your component
     * @param {object} el - optional - ref of dom element to trap focus on.
     *  will default to the root node of the vue component
     */
    async focusFirstElement (el) {
      await this.$nextTick();
      const focusableElements = this._getFocusableElements(el);
      const elToFocus = this._getFirstFocusElement(focusableElements);
      elToFocus?.focus();
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
     */
    _getFocusableElements (el = this.$el) {
      const focusableContent = [...el.querySelectorAll(focusableElementsList)];
      return focusableContent.filter((fc) => {
        const style = window.getComputedStyle(fc);
        return style.getPropertyValue('display') !== 'none' &&
          style.getPropertyValue('visibility') !== 'hidden';
      });
    },

    /**
     * tabs to the next element contained within your component
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
