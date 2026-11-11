import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import type { DtRouterLinkProps } from './DtRouterLink';

/**
 * The app's link component, which renders `to` for its router: react-router's `Link` as it is, or an adapter
 * (`({ to, replace, ...rest }) => <NextLink href={to} replace={replace} {...rest} />`). It receives `to`,
 * `replace`, the anchor attributes, `children` and `ref`, and should render an `<a>` that carries them, as
 * vue-router's RouterLink does.
 */
export type DtLinkComponent = ComponentType<DtRouterLinkProps>;

const LinkComponentContext = createContext<DtLinkComponent | null>(null);

export interface DtLinkProviderProps {
  /** Renders `to` links. Pass a stable component (module-level), not one created during render. */
  component: DtLinkComponent | null;
  children?: ReactNode;
}

/**
 * Supplies the app's link component to DtLink, DtButton and SplitButton, which render it when `to` is set: the
 * React counterpart of the app registering vue-router's RouterLink globally. Wrap the app once, inside its router.
 */
export function DtLinkProvider ({ component, children }: DtLinkProviderProps) {
  return <LinkComponentContext value={component}>{children}</LinkComponentContext>;
}

/** The provider's link component, or null outside a DtLinkProvider. */
export function useLinkComponent (): DtLinkComponent | null {
  return useContext(LinkComponentContext);
}
