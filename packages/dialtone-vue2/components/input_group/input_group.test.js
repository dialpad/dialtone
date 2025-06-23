import { createLocalVue, mount } from '@vue/test-utils';
import { DtValidationMessages } from '../validation_messages';
import InputFixture from './decorators/input.vue';
import InputsFixture from './decorators/inputs.vue';
import DtInputGroup from './input_group.vue';

const baseProps = {
  name: 'my-input-group',
};
const baseAttrs = {
  'aria-label': 'Test Input Group',
};
const baseSlots = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};
const testContext = {};

describe('Input Group Tests', () => {
  let wrapper;
  let inputGroup;
  let inputGroupLegend;
  let inputGroupMessages;

  const updateWrapper = () => {
    wrapper = mount(DtInputGroup, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    inputGroup = wrapper.find('[data-qa="input-group"]');
    inputGroupLegend = wrapper.find('[data-qa="input-group-legend"]');
    inputGroupMessages = wrapper.find('[data-qa="input-group-messages"]');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('should have a input group', () => {
        expect(inputGroup.exists()).toBe(true);
      });

      it('should not have a legend', () => {
        expect(inputGroupLegend.exists()).toBe(false);
      });

      it('should not have inputs', () => {
        expect(wrapper.findAllComponents(InputFixture).length).toBe(0);
      });

      it('should not have validation messages', () => {
        expect(wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length).toBe(0);
      });
    });

    describe('When inputs are provided', () => {
      describe('When the input group renders', () => {
        it('should have inputs', () => {
          mockSlots = { default: InputsFixture };

          updateWrapper();

          expect(wrapper.findAllComponents(InputFixture).length).toBe(3);
        });
      });
    });

    describe('When a legend is provided via prop', () => {
      beforeEach(() => {
        mockProps = { legend: 'My Legend' };

        updateWrapper();
      });

      it('should have a legend', () => {
        expect(inputGroupLegend.exists()).toBe(true);
      });

      it('should have text matching the provided legend', () => {
        expect(inputGroupLegend.text()).toBe('My Legend');
      });
    });

    describe('When a legend is provided via slot', () => {
      describe('When a legend is not provided via prop', () => {
        beforeEach(() => {
          mockProps = { legend: 'My Legend' };

          updateWrapper();
        });

        it('should have a legend', () => {
          expect(inputGroupLegend.exists()).toBe(true);
        });

        it('should have text matching the provided legend', () => {
          expect(inputGroupLegend.text()).toBe('My Legend');
        });
      });

      describe('When a legend is also provided via prop', () => {
        beforeEach(() => {
          mockProps = { legend: 'A legend which should not be displayed' };

          updateWrapper();
        });

        it('should have a legend', () => {
          expect(inputGroupLegend.exists()).toBe(true);
        });

        it('should have text matching the provided legend', () => {
          expect(inputGroupLegend.text()).toBe('A legend which should not be displayed');
        });
      });
    });

    describe('When validation messages are provided', () => {
      beforeEach(() => {
        mockProps = { messages: ['Error'] };

        updateWrapper();
      });

      describe('When the validation messages are shown', () => {
        it('should have validation messages', () => {
          expect(inputGroupMessages?.props('validationMessages').length).toBe(1);
        });

        it('should show validation messages', () => {
          expect(inputGroupMessages?.props('showMessages')).toBe(true);
        });
      });

      describe('When the validation messages are hidden', () => {
        beforeEach(async () => {
          await wrapper.setProps({ showMessages: false });
        });

        it('should have validation messages', () => {
          expect(inputGroupMessages?.props('validationMessages').length).toBe(1);
        });

        it('should hide validation messages', () => {
          expect(inputGroupMessages?.props('showMessages')).toBe(false);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    const MOCK_SELECTED_VALUE = 'apple';

    const _selectInput = async (value) => {
      await inputGroup.find(`[value="${value}"]`).trigger('change');
    };

    beforeEach(() => {
      mockSlots = { default: InputsFixture };

      updateWrapper();
    });

    describe('When an initial value is provided', () => {
      describe('When an input is not selected', () => {
        it('updates provide object value', () => {
          mockProps = { value: 'other' };

          updateWrapper();

          expect(wrapper.vm.provideObj?.value).toBe('other');
        });
      });

      describe('When an input is selected', () => {
        beforeEach(async () => {
          await _selectInput(MOCK_SELECTED_VALUE);
        });

        it('updates provide object value', () => {
          expect(wrapper.vm.provideObj?.value).toBe(MOCK_SELECTED_VALUE);
        });

        it('should emit input event', () => {
          expect(wrapper.emitted('input')[0][0]).toBe(MOCK_SELECTED_VALUE);
        });
      });
    });

    describe('When an input is selected', () => {
      beforeEach(async () => {
        await _selectInput(MOCK_SELECTED_VALUE);
      });

      it('updates provide object value', () => {
        expect(wrapper.vm.provideObj?.value).toBe(MOCK_SELECTED_VALUE);
      });

      it('should emit input event', () => {
        expect(wrapper.emitted('input')[0][0]).toBe(MOCK_SELECTED_VALUE);
      });
    });

    describe('When the input group is disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };

        updateWrapper();
      });

      it('updates provide object disabled', () => {
        expect(wrapper.vm.provideObj?.disabled).toBe(true);
      });

      describe('When an input is selected', () => {
        it('does not emit an input event', async () => {
          await _selectInput(MOCK_SELECTED_VALUE);

          expect(wrapper.emitted()).toEqual({});
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    let MOCK_ELEMENT;
    const MOCK_CUSTOM_CLASS = 'my-custom-class';
    const MOCK_PROP_NAME = 'some';
    const MOCK_PROP_VALUE = 'prop';
    const MOCK_CHILD_PROPS = {};

    beforeAll(() => {
      MOCK_CHILD_PROPS[MOCK_PROP_NAME] = MOCK_PROP_VALUE;
    });

    beforeEach(() => {
      mockProps = {
        legend: 'My Legend',
        messages: ['Error'],
      };

      updateWrapper();
    });

    describe('When a legend class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { ...mockProps, legendClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="input-group-legend"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When a messages class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { ...mockProps, messagesClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="input-group-messages"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When legend child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { ...mockProps, legendChildProps: MOCK_CHILD_PROPS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="input-group-legend"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When messages child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { ...mockProps, messagesChildProps: MOCK_CHILD_PROPS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="input-group-messages"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        mockAttrs = { some: 'prop' };

        updateWrapper();

        MOCK_ELEMENT = inputGroup;

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('QA Label Tests', () => {
      const MOCK_CUSTOM_QA_LABEL = 'custom-data-qa-label';

      describe('When a custom data-qa group label is provided', () => {
        it('should have applied custom qa label', async () => {
          await wrapper.setProps({ dataQaGroup: MOCK_CUSTOM_QA_LABEL });

          expect(wrapper.find(`[data-qa="${MOCK_CUSTOM_QA_LABEL}"]`).exists()).toBe(true);
        });
      });

      describe('When a custom data-qa group legend label is provided', () => {
        it('should have applied custom qa label', async () => {
          await wrapper.setProps({ dataQaGroupLegend: MOCK_CUSTOM_QA_LABEL });

          expect(wrapper.find(`[data-qa="${MOCK_CUSTOM_QA_LABEL}"]`).exists()).toBe(true);
        });
      });

      describe('When a custom data-qa group messages label is provided', () => {
        it('should have applied custom qa label', async () => {
          await wrapper.setProps({ dataQaGroupMessages: MOCK_CUSTOM_QA_LABEL });

          expect(wrapper.find(`[data-qa="${MOCK_CUSTOM_QA_LABEL}"]`).exists()).toBe(true);
        });
      });
    });
  });
});
