import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { withRouterLink } from '../../tests/helpers/link';
import { DtLink, type DtLinkProps } from './Link';
import {
  LINK_KIND_MODIFIERS,
  LINK_UNSTYLED_CLASS,
  LINK_VARIANTS,
  UNSTYLED,
  getLinkKindModifier,
} from './LinkConstants';

const TONE_VALUES = LINK_VARIANTS.filter(v => v !== '' && v !== UNSTYLED);

const baseProps: DtLinkProps = {
  href: '#',
};
const baseSlots = {
  default: 'Slotted Link',
};

let mockProps: DtLinkProps = {};

describe('DtLink tests', () => {
  const mountComponent = (ui?: (link: React.ReactElement) => React.ReactElement) => {
    const link = <DtLink {...baseProps} {...mockProps}>{baseSlots.default}</DtLink>;
    return render(ui ? ui(link) : link);
  };
  const nativeLink = () => screen.getByTestId('dt-link');

  beforeEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      const { container } = mountComponent();

      expect(container).not.toBeEmptyDOMElement();
    });

    it('should render the native anchor', () => {
      mountComponent();

      expect(nativeLink()).toBeInTheDocument();
    });

    describe('When a default slot is provided', () => {
      it('should render the provided data', () => {
        mountComponent();

        expect(nativeLink()).toHaveTextContent(baseSlots.default);
      });
    });

    describe('When inverted is true', () => {
      it('should have correct class', () => {
        mockProps = { inverted: true };

        mountComponent();

        expect(nativeLink()).toHaveClass(getLinkKindModifier('', true)!);
      });
    });

    it.each(TONE_VALUES)('applies tone modifier class for %s', (tone) => {
      mockProps = { tone };

      mountComponent();

      expect(nativeLink()).toHaveClass(LINK_KIND_MODIFIERS[tone]);
    });

    it.each(TONE_VALUES)('applies inverted tone modifier class for %s', (tone) => {
      mockProps = { tone, inverted: true };

      mountComponent();

      expect(nativeLink()).toHaveClass(getLinkKindModifier(tone, true)!);
    });

    describe('When unstyled', () => {
      it('is a supported tone variant', () => {
        expect(LINK_VARIANTS).toContain(UNSTYLED);
      });

      it('is not registered as a link kind modifier', () => {
        expect(Object.keys(LINK_KIND_MODIFIERS)).not.toContain(UNSTYLED);
      });

      it.each(['tone'])('renders only the unstyled class when %s is unstyled', () => {
        mockProps = {
          tone: UNSTYLED,
          inverted: true,
          underline: false,
        };

        mountComponent();

        expect(nativeLink().className).toBe(LINK_UNSTYLED_CLASS);
      });

      // The deprecated `kind` prop isn't ported (see skips.json).
      it.skip('renders only the unstyled class when kind is unstyled', () => {});

      it.skip('keeps deprecated kind precedence when both kind and tone are provided', () => {});
    });

    describe('When underline is false', () => {
      it('should have no-underline class', async () => {
        mockProps = { underline: false };

        mountComponent();

        expect(nativeLink()).toHaveClass('d-link--no-underline');
      });
    });

    describe('When underline is true (default)', () => {
      it('should not have no-underline class', () => {
        mountComponent();

        expect(nativeLink()).not.toHaveClass('d-link--no-underline');
      });
    });
  });

  describe('Navigation Tests', () => {
    describe('When href is provided', () => {
      it('should render an anchor element', () => {
        mockProps = { href: 'https://example.com' };

        mountComponent();

        expect(nativeLink().tagName).toBe('A');
        expect(nativeLink()).toHaveAttribute('href', 'https://example.com');
      });
    });

    describe('When neither href nor to is provided', () => {
      it('should render an anchor with javascript:void(0) fallback', () => {
        mockProps = { href: null };

        mountComponent();

        expect(nativeLink().tagName).toBe('A');
        expect(nativeLink()).toHaveAttribute('href', 'javascript:void(0)');
      });

      it('restores the fallback when href is removed and drops it when href is added', () => {
        const { rerender } = render(<DtLink href="/x">Link</DtLink>);
        expect(nativeLink()).toHaveAttribute('href', '/x');

        rerender(<DtLink>Link</DtLink>);
        expect(nativeLink()).toHaveAttribute('href', 'javascript:void(0)');

        rerender(<DtLink href="/y">Link</DtLink>);
        expect(nativeLink()).toHaveAttribute('href', '/y');
      });
    });

    describe('When to is provided', () => {
      it('should render a router-link', () => {
        mockProps = { to: '/components/' };

        mountComponent(withRouterLink);

        expect(screen.getByTestId('dt-link')).toHaveAttribute('data-to', '/components/');
      });

      it('should pass replace prop to router-link', () => {
        mockProps = { to: '/components/', replace: true };

        mountComponent(withRouterLink);

        expect(screen.getByTestId('dt-link')).toHaveAttribute('data-replace', 'true');
      });

      it('should default replace to false', () => {
        mockProps = { to: '/components/' };

        mountComponent(withRouterLink);

        expect(screen.getByTestId('dt-link')).toHaveAttribute('data-replace', 'false');
      });

      it('should support object routes', () => {
        const route = { name: 'components', params: { id: 1 } };
        mockProps = { to: route };

        mountComponent(withRouterLink);

        expect(JSON.parse(screen.getByTestId('dt-link').dataset.to!)).toEqual(route);
      });
    });

    describe('When both to and href are provided', () => {
      it('should render router-link (to takes precedence)', () => {
        mockProps = { to: '/components/', href: 'https://example.com' };

        mountComponent(withRouterLink);

        const routerLink = screen.getByTestId('dt-link');
        expect(routerLink).toHaveAttribute('data-to', '/components/');
        expect(routerLink).toHaveAttribute('href', '/components/');
      });
    });

    describe('When to is provided with tone', () => {
      it('should apply link classes to the router-link', () => {
        mockProps = { to: '/components/', tone: 'muted' };

        mountComponent(withRouterLink);

        const link = screen.getByTestId('dt-link');
        expect(link).toHaveClass('d-link');
        expect(link).toHaveClass(LINK_KIND_MODIFIERS.muted);
      });

      describe('When tone is unstyled', () => {
        beforeEach(() => {
          mockProps = {
            to: '/components/',
            tone: UNSTYLED,
            inverted: true,
            underline: false,
          };

          mountComponent(withRouterLink);
        });

        it('should render a router-link', () => {
          expect(screen.getByTestId('dt-link')).toBeInTheDocument();
        });

        it('should apply only unstyled class to the router-link', () => {
          expect(screen.getByTestId('dt-link').className).toBe(LINK_UNSTYLED_CLASS);
        });
      });
    });
  });

  describe('Attribute and ref pass-through', () => {
    it('merges a consumer class with the link classes', () => {
      mockProps = { className: 'extra' };

      mountComponent();

      expect(nativeLink()).toHaveClass('d-link', 'extra');
    });

    it('passes attributes such as rel to the anchor', () => {
      mockProps = { rel: 'noopener' };

      mountComponent();

      expect(nativeLink()).toHaveAttribute('rel', 'noopener');
    });

    it('exposes the anchor through ref, for the fallback href too', () => {
      const ref = createRef<HTMLAnchorElement>();

      render(<DtLink ref={ref}>Link</DtLink>);

      expect(ref.current).toBe(nativeLink());
    });
  });
});
