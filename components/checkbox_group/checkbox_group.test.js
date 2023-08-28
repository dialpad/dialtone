import { flushPromises } from '@/common/utils';
import { mount } from '@vue/test-utils';
import { DtValidationMessages } from '../validation_messages';
import { DtCheckbox } from '../checkbox';
import CheckboxesFixture from './checkboxes_decorator.vue';
import DtCheckboxGroup from './checkbox_group.vue';

const MOCK_LEGEND = 'My Legend';
const MOCK_SELECTED_VALUE = 'apple';
const MOCK_SELECTED_VALUE2 = 'other';

const baseProps = { name: 'test-checkbox-group' };
const baseSlots = {};
const baseAttrs = { 'aria-label': 'Test Checkbox Group' };

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};
describe('Checkbox Group Tests', () => {
  let wrapper;
  let checkboxGroup;
  let checkboxGroupLegend;
  let checkboxGroupMessages;

  const updateWrapper = () => {
    wrapper = mount(DtCheckboxGroup, {
      props: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attrs: { ...baseAttrs, ...mockAttrs },
    });

    checkboxGroup = wrapper.find('[data-qa="checkbox-group"]');
    checkboxGroupLegend = wrapper.find('[data-qa="checkbox-group-legend"]');
    checkboxGroupMessages = wrapper.find('[data-qa="checkbox-group-messages"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockSlots = {};
    mockAttrs = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with default content', () => {
      it('should have a checkbox group', () => {
        expect(checkboxGroup.exists()).toBe(true);
      });

      it('should not have a legend', () => {
        expect(checkboxGroupLegend.exists()).toBe(false);
      });

      it('should not have checkboxes', () => {
        expect(wrapper.findAllComponents(DtCheckbox).length).toBe(0);
      });

      it('should not have validation messages', () => {
        expect(wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length).toBe(0);
      });
    });

    describe('When checkboxes are provided', () => {
      describe('When the checkbox group renders', () => {
        it('should have checkboxes', () => {
          mockSlots = { default: CheckboxesFixture };

          updateWrapper();

          expect(wrapper.findAllComponents(DtCheckbox).length).toBe(3);
        });
      });
    });

    describe('When a legend is provided via prop', () => {
      beforeEach(() => {
        mockProps = { legend: MOCK_LEGEND };

        updateWrapper();
      });

      it('should have a legend', () => {
        expect(checkboxGroupLegend.exists()).toBe(true);
      });

      it('should have text matching the provided legend', () => {
        expect(checkboxGroupLegend.text()).toBe(MOCK_LEGEND);
      });
    });

    describe('When a legend is provided via slot', () => {
      beforeEach(() => {
        mockSlots = { legend: MOCK_LEGEND };

        updateWrapper();
      });

      describe('When a legend is not provided via prop', () => {
        it('should have a legend', () => {
          expect(checkboxGroupLegend.exists()).toBe(true);
        });

        it('should have text matching the provided legend', () => {
          expect(checkboxGroupLegend.text()).toBe(MOCK_LEGEND);
        });
      });

      describe('When a legend is also provided via prop', () => {
        beforeEach(() => {
          mockProps = { legend: 'A legend which should not be displayed' };

          updateWrapper();
        });

        it('should have a legend', () => {
          expect(checkboxGroupLegend.exists()).toBe(true);
        });

        it('should have text matching the provided legend', () => {
          expect(checkboxGroupLegend.text()).toBe(MOCK_LEGEND);
        });
      });
    });

    describe('When validation messages are provided', () => {
      beforeEach(() => {
        mockProps = { messages: ['Error'] };

        updateWrapper();
      });

      describe('When the validation messages are shown', () => {
        it('should show validation messages', () => {
          const validationMessage = wrapper.find('[data-qa="checkbox-group-messages"]');

          expect(validationMessage.exists()).toBe(true);
        });
      });

      describe('When the validation messages are hidden', () => {
        it('should hide validation messages', () => {
          mockProps = { ...mockProps, showMessages: false };

          updateWrapper();

          expect(checkboxGroupMessages.exists()).toBe(false);
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    const MOCK_SELECTED_CHECKBOX_FUNCTION = async (value) => {
      const selectedCheckbox = checkboxGroup.find(`[value="${value}"]`);
      selectedCheckbox.element.checked = true;
      await selectedCheckbox.trigger('change');
      await flushPromises();
    };

    beforeEach(async () => {
      mockSlots = { default: CheckboxesFixture };

      updateWrapper();
    });

    describe('When initial selected values are provided', () => {
      beforeEach(() => {
        mockProps = { selectedValues: [MOCK_SELECTED_VALUE] };

        updateWrapper();
      });

      describe('When another checkbox is not selected', () => {
        it('should update provide object', () => {
          [MOCK_SELECTED_VALUE].forEach(value => {
            expect(wrapper.vm.provideObj?.selectedValues?.includes(value)).toBe(true);
          });
        });
      });

      describe('When another checkbox is selected', () => {
        beforeEach(async () => {
          await MOCK_SELECTED_CHECKBOX_FUNCTION(MOCK_SELECTED_VALUE2);
        });

        it('should update provide object', () => {
          [MOCK_SELECTED_VALUE, MOCK_SELECTED_VALUE2].forEach(value => {
            expect(wrapper.vm.provideObj?.selectedValues?.includes(value)).toBe(true);
          });
        });

        it('Should emit an input event', () => {
          expect(wrapper.emitted('input')[0][0]).toEqual([MOCK_SELECTED_VALUE, MOCK_SELECTED_VALUE2]);
        });
      });
    });

    describe('When a checkbox is selected', () => {
      beforeEach(async () => {
        await MOCK_SELECTED_CHECKBOX_FUNCTION(MOCK_SELECTED_VALUE);
      });

      it('should update provide object', () => {
        [MOCK_SELECTED_VALUE].forEach(value => {
          expect(wrapper.vm.provideObj?.selectedValues?.includes(value)).toBe(true);
        });
      });

      it('should emit an input event', () => {
        expect(wrapper.emitted('input')[0][0]).toEqual([MOCK_SELECTED_VALUE]);
      });
    });

    describe('When the checkbox group is disabled', () => {
      describe('When a checkbox is selected', () => {
        it('does not emit an input event', () => {
          mockProps = { disabled: true };

          updateWrapper();

          MOCK_SELECTED_CHECKBOX_FUNCTION(MOCK_SELECTED_VALUE);

          expect(wrapper.emitted()).toEqual({});
        });
      });
    });
  });

  describe('Validation Tests', () => {
    const MOCK_PROP = DtCheckboxGroup.props.value;

    describe('When a value is not provided', () => {
      it('passes custom prop validation', () => {
        expect(MOCK_PROP.validator(undefined)).toBe(true);
      });
    });

    describe('When a value is provided', () => {
      it('fails custom prop validation', () => {
        expect(MOCK_PROP.validator('some value')).toBe(false);
      });
    });
  });

  describe('Extendability Tests', () => {
    let MOCK_ELEMENT;
    const MOCK_PROP_NAME = 'some';
    const MOCK_PROP_VALUE = 'prop';

    beforeEach(() => {
      mockProps = { legend: 'My Legend', messages: ['Error'] };

      updateWrapper();
    });

    describe('When a legend class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { ...mockProps, legendClass: 'my-custom-class' };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="checkbox-group-legend"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When a messages class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { ...mockProps, messagesClass: 'my-custom-class' };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="checkbox-group-messages"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When legend child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { ...mockProps, legendChildProps: { [MOCK_PROP_NAME]: MOCK_PROP_VALUE } };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="checkbox-group-legend"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When messages child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { ...mockProps, messagesChildProps: { [MOCK_PROP_NAME]: MOCK_PROP_VALUE } };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="checkbox-group-messages"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        mockAttrs = { some: 'prop' };

        updateWrapper();

        MOCK_ELEMENT = checkboxGroup;

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });
  });
});
