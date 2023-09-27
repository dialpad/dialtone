import { createLocalVue, mount } from '@vue/test-utils';
import DtRootLayout from './root_layout.vue';

const baseProps = {
  headerHeight: '32px',
  footerHeight: '64px',
};

const baseSlots = {
  header: 'header slot content',
  footer: 'footer slot content',
};

let mockProps = {};
let mockSlots = {};
const testContext = {};

describe('DtRootLayout Tests', () => {
  let wrapper;
  let header;
  let footer;

  const updateWrapper = () => {
    wrapper = mount(DtRootLayout, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    header = wrapper.find('[data-qa="dt-root-layout-header"]');
    footer = wrapper.find('[data-qa="dt-root-layout-footer"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When root layout renders', () => {
      it('root should exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('header should exist', () => {
        expect(header.exists()).toBe(true);
      });

      it('footer should exist', () => {
        expect(footer.exists()).toBe(true);
      });
    });

    describe('When slot content renders', () => {
      it('header slot is passed down correctly', () => {
        expect(header.text()).toBe(baseSlots.header);
      });

      it('footer slot is passed down correctly', () => {
        expect(footer.text()).toBe(baseSlots.footer);
      });
    });

    describe('When dynamic inline styles are set', () => {
      it('should set the header height', () => {
        expect(header.element.style.getPropertyValue('height')).toBe(baseProps.headerHeight);
      });

      it('should set the footer height', () => {
        expect(footer.element.style.getPropertyValue('height')).toBe(baseProps.footerHeight);
      });
    });

    describe('When headerSticky is set to default', () => {
      it('Has correct class', () => {
        expect(header.classes('d-root-layout__header--sticky')).toBe(false);
      });
    });

    describe('When headerSticky is set to true', () => {
      it('Has correct class', async () => {
        await wrapper.setProps({ headerSticky: true });

        expect(header.classes('d-root-layout__header--sticky')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When header is rendered', () => {
      it('Uses `header` tag', () => {
        expect(header.element.tagName).toBe('HEADER');
      });
    });

    describe('When footer is rendered', () => {
      it('Uses `footer` tag', () => {
        expect(footer.element.tagName).toBe('FOOTER');
      });
    });
  });
});
