import { useId, useMemo, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { useFocusTrap } from '../../common/focustrap';
import { DtNoticeAction, DtNoticeContent, DtNoticeIcon, type NoticeKind } from '../Notice';

export interface DtBannerProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Sets an ID on the header element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the header.
   * Defaults to a generated unique ID.
   */
  headerId?: string;

  /**
   * Sets an ID on the content element of the component. Useful for aria-describedby
   * or aria-labelledby or any other reason you may need an id to refer to the content.
   * Defaults to a generated unique ID.
   */
  contentId?: string;

  /** Header text of the banner. This can be left blank to remove the header from the banner entirely. */
  headerText?: string;

  /**
   * Used in scenarios where the message needs to visually dominate the screen.
   * This will also change the aria role from status to alertdialog,
   * and will modally trap keyboard focus within the banner while it is shown (via the
   * focus trap hook), restoring focus to the previously focused element on close.
   * @values true, false
   */
  important?: boolean;

  /**
   * Pins the banner to the top of the window and pushes all app content down.
   * @values true, false
   */
  pinned?: boolean;

  /**
   * Severity level of the notice, sets the icon and background
   * @values base, critical, info, positive, warning
   */
  kind?: NoticeKind;

  /**
   * Shows the close button in the banner
   * @values true, false
   */
  showClose?: boolean;

  /**
   * Shows the icon in the banner
   * @values true, false
   */
  showIcon?: boolean;

  /**
   * Shows the action in the banner
   * @values true, false
   */
  showAction?: boolean;

  /** Inner dialog class */
  dialogClass?: ClassValue;

  /** Banner background image */
  backgroundImage?: string;

  /**
   * Background image size, follows the background-size CSS property values
   * (https://developer.mozilla.org/en-US/docs/Web/CSS/background-size)
   */
  backgroundSize?: string;

  /** Additional class name for the icon wrapper element. */
  iconClass?: ClassValue;

  /** Additional class name for the header wrapper element. */
  headerClass?: ClassValue;

  /** Additional class name for the content wrapper element. */
  contentClass?: ClassValue;

  /** Additional class name for the action wrapper element. */
  actionClass?: ClassValue;

  /** The main textual content of the banner */
  children?: ReactNode;

  /** Custom icon */
  icon?: ReactNode;

  /** The header, in place of headerText */
  header?: ReactNode;

  /** A possible action for the user to take, such as a link to another page */
  action?: ReactNode;

  /** Close button click event */
  onClose?: () => void;

  /** The `<aside>` root. */
  ref?: Ref<HTMLElement>;
}

const BANNER_KIND_CLASSES: Readonly<Record<string, string>> = {
  critical: 'd-banner--critical',
  info: 'd-banner--info',
  positive: 'd-banner--positive',
  warning: 'd-banner--warning',
  base: 'd-banner--base',
};

/**
 * Banners are a type of notice, delivering system and engagement messaging.
 * These are highly intrusive notices and should be used sparingly and appropriately.
 * @see https://dialtone.dialpad.com/components/banner.html
 */
export function DtBanner ({
  headerId,
  contentId,
  headerText,
  important = false,
  pinned = false,
  kind = 'base',
  showClose = true,
  showIcon = true,
  showAction = true,
  dialogClass = '',
  backgroundImage = '',
  backgroundSize = 'cover',
  iconClass = '',
  headerClass = '',
  contentClass = '',
  actionClass = '',
  children,
  icon,
  header,
  action,
  onClose,
  ref,
  className,
  style,
  ...rest
}: DtBannerProps) {
  const generatedHeaderId = useId();
  const generatedContentId = useId();
  const resolvedHeaderId = headerId ?? generatedHeaderId;
  const resolvedContentId = contentId ?? generatedContentId;

  // The directive's element, kept in state so the trap follows it (conventions › Any directive).
  const [el, setEl] = useState<HTMLElement | null>(null);
  const rootRef = useMemo(() => (node: HTMLElement | null) => {
    setEl(node);
    if (typeof ref === 'function') return ref(node);
    if (ref) ref.current = node;
    return undefined;
  }, [ref]);

  useFocusTrap(el, { active: important, initialFocus: 'auto', restoreFocus: true });

  const hasHeader = !!headerText || header !== undefined;
  const bannerClass = cx(
    'd-banner',
    Object.hasOwn(BANNER_KIND_CLASSES, kind) ? BANNER_KIND_CLASSES[kind] : undefined,
    { 'd-banner--important': important, 'd-banner--pinned': pinned },
  );
  const bannerStyle: CSSProperties | undefined = backgroundImage === ''
    ? style
    : { backgroundImage: `url(${backgroundImage})`, backgroundSize, ...style };

  return (
    <aside
      data-qa="dt-banner"
      {...rest}
      ref={rootRef}
      className={cx(bannerClass, className)}
      style={bannerStyle}
    >
      <div
        className={cx('d-banner__dialog', dialogClass)}
        data-qa="dt-banner-dialog"
        role={important ? 'alertdialog' : 'status'}
        aria-modal={important || undefined}
        aria-labelledby={hasHeader ? resolvedHeaderId : undefined}
        aria-describedby={resolvedContentId}
      >
        {showIcon && (
          <DtNoticeIcon
            kind={kind}
            iconClass={iconClass}
            className={cx({ 'd-notice__icon--has-title': headerText || header !== undefined })}
          >
            {icon}
          </DtNoticeIcon>
        )}
        <DtNoticeContent
          headerId={resolvedHeaderId}
          contentId={resolvedContentId}
          headerText={headerText}
          headerClass={headerClass}
          contentClass={contentClass}
          header={header}
        >
          {children}
        </DtNoticeContent>
        <DtNoticeAction
          showAction={showAction}
          showClose={showClose}
          actionClass={actionClass}
          onClose={onClose}
        >
          {action}
        </DtNoticeAction>
      </div>
    </aside>
  );
}
