import { mount } from '@vue/test-utils';
import DtBreadcrumb from './breadcrumbs.vue';
import { BREADCRUMB_ITEM_SELECTED_MODIFIER, BREADCRUMBS_INVERTED_MODIFIER } from './breadcrumbs_constants';

const baseProps = {
  inverted: false,
  breadcrumbs: [{
    url: '#',
    label: 'Root',
  },
  {
    url: '#',
    label: 'Section',
  },
  {
    url: '#',
    label: 'Section',
  },
  {
    url: '#',
    label: 'Section',
  },
  {
    url: '#',
    label: 'Current Page',
    selected: true,
  }],
};

let mockProps = {};

describe('DtBreadcrumb Tests', () => {
  let wrapper;
  let breadcrumbs;
  let breadcrumbItems;

  const updateWrapper = () => {
    wrapper = mount(DtBreadcrumb, {
      props: { ...baseProps, ...mockProps },
    });

    breadcrumbs = wrapper.find('[data-qa="dt-breadcrumbs"]');
    breadcrumbItems = wrapper.findAll('[data-qa="dt-breadcrumb-item"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should render the breadcrumbs', () => {
      expect(breadcrumbs.exists()).toBeTruthy();
    });

    it('should render the item breadcrumb', () => {
      expect(breadcrumbItems.length).toBeGreaterThan(0);
    });

    describe('When the breadcrumb has default state', () => {
      it('should has correct aria-current', () => {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.find('[aria-current="location"]').exists();
        });

        expect(elementWithValidAria.length).toBe(1);
      });

      it('should has correct rendered items', () => {
        expect(breadcrumbItems.length).toEqual(baseProps.breadcrumbs.length);
      });

      it('should has correct sequence', () => {
        expect(breadcrumbItems.length).toEqual(baseProps.breadcrumbs.length);

        baseProps.breadcrumbs.forEach(({ label }, i) => {
          expect(breadcrumbItems.at(i).text()).toEqual(label);
        });
      });
    });

    describe('When a inverted is provided to breadcrumbs', () => {
      it('should render label', () => {
        mockProps = { inverted: true };

        updateWrapper();

        expect(breadcrumbs.classes().includes(BREADCRUMBS_INVERTED_MODIFIER)).toBe(true);
      });
    });

    describe('When a selected is provided to breadcrumbs', () => {
      it('should render label', () => {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.classes().includes(BREADCRUMB_ITEM_SELECTED_MODIFIER);
        });

        expect(elementWithValidAria.length).toBe(1);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a new area-label is provided', () => {
      it('should update area-label value', () => {
        mockProps = { ariaLabel: 'newAria' };

        updateWrapper();

        expect(breadcrumbs.attributes('aria-label')).toBe('newAria');
      });
    });
  });
});
