import { assert } from 'chai';
import { createLocalVue, mount } from '@vue/test-utils';
import DtListItemGroup from './list_item_group.vue';

// Constants
const basePropsData = {
  heading: 'Heading',
  id: 'list-item-group',
};

describe('DtListItemGroup Tests', function () {
  // Wrappers
  let wrapper;
  let heading;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    heading = wrapper.find('[data-qa="dt-dropdown-list-heading"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtListItemGroup, {
      propsData,
      attrs,
      slots,
      provide,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  after(function () {});

  describe('Presentation Tests', function () {
    describe('List Group has a heading set', function () {
      it('displays the heading correctly', function () {
        assert.strictEqual(heading.text(), basePropsData.heading);
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('List Group has a heading set', function () {
      it('the root ul is aria-labelledby the id of the header element', function () {
        assert.strictEqual(wrapper.attributes('aria-labelledby'), basePropsData.id + '-heading');
      });
    });
  });
});
