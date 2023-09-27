import { createLocalVue, mount } from '@vue/test-utils';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import { RADIO_INPUT_VALIDATION_CLASSES } from './radio_constants';
import DtRadio from './radio.vue';

const MOCK_VALUE = 'Value';
const MOCK_GROUP_NAME = 'radioGroup';

const baseProps = {
  label: 'My Radio Label',
  value: MOCK_VALUE,
};
const baseSlots = {};
const baseAttrs = {};
const baseListeners = {};
const baseProvide = {};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};
let mockProvide = {};
let mockListeners = {};
const testContext = {};

describe('DtRadio Tests', () => {
  let wrapper;
  let input;

  const updateWrapper = () => {
    wrapper = mount(DtRadio, {
      propsData: { ...baseProps, ...mockProps },
      slots: { ...baseSlots, ...mockSlots },
      attrs: { ...baseAttrs, ...mockAttrs },
      provide: { ...baseProvide, ...mockProvide },
      listeners: { ...baseListeners, ...mockListeners },
      localVue: testContext.localVue,
    });

    input = wrapper.find('input');
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
    mockAttrs = {};
    mockListeners = {};
    mockProvide = {};
  });

  describe('Presentation Tests', () => {
    describe('When the radio renders', () => {
      it('should exist', () => {
        expect(wrapper.exists()).toBeTruthy();
      });

      it('should have radio group class', () => {
        expect(wrapper.find('.d-radio-group').exists()).toBeTruthy();
      });

      describe('Radio Input Tests', () => {
        it('should exist', () => {
          expect(input.exists()).toBeTruthy();
        });

        it('should have type radio', () => {
          expect(input.attributes('type')).toBe('radio');
        });

        it('should not be checked', () => {
          expect(input.element.checked).toBe(false);
        });
      });

      describe('Radio Label Tests', () => {
        let radioLabel;

        beforeEach(() => {
          radioLabel = wrapper.find('[data-qa="radio-label"]');
        });

        it('should exist', () => {
          expect(radioLabel.exists()).toBeTruthy();
        });

        it('should match provided label prop', () => {
          expect(radioLabel.text()).toBe(baseProps.label);
        });
      });
    });

    describe('When a description is provided', () => {
      it('should exist', () => {
        mockProps = { description: 'Description' };

        updateWrapper();

        const radioDescription = wrapper.find('[data-qa="radio-description"]');

        expect(radioDescription.exists()).toBeTruthy();
      });
    });

    describe('When a validation state is provided', () => {
      describe('When warning', () => {
        it('has validation classes', () => {
          mockProps = { description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.WARNING };

          updateWrapper();

          expect(wrapper.find(`.${RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]}`).exists()).toBe(true);
        });
      });

      describe('When error', () => {
        it('has validation classes', () => {
          mockProps = { description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.ERROR };

          updateWrapper();

          expect(wrapper.find(`.${RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.ERROR]}`).exists()).toBe(true);
        });
      });

      describe('When success', () => {
        it('has validation classes', () => {
          mockProps = { description: 'Description', validationState: VALIDATION_MESSAGE_TYPES.SUCCESS };

          updateWrapper();

          expect(wrapper.find(`.${RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.SUCCESS]}`).exists()).toBe(true);
        });
      });
    });

    describe('When checked', () => {
      it('should be checked', () => {
        mockProps = { checked: true };

        updateWrapper();

        expect(input.element.checked).toBe(true);
      });
    });

    describe('When disabled', () => {
      beforeEach(() => {
        mockProps = { disabled: true };

        updateWrapper();
      });

      it('should disable input', () => {
        expect(input.element.disabled).toBe(true);
      });

      it('should have disabled class', () => {
        expect(wrapper.find('.d-radio-group--disabled').exists()).toBeTruthy();
      });

      describe('When clicked', () => {
        it('no events are emitted', async () => {
          await wrapper.trigger('click');

          expect(wrapper.emitted()).toEqual({});
        });
      });
    });

    describe('When slot(s) are provided', () => {
      const MOCK_SLOT_LABEL = 'My Slotted Label';
      const MOCK_SLOT_DESCRIPTION = 'My Slotted Description';

      describe('When a slotted label is provided', () => {
        it('should have slotted label', () => {
          mockSlots = { default: MOCK_SLOT_LABEL };

          updateWrapper();

          const labelSlotContainer = wrapper.find('[data-qa="radio-label"]');

          expect(labelSlotContainer.text()).toBe(MOCK_SLOT_LABEL);
        });
      });

      describe('When a slotted description is provided', () => {
        it('should have slotted description', () => {
          mockSlots = { description: MOCK_SLOT_DESCRIPTION };

          updateWrapper();

          const descriptionSlotContainer = wrapper.find('[data-qa="radio-description"]');

          expect(descriptionSlotContainer.text()).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });

      describe('When slotted label and description are provided', () => {
        it('should have slotted label', () => {
          mockSlots = { default: MOCK_SLOT_LABEL };

          updateWrapper();

          const labelSlotContainer = wrapper.find('[data-qa="radio-label"]');

          expect(labelSlotContainer.text()).toBe(MOCK_SLOT_LABEL);
        });

        it('should have slotted description', () => {
          mockSlots = { description: MOCK_SLOT_DESCRIPTION };

          updateWrapper();

          const descriptionSlotContainer = wrapper.find('[data-qa="radio-description"]');

          expect(descriptionSlotContainer.text()).toBe(MOCK_SLOT_DESCRIPTION);
        });
      });
    });

    describe('Extendability Tests', () => {
      let MOCK_ELEMENT;
      const MOCK_PROP_NAME = 'some';
      const MOCK_PROP_VALUE = 'prop';

      describe('When an input class is provided', () => {
        it('should apply custom class to child', () => {
          mockProps = {
            label: 'Label',
            description: 'Description',
            inputClass: 'my-custom-class',
          };

          updateWrapper();

          MOCK_ELEMENT = wrapper.find('input');

          expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
        });
      });

      describe('When an label class is provided', () => {
        it('should apply custom class to child', () => {
          mockProps = {
            label: 'Label',
            description: 'Description',
            labelClass: 'my-custom-class',
          };

          updateWrapper();

          MOCK_ELEMENT = wrapper.find('[data-qa="radio-label"]');

          expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
        });
      });

      describe('When an description class is provided', () => {
        it('should apply custom class to child', () => {
          mockProps = {
            label: 'Label',
            description: 'Description',
            descriptionClass: 'my-custom-class',
          };

          updateWrapper();

          MOCK_ELEMENT = wrapper.find('[data-qa="radio-description"]');

          expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
        });
      });

      describe('When label child props are provided', () => {
        it('should have provided child prop', () => {
          mockProps = {
            label: 'Label',
            description: 'Description',
            labelChildProps: {
              some: 'prop',
            },
          };

          updateWrapper();

          MOCK_ELEMENT = wrapper.find('[data-qa="radio-label"]');

          expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
        });
      });

      describe('When description child props are provided', () => {
        it('should have provided child prop', () => {
          mockProps = {
            label: 'Label',
            description: 'Description',
            descriptionChildProps: {
              some: 'prop',
            },
          };

          updateWrapper();

          MOCK_ELEMENT = wrapper.find('[data-qa="radio-description"]');

          expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
        });
      });

      describe('When attrs are provided', () => {
        it('should have provided child prop', () => {
          mockAttrs = { some: 'prop' };

          updateWrapper();

          MOCK_ELEMENT = input;

          expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    describe('Custom Event Tests', () => {
      describe('When the radio is selected', () => {
        it('should emit the input event with Value', async () => {
          await input.trigger('change');

          expect(wrapper.emitted('input')[0][0]).toBe(MOCK_VALUE);
        });
      });
    });

    describe('Listener Tests', () => {
      describe('When there is a provided input listener', () => {
        describe('When the radio is clicked', () => {
          it('Should call input handler once', async () => {
            const MOCK_INPUT_LISTENER_SPY = vi.fn();

            mockListeners = { input: MOCK_INPUT_LISTENER_SPY };

            updateWrapper();

            await input.trigger('change');

            expect(MOCK_INPUT_LISTENER_SPY).toHaveBeenCalledTimes(1);
          });
        });
      });
    });
  });

  describe('When there is a Radio Group Context', () => {
    describe('When the value matches the Radio', () => {
      beforeEach(() => {
        mockProvide = {
          groupContext: {
            name: MOCK_GROUP_NAME,
            selectedValue: MOCK_VALUE,
            disabled: false,
            validationState: null,
          },
        };

        mockProps = {
          description: 'Description',
        };

        updateWrapper();
      });

      it('sets the input name', () => {
        expect(input.attributes('name')).toBe(MOCK_GROUP_NAME);
      });

      it('should be checked', () => {
        expect(input.element.checked).toBe(true);
      });

      describe('When the radio group is disabled', () => {
        describe('When the radio is clicked', () => {
          it('no events are emitted', async () => {
            mockProvide = {
              groupContext: {
                name: MOCK_GROUP_NAME,
                selectedValue: MOCK_VALUE,
                disabled: true,
                validationState: null,
              },
            };

            mockProps = {
              description: 'Description',
            };

            updateWrapper();

            await wrapper.trigger('click');

            expect(wrapper.emitted()).toEqual({});
          });
        });
      });

      describe('When the radio group has a validation state', () => {
        it('has validation classes', () => {
          mockProvide = {
            groupContext: {
              name: MOCK_GROUP_NAME,
              selectedValue: MOCK_VALUE,
              disabled: false,
              validationState: VALIDATION_MESSAGE_TYPES.SUCCESS,
            },
          };

          mockProps = {
            description: 'Description',
          };

          updateWrapper();

          expect(wrapper.find(`.${RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.SUCCESS]}`).exists()).toBe(true);
        });

        describe('When the radio has a validation state', () => {
          it('has validation classes', () => {
            mockProvide = {
              groupContext: {
                name: MOCK_GROUP_NAME,
                selectedValue: MOCK_VALUE,
                disabled: false,
                validationState: VALIDATION_MESSAGE_TYPES.WARNING,
              },
            };

            mockProps = {
              description: 'Description',
            };

            updateWrapper();

            expect(wrapper.find(`.${RADIO_INPUT_VALIDATION_CLASSES[VALIDATION_MESSAGE_TYPES.WARNING]}`).exists()).toBe(true);
          });
        });
      });
    });

    describe('When the value does not match the Radio', () => {
      beforeEach(() => {
        mockProvide = {
          groupContext: {
            name: MOCK_GROUP_NAME,
            selectedValue: `not${MOCK_VALUE}`,
            disabled: false,
            validationState: null,
          },
        };

        mockProps = {
          description: 'Description',
        };

        updateWrapper();
      });

      it('sets the input name', () => {
        expect(input.attributes('name')).toBe(MOCK_GROUP_NAME);
      });

      it('should not be checked', () => {
        expect(input.element.checked).toBe(false);
      });
    });
  });
});
