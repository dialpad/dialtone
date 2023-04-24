import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeGroupRow from './group_row.vue';

// Constants
const basePropsData = {
  groupCount: 2,
  names: 'Jaqueline Nackos, Lori Smith',
  avatarInitials: 'JN',
  avatarSrc: 'person.png',
};

describe('DtRecipeGroupRow Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let description;
  let unreadBadge;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    description = wrapper.find('.dt-leftbar-row__description');
    unreadBadge = wrapper.find('[data-qa="dt-leftbar-row-unread-badge"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeGroupRow, {
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
    propsData = basePropsData;
    slots = {};
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
    describe('When the group row renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      it('should exist', () => { expect(wrapper.exists()).toBeTruthy(); });

      it('should render the description', () => {
        expect(description.text()).toBe(basePropsData.names);
      });
    });

    describe('When a unreadCount is provided', () => {
      // Test Environment
      const unreadCount = '25';
      const hasUnreads = true;

      // Test Setup
      beforeEach(() => {
        propsData = { ...propsData, hasUnreads, unreadCount };
        _setWrappers();
      });

      it('should render the unreadCount', () => {
        expect(unreadBadge.text()).toBe(unreadCount);
      });
    });

    describe('When selected is provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...propsData, selected: true };
        _setWrappers();
      });

      it('should render the selected group row', () => {
        expect(wrapper.classes().includes('dt-leftbar-row--selected')).toBe(true);
      });
    });
  });
});
