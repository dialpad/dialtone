import { createElement, useEffect, type AnchorHTMLAttributes, type ReactNode, type Ref } from 'react';
import { useLinkComponent } from './DtLinkProvider';

/** A vue-router location as Dialtone's `to` props take it: a path, or a location object for the app's router. */
export type DtLinkTo = string | Record<string, unknown>;

export interface DtRouterLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: DtLinkTo;
  /** Navigate without adding a history entry (vue-router's and react-router's `replace`). */
  replace?: boolean;
  children?: ReactNode;
  ref?: Ref<HTMLAnchorElement>;
}

/**
 * What a port renders where dialtone-vue renders `resolveComponent('RouterLink')` (DtLink, DtButton and
 * SplitButton when `to` is set): the DtLinkProvider's component with `to`, `replace` and everything else.
 * Without a provider, a string `to` renders `<a href={to}>` and an object `to` an `<a>` without `href`, with a
 * console warning, as DtButton warns and falls back to `<a>` without vue-router. `replace` isn't rendered then.
 */
export function DtRouterLink ({ to, replace = false, ref, ...rest }: DtRouterLinkProps) {
  const LinkComponent = useLinkComponent();
  const missing = !LinkComponent;
  useEffect(() => {
    if (missing) console.warn('DtRouterLink: "to" needs a link component from DtLinkProvider. Falling back to <a>.');
  }, [missing]);
  // createElement: the component comes from context, so it's the same one every render, not created in render.
  if (LinkComponent) return createElement(LinkComponent, { ...rest, to, replace, ref });
  return <a {...rest} href={typeof to === 'string' ? to : undefined} ref={ref} />;
}
