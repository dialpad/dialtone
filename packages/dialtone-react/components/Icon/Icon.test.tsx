import { cleanup, render, screen } from '@testing-library/react';
import { DtIcon, type DtIconProps } from './Icon';

const baseProps: DtIconProps = { name: 'accessibility' };

let mockProps: Partial<DtIconProps> = {};

describe('DtIcon Tests', () => {
  let icon: HTMLElement;

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    render(<DtIcon {...baseProps} {...mockProps} />);

    icon = screen.getByTestId('dt-icon');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the accessibility icon', () => {
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('d-icon--accessibility');
    });

    describe('When size prop is not set', () => {
      it('Should have default class', () => {
        expect(icon).toHaveClass('d-icon--size-500');
      });
    });

    describe('When size prop is set', () => {
      it('Should have correct class', () => {
        mockProps = { size: '800' };

        updateWrapper();

        expect(icon).toHaveClass('d-icon--size-800');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When ariaLabel prop is set', () => {
      beforeEach(() => {
        mockProps = { ariaLabel: 'icon description' };

        updateWrapper();
      });

      it('sets the aria-label attribute', () => {
        expect(icon).toHaveAttribute('aria-label', 'icon description');
      });

      it('sets aria-hidden to false', () => {
        expect(icon).toHaveAttribute('aria-hidden', 'false');
      });
    });
  });

  // React-only: what Vue's tests don't cover, but its template does.
  describe('Attribute Tests', () => {
    it('hides the icon when no label is set', () => {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).not.toHaveAttribute('aria-label');
    });

    it('labels the icon from an aria-label attribute', () => {
      cleanup();
      render(<DtIcon {...baseProps} aria-label="icon description" />);

      expect(screen.getByTestId('dt-icon')).toHaveAttribute('aria-label', 'icon description');
      expect(screen.getByTestId('dt-icon')).toHaveAttribute('aria-hidden', 'false');
    });

    it('passes data-qa, className, style and other attributes to the svg', () => {
      cleanup();
      render(<DtIcon {...baseProps} data-qa="my-icon" className="my-class" style={{ color: 'red' }} id="my-id" />);

      const svg = screen.getByTestId('my-icon');
      expect(svg.tagName.toLowerCase()).toBe('svg');
      expect(svg).toHaveClass('d-icon', 'd-icon--accessibility', 'd-icon--size-500', 'my-class');
      expect(svg).toHaveStyle({ color: 'rgb(255, 0, 0)' });
      expect(svg).toHaveAttribute('id', 'my-id');
    });

    it('renders nothing for a name with no icon', () => {
      cleanup();
      // @ts-expect-error: not an icon name, which Vue's validator rejects too.
      const { container } = render(<DtIcon name="not-an-icon" />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});
