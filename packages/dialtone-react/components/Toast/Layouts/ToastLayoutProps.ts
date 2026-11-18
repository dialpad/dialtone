import type { DOMAttributes, ReactNode } from 'react';
import type { ClassValue } from '../../../common/cx';
import type { ToastAlternateKind, ToastRole } from '../ToastConstants';

/**
 * The consumer's event handlers, which the layouts pass to each of the notice parts (icon, content and action), as
 * Vue's layouts do with `extractVueListeners($attrs)`.
 */
export type ToastListeners = {
  [K in keyof DOMAttributes<HTMLDivElement> as K extends `on${string}` ? K : never]?: DOMAttributes<HTMLDivElement>[K];
};

/** The props DtToast passes to either layout. */
export interface ToastLayoutProps extends Omit<ToastListeners, 'onClose'> {
  isShown?: boolean;

  /** Sets an ID on the header element. Defaults to a generated unique ID. */
  headerId?: string;

  /** Sets an ID on the content element. Defaults to a generated unique ID. */
  contentId?: string;

  /** Header text of the toast. This can be left blank to remove the header from the toast entirely. */
  headerText?: string;

  /** Message of the toast. Overridden by children. */
  message?: string;

  /**
   * Provides a role for the toast.
   * @values status, alert
   */
  role?: ToastRole;

  /**
   * Severity level of the toast, sets the icon and background
   * @values base, critical, info, positive, warning, gradient
   */
  kind?: ToastAlternateKind;

  /** Used in scenarios where the message needs to visually dominate the screen. */
  important?: boolean;

  /** Shows the close button in the toast */
  showClose?: boolean;

  /** Shows the icon in the toast */
  showIcon?: boolean;

  /** Shows the action in the toast */
  showAction?: boolean;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Additional class name for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /** Additional class name for the action wrapper element. */
  actionClass?: ClassValue;

  /** The consumer's class, on the root element. */
  className?: string;

  /** The main textual content of the toast */
  children?: ReactNode;

  /** Custom icon */
  icon?: ReactNode;

  /** The header, in place of headerText */
  header?: ReactNode;

  /** A possible action for the user to take */
  action?: ReactNode;

  /** Close button click event */
  onClose?: () => void;
}
