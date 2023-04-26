import { createLocalVue, mount } from '@vue/test-utils';
import DtRecipeContactInfo from './contact_info.vue';

// Constants
const basePropsData = {
  avatarSrc: 'avatar.png',
  avatarInitials: 'JL',
  presence: 'active',
};

const baseSlotsData = {
  header: 'Joseph Lumaban',
  subtitle: '+1 (415) 123-4567',
  bottom: 'Aerolabs Support',
};

describe('DtRecipeContactInfo Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let rootElement;
  let headerElement;
  let avatarElement;
  let subtitleElement;
  let bottomElement;

  // Environment
  let propsData = basePropsData;
  let attrs = {};
  let slots = baseSlotsData;
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    rootElement = wrapper.find('[data-qa="contact-info"]');
    headerElement = wrapper.find('[data-qa="contact-info-header"]');
    avatarElement = wrapper.find('[data-qa="dt-avatar"]');
    subtitleElement = wrapper.find('[data-qa="contact-info-subtitle"]');
    bottomElement = wrapper.find('[data-qa="contact-info-bottom"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeContactInfo, {
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
    slots = baseSlotsData;
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
      it('Should display header content correctly', () => {
        expect(headerElement.exists()).toBe(true);
        expect(headerElement.text()).toBe('Joseph Lumaban');
      });
      it('Should render avatar component', () => {
        expect(avatarElement.exists()).toBe(true);
      });
      it('Should render subtitle content correctly', () => {
        expect(subtitleElement.exists()).toBe(true);
        expect(subtitleElement.text()).toBe('+1 (415) 123-4567');
      });
      it('Should render bottom content correctly', () => {
        expect(bottomElement.exists()).toBe(true);
        expect(bottomElement.text()).toBe('Aerolabs Support');
      });
    });

    describe('When `avatarSrc` is empty and `avatarInitials` is passed', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          avatarSrc: '',
          avatarInitials: 'JL',
        });
        await wrapper.vm.$nextTick();
        _setChildWrappers();
      });
      it('Avatar should display', () => {
        expect(avatarElement.exists()).toBe(true);
      });
      it('Should display correct initials', () => {
        expect(avatarElement.text()).toBe('JL');
      });
    });

    describe('When both `avatarSrc` and `avatarInitials` are empty', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          avatarSrc: '',
          avatarInitials: '',
        });
      });
      it('Should not display avatar', () => {
        expect(avatarElement.exists()).toBe(false);
      });
    });
  });
});
