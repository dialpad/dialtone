export default {
  methods: {
    /**
     * Scroll an element into view if it is not fully visible in its nearest scrollable ancestor.
     * @param {Element} ref
     */
    scrollElementIntoViewIfNeeded (ref, opt_center, opt_behavior, opt_parent) {
      if (ref.scrollIntoViewIfNeeded) {
        this.scrollIntoViewIfNeeded(ref, opt_center, opt_behavior, opt_parent);
      } else {
        this.scrollIntoView(ref, 'bottom', false, opt_behavior, opt_parent);
      }
    },

    /**
     * Scroll an element to the top or bottom of its scroll ancestor.
     * @param {Element} ref
     */
    scrollElementIntoView (ref, opt_scrollToTop, opt_behavior, opt_parent) {
      if (opt_scrollToTop === 'center') {
        this.scrollIntoView(ref, 'center', false, opt_behavior, opt_parent);
        return;
      }

      if (opt_scrollToTop === false) {
        this.scrollIntoView(ref, 'bottom', false, opt_behavior, opt_parent);
      } else {
        this.scrollIntoView(ref, 'top', false, opt_behavior, opt_parent);
      }
    },

    scrollIntoViewIfNeeded (ref, opt_center, opt_behavior, opt_parent) {
      const dir = opt_center ? 'center' : undefined;
      this.scrollIntoView(ref, dir, true, opt_behavior, opt_parent);
    },

    scrollIntoView (ref, opt_dir, opt_ifNeeded, opt_behavior, opt_parent) {
      if (!ref || !ref.parentElement) {
        return;
      }
      const offsetTop = ref.offsetTop;
      const refParent = opt_parent || ref.parentElement;
      const scrollBounds = this._getScrollBounds(refParent);
      const parentHeight = scrollBounds.bottom - scrollBounds.top;
      const elHeight = this._getElementHeight(ref);
      const offsetBottom = offsetTop + elHeight;
      let scrollTop = -1;
      switch (opt_dir) {
        case 'top':
          scrollTop = offsetTop;
          break;
        case 'center':
          scrollTop = offsetTop + (elHeight - parentHeight) / 2;
          break;
        case 'bottom':
          scrollTop = scrollTop = offsetBottom - parentHeight;
          break;
        default:
          // Go to the closest edge if needed and no direction is provided.
          if (offsetTop - scrollBounds.top <= (parentHeight / 2)) {
            // Lock it to the top edge.
            scrollTop = offsetTop;
          } else {
            scrollTop = offsetBottom - parentHeight;
          }
          break;
      }
      this._setScrollTop(refParent, scrollTop, scrollBounds, offsetTop, offsetBottom, opt_ifNeeded, opt_behavior);
    },

    _setScrollTop (el, scrollTop, bounds, offsetTop, offsetBottom, opt_isNeeded, opt_behavior) {
      bounds = bounds || this._getScrollBounds(el);
      const parentHeight = bounds.bottom - bounds.top;
      if (opt_isNeeded && this._inScrollBounds(offsetTop, offsetBottom, bounds)) {
        // Then lock to the top or bottom if it's hanging off the edge.
        if (offsetTop < bounds.top) {
          // Snap it to the top.
          scrollTop = offsetTop;
        } else if (offsetBottom > bounds.bottom) {
          scrollTop = offsetBottom - parentHeight;
        } else {
          return;
        }
      }

      if (opt_behavior) {
        el.scrollTo({ top: scrollTop, behavior: opt_behavior });
      } else {
        el.scrollTop = scrollTop;
      }
    },

    _getElementHeight (el) {
      return el.getBoundingClientRect().height;
    },

    _getScrollBounds (el) {
      const height = this._getElementHeight(el);
      const scrollTop = el.scrollTop;
      return {
        top: scrollTop,
        bottom: scrollTop + height,
      };
    },

    _inScrollBounds (top, bottom, bounds) {
      // Since we read from top to bottom, we want more than 3/4 to be visible at the top
      // (bc you're looking at the bottom half) or a quarter visible at the bottom (bc you
      // can read the beginning of it)

      const height = bottom - top;
      return (bottom <= bounds.bottom + (3 * height / 4)) && (top >= bounds.top - (height / 4));
    },
  },
};
