import { useState, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { DtTransition, type DtTransitionAsyncHook, type DtTransitionHook } from '../../common/transition';

/**
 * The transition hooks Vue's `$attrs` reach `<transition>` with. Each runs after the component's own hook for the
 * same moment. The appear hooks aren't accepted: Vue's own enter hooks run on appear too, and a consumer's appear hook
 * would replace them.
 */
interface TransitionHooks {
  onBeforeEnter?: DtTransitionHook;
  onEnter?: DtTransitionAsyncHook;
  onAfterEnter?: DtTransitionHook;
  onEnterCancelled?: DtTransitionHook;
  onBeforeLeave?: DtTransitionHook;
  onLeave?: DtTransitionAsyncHook;
  onAfterLeave?: DtTransitionHook;
  onLeaveCancelled?: DtTransitionHook;
}

export interface DtCollapsibleLazyShowProps extends TransitionHooks,
  Omit<HTMLAttributes<HTMLElement>, keyof TransitionHooks | 'children'> {
  /** Whether the child slot is shown. */
  show?: boolean;
  /** Enable/Disable transition animation */
  appear?: boolean;
  /** HTML element type (tag name) of the content wrapper element. */
  elementType?: string;
  /** slot for Content within collapsible */
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
}

const setHeightIfUnset = (element: HTMLElement, height: () => string) => {
  requestAnimationFrame(() => {
    if (!element.style.height) element.style.height = height();
  });
};

const setHeightInTwoFrames = (element: HTMLElement, height: () => string) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      element.style.height = height();
    });
  });
};

const clearHeight = (element: HTMLElement) => {
  element.style.height = '';
};

// Vue merges its own listener and the one in `$attrs` into one array: both run. A consumer's async hook that declares
// `done` keeps ending the transition itself, as Vue's callAsyncHook waits when any hook in the array declares it.
function chain (own: DtTransitionHook, consumer?: DtTransitionAsyncHook): DtTransitionAsyncHook | DtTransitionHook {
  if (!consumer) return own;
  if (consumer.length > 1) return (el, done) => { own(el); consumer(el, done); };
  return (el: HTMLElement) => { own(el); (consumer as DtTransitionHook)(el); };
}

const then = (own: DtTransitionHook, consumer?: DtTransitionHook): DtTransitionHook =>
  (el) => { own(el); consumer?.(el); };

/**
 * DtLazyShow's variant for DtCollapsible: renders its children only once first shown, and animates the content
 * wrapper's height on enter and leave.
 */
export function DtCollapsibleLazyShow ({
  show = false,
  appear = false,
  elementType = 'div',
  children,
  onBeforeEnter,
  onEnter,
  onAfterEnter,
  onEnterCancelled,
  onBeforeLeave,
  onLeave,
  onAfterLeave,
  onLeaveCancelled,
  ...attrs
}: DtCollapsibleLazyShowProps) {
  // Vue's `initialized` data, set by a watcher the first time `show` turns true.
  const [initialized, setInitialized] = useState(show);
  if (show && !initialized) setInitialized(true);

  const Element = elementType as ElementType;

  return (
    <DtTransition
      show={show}
      appear={appear}
      enterActiveClass="d-collapsible__enter-active"
      leaveActiveClass="d-collapsible__leave-active"
      onBeforeEnter={then(element => setHeightIfUnset(element, () => '0px'), onBeforeEnter)}
      onEnter={chain(element => setHeightInTwoFrames(element, () => `${element.scrollHeight}px`), onEnter)}
      onAfterEnter={then(clearHeight, onAfterEnter)}
      onEnterCancelled={onEnterCancelled}
      onBeforeLeave={then(element => setHeightIfUnset(element, () => `${element.offsetHeight}px`), onBeforeLeave)}
      onLeave={chain(element => setHeightInTwoFrames(element, () => '0px'), onLeave)}
      onAfterLeave={then(clearHeight, onAfterLeave)}
      onLeaveCancelled={onLeaveCancelled}
    >
      <Element {...attrs}>
        {initialized ? children : null}
      </Element>
    </DtTransition>
  );
}
