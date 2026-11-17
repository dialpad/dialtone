import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
} from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../common/focustrap';
import { useI18n } from '../../common/localization';
import { useMode, type ModeProps } from '../../common/mode';
import { DtTransition } from '../../common/transition';
import { DtIconClose } from '../../icons';
import { DtButton } from '../Button';
import { SrOnlyCloseButton } from '../Button/sr_only_close_button';

// Vue's EVENT_KEYNAMES.esc and EVENT_KEYNAMES.escape, which the modal compares `event.code` with.
const ESCAPE_CODES = ['Esc', 'Escape'];

type NativeAttributes = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'aria-label'>;

export interface DtImageViewerProps extends ModeProps, NativeAttributes {
  /** The root element. */
  ref?: Ref<HTMLDivElement>;

  /**
   * By default the portal appends to the nearest ancestor <dialog> element when inside one (keeping the image viewer in
   * the browser's top layer), or to the body otherwise. We can modify this behaviour by passing an appendTo prop that
   * points to an id or an html tag from the root of the parent. The appendTo prop expects a CSS selector string or an
   * actual DOM node.
   * type: string | HTMLElement, default: 'body'
   */
  appendTo?: string | HTMLElement;

  /**
   * Controls whether the image modal is shown. When null (default), the image modal triggers on click. When set to true
   * or false, the default trigger is disabled and the parent controls visibility through `onOpenChange`.
   * @values null, true, false
   */
  open?: boolean | null;

  /** Whether the image modal starts open when `open` isn't set. */
  defaultOpen?: boolean;

  /** URL of the image to be shown */
  imageSrc: string;

  /** Alt text of image */
  imageAlt: string;

  /** Image Class */
  imageButtonClass?: string;

  /** Aria label */
  ariaLabel: string;

  /** Emitted when the image modal is shown or hidden. */
  onOpened?: (opened: boolean) => void;

  /** Syncs the open prop with the parent component: called with `false` when the modal closes and `open` is set. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * An image viewer shows an image as a preview button that opens the image in a full screen modal.
 * @see https://dialtone.dialpad.com/components/image-viewer.html
 */
export function DtImageViewer ({
  appendTo = 'body',
  open = null,
  defaultOpen = false,
  imageSrc,
  imageAlt,
  imageButtonClass = '',
  ariaLabel,
  contentMode,
  onOpened,
  onOpenChange,
  ref,
  ...rest
}: DtImageViewerProps) {
  const i18n = useI18n();
  const closeButtonTitle = i18n.$t('DIALTONE_CLOSE_BUTTON');

  const rootRef = useRef<HTMLDivElement>(null);
  const previewButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [modalEl, setModalEl] = useState<HTMLElement | null>(null);

  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, []);

  const [showCloseButton, setShowCloseButton] = useState(true);

  // Vue's isOpen. `open` is synced into it whenever it changes (Vue's immediate watcher), but closing from inside (Escape,
  // the background, the close button) changes it too, controlled or not, and reports through onOpenChange.
  const [isOpen, setIsOpen] = useState<boolean>(open ?? defaultOpen);
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open !== null) setIsOpen(open);
  }

  // Mirrors Tooltip/Popover's dialog-detection: without it, an image viewer nested in a native <dialog>-based DtModal
  // would portal straight to document.body and render behind the ancestor dialog's top layer. 'body' until the layout
  // effect resolves the real target, as in Vue (where it keeps the render SSR-safe).
  const [resolvedAppendToTarget, setResolvedAppendToTarget] = useState<string | HTMLElement>('body');

  useLayoutEffect(() => {
    if (appendTo !== 'body') {
      setResolvedAppendToTarget(appendTo);
      return;
    }
    const buttonEl = previewButtonRef.current;
    const root = buttonEl?.getRootNode() as Document | ShadowRoot | undefined;
    setResolvedAppendToTarget(buttonEl?.closest('dialog') ?? root?.querySelector<HTMLElement>('body') ?? document.body);
  }, [appendTo]);

  const modeAttrs = useMode(contentMode, () => rootRef.current);

  useFocusTrap(modalEl, { active: isOpen, initialFocus: false, restoreFocus: false });

  // Vue's `isOpen` watcher: remember the active element when the modal opens, and give it focus back when it closes.
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement | null;
    } else {
      previousActiveElement.current?.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Focus the close button whenever the modal mounts open, from a click or a controlled `open`. It depends on `modalEl`
  // so it runs after the modal mounts in its resolved appendTo target (a moved portal re-mounts it).
  useEffect(() => {
    if (isOpen && modalEl) closeButtonRef.current?.focus();
  }, [isOpen, modalEl]);

  const openModal = () => {
    // Has custom control passed in
    if (open !== null) return;
    setIsOpen(true);
    setShowCloseButton(true);
    onOpened?.(true);
  };

  const close = () => {
    setIsOpen(false);
    onOpened?.(false);

    if (open !== null) onOpenChange?.(false);
  };

  // Vue's Teleport `to`: a selector is looked up when the modal renders. Nothing renders for a selector that matches
  // nothing.
  let target: Element | null = null;
  if (isOpen && typeof document !== 'undefined') {
    target = typeof resolvedAppendToTarget === 'string'
      ? document.querySelector(resolvedAppendToTarget)
      : resolvedAppendToTarget;
  }

  return (
    <div {...rest} ref={rootRef}>
      <DtButton
        ref={previewButtonRef}
        data-qa="dt-image-viewer-preview"
        className="d-image-viewer__preview-button"
        aria-label={ariaLabel}
        importance="clear"
        onClick={openModal}
      >
        <img
          className={imageButtonClass}
          src={imageSrc}
          alt={imageAlt}
        />
      </DtButton>
      {isOpen && target && createPortal(
        <div
          ref={setModalEl}
          aria-hidden="false"
          className="d-modal"
          data-qa="dt-modal"
          {...modeAttrs}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={(event) => {
            // Tab focus trapping is handled by the focus trap on the modal.
            if (ESCAPE_CODES.includes(event.code)) close();
          }}
          onMouseOver={() => setShowCloseButton(true)}
          onMouseLeave={() => setShowCloseButton(false)}
          onFocus={() => setShowCloseButton(true)}
          onBlur={() => setShowCloseButton(false)}
        >
          <div
            data-qa="dt-image-viewer-full"
            className="d-image-viewer__full"
            role="dialog"
            aria-modal="true"
          >
            <img
              className="d-image-viewer__full__image"
              src={imageSrc}
              alt={imageAlt}
            />
          </div>
          <DtTransition show={showCloseButton} name="fade" unmountOnLeave>
            <DtButton
              ref={closeButtonRef}
              data-qa="dt-image-viewer-close-btn"
              className="d-modal__close"
              circle
              size={400}
              importance="clear"
              kind="inverted"
              aria-label={closeButtonTitle}
              title={closeButtonTitle}
              onClick={close}
              icon={(
                <DtIconClose
                  className="d-image-viewer__close-button"
                  size="400"
                />
              )}
            />
          </DtTransition>
          <DtTransition show={!showCloseButton} name="fade" unmountOnLeave>
            <SrOnlyCloseButton onClose={close} />
          </DtTransition>
        </div>,
        target,
      )}
    </div>
  );
}
