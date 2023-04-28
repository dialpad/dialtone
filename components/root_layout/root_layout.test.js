import { shallowMount } from '@vue/test-utils';
import DtRootLayout from './root_layout.vue';

// Constants
const baseProps = {
  headerHeight: '32px',
  footerHeight: '64px',
};

const baseSlotsData = {
  header: 'header slot content',
  footer: 'footer slot content',
};

describe('DtRootLayout Tests', () => {
  // Wrappers
  let wrapper;

  let header;
  let footer;

  // Environment
  let props = baseProps;
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    header = wrapper.find('[data-qa="dt-root-layout-header"]');
    footer = wrapper.find('[data-qa="dt-root-layout-footer"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRootLayout, {
      props,
      slots,
    });
    _setChildWrappers();
  };

  // Setup

  // Teardown
  afterEach(() => {
    props = baseProps;
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
        expect(header.element.style.getPropertyValue('height')).toBe(props.headerHeight);
      });

      it('should set the footer height', () => {
        expect(footer.element.style.getPropertyValue('height')).toBe(props.footerHeight);
      });
    });

    describe('When headerSticky is set to default', () => {
      it('Has correct class', async () => {
        expect(header.classes('d-root-layout__header--sticky')).toBe(false);
      });
    });

    describe('When headerSticky is set to true', () => {
      beforeEach(async () => {
        await wrapper.setProps({ headerSticky: true });
      });

      it('Has correct class', () => {
        expect(header.classes('d-root-layout__header--sticky')).toBe(true);
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
