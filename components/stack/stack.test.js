import { createLocalVue, shallowMount } from '@vue/test-utils';
import DtStack from './stack.vue';

// Constants
const baseSlotsData = {
  default: `<div data-qa="default-content">Test 1</div> <div>Test 2</div>`,
};

describe('DtStack Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

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
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Teardown
  afterEach(() => {
    slots = baseSlotsData;
  });

  beforeEach(() => { _setWrappers(); });

  describe('Presentation Tests', () => {
    describe('When stack renders', () => {
      it('stack exist', () => {
        expect(wrapper.exists()).toBe(true);
      });

      it('content should exist', () => {
        expect(defaultContent.exists()).toBe(true);
      });
    });
  });

  describe('When `direction` prop is provided with', () => {
    describe('expected string value', () => {
      beforeEach(async () => {
        await wrapper.setProps({ direction: 'row' });
      });

      it(
        'should set the proper class and override the default value',
        () => {
          expect(wrapper.classes('d-stack', 'd-stack--row')).toBe(true);
        },
      );
    });

    describe('non expected string value', () => {
      beforeEach(async () => {
        await wrapper.setProps({ direction: 'invalid' });
      });

      it('should do not add inexistent class', () => {
        expect(wrapper.classes().includes('d-stack--invalid')).toBe(false);
      });
    });

    describe('expected object value', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          direction: {
            sm: 'column',
            lg: 'column-reverse',
            md: 'row-reverse',
            xl: 'row',
          },
        });
      });

      it('should set proper responsive classes', () => {
        expect(wrapper.classes(
          'd-stack--sm--column',
          'd-stack--md--row-reverse',
          'd-stack--lg--column-reverse',
          'd-stack--xl--row',
        )).toBe(true);
      });

      describe('When `default` is provided', () => {
        beforeEach(async () => {
          await wrapper.setProps({ direction: { default: 'row-reverse' } });
        });

        it('should override the default value', () => {
          expect(wrapper.classes('d-stack', 'd-stack--row')).toBe(true);
        });
      });
    });

    describe('non expected object value', () => {
      describe('When is provided with non expected breakpoint value', () => {
        beforeEach(async () => {
          await wrapper.setProps({ direction: { invalid: 'column' } });
        });

        it('should do not add inexistent breakpoint class', () => {
          expect(wrapper.classes().includes('d-stack--invalid--column')).toBe(false);
        });
      });

      describe('When `default` is provided with non expected direction value', () => {
        beforeEach(async () => {
          await wrapper.setProps({ direction: { default: 'roww' } });
        });

        it('should do not add inexistent direction class', () => {
          expect(wrapper.classes().includes('d-stack--roww')).toBe(false);
        });
      });
    });
  });

  describe('When `as` prop is provided', () => {
    beforeEach(async () => {
      await wrapper.setProps({ as: 'section' });
    });

    it('should use it as the HTML element of stack', () => {
      expect(wrapper.element.tagName).toBe('SECTION');
    });
  });

  describe('When `gap` prop is provided as', () => {
    describe('valid value', () => {
      beforeEach(async () => {
        await wrapper.setProps({ gap: '300' });
      });

      it('should set proper gap class', () => {
        expect(wrapper.classes().includes('d-stack--gap-300')).toBe(true);
      });
    });

    describe('non valid value', () => {
      beforeEach(async () => {
        await wrapper.setProps({ gap: '123' });
      });

      it('should not set gap class', () => {
        expect(wrapper.classes().includes('d-stack--gap-123')).toBe(false);
      });
    });
  });
});
