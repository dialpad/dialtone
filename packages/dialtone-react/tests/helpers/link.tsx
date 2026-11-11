import type { ReactNode } from 'react';
import { DtLinkProvider, type DtRouterLinkProps } from '../../common/link';

/**
 * Vue tests stub vue-router's RouterLink (`stubs: { RouterLink: RouterLinkStub }`) and read its props. In React,
 * wrap the render in `withRouterLink` and read what the stub rendered: an `<a data-qa="router-link-stub">` whose
 * `data-to` is the `to` it got (JSON for an object; parse it to compare) and `data-replace` is `replace`.
 */
export function RouterLinkStub ({ to, replace, ref, ...rest }: DtRouterLinkProps) {
  return (
    <a
      data-qa="router-link-stub"
      {...rest}
      ref={ref}
      href={typeof to === 'string' ? to : undefined}
      data-to={typeof to === 'string' ? to : JSON.stringify(to)}
      data-replace={String(!!replace)}
    />
  );
}

/** `render(withRouterLink(<DtLink to="/x" />))`: the element under a DtLinkProvider with RouterLinkStub. */
export const withRouterLink = (ui: ReactNode) => <DtLinkProvider component={RouterLinkStub}>{ui}</DtLinkProvider>;
