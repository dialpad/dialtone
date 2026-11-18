import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import {
  ROOT_LAYOUT_SIDEBAR_POSITIONS,
  type RootLayoutResponsiveBreakpoint,
  type RootLayoutSidebarPosition,
} from './RootLayoutConstants';

// `dangerouslySetInnerHTML` is excluded: the root always renders its four regions, and React throws when a host
// element has both children and an HTML payload. Pass HTML through a slot instead.
export interface DtRootLayoutProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dangerouslySetInnerHTML'> {
  /**
   * When true, the header, footer and sidebar will be locked in position and the content will
   * be scrollable. When false the header, footer and sidebar  will scroll out of view.
   * Fixed mode applies at or above the selected `responsiveBreakpoint`; below it the layout is not locked.
   * @values true, false
   */
  fixed?: boolean;

  /** Additional class name for the header element */
  headerClass?: ClassValue;

  /**
   * Pin the header to the top of the scroll container while the layout scrolls
   * @values true, false
   */
  headerSticky?: boolean;

  /** Additional class name for the body. Vue declares it but doesn't render it. */
  bodyClass?: ClassValue;

  /** Additional class name for the content element */
  contentClass?: ClassValue;

  /** Additional class name for the sidebar element */
  sidebarClass?: ClassValue;

  /**
   * Whether the sidebar is on the start or end side
   * @values start, end, left, right
   */
  sidebarPosition?: RootLayoutSidebarPosition;

  /** Additional class name for the footer element */
  footerClass?: ClassValue;

  /**
   * Defines the breakpoint when the root layout will change to responsive version
   * @values 'sm', 'md', 'lg', null
   */
  responsiveBreakpoint?: RootLayoutResponsiveBreakpoint;

  /** Slot for header content, be sure to set a height on the element inside this if you want a fixed height. */
  header?: ReactNode;

  /** Slot for sidebar content, be sure to set a width on the element within this. */
  sidebar?: ReactNode;

  /** Slot for footer content, be sure to set a height on the element inside this if you want a fixed height. */
  footer?: ReactNode;

  /** The root element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * A root layout provides a standardized group of containers to display content at the root level.
 */
export function DtRootLayout ({
  fixed = true,
  headerClass = '',
  headerSticky = false,
  bodyClass: _bodyClass = '',
  contentClass = '',
  sidebarClass = '',
  sidebarPosition = 'start',
  footerClass = '',
  responsiveBreakpoint = null,
  header,
  sidebar,
  footer,
  children,
  className,
  ref,
  ...attrs
}: DtRootLayoutProps) {
  const isInverted = sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.END
    || sidebarPosition === ROOT_LAYOUT_SIDEBAR_POSITIONS.RIGHT;
  const responsiveBreakpointClass = responsiveBreakpoint
    ? `d-root-layout__responsive--${responsiveBreakpoint}`
    : 'd-root-layout__responsive--default';

  return (
    <div
      data-qa="dt-root-layout"
      {...attrs}
      ref={ref}
      className={cx(
        'root-layout',
        'd-root-layout',
        { 'd-root-layout--fixed': fixed, 'd-root-layout--inverted': isInverted },
        responsiveBreakpointClass,
        className,
      )}
    >
      <header
        className={cx('d-root-layout__header', { 'd-root-layout__header--sticky': headerSticky }, headerClass)}
        data-qa="dt-root-layout-header"
      >
        {header}
      </header>
      <aside
        tabIndex={0}
        className={cx('d-root-layout__sidebar', sidebarClass)}
        data-qa="dt-root-layout-sidebar"
      >
        {sidebar}
      </aside>
      <main
        className={cx('d-root-layout__content', contentClass)}
        data-qa="dt-root-layout-content"
        tabIndex={0}
      >
        {children}
      </main>
      <footer
        className={cx('d-root-layout__footer', footerClass)}
        data-qa="dt-root-layout-footer"
      >
        {footer}
      </footer>
    </div>
  );
}
