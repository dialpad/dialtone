import { assert } from 'chai';
import { shallowMount } from '@vue/test-utils';
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

describe('DtRootLayout Tests', function () {
  // Wrappers
  let wrapper;

  let header;
  let footer;

  // Environment
  let propsData = basePropsData;
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    header = wrapper.find('[data-qa="dt-root-layout-header"]');
    footer = wrapper.find('[data-qa="dt-root-layout-footer"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRootLayout, {
      propsData,
      slots,
    });
    _setChildWrappers();
  };

  // Setup

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
    slots = baseSlotsData;
  });

  beforeEach(function () { _setWrappers(); });

  describe('Presentation Tests', function () {
    describe('When root layout renders', function () {
      it('root should exist', function () { assert.isTrue(wrapper.exists()); });
      it('header should exist', function () { assert.isTrue(header.exists()); });
      it('footer should exist', function () { assert.isTrue(footer.exists()); });
    });

    describe('When slot content renders', function () {
      it('header slot is passed down correctly', async function () {
        assert.strictEqual(header.text(), slots.header);
      });

      it('footer slot is passed down correctly', async function () {
        assert.strictEqual(footer.text(), slots.footer);
      });
    });

    describe('When dynamic inline styles are set', function () {
      it('should set the header height', function () {
        assert.strictEqual(header.element.style.getPropertyValue('height'), propsData.headerHeight);
      });

      it('should set the footer height', function () {
        assert.strictEqual(footer.element.style.getPropertyValue('height'), propsData.footerHeight);
      });
    });

    describe('When headerSticky is set to default', function () {
      it('Has correct class', async function () {
        assert.strictEqual(header.classes('d-root-layout__header--sticky'), false);
      });
    });

    describe('When headerSticky is set to true', function () {
      beforeEach(async function () {
        await wrapper.setProps({ headerSticky: true });
      });

      it('Has correct class', async function () {
        assert.strictEqual(header.classes('d-root-layout__header--sticky'), true);
      });
    });
  });

  describe('Accessibility Tests', function () {
    describe('When header is rendered', function () {
      it('Uses `header` tag', async function () {
        assert.strictEqual(header.element.tagName, 'HEADER');
      });
    });

    describe('When footer is rendered', function () {
      it('Uses `footer` tag', async function () {
        assert.strictEqual(footer.element.tagName, 'FOOTER');
      });
    });
  });
});
