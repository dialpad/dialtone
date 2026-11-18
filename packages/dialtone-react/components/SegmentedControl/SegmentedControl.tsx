import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useControllableState } from '../../common/hooks/useControllableState';
import { useIndicatorAnimation } from '../../common/use-indicator-animation';
import { DtStack } from '../Stack';
import {
  SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_DATA_VALUE_ATTR,
  SEGMENTED_CONTROL_FOCUS_KEY,
  SEGMENTED_CONTROL_ITEM_SELECTOR,
  SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  SEGMENTED_CONTROL_SIZE_MODIFIERS,
  SEGMENTED_CONTROL_SPREAD_DEFAULT,
  type SegmentedControlActivationMode,
  type SegmentedControlGroupContext,
  type SegmentedControlOrientation,
  type SegmentedControlSelect,
  type SegmentedControlSize,
  type SegmentedControlSpread,
} from './SegmentedControlConstants';

interface DtSegmentedControlOwnProps {
  /**
   * Element ID for the radiogroup container.
   * Auto-generated if not provided.
   */
  id?: string;

  /** The currently selected value (controlled). Vue's v-model. */
  value?: string;

  /** The initially selected value, when `value` isn't controlled. */
  defaultValue?: string;

  /** Accessible label for the radiogroup. */
  ariaLabel?: string;

  /**
   * Orientation of the segmented control.
   * Maps to DtStack direction: horizontal -> row, vertical -> column.
   * @values horizontal, vertical
   */
  orientation?: SegmentedControlOrientation;

  /**
   * DtButton size for all items. Inherited by children via context.
   * @values 100, 200, 300, 400, 500
   */
  size?: SegmentedControlSize;

  /**
   * Controls whether items are selected on focus (auto) or on click/Space/Enter (manual).
   * @values auto, manual
   */
  activationMode?: SegmentedControlActivationMode;

  /**
   * Disables all items in the group.
   * Per-item disabled is set via the disabled prop on DtSegmentedControlItem.
   */
  disabled?: boolean;

  /** Shows the dividers between items. */
  showDivider?: boolean;

  /** Removes the border and padding from the container. */
  borderless?: boolean;

  /**
   * Controls how items distribute space.
   * 'grow' (default): items size to their content.
   * 'evenly': items share space equally.
   * @values grow, evenly
   */
  spread?: SegmentedControlSpread;

  /** Default label class for all items. Items can override with their own labelClass prop. */
  labelClass?: ClassValue;

  /**
   * If true, the selection indicator animates between items on click.
   * @values true, false
   */
  showIndicatorTransition?: boolean;

  /** DtSegmentedControlItem children */
  children?: ReactNode;

  /** Vue's `update:modelValue`: called with the new value when the user selects an item. */
  onValueChange?: (value: string) => void;

  /**
   * Called when the user selects an item (click, Enter, Space, or arrow in auto mode).
   * Not called for programmatic `value` changes.
   */
  onChange?: (value: string) => void;

  /** Called before a selection change. Call `event.preventDefault()` to cancel the change. */
  onBeforeChange?: (event: Event) => void;

  /** The radiogroup container. */
  ref?: Ref<HTMLDivElement>;
}

export type DtSegmentedControlProps = DtSegmentedControlOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof DtSegmentedControlOwnProps>;

const modifierOf = (modifiers: Readonly<Record<string, string>>, key: string) =>
  (Object.hasOwn(modifiers, key) ? modifiers[key] : undefined);

// React 19 calls a ref callback's returned cleanup on detach instead of calling it with null, so the merged callback
// returns one: each ref gets its own cleanup if it returned one, and null otherwise, as React would do itself.
function mergeRefs<T> (...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => {
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
      return undefined;
    });
    return () => {
      refs.forEach((ref, i) => {
        const cleanup = cleanups[i];
        if (typeof cleanup === 'function') cleanup();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      });
    };
  };
}

const isItemDisabled = (item: HTMLElement) => item.getAttribute('aria-disabled') === 'true';

function findNextEnabled (items: HTMLElement[], fromIndex: number, direction: 1 | -1) {
  const len = items.length;
  for (let i = 1; i <= len; i++) {
    const index = (fromIndex + i * direction + len) % len;
    if (!isItemDisabled(items[index])) return index;
  }
  return fromIndex;
}

/**
 * A segmented control lets users pick one option from a small set of mutually exclusive choices, shown as a row (or
 * column) of buttons.
 * @see https://dialtone.dialpad.com/components/segmented-control.html
 */
export function DtSegmentedControl ({
  id,
  value,
  defaultValue = '',
  ariaLabel,
  orientation = SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  size = SEGMENTED_CONTROL_SIZE_DEFAULT,
  activationMode = SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  disabled = false,
  showDivider = true,
  borderless = false,
  spread = SEGMENTED_CONTROL_SPREAD_DEFAULT,
  labelClass = '',
  showIndicatorTransition = true,
  children,
  className,
  onValueChange,
  onChange,
  onBeforeChange,
  onKeyDown,
  ref,
  ...attrs
}: DtSegmentedControlProps) {
  const generatedId = useId();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const rootRef = useMemo(() => mergeRefs<HTMLDivElement>(setContainer, ref), [ref]);
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange });
  // Not rendered: only keyboard navigation reads it, as Vue's `focusedValue` ref.
  const focusedValue = useRef<string | null>(null);

  const indicator = useIndicatorAnimation(
    container, '--segmented-indicator-duration', '--segmented-indicator-easing',
  );

  const getItems = useCallback(
    () => (container ? Array.from(container.querySelectorAll<HTMLElement>(SEGMENTED_CONTROL_ITEM_SELECTOR)) : []),
    [container],
  );

  // Ensures at least one enabled item is tabbable (WAI-ARIA radiogroup requirement).
  // Items set tabindex based on isSelected && !isDisabled. If the selected item is disabled
  // or the value doesn't match any item, no item has tabindex="0". This fallback sets
  // tabindex="0" on the first enabled item so keyboard users can reach the control.
  // Vue runs it on mount and after `modelValue` or `disabled` changes are in the DOM.
  useLayoutEffect(() => {
    const items = getItems();
    if (!items.length) return;
    if (items.some(el => el.getAttribute('tabindex') === '0')) return;
    const firstEnabled = items.find(el => !isItemDisabled(el));
    if (firstEnabled) firstEnabled.setAttribute('tabindex', '0');
  }, [getItems, selected, disabled]);

  // Vue animates on nextTick, once the new selection is in the DOM. Keeping the pending animation in state makes
  // sure a commit follows, even when a controlling parent keeps the old value.
  const [pendingAnimation, setPendingAnimation] = useState<{ oldRect: DOMRect; value: string } | null>(null);
  useLayoutEffect(() => {
    if (!pendingAnimation || !container) return;
    const newEl = container.querySelector<HTMLElement>(
      `[${SEGMENTED_CONTROL_DATA_VALUE_ATTR}="${CSS.escape(pendingAnimation.value)}"]`,
    );
    if (!newEl) return;
    indicator.animate({
      oldRect: pendingAnimation.oldRect,
      newEl,
      orientation,
      hideProps: { backgroundColor: 'transparent' },
      indicatorExtra: { backgroundColor: 'var(--button-color-background)' },
      pseudoElement: '::after',
    });
    // Deliberately keyed on the pending animation alone: only a new selection animates. `container`, `indicator` and
    // `orientation` are read as they are when it runs, as Vue's nextTick callback reads them.
  }, [pendingAnimation]);

  const selectValue: SegmentedControlSelect = (newValue, { animate: shouldAnimate = true } = {}) => {
    if (disabled) return;
    if (newValue === selected) return;
    const beforeChangeEvent = new Event('before-change', { cancelable: true });
    onBeforeChange?.(beforeChangeEvent);
    if (beforeChangeEvent.defaultPrevented) return;

    indicator.cancel();
    const shouldTransition = shouldAnimate && showIndicatorTransition;
    const old = shouldTransition ? indicator.snapshot('[aria-checked="true"]') : null;

    setSelected(newValue);
    onChange?.(newValue);

    if (old) setPendingAnimation({ oldRect: old.rect, value: newValue });
  };

  const setFocus = useCallback((focused: string) => {
    focusedValue.current = focused;
  }, []);

  const groupContext = useMemo<SegmentedControlGroupContext>(
    () => ({ selected, disabled, size, labelClass }),
    [selected, disabled, size, labelClass],
  );

  const getFocusedIndex = (items: HTMLElement[], event: KeyboardEvent<HTMLDivElement>) => {
    // First check event.target — the element that actually has focus
    const target = (event.target as Element).closest<HTMLElement>(SEGMENTED_CONTROL_ITEM_SELECTOR);
    if (target) {
      const targetIdx = items.indexOf(target);
      if (targetIdx !== -1) return targetIdx;
    }
    // Fall back to tracked focusedValue, then aria-checked
    const idx = items.findIndex((el) => {
      const itemValue = el.getAttribute(SEGMENTED_CONTROL_DATA_VALUE_ATTR);
      return focusedValue.current ? itemValue === focusedValue.current : el.getAttribute('aria-checked') === 'true';
    });
    return idx === -1 ? 0 : idx;
  };

  const activateItem = (item: HTMLElement) => {
    if (isItemDisabled(item)) return;
    selectValue(item.getAttribute(SEGMENTED_CONTROL_DATA_VALUE_ATTR) ?? '');
  };

  const getNavigationIndex = (key: string, currentIndex: number, items: HTMLElement[]) => {
    const isHorizontal = orientation === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    switch (key) {
      case nextKey: return findNextEnabled(items, currentIndex, 1);
      case prevKey: return findNextEnabled(items, currentIndex, -1);
      case 'Home': return findNextEnabled(items, items.length - 1, 1);
      case 'End': return findNextEnabled(items, 0, -1);
      default: return -1;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = getItems();
    if (!items.length) return;

    const focusedIndex = getFocusedIndex(items, event);

    if (event.key === 'Enter' || event.key === ' ') {
      activateItem(items[focusedIndex]);
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const newIndex = getNavigationIndex(event.key, focusedIndex, items);
    if (newIndex === -1) return;

    event.preventDefault();
    event.stopPropagation();
    items[newIndex].focus();

    if (activationMode === 'auto') {
      indicator.cancel();
      const itemValue = items[newIndex].getAttribute(SEGMENTED_CONTROL_DATA_VALUE_ATTR) ?? '';
      if (!isItemDisabled(items[newIndex])) {
        selectValue(itemValue, { animate: false });
      }
    }
  };

  return (
    <SEGMENTED_CONTROL_CONTEXT_KEY.Provider value={groupContext}>
      <SEGMENTED_CONTROL_SELECT_KEY.Provider value={selectValue}>
        <SEGMENTED_CONTROL_FOCUS_KEY.Provider value={setFocus}>
          <DtStack
            id={id ?? generatedId}
            align="stretch"
            className={cx(
              'd-segmented-control',
              modifierOf(SEGMENTED_CONTROL_SIZE_MODIFIERS, String(size)),
              {
                'd-segmented-control--hide-divider': !showDivider,
                'd-segmented-control--borderless': borderless,
                'd-segmented-control--vertical': orientation === 'vertical',
                'd-segmented-control--spread-evenly': spread === 'evenly' && orientation === 'horizontal',
              },
              className,
            )}
            direction={orientation === 'vertical' ? 'column' : 'row'}
            role="radiogroup"
            aria-label={ariaLabel}
            aria-orientation={orientation}
            data-qa="dt-segmented-control"
            {...attrs}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              handleKeyDown(event);
              onKeyDown?.(event);
            }}
            ref={rootRef}
          >
            {children}
          </DtStack>
        </SEGMENTED_CONTROL_FOCUS_KEY.Provider>
      </SEGMENTED_CONTROL_SELECT_KEY.Provider>
    </SEGMENTED_CONTROL_CONTEXT_KEY.Provider>
  );
}
