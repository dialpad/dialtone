import type { ReactElement } from 'react';
import type { Mock } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { finishTransitions } from '../../tests/helpers/transition';
import type { DtComboboxInputProps } from '../Combobox';
import { DtInput } from '../Input';
import { DtListItem } from '../ListItem';
import { DtListItemGroup } from '../ListItemGroup';
import {
  DtComboboxWithPopover,
  type DtComboboxWithPopoverInputScope,
  type DtComboboxWithPopoverProps,
} from './ComboboxWithPopover';

type Props = Partial<DtComboboxWithPopoverProps>;

// Constants
const baseProps: DtComboboxWithPopoverProps = {
  label: 'Label Text',
  showLabel: true,
  size: 'md',
  description: '',
  listId: 'list',
  loading: false,
  showList: null,
};

const MOCK_INPUT_PROPS_STUB = vi.fn();

// The real DtInput, recording the props it gets, as Vue's `findComponent(DtInput).props()` reads them.
function RecordingInput (props: DtComboboxInputProps & { id?: string }) {
  MOCK_INPUT_PROPS_STUB(props);
  return <DtInput {...props} size={props.size ?? undefined} />;
}

const inputSlot = ({ inputProps }: DtComboboxWithPopoverInputScope) => <RecordingInput {...inputProps} />;
const inputSlotWithId = ({ inputProps }: DtComboboxWithPopoverInputScope) => (
  <RecordingInput id="input" {...inputProps} />
);
// Vue's slots bind `id="list"` before `listProps`, whose id ('list', from listId) wins.
const listSlotWithItem: Props['list'] = ({ listProps }) => (
  <ol {...listProps}>
    <li role="option" aria-selected="false">Item 1</li>
  </ol>
);

describe('DtComboboxWithPopover Tests', () => {
  let rerender: (ui: ReactElement) => void;
  let unmount: (() => void) | undefined;
  let currentProps: DtComboboxWithPopoverProps;

  // Environment
  let props: DtComboboxWithPopoverProps = baseProps;
  let slots: Props = {};
  let selectStub: Mock<(index: number) => void>;
  let escapeStub: Mock<() => void>;
  let highlightStub: Mock<(index: number) => void>;
  let openedStub: Mock<(opened: boolean) => void>;

  const tree = (p: DtComboboxWithPopoverProps) => <DtComboboxWithPopover {...p} />;

  // Helpers
  const getRoot = () => screen.getByTestId('dt-combobox');
  const queryInputWrapper = () => screen.queryByTestId('dt-combobox-input-wrapper');
  const queryListWrapper = () => screen.queryByTestId('dt-combobox-list-wrapper');
  // The popover's content, where tippy has moved it.
  const getPopoverContent = () => screen.getByTestId('dt-popover-content');
  const getInput = () => document.getElementById('input');
  const lastInputProps = () => MOCK_INPUT_PROPS_STUB.mock.lastCall?.[0] as DtComboboxInputProps;

  // Vue's `wrapper.setProps`.
  const setProps = async (next: Props) => {
    currentProps = { ...currentProps, ...next };
    await act(async () => { rerender(tree(currentProps)); });
  };

  // Vue's test opens the list and calls the combobox's `onOpen` with the list itself. Here the popover does that, once
  // its enter transition has finished.
  const openComboboxPopover = async () => {
    await setProps({ showList: true });
    await finishTransitions();
    await act(async () => {});
  };

  const keyDown = async (key: string) => {
    await act(async () => { fireEvent.keyDown(getRoot(), { key }); });
  };

  const mountWrapper = () => {
    unmount?.();
    currentProps = {
      ...props,
      ...slots,
      onSelect: selectStub,
      onEscape: escapeStub,
      onHighlight: highlightStub,
      onOpened: openedStub,
    };
    ({ rerender, unmount } = render(tree(currentProps)));
  };

  // Setup
  // Vue's test stubs requestAnimationFrame, which its stubbed transitions don't need; DtTransition does, so it stays.
  beforeEach(() => {
    selectStub = vi.fn();
    escapeStub = vi.fn();
    highlightStub = vi.fn();
    openedStub = vi.fn();
    mountWrapper();
  });

  // Teardown
  afterEach(() => {
    props = baseProps;
    slots = {};
    unmount?.();
    unmount = undefined;
    vi.clearAllMocks();
  });

  it('clears a teleported option when hovering a group heading before Enter', async () => {
    props = { label: 'Teams', showList: true, listId: 'teams' };
    slots = {
      input: ({ inputProps }) => <DtInput {...inputProps} size={inputProps.size ?? undefined} />,
      list: ({ listProps }) => (
        <ul {...listProps}>
          <li role="presentation">
            <DtListItemGroup id="team" heading="Teams">
              <DtListItem id="sales" role="option" navigationType="arrow-keys">Sales</DtListItem>
            </DtListItemGroup>
          </li>
        </ul>
      ),
    };
    mountWrapper();
    await finishTransitions();
    await act(async () => {});
    const input = screen.getByRole('combobox');
    await act(async () => { fireEvent.mouseMove(getPopoverContent().querySelector('#sales') as Element); });
    expect(input).toHaveAttribute('aria-activedescendant', 'sales');
    await act(async () => { fireEvent.mouseMove(getPopoverContent().querySelector('#team-heading') as Element); });
    await act(async () => { fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' }); });
    expect(selectStub).not.toHaveBeenCalled();
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('retains input focus and option navigation when the listbox opens', async () => {
    props = { label: 'Choose', showList: true, listId: 'focus-list' };
    slots = {
      input: ({ inputProps }) => <DtInput {...inputProps} size={inputProps.size ?? undefined} id="focus-input" />,
      list: ({ listProps }) => (
        <ul {...listProps}>
          <DtListItem role="option" id="focus-option" navigationType="arrow-keys">Alpha</DtListItem>
        </ul>
      ),
    };
    mountWrapper();
    const input = screen.getByRole('combobox');
    act(() => { input.focus(); });
    await finishTransitions();
    await act(async () => {});
    expect(document.activeElement).toBe(input);
    await act(async () => { fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' }); });
    expect(document.activeElement).toBe(input);
    expect(input).toHaveAttribute('aria-activedescendant', 'focus-option');
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(getRoot()).toBeInTheDocument();
    });

    it('should contain a visually hidden close button', async () => {
      await openComboboxPopover();
      expect(getPopoverContent().parentElement?.querySelector('[data-qa="dt-sr-only-close-button"]')).not.toBeNull();
    });

    describe('When a input is provided', () => {
      // Test Setup
      beforeEach(() => {
        slots = { input: inputSlot };
        mountWrapper();
      });

      it('should render the input wrapper', () => {
        expect(queryInputWrapper()).toBeInTheDocument();
      });

      it('should render the input', () => {
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    describe('When label is provided', () => {
      beforeEach(() => {
        slots = { input: inputSlot };
        mountWrapper();
      });

      it('should provide proper label prop to input element', () => {
        expect(lastInputProps().label).toEqual(baseProps.label);
      });

      it('should provide proper size prop to input element', () => {
        expect(lastInputProps().size).toEqual(baseProps.size);
      });

      it('should provide proper description prop to input element', () => {
        expect(lastInputProps().description).toEqual(baseProps.description);
      });

      it('should provide proper aria-label prop to input element', () => {
        expect(screen.getByRole('combobox')).toHaveAttribute('aria-label', baseProps.label);
      });
    });

    describe('When a list is provided', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { list: <ol id="list"></ol> };
        mountWrapper();
        await openComboboxPopover();
      });

      it('should render the list wrapper', () => {
        expect(queryListWrapper()).toBeInTheDocument();
      });

      it('should render the list', () => {
        expect(getPopoverContent().querySelector('#list')).not.toBeNull();
      });
    });

    describe('When it is loading', () => {
      // Test Setup
      beforeEach(async () => {
        props = { ...baseProps, loading: true };
        slots = { input: inputSlotWithId, list: listSlotWithItem };
        mountWrapper();
        await openComboboxPopover();
      });

      it('should render the loading skeletons', () => {
        expect(getPopoverContent().querySelector('[data-qa="skeleton-text-body"]')).not.toBeNull();
      });
    });

    describe('When list is empty', () => {
      // Test Setup
      beforeEach(async () => {
        slots = { input: inputSlotWithId, list: ({ listProps }) => <ol {...listProps}></ol> };
        mountWrapper();
        await setProps({ showList: true, emptyList: true, emptyStateMessage: 'empty' });
        await openComboboxPopover();
      });

      it('should render the empty list component', () => {
        expect(getPopoverContent().querySelector('[data-qa="dt-combobox-empty-list"]')).not.toBeNull();
      });
    });
  });

  describe('Accessibility Tests', () => {
    // Test Setup
    beforeEach(() => {
      slots = { input: inputSlotWithId, list: listSlotWithItem };
      mountWrapper();
    });

    describe('When list is not expanded', () => {
      it('aria-expanded should be "false"', () => {
        expect(getInput()).toHaveAttribute('aria-expanded', 'false');
      });
    });

    describe('When list is expanded', () => {
      beforeEach(async () => {
        await openComboboxPopover();
      });

      it('aria-expanded should be "true"', () => {
        expect(getInput()).toHaveAttribute('aria-expanded', 'true');
      });

      describe('When list is loading', () => {
        beforeEach(async () => {
          await setProps({ loading: true });
        });

        it('aria-busy should be "true"', () => {
          expect(getPopoverContent().querySelector('ol')).toHaveAttribute('aria-busy', 'true');
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    // Test Setup
    beforeEach(() => {
      slots = { input: inputSlotWithId, list: listSlotWithItem };
      mountWrapper();
    });

    describe('When the list is loading', () => {
      beforeEach(async () => {
        props = { ...baseProps, loading: true };
        mountWrapper();
        await openComboboxPopover();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(async () => {
          await keyDown('Escape');
        });

        it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
        it('should emit escape event', () => { expect(escapeStub).toHaveBeenCalledTimes(1); });
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(async () => {
          await keyDown('Enter');
        });

        it('should not call listener', () => { expect(selectStub).not.toHaveBeenCalled(); });
        it('should not emit select event', () => { expect(selectStub).toHaveBeenCalledTimes(0); });
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(async () => {
          await keyDown('ArrowDown');
        });

        it('should not call listener', () => { expect(highlightStub).not.toHaveBeenCalled(); });
        it('should not emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(0); });
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(async () => {
          await keyDown('ArrowUp');
        });

        it('should not call listener', () => { expect(highlightStub).not.toHaveBeenCalled(); });
        it('should not emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(0); });
      });

      describe('When home button is pressed', () => {
        beforeEach(async () => {
          await keyDown('Home');
        });

        it('should not call listener', () => { expect(highlightStub).not.toHaveBeenCalled(); });
        it('should not emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(0); });
      });

      describe('When end button is pressed', () => {
        beforeEach(async () => {
          await keyDown('End');
        });

        it('should not call listener', () => { expect(highlightStub).not.toHaveBeenCalled(); });
        it('should not emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(0); });
      });
    });

    // Vue's count is 3: its helper calls the combobox's `onOpen` itself, then the popover calls it again, and each sets
    // the initial highlight. Here only the popover opens the list: one highlight from that, one from the key.
    describe('When the list is empty', () => {
      beforeEach(async () => {
        slots = { input: inputSlotWithId, list: ({ listProps }) => <ol {...listProps} /> };
        mountWrapper();
        await setProps({ showList: true, emptyList: true, emptyStateMessage: 'empty' });
        await openComboboxPopover();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(async () => {
          await keyDown('Escape');
        });

        it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
        it('should emit escape event', () => { expect(escapeStub).toHaveBeenCalledTimes(1); });
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(async () => {
          await keyDown('Enter');
        });

        it('should not call listener', () => { expect(selectStub).not.toHaveBeenCalled(); });
        it('should not emit select event', () => { expect(selectStub).toHaveBeenCalledTimes(0); });
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(async () => {
          await keyDown('ArrowDown');
        });

        it('should call listener', () => { expect(highlightStub).toHaveBeenCalled(); });
        it('should emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(2); });
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(async () => {
          await keyDown('ArrowUp');
        });

        it('should call listener', () => { expect(highlightStub).toHaveBeenCalled(); });
        it('should emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(2); });
      });

      describe('When home button is pressed', () => {
        beforeEach(async () => {
          await keyDown('Home');
        });

        it('should call listener', () => { expect(highlightStub).toHaveBeenCalled(); });
        it('should emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(2); });
      });

      describe('When end button is pressed', () => {
        beforeEach(async () => {
          await keyDown('End');
        });

        it('should call listener', () => { expect(highlightStub).toHaveBeenCalled(); });
        it('should emit highlight event', () => { expect(highlightStub).toHaveBeenCalledTimes(2); });
      });
    });

    describe('When the list is shown', () => {
      beforeEach(async () => {
        await openComboboxPopover();
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it('should emit open event', () => { expect(openedStub).toHaveBeenCalledTimes(1); });
    });

    describe('When the list is closed', () => {
      beforeEach(async () => {
        await openComboboxPopover();
        await setProps({ showList: false });
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it('should emit open event', () => { expect(openedStub).toHaveBeenCalledTimes(2); });
    });

    describe('When "Enter" key is pressed but the combobox is not open', () => {
      beforeEach(async () => {
        await keyDown('Enter');
      });

      it('should not call listener', () => { expect(selectStub).not.toHaveBeenCalled(); });
      it('should not emit select event', () => { expect(selectStub).toHaveBeenCalledTimes(0); });
    });

    describe('When "Enter" key is pressed and the first item is highlighted', () => {
      beforeEach(async () => {
        await openComboboxPopover();
        await keyDown('Enter');
      });

      it('should call listener', () => { expect(selectStub).toHaveBeenCalled(); });
      it('should emit select event', () => { expect(selectStub).toHaveBeenCalledTimes(1); });
    });

    describe('When "Esc" key is pressed', () => {
      beforeEach(async () => {
        await openComboboxPopover();
        await keyDown('Escape');
      });

      it('should call listener', () => { expect(escapeStub).toHaveBeenCalled(); });
      it('should emit escape event', () => { expect(escapeStub).toHaveBeenCalledTimes(1); });
    });

    describe('When visually hidden close button is clicked', () => {
      beforeEach(async () => {
        await openComboboxPopover();
        const closeButton = getPopoverContent().parentElement
          ?.querySelector<HTMLElement>('[data-qa="dt-sr-only-close-button"]');
        await act(async () => { fireEvent.click(closeButton as HTMLElement); });
        await finishTransitions();
        await act(async () => {});
      });

      it('should call listener', () => { expect(openedStub).toHaveBeenCalled(); });
      it('should emit open event', () => { expect(openedStub).toHaveBeenCalledTimes(2); });
    });
  });

  describe('Uncontrolled list (React-only)', () => {
    beforeEach(async () => {
      slots = {
        input: inputSlotWithId,
        list: listSlotWithItem,
        footer: <button type="button" data-qa="footer-button">Footer</button>,
      };
      mountWrapper();
    });

    const focusInput = async () => {
      await act(async () => { getInput()?.focus(); });
      await finishTransitions();
      await act(async () => {});
    };

    it('opens the list when the input is focused', async () => {
      await focusInput();
      expect(getInput()).toHaveAttribute('aria-expanded', 'true');
      expect(openedStub).toHaveBeenLastCalledWith(true);
    });

    it('keeps the list open on a mousedown inside the popover', async () => {
      await focusInput();
      await act(async () => { fireEvent.mouseDown(screen.getByTestId('footer-button')); });
      expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes the list on a mousedown outside', async () => {
      await focusInput();
      await act(async () => { fireEvent.mouseDown(document.body); });
      expect(getInput()).toHaveAttribute('aria-expanded', 'false');
      expect(openedStub).toHaveBeenLastCalledWith(false);
    });

    it('closes the list and calls onEscape on Escape', async () => {
      await focusInput();
      await keyDown('Escape');
      expect(escapeStub).toHaveBeenCalledTimes(1);
      expect(getInput()).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not select from a keydown inside the popover content, which React bubbles through the portal', async () => {
      await focusInput();
      await act(async () => { fireEvent.keyDown(screen.getByTestId('footer-button'), { key: 'Enter' }); });
      expect(selectStub).not.toHaveBeenCalled();
    });

    it('opens on an arrow key when openWithArrowKeys is set', async () => {
      props = { ...baseProps, hasSuggestionList: false, openWithArrowKeys: true };
      mountWrapper();
      await act(async () => { fireEvent.keyDown(getInput() as HTMLElement, { key: 'ArrowDown' }); });
      expect(getInput()).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('When dialogClass is provided', () => {
    // Popover teleports to body, so query body directly via data-qa
    // (same pattern as tooltip/split_button/hovercard tests).
    let dialog: HTMLElement | null;

    beforeEach(async () => {
      props = { ...baseProps, dialogClass: 'custom-dialog-class' };
      mountWrapper();
      await openComboboxPopover();
      dialog = document.body.querySelector('[data-qa="dt-popover"]');
    });

    it('should render the popover dialog element', () => {
      expect(dialog).not.toBeNull();
    });

    it('should apply the class to the popover dialog element', () => {
      expect(dialog?.classList.contains('custom-dialog-class')).toBe(true);
    });
  });
});
