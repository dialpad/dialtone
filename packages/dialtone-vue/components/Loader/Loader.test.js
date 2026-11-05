import { mount } from '@vue/test-utils';
import DtLoader from './Loader.vue';
import { DialtoneLocalization } from '@/localization';

const MOCK_DEFAULT_ARIA_LABEL = 'loading';

const baseProps = {};

let mockProps = {};
let mockAttrs = {};

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
      attrs: mockAttrs,
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
    mockAttrs = {};
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
    it.each([undefined, null])('Uses image semantics when a forwarded role is %s', role => {
      mockAttrs = { role };
      updateWrapper();

      expect(wrapper.attributes('role')).toBe('img');
      expect(wrapper.attributes('aria-label')).toBe(MOCK_DEFAULT_ARIA_LABEL);
    });

    it('Localizes the default label while preserving a custom label', async () => {
      const translate = vi.spyOn(DialtoneLocalization.prototype, '$t')
        .mockImplementation(key => key === 'DIALTONE_LOADING' ? 'En cours de chargement' : key);

      try {
        updateWrapper();
        expect(wrapper.attributes('aria-label')).toBe('En cours de chargement');

        await wrapper.setProps({ ariaLabel: 'Loading messages' });
        expect(wrapper.attributes('aria-label')).toBe('Loading messages');
      } finally {
        translate.mockRestore();
      }
    });

    describe('When ariaLabel is not set', () => {
      it('Has default aria label', () => {
        expect(wrapper.attributes('role')).toBe('img');
        expect(wrapper.attributes('aria-label')).toBe(MOCK_DEFAULT_ARIA_LABEL);
        expect(wrapper.attributes('aria-live')).toBeUndefined();
      });
    });

    it('Preserves a caller-provided role and label reference', () => {
      mockAttrs = {
        role: 'progressbar',
        'aria-labelledby': 'loading-label',
        'data-qa': 'caller-loader',
        class: 'caller-loader',
      };
      updateWrapper();

      expect(wrapper.attributes('role')).toBe('progressbar');
      expect(wrapper.attributes('aria-labelledby')).toBe('loading-label');
      expect(wrapper.attributes('data-qa')).toBe('caller-loader');
      expect(wrapper.classes()).toContain('caller-loader');
    });

    it('Preserves a caller-hidden loader', () => {
      mockAttrs = { 'aria-hidden': 'true' };
      updateWrapper();

      expect(wrapper.attributes('aria-hidden')).toBe('true');
    });

    it.each(['none', 'presentation'])('Omits the accessible label for role="%s"', async role => {
      mockAttrs = { role };
      updateWrapper();

      expect(wrapper.attributes('role')).toBe(role);
      expect(wrapper.attributes('aria-label')).toBeUndefined();

      await wrapper.setProps({ role: 'img' });
      expect(wrapper.attributes('aria-label')).toBe(MOCK_DEFAULT_ARIA_LABEL);

      await wrapper.setProps({ role });
      expect(wrapper.attributes('aria-label')).toBeUndefined();
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
