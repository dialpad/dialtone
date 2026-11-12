import {
  createContext,
  useContext,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type JSX,
  type Ref,
} from 'react';
import { cx } from '../../common/cx';
import { DT_MODE_ISLAND_TYPES, type ModeIslandType } from './ModeIslandConstants';
import { findParentMode, getOppositeMode, getRootContrast, getRootMaterial, getRootMode } from './Utils';

/**
 * Vue's `dtModeIslandMode` provide: the nearest mode island's resolved mode, or `null` outside one. Vue provides a
 * getter so the value stays reactive; React's context re-renders its consumers, so it holds the mode itself.
 */
export const DtModeIslandModeContext = createContext<string | null>(null);

/** The nearest DtModeIsland's resolved mode (`light` or `dark`), or `null` outside any island. */
export function useModeIslandContext (): string | null {
  return useContext(DtModeIslandModeContext);
}

export interface DtModeIslandProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Set this prop to render the mode island as a specific HTML element.
   * @values div, section, nav, article, aside, header, footer, main
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * The mode to apply to the island.
   * - 'inverted': Opposite of parent or root mode
   * - 'light': Always light mode
   * - 'dark': Always dark mode
   * @values inverted, light, dark
   */
  mode?: ModeIslandType;

  /** The rendered element. */
  ref?: Ref<HTMLElement>;
}

const ROOT_OBSERVER_CONFIG = (attribute: string): MutationObserverInit => ({
  attributes: true,
  attributeFilter: [attribute],
});

const MODE_OBSERVER_CONFIG: MutationObserverInit = {
  attributes: true,
  attributeFilter: ['data-dt-mode'],
  subtree: false,
};

/**
 * Prefer the useModeRegion hook (Vue's v-dt-mode directive) for local color-mode scoping.
 * DtModeIsland renders a container with the active mode's primary surface background.
 * Use it when that container and automatic surface are wanted together. Its mode prop uses "inverted";
 * the hook uses "invert". See the usage guide for server-rendering considerations.
 * @see https://dialtone.dialpad.com/components/mode-island.html
 */
export function DtModeIsland ({
  as = 'div',
  mode = DT_MODE_ISLAND_TYPES.INVERTED,
  className,
  children,
  ref,
  ...rest
}: DtModeIslandProps) {
  // Vue throws in beforeCreate: brand should only be set at the root level.
  if ((rest as Record<string, unknown>)['data-dt-brand']) {
    throw new Error(
      '[DtModeIsland] The data-dt-brand attribute is not allowed on mode islands. ' +
        'Brand should only be set at the root level.',
    );
  }

  const parentModeIslandMode = useModeIslandContext();
  const elementRef = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => elementRef.current as HTMLElement, []);

  const [currentContrast, setCurrentContrast] = useState(getRootContrast);
  const [currentMaterial, setCurrentMaterial] = useState(getRootMaterial);
  const [calculatedMode, setCalculatedMode] = useState<string | null>(null);

  const isInverted = mode === DT_MODE_ISLAND_TYPES.INVERTED;

  function calculateInvertedMode (element: Element | null): string {
    // First check if there's a parent mode island
    if (parentModeIslandMode) return getOppositeMode(parentModeIslandMode);
    // Otherwise, find the nearest parent with data-dt-mode
    if (element) return getOppositeMode(findParentMode(element));
    // Default fallback
    return getOppositeMode(getRootMode());
  }

  let computedMode: string;
  if (mode === DT_MODE_ISLAND_TYPES.LIGHT || mode === DT_MODE_ISLAND_TYPES.DARK) {
    computedMode = mode;
  } else if (isInverted && calculatedMode) {
    computedMode = calculatedMode;
  } else {
    // Before mount there's no element yet, as in Vue's computed (its elementRef is set in mounted).
    computedMode = calculateInvertedMode(elementRef.current);
  }

  // Vue's mounted / beforeUnmount: follow the root's contrast and material.
  useLayoutEffect(() => {
    const contrastObserver = new MutationObserver(() => setCurrentContrast(getRootContrast()));
    contrastObserver.observe(document.documentElement, ROOT_OBSERVER_CONFIG('data-dt-contrast'));
    const materialObserver = new MutationObserver(() => setCurrentMaterial(getRootMaterial()));
    materialObserver.observe(document.documentElement, ROOT_OBSERVER_CONFIG('data-dt-material'));

    setCurrentContrast(getRootContrast());
    setCurrentMaterial(getRootMaterial());

    return () => {
      contrastObserver.disconnect();
      materialObserver.disconnect();
    };
  }, []);

  // The observer outlives the render that set it up, so it reads the latest parent island mode through this.
  const recalculate = useEffectEvent((element: Element | null) => calculateInvertedMode(element));

  // Vue's mode observer, set up in mounted when inverted: the mode is calculated from the DOM, then recalculated
  // whenever the root's or an ancestor island's data-dt-mode changes. Vue only sets it up on mount; this also
  // follows `mode` switching to or from 'inverted'.
  useLayoutEffect(() => {
    if (!isInverted) return undefined;
    const element = elementRef.current;
    setCalculatedMode(recalculate(element));

    const modeObserver = new MutationObserver(() => setCalculatedMode(recalculate(element)));
    // Observe root element
    modeObserver.observe(document.documentElement, MODE_OBSERVER_CONFIG);
    // Also observe all parent elements with data-dt-mode
    for (let parent = element?.parentElement; parent; parent = parent.parentElement) {
      if (parent.hasAttribute('data-dt-mode')) modeObserver.observe(parent, MODE_OBSERVER_CONFIG);
    }

    return () => {
      modeObserver.disconnect();
      setCalculatedMode(null);
    };
  }, [isInverted]);

  const Component = as as ElementType;
  return (
    <DtModeIslandModeContext value={computedMode}>
      <Component
        ref={elementRef}
        className={cx('d-mode-island', className)}
        data-qa="dt-mode-island"
        data-dt-mode={computedMode}
        data-mode-island-inverted={isInverted ? '' : undefined}
        data-dt-contrast={currentContrast}
        data-dt-material={currentMaterial}
        {...rest}
      >
        {children}
      </Component>
    </DtModeIslandModeContext>
  );
}
