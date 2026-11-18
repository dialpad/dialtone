import { cleanup, render, screen } from '@testing-library/react';
import { DtProgressCircle, type DtProgressCircleProps } from './ProgressCircle';
import { PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_SIZE_DEFAULT, PROGRESS_CIRCLE_KINDS } from './ProgressCircleConstants';

const baseProps: DtProgressCircleProps = { ariaLabel: 'Upload progress' };
let mockProps: Partial<DtProgressCircleProps> = {};

describe('DtProgressCircle Tests', () => {
  let container: HTMLElement;
  let progressCircle: HTMLElement;

  const updateWrapper = () => {
    // A fresh mount, as Vue's mount() is: the previous render goes first.
    cleanup();
    ({ container } = render(<DtProgressCircle {...baseProps} {...mockProps} />));
    progressCircle = screen.getByTestId('dt-progress-circle');
  };

  const barStyle = () => container.querySelector('.d-progress-circle__bar')!.getAttribute('style');

  beforeEach(() => { updateWrapper(); });
  afterEach(() => { mockProps = {}; });

  describe('Presentation Tests', () => {
    it('should render', () => { expect(progressCircle).toBeInTheDocument(); });

    describe('When progress is 0 (default)', () => {
      it('has aria-valuenow 0', () => { expect(progressCircle).toHaveAttribute('aria-valuenow', '0'); });
    });

    describe('When progress is 50', () => {
      beforeEach(() => { mockProps = { progress: 50 }; updateWrapper(); });
      it('has aria-valuenow 50', () => { expect(progressCircle).toHaveAttribute('aria-valuenow', '50'); });
    });

    describe('When progress is 100', () => {
      beforeEach(() => { mockProps = { progress: 100 }; updateWrapper(); });
      it('has aria-valuenow 100', () => { expect(progressCircle).toHaveAttribute('aria-valuenow', '100'); });
    });

    describe('When progress is below minimum visual threshold (1–4)', () => {
      beforeEach(() => { mockProps = { progress: 2 }; updateWrapper(); });

      it('has aria-valuenow reflecting the real value', () => {
        expect(progressCircle).toHaveAttribute('aria-valuenow', '2');
      });

      it('renders the same fill as progress=5', () => {
        const smallStyle = barStyle();

        mockProps = { progress: 5 };
        updateWrapper();
        const fiveStyle = barStyle();

        expect(smallStyle).toBeTruthy();
        expect(smallStyle).toBe(fiveStyle);
      });
    });
  });

  describe('Size Tests', () => {
    it('applies default size class', () => {
      expect(progressCircle).toHaveClass(PROGRESS_CIRCLE_SIZES[PROGRESS_CIRCLE_SIZE_DEFAULT]);
    });

    describe('When size is 200', () => {
      beforeEach(() => { mockProps = { size: '200' }; updateWrapper(); });
      it('applies size-200 class', () => {
        expect(progressCircle).toHaveClass(PROGRESS_CIRCLE_SIZES[200]);
      });
    });
  });

  describe('Kind Tests', () => {
    it('applies no extra class for default kind', () => {
      expect(progressCircle).not.toHaveClass(PROGRESS_CIRCLE_KINDS.brand);
      expect(progressCircle).not.toHaveClass(PROGRESS_CIRCLE_KINDS.critical);
    });

    describe('When kind is brand', () => {
      beforeEach(() => { mockProps = { kind: 'brand' }; updateWrapper(); });
      it('applies brand class', () => {
        expect(progressCircle).toHaveClass(PROGRESS_CIRCLE_KINDS.brand);
      });
    });

    describe('When kind is critical', () => {
      beforeEach(() => { mockProps = { kind: 'critical' }; updateWrapper(); });
      it('applies critical class', () => {
        expect(progressCircle).toHaveClass(PROGRESS_CIRCLE_KINDS.critical);
      });
    });

    describe('When kind is ai', () => {
      beforeEach(() => { mockProps = { kind: 'ai', progress: 50 }; updateWrapper(); });
      it('applies ai class', () => {
        expect(progressCircle).toHaveClass(PROGRESS_CIRCLE_KINDS.ai);
      });

      it('renders an SVG gradient', () => {
        expect(container.querySelector('linearGradient')).toBeInTheDocument();
      });

      it('applies gradient stroke to fill path', () => {
        const fillPath = container.querySelector('.d-progress-circle__shape--fill')!;
        expect(fillPath.getAttribute('style')).toContain('url(#progress-circle-ai-gradient-');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="progressbar"', () => { expect(progressCircle).toHaveAttribute('role', 'progressbar'); });
    it('has aria-valuemin="0"', () => { expect(progressCircle).toHaveAttribute('aria-valuemin', '0'); });
    it('has aria-valuemax="100"', () => { expect(progressCircle).toHaveAttribute('aria-valuemax', '100'); });
    it('applies ariaLabel prop', () => { expect(progressCircle).toHaveAttribute('aria-label', 'Upload progress'); });
  });
});
