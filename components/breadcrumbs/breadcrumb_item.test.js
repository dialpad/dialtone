import { assert } from 'chai';
import { mount } from '@vue/test-utils';
import DtBreadcrumbItem from './breadcrumb_item.vue';

const breadcrumbItemOption = {
  url: '#',
  label: 'Section',
};
let breadcrumbItemSlot = { default: 'Slotted section' };

describe('Dialtone Vue Breadcrumb tests', function () {
  // Wrappers
  let wrapper;

  const _mountWrapper = () => {
    wrapper = mount(DtBreadcrumbItem, {
      props: breadcrumbItemOption,
      slots: breadcrumbItemSlot,
    });
  };

  // Setup
  beforeEach(function () {
    _mountWrapper();
  });

  describe('Presentation Tests', function () {
    it('should render the breadcrumbItem', function () {
      assert.exists(wrapper.exists(), 'breadcrumbItem exist');
    });

    describe('When a default slot is provided to breadcrumb item', function () {
      it('should render default slot label', function () {
        assert.equal(wrapper.text(), 'Slotted section');
      });
    });

    describe('When a label is provided to breadcrumb item', function () {
      before(function () {
        breadcrumbItemSlot = {};
      });
      it('should render label', function () {
        assert.equal(wrapper.text(), 'Section');
      });
    });
  });
});
