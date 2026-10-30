import { mount } from '@vue/test-utils';
import DtLoader from './Loader.vue';

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

    it('Should render four dots', () => {
      expect(loadingIcon.findAll('[data-qa="dt-loader-dot"]').length).toBe(4);
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

    describe('When rendered with the default kind', () => {
      it('Should not have the spinner modifier', () => {
        expect(wrapper.classes()).not.toContain('d-loader--spinner');
      });

      it('Should not render the spinner track', () => {
        expect(wrapper.find('[data-qa="dt-loader-icon-track"]').exists()).toBe(false);
      });
    });

    describe('When kind is spinner', () => {
      beforeEach(() => {
        mockProps = { kind: 'spinner' };
        updateWrapper();
      });

      it('Should have the spinner modifier', () => {
        expect(wrapper.classes()).toContain('d-loader--spinner');
      });

      it('Should render the track', () => {
        expect(wrapper.find('[data-qa="dt-loader-icon-track"]').exists()).toBe(true);
      });

      it('Should render the spinning icon', () => {
        expect(loadingIcon.exists()).toBe(true);
      });

      it('Should not render dots', () => {
        expect(wrapper.findAll('[data-qa="dt-loader-dot"]').length).toBe(0);
      });

      describe('When size prop is set', () => {
        beforeEach(async () => {
          await wrapper.setProps({ size: '200' });
        });

        it('Should apply the size to the track', () => {
          expect(wrapper.find('[data-qa="dt-loader-icon-track"]').classes()).toContain('d-icon--size-200');
        });

        it('Should apply the size to the spinning icon', () => {
          expect(loadingIcon.classes()).toContain('d-icon--size-200');
        });
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

    describe('When rendered with the default kind', () => {
      it('Hides its SVG from assistive technology', () => {
        expect(wrapper.findAll('svg').map(svg => svg.attributes('aria-hidden'))).toEqual(['true']);
      });
    });

    describe('When kind is spinner', () => {
      beforeEach(() => {
        mockProps = { kind: 'spinner' };
        updateWrapper();
      });

      it('Keeps the default aria label', () => {
        expect(wrapper.attributes('aria-label')).toBe(MOCK_DEFAULT_ARIA_LABEL);
      });

      it('Hides both SVGs from assistive technology', () => {
        expect(wrapper.findAll('svg').map(svg => svg.attributes('aria-hidden'))).toEqual(['true', 'true']);
      });
    });
  });
});
