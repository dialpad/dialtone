import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { DtLinkProvider, DtRouterLink, useLinkComponent, type DtRouterLinkProps } from '.';
import { RouterLinkStub, withRouterLink } from '../../tests/helpers/link';

function AppLink ({ to, replace, ...rest }: DtRouterLinkProps) {
  return <a {...rest} href={`/app${String(to)}`} data-replace={String(replace)} />;
}

describe('link provider', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it('renders the provider\'s component with to, replace, attributes, children and ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <DtLinkProvider component={AppLink}>
        <DtRouterLink to="/components" replace className="d-link" data-qa="link" ref={ref}>Components</DtRouterLink>
      </DtLinkProvider>,
    );
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/app/components');
    expect(link).toHaveAttribute('data-replace', 'true');
    expect(link).toHaveClass('d-link');
    expect(link).toHaveTextContent('Components');
    expect(ref.current).toBe(link);
  });

  it('passes replace as false by default', () => {
    render(withRouterLink(<DtRouterLink to="/x">X</DtRouterLink>));
    expect(screen.getByTestId('router-link-stub')).toHaveAttribute('data-replace', 'false');
  });

  it('passes an object to unchanged', () => {
    const route = { name: 'components', params: { id: 1 } };
    render(withRouterLink(<DtRouterLink to={route}>X</DtRouterLink>));
    expect(JSON.parse(screen.getByTestId('router-link-stub').dataset.to!)).toEqual(route);
  });

  it('falls back to <a href> for a string to without a provider, and warns', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DtRouterLink to="/components" replace data-qa="link">Components</DtRouterLink>);
    const link = screen.getByTestId('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/components');
    expect(link).not.toHaveAttribute('replace');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('needs a link component from DtLinkProvider'));
  });

  it('falls back to an <a> without href for an object to without a provider', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<DtRouterLink to={{ name: 'x' }} data-qa="link">X</DtRouterLink>);
    expect(screen.getByTestId('link')).not.toHaveAttribute('href');
  });

  it('exposes the component through useLinkComponent, or null outside a provider', () => {
    const seen: unknown[] = [];
    function Probe () { seen.push(useLinkComponent()); return null; }
    render(<><Probe />{withRouterLink(<Probe />)}</>);
    expect(seen).toEqual([null, RouterLinkStub]);
  });
});
