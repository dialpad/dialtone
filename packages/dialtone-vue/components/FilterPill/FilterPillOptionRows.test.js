import { mount, flushPromises } from '@vue/test-utils';
import { h, nextTick, ref } from 'vue';
import DtFilterPill from './FilterPill.vue';
import { DtListItem } from '@/components/ListItem';
import { DtTooltipDirective } from '@/directives/tooltip_directive';
import { DtFocustrapDirective } from '@/directives/focustrap_directive';

const typeOptions = Object.freeze([
  Object.freeze({ value: 'all', label: 'All types' }),
  Object.freeze({ value: 'calls', label: 'Calls', description: 'Includes voicemail' }),
  Object.freeze({
    value: 'archived', label: 'Archived', disabled: true, description: 'Choose All under Status to view archived items',
  }),
]);

const groupedOptions = Object.freeze([
  Object.freeze({ value: 'all', label: 'All types' }),
  Object.freeze({ value: 'calls', label: 'Calls', description: 'Includes voicemail' }),
  Object.freeze({ value: 'archived', label: 'Archived', disabled: true, group: 'Other views' }),
  Object.freeze({ value: 'spam', label: 'Spam', group: 'Other views' }),
]);

const ACTION_EVENTS = ['update:selected', 'selection-change', 'clear', 'apply', 'open', 'update:open'];
const mountGlobal = { plugins: [DtTooltipDirective, DtFocustrapDirective], stubs: { transition: false } };
const reconcile = async () => { await nextTick(); await nextTick(); };
const keydown = (key, code = key) => new KeyboardEvent('keydown', { key, code, bubbles: true, cancelable: true });

describe('DtFilterPill built-in dropdown option rows', () => {
  let wrapper;
  let hadScrollLock;

  const updateWrapper = (props = {}) => {
    wrapper = mount(DtFilterPill, {
      props: { label: 'Type', useDropdown: true, options: typeOptions, selected: 'all', ...props },
      global: mountGlobal,
      attachTo: document.body,
    });
  };
  const mountWithLiveOptions = liveOptions => {
    wrapper = mount({
      setup: () => () => h(DtFilterPill, { label: 'Type', useDropdown: true, options: liveOptions.value, selected: 'all' }),
    }, { global: mountGlobal, attachTo: document.body });
  };
  // Dropdown takes its keyboard position from the pointer highlight, so set both before pressing keys.
  const focusRow = row => {
    row.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    row.focus();
  };
  const focusedLabelAfter = async key => {
    document.activeElement.dispatchEvent(keydown(key));
    await reconcile();
    return document.activeElement.querySelector('[data-qa="dt-item-layout-title-wrapper"]')?.textContent.trim();
  };
  const pill = () => wrapper.findComponent(DtFilterPill);
  const open = async () => {
    await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('click');
    await flushPromises();
  };
  const rows = () => [...document.querySelectorAll('[data-qa="dt-filter-pill__option"]')];
  const actions = () => Object.fromEntries(Object.entries(pill().emitted())
    .filter(([name]) => ACTION_EVENTS.includes(name)));
  const descriptionOf = row => document.getElementById(row.getAttribute('aria-describedby'))?.textContent ?? null;

  beforeEach(() => { hadScrollLock = document.documentElement.classList.contains('d-of-hidden'); });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
    document.documentElement.classList.toggle('d-of-hidden', hadScrollLock);
    vi.restoreAllMocks();
  });

  describe('Availability and descriptions', () => {
    it('disables only the flagged row, with styling and aria-disabled from the same flag', async () => {
      updateWrapper();
      await open();
      expect(rows().map(row => row.getAttribute('aria-disabled'))).toEqual([null, null, 'true']);
      expect(rows().map(row => row.classList.contains('d-list-item--disabled'))).toEqual([false, false, true]);
    });

    it('describes rows with their visible explanation, enabled or not', async () => {
      updateWrapper();
      await open();
      expect(rows().map(descriptionOf)).toEqual([null, 'Includes voicemail', 'Choose All under Status to view archived items']);
    });

    it('keeps the description inside the row and out of its accessible name', async () => {
      updateWrapper();
      await open();
      const archived = rows()[2];
      const description = document.getElementById(archived.getAttribute('aria-describedby'));
      expect(archived.contains(description)).toBe(true);
      expect(description.getAttribute('aria-hidden')).toBe('true');
    });

    it('marks every built-in row disabled while the selection is unusable', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      updateWrapper({ selected: ['calls'] });
      await open();
      expect(rows().map(row => row.getAttribute('aria-disabled'))).toEqual(['true', 'true', 'true']);
      expect(rows().map(row => row.classList.contains('d-list-item--disabled'))).toEqual([true, true, true]);
    });

    it('ignores availability and descriptions in multiple selection', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => {});
      updateWrapper({ useDropdown: false, selected: [] });
      await open();
      const checkboxes = [...document.querySelectorAll('[data-qa="dt-filter-pill__checkbox"]')];
      expect(checkboxes.map(input => input.disabled)).toEqual([false, false, false]);
      expect(document.body.textContent).not.toContain(typeOptions[2].description);
    });
  });

  describe('Activation', () => {
    it.each([
      { input: 'pointer', activate: row => row.click() },
      { input: 'Enter', activate: row => row.dispatchEvent(keydown('Enter')) },
      { input: 'Space', activate: row => row.dispatchEvent(keydown(' ', 'Space')) },
    ])('refuses $input activation of a disabled row and stays open with focus on it', async ({ activate }) => {
      updateWrapper();
      await open();
      const archived = rows()[2];
      archived.focus();
      activate(archived);
      await reconcile();
      expect(actions()).toEqual({ open: [[true]] });
      expect(wrapper.find('[data-qa="dt-filter-pill__button"]').attributes('aria-expanded')).toBe('true');
      expect(document.activeElement).toBe(archived);
    });

    it('opens by keyboard onto a disabled first row, so focus and keyboard position agree', async () => {
      updateWrapper({ options: [typeOptions[2], typeOptions[0], typeOptions[1]] });
      await wrapper.find('[data-qa="dt-filter-pill__button"]').trigger('keydown', { key: 'ArrowDown', code: 'ArrowDown' });
      await flushPromises();
      expect(document.activeElement).toBe(rows()[0]);
      expect(await focusedLabelAfter('ArrowDown')).toBe('All types');
    });

    it('refuses a disabled option even when its row emits click', async () => {
      updateWrapper();
      await open();
      wrapper.findAllComponents(DtListItem)[2].vm.$emit('click', new MouseEvent('click'));
      await reconcile();
      expect(actions()).toEqual({ open: [[true]] });
    });

    it('selects an enabled row next to a disabled one exactly once, then closes', async () => {
      updateWrapper();
      await open();
      rows()[1].click();
      await reconcile();
      expect(actions()).toEqual({
        open: [[true], [false]],
        'update:selected': [['calls']],
        'selection-change': [[{ value: 'calls', previousValue: 'all', reason: 'select', changed: true }]],
      });
    });

    it('clears to the neutral value even when its option is disabled', async () => {
      updateWrapper({
        neutralValue: 'all',
        selected: 'calls',
        options: [{ ...typeOptions[0], disabled: true }, typeOptions[1], typeOptions[2]],
      });
      await wrapper.find('[data-qa="dt-filter-pill__clear-button"]').trigger('click');
      await reconcile();
      expect(actions()).toEqual({
        'update:selected': [['all']],
        'selection-change': [[{ value: 'all', previousValue: 'calls', reason: 'clear', changed: true }]],
        clear: [[expect.any(MouseEvent)]],
      });
    });
  });

  describe('Committed state and reactive updates', () => {
    it('keeps a selected option checked and labeled after it becomes disabled, and refuses reselecting it', async () => {
      updateWrapper({ selected: 'calls' });
      await open();
      await wrapper.setProps({ options: [typeOptions[0], { ...typeOptions[1], disabled: true }, typeOptions[2]] });
      await reconcile();
      const calls = rows()[1];
      expect(calls.getAttribute('aria-checked')).toBe('true');
      expect(calls.querySelector('[data-qa="dt-item-layout-selected-wrapper"] [data-qa="dt-icon"]')).not.toBeNull();
      expect(wrapper.find('[data-qa="dt-filter-pill__label-start"]').text()).toBe('Calls');
      // Same-value activation of the selected row must be refused too.
      calls.click();
      await reconcile();
      expect(actions()).toEqual({ open: [[true]] });
    });

    it.each([
      {
        change: 'replacing the options',
        apply: live => {
          live.value = live.value.map(option => option.value === 'calls'
            ? { ...option, disabled: true, description: 'Unavailable' }
            : option);
        },
      },
      {
        change: 'updating the option in place',
        apply: live => { Object.assign(live.value[1], { disabled: true, description: 'Unavailable' }); },
      },
    ])('keeps focus and keyboard position on a row whose availability changes by $change', async ({ apply }) => {
      const live = ref(typeOptions.map(option => ({ ...option })));
      mountWithLiveOptions(live);
      await open();
      const calls = rows()[1];
      focusRow(calls);
      apply(live);
      await reconcile();
      expect(document.activeElement).toBe(calls);
      expect(calls.getAttribute('aria-disabled')).toBe('true');
      expect(descriptionOf(calls)).toBe('Unavailable');
      calls.dispatchEvent(keydown('ArrowDown'));
      await reconcile();
      expect(document.activeElement).toBe(rows()[2]);
      expect(actions()).toEqual({ open: [[true]] });
    });
  });

  describe('Grouping', () => {
    it('renders consecutive grouped options as one labelled group inside a presentational list item', async () => {
      updateWrapper({ options: groupedOptions });
      await open();
      const group = document.querySelector('[role="group"]');
      expect(rows().map(row => row.parentElement.getAttribute('role'))).toEqual(['none', 'none', 'group', 'group']);
      expect(document.getElementById(group.getAttribute('aria-labelledby')).textContent.trim()).toBe('Other views');
      // A list item wraps the group, and it sits in the same list as the ungrouped rows.
      expect(group.parentElement.matches('li[role="none"]')).toBe(true);
      expect(group.parentElement.parentElement).toBe(rows()[0].parentElement);
    });

    it('moves through rows across group boundaries in DOM order with arrows and Home', async () => {
      updateWrapper({ options: groupedOptions });
      await open();
      focusRow(rows()[0]);
      expect(await focusedLabelAfter('ArrowDown')).toBe('Calls');
      expect(await focusedLabelAfter('ArrowDown')).toBe('Archived');
      expect(await focusedLabelAfter('ArrowUp')).toBe('Calls');
      expect(await focusedLabelAfter('ArrowDown')).toBe('Archived');
      expect(await focusedLabelAfter('ArrowDown')).toBe('Spam');
      expect(await focusedLabelAfter('Home')).toBe('All types');
    });

    it('moves by typeahead across groups, matching labels and not descriptions', async () => {
      updateWrapper({ options: groupedOptions });
      await open();
      focusRow(rows()[0]);
      expect(await focusedLabelAfter('s')).toBe('Spam');
      // Only the Calls description starts with "i"; typeahead must not match it.
      expect(await focusedLabelAfter('i')).toBe('Spam');
    });

    it.each([
      { move: 'into', index: 1, group: 'Other views', parentRole: 'group', next: 'Archived' },
      { move: 'out of', index: 2, group: null, parentRole: 'none', next: 'Spam' },
    ])('keeps focus on a row that moves $move a group while open', async ({ index, group, parentRole, next }) => {
      const live = ref(groupedOptions.map(option => ({ ...option })));
      mountWithLiveOptions(live);
      await open();
      const row = rows()[index];
      focusRow(row);
      live.value[index].group = group;
      await reconcile();
      expect(document.activeElement.id).toBe(row.id);
      expect(document.activeElement.parentElement.getAttribute('role')).toBe(parentRole);
      expect(await focusedLabelAfter('ArrowDown')).toBe(next);
      expect(actions()).toEqual({ open: [[true]] });
    });
  });
});
