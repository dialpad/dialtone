import { mount } from '@vue/test-utils';
import DtProgress from './progress.vue';
import { PROGRESS_SIZES, PROGRESS_SIZE_DEFAULT } from './progress_constants';

// jsdom does not implement getTotalLength — add it to Element.prototype so mounted() can call it
beforeAll(() => {
  Object.defineProperty(Element.prototype, 'getTotalLength', {
    value: vi.fn(() => 50),
    writable: true,
    configurable: true,
  });
});

const baseProps = { ariaLabel: 'Upload progress' };
let mockProps = {};

describe('DtProgress Tests', () => {
  let wrapper;
  let progress;

  const updateWrapper = () => {
    wrapper = mount(DtProgress, {
      props: { ...baseProps, ...mockProps },
      attachTo: document.body,
    });
    progress = wrapper.find('[data-qa="dt-progress"]');
  };

  beforeEach(() => { updateWrapper(); });
  afterEach(() => { mockProps = {}; wrapper?.unmount(); });

  describe('Presentation Tests', () => {
    it('should render', () => { expect(progress.exists()).toBe(true); });

    describe('When progress is 0 (default)', () => {
      it('has aria-valuenow 0', () => { expect(progress.attributes('aria-valuenow')).toBe('0'); });
    });

    describe('When progress is 50', () => {
      beforeEach(() => { mockProps = { progress: 50 }; updateWrapper(); });
      it('has aria-valuenow 50', () => { expect(progress.attributes('aria-valuenow')).toBe('50'); });
    });

    describe('When progress is 100', () => {
      beforeEach(() => { mockProps = { progress: 100 }; updateWrapper(); });
      it('has aria-valuenow 100', () => { expect(progress.attributes('aria-valuenow')).toBe('100'); });
    });
  });

  describe('Size Tests', () => {
    it('applies default size class', () => {
      expect(wrapper.find('svg').classes()).toContain(PROGRESS_SIZES[PROGRESS_SIZE_DEFAULT]);
    });

    describe('When size is 200', () => {
      beforeEach(() => { mockProps = { size: '200' }; updateWrapper(); });
      it('applies size-200 class', () => {
        expect(wrapper.find('svg').classes()).toContain(PROGRESS_SIZES[200]);
      });
    });
  });

  describe('Accessibility Tests', () => {
    it('has role="progressbar"', () => { expect(progress.attributes('role')).toBe('progressbar'); });
    it('has aria-valuemin="0"', () => { expect(progress.attributes('aria-valuemin')).toBe('0'); });
    it('has aria-valuemax="100"', () => { expect(progress.attributes('aria-valuemax')).toBe('100'); });
    it('applies ariaLabel prop', () => { expect(progress.attributes('aria-label')).toBe('Upload progress'); });
  });
});
