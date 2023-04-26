import { createLocalVue, shallowMount, mount } from '@vue/test-utils';
import { DtValidationMessages } from '../validation_messages';
import { DtRadio } from '../radio';
import DtRadioGroup from './radio_group.vue';
import RadiosFixture from '../../tests/fixtures/radios.vue';

// Test Constants
const baseGroupName = 'test-radio-group';
const basePropsData = {
  name: baseGroupName,
  value: '',
};
const baseAttrs = { 'aria-label': 'Test Radio Group' };

describe('DtRadioGroup Tests', () => {
  let testContext;

  beforeAll(() => {
    testContext = {};
  });

  // Wrappers
  let wrapper;
  let radioGroup;
  let radioGroupLegend;

  // Test Environment
  let propsData = basePropsData;
  let attrs = baseAttrs;
  let slots = {};

  // Helpers
  const _setChildWrappers = () => {
    radioGroup = wrapper.find('[data-qa="radio-group"]');
    radioGroupLegend = wrapper.find('[data-qa="radio-group-legend"]');
  };

  const _setWrappers = () => {
    wrapper = shallowMount(DtRadioGroup, {
      propsData,
      slots,
      attrs,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  const _mountWrappers = () => {
    wrapper = mount(DtRadioGroup, {
      propsData,
      slots,
      attrs,
      localVue: testContext.localVue,
    });
    _setChildWrappers();
  };

  // Test Setup
  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

  // Test Teardown
  afterEach(() => {
    propsData = basePropsData;
    attrs = baseAttrs;
    slots = {};
  });

  describe('Presentation Tests', () => {
    // Test Environment
    let legend;

    // Shared Examples
    const itBehavesLikeHasRadioGroup = () => {
      it(
        'should have a radio group',
        () => { expect(radioGroup.exists()).toBe(true); },
      );
    };

    const itBehavesLikeDoesNotHaveLegend = () => {
      it(
        'should not have a legend',
        () => { expect(radioGroupLegend.exists()).toBe(false); },
      );
    };

    const itBehavesLikeHasLegend = () => {
      it(
        'should have a legend',
        () => { expect(radioGroupLegend.exists()).toBe(true); },
      );
      it('should have text matching the provided legend', () => {
        expect(radioGroupLegend.text()).toBe(legend);
      });
    };

    const itBehavesLikeDoesNotHaveRadios = () => {
      it('should not have radios', () => {
        expect(wrapper.findAllComponents(DtRadio).length).toBe(0);
      });
    };

    const itBehavesLikeHasRadios = (numRadios) => {
      it('should have radios', () => {
        expect(wrapper.findAllComponents(DtRadio).length).toBe(numRadios);
      });
    };

    const itBehavesLikeDoesNotHaveValidationMessages = () => {
      it('should not have validation messages', () => {
        expect(
          wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length,
        ).toBe(0);
      });
    };

    const itBehavesLikeHasValidationMessages = (numMessages) => {
      it('should have validation messages', () => {
        expect(
          wrapper.findComponent(DtValidationMessages)?.props('validationMessages').length,
        ).toBe(numMessages);
      });
    };

    describe('When the radio group renders', () => {
      // Test Setup
      beforeEach(() => { _setWrappers(); });

      itBehavesLikeHasRadioGroup();
      itBehavesLikeDoesNotHaveLegend();
      itBehavesLikeDoesNotHaveRadios();
      itBehavesLikeDoesNotHaveValidationMessages();
    });

    describe('When a legend is provided', () => {
      // Test Setup
      beforeEach(() => {
        legend = 'My Legend';
      });

      describe('When the legend is provided via prop', () => {
        // Test Setup
        beforeEach(() => {
          propsData = { ...basePropsData, legend };
        });

        describe('When the radio group renders', () => {
          // Test Setup
          beforeEach(() => { _setWrappers(); });

          itBehavesLikeHasLegend();
        });
      });

      describe('When the legend is provided via slot', () => {
        // Test Setup
        beforeEach(() => {
          slots = { legend };
        });

        describe('When the radio group renders', () => {
          // Test Setup
          beforeEach(() => { _setWrappers(); });

          itBehavesLikeHasLegend();
        });
      });
    });

    describe('When radios are provided', () => {
      // Test Setup
      beforeEach(() => {
        slots = { default: RadiosFixture };
      });

      describe('When the radio group renders', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        itBehavesLikeHasRadios(2);
      });
    });

    describe('When validation messages are provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, messages: ['Error'] };
      });

      describe('When the radio group renders', () => {
        // Test Setup
        beforeEach(() => { _setWrappers(); });

        itBehavesLikeHasValidationMessages(1);
      });
    });
  });

  describe('Reactivity Tests', () => {
    // Wrappers
    let selectedRadio;

    // Test Environment
    const selectedValue = 'kiwi';

    // Helpers
    const _selectRadio = async () => {
      selectedRadio = radioGroup.find(`[value="${selectedValue}"]`);
      await selectedRadio.trigger('change');
    };

    beforeEach(() => {
      slots = { default: RadiosFixture };
    });

    describe('When an initial value is provided', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, value: selectedValue };
        _setWrappers();
      });

      it('updates provide object', () => {
        expect(wrapper.vm.provideObj.selectedValue).toBe(selectedValue);
      });
    });

    describe('When a radio is selected', () => {
      // Test Setup
      beforeEach(async () => {
        _mountWrappers();
        await _selectRadio();
      });

      it('emits an input event', () => {
        expect(wrapper.emitted('input')[0][0]).toBe(selectedValue);
      });
    });

    describe('When the radio group is disabled', () => {
      // Test Setup
      beforeEach(() => {
        propsData = { ...basePropsData, disabled: true };
        _mountWrappers();
      });

      describe('When a radio is selected', () => {
        // Test Setup
        beforeEach(() => { _selectRadio(); });

        it('does not emit an input event', () => {
          expect(wrapper.emitted('input')).toBeFalsy();
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    let element;
    const customClass = 'my-custom-class';
    const propName = 'some';
    const propValue = 'prop';
    const childProps = {};

    // Helpers
    const _setupChildClassTest = (childClassName, selector) => {
      propsData[childClassName] = customClass;
      _setWrappers();
      element = wrapper.find(selector);
    };

    const _setupChildPropsTest = (childPropsName, selector) => {
      propsData[childPropsName] = childProps;
      _setWrappers();
      element = wrapper.find(selector);
    };

    // Shared Examples
    const itBehavesLikeAppliesClassToChild = () => {
      it('should apply custom class to child', () => {
        expect(wrapper.find(`.${customClass}`).html()).toBe(element.html());
      });
    };

    const itBehavesLikeAppliesChildProp = () => {
      it('should have provided child prop', () => {
        expect(element.attributes(propName)).toBe(propValue);
      });
    };

    // Test Setup
    beforeAll(() => {
      childProps[propName] = propValue;
    });

    beforeEach(() => {
      propsData = { ...basePropsData, legend: 'My Radio Group' };
    });

    describe('When a legend class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('legendClass', '[data-qa="radio-group-legend"]'); },
      );
      itBehavesLikeAppliesClassToChild();
    });

    describe('When a messages class is provided', () => {
      beforeEach(
        () => { _setupChildClassTest('messagesClass', '[data-qa="radio-group-messages"]'); },
      );
      itBehavesLikeAppliesClassToChild();
    });

    describe('When legendChildProps are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('legendChildProps', '[data-qa="radio-group-legend"]'); },
      );
      itBehavesLikeAppliesChildProp();
    });

    describe('When messagesChildProps are provided', () => {
      beforeEach(
        () => { _setupChildPropsTest('messagesChildProps', '[data-qa="radio-group-messages"]'); },
      );
      itBehavesLikeAppliesChildProp();
    });

    describe('When attrs are provided', () => {
      // Test Setup
      beforeEach(() => {
        attrs = { ...baseAttrs, some: 'prop' };
        _setWrappers();
        element = radioGroup;
      });

      itBehavesLikeAppliesChildProp();
    });
  });
});
