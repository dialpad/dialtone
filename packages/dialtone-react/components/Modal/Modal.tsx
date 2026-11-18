import {
  Children,
  useCallback,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { cx, type ClassValue } from '../../common/cx';
import { useFocusTrap } from '../../common/focustrap';
import { useControllableState } from '../../common/hooks/useControllableState';
import { useI18n } from '../../common/localization';
import { useMode, type ModeProps } from '../../common/mode';
import { hasContent } from '../../common/slots';
import { DtTransition } from '../../common/transition';
import { DtIconClose } from '../../icons';
import { DtButton } from '../Button';
import { SrOnlyCloseButton } from '../Button/sr_only_close_button';
import type { NoticeKind } from '../Notice';
import { DtText } from '../Text';
import { MODAL_BANNER_KINDS, MODAL_KIND_MODIFIERS, type ModalKind } from './ModalConstants';

const focusableSelector = 'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),' +
  'textarea:not(:disabled),details,[tabindex]:not([tabindex="-1"]):not(:disabled):not([aria-disabled="true"])';

/** Vue's `$nextTick`: resolves once the render React has queued has been committed to the DOM. */
const nextTick = () => Promise.resolve();

const isDtScrollbarInUse = (rootElement: Element) => rootElement.hasAttribute('data-overlayscrollbars');

// dialtone-vue's disableRootScrolling and enableRootScrolling (common/utils), which Popover's port also keeps privately.
/** Disables scrolling on the root element, whether or not dt-scrollbar is in use. */
function disableRootScrolling (rootElement: Element = document.documentElement) {
  rootElement.classList.add(isDtScrollbarInUse(rootElement) ? 'd-scrollbar-disabled' : 'd-of-hidden');
}

/** Enables scrolling on the root element, whether or not dt-scrollbar is in use. */
function enableRootScrolling (rootElement: Element = document.documentElement) {
  rootElement.classList.remove(isDtScrollbarInUse(rootElement) ? 'd-scrollbar-disabled' : 'd-of-hidden');
}

/** Vue's getScrollRoot(): the shadow host the dialog lives in, or undefined in a document (the helpers' default). */
const shadowHostOf = (el: Element): Element | undefined => (el.getRootNode() as Partial<ShadowRoot>).host;

function focusFirstTabbable (container: HTMLElement) {
  const focusable = [...container.querySelectorAll<HTMLElement>(focusableSelector)];
  if (!focusable.length) return;
  let target = focusable[0];
  // If first focusable is an unchecked radio, prefer the checked radio in the same group.
  if (target.matches('[type="radio"]:not(:checked)')) {
    const name = (target as HTMLInputElement).name;
    target = focusable.find(el => (el as HTMLInputElement).checked && (el as HTMLInputElement).name === name) ?? target;
  }
  target.focus({ preventScroll: true });
}

export interface DtModalProps extends ModeProps {
  /** The native `<dialog>` element. */
  ref?: Ref<HTMLDialogElement>;

  /** Body text to display as the modal's main content. */
  copy?: string;

  /**
   * Id to use for the dialog's aria-describedby.
   * Recommended only if the dialog content itself isn't enough to give full context,
   * as screen readers should recite the dialog contents by default before any aria-description.
   */
  describedById?: string;

  /** Id to use for the dialog's aria-labelledby. Defaults to a generated unique id. */
  labelledById?: string;

  /**
   * Whether the modal should be shown.
   * Parent component can sync on this value through `onOpenChange` to control the modal's visibility.
   * @values true, false
   */
  open?: boolean;

  /** Whether the modal starts shown when `open` isn't set. */
  defaultOpen?: boolean;

  /** Header text to display in the modal header. */
  headerText?: string;

  /** Header text to display in the modal banner. */
  bannerHeaderText?: string;

  /**
   * The theme of the modal.
   * @values default, critical
   */
  kind?: ModalKind;

  /**
   * Whether the modal fills the viewport instead of rendering at its default size.
   * @values true, false
   */
  fullscreen?: boolean;

  /** Additional class name for the root modal element. */
  modalClass?: ClassValue;

  /** Additional class name for the dialog element within the modal. */
  dialogClass?: ClassValue;

  /** Additional class name for the content element within the modal. */
  contentClass?: ClassValue;

  /**
   * Sets the color of the banner.
   * @values base, critical, info, positive, warning
   */
  bannerKind?: NoticeKind;

  /** Additional class name for the banner element within the modal. */
  bannerClass?: ClassValue;

  /** Additional class name for the header element within the modal. */
  headerClass?: ClassValue;

  /** Additional class name for the footer element within the modal. */
  footerClass?: ClassValue;

  /**
   * Shows the close button on the modal
   * @values true, false
   */
  showClose?: boolean;

  /**
   * Whether the modal will close when you click outside of the dialog on the overlay.
   * @values true, false
   */
  closeOnClick?: boolean;

  /**
   * Scrollable modal that allows scroll the modal content keeping the header and footer fixed
   * @values true, false
   */
  fixedHeaderFooter?: boolean;

  /**
   * The element that is focused when the modal is opened. This can be an HTMLElement within the modal, a string
   * starting with '#' which will find the element by ID, or 'first' which will automatically focus the first element.
   */
  initialFocusElement?: 'first' | `#${string}` | HTMLElement;

  /**
   * A CSS selector string for the element to portal the modal to. If not provided, the modal will be rendered in its
   * default location.
   */
  appendTo?: string;

  /**
   * When true, the surrounding backdrop is rendered fully transparent instead of the default dimming overlay. The
   * dialog box itself remains opaque. Useful when the underlying UI should remain visible.
   * @values true, false
   */
  transparentBackdrop?: boolean;

  /**
   * When true, the dialog opens with showModal(), which promotes it to the browser top layer. Nothing outside the top
   * layer can paint above it regardless of z-index, so application surfaces such as toasts and call notifications end
   * up behind it. When false, it opens with show() and stays in the normal stacking order, where the Dialtone z-index
   * scale applies and --zi-notification (700) outranks --zi-modal (600) as documented.
   *
   * Focus trapping, scroll locking and Esc-to-close behave identically in both modes. Background inertness does not:
   * only the top layer provides it, so with modal unset the page outside the dialog stays reachable. That is
   * deliberate — it is what lets an application's own overlays remain usable above a modal — and keyboard containment
   * still comes from the focus trap.
   * @values true, false
   */
  modal?: boolean;

  /** Default slot for dialog body section, taking the place of any "copy" text prop. */
  children?: ReactNode;

  /** Slot for the banner, defaults to bannerHeaderText prop. */
  banner?: ReactNode;

  /** Slot for dialog header section, taking the place of any "headerText" text prop. */
  header?: ReactNode;

  /** Slot for dialog footer content, often containing cancel and confirm buttons. */
  footer?: ReactNode;

  /** Native click event on the dialog. */
  onClick?: (event: MouseEvent<HTMLDialogElement>) => void;

  /** Native keydown event on the dialog. */
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;

  /**
   * Called with `false` when the user performs a modal-closing action, and with `true` once the modal has finished
   * opening. Parent components can sync `open` on it to control modal visibility.
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Modals focus the user's attention exclusively on one task or piece of information
 * via a window that sits on top of the page content.
 * @see https://dialtone.dialpad.com/components/modal.html
 */
export function DtModal ({
  ref,
  copy = '',
  describedById = '',
  labelledById,
  open: openProp,
  defaultOpen = false,
  headerText,
  bannerHeaderText,
  kind = 'default',
  fullscreen = false,
  modalClass = '',
  dialogClass = '',
  contentClass = '',
  bannerKind = 'warning',
  bannerClass = '',
  headerClass = '',
  footerClass = '',
  showClose = true,
  closeOnClick = true,
  fixedHeaderFooter = true,
  initialFocusElement = 'first',
  appendTo,
  transparentBackdrop = false,
  modal = false,
  contentMode,
  children,
  banner,
  header,
  footer,
  onClick,
  onKeyDown,
  onOpenChange,
}: DtModalProps) {
  const generatedId = useId();
  const labelId = labelledById ?? generatedId;

  const i18n = useI18n();
  const closeButtonTitle = i18n.$t('DIALTONE_CLOSE_BUTTON');

  const [open, setOpen] = useControllableState({ value: openProp, defaultValue: defaultOpen, onChange: onOpenChange });

  // The dialog in state as well as in a ref, so the focus trap and mode hooks follow it when it's portalled elsewhere.
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [dialogEl, setDialogEl] = useState<HTMLDialogElement | null>(null);
  const setDialog = useCallback((el: HTMLDialogElement | null) => {
    dialogRef.current = el;
    setDialogEl(el);
  }, []);
  useImperativeHandle(ref, () => dialogEl as HTMLDialogElement, [dialogEl]);

  const previousActiveElement = useRef<Element | null>(null);
  const mousedownOnBackdrop = useRef(false);
  const mouseupOnBackdrop = useRef(false);

  // Vue's ModeMixin. Its reference element is Vue's `$el`, the teleport's placeholder where the modal is declared; the
  // port has no node there, so `invert` resolves from the dialog's own ancestors.
  const modeAttrs = useMode(contentMode, () => dialogRef.current, dialogEl);

  useFocusTrap(dialogEl, { active: open, initialFocus: false, restoreFocus: false });

  // The teleport's target. A selector is resolved after the commit, as Vue's Teleport resolves it on mount, so it can
  // match an element mounted in the same update; nothing renders when it matches nothing.
  const [appendTarget, setAppendTarget] = useState<Element | null>(null);
  useLayoutEffect(() => {
    setAppendTarget(appendTo ? document.querySelector(appendTo) : null);
  }, [appendTo]);

  // Vue's autoTeleportTarget: a modal rendered in place inside a shadow root moves to that shadow root.
  const [autoTeleportTarget, setAutoTeleportTarget] = useState<ShadowRoot | null>(null);

  // Vue's beforeUnmount, for each dialog element: one that is removed while open is closed and gives scrolling back.
  // Declared before the effect that shows the dialog, so a StrictMode re-run closes it before showing it again.
  useLayoutEffect(() => {
    if (!dialogEl) return undefined;
    const scrollRoot = shadowHostOf(dialogEl);
    return () => {
      if (dialogEl.open) {
        dialogEl.close();
        enableRootScrolling(scrollRoot);
      }
    };
  }, [dialogEl]);

  // Vue's `open` watcher and the opening half of mounted(): show the dialog and lock scrolling when it opens; unlock
  // scrolling when it closes (the dialog itself is closed once the leave transition ends, in onAfterLeave). It also
  // runs for a new dialog element, since a moved portal mounts a fresh one that has to be shown again.
  const syncedOpen = useRef(false);
  useLayoutEffect(() => {
    if (!dialogEl) return;

    // Rendered in place in a shadow root: move into it first, and show the dialog that renders there (Vue defers its
    // syncDialogState to the next tick for the same reason).
    if (!appendTo && !autoTeleportTarget) {
      const root = dialogEl.getRootNode();
      if (root instanceof ShadowRoot) {
        setAutoTeleportTarget(root);
        return;
      }
    }

    if (open) {
      // Only when it opens, as Vue's watcher runs only on a change: not again for a moved dialog or a StrictMode re-run.
      if (!syncedOpen.current) previousActiveElement.current = document.activeElement;
      if (!dialogEl.open) {
        // show() leaves the dialog in the normal stacking order instead of the top layer, where the z-index scale
        // still applies.
        if (modal) dialogEl.showModal(); else dialogEl.show();
      }
      disableRootScrolling(shadowHostOf(dialogEl));
    } else if (dialogEl.open) {
      // Leave transition plays via v-show on inner content.
      // close() is called in onAfterLeave when transition completes.
      enableRootScrolling(shadowHostOf(dialogEl));
    }
    syncedOpen.current = open;
    // `modal` is left out on purpose: as in Vue, it's read only when the dialog opens, and changing it doesn't reopen it.
  }, [open, dialogEl, appendTo, autoTeleportTarget]);

  const close = () => setOpen(false);

  const onBackdropMousedown = (event: MouseEvent<HTMLDialogElement>) => {
    mousedownOnBackdrop.current = event.target === event.currentTarget;
  };

  const onBackdropMouseup = (event: MouseEvent<HTMLDialogElement>) => {
    mouseupOnBackdrop.current = event.target === event.currentTarget;
  };

  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    const pressedAndReleasedOnBackdrop = mousedownOnBackdrop.current && mouseupOnBackdrop.current;
    if (closeOnClick && event.target === event.currentTarget && pressedAndReleasedOnBackdrop) {
      close();
    }
    onClick?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    // The native cancel event only fires for dialogs opened with showModal(), so
    // Esc has to be handled explicitly to keep dismissal identical in both modes.
    // defaultPrevented means a nested widget (dropdown, combobox) already consumed
    // it to close itself, and the modal must not close out from under it.
    if (!modal && event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault();
      close();
    }
    onKeyDown?.(event);
  };

  const onCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    close();
  };

  const setFocusAfterTransition = async () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    await nextTick();

    if (initialFocusElement === 'first') {
      focusFirstTabbable(dialog);
    } else if (typeof initialFocusElement === 'string' && initialFocusElement.startsWith('#')) {
      const el = dialog.querySelector<HTMLElement>(initialFocusElement);
      if (el) {
        el.focus();
      } else {
        console.warn('Could not find the element specified in dt-modal prop "initialFocusElement". ' +
          'Defaulting to focusing the first element.');
        focusFirstTabbable(dialog);
      }
    } else if (initialFocusElement instanceof HTMLElement) {
      initialFocusElement.focus();
    }
  };

  const onAfterEnter = () => {
    setOpen(true);
    void setFocusAfterTransition();
  };

  const onAfterLeave = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
    }
    (previousActiveElement.current as HTMLElement | null)?.focus?.();
    previousActiveElement.current = null;
  };

  const dialog = (
    <dialog
      ref={setDialog}
      className={cx(
        'd-modal',
        MODAL_KIND_MODIFIERS[kind],
        { 'd-modal--full': fullscreen },
        { 'd-modal--transparent-backdrop': transparentBackdrop },
        modalClass,
      )}
      data-qa="dt-modal"
      aria-modal={modal ? 'true' : undefined}
      aria-describedby={describedById || undefined}
      aria-labelledby={labelId}
      {...modeAttrs}
      onCancel={onCancel}
      onMouseDown={onBackdropMousedown}
      onMouseUp={onBackdropMouseup}
      onClick={onBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {open && (hasContent(banner) || bannerHeaderText) && (
        <div
          data-qa="dt-modal-banner"
          className={cx('d-modal__banner', bannerClass, MODAL_BANNER_KINDS[bannerKind])}
        >
          {Children.toArray(banner).length > 0 ? banner : bannerHeaderText}
        </div>
      )}
      <DtTransition
        show={open}
        appear={open}
        name="d-modal__dialog"
        onAfterEnter={onAfterEnter}
        onAfterLeave={onAfterLeave}
      >
        <div
          className={cx(
            'd-modal__dialog',
            { 'd-modal__dialog--scrollable': fixedHeaderFooter },
            dialogClass,
          )}
        >
          {hasContent(header)
            ? (
              <div
                id={labelId}
                className={cx('d-modal__header', headerClass)}
                data-qa="dt-modal-title"
              >
                {header}
              </div>
            )
            : (
              <DtText
                id={labelId}
                kind="headline"
                size={600}
                strength="medium"
                density="100"
                textBoxTrim="start"
                as="h2"
                className={cx('d-modal__header', headerClass)}
                data-qa="dt-modal-title"
              >
                {headerText}
              </DtText>
            )}
          {hasContent(children)
            ? (
              <div className={cx('d-modal__content', contentClass)} data-qa="dt-modal-copy">
                {children}
              </div>
            )
            : (
              <p className={cx('d-modal__content', contentClass)} data-qa="dt-modal-copy">
                {copy}
              </p>
            )}
          {footer !== undefined && (
            <footer className={cx('d-modal__footer', footerClass)}>
              {footer}
            </footer>
          )}
          {!showClose
            ? <SrOnlyCloseButton onClose={close} />
            : (
              <DtButton
                className="d-modal__close"
                data-qa="dt-modal-close-button"
                size={300}
                kind="muted"
                importance="clear"
                aria-label={closeButtonTitle}
                title={closeButtonTitle}
                onClick={close}
                icon={({ iconSize }) => <DtIconClose size={iconSize} />}
              />
            )}
        </div>
      </DtTransition>
    </dialog>
  );

  if (appendTo) return appendTarget && createPortal(dialog, appendTarget);
  if (autoTeleportTarget) return createPortal(dialog, autoTeleportTarget);
  return dialog;
}
