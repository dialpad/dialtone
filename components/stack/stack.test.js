import { assert } from 'chai';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtStack from './stack.vue';

// Constants
const baseSlotsData = {
  default: `<div data-qa="default-content">Test 1</div> <div>Test 2</div>`,
};

describe('DtStack Tests', function () {
  // Wrappers
  let wrapper;

  let defaultContent;

  // Environment
  let slots = baseSlotsData;

  // Helpers
  const _setChildWrappers = () => {
    defaultContent = wrapper.find('[data-qa="default-content"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtStack, {
      slots,
      localVue: this.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  before(function () {
    this.localVue = createLocalVue();
  });

  // Teardown
  afterEach(function () {
    slots = baseSlotsData;
  });

  beforeEach(function () { _setWrappers(); });

  describe('Presentation Tests', function () {
    describe('When stack renders', function () {
      it('stack exist', function () {
        assert.isTrue(wrapper.exists());
      });

      it('content should exist', function () {
        assert.isTrue(defaultContent.exists());
      });
    });
  });

  describe('When `direction` prop is provided with', function () {
    describe('expected string value', function () {
      beforeEach(async function () {
        await wrapper.setProps({ direction: 'row' });
      });

      it('should set the proper class and override the default value', function () {
        assert.isTrue(wrapper.classes('d-stack', 'd-stack--row'));
      });
    });

    describe('non expected string value', function () {
      beforeEach(async function () {
        await wrapper.setProps({ direction: 'invalid' });
      });

      it('should do not add inexistent class', function () {
        assert.isFalse(wrapper.classes().includes('d-stack--invalid'));
      });
    });

    describe('expected object value', function () {
      beforeEach(async function () {
        await wrapper.setProps({
          direction: {
            sm: 'column',
            lg: 'column-reverse',
            md: 'row-reverse',
            xl: 'row',
          },
        });
      });

      it('should set proper responsive classes', function () {
        assert.isTrue(wrapper.classes(
          'd-stack--sm--column',
          'd-stack--md--row-reverse',
          'd-stack--lg--column-reverse',
          'd-stack--xl--row',
        ));
      });

      describe('When `default` is provided', function () {
        beforeEach(async function () {
          await wrapper.setProps({ direction: { default: 'row-reverse' } });
        });

        it('should override the default value', function () {
          assert.isTrue(wrapper.classes('d-stack', 'd-stack--row'));
        });
      });
    });

    describe('non expected object value', function () {
      describe('When is provided with non expected breakpoint value', function () {
        beforeEach(async function () {
          await wrapper.setProps({ direction: { invalid: 'column' } });
        });

        it('should do not add inexistent breakpoint class', function () {
          assert.isFalse(wrapper.classes().includes('d-stack--invalid--column'));
        });
      });

      describe('When `default` is provided with non expected direction value', function () {
        beforeEach(async function () {
          await wrapper.setProps({ direction: { default: 'roww' } });
        });

        it('should do not add inexistent direction class', function () {
          assert.isFalse(wrapper.classes().includes('d-stack--roww'));
        });
      });
    });
  });

  describe('When `as` prop is provided', function () {
    beforeEach(async function () {
      await wrapper.setProps({ as: 'section' });
    });

    it('should use it as the HTML element of stack', function () {
      assert.strictEqual(wrapper.element.tagName, 'SECTION');
    });
  });

  describe('When `gap` prop is provided as', function () {
    describe('valid value', function () {
      beforeEach(async function () {
        await wrapper.setProps({ gap: '300' });
      });

      it('should set proper gap class', function () {
        assert.isTrue(wrapper.classes().includes('d-stack--gap-300'));
      });
    });

    describe('non valid value', function () {
      beforeEach(async function () {
        await wrapper.setProps({ gap: '123' });
      });

      it('should not set gap class', function () {
        assert.isFalse(wrapper.classes().includes('d-stack--gap-123'));
      });
    });
  });
});
