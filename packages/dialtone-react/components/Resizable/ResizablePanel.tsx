import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import {
  useResizableContext,
  type ResizablePanelConfig,
  type ResizablePanelState,
  type ResizableSizeValue,
} from './ResizableConstants';
import { isValidSizing } from './ResizableUtils';

/** What the default slot receives when it's a function: Vue's scoped slot props. */
export interface DtResizablePanelSlotScope {
  panel: ResizablePanelState | undefined;
  isCollapsed: boolean | undefined;
  isResizing: boolean;
}

interface DtResizablePanelOwnProps {
  /** Unique panel identifier. Must be unique within its DtResizable parent. */
  id: string;

  /**
   * Initial size as a Dialtone layout token (maps to `--dt-layout-*`, matching
   * DtBox and the `d-w-*` / `d-h-*` utility classes) or a percentage with 'p'
   * suffix (e.g. '25p' for 25% of the container).
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  initialSize?: ResizableSizeValue;

  /**
   * Minimum size for user drag interactions (hard floor). Accepts a layout
   * token or percentage; see `initialSize` for the value set.
   */
  userMinSize?: ResizableSizeValue;

  /**
   * Maximum size for user drag interactions (hard ceiling). Accepts a layout
   * token or percentage; see `initialSize` for the value set.
   */
  userMaxSize?: ResizableSizeValue;

  /**
   * Minimum size for system viewport scaling. Falls back to userMinSize.
   * Accepts a layout token or percentage; see `initialSize` for the value set.
   */
  systemMinSize?: ResizableSizeValue;

  /**
   * Maximum size for system viewport scaling. Falls back to userMaxSize.
   * Accepts a layout token or percentage; see `initialSize` for the value set.
   */
  systemMaxSize?: ResizableSizeValue;

  /**
   * Container width threshold that triggers auto-collapse. Accepts a layout
   * token or percentage; see `initialSize` for the value set.
   */
  collapseSize?: ResizableSizeValue;

  /** Whether this panel can be resized by dragging. */
  resizable?: boolean;

  /** Whether this panel can be collapsed to zero width. */
  collapsible?: boolean;

  /** Initial collapsed state. */
  collapsed?: boolean;

  /** Additional CSS classes applied to the panel element. */
  className?: ClassValue;

  /** Additional CSS classes applied to the inner content wrapper element. */
  contentClass?: ClassValue;

  /** Panel content, or a function of the panel's state (Vue's scoped slot). */
  children?: ReactNode | ((scope: DtResizablePanelSlotScope) => ReactNode);

  /** The panel element. */
  ref?: Ref<HTMLDivElement>;
}

export type DtResizablePanelProps = DtResizablePanelOwnProps
  & Omit<HTMLAttributes<HTMLDivElement>, keyof DtResizablePanelOwnProps>;

const SIZE_PROPS = ['initialSize', 'userMinSize', 'userMaxSize', 'systemMinSize', 'systemMaxSize', 'collapseSize'] as const;

const EMPTY_LAYOUT = { panels: new Map(), handles: [] };

/**
 * A panel inside DtResizable.
 */
export function DtResizablePanel ({
  id,
  initialSize,
  userMinSize,
  userMaxSize,
  systemMinSize,
  systemMaxSize,
  collapseSize,
  resizable = true,
  collapsible = false,
  collapsed = false,
  className = '',
  contentClass = '',
  children,
  style,
  ref,
  ...attrs
}: DtResizablePanelProps) {
  // Vue's immediate watcher on the size props: logs every invalid one, on mount and whenever any of them changes.
  const validated = useRef<string | null>(null);
  useEffect(() => {
    const sizes = [initialSize, userMinSize, userMaxSize, systemMinSize, systemMaxSize, collapseSize];
    const key = JSON.stringify(sizes);
    // A StrictMode re-run sees the same values, so it doesn't log twice.
    if (validated.current === key) return;
    validated.current = key;
    sizes.forEach((v, i) => {
      if (v !== undefined && !isValidSizing(v)) {
        console.error(`[DtResizablePanel] Invalid ${SIZE_PROPS[i]}: "${v}".`);
      }
    });
  }, [initialSize, userMinSize, userMaxSize, systemMinSize, systemMaxSize, collapseSize]);

  const ctx = useResizableContext();
  const layout = ctx?.layout ?? EMPTY_LAYOUT;
  const isResizing = ctx?.isResizing ?? false;
  const offsetContentStyles = ctx?.offsetContentStyles ?? {};

  const registerPanel = ctx?.registerPanel ?? null;
  const unregisterPanel = ctx?.unregisterPanel ?? null;

  const panelConfig = useMemo<ResizablePanelConfig>(() => ({
    id,
    initialSize,
    userMinSize,
    userMaxSize,
    systemMinSize,
    systemMaxSize,
    collapseSize,
    resizable,
    collapsible,
    collapsed,
  }), [id, initialSize, userMinSize, userMaxSize, systemMinSize, systemMaxSize, collapseSize, resizable, collapsible,
    collapsed]);

  // Registers on mount and re-registers when the config changes, replacing the entry in place (Vue's deep watcher).
  useLayoutEffect(() => {
    registerPanel?.(panelConfig);
  }, [registerPanel, panelConfig]);

  useLayoutEffect(() => () => {
    unregisterPanel?.(id);
  }, [unregisterPanel, id]);

  // Vue's watcher on `collapsed`. It's immediate there, but on mount it either waits for initialization or finds no
  // registered panel yet, so it only acts on changes.
  const collapsePanel = ctx?.collapsePanel ?? null;
  const isInitializing = ctx?.isInitializing ?? false;
  const previousCollapsed = useRef(collapsed);
  const onCollapsedChange = useEffectEvent((next: boolean) => {
    if (isInitializing) return;
    collapsePanel?.(id, next);
  });
  useEffect(() => {
    if (previousCollapsed.current === collapsed) return;
    previousCollapsed.current = collapsed;
    onCollapsedChange(collapsed);
  }, [collapsed]);

  const panel = ctx?.panelMap.get(id);

  const position = layout.panels.get(id);
  let panelStyles: CSSProperties;
  if (!position) {
    panelStyles = { insetInlineStart: '0px', inlineSize: '0px', pointerEvents: 'none' };
  } else if (position.collapsed) {
    panelStyles = {
      insetInlineStart: `${position.left}px`,
      inlineSize: '0px',
      overflow: 'hidden',
      pointerEvents: 'none',
    };
  } else {
    panelStyles = {
      insetInlineStart: `${position.left}px`,
      insetInlineEnd: `${position.right}px`,
    };
  }

  const scope: DtResizablePanelSlotScope = { panel, isCollapsed: panel?.collapsed, isResizing };

  return (
    <div
      id={`dt-resizable-panel-${id}`}
      className={cx(
        'd-resizable-panel',
        className,
        {
          'd-resizable-panel--collapsed': panel && panel.collapsed === true,
          'd-resizable-panel--fixed': panel && panel.resizable === false,
        },
      )}
      style={{ ...panelStyles, ...style }}
      data-panel-id={id}
      data-qa="d-resizable-panel"
      {...attrs}
      ref={ref}
    >
      <div
        className={cx('d-resizable-panel__content', contentClass)}
        style={offsetContentStyles}
      >
        {typeof children === 'function' ? children(scope) : children}
      </div>
    </div>
  );
}
