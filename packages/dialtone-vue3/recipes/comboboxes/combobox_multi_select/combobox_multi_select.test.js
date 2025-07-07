import { mount } from '@vue/test-utils';
import DtRecipeComboboxMultiSelect from './combobox_multi_select.vue';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import { flushPromises } from '@/common/utils';

// Constants
const baseProps = {
  showList: true,
  label: 'Label Text',
};

describe('DtRecipeComboboxMultiSelect Tests', () => {
  // Wrappers
  let wrapper;
  let chips;
  let input;
  let inputLabel;
  let inputDescription;
  let validationMsg;
  let srOnlyCloseBtn;
  let popoverContainer;

  // Environment
  let props = baseProps;
  let attrs = {};
  let slots = {};
  let provide = {};

  // Helpers
  const _setChildWrappers = () => {
    chips = wrapper.findAll('[data-qa="dt-chip"]');
    input = wrapper.find('[data-qa="dt-input-input"]');
    inputLabel = wrapper.find('[data-qa="dt-input-label"]');
    inputDescription = wrapper.find('[data-qa="dt-input-description"]');
    validationMsg = wrapper.find('[data-qa="validation-message"]');
    srOnlyCloseBtn = wrapper.find('[data-qa="dt-sr-only-close-button"]');
    popoverContainer = wrapper.find('[data-qa="dt-popover-container"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtRecipeComboboxMultiSelect, {
      props,
      attrs,
      slots,
      provide,
      attachTo: document.body,
    });
    _setChildWrappers();
  };

  // Setup
  beforeAll(() => {
    // RequestAnimationFrame and cancelAnimationFrame are undefined in the scope
    // Need to mock them to avoid error
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });
  beforeEach(() => {
    _setWrappers();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    attrs = {};
    slots = {};
    provide = {};
    wrapper.unmount();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });
    it('should render the input', () => {
      expect(input.exists()).toBe(true);
    });
    it('should render the input label', () => {
      expect(inputLabel.exists()).toBe(true);
    });
    it('should not render the chip if no selection', () => {
      expect(chips.length).toBe(0);
    });

    describe('When description is provided', () => {
      beforeEach(async () => {
        await wrapper.setProps({ description: 'Description Text' });
        _setChildWrappers();
      });
      it('should render description', async () => {
        expect(inputDescription.exists()).toBe(true);
      });
    });

    describe('When labelVisible prop is false', () => {
      beforeEach(async () => {
        await wrapper.setProps({ labelVisible: false });
        _setChildWrappers();
      });
      it('should not render label', async () => {
        expect(inputLabel.exists()).toBe(false);
      });
      it(
        'should still set aria-label even if label visible is false',
        async () => {
          expect(input.attributes('aria-label')).toEqual(baseProps.label);
        },
      );
    });

    describe('Should render the chips if any selection', () => {
      // Test Setup
      beforeEach(async () => {
        await wrapper.setProps({ selectedItems: ['1', '2'] });
        _setChildWrappers();
      });

      it('should render the chip component', () => {
        expect(chips.length).toBeGreaterThan(0);
      });

      it('should be two chip components', () => {
        expect(chips.length).toBe(2);
      });
    });
  });

  describe('Accessibility Tests', () => {
    let firstChip;
    let secondChip;
    beforeEach(async () => {
      await wrapper.setProps({ selectedItems: ['1', '2'] });
      _setChildWrappers();
      firstChip = chips.at(0);
      secondChip = chips.at(1);
    });

    describe('Should navigate between chips', () => {
      describe('When second chip is focused', () => {
        beforeEach(async () => {
          await secondChip.trigger('focus');
        });

        describe('When LEFT key is pressed', () => {
          beforeEach(async () => {
            await secondChip.trigger('keyup', { code: 'arrowleft' });
          });

          it('should focus the first chip', () => {
            expect(document.activeElement).toBe(firstChip.element);
          });
        });
      });

      describe('When first chip is focused', () => {
        beforeEach(async () => {
          await firstChip.trigger('focus');
        });

        describe('When RIGHT key is pressed', () => {
          beforeEach(async () => {
            await firstChip.trigger('keyup', { code: 'arrowright' });
          });

          it('should focus the second chip', () => {
            expect(document.activeElement).toBe(secondChip.element);
          });
        });
      });
    });

    describe('Should navigate between last chip and input', () => {
      let lastChip;
      beforeEach(async () => {
        await wrapper.setProps({ selectedItems: ['1'] });
        lastChip = chips.at(0);
      });

      describe('When input is focused', () => {
        beforeEach(async () => {
          input.trigger('focus');
        });

        describe('When LEFT key is pressed', () => {
          beforeEach(async () => {
            input.trigger('keyup', { code: 'arrowleft' });
          });

          it('should focus the last chip', () => {
            expect(document.activeElement).toBe(lastChip.element);
          });
        });

        describe('When BACKSPACE key is pressed', () => {
          beforeEach(async () => {
            input.trigger('keyup', { code: 'backspace' });
          });

          it('should focus the last chip', () => {
            expect(document.activeElement).toBe(lastChip.element);
          });
        });
      });

      describe('When the last chip is focused', () => {
        beforeEach(async () => {
          lastChip.trigger('focus');
        });

        describe('When RIGHT key is pressed', () => {
          beforeEach(async () => {
            lastChip.trigger('keyup', { code: 'arrowright' });
          });

          it('should focus the input', () => {
            expect(document.activeElement).toBe(input.element);
          });
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(async () => {
      await wrapper.setProps({ selectedItems: ['1'] });
      _setChildWrappers();
    });

    it(
      'Should emit "remove" event when close the chip and focus back to input',
      () => {
        const chip = chips.at(0);
        chip.trigger('keyup', { code: 'delete' });
        expect(wrapper.emitted().remove[0][0]).toBe('1');
        expect(document.activeElement).toBe(input.element);
      },
    );

    describe('When list is open', () => {
      beforeEach(async () => {
        await input.trigger('focus');
        _setChildWrappers();
      });

      it('Should contain anchor-opened class', () => {
        expect(popoverContainer.classes('d-popover__anchor--opened')).toBe(true);
      });

      it('Should contain a visually hidden close button', () => {
        expect(srOnlyCloseBtn.exists()).toBe(true);
      });

      describe('When visually hidden close button is clicked', () => {
        beforeEach(async () => {
          await srOnlyCloseBtn.trigger('click');
        });

        it('Should not contain anchor-opened class', () => {
          expect(popoverContainer.classes('d-popover__anchor--opened')).toBe(false);
        });
      });
    });
  });

  describe('Validation Tests', () => {
    beforeEach(async () => {
      await wrapper.setProps({
        maxSelected: 2,
        maxSelectedMessage: [{
          message: 'More than 2 selected',
          type: VALIDATION_MESSAGE_TYPES.WARNING,
        }],
      });
      _setChildWrappers();
    });

    describe('"max-selected" validation', () => {
      it('should not show warning if not reach max', async () => {
        await wrapper.setProps({ selectedItems: ['1'] });
        expect(validationMsg.exists()).toBe(false);
      });

      it('should show warning if reach max', async () => {
        await wrapper.setProps({ selectedItems: ['item1', 'item2', 'item3'] });
        await flushPromises();
        _setChildWrappers();
        expect(validationMsg.text()).toBe('More than 2 selected');
      });
    });
  });
});
