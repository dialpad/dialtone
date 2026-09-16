import { mount } from '@vue/test-utils';
import DtProgressCircle from './ProgressCircle.vue';
import { PROGRESS_CIRCLE_SIZES, PROGRESS_CIRCLE_SIZE_DEFAULT, PROGRESS_CIRCLE_KINDS } from './ProgressCircleConstants';

const baseProps = { ariaLabel: 'Upload progress' };
let mockProps = {};

describe('DtProgressCircle Tests', () => {
  let wrapper;
  let progressCircle;

  const updateWrapper = () => {
    wrapper = mount(DtProgressCircle, {
      props: { ...baseProps, ...mockProps },
      attachTo: document.body,
    });
    progressCircle = wrapper.find('[data-qa="dt-progress-circle"]');
  };

  beforeEach(() => { updateWrapper(); });
  afterEach(() => { mockProps = {}; wrapper?.unmount(); });

  describe('Presentation Tests', () => {
    it('should render', () => { expect(progressCircle.exists()).toBe(true); });

    describe('When progress is 0 (default)', () => {
      it('has aria-valuenow 0', () => { expect(progressCircle.attributes('aria-valuenow')).toBe('0'); });
    });

    describe('When progress is 50', () => {
      beforeEach(() => { mockProps = { progress: 50 }; updateWrapper(); });
      it('has aria-valuenow 50', () => { expect(progressCircle.attributes('aria-valuenow')).toBe('50'); });
    });

    describe('When progress is 100', () => {
      beforeEach(() => { mockProps = { progress: 100 }; updateWrapper(); });
      it('has aria-valuenow 100', () => { expect(progressCircle.attributes('aria-valuenow')).toBe('100'); });
    });

    describe('When progress is below minimum visual threshold (1–4)', () => {
      beforeEach(() => { mockProps = { progress: 2 }; updateWrapper(); });

      it('has aria-valuenow reflecting the real value', () => {
        expect(progressCircle.attributes('aria-valuenow')).toBe('2');
      });

      it('renders the same fill as progress=5', () => {
        const smallStyle = wrapper.find('.d-progress-circle__bar').attributes('style');

        mockProps = { progress: 5 };
        updateWrapper();
        const fiveStyle = wrapper.find('.d-progress-circle__bar').attributes('style');

        expect(smallStyle).toBe(fiveStyle);
      });
    });
  });

  describe('Size Tests', () => {
    it('applies default size class', () => {
      expect(progressCircle.classes()).toContain(PROGRESS_CIRCLE_SIZES[PROGRESS_CIRCLE_SIZE_DEFAULT]);
    });

    describe('When size is 200', () => {
      beforeEach(() => { mockProps = { size: '200' }; updateWrapper(); });
      it('applies size-200 class', () => {
        expect(progressCircle.classes()).toContain(PROGRESS_CIRCLE_SIZES[200]);
      });
    });
  });

  describe('Kind Tests', () => {
    it('applies no extra class for default kind', () => {
      expect(progressCircle.classes()).not.toContain(PROGRESS_CIRCLE_KINDS.brand);
      expect(progressCircle.classes()).not.toContain(PROGRESS_CIRCLE_KINDS.critical);
    });

    describe('When kind is brand', () => {
      beforeEach(() => { mockProps = { kind: 'brand' }; updateWrapper(); });
      it('applies brand class', () => {
        expect(progressCircle.classes()).toContain(PROGRESS_CIRCLE_KINDS.brand);
      });
    });

    describe('When kind is critical', () => {
      beforeEach(() => { mockProps = { kind: 'critical' }; updateWrapper(); });
      it('applies critical class', () => {
        expect(progressCircle.classes()).toContain(PROGRESS_CIRCLE_KINDS.critical);
      });
    });

    describe('When kind is ai', () => {
      beforeEach(() => { mockProps = { kind: 'ai', progress: 50 }; updateWrapper(); });
      it('applies ai class', () => {
        expect(progressCircle.classes()).toContain(PROGRESS_CIRCLE_KINDS.ai);
      });

      it('renders an SVG gradient', () => {
        expect(wrapper.find('linearGradient').exists()).toBe(true);
      });

      it('applies gradient stroke to fill path', () => {
        const fillPath = wrapper.find('.d-progress-circle__shape--fill');
        expect(fillPath.attributes('style')).toContain('url(#progress-circle-ai-gradient-');
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="progressbar"', () => { expect(progressCircle.attributes('role')).toBe('progressbar'); });
    it('has aria-valuemin="0"', () => { expect(progressCircle.attributes('aria-valuemin')).toBe('0'); });
    it('has aria-valuemax="100"', () => { expect(progressCircle.attributes('aria-valuemax')).toBe('100'); });
    it('applies ariaLabel prop', () => { expect(progressCircle.attributes('aria-label')).toBe('Upload progress'); });
  });
});
