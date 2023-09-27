import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { DtValidationMessages } from '../validation_messages';
import { DtRadio } from '../radio';
import DtRadioGroup from './radio_group.vue';
import RadiosFixture from '../../tests/fixtures/radios.vue';

const MOCK_LEGEND = 'My Legend';
const MOCK_SELECTED_VALUE = 'kiwi';
let MOCK_ELEMENT;
const MOCK_CUSTOM_CLASS = 'my-custom-class';
const MOCK_PROP_NAME = 'some';
const MOCK_PROP_VALUE = 'prop';

const baseProps = {
  name: 'test-radio-group',
  value: '',
};
const baseAttrs = { 'aria-label': 'Test Radio Group' };
const baseSlots = {};

let mockProps = {};
let mockSlots = {};
let mockAttrs = {};
const testContext = {};

describe('DtRadioGroup Tests', () => {
  let wrapper;
  let radioGroup;
  let radioGroupLegend;

  const updateWrapper = () => {
    wrapper = shallowMount(DtRadioGroup, {
      propsData: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
      localVue: testContext.localVue,
    });

    radioGroup = wrapper.find('[data-qa="radio-group"]');
    radioGroupLegend = wrapper.find('[data-qa="radio-group-legend"]');
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
  });

  describe('Presentation Tests', () => {
    describe('When the radio group renders', () => {
      it('should have a radio group', () => {
        expect(radioGroup.exists()).toBe(true);
      });

      it('should not have a legend', () => {
        expect(radioGroupLegend.exists()).toBe(false);
      });

      it('should not have radios', () => {
        expect(wrapper.findAllComponents(DtRadio).length).toBe(0);
      });

      it('should not have validation messages', () => {
        expect(wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length).toBe(0);
      });
    });

    describe('When a legend is provided', () => {
      beforeEach(() => {
        mockProps = { legend: MOCK_LEGEND };

        updateWrapper();
      });

      describe('When the legend is provided via prop', () => {
        describe('When the radio group renders', () => {
          it('should have a legend', () => {
            radioGroupLegend = wrapper.find('[data-qa="radio-group-legend"]');

            expect(radioGroupLegend.exists()).toBe(true);
          });

          it('should have text matching the provided legend', () => {
            radioGroupLegend = wrapper.find('[data-qa="radio-group-legend"]');

            expect(radioGroupLegend.text()).toBe(MOCK_LEGEND);
          });
        });
      });

      describe('When the legend is provided via slot', () => {
        beforeEach(() => {
          mockSlots = { legend: MOCK_LEGEND };
        });

        describe('When the radio group renders', () => {
          it('should have a legend', () => {
            expect(radioGroupLegend.exists()).toBe(true);
          });

          it('should have text matching the provided legend', () => {
            expect(radioGroupLegend.text()).toBe(MOCK_LEGEND);
          });
        });
      });
    });

    describe('When radios are provided', () => {
      describe('When the radio group renders', () => {
        it('should have radios', () => {
          mockSlots = { default: RadiosFixture };

          updateWrapper();

          expect(wrapper.findAllComponents(DtRadio).length).toBe(2);
        });
      });
    });

    describe('When validation messages are provided', () => {
      describe('When the radio group renders', () => {
        it('should have validation messages', () => {
          mockProps = { messages: ['Error'] };

          updateWrapper();

          expect(wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length).toBe(1);
        });
      });
    });
  });

  describe('Reactivity Tests', () => {
    beforeEach(() => {
      mockSlots = { default: RadiosFixture };

      updateWrapper();
    });

    describe('When an initial value is provided', () => {
      it('updates provide object', () => {
        mockProps = { value: MOCK_SELECTED_VALUE };

        updateWrapper();

        expect(wrapper.vm.provideObj.selectedValue).toBe(MOCK_SELECTED_VALUE);
      });
    });

    describe('When a radio is selected', () => {
      it('emits an input event', async () => {
        const mountWrapper = mount(DtRadioGroup, {
          propsData: { ...baseProps, ...mockProps },
          attrs: { ...baseAttrs, ...mockAttrs },
          slots: { ...baseSlots, ...mockSlots },
          localVue: testContext.localVue,
        });

        const mountedRadioGroup = mountWrapper.find('[data-qa="radio-group"]');

        await mountedRadioGroup.find(`[value="${MOCK_SELECTED_VALUE}"]`).trigger('change');

        expect(mountWrapper.emitted('input')[0][0]).toBe(MOCK_SELECTED_VALUE);
      });
    });

    describe('When the radio group is disabled', () => {
      describe('When a radio is selected', () => {
        it('does not emit an input event', async () => {
          mockProps = { disabled: true };

          updateWrapper();

          await radioGroup.find(`[value="${MOCK_SELECTED_VALUE}"]`).trigger('change');

          expect(wrapper.emitted('input')).toBeFalsy();
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    describe('When a legend class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { legend: 'My Radio Group', legendClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="radio-group-legend"]');

        expect(wrapper.find(`.${MOCK_CUSTOM_CLASS}`).html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When a messages class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { legend: 'My Radio Group', messagesClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="radio-group-messages"]');

        expect(wrapper.find(`.${MOCK_CUSTOM_CLASS}`).html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When legendChildProps are provided', () => {
      it('should have provided child prop', () => {
        mockProps = {
          legend: 'My Radio Group',
          legendChildProps: { [MOCK_PROP_NAME]: MOCK_PROP_VALUE },
        };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="radio-group-legend"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When messagesChildProps are provided', () => {
      it('should have provided child prop', () => {
        mockProps = {
          legend: 'My Radio Group',
          messagesChildProps: { [MOCK_PROP_NAME]: MOCK_PROP_VALUE },
        };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="radio-group-messages"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When attrs are provided', () => {
      it('should have provided child prop', () => {
        mockAttrs = { [MOCK_PROP_NAME]: MOCK_PROP_VALUE };

        updateWrapper();

        MOCK_ELEMENT = radioGroup;

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });
  });
});
