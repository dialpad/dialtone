import { createLocalVue, mount } from '@vue/test-utils';
import DtListItemGroup from './list_item_group.vue';

// Constants
const basePropsData = {
  heading: 'Heading',
  id: 'list-item-group',
};

describe('DtListItemGroup Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

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
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });
  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = {};
    slots = {};
    provide = {};
  });
  afterAll(() => {});

  describe('Presentation Tests', () => {
    describe('List Group has a heading set', () => {
      it('displays the heading correctly', () => {
        expect(heading.text()).toBe(basePropsData.heading);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('List Group has a heading set', () => {
      it(
        'the root ul is aria-labelledby the id of the header element',
        () => {
          expect(wrapper.attributes('aria-labelledby')).toBe(basePropsData.id + '-heading');
        },
      );
    });
  });
});
