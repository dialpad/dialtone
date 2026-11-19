import {
  useCallback,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import {
  RESIZABLE_HANDLE_CENTER_OFFSET_PX,
  buildHandleId,
  useResizableContext,
  type ResizableResetBehavior,
} from './ResizableConstants';
import { pixelsToPercentage } from './ResizableUtils';
import { useResizableKeyboard } from './Composables/UseResizableKeyboard';
import type { LayoutResult } from './Composables/ComputeLayout';

interface DtResizableHandleOwnProps {
  /** ID of the panel before this handle. Auto-detected from layout order if not set. */
  beforePanelId?: string | null;

  /** ID of the panel after this handle. Auto-detected from layout order if not set. */
  afterPanelId?: string | null;

  /** Disable resize interaction for this handle. */
  disabled?: boolean;

  /** Additional CSS classes applied to the handle element. */
  className?: ClassValue;

  /** Disable the double-click reset behavior. */
  disableResetOnDoubleClick?: boolean;

  /**
   * Which panels to reset on double-click.
   * @values 'both', 'before', 'after', 'all'
   */
  resetBehavior?: ResizableResetBehavior;

  /** Override the default aria-label for i18n. The `aria-label` attribute does the same, as it does in Vue. */
  ariaLabel?: string | null;

  /** The handle element. */
  ref?: Ref<HTMLDivElement>;
}

export type DtResizableHandleProps = DtResizableHandleOwnProps
  & Omit<HTMLAttributes<HTMLDivElement>, keyof DtResizableHandleOwnProps | 'children'>;

const EMPTY_LAYOUT: LayoutResult = { panels: new Map(), handles: [] };
const NO_MESSAGES: Record<string, string> = {};
const NO_STYLES: Record<string, string> = {};
const noop = () => {};

/**
 * A draggable separator between two DtResizablePanels.
 */
export function DtResizableHandle ({
  beforePanelId = null,
  afterPanelId = null,
  disabled = false,
  className = '',
  disableResetOnDoubleClick = false,
  resetBehavior = 'both',
  ariaLabel = null,
  'aria-label': ariaLabelAttr,
  style,
  onPointerDown,
  onDoubleClick,
  onKeyDown,
  onFocus,
  onBlur,
  ref,
  ...attrs
}: DtResizableHandleProps) {
  // ── Context from DtResizable ─────────────────────────────────────────────

  const ctx = useResizableContext();
  const layout = ctx?.layout ?? EMPTY_LAYOUT;
  const panels = ctx?.panels ?? [];
  const direction = ctx?.direction ?? 'row';
  const containerSize = ctx?.containerSize ?? 1000;
  const activeHandleId = ctx?.activeHandleId;
  const startResize = ctx?.startResize ?? noop;
  const resetPanels = ctx?.resetPanels ?? noop;
  const registerHandle = ctx?.registerHandle ?? noop;
  const unregisterHandle = ctx?.unregisterHandle ?? noop;
  const saveToStorage = ctx?.saveToStorage ?? null;
  const collapsePanel = ctx?.collapsePanel ?? null;
  const commitPanelSize = ctx?.commitPanelSize ?? null;
  const announce = ctx?.announce ?? null;
  const panelMap = ctx?.panelMap ?? new Map();
  const injectedMessages = ctx?.messages ?? NO_MESSAGES;
  const offsetHandleStyles = ctx?.offsetHandleStyles ?? NO_STYLES;

  // ── Layout-driven position ───────────────────────────────────────────────

  // DOM index resolved once at mount time to avoid repeated querySelectorAll calls
  const [resolvedDomIndex, setResolvedDomIndex] = useState(0);

  let handlePosition = null;
  if (layout.handles.length > 0) {
    if (beforePanelId && afterPanelId) {
      const id = buildHandleId(beforePanelId, afterPanelId);
      handlePosition = layout.handles.find(h => h.id === id) ?? null;
    } else {
      handlePosition = layout.handles[resolvedDomIndex] ?? null;
    }
  }

  /** The composite handle identifier used by the drag system */
  const handleId = handlePosition?.id ?? '';

  /** Panel ID before this handle (from layout result) */
  const resolvedBeforePanelId = handlePosition?.beforePanelId ?? beforePanelId ?? '';

  /** Panel ID after this handle (from layout result) */
  const resolvedAfterPanelId = handlePosition?.afterPanelId ?? afterPanelId ?? '';

  /** Whether this handle is currently the active drag handle */
  const isActive = !!(handleId && activeHandleId === handleId);

  /**
   * Handle is disabled when:
   * - the `disabled` prop is set, OR
   * - the layout marks this handle as disabled (adjacent collapsed/non-resizable panel)
   */
  const isDisabled = disabled || (handlePosition?.disabled ?? false);

  // ── Position styles from layout ──────────────────────────────────────────

  const handleStyles: CSSProperties = handlePosition
    ? {
        insetInlineStart: `${Math.max(0, handlePosition.left - RESIZABLE_HANDLE_CENTER_OFFSET_PX)}px`,
        visibility: '' as CSSProperties['visibility'],
        ...offsetHandleStyles,
      }
    : { visibility: 'hidden' };

  // ── ARIA values ──────────────────────────────────────────────────────────

  const label = ariaLabel ?? ariaLabelAttr ?? null;
  let computedAriaLabel: string;
  if (label) {
    computedAriaLabel = label;
  } else {
    const before = resolvedBeforePanelId || 'first';
    const after = resolvedAfterPanelId || 'second';
    const template = injectedMessages.handleAriaLabel
      ?? 'Resize handle between {before} and {after} panels';
    computedAriaLabel = template.replace('{before}', before).replace('{after}', after);
  }

  const beforePanel = panelMap.get(resolvedBeforePanelId);

  let ariaValueText = '';
  if (beforePanel) {
    const template = injectedMessages.ariaValueText ?? '{panelId}: {pixels}px';
    ariaValueText = template
      .replace('{panelId}', resolvedBeforePanelId)
      .replace('{pixels}', String(Math.round(beforePanel.pixelSize)));
  }

  const hasValues = Boolean(beforePanel && containerSize);
  const ariaValueNow = hasValues && beforePanel
    ? Math.floor(pixelsToPercentage(beforePanel.collapsed ? 0 : beforePanel.pixelSize || 0, containerSize))
    : 0;
  const ariaValueMin = hasValues && beforePanel
    ? Math.floor(pixelsToPercentage(beforePanel.userMinSizePixels || 0, containerSize))
    : 0;
  const ariaValueMax = hasValues && beforePanel
    ? Math.floor(pixelsToPercentage(beforePanel.userMaxSizePixels || containerSize, containerSize))
    : 100;

  // ── Handle DOM element ───────────────────────────────────────────────────

  const handleElement = useRef<HTMLDivElement | null>(null);
  const setHandleElement = useCallback((el: HTMLDivElement | null) => {
    handleElement.current = el;
    if (typeof ref === 'function') return ref(el);
    if (ref) ref.current = el;
  }, [ref]);

  // ── Keyboard resize ──────────────────────────────────────────────────────

  const keyboard = useResizableKeyboard({
    panels,
    direction,
    containerSize,
    beforePanelId: resolvedBeforePanelId,
    afterPanelId: resolvedAfterPanelId,
    handleElement,
    onResize (beforeId, beforeSize, afterId, afterSize) {
      if (commitPanelSize) {
        commitPanelSize(beforeId, beforeSize);
        commitPanelSize(afterId, afterSize);
      } else {
        saveToStorage?.();
      }
    },
    onCollapse (panelId, collapsed) { collapsePanel?.(panelId, collapsed); },
    onReset (beforeId, afterId) { resetPanels?.(beforeId, afterId, 'both'); },
    onSizeAnnouncement (msg) { announce?.(msg); },
    messages: injectedMessages,
  });

  // ── Lifecycle ────────────────────────────────────────────────────────────

  // Vue registers its component instance; the handle's element stands in for it.
  const onMount = useEffectEvent((el: HTMLDivElement | null) => {
    registerHandle(el);

    if (el?.parentElement) {
      const allHandles = Array.from(el.parentElement.querySelectorAll('.d-resizable-handle'));
      const idx = allHandles.indexOf(el);
      if (idx >= 0) setResolvedDomIndex(idx);
    }
  });
  const onUnmount = useEffectEvent((el: HTMLDivElement | null) => unregisterHandle(el));

  // Mount and unmount only, as Vue's onMounted/onUnmounted: the index is resolved once.
  useLayoutEffect(() => {
    const el = handleElement.current;
    onMount(el);
    return () => onUnmount(el);
  }, []);

  // ── Event handlers ───────────────────────────────────────────────────────

  function handlePointerDown (event: PointerEvent<HTMLDivElement>) {
    if (!isDisabled) {
      event.preventDefault();
      startResize(handleId);
    }
    onPointerDown?.(event);
  }

  function handleDoubleClick (event: MouseEvent<HTMLDivElement>) {
    if (!disableResetOnDoubleClick && !isDisabled && resolvedBeforePanelId && resolvedAfterPanelId) {
      resetPanels(resolvedBeforePanelId, resolvedAfterPanelId, resetBehavior);
    }
    onDoubleClick?.(event);
  }

  function handleKeyDown (event: KeyboardEvent<HTMLDivElement>) {
    keyboard.handleKeyDown(event);
    onKeyDown?.(event);
  }

  function handleFocusEvent (event: FocusEvent<HTMLDivElement>) {
    keyboard.handleFocus();
    onFocus?.(event);
  }

  function handleBlurEvent (event: FocusEvent<HTMLDivElement>) {
    keyboard.handleBlur();
    onBlur?.(event);
  }

  return (
    <div
      ref={setHandleElement}
      data-qa="dt-resizable-handle"
      className={cx(
        'd-resizable-handle',
        `d-resizable-handle--${direction}`,
        className,
        {
          'd-resizable-handle--active': isActive,
          'd-resizable-handle--disabled': isDisabled,
        },
      )}
      style={{ ...handleStyles, ...style }}
      data-handle-id={handleId}
      tabIndex={isDisabled ? -1 : 0}
      role="separator"
      aria-orientation={direction === 'row' ? 'vertical' : 'horizontal'}
      aria-label={computedAriaLabel}
      aria-valuenow={ariaValueNow}
      aria-valuemin={ariaValueMin}
      aria-valuemax={ariaValueMax}
      aria-controls={`dt-resizable-panel-${resolvedBeforePanelId}`}
      aria-valuetext={ariaValueText}
      aria-disabled={isDisabled || undefined}
      {...attrs}
      onPointerDown={handlePointerDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocusEvent}
      onBlur={handleBlurEvent}
    >
      <div className="d-resizable-handle__indicator" />
    </div>
  );
}
