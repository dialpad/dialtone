import { cleanup, render, screen } from '@testing-library/react';
import { DtIllustration, type DtIllustrationProps } from './Illustration';

const baseProps: DtIllustrationProps = { name: 'mind' };

let mockProps: Partial<DtIllustrationProps> = {};

describe('DtIllustration Tests', () => {
  let illustration: HTMLElement;

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    render(<DtIllustration {...baseProps} {...mockProps} />);

    illustration = screen.getByTestId('dt-illustration');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the mind illustration', () => {
      expect(illustration).toBeInTheDocument();
      expect(illustration).toHaveClass('d-illustration--mind');
    });
  });

  // React-only: what Vue's tests don't cover, but its template does.
  describe('Attribute Tests', () => {
    it('hides the illustration when no label is set', () => {
      expect(illustration).toHaveAttribute('aria-hidden', 'true');
      expect(illustration).not.toHaveAttribute('aria-label');
    });

    it('labels the illustration from ariaLabel', () => {
      mockProps = { ariaLabel: 'illustration description' };

      updateWrapper();

      expect(illustration).toHaveAttribute('aria-label', 'illustration description');
      expect(illustration).toHaveAttribute('aria-hidden', 'false');
    });

    it('passes data-qa, className, style and other attributes to the svg', () => {
      cleanup();
      render(<DtIllustration {...baseProps} data-qa="my-art" className="my-class" style={{ color: 'red' }} id="my-id" />);

      const svg = screen.getByTestId('my-art');
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg).toHaveClass('d-illustration', 'd-illustration--mind', 'my-class');
      expect(svg).toHaveStyle({ color: 'rgb(255, 0, 0)' });
      expect(svg).toHaveAttribute('id', 'my-id');
    });

    it('scopes gradient ids per instance', () => {
      cleanup();
      const { container } = render(
        <>
          <DtIllustration name="mind" />
          <DtIllustration name="mind" />
        </>,
      );

      const ids = [...container.querySelectorAll('linearGradient, radialGradient, clipPath')].map(el => el.id);
      expect(ids.length).toBeGreaterThan(0);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('renders nothing for a name with no illustration', () => {
      cleanup();
      // @ts-expect-error: not an illustration name, which Vue's validator rejects too.
      const { container } = render(<DtIllustration name="not-an-illustration" />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});
