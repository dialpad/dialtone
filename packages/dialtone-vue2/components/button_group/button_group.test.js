import { createLocalVue, mount } from '@vue/test-utils';
import DtButtonGroup from './button_group.vue';
import { DtButton } from '../button';
import ButtonsFixture from './buttons_decorator.vue';

const MOCK_DEFAULT_PROP = DtButtonGroup.props.alignment;

const baseSlots = {};

let mockSlots = {};
const testContext = {};

describe('DtButtonGroup Tests', () => {
  let wrapper;
  let buttonGroup;

  const updateWrapper = () => {
    wrapper = mount(DtButtonGroup, {
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    buttonGroup = wrapper.find('.d-btn-group');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('should have a button group', () => {
        expect(buttonGroup.exists()).toBe(true);
      });

      it('should not have buttons', () => {
        expect(wrapper.findAllComponents(DtButton).length).toBe(0);
      });
    });

    describe('When buttons are provided', () => {
      describe('When the button group renders', () => {
        it('should have buttons', () => {
          mockSlots = { default: ButtonsFixture };

          updateWrapper();

          expect(wrapper.findAllComponents(DtButton).length).toBe(2);
        });
      });
    });

    describe('When alignment is set to end', () => {
      it('should have correct class', async () => {
        await wrapper.setProps({ alignment: 'end' });

        expect(buttonGroup.classes().includes('d-btn-group--end')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When rendered with default content', () => {
      it('shows correct role', () => {
        expect(buttonGroup.attributes('role')).toBe('group');
      });
    });
  });

  describe('Validation Tests', () => {
    describe('Alignment Validator', () => {
      describe('When provided alignment is in BUTTON_GROUP_ALIGNMENT', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_DEFAULT_PROP.validator(MOCK_DEFAULT_PROP.default)).toBe(true);
        });
      });

      describe('When provided alignment is not in BUTTON_GROUP_ALIGNMENT', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_DEFAULT_PROP.validator(`INVALID_ALIGNMENT`)).toBe(false);
        });
      });
    });
  });
});
