import { useEffect, useEffectEvent, useState, type ReactNode } from 'react';
import type { ClassValue } from '../../common/cx';
import { ToastLayoutAlternate } from './Layouts/ToastLayoutAlternate';
import { ToastLayoutDefault } from './Layouts/ToastLayoutDefault';
import type { ToastListeners } from './Layouts/ToastLayoutProps';
import {
  TOAST_MIN_DURATION,
  type ToastAlternateKind,
  type ToastLayout,
  type ToastRole,
} from './ToastConstants';

export interface DtToastProps extends Omit<ToastListeners, 'onClose'> {
  /**
   * Sets an ID on the header element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the header.
   */
  headerId?: string;

  /**
   * Sets an ID on the content element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the content.
   */
  contentId?: string;

  /** Header text of the toast. This can be left blank to remove the header from the toast entirely. */
  headerText?: string;

  /** Message of the toast. Overridden by children. */
  message?: string;

  /**
   * Provides a role for the toast. 'status' is used by default to communicate a message. 'alert' is used to
   * communicate an important message like an error that does not contain any interactive elements.
   * @values status, alert
   */
  role?: ToastRole;

  /**
   * Severity level of the toast, could be different depending on which toast layout is used.
   * @values base, critical, info, positive, warning, gradient
   */
  kind?: ToastAlternateKind;

  /**
   * Used in scenarios where the message needs to visually dominate the screen.
   * @values true, false
   */
  important?: boolean;

  /**
   * Controls whether the toast is shown. If a valid duration is provided, the toast will disappear
   * after reaching the duration time, and report it through `onOpenChange(false)`, as does the close button.
   * The toast hides itself either way; a change of `open` shows or hides it again.
   * @values true, false
   */
  open?: boolean;

  /**
   * Shows the close button in the toast.
   * @values true, false
   */
  showClose?: boolean;

  /**
   * Shows the icon in the toast.
   * @values true, false
   */
  showIcon?: boolean;

  /**
   * Shows the action in the toast.
   * @values true, false
   */
  showAction?: boolean;

  /**
   * The duration in ms the toast will display before disappearing.
   * The toast won't disappear if the duration is not provided.
   * If it's provided, it should be equal to or greater than 6000.
   */
  duration?: number | null;

  /**
   * The layout / styling you wish to use for the toast.
   * @values default, alternate
   */
  layout?: ToastLayout;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Additional class name for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /** Additional class name for the action wrapper element. */
  actionClass?: ClassValue;

  /** Additional class name for the toast's root element. */
  className?: string;

  /** The main textual content of the toast */
  children?: ReactNode;

  /** Custom icon */
  icon?: ReactNode;

  /** The header, in place of headerText */
  header?: ReactNode;

  /** Enter a possible action for the user to take, such as a link to another page */
  action?: ReactNode;

  /** Close button click event */
  onClose?: () => void;

  /** Sync open value: called with `false` when the toast closes itself. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Vue's layouts take only `class` and the listeners from the attributes DtToast forwards them, so any other attribute
 * (`id`, `style`, `aria-*`, `data-qa`) is dropped, as it is in Vue.
 */
function extractListeners (attrs: Record<string, unknown>): ToastListeners {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => /^on[A-Z]/.test(key)));
}

/**
 * A toast notice, sometimes called a snackbar, is a time-based message that appears based on users' actions.
 * It contains at-a-glance information about outcomes and can be paired with actions.
 * @see https://dialtone.dialpad.com/components/toast.html
 */
export function DtToast ({
  headerId,
  contentId,
  headerText,
  message,
  role = 'status',
  kind,
  important = false,
  open = false,
  showClose = true,
  showIcon = true,
  showAction = true,
  duration = null,
  layout = 'default',
  iconClass = '',
  headerClass = '',
  contentClass = '',
  actionClass = '',
  className,
  children,
  icon,
  header,
  action,
  onClose,
  onOpenChange,
  ...attrs
}: DtToastProps) {
  // Vue's isShown: `open` is synced into it whenever it changes (Vue's immediate watcher), and the toast hides itself
  // on close or when its duration runs out, whether or not the parent updates `open`.
  const [isShown, setIsShown] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    setIsShown(open);
  }

  const expire = useEffectEvent(() => {
    setIsShown(false);
    onOpenChange?.(false);
  });

  // Reads the duration as `open` turns true, as Vue's watcher does: a later duration change doesn't restart the timer.
  const startTimer = useEffectEvent(() => {
    const shouldSetTimeout = !!duration && duration >= TOAST_MIN_DURATION;
    return shouldSetTimeout ? setTimeout(() => expire(), duration) : undefined;
  });

  useEffect(() => {
    if (!open) return undefined;
    const timer = startTimer();
    return () => clearTimeout(timer);
  }, [open]);

  const handleClose = () => {
    setIsShown(false);
    onClose?.();
    onOpenChange?.(false);
  };

  const Layout = layout === 'alternate' ? ToastLayoutAlternate : ToastLayoutDefault;

  return (
    <Layout
      isShown={isShown}
      headerId={headerId}
      contentId={contentId}
      headerText={headerText}
      message={message}
      role={role}
      kind={kind}
      important={important}
      showClose={showClose}
      showIcon={showIcon}
      showAction={showAction}
      iconClass={iconClass}
      headerClass={headerClass}
      contentClass={contentClass}
      actionClass={actionClass}
      className={className}
      icon={icon}
      header={header}
      action={action}
      {...extractListeners(attrs)}
      onClose={handleClose}
    >
      {children}
    </Layout>
  );
}
