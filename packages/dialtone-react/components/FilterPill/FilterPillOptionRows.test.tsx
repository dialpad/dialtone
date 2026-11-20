import { act, cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { useState } from 'react';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtFilterPill, type DtFilterPillProps } from './FilterPill';
import type { DtFilterPillOption } from './FilterPillSelection';

const typeOptions: readonly DtFilterPillOption[] = Object.freeze([
  Object.freeze({ value: 'all', label: 'All types' }),
  Object.freeze({ value: 'calls', label: 'Calls', description: 'Includes voicemail' }),
  Object.freeze({
    value: 'archived', label: 'Archived', disabled: true, description: 'Choose All under Status to view archived items',
  }),
]);

const groupedOptions: readonly DtFilterPillOption[] = Object.freeze([
  Object.freeze({ value: 'all', label: 'All types' }),
  Object.freeze({ value: 'calls', label: 'Calls', description: 'Includes voicemail' }),
  Object.freeze({ value: 'archived', label: 'Archived', disabled: true, group: 'Other views' }),
  Object.freeze({ value: 'spam', label: 'Spam', group: 'Other views' }),
]);

const ACTION_CALLBACKS = ['onSelectedChange', 'onSelectionChange', 'onClear', 'onApply', 'onOpen', 'onOpenChange'] as const;
const reconcile = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
// Real transitions end two animation frames after they start; the overlay reports opened once they have.
const settle = async () => {
  await finishTransitions();
  await reconcile();
};
const keydown = (key: string, code = key) => new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true });

describe('DtFilterPill built-in dropdown option rows', () => {
  let result: Pick<RenderResult, 'unmount'> | undefined;
  let hadScrollLock: boolean;
  let calls: Record<string, unknown[][]>;
  let setLiveOptions: ((options: readonly DtFilterPillOption[]) => void) | undefined;

  // Every action callback records what it got, as Vue's emitted() does.
  const recorders = () => {
    return Object.fromEntries(ACTION_CALLBACKS.map(name => [name, (...args: unknown[]) => {
      (calls[name] ??= []).push(args);
    }])) as Pick<DtFilterPillProps, typeof ACTION_CALLBACKS[number]>;
  };

  const updateWrapper = (props: Partial<DtFilterPillProps> = {}) => {
    result = render(
      <DtFilterPill
        label="Type"
        useDropdown
        options={typeOptions}
        selected="all"
        {...recorders()}
        {...props}
      />,
      { container: document.body.appendChild(document.createElement('div')) },
    );
  };
  const mountWithLiveOptions = (liveOptions: readonly DtFilterPillOption[]) => {
    const Live = () => {
      const [current, setCurrent] = useState(liveOptions);
      setLiveOptions = setCurrent;
      return (
        <DtFilterPill
          label="Type"
          useDropdown
          options={current}
          selected="all"
          {...recorders()}
        />
      );
    };
    result = render(<Live />, { container: document.body.appendChild(document.createElement('div')) });
  };
  // Dropdown takes its keyboard position from the pointer highlight, so set both before pressing keys.
  const focusRow = (row: HTMLElement) => {
    fireEvent.mouseMove(row);
    row.focus();
  };
  const focusedLabelAfter = async (key: string) => {
    await act(async () => { document.activeElement?.dispatchEvent(keydown(key)); });
    await reconcile();
    return document.activeElement?.querySelector('[data-qa="dt-item-layout-title-wrapper"]')?.textContent?.trim();
  };
  const anchor = () => screen.getByTestId('dt-filter-pill__button');
  const open = async () => {
    await act(async () => { fireEvent.click(anchor()); });
    await settle();
  };
  const rows = () => [...document.querySelectorAll<HTMLElement>('[data-qa="dt-filter-pill__option"]')];
  const actions = () => Object.fromEntries(Object.entries(calls).filter(([name, args]) =>
    (ACTION_CALLBACKS as readonly string[]).includes(name) && args.length));
  const descriptionOf = (row: HTMLElement) =>
    document.getElementById(row.getAttribute('aria-describedby') ?? '')?.textContent ?? null;
  // A row's accessible name, in accname order: aria-labelledby, then aria-label, then its content minus aria-hidden subtrees.
  const accessibleNameOf = (row: HTMLElement) => {
    const labelledBy = row.getAttribute('aria-labelledby');
    if (labelledBy) return labelledBy.split(' ').map(id => document.getElementById(id)?.textContent?.trim()).join(' ');
    if (row.hasAttribute('aria-label')) return row.getAttribute('aria-label');
    const content = row.cloneNode(true) as HTMLElement;
    content.querySelectorAll('[aria-hidden="true"]').forEach(hidden => hidden.remove());
    return content.textContent?.replace(/\s+/g, ' ').trim();
  };

  beforeEach(() => {
    hadScrollLock = document.documentElement.classList.contains('d-of-hidden');
    calls = {};
  });

  afterEach(() => {
    result?.unmount();
    result = undefined;
    cleanup();
    document.body.innerHTML = '';
    document.documentElement.classList.toggle('d-of-hidden', hadScrollLock);
    vi.restoreAllMocks();
  });

  describe('Availability and descriptions', () => {
    it('disables only the flagged row', async () => {
      updateWrapper();
      await open();
      expect(rows().map(row => row.getAttribute('aria-disabled'))).toEqual([null, null, 'true']);
    });

    it('describes rows with their visible explanation, kept out of the accessible name', async () => {
      updateWrapper();
      await open();
      expect(rows().map(descriptionOf)).toEqual([null, 'Includes voicemail', 'Choose All under Status to view archived items']);
      expect(rows().map(accessibleNameOf)).toEqual(['All types', 'Calls', 'Archived']);
    });

    it('styles every built-in row disabled while the selection is unusable', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      updateWrapper({ selected: ['calls'] });
      await open();
      expect(rows().map(row => row.classList.contains('d-list-item--disabled'))).toEqual([true, true, true]);
    });
  });

  describe('Activation', () => {
    it.each([
      { input: 'pointer', activate: (row: HTMLElement) => fireEvent.click(row) },
      { input: 'Enter', activate: (row: HTMLElement) => row.dispatchEvent(keydown('Enter')) },
      { input: 'Space', activate: (row: HTMLElement) => row.dispatchEvent(keydown(' ', 'Space')) },
    ])('refuses $input activation of a disabled row and stays open with focus on it', async ({ activate }) => {
      updateWrapper();
      await open();
      const archived = rows()[2];
      archived.focus();
      await act(async () => { activate(archived); });
      await reconcile();
      expect(actions()).toEqual({ onOpen: [[true]] });
      expect(anchor()).toHaveAttribute('aria-expanded', 'true');
      expect(document.activeElement).toBe(archived);
    });

    it('opens by keyboard onto a disabled first row, so focus and keyboard position agree', async () => {
      updateWrapper({ options: [typeOptions[2], typeOptions[0], typeOptions[1]] });
      await act(async () => { fireEvent.keyDown(anchor(), { key: 'ArrowDown', code: 'ArrowDown' }); });
      await settle();
      expect(document.activeElement).toBe(rows()[0]);
      expect(await focusedLabelAfter('ArrowDown')).toBe('All types');
    });

    // Vue emits click from the DtListItem component itself (`.vm.$emit`); the React row is a DOM element whose own
    // handler refuses a disabled row, so the intent is a click on it.
    it.skip('refuses a disabled option even when its row emits click', () => {});

    it('clears to the neutral value even when its option is disabled', async () => {
      updateWrapper({
        neutralValue: 'all',
        selected: 'calls',
        options: [{ ...typeOptions[0], disabled: true }, typeOptions[1], typeOptions[2]],
      });
      await act(async () => { fireEvent.click(screen.getByTestId('dt-filter-pill__clear-button')); });
      await reconcile();
      expect(actions()).toEqual({
        onSelectedChange: [['all']],
        onSelectionChange: [[{ value: 'all', previousValue: 'calls', reason: 'clear', changed: true }]],
        onClear: [[expect.objectContaining({ type: 'click' })]],
      });
    });
  });

  describe('Committed state', () => {
    it('keeps a selected option checked and labeled after it becomes disabled, and refuses reselecting it', async () => {
      const Parent = () => {
        const [current, setCurrent] = useState(typeOptions);
        setLiveOptions = setCurrent;
        return (
          <DtFilterPill
            label="Type"
            useDropdown
            options={current}
            selected="calls"
            {...recorders()}
          />
        );
      };
      result = render(<Parent />, { container: document.body.appendChild(document.createElement('div')) });
      await open();
      await act(async () => {
        setLiveOptions?.([typeOptions[0], { ...typeOptions[1], disabled: true }, typeOptions[2]]);
      });
      await reconcile();
      const calling = rows()[1];
      expect(calling.getAttribute('aria-checked')).toBe('true');
      expect(screen.getByTestId('dt-filter-pill__label-start')).toHaveTextContent('Calls');
      // Same-value activation of the selected row must be refused too.
      await act(async () => { fireEvent.click(calling); });
      await reconcile();
      expect(actions()).toEqual({ onOpen: [[true]] });
    });
  });

  describe('Keyboard position', () => {
    it('starts again from the first row after every row disappeared and came back', async () => {
      mountWithLiveOptions(typeOptions);
      await open();
      focusRow(rows()[1]);
      await act(async () => { setLiveOptions?.([]); });
      await reconcile();
      await act(async () => { setLiveOptions?.(typeOptions); });
      await reconcile();
      // Vue clears the dropdown's index when no row is left, so the next ArrowDown lands on the first row.
      const first = rows()[0].querySelector('[data-qa="dt-item-layout-title-wrapper"]')?.textContent?.trim();
      expect(await focusedLabelAfter('ArrowDown')).toBe(first);
    });
  });

  describe('Grouping', () => {
    it('renders consecutive grouped options as one labelled group inside a presentational list item', async () => {
      updateWrapper({ options: groupedOptions });
      await open();
      const group = document.querySelector('[role="group"]') as HTMLElement;
      expect(rows().map(row => row.parentElement?.getAttribute('role'))).toEqual(['none', 'none', 'group', 'group']);
      expect(document.getElementById(group.getAttribute('aria-labelledby') ?? '')?.textContent?.trim()).toBe('Other views');
      // A list item wraps the group, and it sits in the same list as the ungrouped rows.
      expect(group.parentElement?.matches('li[role="none"]')).toBe(true);
      expect(group.parentElement?.parentElement).toBe(rows()[0].parentElement);
    });

    it('moves through rows across group boundaries in DOM order with arrows and Home', async () => {
      updateWrapper({ options: groupedOptions });
      await open();
      focusRow(rows()[0]);
      expect(await focusedLabelAfter('ArrowDown')).toBe('Calls');
      expect(await focusedLabelAfter('ArrowDown')).toBe('Archived');
      expect(await focusedLabelAfter('ArrowDown')).toBe('Spam');
      expect(await focusedLabelAfter('ArrowUp')).toBe('Archived');
      expect(await focusedLabelAfter('ArrowUp')).toBe('Calls');
    });

    it('keeps focus on a row that moves into a group while open', async () => {
      mountWithLiveOptions(groupedOptions);
      await open();
      const calling = rows()[1];
      focusRow(calling);
      // Calls also moves from index 1 to 2, so ArrowDown proves the keyboard position followed it.
      const [all, callsOption, archived, spam] = groupedOptions;
      await act(async () => { setLiveOptions?.([all, archived, { ...callsOption, group: 'Other views' }, spam]); });
      await reconcile();
      await finishTransitions();
      expect(document.activeElement?.id).toBe(calling.id);
      expect(document.activeElement?.parentElement?.getAttribute('role')).toBe('group');
      expect(await focusedLabelAfter('ArrowDown')).toBe('Spam');
      expect(actions()).toEqual({ onOpen: [[true]] });
    });
  });
});
