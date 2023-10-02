import { mount } from '@vue/test-utils';
import {
  LABEL_SIZE_MODIFIERS,
  DESCRIPTION_SIZE_MODIFIERS,
} from '@/common/constants';
import {
  SELECT_SIZE_MODIFIERS,
  SELECT_STATE_MODIFIERS,
} from './select_menu_constants';
import DtSelectMenu from './select_menu.vue';

const MOCK_LABEL = 'Label';
const MOCK_DESCRIPTION = 'Description';
const MOCK_OPTIONS = [
  { value: 1, label: 'Option 1' },
  { value: 2, label: 'Option 2' },
  { value: 3, label: 'Option 3' },
];

const baseProps = {
  label: MOCK_LABEL,
  options: MOCK_OPTIONS,
};
const baseAttrs = {
  name: 'select-menu',
};
const baseSlots = {};

let mockProps = {};
let mockAttrs = {};
let mockSlots = {};

describe('DtSelectMenu Tests', () => {
  let wrapper;
  let selectWrapper;
  let select;
  let label;
  let description;
  let messages;

  const updateWrapper = () => {
    wrapper = mount(DtSelectMenu, {
      props: { ...baseProps, ...mockProps },
      attrs: { ...baseAttrs, ...mockAttrs },
      slots: { ...baseSlots, ...mockSlots },
    });

    select = wrapper.find('[data-qa="dt-select"]');
    selectWrapper = wrapper.find('[data-qa="dt-select-wrapper"]');
    label = wrapper.find('[data-qa="dt-select-label"]');
    description = wrapper.find('[data-qa="dt-select-description"]');
    messages = wrapper.find('[data-qa="dt-select-messages"]');
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    mockAttrs = {};
    mockSlots = {};
  });

  describe('Presentation Tests', () => {
    describe('When rendered with required content', () => {
      it('should render the provided label', () => {
        expect(label.text()).toBe(MOCK_LABEL);
      });

      it('should have no size variant classes on the label', () => {
        expect(label.classes().length).toBe(1);
      });

      it('should not render a description', () => {
        expect(description.exists()).toBe(false);
      });

      it('should render the select menu', () => {
        expect(select.exists()).toBe(true);
      });

      it('should have no size variant classes on select menu', () => {
        expect(selectWrapper.classes().length).toBe(1);
      });

      it('should have no kind variant classes on select menu input', () => {
        expect(select.classes().length).toBe(1);
      });

      it('should render the select menu options', () => {
        MOCK_OPTIONS.forEach(option => {
          expect(select.find(`[value="${option.value}"]`).exists()).toBeTruthy();
        });
      });
      it('should not render any validation messages', () => {
        expect(messages.exists()).toBe(false);
      });
    });

    describe('When a label is not provided', () => {
      it('should not render a label', () => {
        mockProps = { label: '', options: MOCK_OPTIONS };

        updateWrapper();

        label = wrapper.find('[data-qa="dt-select-label"]');

        expect(label.exists()).toBe(false);
      });
    });

    describe('When a label is provided via slot', () => {
      it('should render the slotted label', () => {
        mockSlots = { label: 'Slotted Label' };

        updateWrapper();

        expect(label.text()).toBe('Slotted Label');
      });
    });

    describe('When a description is provided via prop', () => {
      beforeEach(() => {
        mockProps = { description: MOCK_DESCRIPTION };

        updateWrapper();
      });

      it('should render the provided description', () => {
        expect(description.text()).toBe(MOCK_DESCRIPTION);
      });

      it('should have no size variant classes on the description', () => {
        expect(description.classes().length).toBe(1);
      });
    });

    describe('When a description is provided via slot', () => {
      it('should render the slotted description', () => {
        mockSlots = { description: 'Slotted Description' };

        updateWrapper();

        expect(description.text()).toBe('Slotted Description');
      });
    });

    describe('When options are provided via slot', () => {
      it('should render the select menu options', () => {
        mockSlots = { default: '<option value="1">Option 1</option><option value="2">Option 2</option>' };

        updateWrapper();

        expect(select.findAll('option').length).toBe(2);
      });
    });

    describe('When a size is provided', () => {
      const MOCK_SIZE = 'lg';

      beforeEach(() => {
        mockProps = {
          description: MOCK_DESCRIPTION,
          size: MOCK_SIZE,
        };

        updateWrapper();
      });

      it('should have size variant class on the label', () => {
        expect(label.classes(LABEL_SIZE_MODIFIERS[MOCK_SIZE])).toBe(true);
      });

      it('should have size variant class on the description', () => {
        expect(description.classes(DESCRIPTION_SIZE_MODIFIERS[MOCK_SIZE])).toBe(true);
      });

      it('should have size variant class on select menu', () => {
        expect(selectWrapper.classes(SELECT_SIZE_MODIFIERS[MOCK_SIZE])).toBe(true);
      });
    });

    describe('When validation messages are provided', () => {
      beforeEach(() => {
        mockProps = { messages: ['Validation Message'] };

        updateWrapper();
      });

      describe('When validation messages are shown', () => {
        it('should have error state class on select menu', () => {
          expect(select.classes(SELECT_STATE_MODIFIERS.error)).toBe(true);
        });

        it('should render validation message', () => {
          expect(messages?.findAll('[data-qa="validation-message"]').length).toBe(1);
        });
      });

      describe('When validation messages are hidden', () => {
        beforeEach(() => {
          mockProps = { ...mockProps, showMessages: false };

          updateWrapper();
        });

        it('should have error state class on select menu', () => {
          expect(select.classes(SELECT_STATE_MODIFIERS.error)).toBe(true);
        });

        it('should not render any validation messages', () => {
          expect(messages.exists()).toBe(false);
        });
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a description is provided', () => {
      it('label aria-details should match the id of the description', () => {
        mockProps = { description: MOCK_DESCRIPTION };

        updateWrapper();

        expect(label.attributes('aria-details')).toBe(description.attributes('id'));
      });
    });

    describe('When a description is not provided', () => {
      describe('When aria-details are not provided', () => {
        it('label aria-details should not exist', () => {
          expect(label.attributes('aria-details')).toBeFalsy();
        });
      });

      describe('When aria-details are provided', () => {
        it('label aria-details should match those provided by attrs', () => {
          mockAttrs = { 'aria-details': 'some-id' };

          updateWrapper();

          expect(label.attributes('aria-details')).toBe('some-id');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    describe('When select menu value has changed', () => {
      const MOCK_SELECTED_VALUE = MOCK_OPTIONS[1].value;

      beforeEach(() => {
        select.element.value = MOCK_SELECTED_VALUE;
        select.trigger('change');
      });

      it('should emit input event', () => {
        expect(wrapper.emitted('input')[0][0]).toBe(MOCK_SELECTED_VALUE.toString());
      });
      it('should emit change event', () => {
        expect(wrapper.emitted('change')[0][0]).toBe(MOCK_SELECTED_VALUE.toString());
      });
    });
  });

  describe('Validation Tests', () => {
    let consoleErrorSpy;
    let consoleWarnSpy;

    beforeEach(() => {
      consoleErrorSpy = vi.spyOn(console, 'error');
      consoleWarnSpy = vi.spyOn(console, 'warn');
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    describe('Size Validator', () => {
      const MOCK_PROP = DtSelectMenu.props.size;

      describe('When provided size is in SELECT_SIZE_MODIFIERS', () => {
        it('passes custom prop validation', () => {
          expect(MOCK_PROP.validator(MOCK_PROP.default)).toBe(true);
        });
      });

      describe('when provided size is not in SELECT_SIZE_MODIFIERS', () => {
        it('fails custom prop validation', () => {
          expect(MOCK_PROP.validator(`NOT${SELECT_SIZE_MODIFIERS.md}`)).toBe(false);
        });
      });
    });

    describe('Options Validation', () => {
      const MOCK_WARNING_MESSAGE = '[Vue warn]: Options are expected to be provided via prop or slot';

      describe('When options are provided via prop', () => {
        it('should not have expected warning message', () => {
          expect(console.warn).not.toBeCalledWith(MOCK_WARNING_MESSAGE);
        });

        describe('When updated options are empty', () => {
          it('should have expected warning message', () => {
            mockProps = { options: [] };

            updateWrapper();

            expect(console.warn.mock.calls.length).toBeGreaterThan(0);
            expect(console.warn.mock.calls[0]).toContain(MOCK_WARNING_MESSAGE);
          });
        });
      });

      describe('When options are provided via slot', () => {
        it('should not have expected warning message\'', () => {
          mockProps = { options: undefined };
          mockSlots = { default: '<option value="1">Option 1</option><option value="2">Option 2</option>' };

          updateWrapper();

          expect(console.warn).not.toBeCalledWith(MOCK_WARNING_MESSAGE);
        });
      });

      describe('When options are not provided', () => {
        it('should have expected warning message', () => {
          mockProps = { options: undefined };

          updateWrapper();

          expect(console.warn.mock.calls.length).toBeGreaterThan(0);
          expect(console.warn.mock.calls[0]).toContain(MOCK_WARNING_MESSAGE);
        });
      });
    });
  });

  describe('Extendability Tests', () => {
    let MOCK_ELEMENT;
    const MOCK_CUSTOM_CLASS = 'my-custom-class';
    const MOCK_PROP_NAME = 'some';
    const MOCK_PROP_VALUE = 'prop';

    describe('When a label class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { description: MOCK_DESCRIPTION, labelClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="dt-select-label"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When a description class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { description: MOCK_DESCRIPTION, descriptionClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="dt-select-description"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When a select class is provided', () => {
      it('should apply custom class to child', () => {
        mockProps = { description: MOCK_DESCRIPTION, selectClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="dt-select-wrapper"]');

        expect(wrapper.find('.my-custom-class').html()).toBe(MOCK_ELEMENT.html());
      });
    });

    describe('When an option class is provided', () => {
      it('should apply child class to each option', () => {
        mockProps = { optionClass: MOCK_CUSTOM_CLASS };

        updateWrapper();

        const options = select.findAll('option');

        options.forEach(option => {
          expect(option.classes(MOCK_CUSTOM_CLASS)).toBe(true);
        });
      });
    });

    describe('When label child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { description: MOCK_DESCRIPTION, labelChildProps: { some: 'prop' } };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="dt-select-label"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When description child props are provided', () => {
      it('should have provided child prop', () => {
        mockProps = { description: MOCK_DESCRIPTION, descriptionChildProps: { some: 'prop' } };

        updateWrapper();

        MOCK_ELEMENT = wrapper.find('[data-qa="dt-select-description"]');

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });

    describe('When option child props are provided', () => {
      it('should apply child props to each option', () => {
        mockProps = { optionChildProps: { some: 'prop' } };

        updateWrapper();

        const options = select.findAll('option');

        options.forEach(option => {
          expect(option.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
        });
      });
    });

    describe('When attrs are provided', () => {
      it('attr should be set on element', () => {
        mockAttrs = { some: 'prop' };

        updateWrapper();

        MOCK_ELEMENT = select;

        expect(MOCK_ELEMENT.attributes(MOCK_PROP_NAME)).toBe(MOCK_PROP_VALUE);
      });
    });
  });
});
