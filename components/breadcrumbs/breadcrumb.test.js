import { createLocalVue, mount } from '@vue/test-utils';
import DtBreadcrumb from './breadcrumbs.vue';
import { BREADCRUMB_ITEM_SELECTED_MODIFIER, BREADCRUMBS_INVERTED_MODIFIER } from './breadcrumbs_constants';

// Constants
const basePropsData = {
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

describe('DtBreadcrumb Tests', () => {
  // Wrappers
  let wrapper;
  let breadcrumbs;
  let breadcrumbItems;

  // Environment
  const propsData = basePropsData;

  // Helpers
  const _setWrappers = () => {
    breadcrumbs = wrapper.find('[data-qa="dt-breadcrumbs"]');
    breadcrumbItems = wrapper.findAll('[data-qa="dt-breadcrumb-item"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtBreadcrumb, {
      propsData,
      localVue: createLocalVue(),
    });
    _setWrappers();
  };

  // Setup
  beforeEach(() => {
    _mountWrapper();
  });

  describe('Presentation Tests', () => {
    it(
      'should render the component',
      () => { expect(wrapper.exists()).toBe(true); },
    );
    it(
      'should render the breadcrumbs',
      () => { expect(breadcrumbs.exists()).toBeTruthy(); },
    );
    it(
      'should render the item breadcrumb',
      () => { expect(breadcrumbItems.exists()).toBeTruthy(); },
    );

    describe('When the breadcrumb has default state', () => {
      it('should has correct aria-current', () => {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.find('[aria-current="location"]').constructor.name === 'VueWrapper';
        });
        expect(elementWithValidAria.length).toEqual(1);
      });
      it('should has correct rendered items', () => {
        expect(breadcrumbItems.length).toEqual(basePropsData.breadcrumbs.length);
      });
      it('should has correct sequence', () => {
        expect(breadcrumbItems.length).toEqual(basePropsData.breadcrumbs.length);
        basePropsData.breadcrumbs.forEach(({ label }, i) => {
          expect(breadcrumbItems.at(i).text()).toEqual(label);
        });
      });
    });

    describe('When a inverted is provided to breadcrumbs', () => {
      beforeAll(() => {
        basePropsData.inverted = true;
      });
      it('should render label', () => {
        expect(breadcrumbs.classes().includes(BREADCRUMBS_INVERTED_MODIFIER)).toBe(true);
      });
    });

    describe('When a selected is provided to breadcrumbs', () => {
      it('should render label', () => {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.classes().includes(BREADCRUMB_ITEM_SELECTED_MODIFIER);
        });
        expect(elementWithValidAria.length).toEqual(1);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a new area-label is provided', () => {
      beforeAll(() => {
        basePropsData.ariaLabel = 'newAria';
      });

      it('should update area-label value', () => {
        expect(breadcrumbs.attributes('aria-label')).toBe('newAria');
      });
    });
  });
});
