import type { ReactElement } from 'react';
import type { Mock } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtComboboxMultiSelect, type DtComboboxMultiSelectProps } from './ComboboxMultiSelect';

type Props = Partial<DtComboboxMultiSelectProps>;

// Constants
const baseProps: DtComboboxMultiSelectProps = {
  showList: true,
  label: 'Label Text',
};

describe('DtComboboxMultiSelect Tests', () => {
  let rerender: (ui: ReactElement) => void;
  let unmount: (() => void) | undefined;
  let currentProps: DtComboboxMultiSelectProps;

  // Environment
  let props: DtComboboxMultiSelectProps = baseProps;
  // Vue's `wrapper.emitted()`: every event the component reports.
  let removeStub: Mock<(item: string) => void>;
  let keyDownStub: Mock<NonNullable<DtComboboxMultiSelectProps['onKeyDown']>>;
  let chipKeyDownStub: Mock<NonNullable<DtComboboxMultiSelectProps['onChipKeyDown']>>;
  let escapeStub: Mock<NonNullable<DtComboboxMultiSelectProps['onEscape']>>;
  let enterStub: Mock<NonNullable<DtComboboxMultiSelectProps['onEnter']>>;

  const tree = (p: DtComboboxMultiSelectProps) => <DtComboboxMultiSelect {...p} />;

  // Helpers: Vue's _setChildWrappers, as queries that always read the current DOM.
  const getChips = () => screen.queryAllByTestId('dt-chip');
  const getInput = () => screen.getByTestId('dt-input-input') as HTMLInputElement;
  const queryInputLabel = () => screen.queryByTestId('dt-input-label');
  const queryInputDescription = () => screen.queryByTestId('dt-input-description');
  const queryValidationMsg = () => screen.queryByTestId('validation-message');
  const querySrOnlyCloseBtn = () => document.body.querySelector<HTMLElement>('[data-qa="dt-sr-only-close-button"]');
  const getPopoverContainer = () => screen.getByTestId('dt-popover-container');

  // Vue's `wrapper.setProps`.
  const setProps = async (next: Props) => {
    currentProps = { ...currentProps, ...next };
    await act(async () => { rerender(tree(currentProps)); });
  };

  const mountWrapper = () => {
    unmount?.();
    currentProps = {
      ...props,
      onRemove: removeStub,
      onKeyDown: keyDownStub,
      onChipKeyDown: chipKeyDownStub,
      onEscape: escapeStub,
      onEnter: enterStub,
    };
    ({ rerender, unmount } = render(tree(currentProps)));
  };

  // Setup
  // Vue's test stubs requestAnimationFrame, which its components don't need here; DtTransition does, so it stays.
  beforeEach(() => {
    removeStub = vi.fn();
    keyDownStub = vi.fn();
    chipKeyDownStub = vi.fn();
    escapeStub = vi.fn();
    enterStub = vi.fn();
    mountWrapper();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    unmount?.();
    unmount = undefined;
    vi.clearAllMocks();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(screen.getByTestId('dt-combobox')).toBeInTheDocument();
    });
    it('should render the input', () => {
      expect(getInput()).toBeInTheDocument();
    });
    it('should render the input label', () => {
      expect(queryInputLabel()).toBeInTheDocument();
    });
    it('should not render the chip if no selection', () => {
      expect(getChips().length).toBe(0);
    });

    describe('When description is provided', () => {
      beforeEach(async () => {
        await setProps({ description: 'Description Text' });
      });
      it('should render description', async () => {
        expect(queryInputDescription()).toBeInTheDocument();
      });
    });

    describe('When disabled prop is used', () => {
      it('should have input enabled by default', () => {
        expect(getInput()).not.toHaveAttribute('disabled');
      });

      it('should disable the input when disabled is true', async () => {
        await setProps({ disabled: true });
        expect(getInput()).toHaveAttribute('disabled');
      });
    });

    describe('When showLabel prop is false', () => {
      beforeEach(async () => {
        await setProps({ showLabel: false });
      });
      it('should not render label', async () => {
        expect(queryInputLabel()).not.toBeInTheDocument();
      });
      it(
        'should still set aria-label even if label visible is false',
        async () => {
          expect(getInput()).toHaveAttribute('aria-label', baseProps.label);
        },
      );
    });

    describe('Should render the chips if any selection', () => {
      // Test Setup
      beforeEach(async () => {
        await setProps({ selectedItems: ['1', '2'] });
      });

      it('should render the chip component', () => {
        expect(getChips().length).toBeGreaterThan(0);
      });

      it('should be two chip components', () => {
        expect(getChips().length).toBe(2);
      });
    });
  });

  describe('Accessibility Tests', () => {
    beforeEach(async () => {
      await setProps({ selectedItems: ['1', '2'] });
    });

    describe('Should navigate between chips', () => {
      describe('When second chip is focused', () => {
        beforeEach(async () => {
          await act(async () => { getChips()[1].focus(); });
        });

        describe('When LEFT key is pressed', () => {
          beforeEach(async () => {
            await userEvent.keyboard('{ArrowLeft}');
          });

          it('should focus the first chip', () => {
            expect(document.activeElement).toBe(getChips()[0]);
          });
        });
      });

      describe('When first chip is focused', () => {
        beforeEach(async () => {
          await act(async () => { getChips()[0].focus(); });
        });

        describe('When RIGHT key is pressed', () => {
          beforeEach(async () => {
            await userEvent.keyboard('{ArrowRight}');
          });

          it('should focus the second chip', () => {
            expect(document.activeElement).toBe(getChips()[1]);
          });
        });
      });
    });

    describe('Should navigate between last chip and input', () => {
      beforeEach(async () => {
        await setProps({ selectedItems: ['1'] });
      });

      describe('When input is focused', () => {
        beforeEach(async () => {
          await act(async () => { getInput().focus(); });
        });

        describe('When LEFT key is pressed', () => {
          beforeEach(async () => {
            await userEvent.keyboard('{ArrowLeft}');
          });

          it('should focus the last chip', () => {
            expect(document.activeElement).toBe(getChips()[0]);
          });
        });

        describe('When input contains text and LEFT key is pressed', () => {
          // Vue spies on moveFromInputToChip; here the focus that call would move stays on the input.
          it('should not call moveFromInputToChip when input has text', async () => {
            await userEvent.type(getInput(), 'a');
            await userEvent.keyboard('{ArrowLeft}');
            expect(document.activeElement).toBe(getInput());
          });
        });

        describe('When BACKSPACE key is pressed', () => {
          beforeEach(async () => {
            await userEvent.keyboard('{Backspace}');
          });

          it('should focus the last chip', () => {
            expect(document.activeElement).toBe(getChips()[0]);
          });
        });

        describe('When input contains text and BACKSPACE key is pressed', () => {
          it('should not call moveFromInputToChip when input has text', async () => {
            await userEvent.type(getInput(), 'a');
            await userEvent.keyboard('{Backspace}');
            expect(document.activeElement).toBe(getInput());
          });
        });
      });

      describe('When the last chip is focused', () => {
        beforeEach(async () => {
          await act(async () => { getChips()[0].focus(); });
        });

        describe('When RIGHT key is pressed', () => {
          beforeEach(async () => {
            await userEvent.keyboard('{ArrowRight}');
          });

          it('should focus the input', () => {
            expect(document.activeElement).toBe(getInput());
          });
        });
      });
    });

    describe('ARIA validation wiring', () => {
      describe('When a critical validation message is provided', () => {
        beforeEach(async () => {
          await setProps({
            maxSelected: 1,
            maxSelectedMessage: [{ message: 'Too many selected', type: VALIDATION_MESSAGE_TYPES.CRITICAL }],
            selectedItems: ['item1', 'item2'],
          });
        });

        it('should set aria-invalid on the input', () => {
          expect(getInput()).toHaveAttribute('aria-invalid', 'true');
        });

        it('should set aria-describedby on the input pointing to the messages container', () => {
          const messagesContainer = screen.getAllByTestId('validation-messages-container')[0];
          expect(messagesContainer.id).not.toBe('');
          expect(getInput()).toHaveAttribute('aria-describedby', messagesContainer.id);
        });
      });

      describe('When no validation messages are provided', () => {
        it('should not set aria-invalid on the input', () => {
          expect(getInput()).not.toHaveAttribute('aria-invalid');
        });

        it('should not set aria-describedby on the input', () => {
          expect(getInput()).not.toHaveAttribute('aria-describedby');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(async () => {
      await setProps({ selectedItems: ['1'] });
    });

    it(
      'Should emit "remove" event when close the chip and focus back to input',
      () => {
        fireEvent.keyDown(getChips()[0], { key: 'Delete', code: 'Delete' });
        expect(removeStub).toHaveBeenCalledWith('1');
        expect(document.activeElement).toBe(getInput());
      },
    );

    describe('When list is open', () => {
      beforeEach(async () => {
        await act(async () => { getInput().focus(); });
        await finishTransitions();
      });

      it('Should contain anchor-opened class', () => {
        expect(getPopoverContainer()).toHaveClass('d-popover__anchor--opened');
      });

      it('Should contain a visually hidden close button', async () => {
        expect(querySrOnlyCloseBtn()).not.toBeNull();
      });

      describe('When visually hidden close button is clicked', () => {
        beforeEach(async () => {
          await userEvent.click(querySrOnlyCloseBtn()!);
        });

        it('Should not contain anchor-opened class', () => {
          expect(getPopoverContainer()).not.toHaveClass('d-popover__anchor--opened');
        });
      });
    });
  });

  describe('Input Key Event Tests', () => {
    beforeEach(async () => {
      // Establish the "while input is focused" precondition the spec describes
      // before each keydown trigger. Nested describes that target chips manage
      // their own keydown source — focusing the input is a no-op
      // for those code paths.
      await act(async () => { getInput().focus(); });
    });

    it('Should emit "escape" when Escape is pressed while input is focused', async () => {
      await userEvent.keyboard('{Escape}');
      expect(escapeStub).toHaveBeenCalledTimes(1);
    });

    it('Should emit "escape" with a KeyboardEvent payload', async () => {
      await userEvent.keyboard('{Escape}');
      expect(escapeStub.mock.calls[0][0].nativeEvent).toBeInstanceOf(KeyboardEvent);
    });

    it('Should emit "enter" when Enter is pressed while input is focused', async () => {
      await userEvent.keyboard('{Enter}');
      expect(enterStub).toHaveBeenCalledTimes(1);
    });

    it('Should emit "enter" with a KeyboardEvent payload', async () => {
      await userEvent.keyboard('{Enter}');
      expect(enterStub.mock.calls[0][0].nativeEvent).toBeInstanceOf(KeyboardEvent);
    });

    it('Should emit "enter" when NumpadEnter is pressed while input is focused', async () => {
      // event.key normalizes NumpadEnter to 'Enter'; using event.code would miss this.
      await act(async () => { fireEvent.keyDown(getInput(), { key: 'Enter', code: 'NumpadEnter' }); });
      expect(enterStub).toHaveBeenCalledTimes(1);
    });

    describe('When a key is pressed in the input', () => {
      beforeEach(async () => {
        await act(async () => { fireEvent.keyDown(getInput(), { key: 'Tab', code: 'Tab' }); });
      });

      it('Should emit "keydown" once', () => {
        expect(keyDownStub).toHaveBeenCalledTimes(1);
      });

      it('Should emit "keydown" with a KeyboardEvent payload', () => {
        expect(keyDownStub.mock.calls[0][0].nativeEvent).toBeInstanceOf(KeyboardEvent);
      });
    });

    it.each([
      { key: 'Escape', code: 'Escape' },
      { key: 'Enter', code: 'Enter' },
      { key: 'Enter', code: 'NumpadEnter' },
    ])('Should emit "keydown" for key=$key code=$code', async ({ key, code }) => {
      await act(async () => { fireEvent.keyDown(getInput(), { key, code }); });
      expect(keyDownStub).toHaveBeenCalledTimes(1);
    });

    describe('When chips are present', () => {
      beforeEach(async () => {
        await setProps({ selectedItems: ['1'] });
      });

      describe.each([
        { key: 'Escape', semanticEvent: 'escape' },
        { key: 'Enter', semanticEvent: 'enter' },
      ])('When $key is pressed while a chip is focused', ({ key, semanticEvent }) => {
        beforeEach(async () => {
          await act(async () => { fireEvent.keyDown(getChips()[0], { key, code: key }); });
        });

        it('Should emit "chip-keydown" from the chip', () => {
          expect(chipKeyDownStub).toHaveBeenCalledTimes(1);
        });

        it('Should not emit unprefixed "keydown" from the chip', () => {
          expect(keyDownStub).not.toHaveBeenCalled();
        });

        it(`Should not emit "${semanticEvent}"`, () => {
          expect(semanticEvent === 'escape' ? escapeStub : enterStub).not.toHaveBeenCalled();
        });
      });

      it('Should emit "chip-keydown" when a key is pressed on a chip', async () => {
        await act(async () => { fireEvent.keyDown(getChips()[0], { key: 'ArrowLeft', code: 'ArrowLeft' }); });
        expect(chipKeyDownStub).toHaveBeenCalledTimes(1);
      });
    });

    describe('When the component is disabled', () => {
      // Suppressed by the explicit `if (disabled) return;` guard in the
      // input's keydown handler — not by native DOM disabled semantics
      // (fireEvent dispatches regardless of the HTML disabled attribute).
      beforeEach(async () => {
        await setProps({ disabled: true });
      });

      it('Should not emit "keydown"', async () => {
        await act(async () => { fireEvent.keyDown(getInput(), { key: 'Tab', code: 'Tab' }); });
        expect(keyDownStub).not.toHaveBeenCalled();
      });

      it('Should not emit "escape"', async () => {
        await act(async () => { fireEvent.keyDown(getInput(), { key: 'Escape', code: 'Escape' }); });
        expect(escapeStub).not.toHaveBeenCalled();
      });

      it('Should not emit "enter"', async () => {
        await act(async () => { fireEvent.keyDown(getInput(), { key: 'Enter', code: 'Enter' }); });
        expect(enterStub).not.toHaveBeenCalled();
      });

      it('Should not emit "chip-keydown" when a key is pressed on a chip', async () => {
        await setProps({ selectedItems: ['1'] });
        await act(async () => { fireEvent.keyDown(getChips()[0], { key: 'ArrowLeft', code: 'ArrowLeft' }); });
        expect(chipKeyDownStub).not.toHaveBeenCalled();
      });
    });
  });

  describe('Duplicate Items Tests', () => {
    beforeEach(async () => {
      await setProps({ selectedItems: ['item1', 'item1', 'item1'] });
    });

    it('should render a chip for each duplicate item', () => {
      expect(getChips().length).toBe(3);
    });

    // Vue reads getChips() through wrapper.vm; here the distinct chips show as keyboard navigation reaching each one.
    it('should return distinct elements from getChips for duplicates', async () => {
      const chips = getChips();
      expect(new Set(chips).size).toBe(3);
      await act(async () => { chips[0].focus(); });
      await userEvent.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(chips[1]);
      await userEvent.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(chips[2]);
    });
  });

  describe('Bulk Update Tests', () => {
    // Vue reads getChips() through wrapper.vm; here the order shows in the labels, and in ArrowRight on the last of
    // them moving to the input.
    it('should return chips in selectedItems order after bulk update', async () => {
      await setProps({ selectedItems: ['alpha', 'beta', 'gamma'] });

      const chips = getChips();
      const labels = chips.map(el => el.closest('.d-chip')?.querySelector('.d-chip__label')?.textContent?.trim());
      expect(labels).toEqual(['alpha', 'beta', 'gamma']);
      await act(async () => { chips[2].focus(); });
      await userEvent.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(getInput());
    });
  });

  describe('Input Visibility Recovery Tests', () => {
    // jsdom never lays anything out, so getBoundingClientRect() returns 0 for every element by
    // default — exactly the "input had a zero layout box at mount" condition this recovers from.
    // The real ResizeObserver is mocked out globally as a no-op (tests/setup.ts), so a local
    // stub is installed here to capture the callback the component registers on the input itself,
    // letting the test invoke it directly to simulate the input actually gaining layout later.
    let inputEl: HTMLInputElement;
    let inputObserverCallback: (() => void) | undefined;
    let OriginalResizeObserver: typeof ResizeObserver;

    beforeEach(() => {
      unmount?.();
      unmount = undefined;
      inputObserverCallback = undefined;
      OriginalResizeObserver = globalThis.ResizeObserver;
      globalThis.ResizeObserver = class {
        callback: () => void;

        constructor (callback: () => void) {
          this.callback = callback;
        }

        observe (target: Element) {
          if (target?.classList?.contains('d-input__input')) {
            inputObserverCallback = this.callback;
          }
        }

        disconnect () {}
        unobserve () {}
      } as unknown as typeof ResizeObserver;

      // selectedItems is populated *before* mount, matching a real "mounted hidden with
      // preselected items" case: initSelectedItems() runs at mount too, but only ever reads
      // whatever height the initial (still-hidden) measurement found.
      props = { ...baseProps, selectedItems: ['item1'] };
      mountWrapper();
      inputEl = getInput();
    });

    afterEach(() => {
      globalThis.ResizeObserver = OriginalResizeObserver;
    });

    // Vue reads initialInputHeight through wrapper.vm; here a zero height shows as the input getting no height floor.
    it('should have a falsy initialInputHeight before the input has ever had real layout', () => {
      expect(inputEl.style.minHeight).toBe('');
    });

    it('should register a visibility observer on the input itself', () => {
      expect(inputObserverCallback).toBeInstanceOf(Function);
    });

    describe('When the input later gains real layout on its own, with no other trigger', () => {
      beforeEach(async () => {
        vi.spyOn(inputEl, 'getBoundingClientRect').mockReturnValue({
          top: 0, left: 0, width: 300, height: 40, bottom: 40, right: 300, x: 0, y: 0, toJSON: () => ({}),
        });
        await act(async () => { inputObserverCallback?.(); });
      });

      // Vue reads initialInputHeight through wrapper.vm. Here it shows in the chips' position, which centers them on
      // the recovered single-row height (40px) even once the input's box has grown.
      it('should recover a non-zero initialInputHeight instead of staying stuck at 0', async () => {
        vi.spyOn(inputEl, 'getBoundingClientRect').mockReturnValue({
          top: 0, left: 0, width: 300, height: 80, bottom: 80, right: 300, x: 0, y: 0, toJSON: () => ({}),
        });
        await setProps({ description: 'Description Text' });
        const chipsWrapper = getChips()[0].closest<HTMLElement>('.d-combobox-multi-select__chip-wrapper');
        expect(chipsWrapper?.style.top).toBe('20px');
      });

      it('should set a min-height on the input so wrapped rows have room to grow into', () => {
        expect(inputEl.style.minHeight).toBe('40px');
      });
    });
  });

  describe('Validation Tests', () => {
    beforeEach(async () => {
      await setProps({
        maxSelected: 2,
        maxSelectedMessage: [{
          message: 'More than 2 selected',
          type: VALIDATION_MESSAGE_TYPES.WARNING,
        }],
      });
    });

    describe('"max-selected" validation', () => {
      it('should not show warning if not reach max', async () => {
        await setProps({ selectedItems: ['1'] });
        expect(queryValidationMsg()).not.toBeInTheDocument();
      });

      it('should show warning if reach max', async () => {
        await setProps({ selectedItems: ['item1', 'item2', 'item3'] });
        expect(queryValidationMsg()).toHaveTextContent('More than 2 selected');
      });
    });
  });

  describe('When dialogClass is provided', () => {
    // Popover portals to body, so query body directly via data-qa
    // (same pattern as tooltip/split_button/hovercard tests).
    let dialog: HTMLElement | null;

    beforeEach(async () => {
      props = { ...baseProps, dialogClass: 'custom-dialog-class' };
      mountWrapper();
      await act(async () => { getInput().focus(); });
      await finishTransitions();
      dialog = document.body.querySelector('[data-qa="dt-popover"]');
    });

    it('should render the popover dialog element', () => {
      expect(dialog).not.toBeNull();
    });

    it('should apply the class to the popover dialog element', () => {
      expect(dialog).toHaveClass('custom-dialog-class');
    });
  });

  // React-only: what Vue's tests don't exercise.
  describe('React-only Tests', () => {
    describe('When showList is not set and the list shows its empty state', () => {
      it('should keep the list open on a mousedown in the footer', async () => {
        props = {
          label: 'Label Text',
          selectedItems: ['1'],
          emptyList: true,
          emptyStateMessage: 'No results',
          footer: <button type="button">Footer button</button>,
        };
        mountWrapper();
        await act(async () => { getInput().focus(); });
        expect(document.querySelector('.d-popover__anchor--opened')).not.toBeNull();
        await act(async () => { fireEvent.mouseDown(screen.getByText('Footer button')); });
        expect(document.querySelector('.d-popover__anchor--opened')).not.toBeNull();
      });
    });

    describe('When showList is not set', () => {
      // The input doesn't get the combobox's inputProps (as in Vue), so the popover's anchor shows whether it's open.
      const isListOpen = () => document.querySelector('.d-popover__anchor--opened') !== null;

      beforeEach(() => {
        props = { label: 'Label Text', selectedItems: ['1'] };
        mountWrapper();
      });

      it('should open the list when the input is focused, and close it on Escape', async () => {
        expect(isListOpen()).toBe(false);
        await act(async () => { getInput().focus(); });
        expect(isListOpen()).toBe(true);
        // The combobox handles Escape once the popover has opened, and reported its list.
        await finishTransitions();
        await act(async () => {});
        await userEvent.keyboard('{Escape}');
        await finishTransitions();
        expect(isListOpen()).toBe(false);
      });

      it('should reopen the list when the focused input is clicked', async () => {
        await act(async () => { getInput().focus(); });
        await finishTransitions();
        await act(async () => {});
        await userEvent.keyboard('{Escape}');
        await finishTransitions();
        expect(isListOpen()).toBe(false);
        await userEvent.click(getInput());
        expect(isListOpen()).toBe(true);
      });

      it('should close the list when focus moves to a chip, and reopen it when it moves back', async () => {
        await act(async () => { getInput().focus(); });
        await userEvent.keyboard('{ArrowLeft}');
        expect(isListOpen()).toBe(false);
        await userEvent.keyboard('{ArrowRight}');
        expect(isListOpen()).toBe(true);
      });

      it('should close the list on a mousedown outside it', async () => {
        await act(async () => { getInput().focus(); });
        await act(async () => { fireEvent.mouseDown(document.body); });
        expect(isListOpen()).toBe(false);
      });

      it('should keep the list open on a mousedown in the input', async () => {
        await act(async () => { getInput().focus(); });
        await act(async () => { fireEvent.mouseDown(getInput()); });
        expect(isListOpen()).toBe(true);
      });
    });

    it('should report the typed text, and call the consumer onInput and onClick too', async () => {
      const valueChange = vi.fn();
      const input = vi.fn();
      const click = vi.fn();
      props = { ...baseProps, onValueChange: valueChange, onInput: input, onClick: click };
      mountWrapper();
      await userEvent.type(getInput(), 'ab');
      expect(valueChange).toHaveBeenLastCalledWith('ab');
      expect(input).toHaveBeenCalledTimes(2);
      expect(click).toHaveBeenCalledTimes(1);
    });

    it('should report max-selected when the selected items exceed the maximum', async () => {
      const maxSelected = vi.fn();
      props = { ...baseProps, maxSelected: 1, onMaxSelected: maxSelected };
      mountWrapper();
      await setProps({ selectedItems: ['1', '2'] });
      expect(maxSelected).toHaveBeenCalledTimes(1);
    });

    it('should remove a chip on Backspace', async () => {
      await setProps({ selectedItems: ['1', '2'] });
      await act(async () => { getChips()[1].focus(); });
      await userEvent.keyboard('{Backspace}');
      expect(removeStub).toHaveBeenCalledWith('2');
      expect(document.activeElement).toBe(getInput());
    });

    it('should put className and other attributes on the root, and handlers on the input', async () => {
      const focus = vi.fn();
      props = { ...baseProps, className: 'my-class', id: 'my-id', onFocus: focus };
      mountWrapper();
      const root = screen.getByTestId('dt-combobox');
      expect(root).toHaveClass('my-class');
      expect(root).toHaveAttribute('id', 'my-id');
      await act(async () => { getInput().focus(); });
      expect(focus).toHaveBeenCalledTimes(1);
    });
  });
});
