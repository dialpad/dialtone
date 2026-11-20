import { act, cleanup, fireEvent, render, screen, type RenderResult } from '@testing-library/react';
import { Suspense, startTransition, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { finishTransitions } from '../../tests/helpers/transition';
import { DtFilterPill, type DtFilterPillContentScope, type DtFilterPillProps } from './FilterPill';
import type { DtFilterPillOption } from './FilterPillSelection';

const options: readonly DtFilterPillOption[] = Object.freeze([
  Object.freeze({ value: 'sales', label: 'Sales' }),
  Object.freeze({ value: 'support', label: 'Support' }),
  Object.freeze({ value: 'engineering', label: 'Engineering' }),
]);

// Vue's emitted() names, as the React callbacks that report them.
const CALLBACKS: Record<string, keyof DtFilterPillProps> = {
  'update:selected': 'onSelectedChange',
  'selection-change': 'onSelectionChange',
  'update:open': 'onOpenChange',
  open: 'onOpen',
  opened: 'onOpened',
  clear: 'onClear',
  apply: 'onApply',
  'update:modelValue': 'onValueChange',
};

const reconcile = () => act(async () => { await Promise.resolve(); await Promise.resolve(); });
// Apply waits one task for React's scheduler before it reads the parent's selection.
const afterApply = () => act(async () => { await new Promise<void>(resolve => { setTimeout(resolve, 0); }); });
// Real transitions end two animation frames after they start; the overlay reports opened once they have.
const settle = async () => {
  await finishTransitions();
  await reconcile();
};
const keydown = (key: string, code = key) => new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true });
const anchorOf = () => screen.getByTestId('dt-filter-pill__button');
const checks = () => [...document.querySelectorAll<HTMLInputElement>('[data-qa="dt-filter-pill__checkbox"]')];
const optionRows = (root: ParentNode = document) =>
  [...root.querySelectorAll<HTMLElement>('[data-qa="dt-filter-pill__option"]')];
const labelText = () => screen.getByTestId('dt-filter-pill__label').textContent ?? '';
const nativeClick = (element: HTMLElement | null | undefined) => act(async () => { element?.click(); });
const open = () => act(async () => { fireEvent.click(anchorOf()); });

describe('DtFilterPill controlled selection', () => {
  let result: Pick<RenderResult, 'unmount' | 'rerender'> | undefined;
  let current: DtFilterPillProps = {};
  let calls: Record<string, unknown[][]> = {};
  let hadScrollLock: boolean;

  // wrapper.emitted(name): what the callback got, or undefined when it never ran.
  const emitted = (name: string) => calls[CALLBACKS[name]];

  const container = () => document.body.appendChild(document.createElement('div'));

  const recording = (extra: Partial<DtFilterPillProps> = {}) => {
    const out: Record<string, unknown> = {};
    for (const callback of new Set(Object.values(CALLBACKS))) {
      out[callback] = (...args: unknown[]) => {
        (calls[callback as string] ??= []).push(args);
        (extra as Record<string, ((...a: unknown[]) => void) | undefined>)[callback as string]?.(...args);
      };
    }
    return out as Partial<DtFilterPillProps>;
  };

  const updateWrapper = (props: Partial<DtFilterPillProps> = {}, extra: Partial<DtFilterPillProps> = {}) => {
    if (result) { result.unmount(); calls = {}; }
    current = { options, selected: Object.freeze(['sales']), label: 'Teams', ...props };
    result = render(<DtFilterPill {...current} {...recording(extra)} />, { container: container() });
    return result;
  };

  // wrapper.setProps(): the same pill with its props merged.
  const setProps = async (next: Partial<DtFilterPillProps>) => {
    current = { ...current, ...next };
    await act(async () => { result?.rerender(<DtFilterPill {...current} {...recording()} />); });
  };

  beforeEach(() => { hadScrollLock = document.documentElement.classList.contains('d-of-hidden'); calls = {}; });

  afterEach(() => {
    result?.unmount();
    result = undefined;
    cleanup();
    document.body.innerHTML = '';
    document.documentElement.classList.toggle('d-of-hidden', hadScrollLock);
    vi.restoreAllMocks();
  });

  it.each([
    { useDropdown: false, empty: false },
    { useDropdown: false, empty: true },
    { useDropdown: true, empty: false },
    { useDropdown: true, empty: true },
  ])('accepts option replacement on first open (dropdown=$useDropdown, empty=$empty)', async ({ useDropdown, empty }) => {
    let replace: ((next: readonly DtFilterPillOption[]) => void) | undefined;
    const Parent = () => {
      const [live, setLive] = useState(options);
      replace = setLive;
      return (
        <DtFilterPill
          label="Teams"
          options={live}
          selected={useDropdown ? null : []}
          useDropdown={useDropdown}
          {...recording({
            onOpen: (value: boolean) => {
              if (value) replace?.(empty ? [] : [{ value: 'replacement', label: 'Replacement' }]);
            },
          })}
        />
      );
    };
    result = render(<Parent />, { container: container() });
    await open();
    await settle();
    const rows = document.querySelectorAll<HTMLElement>(useDropdown
      ? '[data-qa="dt-filter-pill__option"]' : '[data-qa="dt-filter-pill__checkbox"]');
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'true');
    expect(rows).toHaveLength(empty ? 0 : 1);
    if (!empty) {
      expect(document.body.textContent).toContain('Replacement');
      await nativeClick(rows[0]);
      await reconcile();
      expect(emitted('update:selected')).toEqual([[useDropdown ? 'replacement' : ['replacement']]]);
    }
  });

  it('restores declined native checkbox intents without mutating frozen consumer data', async () => {
    const selected = Object.freeze(['sales']);
    updateWrapper({ selected });
    await open();
    const inputs = checks();
    expect(inputs.map(input => input.checked)).toEqual([true, false, false]);
    inputs[1].focus();
    await nativeClick(inputs[1]);
    await reconcile();
    expect(emitted('update:selected')).toEqual([[['sales', 'support']]]);
    expect(inputs.map(input => input.checked)).toEqual([true, false, false]);
    expect(document.activeElement).toBe(inputs[1]);
    expect(selected).toEqual(['sales']);
  });

  it('derives rapid rejected proposals from committed props and adopts only a later accepted snapshot', async () => {
    updateWrapper();
    await open();
    const inputs = checks();
    await nativeClick(inputs[1]);
    await nativeClick(inputs[2]);
    await reconcile();
    expect(emitted('update:selected')).toEqual([
      [['sales', 'support']], [['sales', 'engineering']],
    ]);
    expect(inputs.map(input => input.checked)).toEqual([true, false, false]);
    await setProps({ selected: Object.freeze(['sales', 'support']) });
    await reconcile();
    expect(inputs.map(input => input.checked)).toEqual([true, true, false]);
    expect(emitted('selection-change')).toHaveLength(2);
  });

  it('uses one controlled single-choice action path with neutral and short labels', async () => {
    const trace: unknown[] = [];
    const scalarOptions = Object.freeze([
      Object.freeze({ value: '', label: 'All Messages', shortLabel: 'All' }),
      Object.freeze({ value: 'calls', label: 'Calls Only', shortLabel: 'Calls' }),
    ]);
    updateWrapper({
      useDropdown: true, options: scalarOptions, selected: '', neutralValue: '', open: false, headerContent: 'Teams',
    }, {
      onSelectedChange: value => trace.push(['update', value]),
      onSelectionChange: action => trace.push(['action', action]),
      onOpenChange: value => trace.push(['visibility', value]),
      onOpen: value => trace.push(['open', value]),
    });
    expect(labelText()).toContain('All');
    expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeNull();
    await open();
    const rows = optionRows();
    expect(rows.map(row => row.getAttribute('role'))).toEqual(['menuitemradio', 'menuitemradio']);
    expect(rows.map(row => row.getAttribute('aria-checked'))).toEqual(['true', 'false']);
    expect(rows.every(row => row.querySelector('[data-qa="dt-item-layout-selected-wrapper"]'))).toBe(true);
    expect(document.querySelector('[role="menu"]')?.getAttribute('aria-label')).toBe('Teams');
    expect(document.querySelector('[role="menu"]')?.hasAttribute('aria-labelledby')).toBe(false);
    await nativeClick(rows[1]);
    await reconcile();
    expect(trace).toEqual([
      ['visibility', true], ['open', true], ['update', 'calls'],
      ['action', { value: 'calls', previousValue: '', reason: 'select', changed: true }],
      ['visibility', false], ['open', false],
    ]);
    // The declined proposal leaves the authoritative neutral selection intact.
    expect(labelText()).toContain('All');
    await setProps({ selected: 'calls' });
    expect(labelText()).toContain('Calls');
  });

  it('notifies deliberate same-value activation without a redundant selected update', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales' });
    await open();
    await nativeClick(document.querySelector<HTMLElement>('[data-qa="dt-filter-pill__option"]'));
    await reconcile();
    expect(emitted('update:selected')).toBeUndefined();
    expect(emitted('selection-change')).toEqual([[{
      value: 'sales', previousValue: 'sales', reason: 'select', changed: false,
    }]]);
  });

  it('keeps value IDs and focused rows stable through translated/reordered options', async () => {
    updateWrapper({ useDropdown: true, selected: 'support' });
    await open();
    await settle();
    const row = optionRows()[1];
    fireEvent.mouseMove(row);
    row.focus();
    expect(document.activeElement).toBe(row);
    const id = row.id;
    await setProps({ options: [
      { value: 'support', label: 'Assistance' }, { value: 'sales', label: 'Ventes' },
      { value: 'engineering', label: 'Engineering' },
    ] });
    await reconcile();
    expect(document.getElementById(id)).toBe(row);
    expect(document.activeElement).toBe(row);
    expect(row.textContent).toContain('Assistance');
    expect(row.getAttribute('aria-checked')).toBe('true');
    await act(async () => { row.dispatchEvent(keydown('ArrowDown')); });
    await reconcile();
    expect(document.activeElement?.textContent).toContain('Ventes');
    expect(row.getAttribute('aria-checked')).toBe('true');
    expect(emitted('selection-change')).toBeUndefined();
  });

  it.each(['parent-first', 'apply-first'])('rebases a dirty deferred draft before Apply when %s', async (order) => {
    let controls: DtFilterPillContentScope | undefined;
    let setParent: (next: string[]) => void = () => {};
    let latest: string[] = ['sales'];
    const Parent = () => {
      const [selected, setSelected] = useState<string[]>(['sales']);
      setParent = setSelected;
      latest = selected;
      return (
        <DtFilterPill
          label="Teams"
          options={options}
          selected={selected}
          deferSelection
          {...recording({ onSelectedChange: value => setSelected(value as string[]) })}
          content={(bindings: DtFilterPillContentScope) => {
            controls = bindings;
            return <button onClick={() => bindings.setSelected?.(['sales', 'support'])}>Edit draft</button>;
          }}
        />
      );
    };
    result = render(<Parent />, { container: container() });
    await open();
    await act(async () => { controls?.setSelected?.(['sales', 'support']); });
    await reconcile();
    if (order === 'parent-first') await act(async () => { setParent(['engineering']); });
    let applying: Promise<void> | void = undefined;
    await act(async () => {
      applying = controls?.apply();
      if (order === 'apply-first') flushSync(() => setParent(['engineering']));
    });
    expect(applying).toBeInstanceOf(Promise);
    await act(async () => { await applying; });
    expect(latest).toEqual(['engineering']);
    expect(emitted('update:selected')).toBeUndefined();
    expect(emitted('selection-change')).toEqual([[{
      value: ['engineering'], previousValue: ['engineering'], reason: 'apply', changed: false,
    }]]);
    expect(emitted('apply')).toEqual([[]]);
    expect(emitted('open')).toEqual([[true], [false]]);
  });

  it('rebases onto a parent write made in a promise callback before Apply proposes', async () => {
    let controls: DtFilterPillContentScope | undefined;
    let setParent: (next: string[]) => void = () => {};
    const Parent = () => {
      const [selected, setSelected] = useState<string[]>(['sales']);
      setParent = setSelected;
      return (
        <DtFilterPill
          label="Teams"
          options={options}
          selected={selected}
          deferSelection
          {...recording({ onSelectedChange: value => setSelected(value as string[]) })}
          content={(bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; }}
        />
      );
    };
    result = render(<Parent />, { container: container() });
    await open();
    await act(async () => { controls?.setSelected?.(['sales', 'support']); });
    await reconcile();
    // Outside act, React schedules the parent's update on its own scheduler, as in an app: it commits after the
    // microtasks Apply used to wait for.
    const env = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
    env.IS_REACT_ACT_ENVIRONMENT = false;
    try {
      const applying = controls!.apply();
      Promise.resolve().then(() => setParent(['engineering']));
      await applying;
      await new Promise(resolve => { setTimeout(resolve, 50); });
    } finally {
      env.IS_REACT_ACT_ENVIRONMENT = true;
    }
    expect((emitted('selection-change')?.[0][0] as { previousValue: unknown }).previousValue).toEqual(['engineering']);
  });

  it('preserves dirty draft through option additions, reorder, relabelling and removals', async () => {
    updateWrapper({ deferSelection: true });
    await open();
    await nativeClick(checks()[1]);
    await reconcile();
    await setProps({ selected: ['sales'], options: [
      options[1], { value: 'new', label: 'New team' }, options[0], options[2],
    ].map(option => ({ ...option, label: option.label + ' translated' })) });
    expect(checks().map(input => input.checked)).toEqual([true, false, true, false]);
    expect(labelText()).not.toContain('Support');
    // Unrelated removal preserves edits; removing a pending value retains its unknown identity too.
    await setProps({ options: [options[0], options[1]] });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, true]);
    await setProps({ options: [options[0]] });
    await nativeClick(document.querySelector<HTMLElement>('[data-qa="dt-filter-pill__apply-button"]'));
    await afterApply();
    expect(emitted('update:selected')).toEqual([[['sales', 'support']]]);
    expect((emitted('selection-change')?.[0][0])).toEqual({
      value: ['sales', 'support'], previousValue: ['sales'], reason: 'apply', changed: true,
    });
  });

  it('validates a retained setSelected against the current options', async () => {
    let controls: DtFilterPillContentScope | undefined;
    // Duplicate values make the options invalid, so nothing can be selected until the parent replaces them.
    updateWrapper({
      options: [options[0], options[0]],
      content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; },
    });
    await open();
    const retained = controls!.setSelected!;
    await setProps({ options });
    await act(async () => { retained(['support']); });
    expect(emitted('selection-change')).toHaveLength(1);
    expect((emitted('selection-change')?.[0][0] as { value: unknown }).value).toEqual(['support']);
  });

  it('releases the Apply guard when a consumer callback throws', async () => {
    let controls: DtFilterPillContentScope | undefined;
    let fail = true;
    updateWrapper({
      deferSelection: true,
      content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; },
    }, { onApply: () => { if (fail) throw new Error('boom'); } });
    await open();
    await act(async () => { controls?.setSelected?.(['support']); });
    await act(async () => { await expect(controls!.apply()).rejects.toThrow('boom'); });
    fail = false;
    await act(async () => { await controls!.apply(); });
    expect(emitted('apply')).toHaveLength(2);
  });

  it('lets a custom slot\'s layout effect act on the options of the commit that runs it', async () => {
    const duplicates: readonly DtFilterPillOption[] = [options[0], options[0]];
    const Probe = ({ valid, setSelected }: { valid: boolean; setSelected?: (next: string[]) => void }) => {
      // A child's layout effect runs before its parent's, in the commit that made the options valid. It runs only then:
      // setSelected is a new function every render, so listing it would let a later render hide a stale snapshot.
      const latest = useRef(setSelected);
      latest.current = setSelected;
      useLayoutEffect(() => { if (valid) latest.current?.(['support']); }, [valid]);
      return null;
    };
    let replace: (() => void) | undefined;
    const Parent = () => {
      const [current, setCurrent] = useState(duplicates);
      replace = () => setCurrent(options);
      return (
        <DtFilterPill
          label="Teams"
          options={current}
          selected={['sales']}
          {...recording()}
          content={(bindings: DtFilterPillContentScope) => (
            <Probe valid={current === options} setSelected={bindings.setSelected} />
          )}
        />
      );
    };
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    result = render(<Parent />, { container: container() });
    await open();
    await act(async () => { replace?.(); });
    expect(emitted('selection-change')).toHaveLength(1);
  });

  it('acts on the committed props while a transition render is suspended', async () => {
    const never = new Promise<void>(() => {});
    const Suspender = ({ block }: { block: boolean }) => { if (block) throw never; return null; };
    let start: (() => void) | undefined;
    const Parent = () => {
      const [disabled, setDisabled] = useState(false);
      const [block, setBlock] = useState(false);
      start = () => startTransition(() => { setDisabled(true); setBlock(true); });
      return (
        <Suspense fallback={null}>
          <DtFilterPill label="Teams" options={options} selected={['sales']} disabled={disabled} {...recording()} />
          <Suspender block={block} />
        </Suspense>
      );
    };
    result = render(<Parent />, { container: container() });
    await act(async () => { start?.(); });
    // The transition never commits: the pill on screen is still the enabled one, and Clear still works.
    expect(anchorOf()).not.toHaveAttribute('disabled');
    await nativeClick(screen.getByTestId('dt-filter-pill__clear-button'));
    expect(emitted('selection-change')).toHaveLength(1);
  });

  it('coalesces repeated Apply requests for one deferred session', async () => {
    let controls: DtFilterPillContentScope | undefined;
    updateWrapper({ deferSelection: true, content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; } });
    await open();
    await act(async () => { controls?.setSelected?.(['support']); });
    const apply = controls!.apply;
    await act(async () => { await Promise.all([apply(), apply()]); });
    await act(async () => { await apply(); });
    expect(emitted('selection-change')).toHaveLength(1);
    expect(emitted('apply')).toEqual([[]]);
  });

  it.each(['cancel', 'reopen', 'dispose'])('cancels an in-flight Apply on %s', async (boundary) => {
    let controls: DtFilterPillContentScope | undefined;
    const actions: unknown[] = [];
    const applies: string[] = [];
    updateWrapper({
      deferSelection: true,
      content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; },
    }, {
      onSelectionChange: action => actions.push(action), onApply: () => applies.push('apply'),
    });
    await open();
    await act(async () => { controls?.setSelected?.(['engineering']); });
    let pendingApply: Promise<void> | void;
    await act(async () => {
      pendingApply = controls?.apply();
      if (boundary === 'dispose') result?.unmount();
      else if (boundary === 'cancel') controls?.cancel();
      else {
        controls?.close();
        fireEvent.click(anchorOf());
      }
    });
    await act(async () => { await pendingApply; });
    expect(actions).toEqual([]);
    expect(applies).toEqual([]);
  });

  it('normalizes locked true once without reporting a visibility change and does not reopen on unlock', async () => {
    updateWrapper({ open: true, disabled: true });
    await reconcile();
    expect(emitted('update:open')).toEqual([[false]]);
    expect(emitted('open')).toBeUndefined();
    await setProps({ disabled: false });
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'false');
    await setProps({ open: false });
    await setProps({ open: true });
    expect(emitted('open')).toEqual([[true]]);
    await setProps({ readOnly: true });
    expect(emitted('update:open')).toEqual([[false], [false]]);
    expect(emitted('open')).toEqual([[true], [false]]);
  });

  it('stops Clear follow-up events when its action listener unmounts the instance', async () => {
    const trace: unknown[] = [];
    updateWrapper({}, {
      onSelectionChange: (action) => { trace.push(['action', action.reason]); result?.unmount(); },
      onOpen: value => trace.push(['open', value]),
      onClear: () => trace.push(['clear']),
    });
    await open();
    await nativeClick(screen.getByTestId('dt-filter-pill__clear-button'));
    await reconcile();
    expect(trace).toEqual([['open', true], ['action', 'clear']]);
  });

  it('keeps closed-clear focus until removal and restores the surviving anchor', async () => {
    updateWrapper({ selected: ['sales'] });
    const clear = screen.getByTestId('dt-filter-pill__clear-button');
    clear.focus();
    await nativeClick(clear);
    await reconcile();
    expect(document.activeElement).toBe(clear);
    await setProps({ selected: [] });
    await reconcile();
    expect(document.activeElement).toBe(anchorOf());
    expect(emitted('selection-change')?.[0][0]).toEqual({
      value: [], previousValue: ['sales'], reason: 'clear', changed: true,
    });
    await setProps({ selected: ['sales'] });
    screen.getByTestId('dt-filter-pill__clear-button').focus();
    await setProps({ readOnly: true });
    await reconcile();
    expect(document.activeElement).toBe(anchorOf());
  });

  it('keeps unknown selected values active and clearable without exposing raw identifiers', async () => {
    updateWrapper({ selected: ['private-id', 'sales'] });
    expect(labelText()).not.toContain('private-id');
    expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeInTheDocument();
    await open();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(emitted('selection-change')).toBeUndefined();
    await nativeClick(checks()[1]);
    await reconcile();
    expect(emitted('update:selected')).toEqual([[['private-id', 'sales', 'support']]]);
    await setProps({ selected: ['private-id'] });
    expect(screen.getByTestId('dt-filter-pill__label-end')).toHaveTextContent(/^Unavailable$/);
    expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeInTheDocument();
  });

  it.each([
    [[{ value: 'sales', label: 'Sales' }], ['sales'], 'Sales', ''],
    [options, ['engineering', 'support', 'sales'], 'All', ''],
    [options, ['private-id', 'engineering', 'support', 'sales'], 'Engineering', '+3'],
  ])('separates the dimension and resolved multiple summary for %j', (available, selected, summary, overflow) => {
    updateWrapper({ options: available, selected });
    expect(screen.getByTestId('dt-filter-pill__accessible-label').textContent).toContain(summary);
    expect(screen.getByTestId('dt-filter-pill__label-start')).toHaveTextContent(/^Teams$/);
    expect(screen.getByTestId('dt-filter-pill__label-start')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('dt-filter-pill__label-end')).toHaveTextContent(new RegExp(`^${summary}$`));
    expect(screen.getByTestId('dt-filter-pill__label-end')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('dt-filter-pill__accessible-label').textContent).toContain('Teams');
    expect(screen.queryByTestId('dt-filter-pill__overflow') !== null).toBe(Boolean(overflow));
    if (overflow) expect(screen.getByTestId('dt-filter-pill__overflow')).toHaveTextContent(overflow);
  });

  it.each([undefined, ''])('keeps an active summary without an empty dimension when label is %j', async (label) => {
    updateWrapper({ label });
    expect(screen.queryByTestId('dt-filter-pill__label-start')).toBeNull();
    expect(screen.getByTestId('dt-filter-pill__label-end')).toHaveTextContent(/^Sales$/);
    expect(screen.getByTestId('dt-filter-pill__accessible-label')).toHaveTextContent(/^Sales$/);
    await setProps({ selected: [] });
    expect(screen.getByTestId('dt-filter-pill__accessible-label')).toHaveTextContent(/^Filter$/);
  });

  it.each([false, true])('updates overlay naming and heading ownership when a parent changes content (dropdown=%s)', async (useDropdown) => {
    let setCustom: (next: boolean) => void = () => {};
    const warn = vi.spyOn(console, 'warn');
    const Parent = () => {
      const [custom, set] = useState(false);
      setCustom = set;
      const customContent: ReactNode = useDropdown
        ? (
          <li role="presentation">
            <h3 data-qa="custom-heading">Custom heading</h3>
            <div role="group" aria-label="Custom choices">Custom choices</div>
          </li>
        )
        : (
          <div role="presentation">
            <h3 data-qa="custom-heading">Custom heading</h3>
            <div role="group" aria-label="Custom choices">Custom choices</div>
          </div>
        );
      return (
        <DtFilterPill
          label="Teams"
          options={options}
          selected={useDropdown ? 'sales' : ['sales']}
          useDropdown={useDropdown}
          headerContent={<span data-qa="fallback-heading">Built-in heading</span>}
          content={custom ? customContent : undefined}
        />
      );
    };
    result = render(<Parent />, { container: container() });
    await open();
    const overlay = () => document.querySelector(useDropdown ? '[role="menu"]' : '[role="dialog"]') as HTMLElement;
    const initial = overlay();
    expect(initial.getAttribute('aria-label')).toBe('Teams');
    expect(initial.querySelectorAll('[data-qa="fallback-heading"]')).toHaveLength(1);
    for (const next of [true, false, true]) {
      await act(async () => { setCustom(next); });
      await reconcile();
      expect(overlay()).toBe(initial);
      expect(initial.getAttribute('aria-label')).toBe(next ? null : 'Teams');
      expect(initial.querySelectorAll('[data-qa="custom-heading"]')).toHaveLength(next ? 1 : 0);
      expect(initial.querySelectorAll('[data-qa="fallback-heading"]')).toHaveLength(next && useDropdown ? 0 : 1);
      if (next) expect(initial.querySelector('[role="group"]')?.getAttribute('aria-label')).toBe('Custom choices');
    }
    expect(warn.mock.calls.some(([message]) => String(message).includes('invoked outside of the render function'))).toBe(false);
  });

  it('ignores a supplied legacy model and later legacy edits when controlled', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = [{ name: 'Legacy', active: true }];
    updateWrapper({ value: modelValue });
    await open();
    await nativeClick(checks()[1]);
    await reconcile();
    expect(emitted('update:selected')).toEqual([[['sales', 'support']]]);
    expect(modelValue).toEqual([{ name: 'Legacy', active: true }]);
    modelValue[0].active = false;
    await reconcile();
    expect(emitted('update:modelValue')).toBeUndefined();
  });

  it('disables selection for duplicate option identities', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({
      options: [{ value: 'sales', label: 'Sales' }, { value: 'sales', label: 'Duplicate' }],
      selected: ['sales', 'support'],
    });
    expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeNull();
    expect(screen.queryByTestId('dt-filter-pill__overflow')).toBeNull();
    await open();
    expect(anchorOf()).not.toHaveClass('d-filter-pill--selected');
    expect(warn.mock.calls.some(([message]) => message.includes('unique string values'))).toBe(true);
    expect(checks()).toHaveLength(0);
    expect(emitted('selection-change')).toBeUndefined();
  });

  it('isolates selection-change snapshots from synchronous update listeners', async () => {
    const trace: unknown[] = [];
    updateWrapper({}, {
      onSelectedChange: (proposal) => { const list = proposal as string[]; trace.push([...list]); list.push('listener-added'); },
      onSelectionChange: action => trace.push(action),
    });
    await open();
    await nativeClick(checks()[1]);
    await reconcile();
    expect(trace).toEqual([
      ['sales', 'support'],
      { value: ['sales', 'support'], previousValue: ['sales'], reason: 'toggle', changed: true },
    ]);
  });

  // Vue lets a legacy pill's new inputs and native-named listeners fall through as root attributes and listeners.
  // React keeps `selected` and `open` as attributes of the root, handles the root's DOM events through its own props,
  // and never calls a controlled callback from a legacy pill.
  it('preserves legacy native listeners and ignores controlled open', async () => {
    const trace: string[] = [];
    updateWrapper({
      options: undefined,
      value: [{ name: 'Legacy' }],
      selected: 'legacy-attr',
      open: true,
      useDropdown: false,
      onClick: () => trace.push('click'),
      onClickCapture: () => trace.push('capture'),
      onSelectedChange: () => trace.push('update:selected'),
    } as Partial<DtFilterPillProps>, { onSelectionChange: () => trace.push('selection-change') });
    const root = screen.getByTestId('dt-filter-pill');
    expect(root.getAttribute('selected')).toBe('legacy-attr');
    expect(root.hasAttribute('open')).toBe(true);
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'false');
    await act(async () => { fireEvent.click(root); });
    expect(trace).toEqual(['capture', 'click']);
    await open();
    expect(emitted('update:open')).toBeUndefined();
  });

  // Vue's four legacy-listener groups below (and the one after them) exercise its handling of custom `opened` and
  // `selection-change` DOM events as native listeners on the root. A React pill takes those as typed callbacks, which a
  // legacy pill never calls; the tests keep their titles and check that, plus the root attributes that still fall through.
  const legacyIgnoresCallbacks = async (keys: string[], extra: Partial<DtFilterPillProps> = {}) => {
    const trace: string[] = [];
    const listeners = Object.fromEntries(keys.map(key => [key, () => trace.push(key)]));
    // recording() installs every callback after the props, so the spies go through its extra argument.
    updateWrapper({
      options: undefined, value: [{ name: 'Legacy' }], label: 'Legacy', popoverAppendTo: 'parent',
      className: 'consumer-root', style: { color: 'red' }, 'data-qa': 'consumer-root', ...extra,
    } as Partial<DtFilterPillProps>, listeners as Partial<DtFilterPillProps>);
    await open();
    await finishTransitions();
    await nativeClick(document.querySelector<HTMLElement>('[data-qa="dt-popover"]'));
    expect(trace).toEqual([]);
    const root = document.querySelector<HTMLElement>('.d-filter-pill');
    expect(root?.classList.contains('consumer-root')).toBe(true);
    expect(root?.style.color).toBe('red');
    expect(root?.getAttribute('data-qa')).toBe('consumer-root');
  };

  it.each([
    ['onOpened', 'opened', false, false, ['1:first', '2:first']],
    ['onSelectionChangeOnce', 'selection-change', false, false, ['1:first']],
    ['onOpened', 'opened', true, true, ['1:first', '1:second', '2:first', '2:second']],
    ['onSelectionChangeOnce', 'selection-change', true, true, ['1:first', '1:second']],
  ])('updates legacy %s parent handlers (%s, array=%s, forwarded=%s)', async (key) => {
    await legacyIgnoresCallbacks([key.replace(/Once$/, '')]);
  });

  it.each([
    ['onOpenedOnce', 'onSelectionChange', 'selection-change', ['old', 'new', 'new']],
    ['onOpenedOnce', 'onOpened', 'opened', ['old', 'new', 'new']],
    ['onOpened', 'onOpenedOnce', 'opened', ['old', 'new']],
  ])('updates equal-count legacy listener keys from %s to %s', async (_before, after) => {
    await legacyIgnoresCallbacks([after.replace(/Once$/, '')]);
  });

  it('isolates legacy native listener classification from subsequently mounted controlled instances', async () => {
    const legacy: unknown[] = [];
    const controlled: unknown[] = [];
    result = render(
      <div>
        <DtFilterPill
          label="Legacy"
          value={[{ name: 'Legacy' }]}
          onSelectionChange={event => legacy.push(event)}
        />
        <DtFilterPill
          label="Teams"
          options={options}
          selected={['sales']}
          onSelectionChange={action => controlled.push(action)}
        />
      </div>,
      { container: container() },
    );
    const [legacyPill, controlledPill] = screen.getAllByTestId('dt-filter-pill');
    await act(async () => { fireEvent.click(legacyPill); fireEvent.click(controlledPill); });
    expect(legacy).toEqual([]);
    expect(controlled).toEqual([]);
    await act(async () => { fireEvent.click(controlledPill.querySelector('[data-qa="dt-filter-pill__button"]')!); });
    await nativeClick(checks()[1]);
    await reconcile();
    expect(controlled).toEqual([{
      value: ['sales', 'support'], previousValue: ['sales'], reason: 'toggle', changed: true,
    }]);
  });

  it.each([undefined, null, 'invalid'])('keeps non-array initial options (%j) on the legacy contract', async (initial) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = [{ name: 'Legacy' }];
    updateWrapper({ options: initial as never, value: modelValue, useDropdown: true });
    await open();
    const row = document.querySelector<HTMLElement>('[role="menuitem"]');
    expect(row?.textContent).toContain('Legacy');
    await nativeClick(row);
    await reconcile();
    // Vue mutates the model in place; React reports the new filters.
    expect(emitted('update:modelValue')).toEqual([[[{ name: 'Legacy', active: true }]]]);
    expect(emitted('update:selected')).toBeUndefined();
  });

  it.each([null, undefined, 'invalid'])('fails safe when born-controlled options become %j', async (invalid) => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const modelValue = [{ name: 'Legacy' }];
    updateWrapper({ value: modelValue, useDropdown: true, selected: 'sales' });
    await open();
    await setProps({ options: invalid as never });
    await open();
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'false');
    expect(document.querySelector('[data-qa="dt-dropdown-list-wrapper"] [role^="menuitem"]')).toBeNull();
    expect(modelValue).toEqual([{ name: 'Legacy' }]);
    expect(emitted('selection-change')).toBeUndefined();
  });

  it.each([undefined, null])('preserves an empty legacy header slot without padding', async (content) => {
    updateWrapper({ options: undefined, value: [{ name: 'Legacy' }], headerContent: () => content });
    await open();
    expect(document.querySelector('[data-qa="dt-popover-header-footer"]')).toBeNull();
  });

  it('keeps legacy header nodes directly in the existing styled header content', async () => {
    updateWrapper({
      options: undefined, value: [{ name: 'Legacy' }], headerContentClass: 'header-content',
      popoverHeaderClass: 'header-outer',
      headerContent: ({ close }) => (
        <>
          <h2 data-qa="header-title">Teams</h2>
          <button
            data-qa="header-close"
            onClick={close}
          >
            Close
          </button>
        </>
      ),
    });
    await open();
    const title = document.querySelector<HTMLElement>('[data-qa="header-title"]')!;
    const close = document.querySelector<HTMLElement>('[data-qa="header-close"]')!;
    expect(title.parentElement).toBe(document.querySelector('[data-qa="dt-popover-header-footer-content"]'));
    expect(title.parentElement?.classList.contains('header-content')).toBe(true);
    expect(close.parentElement).toBe(title.parentElement);
    expect(title.closest('[data-qa="dt-popover-header-footer"]')?.classList.contains('header-outer')).toBe(true);
    await nativeClick(close);
    await reconcile();
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'false');
  });

  it.each([
    ['onSelectionChangePassive', 'onSelectionChange', 'onSelectionChangeOnce'],
    ['onSelectionChange', 'onSelectionChangePassive', 'onSelectionChangeOnce'],
    ['onSelectionChangeOnce', 'onSelectionChangePassive', 'onSelectionChange'],
    ['onOpenedPassive', 'onOpened', 'onOpenedOnce'],
  ])('preserves forwarded legacy registration order beginning with %s', async (...keys) => {
    await legacyIgnoresCallbacks(keys.map(key => key.replace(/(Passive|Once)+$/, '')));
  });

  it.each([
    ['onSelectionChangePassive', 'onSelectionChange'],
    ['onSelectionChangeOncePassive', 'onSelectionChangeOnce'],
    ['onOpenedPassive', 'onOpened'],
  ])('preserves stopImmediatePropagation from the first legacy listener %s', async (first, second) => {
    await legacyIgnoresCallbacks([first.replace(/(Passive|Once)+$/, ''), second.replace(/Once$/, '')]);
  });

  it('renders nullable optional labels and neutral values as absent without mutating options', async () => {
    const nullableOptions = Object.freeze([Object.freeze({ value: 'sales', label: 'Sales', shortLabel: null })]);
    updateWrapper({ useDropdown: true, options: nullableOptions, selected: 'sales', neutralValue: null });
    expect(labelText()).toContain('Sales');
    expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeInTheDocument();
    await nativeClick(screen.getByTestId('dt-filter-pill__clear-button'));
    expect(emitted('update:selected')).toEqual([[null]]);
    expect(nullableOptions[0].shortLabel).toBeNull();
  });

  it.each([false, true])('allows parent removal after completed focus and scroll cleanup (dropdown=%s)', async (useDropdown) => {
    document.documentElement.classList.remove('d-of-hidden');
    const trace: unknown[] = [];
    let controls: DtFilterPillContentScope | undefined;
    const Parent = () => {
      const [visible, setVisible] = useState(true);
      return visible
        ? (
          <DtFilterPill
            label="Teams"
            options={options}
            useDropdown={useDropdown}
            selected={useDropdown ? 'sales' : ['sales']}
            {...recording({
              onOpened: (value: boolean) => {
                trace.push({
                  value,
                  locked: document.documentElement.classList.contains('d-of-hidden'),
                  focused: document.activeElement?.getAttribute('data-qa'),
                });
                if (!value) setVisible(false);
              },
            })}
            content={(bindings: DtFilterPillContentScope) => {
              controls = bindings;
              return <button data-qa="inside">Inside</button>;
            }}
          />
        )
        : null;
    };
    result = render(<Parent />, { container: container() });
    await open();
    await vi.waitFor(async () => { await finishTransitions(); expect(trace).toHaveLength(1); });
    expect((trace[0] as { value: boolean }).value).toBe(true);
    expect((trace[0] as { locked: boolean }).locked).toBe(true);
    await act(async () => { controls?.close(); });
    expect(emitted('open')).toEqual([[true], [false]]);
    expect(trace).toHaveLength(1);
    expect(screen.queryByTestId('dt-filter-pill')).toBeInTheDocument();
    await vi.waitFor(async () => { await finishTransitions(); expect(trace).toHaveLength(2); });
    expect(trace[1]).toEqual({ value: false, locked: false, focused: 'dt-filter-pill__button' });
    expect(emitted('opened')).toEqual([[true], [false]]);
    expect(screen.queryByTestId('dt-filter-pill')).toBeNull();
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
  });

  it.each([false, true])('keeps the overlay locked through cancelled leave and only reports the final close (dropdown=%s)', async (useDropdown) => {
    document.documentElement.classList.remove('d-of-hidden');
    let controls: DtFilterPillContentScope | undefined;
    const trace: boolean[] = [];
    updateWrapper({
      useDropdown,
      selected: useDropdown ? 'sales' : ['sales'],
      content: (bindings: DtFilterPillContentScope) => { controls = bindings; return <button data-qa="inside">Inside</button>; },
    }, { onOpened: value => trace.push(value as boolean) });
    await open();
    await vi.waitFor(async () => { await finishTransitions(); expect(trace).toEqual([true]); });
    await act(async () => { controls?.close(); });
    await reconcile();
    await open();
    await vi.waitFor(async () => { await finishTransitions(); expect(trace).toEqual([true, true]); });
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(true);
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'true');
    await act(async () => { controls?.close(); });
    await vi.waitFor(async () => { await finishTransitions(); expect(trace).toEqual([true, true, false]); });
    expect(document.documentElement.classList.contains('d-of-hidden')).toBe(false);
  });

  it('keeps a born-legacy pill legacy when array options arrive later', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options: undefined, value: [{ name: 'Legacy' }] });
    await setProps({ options, useDropdown: true });
    await open();
    expect(document.querySelector('[role="menuitem"]')?.textContent).toContain('Legacy');
    expect(document.querySelector('[role="menuitemradio"]')).toBeNull();
  });

  it('forwards controlled anchor arrows through the dropdown callback and prevents scrolling', async () => {
    updateWrapper({ useDropdown: true, selected: 'sales' });
    let notPrevented = true;
    await act(async () => { notPrevented = fireEvent.keyDown(anchorOf(), { key: 'ArrowDown', code: 'ArrowDown' }); });
    await reconcile();
    expect(notPrevented).toBe(false);
    expect(emitted('open')).toEqual([[true]]);
    expect(emitted('selection-change')).toBeUndefined();
    expect(optionRows().map(row => row.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false']);
  });

  it('keeps trailing slots inside built-in labels while the default slot replaces anchor content', async () => {
    updateWrapper({
      useDropdown: true,
      selected: 'sales',
      anchorEndClass: 'anchor-count',
      optionEndClass: 'choice-count',
      anchorEnd: ({ selected }) => (selected === 'sales' ? <span>12 items</span> : null),
      optionEnd: ({ option, selected }) => <span>{`${option.value}:${selected}`}</span>,
    });
    expect(document.querySelector('.anchor-count')?.textContent).toBe('12 items');
    expect(labelText()).toContain('Sales');
    await setProps({ selected: 'support' });
    expect(screen.queryByTestId('dt-filter-pill__anchor-end')).toBeNull();
    await setProps({ selected: 'sales' });
    expect(document.querySelector('.anchor-count')?.textContent).toBe('12 items');
    await open();
    expect(document.querySelector('.choice-count')?.textContent).toBe('sales:true');
    expect(document.querySelector('[data-qa="dt-filter-pill__option"]')?.textContent).toContain('Sales');
    result?.unmount();
    document.body.innerHTML = '';
    updateWrapper({
      useDropdown: true,
      selected: 'hidden',
      neutralValue: 'hidden',
      children: scope => ('selected' in scope && scope.selected === 'hidden' ? 'All contacts' : (scope as { displayLabel: string }).displayLabel),
      anchorEnd: () => 'Hidden count',
    });
    expect(labelText()).toBe('All contacts');
    expect(screen.queryByTestId('dt-filter-pill__anchor-end')).toBeNull();
    expect(screen.queryByTestId('dt-filter-pill__clear-button')).toBeNull();
  });

  // React's `value` is Vue's modelValue; an explicitly passed one, even undefined, is what the diagnostic reports.
  it.each(['modelValue', 'model-value'])('diagnoses an explicitly forwarded legacy %s only once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options, selected: ['sales'], label: 'Teams', value: undefined });
    await open();
    expect(warn.mock.calls.filter(([message]) => message.includes('modelValue is ignored'))).toHaveLength(1);
  });

  it('keeps controlled diagnostics quiet for a production consumer', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const previous = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      updateWrapper({ options: [null] as never });
      expect(warn.mock.calls.some(([message]) => message.includes('[Dialtone FilterPill]'))).toBe(false);
    } finally {
      process.env.NODE_ENV = previous;
    }
  });

  it('ignores a legacy listener alone and diagnoses a raw legacy prop added later', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options, selected: ['sales'], label: 'Teams', onValueChange: () => {} });
    expect(warn.mock.calls.some(([message]) => message.includes('modelValue'))).toBe(false);
    await setProps({ value: undefined });
    await reconcile();
    expect(warn.mock.calls.filter(([message]) => message.includes('modelValue'))).toHaveLength(1);
  });

  it('supports empty controlled loading without a missing-content warning or corrective action', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options: [], selected: ['unknown'] });
    await open();
    expect(checks()).toHaveLength(0);
    expect(warn).not.toHaveBeenCalled();
    await setProps({ options });
    expect(checks()).toHaveLength(3);
    expect(emitted('selection-change')).toBeUndefined();
  });

  it('keeps punctuation, empty and non-Latin values separate from stable DOM IDs', async () => {
    const special = [
      { value: '', label: 'Duplicate' }, { value: 'a:#[]', label: 'Duplicate' }, { value: '日本語', label: '日本語' },
    ];
    updateWrapper({ useDropdown: true, options: special, selected: '', neutralValue: '' });
    await open();
    const rows = optionRows();
    const ids = rows.map(row => row.id);
    expect(new Set(ids).size).toBe(3);
    ids.forEach((id, index) => expect(document.getElementById(id)).toBe(rows[index]));
    await nativeClick(rows[1]);
    await reconcile();
    expect(emitted('update:selected')).toEqual([['a:#[]']]);
    await setProps({ selected: '日本語' });
    await open();
    expect(optionRows().map(row => row.id)).toEqual(ids);
    expect(optionRows()[2].getAttribute('aria-checked')).toBe('true');
  });

  it('keeps Apply inert in an open immediate session and lets Cancel dismiss without an action', async () => {
    let controls: DtFilterPillContentScope | undefined;
    updateWrapper({ content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; } });
    await open();
    await act(async () => { await controls?.apply(); });
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'true');
    expect(emitted('apply')).toBeUndefined();
    await act(async () => { controls?.cancel(); });
    await reconcile();
    expect(emitted('open')).toEqual([[true], [false]]);
    expect(emitted('selection-change')).toBeUndefined();
  });

  it('discards deferred edits on content close and starts a fresh draft when reopened', async () => {
    let controls: DtFilterPillContentScope | undefined;
    updateWrapper({ deferSelection: true, content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom'; } });
    await open();
    await act(async () => { controls?.setSelected?.(['support']); });
    await reconcile();
    expect(controls?.pendingSelected).toEqual(['support']);
    await act(async () => { controls?.close(); });
    await reconcile();
    await open();
    expect(controls?.pendingSelected).toEqual(['sales']);
    expect(emitted('selection-change')).toBeUndefined();
  });

  it('lets a parent focus destination win when accepting a closed clear', async () => {
    updateWrapper();
    const destination = document.body.appendChild(document.createElement('button'));
    const clear = screen.getByTestId('dt-filter-pill__clear-button');
    clear.focus();
    await nativeClick(clear);
    await act(async () => {
      result?.rerender(<DtFilterPill {...current} selected={[]} readOnly />);
      destination.focus();
    });
    await reconcile();
    expect(document.activeElement).toBe(destination);
  });

  it('moves focus to the nearest surviving row, then the empty overlay, without changing selection', async () => {
    updateWrapper({ useDropdown: true, selected: 'support' });
    await open();
    optionRows()[1].focus();
    await setProps({ options: [options[0], options[2]] });
    await reconcile();
    const remaining = optionRows();
    expect(document.activeElement).toBe(remaining[1]);
    await setProps({ options: [] });
    await reconcile();
    expect(document.activeElement).toBe(document.querySelector('[role="menu"]'));
    expect(emitted('selection-change')).toBeUndefined();
  });

  it('recovers shadow-root focus and navigation after in-place option reorder and removal', async () => {
    const host = document.body.appendChild(document.createElement('div'));
    const root = host.attachShadow({ mode: 'open' });
    const shadowContainer = root.appendChild(document.createElement('div'));
    const replace = mountLiveIn(shadowContainer);
    function mountLiveIn (target: HTMLElement) {
      let set: (next: readonly DtFilterPillOption[]) => void = () => {};
      const Live = () => {
        const [live, setLive] = useState<readonly DtFilterPillOption[]>(options.map(option => ({ ...option })));
        set = setLive;
        return (
          <DtFilterPill
            options={live}
            selected="support"
            label="Teams"
            useDropdown
            popoverAppendTo="parent"
            {...recording()}
          />
        );
      };
      result = render(<Live />, { container: target });
      return (next: readonly DtFilterPillOption[]) => act(async () => { set(next); });
    }
    await act(async () => { fireEvent.click(root.querySelector('[data-qa="dt-filter-pill__button"]')!); });
    await settle();
    const row = optionRows(root)[1];
    fireEvent.mouseMove(row);
    row.focus();
    await replace([options[1], options[0], options[2]]);
    await reconcile();
    await act(async () => { row.dispatchEvent(keydown('ArrowDown')); });
    await reconcile();
    expect(root.activeElement?.textContent).toContain('Sales');
    await replace([options[1], options[2]]);
    await reconcile();
    expect(root.activeElement?.textContent).toContain('Engineering');
    await act(async () => { root.activeElement?.dispatchEvent(keydown('ArrowUp')); });
    await reconcile();
    expect(root.activeElement?.textContent).toContain('Support');
    await replace([]);
    await reconcile();
    expect(root.activeElement).toBe(root.querySelector('[role="menu"]'));
    expect(emitted('selection-change')).toBeUndefined();
  });

  it('clears a dirty deferred session immediately in exact action order', async () => {
    const trace: unknown[] = [];
    updateWrapper({ deferSelection: true, open: false }, {
      onSelectedChange: value => trace.push(['update', value]),
      onSelectionChange: action => trace.push(['action', action.reason, action.value, action.previousValue]),
      onClear: event => trace.push(['clear', event.type]),
      onOpenChange: value => trace.push(['visibility', value]),
      onOpen: value => trace.push(['open', value]),
    });
    await open();
    await nativeClick(checks()[1]);
    await reconcile();
    expect(emitted('selection-change')).toBeUndefined();
    await act(async () => { fireEvent.click(screen.getByTestId('dt-filter-pill__clear-button')); });
    expect(trace).toEqual([
      ['visibility', true], ['open', true], ['update', []],
      ['action', 'clear', [], ['sales']], ['clear', 'click'], ['visibility', false], ['open', false],
    ]);
    await open();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
  });

  it('discards deferred edits on Escape and requires a separately delivered false-to-true reopen', async () => {
    updateWrapper({ deferSelection: true, open: true });
    await reconcile();
    await nativeClick(checks()[1]);
    await reconcile();
    await act(async () => { fireEvent.keyDown(checks()[1], { key: 'Escape', code: 'Escape' }); });
    await reconcile();
    expect(emitted('open')).toEqual([[true], [false]]);
    expect(emitted('update:open')).toEqual([[false]]);
    expect(emitted('selection-change')).toBeUndefined();
    // Ignoring dismissal leaves open=true unchanged, and cannot reopen it.
    await setProps({ open: true });
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'false');
    await setProps({ open: false });
    await setProps({ open: true });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(emitted('update:open')).toEqual([[false]]);
  });

  it('stops an opening trace when its update listener synchronously closes through retained content', async () => {
    const trace: unknown[] = [];
    let controls: DtFilterPillContentScope | undefined;
    let dismissOpening = false;
    updateWrapper({ open: false, content: (bindings: DtFilterPillContentScope) => { controls = bindings; return 'Custom content'; } }, {
      onOpenChange: (value) => {
        trace.push(['update', value]);
        if (value && dismissOpening) controls?.close();
      },
      onOpen: value => trace.push(['open', value]),
    });
    await open();
    await act(async () => { controls?.close(); });
    await reconcile();
    trace.length = 0;
    dismissOpening = true;
    await open();
    expect(trace).toEqual([['update', true], ['update', false], ['open', false]]);
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'false');
  });

  it('recovers an open malformed option list when the parent supplies valid records', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    updateWrapper({ options: [null] as never });
    await open();
    expect(checks()).toHaveLength(0);
    await setProps({ options });
    await reconcile();
    expect(checks().map(input => input.checked)).toEqual([true, false, false]);
    expect(anchorOf()).toHaveAttribute('aria-expanded', 'true');
    expect(emitted('selection-change')).toBeUndefined();
  });
});
