import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtBreadcrumb from './breadcrumbs.vue';
import { BREADCRUMB_ITEM_SELECTED_MODIFIER, BREADCRUMBS_INVERTED_MODIFIER } from './breadcrumbs_constants';

// Constants
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

describe('DtBreadcrumb Tests', function () {
  // Wrappers
  let wrapper;
  let breadcrumbs;
  let breadcrumbItems;

  // Environment
  const props = baseProps;

  // Helpers
  const _setWrappers = () => {
    breadcrumbs = wrapper.find('[data-qa="dt-breadcrumbs"]');
    breadcrumbItems = wrapper.findAll('[data-qa="dt-breadcrumb-item"]');
  };

  const _mountWrapper = () => {
    wrapper = mount(DtBreadcrumb, {
      props,
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
    it('should render the item breadcrumb', function () { assert.isNotEmpty(breadcrumbItems); });

    describe('When the breadcrumb has default state', function () {
      it('should has correct aria-current', function () {
        const elementWithValidAria = breadcrumbItems.filter(item => {
          return item.find('[aria-current="location"]').exists();
        });
        assert.equal(elementWithValidAria.length, 1);
      });
      it('should has correct rendered items', function () {
        assert.equal(breadcrumbItems.length, baseProps.breadcrumbs.length);
      });
      it('should has correct sequence', function () {
        assert.equal(breadcrumbItems.length, baseProps.breadcrumbs.length);
        baseProps.breadcrumbs.forEach(({ label }, i) => {
          assert.equal(breadcrumbItems.at(i).text(), label);
        });
      });
    });

    describe('When a inverted is provided to breadcrumbs', function () {
      before(function () {
        baseProps.inverted = true;
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

  describe('Accessibility Tests', function () {
    describe('When a new area-label is provided', function () {
      before(function () {
        baseProps.ariaLabel = 'newAria';
      });

      it('should update area-label value', function () {
        assert.strictEqual(breadcrumbs.attributes('aria-label'), 'newAria');
      });
    });
  });
});
