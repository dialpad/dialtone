import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtRootLayout from './root_layout.vue';

// Constants
const basePropsData = {
  headerHeight: '32px',
  footerHeight: '64px',
};

const baseSlotsData = {
  header: 'header slot content',
  footer: 'footer slot content',
};

describe('DtRootLayout Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;

  let header;
  let footer;

  // Environment
  let propsData = basePropsData;
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    header = wrapper.find('[data-qa="root-layout-header"]');
    footer = wrapper.find('[data-qa="root-layout-footer"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRootLayout, {
      propsData,
      slots,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Teardown
  afterEach(() => {
    propsData = basePropsData;
    slots = baseSlotsData;
  });

  beforeEach(() => { _setWrappers(); });

  describe('Presentation Tests', () => {
    describe('When root layout renders', () => {
      it('root should exist', () => { expect(wrapper.exists()).toBe(true); });
      it('header should exist', () => { expect(header.exists()).toBe(true); });
      it('footer should exist', () => { expect(footer.exists()).toBe(true); });
    });

    describe('When slot content renders', () => {
      it('header slot is passed down correctly', async () => {
        expect(header.text()).toBe(slots.header);
      });

      it('footer slot is passed down correctly', async () => {
        expect(footer.text()).toBe(slots.footer);
      });
    });

    describe('When dynamic inline styles are set', () => {
      it('should set the header height', () => {
        expect(header.element.style.getPropertyValue('height')).toBe(propsData.headerHeight);
      });

      it('should set the footer height', () => {
        expect(footer.element.style.getPropertyValue('height')).toBe(propsData.footerHeight);
      });
    });

    describe('When headerSticky is set to default', () => {
      it('Has correct class', async () => {
        expect(header.classes('root-layout__header--sticky')).toBe(false);
      });
    });

    describe('When headerSticky is set to true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ headerSticky: true });
      });

      it('Has correct class', async () => {
        expect(header.classes('root-layout__header--sticky')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When header is rendered', () => {
      it('Uses `header` tag', async () => {
        expect(header.element.tagName).toBe('HEADER');
      });
    });

    describe('When footer is rendered', () => {
      it('Uses `footer` tag', async () => {
        expect(footer.element.tagName).toBe('FOOTER');
      });
    });
  });
});
