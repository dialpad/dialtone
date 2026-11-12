import { useState, type ComponentProps, type ReactNode } from 'react';
import { DtTransition, type DtTransitionProps } from '../../common/transition';

/**
 * Vue binds `$attrs` to both `<Transition>` and the div, so the transition's own props (its hooks, `duration`, `type`
 * and class overrides) are accepted here too. `css` isn't: Vue turns it off in tests only, which the port can't do.
 */
type TransitionPassThrough = Omit<DtTransitionProps, 'show' | 'name' | 'appear' | 'css' | 'unmountOnLeave' | 'children'>;

export interface DtLazyShowProps extends TransitionPassThrough, Omit<ComponentProps<'div'>, keyof TransitionPassThrough> {
  /** Whether the child slot is shown. */
  show?: boolean;
  /** A valid Vue enter/leave CSS transition name. */
  transition?: string | null;
  /** Enable/Disable transition animation */
  appear?: boolean;
  /** Slot for main content */
  children?: ReactNode;
}

/**
 * Lazy Show is a utility component that prevents its children from being rendered until the first time it is shown.
 * @see https://dialtone.dialpad.com/components/lazy_show.html
 */
export function DtLazyShow ({
  show = false,
  transition = null,
  appear = false,
  children,
  // The transition's own props: Vue's `$attrs` reach `<Transition>`.
  duration,
  type,
  enterFromClass,
  enterActiveClass,
  enterToClass,
  appearFromClass,
  appearActiveClass,
  appearToClass,
  leaveFromClass,
  leaveActiveClass,
  leaveToClass,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onEnterCancelled,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  onLeaveCancelled,
  onBeforeAppear,
  onAppear,
  onAfterAppear,
  onAppearCancelled,
  ...attrs
}: DtLazyShowProps) {
  // Vue's `initialized` data, set by a watcher the first time `show` turns true.
  const [initialized, setInitialized] = useState(show);
  if (show && !initialized) setInitialized(true);

  return (
    <DtTransition
      show={show}
      name={transition ?? undefined}
      appear={appear}
      duration={duration}
      type={type}
      enterFromClass={enterFromClass}
      enterActiveClass={enterActiveClass}
      enterToClass={enterToClass}
      appearFromClass={appearFromClass}
      appearActiveClass={appearActiveClass}
      appearToClass={appearToClass}
      leaveFromClass={leaveFromClass}
      leaveActiveClass={leaveActiveClass}
      leaveToClass={leaveToClass}
      onBeforeEnter={onBeforeEnter}
      onEnter={onEnter}
      onAfterEnter={onAfterEnter}
      onEnterCancelled={onEnterCancelled}
      onBeforeLeave={onBeforeLeave}
      onLeave={onLeave}
      onAfterLeave={onAfterLeave}
      onLeaveCancelled={onLeaveCancelled}
      onBeforeAppear={onBeforeAppear}
      onAppear={onAppear}
      onAfterAppear={onAfterAppear}
      onAppearCancelled={onAppearCancelled}
    >
      <div data-qa="dt-lazy-show" {...attrs}>
        {initialized ? children : null}
      </div>
    </DtTransition>
  );
}
