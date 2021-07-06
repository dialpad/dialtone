import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtBreadcrumb from './breadcrumbs.vue';
import { BREADCRUMB_ITEM_SELECTED_MODIFIER, BREADCRUMBS_INVERTED_MODIFIER } from './breadcrumbs_constants';

// Constants
const basePropsData = {
  'aria-label': 'breadcrumbs',
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

describe('Dialtone Vue Breadcrumb tests', function () {
  // Wrappers
  let wrapper;
  let breadcrumbs;
  let breadcrumbItems;

  // Environment
  const propsData = basePropsData;

  // Helpers
  const _setWrappers = () => {
    breadcrumbs = wrapper.find('[aria-label="breadcrumbs"]');
    breadcrumbItems = wrapper.findAll('.d-breadcrumbs__item');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtBreadcrumb, {
      propsData,
      localVue: createLocalVue(),
    });
    _setWrappers();
  };

  // Setup
  beforeEach(function () {
    _mountWrapper();
  });

  describe('Presentation Tests', function () {
    it('should render the component', function () { assert.exists(wrapper, 'wrapper exists'); });
    it('should render the breadcrumbs', function () { assert.exists(breadcrumbs.exists(), 'breadcrumbs exist'); });
    it('should render the item breadcrumb', function () { assert.exists(breadcrumbItems.exists(), 'items exist'); });

    describe('When the breadcrumb has default state', function () {
      it('should has correct aria-current', function () {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.find('[aria-current="location"]').constructor.name === 'VueWrapper';
        });
        assert.equal(elementWithValidAria.length, 1);
      });
      it('should has correct rendered items', function () {
        assert.equal(breadcrumbItems.length, basePropsData.breadcrumbs.length);
      });
      it('should has correct sequence', function () {
        assert.equal(breadcrumbItems.length, basePropsData.breadcrumbs.length);
        basePropsData.breadcrumbs.forEach(({ label }, i) => {
          assert.equal(breadcrumbItems.at(i).text(), label);
        });
      });
    });

    describe('When a inverted is provided to breadcrumbs', function () {
      before(function () {
        basePropsData.inverted = true;
      });
      it('should render label', function () {
        assert.isTrue(breadcrumbs.classes().includes(BREADCRUMBS_INVERTED_MODIFIER));
      });
    });

    describe('When a selected is provided to breadcrumbs', function () {
      it('should render label', function () {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.classes().includes(BREADCRUMB_ITEM_SELECTED_MODIFIER);
        });
        assert.equal(elementWithValidAria.length, 1);
      });
    });
  });
});
