import { mount } from '@vue/test-utils';
import DtComboboxMultiSelect from './combobox_multi_select.vue';
import { VALIDATION_MESSAGE_TYPES } from '@/common/constants';
import { flushPromises } from '@/common/utils';
import SrOnlyCloseButtonComponent from '@/common/sr_only_close_button.vue';

// Constants
const baseProps = {
  showList: true,
  label: 'Label Text',
};

describe('DtComboboxMultiSelect Tests', () => {
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
    srOnlyCloseBtn = wrapper.findComponent(SrOnlyCloseButtonComponent);
    popoverContainer = wrapper.find('[data-qa="dt-popover-container"]');
  };

  const _setWrappers = () => {
    wrapper = mount(DtComboboxMultiSelect, {
      props,
      slots,
      attrs,
      global: {
        stubs: {
          transition: false,
        },
      },
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

  afterAll(() => {
    // Restore RequestAnimationFrame and cancelAnimationFrame
    global.requestAnimationFrame = undefined;
    global.cancelAnimationFrame = undefined;
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

    describe('When disabled prop is used', () => {
      it('should have input enabled by default', () => {
        expect(input.attributes('disabled')).toBeUndefined();
      });

      it('should disable the input when disabled is true', async () => {
        await wrapper.setProps({ disabled: true });
        _setChildWrappers();
        expect(input.attributes('disabled')).toBeDefined();
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
            await secondChip.trigger('keydown', { code: 'arrowleft' });
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
            await firstChip.trigger('keydown', { code: 'arrowright' });
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
          await input.trigger('focus');
        });

        describe('When LEFT key is pressed', () => {
          beforeEach(async () => {
            input.trigger('keydown', { key: 'arrowleft' });
          });

          it('should focus the last chip', () => {
            expect(document.activeElement).toBe(lastChip.element);
          });
        });

        describe('When input contains text and LEFT key is pressed', () => {
          it('should not call moveFromInputToChip when input has text', async () => {
            const spy = vi.spyOn(wrapper.vm, 'moveFromInputToChip');
            await input.setValue('a');
            await input.trigger('keydown', { key: 'arrowleft' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('When BACKSPACE key is pressed', () => {
          beforeEach(async () => {
            input.trigger('keydown', { key: 'backspace' });
          });

          it('should focus the last chip', () => {
            expect(document.activeElement).toBe(lastChip.element);
          });
        });

        describe('When input contains text and BACKSPACE key is pressed', () => {
          it('should not call moveFromInputToChip when input has text', async () => {
            const spy = vi.spyOn(wrapper.vm, 'moveFromInputToChip');
            await input.setValue('a');
            await input.trigger('keydown', { key: 'backspace' });
            expect(spy).not.toHaveBeenCalled();
          });
        });
      });

      describe('When the last chip is focused', () => {
        beforeEach(async () => {
          lastChip.trigger('focus');
        });

        describe('When RIGHT key is pressed', () => {
          beforeEach(async () => {
            lastChip.trigger('keydown', { code: 'arrowright' });
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
        chip.trigger('keydown', { code: 'delete' });
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

      it('Should contain a visually hidden close button', async () => {
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

  describe('Input Key Event Tests', () => {
    beforeEach(async () => {
      // Establish the "while input is focused" precondition the spec describes
      // before each keydown trigger. Nested describes that target chips manage
      // their own keydown source — triggering focus on the input is a no-op
      // for those code paths.
      await input.trigger('focus');
    });

    it('Should emit "escape" when Escape is pressed while input is focused', async () => {
      await input.trigger('keydown', { key: 'Escape' });
      expect(wrapper.emitted('escape').length).toBe(1);
    });

    it('Should emit "enter" when Enter is pressed while input is focused', async () => {
      await input.trigger('keydown', { key: 'Enter', code: 'Enter' });
      expect(wrapper.emitted('enter').length).toBe(1);
    });

    it('Should emit "enter" when NumpadEnter is pressed while input is focused', async () => {
      // event.key normalizes NumpadEnter to 'Enter'; using event.code would miss this.
      await input.trigger('keydown', { key: 'Enter', code: 'NumpadEnter' });
      expect(wrapper.emitted('enter').length).toBe(1);
    });

    describe('When a key is pressed in the input', () => {
      beforeEach(async () => {
        await input.trigger('keydown', { key: 'Tab', code: 'Tab' });
      });

      it('Should emit "keydown" once', () => {
        expect(wrapper.emitted('keydown').length).toBe(1);
      });

      it('Should emit "keydown" with a KeyboardEvent payload', () => {
        expect(wrapper.emitted('keydown')[0][0]).toBeInstanceOf(KeyboardEvent);
      });
    });

    it.each([
      { key: 'Escape', code: 'Escape' },
      { key: 'Enter', code: 'Enter' },
      { key: 'Enter', code: 'NumpadEnter' },
    ])('Should emit "keydown" for key=$key code=$code', async ({ key, code }) => {
      await input.trigger('keydown', { key, code });
      expect(wrapper.emitted('keydown').length).toBe(1);
    });

    describe('When chips are present', () => {
      beforeEach(async () => {
        await wrapper.setProps({ selectedItems: ['1'] });
        _setChildWrappers();
      });

      describe.each([
        { key: 'Escape', semanticEvent: 'escape' },
        { key: 'Enter', semanticEvent: 'enter' },
      ])('When $key is pressed while a chip is focused', ({ key, semanticEvent }) => {
        beforeEach(async () => {
          await chips.at(0).trigger('keydown', { key, code: key });
        });

        it('Should emit "chip-keydown" from the chip', () => {
          expect(wrapper.emitted('chip-keydown').length).toBe(1);
        });

        it('Should not emit unprefixed "keydown" from the chip', () => {
          expect(wrapper.emitted('keydown')).toBeUndefined();
        });

        it(`Should not emit "${semanticEvent}"`, () => {
          expect(wrapper.emitted(semanticEvent)).toBeUndefined();
        });
      });

      it('Should emit "chip-keydown" when a key is pressed on a chip', async () => {
        await chips.at(0).trigger('keydown', { key: 'ArrowLeft', code: 'ArrowLeft' });
        expect(wrapper.emitted('chip-keydown').length).toBe(1);
      });
    });

    describe('When the component is disabled', () => {
      // Suppressed by the explicit `if (this.disabled) return;` guard in
      // inputListeners.onKeydown — not by native DOM disabled semantics
      // (JSDOM's trigger() fires regardless of the HTML disabled attribute).
      beforeEach(async () => {
        await wrapper.setProps({ disabled: true });
      });

      it('Should not emit "keydown"', async () => {
        await input.trigger('keydown', { key: 'Tab', code: 'Tab' });
        expect(wrapper.emitted('keydown')).toBeUndefined();
      });

      it('Should not emit "escape"', async () => {
        await input.trigger('keydown', { key: 'Escape', code: 'Escape' });
        expect(wrapper.emitted('escape')).toBeUndefined();
      });

      it('Should not emit "enter"', async () => {
        await input.trigger('keydown', { key: 'Enter', code: 'Enter' });
        expect(wrapper.emitted('enter')).toBeUndefined();
      });
    });
  });

  describe('Duplicate Items Tests', () => {
    beforeEach(async () => {
      await wrapper.setProps({ selectedItems: ['item1', 'item1', 'item1'] });
      await flushPromises();
      _setChildWrappers();
    });

    it('should render a chip for each duplicate item', () => {
      expect(chips.length).toBe(3);
    });

    it('should return distinct elements from getChips for duplicates', () => {
      const chipElements = wrapper.vm.getChips();
      const unique = new Set(chipElements);
      expect(unique.size).toBe(3);
    });
  });

  describe('Bulk Update Tests', () => {
    it('should return chips in selectedItems order after bulk update', async () => {
      await wrapper.setProps({ selectedItems: ['alpha', 'beta', 'gamma'] });
      await flushPromises();
      _setChildWrappers();

      const chipElements = wrapper.vm.getChips();
      const labels = chipElements.map(
        el => el.querySelector('.d-chip__label')?.textContent?.trim(),
      );
      expect(labels).toEqual(['alpha', 'beta', 'gamma']);
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
