import { getUniqueString } from '@/common/utils';
import { getSelectionState, sameSelection, selectionSnapshot } from './FilterPillSelection';

const NEW_INPUTS = new Set([
  'options', 'selected', 'neutralValue', 'neutral-value', 'open',
  'anchorEndClass', 'anchor-end-class', 'optionEndClass', 'option-end-class',
  'headerContentClass', 'header-content-class', 'onUpdate:selected', 'onSelectionChange', 'onSelection-change',
  'onUpdate:open', 'onOpened',
]);

export default {
  /**
   * @returns {{
   *   controlledAtBirth: boolean,
   *   controlledDropdown: boolean | null,
   *   controlledDraft: string[] | null,
   *   checkboxRenderValues: string[],
   *   draftBase: string,
   *   draftSession: number,
   *   reconciliation: number,
   *   applying: boolean,
   *   controlledDisposed: boolean,
   *   rejectedLockedOpen: boolean,
   *   optionIds: Map<string, string>,
   *   controlledWarnings: Set<string>,
   *   clearFocusCandidate: Element | null,
   * }}
   */
  data () {
    return {
      controlledAtBirth: Array.isArray(this.options),
      controlledDropdown: this.useDropdown,
      controlledDraft: null,
      checkboxRenderValues: [],
      draftBase: '',
      draftSession: 0,
      reconciliation: 0,
      applying: false,
      controlledDisposed: false,
      rejectedLockedOpen: false,
      optionIds: new Map(),
      controlledWarnings: new Set(),
      clearFocusCandidate: null,
    };
  },

  computed: {
    controlledState () {
      return getSelectionState(this.options, this.selected, {
        useDropdown: this.controlledDropdown, neutralValue: this.neutralValue,
      });
    },

    controlledContractValid () {
      return Array.isArray(this.options) && this.useDropdown === this.controlledDropdown;
    },

    controlledCanSelect () {
      return this.controlledContractValid && this.controlledState.valid && !this.disabled && !this.readOnly;
    },

    controlledDeferred () {
      return !this.controlledDropdown && this.deferSelection;
    },

    controlledBase () {
      const state = this.controlledState;
      return JSON.stringify(Array.isArray(state.value) ? [...state.value].sort() : state.value);
    },

    controlledOptionValues () {
      return this.controlledState.options.map(option => option.value);
    },

    controlledDisplayLabel () {
      const state = this.controlledState;
      if (!state.valid || !state.values.length) return this.label || '';
      if (this.controlledDropdown) {
        const option = state.selectedOptions[0];
        if (option) return option.shortLabel ?? option.label;
        return state.value === this.neutralValue ? (this.label || '') : this.unavailableLabel;
      }
      if (this.controlledAllSelected) return this.i18n.$t('DIALTONE_FILTER_PILL_ALL_LABEL');
      const first = state.values.map(value => state.options.find(option => option.value === value)).find(Boolean);
      return first ? (first.shortLabel ?? first.label) : this.unavailableLabel;
    },

    controlledAllSelected () {
      const state = this.controlledState;
      return !state.unknownValues.length && state.options.length > 1 && state.values.length === state.options.length;
    },

    controlledDraftOpen () {
      return this.controlledDeferred && this.isOpen && this.controlledDraft !== null;
    },

    controlledOverflow () {
      const state = this.controlledState;
      if (!state.valid || this.controlledDropdown || state.value.length <= 1 || this.controlledAllSelected) return '';
      return `+${state.value.length - 1}`;
    },

    controlledAccessibleLabel () {
      const selection = this.controlledDisplayLabel;
      if (!this.label || this.label === selection) return selection;
      return this.i18n.$t('DIALTONE_FILTER_PILL_SELECTION_LABEL', { label: this.label, selection });
    },

    unavailableLabel () {
      return this.i18n.$t('DIALTONE_FILTER_PILL_UNAVAILABLE_LABEL');
    },

    controlledAnchorBindings () {
      return {
        label: this.label,
        selected: selectionSnapshot(this.controlledState.value),
        selectedOptions: [...this.controlledState.selectedOptions],
        displayLabel: this.controlledDisplayLabel,
        isActive: this.isActive,
      };
    },

    controlledContentBindings () {
      return {
        close: this.closeControlled,
        selected: selectionSnapshot(this.controlledState.value),
        pendingSelected: this.controlledDraft === null ? null : [...this.controlledDraft],
        setSelected: this.setControlledSelected,
        apply: this.applySelection,
        cancel: this.cancelSelection,
      };
    },
  },

  watch: {
    open (value) {
      if (!this.controlledAtBirth || this.controlledDisposed || value === null) return;
      if (!value) this.rejectedLockedOpen = false;
      this.requestControlledOpen(value, false);
    },

    deferSelection () {
      if (this.controlledAtBirth && this.isOpen) this.resetControlledDraft();
    },

    disabled () { this.closeWhenLocked(); },
    readOnly () { this.closeWhenLocked(); },

    options () { this.checkControlledConfiguration(); },

    controlledOptionValues (values, previous) {
      if (!this.controlledAtBirth) return;
      this.restoreRemovedOptionFocus(previous);
      this.syncCheckboxRender();
      for (const value of this.optionIds.keys()) {
        if (!values.includes(value)) this.optionIds.delete(value);
      }
    },

    useDropdown () { this.checkControlledConfiguration(); },

    controlledBase () {
      if (!this.controlledAtBirth) return;
      if (this.isOpen && this.controlledDeferred) this.rebaseControlledDraft();
      this.syncCheckboxRender();
      this.checkControlledConfiguration();
    },

    hasClear (visible, previous) {
      if (!this.controlledAtBirth || !previous || visible || this.isOpen) return;
      const clear = this.$refs.clearButton?.$el;
      if (document.activeElement !== clear) return;
      this.clearFocusCandidate = clear;
      this.$nextTick(() => {
        if (this.controlledDisposed || this.hasClear || this.disabled || this.readOnly) return;
        const active = document.activeElement;
        if (active === document.body || active === this.clearFocusCandidate) this.$refs.primaryButton?.$el?.focus();
        this.clearFocusCandidate = null;
      });
    },
  },

  created () {
    this.checkControlledConfiguration();
    if (!this.controlledAtBirth) {
      // Vue skips updates for declared emit listeners. Legacy callers still own
      // these as native root listeners, including registration and Once lifetime.
      // Copy the instance classification; normalized options are shared by Vue.
      const emits = { ...this.$.emitsOptions };
      for (const event of ['update:selected', 'selection-change', 'update:open', 'opened']) delete emits[event];
      this.$.emitsOptions = emits;
      return;
    }
    this.syncCheckboxRender();
    if (this.open === true) this.requestControlledOpen(true, false);
  },

  updated () {
    this.checkControlledConfiguration();
  },

  beforeUnmount () {
    this.controlledDisposed = true;
    this.reconciliation++;
    this.draftSession++;
  },

  methods: {
    anchorAttributes (slotData) {
      if (!this.overlayUseDropdown) return slotData.attrs;
      if (!this.controlledAtBirth) return slotData;
      return {
        'aria-expanded': slotData['aria-expanded'],
        'aria-controls': slotData['aria-controls'],
        'aria-haspopup': slotData['aria-haspopup'],
      };
    },

    legacyRootAttrs () {
      if (this.controlledAtBirth) return {};
      return Object.fromEntries(Object.entries(this.$.vnode.props || {}).filter(([key]) => {
        // Restore the entire new-listener family in VNode order, including modifiers
        // Vue leaves in attrs. Automatic inheritance deduplicates identical handlers.
        const input = key.startsWith('on') ? key.replace(/(?:Once|Passive|Capture)+$/, '') : key;
        return NEW_INPUTS.has(input);
      }));
    },

    warnControlled (message) {
      if (process.env.NODE_ENV === 'production' || this.controlledWarnings.has(message)) return;
      this.controlledWarnings.add(message);
      console.warn(`[Dialtone FilterPill] ${message}`);
    },

    checkControlledConfiguration () {
      if (Array.isArray(this.options) !== this.controlledAtBirth ||
        (this.controlledAtBirth && this.useDropdown !== this.controlledDropdown)) {
        this.warnControlled('Selection contract and controlled useDropdown cannot change in place; remount with a key.');
        if (this.controlledAtBirth) this.requestControlledOpen(false);
      }
      if (!this.controlledAtBirth) return;
      const inputs = this.$.vnode.props || {};
      if (Object.hasOwn(inputs, 'modelValue') || Object.hasOwn(inputs, 'model-value')) {
        this.warnControlled('modelValue is ignored when controlled options are supplied.');
      }
      this.controlledState.issues.forEach(this.warnControlled);
    },

    controlledOptionId (value) {
      if (!this.optionIds.has(value)) this.optionIds.set(value, getUniqueString('dt-filter-pill-option-'));
      return this.optionIds.get(value);
    },

    controlledRowSelected (value) {
      if (!this.controlledState.valid) return false;
      return (this.controlledDraft ?? this.controlledState.values).includes(value);
    },

    syncCheckboxRender () {
      if (this.controlledDisposed || this.controlledDropdown) return;
      this.checkboxRenderValues = this.controlledState.valid
        ? [...(this.controlledDraft ?? this.controlledState.values)] : [];
    },

    async reconcileCheckboxes () {
      const action = ++this.reconciliation;
      await this.$nextTick();
      if (this.controlledDisposed || action !== this.reconciliation) return;
      this.syncCheckboxRender();
    },

    toggleControlledOption (value, checked) {
      if (!this.controlledCanSelect) { this.reconcileCheckboxes(); return; }
      const current = this.controlledDraft ?? this.controlledState.value;
      let next = current.filter(item => item !== value);
      if (checked) next = current.includes(value) ? [...current] : [...current, value];
      if (this.controlledDraftOpen) this.controlledDraft = next;
      else this.commitControlled(next, 'toggle');
      this.reconcileCheckboxes();
    },

    selectControlledOption (value) {
      this.commitControlled(value, 'select', true);
    },

    setControlledSelected (next) {
      if (!this.controlledCanSelect) return;
      const state = getSelectionState(this.options, next, { useDropdown: this.controlledDropdown });
      if (next === undefined || !state.valid) {
        this.warnControlled('setSelected requires the selected shape for this pattern.');
        return;
      }
      if (this.controlledDraftOpen) {
        this.controlledDraft = [...state.value];
        this.syncCheckboxRender();
      } else {
        this.commitControlled(state.value, this.controlledDropdown ? 'select' : 'toggle', this.controlledDropdown);
        this.reconcileCheckboxes();
      }
    },

    commitControlled (next, reason, close = false, originalEvent) {
      if (this.controlledDisposed || !this.controlledCanSelect) return;
      const previousValue = selectionSnapshot(this.controlledState.value);
      const value = selectionSnapshot(next);
      const changed = !sameSelection(value, previousValue);
      const action = { value, previousValue, reason, changed };
      if (changed) this.$emit('update:selected', selectionSnapshot(value));
      if (this.controlledDisposed) return;
      this.$emit('selection-change', action);
      if (this.controlledDisposed) return;
      if (reason === 'clear') this.$emit('clear', originalEvent);
      if (reason === 'apply') this.$emit('apply');
      if (this.controlledDisposed) return;
      if (close) this.requestControlledOpen(false);
    },

    /** Start a new draft session for the current open state; returns its token. */
    resetControlledDraft () {
      const session = ++this.draftSession;
      this.applying = false;
      if (this.isOpen && this.controlledDeferred) this.rebaseControlledDraft();
      else this.controlledDraft = null;
      this.syncCheckboxRender();
      return session;
    },

    rebaseControlledDraft () {
      this.controlledDraft = [...this.controlledState.values];
      this.draftBase = this.controlledBase;
      this.syncCheckboxRender();
    },

    async applyControlledSelection () {
      if (this.controlledDisposed || this.applying || !this.controlledDeferred ||
        !this.isOpen || this.controlledDraft === null || !this.controlledCanSelect) return;
      this.applying = true;
      const session = this.draftSession;
      // Let the caller finish same-turn parent writes before selecting Vue's pending flush.
      await Promise.resolve();
      await this.$nextTick();
      if (this.controlledDisposed || session !== this.draftSession || !this.isOpen ||
        this.controlledDraft === null || !this.controlledCanSelect) {
        if (!this.controlledDisposed && session === this.draftSession) this.applying = false;
        return;
      }
      if (this.draftBase !== this.controlledBase) this.rebaseControlledDraft();
      this.commitControlled([...this.controlledDraft], 'apply', true);
      if (!this.controlledDisposed && session === this.draftSession) this.applying = false;
    },

    requestControlledOpen (next, notify = true) {
      if (this.controlledDisposed) return;
      if (next && (!this.controlledContractValid || this.disabled || this.readOnly)) {
        if (this.open === true && !this.rejectedLockedOpen) {
          this.rejectedLockedOpen = true;
          this.$emit('update:open', false);
        }
        return;
      }
      if (next === this.isOpen) return;
      this.isOpen = next;
      const session = this.resetControlledDraft();
      if (notify && typeof this.open === 'boolean') this.$emit('update:open', next);
      if (this.controlledDisposed || session !== this.draftSession) return;
      this.$emit('open', next);
    },

    onControlledVisibility (next) {
      if (this.controlledAtBirth) this.requestControlledOpen(next);
    },

    onOverlayOpened (next) {
      if (this.controlledAtBirth && !this.controlledDisposed && next === this.isOpen) this.$emit('opened', next);
    },

    onOverlayTerminalOpen (next) {
      if (!this.controlledAtBirth) this.isOpen = next;
    },

    onAnchorArrow () {
      if (!this.controlledAtBirth) this.openPopover();
      else if (!this.controlledDropdown) this.requestControlledOpen(true);
    },

    onOverlayKeydown (event) {
      if (!this.controlledAtBirth || !this.controlledDropdown || this.isOpen ||
        !['ArrowDown', 'ArrowUp'].includes(event.key) ||
        !this.$refs.primaryButton?.$el?.contains(event.target)) return;
      event.preventDefault();
      this.requestControlledOpen(true);
    },

    closeControlled () { this.requestControlledOpen(false); },

    closeWhenLocked () {
      if (!this.controlledAtBirth || (!this.disabled && !this.readOnly)) return;
      if (this.isOpen) {
        this.rejectedLockedOpen = this.open === true;
        this.requestControlledOpen(false);
      } else if (this.open === true) this.requestControlledOpen(true);
    },

    async restoreRemovedOptionFocus (previous) {
      if (!this.isOpen || !Array.isArray(previous)) return;
      const active = document.activeElement;
      const index = previous.findIndex(value => this.optionIds.get(value) === active?.id);
      if (index < 0) return;
      const retained = this.controlledState.options.find(option => this.optionIds.get(option.value) === active.id);
      const session = this.draftSession;
      await this.$nextTick();
      if (this.controlledDisposed || !this.isOpen || session !== this.draftSession ||
        (document.activeElement !== document.body && document.activeElement !== active)) return;
      const options = this.controlledState.options;
      const nearest = retained ?? options[Math.min(index, options.length - 1)];
      const popupId = this.$refs.primaryButton?.$el?.getAttribute('aria-controls');
      const target = nearest ? document.getElementById(this.controlledOptionId(nearest.value))
        : document.getElementById(popupId);
      if (this.controlledDropdown) {
        if (nearest && target) this.$refs.overlay?.setHighlightId(target.id);
        else this.$refs.overlay?.clearHighlightIndex();
      }
      target?.focus();
    },
  },
};
