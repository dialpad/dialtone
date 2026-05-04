import { mount } from '@vue/test-utils';
import DtRecipeContactRow from './ContactRow.vue';

// Constants
const baseProps = {
  avatarSrc: 'avatar1.png',
  name: 'Joseph Lumaban',
  presence: 'active',
};

describe('DtRecipeContactRow Tests', () => {
  // Wrappers
  let wrapper;
  let rootElement;
  let avatarElement;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    rootElement = wrapper.find('[data-qa="contact-row"]');
    avatarElement = wrapper.find('[data-qa="dt-avatar"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeContactRow, {
      props,
      attrs,
      slots,
      global: {
        provide,
      },
    });
    _setChildWrappers();
  };

  // Setup
  beforeEach(function () {
    _setWrappers();
  });

  // Teardown
  afterEach(function () {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
  });

  describe('Presentation Tests', () => {
    /*
     * Test(s) to ensure that the component is correctly rendering
     */
    describe('When pass default content', () => {
      it('Should render contact info component', () => {
        expect(wrapper.exists()).toBe(true);
        expect(rootElement.exists()).toBe(true);
      });
      it('Should display avatar element content correctly', () => {
        expect(avatarElement.exists()).toBe(true);
      });
    });

    describe('When `avatarColor` is defined', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          avatarColor: '540',
        });
        _setChildWrappers();
      });
      it('Avatar should display', () => {
        expect(avatarElement.exists()).toBe(true);
      });
      it('Should display correct color via data-attributes', () => {
        // color '540' = family 5, variant 4
        expect(avatarElement.attributes('data-avatar-family')).toBe('5');
        expect(avatarElement.attributes('data-avatar-variant')).toBe('4');
      });
    });
  });
});
