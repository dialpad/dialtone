import { EVENT_KEYNAMES } from '@/common/constants';
import {
  parseConfig,
  configsEqual,
  resolveSelector,
  resolveSkipDisabled,
} from './focusgroup_constants.js';

/**
 * v-dt-focusgroup directive — declarative roving tabindex for composite widgets.
 *
 * Implements the Open UI focusgroup pattern as a Vue custom directive.
 * Manages arrow-key navigation, tabindex, looping, memory, and disabled-item
 * handling. Focus only — activation/selection is the consumer's responsibility.
 *
 * @example
 * // Token syntax (Open UI style)
 * <div role="toolbar" v-dt-focusgroup="'horizontal'" aria-label="Formatting">
 *
 * // Object syntax
 * <div role="listbox" v-dt-focusgroup="{ axis: 'vertical', loop: false }">
 *
 * // Selection follows focus via dt-focusgroup-move event
 * <div role="tablist"
 *   v-dt-focusgroup="'horizontal nomemory'"
 *   @dt-focusgroup-move="selectTab($event.detail.item)">
 *
 * @see https://open-ui.org/components/scoped-focusgroup.explainer/
 */
export const DtFocusgroupDirective = {
  name: 'dt-focusgroup-directive',
  install (app) {
    const instances = new WeakMap();

    app.directive('dt-focusgroup', {
      mounted (el, binding) {
        const config = parseConfig(binding.value);
        const state = attach(el, config);
        instances.set(el, state);
      },

      updated (el, binding) {
        const newConfig = parseConfig(binding.value);
        const state = instances.get(el);
        if (state && configsEqual(state.config, newConfig)) return;
        cleanup(state, el);
        const freshState = attach(el, newConfig);
        instances.set(el, freshState);
      },

      unmounted (el) {
        cleanup(instances.get(el), el);
        instances.delete(el);
      },
    });

    // ── Item discovery ──────────────────────────────────────

    function getItems (el, selector) {
      return Array.from(el.querySelectorAll(selector))
        .filter(item => {
          if (item.hasAttribute('data-dt-focusgroup-skip')) return false;
          if (item.closest('[hidden]')) return false;
          // Exclude items inside collapsed containers (e.g., DtCollapsible)
          if (item.closest('[aria-hidden="true"]')) return false;
          return true;
        });
    }

    function isDisabled (item) {
      return item.disabled === true ||
        item.getAttribute('aria-disabled') === 'true';
    }

    // ── Navigation ──────────────────────────────────────────

    function findNext (items, fromIndex, direction, loop, skipDisabled) {
      const len = items.length;
      // Clamp fallback to valid range (fromIndex can be -1 or len for Home/End)
      const fallback = Math.max(0, Math.min(fromIndex, len - 1));
      for (let i = 1; i <= len; i++) {
        const index = loop
          ? (fromIndex + i * direction + len) % len
          : fromIndex + i * direction;

        if (index < 0 || index >= len) return fallback;
        if (skipDisabled && isDisabled(items[index])) continue;
        return index;
      }
      return fallback;
    }

    // Maps arrow keys to [axis, ltr-direction]. RTL reverses horizontal direction.
    const ARROW_KEY_MAP = {
      [EVENT_KEYNAMES.arrowright]: ['horizontal', 1],
      [EVENT_KEYNAMES.arrowleft]: ['horizontal', -1],
      [EVENT_KEYNAMES.arrowdown]: ['vertical', 1],
      [EVENT_KEYNAMES.arrowup]: ['vertical', -1],
    };

    function resolveDirection (key, axis, isRTL) {
      const mapping = ARROW_KEY_MAP[key];
      if (!mapping) return null;

      const [keyAxis, ltrDir] = mapping;
      const axisAllowed = axis === 'both' || axis === keyAxis;
      if (!axisAllowed) return null;

      return (keyAxis === 'horizontal' && isRTL) ? -ltrDir : ltrDir;
    }

    // ── Tabindex management ─────────────────────────────────

    function setRovingTabindex (items, focusedIndex) {
      items.forEach((item, i) => {
        item.setAttribute('tabindex', i === focusedIndex ? '0' : '-1');
      });
    }

    // ── Focus movement ──────────────────────────────────────

    function moveTo (el, state, items, currentIndex, targetIndex) {
      setRovingTabindex(items, targetIndex);
      state._internalMove = true;
      items[targetIndex].focus();
      queueMicrotask(() => { state._internalMove = false; });
      state.lastFocusedIndex = targetIndex;
      el.dispatchEvent(new CustomEvent('dt-focusgroup-move', {
        bubbles: true,
        detail: {
          item: items[targetIndex],
          index: targetIndex,
          previousItem: items[currentIndex],
          previousIndex: currentIndex,
        },
      }));
    }

    // ── Core handlers ───────────────────────────────────────

    function resolveHomeEnd (key, items, skipDisabled) {
      if (key === EVENT_KEYNAMES.home) return findNext(items, -1, 1, false, skipDisabled);
      if (key === EVENT_KEYNAMES.end) return findNext(items, items.length, -1, false, skipDisabled);
      return null;
    }

    function handleKeydown (event, el, state) {
      const items = getItems(el, state.selector);
      if (!items.length) return;

      const currentIndex = items.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      // Home / End — always preventDefault to avoid page scroll
      const homeEndIndex = resolveHomeEnd(event.key, items, state.skipDisabled);
      if (homeEndIndex !== null) {
        event.preventDefault();
        if (homeEndIndex !== currentIndex) moveTo(el, state, items, currentIndex, homeEndIndex);
        return;
      }

      // Arrow keys
      const direction = resolveDirection(event.key, state.config.axis, state.isRTL);
      if (direction === null) return;

      const nextIndex = findNext(items, currentIndex, direction, state.config.loop, state.skipDisabled);
      if (nextIndex !== currentIndex) {
        event.preventDefault();
        moveTo(el, state, items, currentIndex, nextIndex);
      }
    }

    function handleFocusin (event, el, state) {
      // Skip when focus was moved by the directive itself (avoid double work)
      if (state._internalMove) return;

      const items = getItems(el, state.selector);
      const index = items.indexOf(event.target);
      if (index !== -1) {
        state.lastFocusedIndex = index;
        setRovingTabindex(items, index);
      }
    }

    function handleFocusout (event, el, state) {
      if (state.config.memory) return;
      // relatedTarget is where focus is going — if still inside, ignore
      if (event.relatedTarget && el.contains(event.relatedTarget)) return;
      // Focus left the container — reset tabindex to first item
      const items = getItems(el, state.selector);
      if (items.length) {
        setRovingTabindex(items, 0);
        state.lastFocusedIndex = 0;
      }
    }

    // ── Lifecycle ───────────────────────────────────────────

    function attach (el, config) {
      const selector = resolveSelector(el, config);
      const skipDisabled = resolveSkipDisabled(el, config);
      const isRTL = getComputedStyle(el).direction === 'rtl' || el.closest('[dir="rtl"]') !== null;

      const state = {
        config,
        selector,
        skipDisabled,
        isRTL,
        lastFocusedIndex: 0,
        _internalMove: false,
        onKeydown: null,
        onFocusin: null,
        onFocusout: null,
      };

      // Set initial tabindex
      const items = getItems(el, selector);
      if (!items.length && process.env.NODE_ENV !== 'production') {
        const role = el.getAttribute('role');
         
        console.warn(
          `[DtFocusgroupDirective] No items found for selector "${selector}"` +
          (role ? ` (inferred from role="${role}")` : '') +
          '. Check that items match the selector, or provide an explicit selector via ' +
          'v-dt-focusgroup="{ selector: \'...\' }".',
        );
      }
      if (items.length) {
        let initialIndex = 0;
        if (skipDisabled) {
          const enabledIndex = items.findIndex(item => !isDisabled(item));
          if (enabledIndex !== -1) initialIndex = enabledIndex;
        }
        setRovingTabindex(items, initialIndex);
      }

      // Bind handlers
      state.onKeydown = (event) => handleKeydown(event, el, state);
      state.onFocusin = (event) => handleFocusin(event, el, state);
      state.onFocusout = (event) => handleFocusout(event, el, state);

      el.addEventListener('keydown', state.onKeydown);
      el.addEventListener('focusin', state.onFocusin);
      el.addEventListener('focusout', state.onFocusout);

      return state;
    }

    function cleanup (state, el) {
      if (!state) return;
      if (state.onKeydown) el.removeEventListener('keydown', state.onKeydown);
      if (state.onFocusin) el.removeEventListener('focusin', state.onFocusin);
      if (state.onFocusout) el.removeEventListener('focusout', state.onFocusout);
      state.onKeydown = null;
      state.onFocusin = null;
      state.onFocusout = null;
    }
  },
};

export default DtFocusgroupDirective;
