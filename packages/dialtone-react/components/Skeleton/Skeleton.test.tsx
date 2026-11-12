import { render, screen } from '@testing-library/react';
import { DtSkeleton, type DtSkeletonProps } from './Skeleton';
import { DtSkeletonParagraph } from './SkeletonParagraph';
import { DtSkeletonShape } from './SkeletonShape';
import { DtSkeletonText } from './SkeletonText';

const baseProps: DtSkeletonProps = {};

let mockProps: DtSkeletonProps = {};

describe('DtSkeleton Tests', () => {
  let unmount: (() => void) | null = null;

  // Remounts, as Vue's mount does, rather than rendering a second skeleton beside the first.
  const updateWrapper = () => {
    unmount?.();
    ({ unmount } = render(<DtSkeleton {...baseProps} {...mockProps} />));
  };

  const skeletonTextBody = () => screen.queryByTestId('skeleton-text-body');
  const skeletonTextHeading = () => screen.queryByTestId('skeleton-text-heading');
  const skeletonParagraph = () => screen.queryByTestId('skeleton-paragraph');
  const skeletonParagraphRows = () => screen.queryAllByTestId('skeleton-paragraph-row');
  const skeletonListItem = () => screen.queryByTestId('skeleton-list-item');
  const skeletonShape = () => screen.queryByTestId('skeleton-shape');

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    unmount = null;
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(screen.getByTestId('dt-skeleton')).toBeInTheDocument();
    });

    describe('Skeleton text', () => {
      it('should render the skeleton body', () => {
        expect(skeletonTextBody()).toBeInTheDocument();
      });

      it('should render the skeleton heading', async () => {
        mockProps = {
          textOption: {
            type: 'heading',
          },
        };

        updateWrapper();

        expect(skeletonTextHeading()).toBeInTheDocument();
      });
    });

    describe('Skeleton paragraph', () => {
      beforeEach(() => {
        mockProps = {
          paragraphOption: true,
        };

        updateWrapper();
      });

      it('should render the skeleton paragraph', async () => {
        expect(skeletonParagraph()).toBeInTheDocument();
      });

      it('should render rows', async () => {
        expect(skeletonParagraphRows()).toHaveLength(3);
      });
    });

    describe('Skeleton list item', () => {
      beforeEach(() => {
        mockProps = {
          listItemOption: true,
        };

        updateWrapper();
      });

      it('should render the skeleton list item', async () => {
        expect(skeletonListItem()).toBeInTheDocument();
      });

      it('should render skeleton paragraph', async () => {
        expect(skeletonParagraph()).toBeInTheDocument();
      });
    });

    describe('Skeleton shape', () => {
      it('should render skeleton shape', async () => {
        mockProps = {
          shapeOption: true,
        };

        updateWrapper();

        expect(skeletonShape()).toBeInTheDocument();
      });

      it('should render correct dimensions with numeric size', () => {
        mockProps = {
          shapeOption: { size: 200, shape: 'circle' },
        };

        updateWrapper();

        expect(skeletonShape()?.getAttribute('style')).toContain('min-width: 24px');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When an aria-label is provided', () => {
      it('should be set aria-label value', () => {
        mockProps = {
          ariaLabel: 'ariaLabel',
        };

        updateWrapper();

        expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'ariaLabel');
      });
    });
  });

  // React-only: behaviour the Vue suite doesn't cover.
  describe('Option validation', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should log an error when two options are set', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockProps = { paragraphOption: true, shapeOption: { shape: 'square' } };

      updateWrapper();

      expect(error).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledWith('Use only one of paragraphOption | shapeOption options at the same time');
    });

    it('should render the list item when several options are set', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      mockProps = { paragraphOption: true, listItemOption: true, shapeOption: true };

      updateWrapper();

      expect(skeletonListItem()).toBeInTheDocument();
      expect(screen.queryAllByTestId('skeleton-shape')).toHaveLength(1);
    });

    it('should not log an error for a single option', () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockProps = { textOption: { width: '120px' } };

      updateWrapper();

      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('Animation', () => {
    it('should give the option the skeleton animate, offset and duration over its own', () => {
      mockProps = { shapeOption: { animate: false, offset: 4, animationDuration: 10 }, offset: 2 };

      updateWrapper();

      expect(skeletonShape()).toHaveClass('d-skeleton-placeholder--animate');
      expect(skeletonShape()).toHaveStyle({ animationDelay: '6000ms', animationDuration: '1000ms' });
    });

    it('should have no animation style when not animated and the duration is infinite', () => {
      mockProps = { animate: false };

      updateWrapper();

      expect(skeletonTextBody()).not.toHaveClass('d-skeleton-placeholder--animate');
      expect(skeletonTextBody()?.getAttribute('style')).toBe('width: 100%;');
    });

    it('should have no animation style when the offset is -1', () => {
      mockProps = { offset: -1 };

      updateWrapper();

      expect(skeletonTextBody()?.getAttribute('style')).toBe('width: 100%;');
    });

    it('should use the element position once the offset first changes', () => {
      const { rerender } = render(<DtSkeletonText data-qa="text" animate offset={1} />);
      const text = screen.getByTestId('text');
      vi.spyOn(text, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 100, 10, 20));

      rerender(<DtSkeletonText data-qa="text" animate offset={2} />);
      expect(text).toHaveStyle({ animationDelay: '330000ms' });

      rerender(<DtSkeletonText data-qa="text" animate offset={3} />);
      expect(text).toHaveStyle({ animationDelay: '330000ms' });
    });
  });

  describe('Subcomponents', () => {
    it('should set a size outside the scale as it is', () => {
      render(<DtSkeletonShape data-qa="shape" size="2rem" shape="square" />);

      expect(screen.getByTestId('shape')).toHaveClass('d-bar-200');
      expect(screen.getByTestId('shape')).toHaveStyle({ minWidth: '2rem', maxHeight: '2rem' });
    });

    it('should not add a unit to a numeric size outside the scale', () => {
      render(<DtSkeletonShape data-qa="shape" size={50} />);

      // jsdom keeps the unitless value, where a browser drops it; either way React mustn't turn it into `50px`.
      expect(screen.getByTestId('shape').getAttribute('style')).not.toContain('50px');
    });

    it('should render the heading height class', () => {
      render(<DtSkeletonText type="heading" headingHeight="400" />);

      expect(screen.getByTestId('skeleton-text-heading')).toHaveClass('d-h-50', 'd-skeleton-text--heading');
    });

    it('should shorten the last row and use given widths', () => {
      render(<DtSkeletonParagraph rows={3} width={['10px']} />);

      const widths = screen.getAllByTestId('skeleton-paragraph-row').map(row => row.style.width);
      expect(widths).toEqual(['10px', '100%', '38%']);
    });

    it('should use random widths between the min and max widths', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      render(<DtSkeletonParagraph rows="2" randomWidth minWidth={20} maxWidth="40" />);

      const widths = screen.getAllByTestId('skeleton-paragraph-row').map(row => row.style.width);
      expect(widths).toEqual(['30%', '30%']);
      vi.restoreAllMocks();
    });
  });
});
