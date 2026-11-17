import { cleanup, render, screen } from '@testing-library/react';
import { DtLoader, type DtLoaderProps } from './Loader';

const MOCK_DEFAULT_ARIA_LABEL = 'loading';

const baseProps: DtLoaderProps = {};

let mockProps: Partial<DtLoaderProps> = {};

describe('DtLoader Tests', function () {
  let rerender: (props: Partial<DtLoaderProps>) => void;
  let root: HTMLElement;
  let loadingIcon: HTMLElement;

  const queryIcon = () => screen.getByTestId('dt-loader-icon');

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    const result = render(<DtLoader {...baseProps} {...mockProps} />);
    rerender = props => result.rerender(<DtLoader {...baseProps} {...mockProps} {...props} />);

    root = screen.getByTestId('dt-loader');
    loadingIcon = queryIcon();
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the component', () => {
      expect(root).toBeInTheDocument();
      expect(loadingIcon).toBeInTheDocument();
    });

    it('Should render four dots', () => {
      expect(screen.getAllByTestId('dt-loader-dot')).toHaveLength(4);
      expect(loadingIcon.querySelectorAll('[data-qa="dt-loader-dot"]')).toHaveLength(4);
    });

    describe('When rendered with default props', () => {
      it('Size should be 500', () => {
        expect(loadingIcon).toHaveClass('d-icon--size-500');
      });
    });

    describe('When size prop is set', () => {
      beforeEach(() => {
        rerender({ size: '200' });
      });

      it('Should have correct class', () => {
        expect(queryIcon()).toHaveClass('d-icon--size-200');
      });
    });

    describe('When rendered with the default kind', () => {
      it('Should not have the spinner modifier', () => {
        expect(root).not.toHaveClass('d-loader--spinner');
      });

      it('Should not render the spinner track', () => {
        expect(screen.queryByTestId('dt-loader-icon-track')).not.toBeInTheDocument();
      });
    });

    describe('When kind is spinner', () => {
      beforeEach(() => {
        mockProps = { kind: 'spinner' };
        updateWrapper();
      });

      it('Should have the spinner modifier', () => {
        expect(root).toHaveClass('d-loader--spinner');
      });

      it('Should render the track', () => {
        expect(screen.getByTestId('dt-loader-icon-track')).toBeInTheDocument();
      });

      it('Should render the spinning icon', () => {
        expect(loadingIcon).toBeInTheDocument();
      });

      it('Should not render dots', () => {
        expect(screen.queryAllByTestId('dt-loader-dot')).toHaveLength(0);
      });

      describe('When size prop is set', () => {
        beforeEach(() => {
          rerender({ size: '200' });
        });

        it('Should apply the size to the track', () => {
          expect(screen.getByTestId('dt-loader-icon-track')).toHaveClass('d-icon--size-200');
        });

        it('Should apply the size to the spinning icon', () => {
          expect(queryIcon()).toHaveClass('d-icon--size-200');
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When ariaLabel is not set', () => {
      it('Has default aria label', () => {
        expect(root).toHaveAttribute('aria-label', MOCK_DEFAULT_ARIA_LABEL);
      });
    });

    describe('When ariaLabel is set', () => {
      beforeEach(() => {
        rerender({ ariaLabel: 'custom aria label' });
      });

      it('Has custom aria label', () => {
        expect(root).toHaveAttribute('aria-label', 'custom aria label');
      });
    });

    describe('When rendered with the default kind', () => {
      it('Hides its SVG from assistive technology', () => {
        const svgs = Array.from(root.querySelectorAll('svg'));
        expect(svgs.map(svg => svg.getAttribute('aria-hidden'))).toEqual(['true']);
      });
    });

    describe('When kind is spinner', () => {
      beforeEach(() => {
        mockProps = { kind: 'spinner' };
        updateWrapper();
      });

      it('Keeps the default aria label', () => {
        expect(root).toHaveAttribute('aria-label', MOCK_DEFAULT_ARIA_LABEL);
      });

      it('Hides both SVGs from assistive technology', () => {
        const svgs = Array.from(root.querySelectorAll('svg'));
        expect(svgs.map(svg => svg.getAttribute('aria-hidden'))).toEqual(['true', 'true']);
      });
    });
  });
});
