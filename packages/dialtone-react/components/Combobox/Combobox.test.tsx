import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { DtCombobox, type DtComboboxInputProps, type DtComboboxProps } from './Combobox';

const MOCK_SELECT_STUB = vi.fn();
const MOCK_ESCAPE_STUB = vi.fn();
const MOCK_HIGHLIGHT_STUB = vi.fn();
const MOCK_OPENED_STUB = vi.fn();
const MOCK_INPUT_PROPS_STUB = vi.fn();

type Props = Partial<DtComboboxProps>;

const baseProps: DtComboboxProps = {
  label: 'Label Text',
  showLabel: true,
  size: 'md',
  description: '',
  listId: 'list',
  showList: true,
  loading: false,
};
const baseAttrs: Props = {
  onSelect: MOCK_SELECT_STUB,
  onEscape: MOCK_ESCAPE_STUB,
  onHighlight: MOCK_HIGHLIGHT_STUB,
  onOpened: MOCK_OPENED_STUB,
};
const baseSlots: Props = {};

let mockProps: Props = {};
let mockSlots: Props = {};
let mockAttrs: Props = {};

// DtInput isn't ported yet: this stands in for it as the Vue tests use it, binding `inputProps` the way DtInput
// does (its own props, then the rest on the native input) and recording them.
type TestInputProps = DtComboboxInputProps & Omit<ComponentPropsWithoutRef<'input'>, keyof DtComboboxInputProps>;
function TestInput ({ label, showLabel, size: _size, description, ...attrs }: TestInputProps) {
  MOCK_INPUT_PROPS_STUB({ label, showLabel, size: _size, description, ...attrs });
  return (
    <div data-qa="dt-input">
      <label>
        {showLabel && label ? <span>{label}</span> : null}
        {description ? <div>{description}</div> : null}
        <input aria-label={!showLabel && label ? label : undefined} {...attrs} />
      </label>
    </div>
  );
}

const inputSlot: Props = { input: ({ inputProps }) => <TestInput {...inputProps} /> };

describe('DtCombobox Tests', () => {
  let container: HTMLElement;
  let rerender: (ui: ReactElement) => void;
  let unmount: (() => void) | undefined;
  let currentProps: DtComboboxProps;

  const tree = (props: DtComboboxProps) => <DtCombobox {...props} />;

  // Vue's mount gives a new wrapper each time; the previous render is unmounted, so queries find this one.
  const updateWrapper = () => {
    unmount?.();
    currentProps = { ...baseProps, ...mockProps, ...baseAttrs, ...mockAttrs, ...baseSlots, ...mockSlots };
    ({ container, rerender, unmount } = render(tree(currentProps)));
  };

  // Vue's `wrapper.setProps`.
  const setProps = (props: Props) => {
    currentProps = { ...currentProps, ...props };
    rerender(tree(currentProps));
  };

  const getRoot = () => container.firstElementChild as HTMLElement;
  const queryInputWrapper = () => screen.queryByTestId('dt-combobox-input-wrapper');
  const queryInput = () => screen.queryByRole('combobox');
  const queryListWrapper = () => screen.queryByTestId('dt-combobox-list-wrapper');
  const querySkeletons = () => screen.queryAllByTestId('skeleton-text-body');
  const queryEmptyList = () => screen.queryByTestId('dt-combobox-empty-list');
  const lastInputProps = () => MOCK_INPUT_PROPS_STUB.mock.lastCall?.[0] as DtComboboxInputProps;

  const keyDown = (key: string, init: KeyboardEventInit = {}) => {
    fireEvent.keyDown(getRoot(), { key, ...init });
  };

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    // Testing Library unmounts after each test.
    unmount = undefined;
    mockAttrs = {};
    mockProps = {};
    mockSlots = {};
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(getRoot()).toBeInTheDocument();
    });

    describe('When a input is provided', () => {
      beforeEach(() => {
        mockSlots = inputSlot;

        updateWrapper();
      });

      it('should render the input wrapper', () => {
        expect(queryInputWrapper()).toBeInTheDocument();
      });

      it('should render the input', () => {
        expect(queryInput()).toBeInTheDocument();
      });
    });

    describe('When label is provided', () => {
      beforeEach(() => {
        mockSlots = inputSlot;

        updateWrapper();
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

      describe('If label visible prop is false', () => {
        it('should still set aria-label even if label visible is false', () => {
          setProps({ showLabel: false });

          expect(queryInput()).toHaveAttribute('aria-label', baseProps.label);
        });
      });
    });

    describe('When a list is provided', () => {
      beforeEach(() => {
        mockSlots = { list: <ol id="list"></ol> };

        updateWrapper();
      });

      it('should render the list wrapper', () => {
        expect(queryListWrapper()).toBeInTheDocument();
      });

      it('should render the list', () => {
        expect(container.querySelector('#list')).toBeInTheDocument();
      });
    });

    describe('When the list is empty', () => {
      beforeEach(() => {
        mockSlots = { list: <ol id="list"></ol> };
        mockProps = {
          showList: true,
          emptyList: true,
          emptyStateMessage: 'empty',
          emptyStateClass: 'class',
        };

        updateWrapper();
      });

      it('should render the empty list', () => {
        expect(queryEmptyList()).toBeInTheDocument();
      });

      it('should apply the class to the empty list element', () => {
        expect(queryEmptyList()!.querySelector('.d-combobox__empty-list-item')).toHaveClass('class');
      });
    });

    describe('When it is loading', () => {
      it('should render the loading skeletons', () => {
        mockSlots = { list: <ol id="list"><li role="option">item1</li><li role="option">item2</li></ol> };
        mockProps = { loading: true };

        updateWrapper();

        expect(querySkeletons().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('When a input is provided', () => {
      beforeEach(() => {
        mockSlots = inputSlot;

        updateWrapper();
      });

      describe('When list is not expanded', () => {
        it('aria-expanded should be "false"', () => {
          setProps({ showList: false });

          expect(queryInput()).toHaveAttribute('aria-expanded', 'false');
        });
      });

      describe('When list is expanded', () => {
        it('aria-expanded should be "true"', () => {
          mockProps = { showList: true };

          updateWrapper();

          expect(queryInput()).toHaveAttribute('aria-expanded', 'true');
        });

        describe('When list is loading', () => {
          it('aria-busy should be "true"', () => {
            setProps({ loading: true });

            expect(queryListWrapper()!.querySelector('ol')).toHaveAttribute('aria-busy', 'true');
          });
        });
      });
    });
  });

  describe('Interactivity Tests', () => {
    beforeEach(() => {
      mockSlots = { list: <ol id="list"><li role="option">item1</li><li role="option">item2</li></ol> };

      updateWrapper();
    });

    describe('When the list is empty', () => {
      beforeEach(() => {
        mockSlots = { list: <ol id="list"></ol> };

        updateWrapper();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(() => {
          keyDown('Escape');
        });

        it('should call listener', () => {
          expect(MOCK_ESCAPE_STUB).toHaveBeenCalled();
        });

        it('should emit escape event', () => {
          expect(MOCK_ESCAPE_STUB).toHaveBeenCalledTimes(1);
        });
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(() => {
          keyDown('Enter');
        });

        it('should not call listener', () => {
          expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit select event', () => {
          expect(MOCK_SELECT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(() => {
          keyDown('ArrowDown');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(() => {
          keyDown('ArrowUp');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When home button is pressed', () => {
        beforeEach(() => {
          keyDown('Home');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When end button is pressed', () => {
        beforeEach(() => {
          keyDown('End');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });
    });

    describe('When the list is loading', () => {
      beforeEach(() => {
        mockProps = { loading: true };

        updateWrapper();
      });

      describe('When "Esc" key is pressed', () => {
        beforeEach(() => {
          keyDown('Escape');
        });

        it('should call listener', () => {
          expect(MOCK_ESCAPE_STUB).toHaveBeenCalled();
        });

        it('should emit escape event', () => {
          expect(MOCK_ESCAPE_STUB).toHaveBeenCalledTimes(1);
        });
      });

      describe('When "Enter" key is pressed', () => {
        beforeEach(() => {
          keyDown('Enter');
        });

        it('should not call listener', () => {
          expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit select event', () => {
          expect(MOCK_SELECT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When down arrow button is pressed', () => {
        beforeEach(() => {
          keyDown('ArrowDown');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When up arrow button is pressed', () => {
        beforeEach(() => {
          keyDown('ArrowUp');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When home button is pressed', () => {
        beforeEach(() => {
          keyDown('Home');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });

      describe('When end button is pressed', () => {
        beforeEach(() => {
          keyDown('End');
        });

        it('should not call listener', () => {
          expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(0);
        });

        it('should not emit highlight event', () => {
          expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();
        });
      });
    });

    describe('When the list is shown', () => {
      beforeEach(() => {
        setProps({ showList: false });
        setProps({ showList: true });
      });

      it('should call listener', () => {
        expect(MOCK_OPENED_STUB).toHaveBeenCalled();
      });

      it('should emit open event', () => {
        expect(MOCK_OPENED_STUB).toHaveBeenCalledTimes(2);
      });
    });

    describe('When the list is closed', () => {
      beforeEach(() => {
        setProps({ showList: false });
      });

      it('should call listener', () => {
        expect(MOCK_OPENED_STUB).toHaveBeenCalled();
      });

      it('should emit open event', () => {
        expect(MOCK_OPENED_STUB).toHaveBeenCalledTimes(1);
      });
    });

    // Vue sets highlightIndex through setData; here nothing is highlighted yet, or the keyboard highlights the
    // item, as a user would.
    describe('When "Enter" key is pressed but no item is highlighted', () => {
      beforeEach(() => {
        keyDown('Enter');
      });

      it('should not call listener', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
      });

      it('should not emit select event', () => {
        expect(MOCK_SELECT_STUB).not.toHaveBeenCalled();
      });
    });

    describe('When "Enter" key is pressed and item is highlighted', () => {
      beforeEach(() => {
        keyDown('ArrowDown');
        keyDown('ArrowDown');
        keyDown('Enter');
      });

      it('should call listener', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalledWith(1);
      });

      it('should emit select event', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(1);
      });
    });

    describe('When "Enter" key is pressed with another key and item is highlighted', () => {
      beforeEach(() => {
        keyDown('ArrowDown');
        keyDown('ArrowDown');
        keyDown('Enter', { shiftKey: true });
      });

      it('should not call listener', () => {
        expect(MOCK_SELECT_STUB).toHaveBeenCalledTimes(0);
      });

      it('should not emit select event', () => {
        expect(MOCK_SELECT_STUB).not.toHaveBeenCalled();
      });
    });

    describe('When "Esc" key is pressed', () => {
      beforeEach(() => {
        keyDown('Escape');
      });

      it('should call listener', () => {
        expect(MOCK_ESCAPE_STUB).toHaveBeenCalled();
      });

      it('should emit escape event', () => {
        expect(MOCK_ESCAPE_STUB).toHaveBeenCalledTimes(1);
      });
    });

    describe('When the highlightIndex changes', () => {
      beforeEach(() => {
        keyDown('ArrowDown');
      });

      it('should call listener', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalled();
      });

      it('should emit highlight event', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledTimes(1);
      });
    });

    // In Vue, nothing is highlighted before the mouse leaves, so the index was already -1. Highlighting an item
    // first makes the test able to fail; the reset is reported through the highlight event.
    describe('When mouseleave is detected on the list wrapper', () => {
      beforeEach(() => {
        keyDown('ArrowDown');
        MOCK_HIGHLIGHT_STUB.mockClear();
        fireEvent.mouseLeave(queryListWrapper()!);
      });

      it('should reset the highlightIndex', () => {
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledExactlyOnceWith(-1);
      });
    });

    describe('When focusout is detected on the list wrapper', () => {
      it('should reset the highlightIndex', () => {
        keyDown('ArrowDown');
        MOCK_HIGHLIGHT_STUB.mockClear();

        fireEvent.focusOut(queryListWrapper()!);

        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledExactlyOnceWith(-1);
      });
    });

    // When the list is rendered outside (e.g. in a popover), the list element is
    // unreachable until the popover's enter transition completes (DLT-3520).
    describe('When the list is rendered outside and its element is not reachable', () => {
      let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
        mockProps = { listRenderedOutside: true };
        mockSlots = { list: <div data-qa="popover-stub"></div> };

        updateWrapper();

        consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      });

      describe('When mouseleave is detected on the list wrapper', () => {
        it('should not log an error', () => {
          fireEvent.mouseLeave(queryListWrapper()!);

          expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
      });

      describe('When loading changes', () => {
        it('should not log an error', () => {
          setProps({ loading: true });
          setProps({ loading: false });

          expect(consoleErrorSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('React-only Tests', () => {
    const items = (
      <ol id="list">
        <li id="item1" role="option">item1</li>
        <li id="item2" role="option">item2</li>
      </ol>
    );

    describe('When the list opens', () => {
      it('should highlight the first item', () => {
        mockSlots = { ...inputSlot, list: items };
        mockProps = { showList: false };
        updateWrapper();

        setProps({ showList: true });

        expect(MOCK_OPENED_STUB).toHaveBeenCalledWith(true);
        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(0);
        expect(queryInput()).toHaveAttribute('aria-activedescendant', 'item1');
      });
    });

    describe('When the mouse moves over an item', () => {
      it('should highlight that item', () => {
        mockSlots = { ...inputSlot, list: items };
        updateWrapper();

        fireEvent.mouseMove(screen.getByText('item2'));

        expect(MOCK_HIGHLIGHT_STUB).toHaveBeenCalledWith(1);
        expect(queryInput()).toHaveAttribute('aria-activedescendant', 'item2');
      });
    });

    describe('When clickOnSelect is set and "Enter" is pressed on a highlighted item', () => {
      it('should click the item', () => {
        const onClick = vi.fn();
        mockSlots = {
          list: (
            <ol id="list">
              <li id="item1" role="option" onClick={onClick}>item1</li>
            </ol>
          ),
        };
        mockProps = { clickOnSelect: true };
        updateWrapper();

        keyDown('ArrowDown');
        keyDown('Enter');

        expect(MOCK_SELECT_STUB).toHaveBeenCalledWith(0);
        expect(onClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('When the list slot is given a list rendered outside', () => {
      it('should navigate that list once opened', () => {
        const outside = document.createElement('ol');
        outside.innerHTML = '<li id="out1" role="option">out1</li><li id="out2" role="option">out2</li>';
        document.body.appendChild(outside);
        let opened: ((open: boolean, contentRef?: HTMLElement | null) => void) | undefined;
        mockProps = { listRenderedOutside: true };
        mockSlots = {
          ...inputSlot,
          list: scope => {
            opened = scope.opened;
            return null;
          },
        };
        updateWrapper();

        fireEvent(outside, new MouseEvent('mousemove'));
        expect(MOCK_HIGHLIGHT_STUB).not.toHaveBeenCalled();

        act(() => opened!(true, outside));
        expect(MOCK_OPENED_STUB).toHaveBeenCalledWith(true);
        expect(queryInput()).toHaveAttribute('aria-activedescendant', 'out1');

        fireEvent.mouseMove(outside.querySelector('#out2')!);
        expect(queryInput()).toHaveAttribute('aria-activedescendant', 'out2');

        outside.remove();
      });
    });

    describe('When emptyList is set without emptyStateMessage', () => {
      it('should log an error once', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        mockProps = { emptyList: true };
        updateWrapper();

        setProps({ showLabel: false });

        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('When an emptyListItem slot is provided', () => {
      it('should render it in the empty list', () => {
        mockProps = { emptyList: true };
        mockSlots = { emptyListItem: <li role="option">Nothing here</li> };
        updateWrapper();

        expect(queryEmptyList()).toHaveTextContent('Nothing here');
        expect(queryEmptyList()).toHaveAttribute('role', 'listbox');
      });
    });
  });
});
