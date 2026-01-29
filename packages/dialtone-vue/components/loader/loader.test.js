import { mount } from '@vue/test-utils';
import DtLoader from './loader.vue';

const MOCK_DEFAULT_ARIA_LABEL = 'loading';

const baseProps = {};

let mockProps = {};

describe('DtLoader Tests', function () {
  /**
   * Wrappers
   * Will contain the component and all its necessary children
   */
  let wrapper;
  let loadingIcon;

  const updateWrapper = () => {
    wrapper = mount(DtLoader, {
      props: { ...baseProps, ...mockProps },
    });

    loadingIcon = wrapper.find('[data-qa="dt-loader-icon"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  /**
   * Teardown
   * Will reset the environment after each test
   */
  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('Should render the component', () => {
      expect(wrapper).toBeDefined();
      expect(loadingIcon.exists()).toBe(true);
    });

    describe('When rendered with default props', () => {
      it('Size should be 500', () => {
        expect(loadingIcon.element.classList.contains('d-icon--size-500')).toBe(true);
      });
    });

    describe('When size prop is set', () => {
      beforeEach(() => {
        wrapper.setProps({ size: '200' });
      });

      it('Should have correct class', () => {
        expect(loadingIcon.element.classList.contains('d-icon--size-200')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When ariaLabel is not set', () => {
      it('Has default aria label', () => {
        expect(wrapper.attributes('aria-label')).toBe(MOCK_DEFAULT_ARIA_LABEL);
      });
    });

    describe('When ariaLabel is set', () => {
      beforeEach(() => {
        wrapper.setProps({ ariaLabel: 'custom aria label' });
      });

      it('Has custom aria label', () => {
        expect(wrapper.attributes('aria-label')).toBe('custom aria label');
      });
    });
  });
});
