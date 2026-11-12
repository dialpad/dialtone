import { useCallback, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../common/cx';
import { DtRouterLink, type DtLinkTo } from '../../common/link';
import {
  LINK_UNSTYLED_CLASS,
  UNSTYLED,
  getLinkKindModifier,
  type LinkTone,
} from './LinkConstants';

// Vue renders this href when neither `href` nor `to` is given. React 19 rejects a `javascript:` URL in JSX, so
// it's written to the DOM node directly instead (see `setRef` below).
const FALLBACK_HREF = 'javascript:void(0)';

export interface DtLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /**
   * Applies the link variant styles
   * @values null, critical, warning, positive, info, muted, mention, unstyled
   */
  tone?: LinkTone;

  /**
   * Determines whether the link should have inverted styling
   * default is false.
   * @values true, false
   * @deprecated Use useModeRegion instead.
   */
  inverted?: boolean;

  /** URL for anchor link navigation. Renders as a native <a> element. */
  href?: string | null;

  /**
   * Router destination. Renders the DtLinkProvider's link component. Takes precedence over href when both are
   * provided.
   */
  to?: DtLinkTo | null;

  /**
   * When true, navigation replaces the current history entry instead of pushing.
   * Only applies when `to` is provided.
   * @values true, false
   */
  replace?: boolean;

  /**
   * Determines whether the link should display an underline.
   * @values true, false
   */
  underline?: boolean;

  /** Main content */
  children?: ReactNode;

  ref?: Ref<HTMLAnchorElement>;
}

function getLinkClasses (tone: LinkTone, inverted: boolean, underline: boolean) {
  if (tone === UNSTYLED) {
    return [LINK_UNSTYLED_CLASS];
  }

  return [
    'd-link',
    getLinkKindModifier(tone, inverted),
    { 'd-link--no-underline': !underline },
  ];
}

/**
 * A link is a navigational element that can be found on its own, within other text, or directly following content.
 * @see https://dialtone.dialpad.com/components/link.html
 */
export function DtLink ({
  tone = '',
  inverted = false,
  href = null,
  to = null,
  replace = false,
  underline = true,
  className,
  children,
  ref,
  ...rest
}: DtLinkProps) {
  const useFallbackHref = !to && !href;

  // The fallback href goes on the node itself, because JSX would refuse it. React never writes `href` then (it's
  // undefined), so it stays. The callback is recreated when `useFallbackHref` flips, so the attribute is set again
  // after React removes `href`. It also forwards the consumer's ref, as Vue exposes the root element.
  const setRef = useCallback((el: HTMLAnchorElement | null) => {
    if (el && useFallbackHref) el.setAttribute('href', FALLBACK_HREF);
    if (typeof ref === 'function') return ref(el);
    if (ref) {
      ref.current = el;
      return () => { ref.current = null; };
    }
    return undefined;
  }, [ref, useFallbackHref]);

  const classes = cx(getLinkClasses(tone, inverted, underline), className);

  if (to) {
    return (
      <DtRouterLink data-qa="dt-link" {...rest} className={classes} to={to} replace={replace} ref={ref}>
        {children}
      </DtRouterLink>
    );
  }

  return (
    <a data-qa="dt-link" {...rest} className={classes} href={href || undefined} ref={setRef}>
      {children}
    </a>
  );
}
