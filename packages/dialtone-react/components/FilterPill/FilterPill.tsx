import {
  Children,
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import type { Placement } from 'tippy.js';
import { cx, type ClassValue } from '../../common/cx';
import { devWarn } from '../../common/dev';
import { useControllableState } from '../../common/hooks/useControllableState';
import { useI18n } from '../../common/localization';
import type { ContentMode } from '../../common/mode_constants';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { DtIconCheck, DtIconChevronDown, DtIconClose, type IconSize } from '../../icons';
import { BUTTON_ICON_SIZES, DtButton, type ButtonSize, type DtButtonIconSlotScope } from '../Button';
import { DtCheckbox } from '../Checkbox';
import { DtCheckboxGroup } from '../CheckboxGroup';
import { DtDropdown } from '../Dropdown';
import { DtItemLayout } from '../ItemLayout';
import { DtListItem } from '../ListItem';
import {
  DtPopover,
  POPOVER_HEADER_FOOTER_PADDING_CLASSES,
  type DtPopoverCloseScope,
  type PopoverAppendTo,
  type PopoverDirection,
  type PopoverPadding,
} from '../Popover';
import { DtStack } from '../Stack';
import { DtText } from '../Text';
import { useTooltipDirective } from '../Tooltip';
import type { FilterPillOverlayMinInlineSize } from './FilterPillConstants';
import {
  getSelectionState,
  sameSelection,
  selectionSnapshot,
  type DtFilterPillOption,
  type DtFilterPillSelected,
} from './FilterPillSelection';
import { DtFilterPillOptionGroup } from './modules/FilterPillOptionGroup';

/** One filter: the checkbox (or list item) `name`, checked when `active`. */
export interface DtFilterPillFilter {
  name: string;
  active?: boolean;
}

/** What the default (label) slot gets, with legacy filter records. */
export interface DtFilterPillLabelScope {
  label: string | undefined;
  filters: DtFilterPillFilter[];
  activeFilters: string[];
  activeFilterList: string;
  activeFilterOverflow: string;
}

/** What the default (label) slot gets, with controlled `options`, and what `anchorEnd` gets. */
export interface DtFilterPillControlledAnchorScope {
  /** Dimension label. */
  label: string | undefined;
  /** Committed selection snapshot. */
  selected: DtFilterPillSelected;
  /** Resolved committed option records. */
  selectedOptions: DtFilterPillOption[];
  /** Committed display summary. */
  displayLabel: string;
  /** Whether the committed selection filters results. */
  isActive: boolean;
}

/** What `optionEnd` gets, for each choice. */
export interface DtFilterPillOptionEndScope {
  /** Read-only option record. */
  option: DtFilterPillOption;
  /** Whether this row is selected, using a deferred draft when open. */
  selected: boolean;
}

/** Why a controlled selection action happened. */
export type DtFilterPillSelectionReason = 'select' | 'toggle' | 'clear' | 'apply';

/** What `onSelectionChange` gets: a user action snapshot. */
export interface DtFilterPillSelectionAction {
  value: DtFilterPillSelected;
  previousValue: DtFilterPillSelected;
  reason: DtFilterPillSelectionReason;
  changed: boolean;
}

/**
 * What the content slot gets. Legacy popovers get `close`, `apply`, `cancel` and `pendingFilters`; controlled ones get
 * `close`, `apply`, `cancel`, `selected`, `pendingSelected` and `setSelected`. A legacy dropdown gets `close` alone.
 */
export interface DtFilterPillContentScope extends DtPopoverCloseScope {
  /**
   * Legacy popovers: commits the pending selection and closes the popover (deferSelection). Controlled: a Promise
   * callback, which does nothing outside an open deferred popover.
   */
  apply: () => void | Promise<void>;
  /** Discards the pending selection and closes the popover. */
  cancel: () => void;
  /** Legacy popover draft records: the selection being edited while the popover is open with deferSelection. */
  pendingFilters?: DtFilterPillFilter[] | null;
  /** Controlled committed snapshot. */
  selected?: DtFilterPillSelected;
  /** Controlled open deferred draft snapshot; null otherwise. */
  pendingSelected?: string[] | null;
  /** Controlled explicit selection action. */
  setSelected?: (next: DtFilterPillSelected) => void;
}

/** What the footerContent slot gets. */
export interface DtFilterPillFooterScope extends DtPopoverCloseScope {
  apply: () => void | Promise<void>;
  cancel: () => void;
}

type NativeAttributes = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content' | 'defaultValue'>;

export interface DtFilterPillProps extends NativeAttributes {
  /** The root element. */
  ref?: Ref<HTMLDivElement>;

  /**
   * An array at creation (including []) opts into authoritative selection. Remount to change contract or controlled
   * pattern. Records require string value and label. Optional shortLabel accepts string or null; null is absent and
   * empty string is meaningful. Single-selection dropdowns also read optional disabled (boolean or null) and
   * description and group (string or null; an empty string is absent). A malformed value is ignored with a development
   * warning and never invalidates the options. Multiple selection ignores these three fields and warns once.
   */
  options?: readonly DtFilterPillOption[] | null;

  /** Controlled selection: string|null in dropdowns, readonly string[] in popovers. */
  selected?: DtFilterPillSelected;

  /** Single-selection baseline. Null or omitted means absent; empty string is meaningful. Ignored in multiple selection. */
  neutralValue?: string | null;

  /** Logical visibility synchronization for controlled selection. Null uses internal ownership. */
  open?: boolean | null;

  /** Classes on the immediate noninteractive anchorEnd wrapper. */
  anchorEndClass?: ClassValue;

  /** Classes on each immediate noninteractive optionEnd wrapper. */
  optionEndClass?: ClassValue;

  /** Classes on the immediate headerContent wrapper. */
  headerContentClass?: ClassValue;

  /**
   * When true, uses DtDropdown instead of DtPopover as the overlay.
   * Provides keyboard navigation (arrow keys) for list items.
   * Default content renders DtListItem elements (single-select)
   * instead of checkboxes (multi-select).
   */
  useDropdown?: boolean;

  /**
   * When true, checkbox changes are held in a pending state until the user
   * clicks Apply. Cancel or closing the popover discards pending changes.
   * Applies to popover mode.
   */
  deferSelection?: boolean;

  /**
   * Array of filters to display in the popover, objects with `name` and `active` properties. Controlled when set
   * (Vue's `v-model`).
   */
  value?: DtFilterPillFilter[];

  /** The initial filters, when `value` isn't set. */
  defaultValue?: DtFilterPillFilter[];

  /** Called with the new filters when the active filters change (Vue's `update:modelValue`). */
  onValueChange?: (value: DtFilterPillFilter[]) => void;

  /**
   * Text shown in tooltip when you hover the start button,
   * required if no content is passed to default slot
   */
  startTooltipText?: string;

  /** HTML disabled attribute */
  disabled?: boolean;

  /**
   * When true, the pill cannot be interacted with but does not
   * receive disabled visual styling. Adds `d-filter-pill--read-only`
   * class and hides the chevron icon. The clear button is suppressed
   * and the tooltip falls back to a read-only message when
   * startTooltipText is not provided.
   */
  readOnly?: boolean;

  /**
   * Shows the clear button when a filter is active
   * @values true, false
   */
  showClear?: boolean;

  /** Label of the button */
  label?: string;

  /**
   * Text shown in tooltip when you hover the end button,
   * required as it is an icon only button
   */
  endTooltipText?: string;

  /**
   * Sets the element to which the popover component is going to append to
   * @values body, parent, root, HTMLElement
   */
  popoverAppendTo?: PopoverAppendTo | HTMLElement;

  /**
   * If the dropdown does not fit in the direction described by "popoverPlacement",
   * it will attempt to change it's direction to the "popoverFallbackPlacements".
   */
  popoverFallbackPlacements?: Placement[];

  /**
   * Determines maximum height for the popover before overflow.
   * Possible units rem|px|em
   */
  popoverMaxHeight?: string;

  /**
   * Minimum overlay inline size (aka left/right extent). Anchor uses the entire pill, including Clear.
   * Fixed layout values follow DtBox: 300 maps to --dt-layout-300; 0 uses natural sizing. Percentages are not supported.
   * The popoverMaxWidth cap still applies.
   * @values anchor, 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600
   */
  overlayMinInlineSize?: FilterPillOverlayMinInlineSize;

  /**
   * Determines maximum width for the popover before overflow.
   * Possible units rem|px|%|em
   */
  popoverMaxWidth?: string;

  /**
   * Padding preset for the popover content. Omit for compact block 100 / inline 150 spacing.
   * Set large to restore the previous content padding.
   * @values none, small, medium, large
   */
  popoverPadding?: PopoverPadding;

  /**
   * The direction the popover displays relative to the anchor.
   * @values top, top-start, top-end, right, right-start, right-end, left, left-start, left-end, bottom, bottom-start, bottom-end, auto, auto-start, auto-end
   */
  popoverPlacement?: PopoverDirection;

  /** Additional CSS class(es) applied to the label wrapper element. */
  labelClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the popover content area.
   * Applies to popover mode.
   */
  popoverContentClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the outer popover header element (`d-popover__header`).
   * Applies to popover mode.
   */
  popoverHeaderClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the outer popover footer element (`d-popover__footer`).
   * Applies to popover mode.
   */
  popoverFooterClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the popover dialog element.
   * Applies to popover mode.
   */
  popoverDialogClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the dropdown list wrapper.
   * Only applies when useDropdown is true.
   */
  dropdownListClass?: ClassValue;

  /**
   * Applies a color mode to the positioned content element.
   * @values light, dark, invert
   */
  contentMode?: ContentMode | null;

  /**
   * The size of the button.
   * @values 100, 200, 300, 400, 500
   */
  size?: ButtonSize;

  /**
   * Customize the anchor label. Legacy and controlled bindings are conditional on options: with `options` it gets
   * `label`, `selected`, `selectedOptions`, `displayLabel` and `isActive`.
   */
  children?: SlotProp<DtFilterPillLabelScope | DtFilterPillControlledAnchorScope>;

  /** Icon displayed before the label */
  startIcon?: SlotProp<DtButtonIconSlotScope>;

  /** Noninteractive controlled trailing anchor content, retaining the built-in label. */
  anchorEnd?: SlotProp<DtFilterPillControlledAnchorScope>;

  /** Noninteractive trailing choice content, retaining its label and handler. */
  optionEnd?: SlotProp<DtFilterPillOptionEndScope>;

  /**
   * Override overlay content, only use this if you need custom behavior. Bindings are conditional on the selection
   * contract. In a legacy dropdown, its scope is `{ close }` alone.
   */
  content?: SlotProp<DtFilterPillContentScope>;

  /**
   * Popover header or noninteractive built-in controlled dropdown heading. Absent in legacy dropdowns and full custom
   * dropdown content.
   */
  headerContent?: SlotProp<DtPopoverCloseScope>;

  /** Allows you to customize the popover footer. Receives { close, apply, cancel } bindings. */
  footerContent?: SlotProp<DtFilterPillFooterScope>;

  /** Proposed controlled value. The parent remains authoritative (Vue's `update:selected`). */
  onSelectedChange?: (selected: DtFilterPillSelected) => void;

  /** User action snapshot: value, previousValue, reason and changed. */
  onSelectionChange?: (action: DtFilterPillSelectionAction) => void;

  /** Logical visibility synchronization when controlled `open` is boolean (Vue's `update:open`). */
  onOpenChange?: (open: boolean) => void;

  /**
   * Controlled-only completed overlay visibility, after focus and scroll cleanup.
   * For removal, keep the modal, anchor and scroll container unchanged until onOpened(false).
   * Completion does not establish global scroll-lock ownership.
   */
  onOpened?: (opened: boolean) => void;

  /** Called with the React mouse event when clicking the clear button; `event.nativeEvent` is the browser's. */
  onClear?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /** Called when the popover is shown or hidden */
  onOpen?: (open: boolean) => void;

  /** Called when deferred selection is applied */
  onApply?: () => void;
}

const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];
const EMPTY_FILTERS: DtFilterPillFilter[] = [];
const EMPTY_VALUES: string[] = [];

/** Vue's `<slot>fallback</slot>`: the fallback, built only when the slot renders nothing. */
const withFallback = (node: ReactNode, fallback: () => ReactNode) => (
  Children.toArray(node).length > 0 ? node : fallback()
);

/** Vue's `$nextTick`: lets what the caller queued in the same turn commit first. */
const nextTick = () => Promise.resolve();

/** The filter without its `active` key: Vue's `delete filter.active`. */
const withoutActive = ({ active: _active, ...filter }: DtFilterPillFilter): DtFilterPillFilter => filter;

const activeNames = (filters: DtFilterPillFilter[]) =>
  filters.filter(filter => filter.active).map(filter => filter.name);

const ARROW_KEYS = ['ArrowDown', 'ArrowUp'];

/** The overlay's content element (`.d-popover__dialog`), which the anchor's `aria-controls` names. */
function getOverlayDialog (anchor: Element | null | undefined) {
  const id = anchor?.getAttribute('aria-controls');
  if (!anchor || !id) return null;
  return (anchor.getRootNode() as Document | ShadowRoot).getElementById?.(id) ?? document.getElementById(id);
}

interface OptionRowProps {
  id?: string;
  role: 'menuitem' | 'menuitemradio';
  selected: boolean;
  disabled?: boolean;
  description?: string | null;
  descriptionId?: string;
  end?: ReactNode;
  onClick: () => void;
  dataQa?: string;
  children: ReactNode;
}

/**
 * A DtListItem row that always reserves its selection indicator: DtListItem renders the check only while `selected`,
 * where Vue's `#selected` slot keeps a hidden one in an unselected row, so the row lays out the same either way.
 */
function FilterPillOptionRow ({
  id,
  role,
  selected,
  disabled,
  description,
  descriptionId,
  end,
  onClick,
  dataQa,
  children,
}: OptionRowProps) {
  return (
    <DtListItem
      id={id}
      role={role}
      type="custom"
      navigationType="arrow-keys"
      selected={selected}
      disabled={disabled}
      aria-describedby={description ? descriptionId : undefined}
      data-qa={dataQa}
      onClick={onClick}
    >
      <DtItemLayout
        unstyled
        className="d-list-item__wrapper"
        startClass="d-list-item__left"
        contentClass="d-list-item__content"
        titleClass="d-list-item__title"
        subtitleClass="d-list-item__subtitle"
        blockEndClass="d-list-item__bottom"
        endClass="d-list-item__right"
        selectedClass="d-list-item__selected"
        data-qa="dt-list-item-wrapper"
        subtitle={description
          ? (
            // Hidden from the row's name; aria-describedby still reads it as the description.
            <span
              id={descriptionId}
              aria-hidden="true"
              data-qa="dt-filter-pill__option-description"
            >
              {description}
            </span>
          )
          : undefined}
        end={end}
        selected={selected
          ? <DtIconCheck size="200" />
          : (
            <DtIconCheck
              size="200"
              className="d-filter-pill__selection-indicator--hidden"
              aria-hidden="true"
              data-qa="dt-filter-pill__selection-indicator"
            />
          )}
      >
        {children}
      </DtItemLayout>
    </DtListItem>
  );
}

/**
 * A filter pill is a button that opens a popover or dropdown of filters, and shows which of them are active.
 * @see https://dialtone.dialpad.com/components/filter_pill.html
 */
export function DtFilterPill (props: DtFilterPillProps) {
  const {
    ref,
    options,
    selected,
    neutralValue,
    open = null,
    anchorEndClass = '',
    optionEndClass = '',
    headerContentClass = '',
    useDropdown = false,
    deferSelection = false,
    value,
    defaultValue = EMPTY_FILTERS,
    onValueChange,
    startTooltipText = '',
    disabled = false,
    readOnly = false,
    showClear = true,
    label,
    endTooltipText = '',
    popoverAppendTo = 'body',
    popoverFallbackPlacements = DEFAULT_FALLBACK_PLACEMENTS,
    popoverMaxHeight = '',
    overlayMinInlineSize = 'anchor',
    popoverMaxWidth = '',
    popoverPadding,
    popoverPlacement = 'bottom-start',
    labelClass = '',
    popoverContentClass = '',
    popoverHeaderClass = '',
    popoverFooterClass = '',
    popoverDialogClass = '',
    dropdownListClass = '',
    contentMode = null,
    size = 200,
    children,
    startIcon,
    anchorEnd,
    optionEnd,
    content,
    headerContent,
    footerContent,
    onSelectedChange,
    onSelectionChange,
    onOpenChange,
    onOpened,
    onClear,
    onOpen,
    onApply,
    className,
    ...rest
  } = props;
  const i18n = useI18n();
  const idBase = useId();

  // An array of options at creation opts into the controlled contract for good, as does the pattern it started with.
  const [controlledAtBirth] = useState(() => Array.isArray(options));
  const [controlledDropdown] = useState(useDropdown);

  const [legacyFilters, setFilters] = useControllableState<DtFilterPillFilter[]>({
    value: controlledAtBirth ? undefined : value,
    defaultValue: controlledAtBirth ? EMPTY_FILTERS : defaultValue,
    onChange: onValueChange,
  });
  const filters = controlledAtBirth ? EMPTY_FILTERS : legacyFilters;

  const [isOpen, setIsOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<DtFilterPillFilter[] | null>(null);
  const [draft, setDraft] = useState<string[] | null>(null);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const [primaryButton, setPrimaryButton] = useState<HTMLElement | null>(null);
  const [clearButton, setClearButton] = useState<HTMLElement | null>(null);

  useImperativeHandle(ref, () => rootElement as HTMLDivElement, [rootElement]);

  // The selection, derived from the committed props: the parent stays authoritative.
  const controlledState = useMemo(
    () => getSelectionState(options, selected, { useDropdown: controlledDropdown, neutralValue }),
    [options, selected, controlledDropdown, neutralValue],
  );
  const controlledContractValid = Array.isArray(options) && useDropdown === controlledDropdown;
  const controlledCanSelect = controlledContractValid && controlledState.valid && !disabled && !readOnly;
  const controlledDeferred = !controlledDropdown && deferSelection;
  const controlledBase = JSON.stringify(
    Array.isArray(controlledState.value) ? [...controlledState.value].sort() : controlledState.value,
  );
  const unavailableLabel = i18n.$t('DIALTONE_FILTER_PILL_UNAVAILABLE_LABEL');
  const controlledAllSelected = !controlledState.unknownValues.length &&
    controlledState.options.length > 1 && controlledState.values.length === controlledState.options.length;

  let controlledDisplayLabel: string;
  if (!controlledState.valid || !controlledState.values.length) {
    controlledDisplayLabel = label || '';
  } else if (controlledDropdown) {
    const option = controlledState.selectedOptions[0];
    if (option) controlledDisplayLabel = option.shortLabel ?? option.label;
    else controlledDisplayLabel = controlledState.value === neutralValue ? (label || '') : unavailableLabel;
  } else if (controlledAllSelected) {
    controlledDisplayLabel = i18n.$t('DIALTONE_FILTER_PILL_ALL_LABEL');
  } else {
    const first = controlledState.values
      .map(item => controlledState.options.find(option => option.value === item)).find(Boolean);
    controlledDisplayLabel = first ? (first.shortLabel ?? first.label) : unavailableLabel;
  }

  const controlledOverflow = !controlledState.valid || controlledDropdown || controlledState.values.length <= 1 ||
    controlledAllSelected
    ? ''
    : `+${controlledState.values.length - 1}`;

  const controlledAccessibleLabel = !label
    ? (controlledDisplayLabel || i18n.$t('DIALTONE_FILTER_PILL_FILTER_LABEL'))
    : (label === controlledDisplayLabel
      ? controlledDisplayLabel
      : i18n.$t('DIALTONE_FILTER_PILL_SELECTION_LABEL', { label, selection: controlledDisplayLabel }));

  // Legacy display.
  const activeFilters = activeNames(filters);
  const allFiltersActive = filters.length > 1 && activeFilters.length === filters.length;
  const activeFilterList = allFiltersActive ? 'All' : (activeFilters[0] ?? '');
  const activeFilterLabel = allFiltersActive ? i18n.$t('DIALTONE_FILTER_PILL_ALL_LABEL') : activeFilterList;
  const activeFilterOverflow = activeFilters.length <= 1 || allFiltersActive ? '' : `+${activeFilters.length - 1}`;
  const activeFilterOverflowTitle = i18n.$t('DIALTONE_FILTER_PILL_OVERFLOW_TITLE', {
    count: controlledAtBirth ? controlledState.values.length - 1 : activeFilters.length - 1,
  });

  const isActive = controlledAtBirth
    ? controlledState.valid && controlledState.isActive
    : activeFilterList.length > 0;
  const hasClear = controlledAtBirth
    ? !readOnly && showClear && controlledContractValid && controlledState.valid && isActive
    : !readOnly && showClear && activeFilterList.length > 0;
  const buttonKind = isActive && !disabled ? 'default' : 'muted';
  const overlayUseDropdown = controlledAtBirth ? controlledDropdown : useDropdown;
  const displayFilters = deferSelection && pendingFilters ? pendingFilters : filters;
  const pendingActiveFilters = pendingFilters ? activeNames(pendingFilters) : [];

  const resolvedStartTooltipText = readOnly
    ? startTooltipText || i18n.$t('DIALTONE_FILTER_PILL_READ_ONLY_TOOLTIP')
    : startTooltipText;
  const clearButtonAriaLabel = endTooltipText || i18n.$t('DIALTONE_FILTER_PILL_CLEAR_BUTTON_LABEL');
  const clearButtonTitle = endTooltipText ? undefined : clearButtonAriaLabel;
  const clearIconSize = (String(size) === '100'
    ? '100'
    : BUTTON_ICON_SIZES[String(size) as keyof typeof BUTTON_ICON_SIZES]) as IconSize | undefined;

  useTooltipDirective(primaryButton, resolvedStartTooltipText);
  useTooltipDirective(clearButton, endTooltipText);

  // What the async and event code reads: the latest committed render, with Vue's synchronous data for what it writes.
  const live = useRef<{
    state: typeof controlledState;
    base: string;
    canSelect: boolean;
    contractValid: boolean;
    deferred: boolean;
    open: boolean | null;
    disabled: boolean;
    readOnly: boolean;
    hasClear: boolean;
    useDropdown: boolean;
    callbacks: Pick<DtFilterPillProps,
      'onSelectedChange' | 'onSelectionChange' | 'onOpenChange' | 'onOpened' | 'onClear' | 'onOpen' | 'onApply'>;
    primaryButton: HTMLElement | null;
  }>(null as never);
  live.current = {
    state: controlledState,
    base: controlledBase,
    canSelect: controlledCanSelect,
    contractValid: controlledContractValid,
    deferred: controlledDeferred,
    open,
    disabled,
    readOnly,
    hasClear,
    useDropdown,
    callbacks: { onSelectedChange, onSelectionChange, onOpenChange, onOpened, onClear, onOpen, onApply },
    primaryButton,
  };
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const draftBase = useRef('');
  const draftSession = useRef(0);
  const applying = useRef(false);
  const disposed = useRef(false);
  const rejectedLockedOpen = useRef(false);
  const optionIds = useRef(new Map<string, string>());
  const optionIdCounter = useRef(0);
  const warnings = useRef(new Set<string>());
  const pendingFocus = useRef<OptionFocus | null>(null);
  const clearWasFocused = useRef(false);
  const clearElement = useRef<HTMLElement | null>(null);

  const setOpenNow = (next: boolean) => {
    isOpenRef.current = next;
    setIsOpen(next);
  };
  const setDraftNow = (next: string[] | null) => {
    draftRef.current = next;
    setDraft(next);
  };

  const controlledOptionId = (optionValue: string) => {
    let optionId = optionIds.current.get(optionValue);
    if (optionId === undefined) {
      optionId = `${idBase}-option-${optionIdCounter.current++}`;
      optionIds.current.set(optionValue, optionId);
    }
    return optionId;
  };
  const controlledDescriptionId = (optionValue: string) => `${controlledOptionId(optionValue)}-description`;
  const controlledDraftOpen = controlledDeferred && isOpen && draft !== null;
  const controlledRowSelected = (optionValue: string) => (controlledState.valid
    ? (draft ?? controlledState.values).includes(optionValue)
    : false);

  const warnControlled = (message: string) => {
    if (warnings.current.has(message)) return;
    warnings.current.add(message);
    devWarn(`[Dialtone FilterPill] ${message}`);
  };

  // Vue's `$emit` for the action events: read from the latest render, so a retained handler isn't stale.
  const callbacks = () => live.current.callbacks;

  /** Start a new draft session for the current open state; returns its token. */
  const rebaseControlledDraft = () => {
    setDraftNow([...live.current.state.values]);
    draftBase.current = live.current.base;
  };

  const resetControlledDraft = () => {
    const session = ++draftSession.current;
    applying.current = false;
    if (isOpenRef.current && live.current.deferred) rebaseControlledDraft();
    else setDraftNow(null);
    return session;
  };

  const requestControlledOpen = (next: boolean, notify = true) => {
    if (disposed.current) return;
    const current = live.current;
    if (next && (!current.contractValid || current.disabled || current.readOnly)) {
      if (current.open === true && !rejectedLockedOpen.current) {
        rejectedLockedOpen.current = true;
        callbacks().onOpenChange?.(false);
      }
      return;
    }
    if (next === isOpenRef.current) return;
    setOpenNow(next);
    const session = resetControlledDraft();
    if (notify && typeof current.open === 'boolean') callbacks().onOpenChange?.(next);
    if (disposed.current || session !== draftSession.current) return;
    callbacks().onOpen?.(next);
  };

  const closeControlled = () => requestControlledOpen(false);

  const commitControlled = (
    next: DtFilterPillSelected,
    reason: DtFilterPillSelectionReason,
    close = false,
    originalEvent?: MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
  ) => {
    if (disposed.current || !live.current.canSelect) return;
    const previousValue = selectionSnapshot(live.current.state.value);
    const nextValue = selectionSnapshot(next);
    const changed = !sameSelection(nextValue, previousValue);
    const action: DtFilterPillSelectionAction = { value: nextValue, previousValue, reason, changed };
    if (changed) callbacks().onSelectedChange?.(selectionSnapshot(nextValue));
    if (disposed.current) return;
    callbacks().onSelectionChange?.(action);
    if (disposed.current) return;
    if (reason === 'clear' && originalEvent) callbacks().onClear?.(originalEvent);
    if (reason === 'apply') callbacks().onApply?.();
    if (disposed.current) return;
    if (close) requestControlledOpen(false);
  };

  const toggleControlledOption = (optionValue: string, checked: boolean) => {
    if (!controlledCanSelect) return;
    const current = draft ?? (controlledState.value as string[]);
    let next = current.filter(item => item !== optionValue);
    if (checked) next = current.includes(optionValue) ? [...current] : [...current, optionValue];
    if (controlledDraftOpen) setDraftNow(next);
    else commitControlled(next, 'toggle');
  };

  /** Built-in row activation. Refuses an unavailable option itself rather than trusting the row to stay silent. */
  const selectControlledOption = (optionValue: string) => {
    if (controlledState.rows.find(row => row.option.value === optionValue)?.disabled) return;
    commitControlled(optionValue, 'select', true);
  };

  const setControlledSelected = (next: DtFilterPillSelected) => {
    if (!live.current.canSelect) return;
    const state = getSelectionState(options, next, { useDropdown: controlledDropdown });
    if (next === undefined || !state.valid) {
      warnControlled('setSelected requires the selected shape for this pattern.');
      return;
    }
    if (draftRef.current !== null && live.current.deferred && isOpenRef.current) {
      setDraftNow([...state.values]);
    } else {
      commitControlled(state.value, controlledDropdown ? 'select' : 'toggle', Boolean(controlledDropdown));
    }
  };

  /** Controlled Apply closes on success; custom footers should call apply() alone or await it. */
  const applyControlledSelection = async () => {
    const stillValid = () => !disposed.current && isOpenRef.current && draftRef.current !== null &&
      live.current.canSelect;
    if (disposed.current || applying.current || !live.current.deferred || !stillValid()) return;
    applying.current = true;
    const session = draftSession.current;
    // Let the caller finish same-turn parent writes before reading the committed selection.
    await nextTick();
    await nextTick();
    if (disposed.current || session !== draftSession.current || !stillValid()) {
      if (!disposed.current && session === draftSession.current) applying.current = false;
      return;
    }
    if (draftBase.current !== live.current.base) rebaseControlledDraft();
    commitControlled([...(draftRef.current as string[])], 'apply', true);
    if (!disposed.current && session === draftSession.current) applying.current = false;
  };

  // Legacy popover filters.
  const clearFilter = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (controlledAtBirth) {
      const baseline = controlledDropdown ? (neutralValue ?? null) : [];
      setDraftNow(null);
      commitControlled(baseline, 'clear', true, event);
      return;
    }
    setFilters(filters.map(withoutActive));
    onClear?.(event);
  };

  const openPopover = () => {
    if (controlledAtBirth) {
      requestControlledOpen(true);
      return;
    }
    if (readOnly) return;
    setIsOpen(true);
  };

  const onAnchorKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (!ARROW_KEYS.includes(event.key)) return;
    event.preventDefault();
    if (!controlledAtBirth) openPopover();
    else if (!controlledDropdown) requestControlledOpen(true);
  };

  // A controlled dropdown takes its arrows from the overlay, which tells the dropdown the keyboard opened it.
  const onOverlayKeyDown = (event: globalThis.KeyboardEvent) => {
    if (!controlledAtBirth || !controlledDropdown || isOpenRef.current || !ARROW_KEYS.includes(event.key) ||
      !primaryButton?.contains(event.target as Node)) return;
    event.preventDefault();
    requestControlledOpen(true);
  };

  const onControlledVisibility = (next: boolean) => {
    if (controlledAtBirth) requestControlledOpen(next);
  };

  const onOverlayOpened = (next: boolean) => {
    if (controlledAtBirth && !disposed.current && next === isOpenRef.current) callbacks().onOpened?.(next);
  };

  const selectFilter = (selectedFilter: DtFilterPillFilter, close: () => void) => {
    setFilters(filters.map(filter => ({ ...filter, active: filter === selectedFilter })));
    close();
  };

  // Vue's `filter.active = $event` on whichever list is displayed: the pending one while deferring.
  const setFilterActive = (index: number, active: boolean) => {
    const toggle = (list: DtFilterPillFilter[]) =>
      list.map((filter, i) => (i === index ? { ...filter, active } : filter));
    if (deferSelection && pendingFilters) setPendingFilters(toggle(pendingFilters));
    else setFilters(toggle(filters));
  };

  const applySelection = (): void | Promise<void> => {
    if (controlledAtBirth) return applyControlledSelection();
    if (!pendingFilters) return undefined;
    setFilters(filters.map((filter, i) => (pendingFilters[i]
      ? { ...filter, active: pendingFilters[i].active }
      : withoutActive(filter))));
    onApply?.();
    setIsOpen(false);
    return undefined;
  };

  const cancelSelection = () => {
    if (controlledAtBirth) closeControlled();
    else setIsOpen(false);
  };

  // Vue's isOpen watcher: legacy deferSelection copies the committed filters when the popover opens, and drops the
  // copy when it closes.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!controlledAtBirth && deferSelection) setPendingFilters(isOpen ? JSON.parse(JSON.stringify(filters)) : null);
  }

  // The same watcher reports every change of a legacy isOpen, which it doesn't do on mount.
  const reportedOpen = useRef(isOpen);
  const reportOpen = useEffectEvent((next: boolean) => onOpen?.(next));
  useEffect(() => {
    if (reportedOpen.current === isOpen) return;
    reportedOpen.current = isOpen;
    if (!controlledAtBirth) reportOpen(isOpen);
  }, [isOpen, controlledAtBirth]);

  // --- Controlled lifecycle: Vue's created, beforeUnmount and watchers, in their order. ---

  // beforeUnmount. A layout effect, so the flag is set before an action listener that unmounts the pill returns.
  useLayoutEffect(() => {
    disposed.current = false;
    return () => {
      disposed.current = true;
      draftSession.current++;
    };
  }, []);

  const checkControlledConfiguration = () => {
    if (Array.isArray(options) !== controlledAtBirth || (controlledAtBirth && useDropdown !== controlledDropdown)) {
      warnControlled('Selection contract and controlled useDropdown cannot change in place; remount with a key.');
      if (controlledAtBirth) requestControlledOpen(false);
    }
    if (!controlledAtBirth) return;
    if ('value' in props) warnControlled('modelValue is ignored when controlled options are supplied.');
    controlledState.issues.forEach(warnControlled);
  };

  // created(): once per instance, whatever re-runs the effects.
  const created = useRef(false);
  useEffect(() => {
    if (created.current) return;
    created.current = true;
    if (controlledAtBirth && open === true) requestControlledOpen(true, false);
  });

  // The watchers don't run on mount: each compares with what it last saw.
  const seen = useRef({ open, deferSelection, disabled, readOnly, hasClear });

  useEffect(() => {
    if (seen.current.open === open) return;
    seen.current.open = open;
    if (!controlledAtBirth || disposed.current || open === null) return;
    if (!open) rejectedLockedOpen.current = false;
    requestControlledOpen(open, false);
  });

  useEffect(() => {
    if (seen.current.deferSelection === deferSelection) return;
    seen.current.deferSelection = deferSelection;
    if (controlledAtBirth && isOpenRef.current) resetControlledDraft();
  });

  const closeWhenLocked = () => {
    if (!controlledAtBirth || (!live.current.disabled && !live.current.readOnly)) return;
    if (isOpenRef.current) {
      rejectedLockedOpen.current = live.current.open === true;
      requestControlledOpen(false);
    } else if (live.current.open === true) {
      requestControlledOpen(true);
    }
  };

  useEffect(() => {
    if (seen.current.disabled === disabled) return;
    seen.current.disabled = disabled;
    closeWhenLocked();
  });

  useEffect(() => {
    if (seen.current.readOnly === readOnly) return;
    seen.current.readOnly = readOnly;
    closeWhenLocked();
  });

  // Vue reads the focused option before its update patches the DOM; React has patched it by its effects, so a render
  // that gets a new selection state records it first.
  const previousState = useRef(controlledState);
  if (controlledAtBirth && previousState.current !== controlledState) {
    pendingFocus.current = captureOptionFocus(
      getOverlayDialog(primaryButton),
      isOpenRef.current,
      previousState.current.options.map(option => option.value),
      optionIds.current,
    );
    previousState.current = controlledState;
  }

  const restoreRemovedOptionFocus = async (focus: OptionFocus) => {
    const { active, root, index } = focus;
    const retained = live.current.state.options.find(option => optionIds.current.get(option.value) === active.id);
    const session = draftSession.current;
    await nextTick();
    const current = root.activeElement ?? active.ownerDocument.activeElement;
    // Focus is lost when the row left the DOM: on the body, the shadow host, or the overlay that traps focus.
    const popup = live.current.primaryButton?.getAttribute('aria-controls');
    const lostTo = [
      active, active.ownerDocument.body, (root as ShadowRoot).host, popup ? root.getElementById(popup) : null,
    ];
    if (disposed.current || !isOpenRef.current || session !== draftSession.current ||
      !lostTo.includes(current as Element)) return;
    const { options: records } = live.current.state;
    const nearest = retained ?? records[Math.min(index, records.length - 1)];
    const popupId = live.current.primaryButton?.getAttribute('aria-controls');
    const target = nearest
      ? root.getElementById(controlledOptionId(nearest.value))
      : (popupId ? root.getElementById(popupId) : null);
    if (controlledDropdown) {
      const popup = popupId ? root.getElementById(popupId) : null;
      syncDropdownHighlight(popup, nearest && target ? target : null);
    }
    target?.focus();
  };

  // controlledOptionValues: Vue's watcher fires on every recompute of the selection state.
  const seenState = useRef(controlledState);
  useEffect(() => {
    if (seenState.current === controlledState) return;
    seenState.current = controlledState;
    if (!controlledAtBirth) return;
    const focus = pendingFocus.current;
    pendingFocus.current = null;
    if (focus) restoreRemovedOptionFocus(focus);
    const values = controlledState.options.map(option => option.value);
    for (const optionValue of optionIds.current.keys()) {
      if (!values.includes(optionValue)) optionIds.current.delete(optionValue);
    }
  }, [controlledState]);

  // controlledBase
  const seenBase = useRef(controlledBase);
  useEffect(() => {
    if (seenBase.current === controlledBase) return;
    seenBase.current = controlledBase;
    if (!controlledAtBirth) return;
    if (isOpenRef.current && live.current.deferred) rebaseControlledDraft();
  }, [controlledBase]);

  // Every update checks the configuration, as Vue's created, updated and option watchers do; each message shows once.
  useEffect(() => {
    checkControlledConfiguration();
  });

  // The clear button leaves while it holds focus: record that before the DOM loses it.
  const setClearRef = useCallback((element: HTMLElement | null) => {
    const previous = clearElement.current;
    if (element === null && previous && (previous.getRootNode() as Document | ShadowRoot).activeElement === previous) {
      clearWasFocused.current = true;
    }
    clearElement.current = element;
    setClearButton(element);
  }, []);

  useEffect(() => {
    const previous = seen.current.hasClear;
    seen.current.hasClear = hasClear;
    if (!controlledAtBirth || !previous || hasClear || isOpenRef.current) return;
    const wasFocused = clearWasFocused.current;
    clearWasFocused.current = false;
    if (!wasFocused) return;
    nextTick().then(() => {
      if (disposed.current || live.current.hasClear || live.current.disabled) return;
      const active = document.activeElement;
      if (active === document.body || active === null) live.current.primaryButton?.focus();
    });
  }, [hasClear]);

  // Vue's missing-content check runs once, in mounted(), and warns in every build.
  const checkedOnMount = useRef(false);
  const missingContent = !(filters.length || content !== undefined);
  const deferWithDropdown = deferSelection && useDropdown;
  useEffect(() => {
    if (checkedOnMount.current) return;
    checkedOnMount.current = true;
    if (!controlledAtBirth && missingContent) {
      console.warn('Please provide content through the v-model or the "content" slot.');
    }
    if (deferWithDropdown) console.warn('deferSelection has no effect when useDropdown is true.');
  }, [missingContent, deferWithDropdown, controlledAtBirth]);

  // --- Overlay minimum inline size ---

  const getAnchorControls = () => {
    // Legacy Dropdown slot bindings replace the primary button's ref.
    const primary = rootElement?.querySelector<HTMLElement>('[data-qa="dt-filter-pill__button"]');
    return [primary, clearElement.current].filter(Boolean) as HTMLElement[];
  };

  const resolveOverlayMinInlineSize = () => {
    let minimum: string = String(overlayMinInlineSize ?? '0');
    if (minimum === 'anchor') {
      // The flex wrapper may stretch beyond the visible pill controls.
      const controls = getAnchorControls();
      let measured = 0;
      if (controls.length && rootElement) {
        const vertical = /^(vertical|sideways)/.test(getComputedStyle(rootElement).writingMode);
        const [start, end] = vertical ? ['top', 'bottom'] as const : ['left', 'right'] as const;
        const bounds = controls.map(element => element.getBoundingClientRect());
        measured = Math.max(...bounds.map(rect => rect[end])) - Math.min(...bounds.map(rect => rect[start]));
      }
      minimum = `${measured}px`;
    } else {
      minimum = minimum === '0' ? '0px' : `var(--dt-layout-${minimum})`;
    }
    if (minimum && popoverMaxWidth && popoverMaxWidth !== 'none') return `min(${minimum}, ${popoverMaxWidth})`;
    return minimum;
  };

  // The overlay's dialog, where Vue reads popover.popoverContentEl. Its position isn't recomputed after a change
  // (Vue also calls popperInstance.update()): DtPopover exposes no handle to tippy.
  // Vue's overlay has no content element to size until it has been shown, so a closed pill never writes a style.
  const everOpened = useRef(false);
  const syncOverlayMinInlineSize = useEffectEvent(() => {
    if (!rootElement || !everOpened.current) return;
    const dialog = getOverlayDialog(getAnchorControls()[0]);
    if (!dialog) return;
    const minimum = resolveOverlayMinInlineSize();
    if (dialog.style.minInlineSize === minimum) return;
    dialog.style.minInlineSize = minimum;
  });

  // observeOverlayAnchor
  useEffect(() => {
    if (!rootElement) return undefined;
    let observer: ResizeObserver | null = null;
    let active = true;
    if (overlayMinInlineSize === 'anchor' && typeof ResizeObserver !== 'undefined') {
      // A callback the observer still holds after cleanup must not touch the dialog again.
      observer = new ResizeObserver(() => { if (active) syncOverlayMinInlineSize(); });
      [rootElement, ...getAnchorControls()].forEach(element => observer?.observe(element));
    }
    syncOverlayMinInlineSize();
    return () => {
      active = false;
      observer?.disconnect();
    };
    // The anchor controls come and go with the clear button and the overlay, which hasClear and overlayUseDropdown follow.
  }, [rootElement, overlayMinInlineSize, overlayUseDropdown, hasClear, clearButton, primaryButton]);

  useEffect(() => {
    if (isOpen) everOpened.current = true;
    syncOverlayMinInlineSize();
  }, [isOpen, popoverMaxWidth]);

  // --- Rendering ---

  const controlledAnchorBindings: DtFilterPillControlledAnchorScope = {
    label,
    selected: selectionSnapshot(controlledState.value),
    selectedOptions: [...controlledState.selectedOptions],
    displayLabel: controlledDisplayLabel,
    isActive,
  };

  const controlledContentBindings: DtFilterPillContentScope = {
    close: closeControlled,
    selected: selectionSnapshot(controlledState.value),
    pendingSelected: draft === null ? null : [...draft],
    setSelected: setControlledSelected,
    apply: applySelection,
    cancel: cancelSelection,
  };

  const labelScope: DtFilterPillLabelScope = { label, filters, activeFilters, activeFilterList, activeFilterOverflow };

  const optionEndNode = (option: DtFilterPillOption) => (optionEnd !== undefined
    ? (
      <span className={cx('d-filter-pill__option-end', optionEndClass)}>
        {renderSlot(optionEnd, { option, selected: controlledRowSelected(option.value) })}
      </span>
    )
    : undefined);

  const renderControlledLabel = () => (
    <>
      <span
        className="sr-only"
        data-qa="dt-filter-pill__accessible-label"
      >
        {controlledAccessibleLabel}
      </span>
      {(controlledDropdown || !isActive || label) && (
        <span
          className="d-filter-pill__label-start"
          data-qa="dt-filter-pill__label-start"
          aria-hidden="true"
        >
          {controlledDropdown || !isActive ? controlledDisplayLabel : label}
        </span>
      )}
      {!controlledDropdown && isActive && (
        <span
          className={cx('d-filter-pill__label-end', { 'd-filter-pill__label-end--standalone': !label })}
          data-qa="dt-filter-pill__label-end"
          aria-hidden="true"
        >
          {controlledDisplayLabel}
        </span>
      )}
      {controlledOverflow && (
        <span
          className="d-filter-pill__label-end-overflow"
          data-qa="dt-filter-pill__overflow"
          title={activeFilterOverflowTitle}
        >
          {controlledOverflow}
        </span>
      )}
      {anchorEnd !== undefined && hasContent(renderSlot(anchorEnd, controlledAnchorBindings)) && (
        <span
          className={cx('d-filter-pill__anchor-end', anchorEndClass)}
          data-qa="dt-filter-pill__anchor-end"
        >
          {renderSlot(anchorEnd, controlledAnchorBindings)}
        </span>
      )}
    </>
  );

  const renderLegacyLabel = () => (
    <>
      <span
        className="d-filter-pill__label-start"
        title={label}
      >
        {label}
      </span>
      {activeFilterList && (
        <span
          className="d-filter-pill__label-end"
          title={activeFilterLabel}
        >
          {activeFilterLabel}
        </span>
      )}
      {activeFilterOverflow && (
        <span
          className="d-filter-pill__label-end-overflow"
          title={activeFilterOverflowTitle}
        >
          {activeFilterOverflow}
        </span>
      )}
    </>
  );

  const anchor = (attrs: object) => (
    <DtButton
      ref={setPrimaryButton}
      {...attrs}
      active={isActive}
      aria-disabled={readOnly || undefined}
      className={cx('d-filter-pill__primary', { 'd-filter-pill--selected': isActive })}
      disabled={disabled}
      kind={buttonKind}
      size={size}
      data-qa="dt-filter-pill__button"
      importance="outlined"
      onClick={openPopover}
      onKeyDown={onAnchorKeyDown}
      startIcon={startIcon}
      endIcon={readOnly ? undefined : ({ iconSize }: DtButtonIconSlotScope) => (
        <DtIconChevronDown
          size={iconSize}
          className="d-filter-pill__icon"
          data-qa="dt-filter-pill__icon"
        />
      )}
    >
      <span
        className={cx('d-filter-pill__label', labelClass)}
        data-qa="dt-filter-pill__label"
      >
        {controlledAtBirth
          ? withFallback(renderSlot(children, controlledAnchorBindings), renderControlledLabel)
          : withFallback(renderSlot(children, labelScope), renderLegacyLabel)}
      </span>
    </DtButton>
  );

  const overlayProps = {
    open: isOpen,
    appendTo: popoverAppendTo,
    fallbackPlacements: popoverFallbackPlacements,
    maxHeight: popoverMaxHeight,
    maxWidth: popoverMaxWidth,
    modal: true,
    placement: popoverPlacement,
    contentMode,
    ariaLabel: controlledAtBirth && content === undefined ? label : undefined,
    // A legacy overlay owns its visibility through its own open change; a controlled one reports every logical change.
    onOpenChange: controlledAtBirth ? undefined : setIsOpen,
    onOpened: onOverlayOpened,
    onKeyDown: onOverlayKeyDown,
    ...(controlledAtBirth
      ? { visibilityChangeCallback: onControlledVisibility, forwardAnchorArrowKeys: true }
      : {}),
  };

  const defaultPadding = popoverPadding === undefined;

  const renderControlledDropdownRows = () => (
    <>
      {headerContent !== undefined && (
        <li
          role="presentation"
          className={cx('d-filter-pill__menu-heading', headerContentClass)}
        >
          {/* modules/FilterPillOptionGroup.tsx headings use these DtText props; keep them matched. */}
          <DtText
            variant="label-xs"
            size={100}
            strength="medium"
            tone="tertiary"
            density={500}
          >
            {renderSlot(headerContent, { close: closeControlled })}
          </DtText>
        </li>
      )}
      {/* Positional keys keep a plain list one stable section; rows inside reconcile by value. */}
      {controlledState.sections.map((section, index) => (
        <DtFilterPillOptionGroup
          key={index}
          heading={section.group}
        >
          {section.rows.map(row => (
            <FilterPillOptionRow
              key={row.option.value}
              id={controlledOptionId(row.option.value)}
              role="menuitemradio"
              dataQa="dt-filter-pill__option"
              selected={controlledRowSelected(row.option.value)}
              disabled={!controlledCanSelect || row.disabled}
              description={row.description}
              descriptionId={controlledDescriptionId(row.option.value)}
              end={optionEndNode(row.option)}
              onClick={() => selectControlledOption(row.option.value)}
            >
              {row.option.label}
            </FilterPillOptionRow>
          ))}
        </DtFilterPillOptionGroup>
      ))}
    </>
  );

  const overlay = overlayUseDropdown
    ? (
      <DtDropdown
        {...overlayProps}
        listClass={dropdownListClass}
        anchor={attrs => anchor(attrs)}
        list={({ close }) => (controlledAtBirth
          ? withFallback(renderSlot(content, controlledContentBindings), renderControlledDropdownRows)
          : withFallback(
            renderSlot(content, { close } as DtFilterPillContentScope),
            () => filters.map(filter => (
              <FilterPillOptionRow
                key={filter.name}
                role="menuitem"
                selected={Boolean(filter.active)}
                onClick={() => selectFilter(filter, close)}
              >
                {filter.name}
              </FilterPillOptionRow>
            )),
          ))}
      />
      )
    : (
      <DtPopover
        {...overlayProps}
        padding={defaultPadding ? 'none' : popoverPadding}
        contentClass={defaultPadding ? ['d-filter-pill__popover-content', popoverContentClass] : popoverContentClass}
        headerWrapperClass={defaultPadding
          ? [POPOVER_HEADER_FOOTER_PADDING_CLASSES.large, popoverHeaderClass]
          : popoverHeaderClass}
        headerClass={headerContentClass}
        footerWrapperClass={defaultPadding
          ? [POPOVER_HEADER_FOOTER_PADDING_CLASSES.large, popoverFooterClass]
          : popoverFooterClass}
        dialogClass={popoverDialogClass}
        anchor={({ attrs }) => anchor(attrs)}
        content={({ close }) => (controlledAtBirth
          ? withFallback(
            renderSlot(content, controlledContentBindings),
            () => (
              <DtCheckboxGroup
                value={controlledState.valid ? [...(draft ?? controlledState.values)] : EMPTY_VALUES}
                aria-label={label}
                name={label || 'filter-pill'}
                disabled={!controlledCanSelect}
              >
                {controlledState.options.map(option => (
                  <DtCheckbox
                    key={option.value}
                    id={controlledOptionId(option.value)}
                    label={option.label}
                    value={option.value}
                    data-qa="dt-filter-pill__checkbox"
                    onCheckedChange={(checked: boolean) => toggleControlledOption(option.value, checked)}
                  >
                    {option.label}
                    {optionEndNode(option)}
                  </DtCheckbox>
                ))}
              </DtCheckboxGroup>
            ),
          )
          : withFallback(
            renderSlot(content, { close, apply: applySelection, cancel: cancelSelection, pendingFilters }),
            () => filters.length > 0 && (
              <DtCheckboxGroup
                value={deferSelection ? pendingActiveFilters : activeFilters}
                aria-label={label}
                name={label || 'filter-pill'}
              >
                {displayFilters.map((filter, index) => (
                  <DtCheckbox
                    key={filter.name}
                    label={filter.name}
                    value={filter.name}
                    onCheckedChange={(checked: boolean) => setFilterActive(index, checked)}
                  />
                ))}
              </DtCheckboxGroup>
            ),
          ))}
        headerContent={headerContent !== undefined
          ? ({ close }) => renderSlot(headerContent, { close: controlledAtBirth ? closeControlled : close })
          : undefined}
        footerContent={deferSelection || footerContent !== undefined
          ? ({ close }) => withFallback(
            renderSlot(footerContent, {
              close: controlledAtBirth ? closeControlled : close,
              apply: applySelection,
              cancel: cancelSelection,
            }),
            () => deferSelection && (
              <DtStack
                direction="row"
                gap="400"
                justify="end"
                data-qa="dt-filter-pill__deferred-footer"
              >
                <DtButton
                  importance="clear"
                  kind="muted"
                  size={200}
                  data-qa="dt-filter-pill__cancel-button"
                  onClick={cancelSelection}
                >
                  {i18n.$t('DIALTONE_FILTER_PILL_CANCEL_BUTTON_LABEL')}
                </DtButton>
                <DtButton
                  importance="primary"
                  size={200}
                  data-qa="dt-filter-pill__apply-button"
                  onClick={applySelection}
                >
                  {i18n.$t('DIALTONE_FILTER_PILL_APPLY_BUTTON_LABEL')}
                </DtButton>
              </DtStack>
            ),
          )
          : undefined}
      />
      );

  // A legacy pill keeps the new controlled inputs as plain attributes of its root, as Vue lets them fall through.
  const legacyAttrs: Record<string, unknown> = controlledAtBirth
    ? {}
    : { ...(selected !== undefined && { selected }), ...(open !== null && { open }) };

  return (
    <div
      ref={setRootElement}
      className={cx('d-filter-pill', { 'd-filter-pill--read-only': readOnly }, className)}
      {...legacyAttrs}
      data-qa="dt-filter-pill"
      {...rest}
    >
      {overlay}
      {hasClear && (
        <DtButton
          ref={setClearRef}
          active={isActive}
          aria-label={clearButtonAriaLabel}
          className={cx('d-filter-pill__clear', { 'd-filter-pill__clear--selected': isActive })}
          disabled={disabled}
          kind={buttonKind}
          size={size}
          title={clearButtonTitle}
          data-qa="dt-filter-pill__clear-button"
          importance="outlined"
          onClick={clearFilter}
          icon={<DtIconClose size={clearIconSize} />}
        />
      )}
    </div>
  );
}

interface OptionFocus {
  active: HTMLElement;
  root: Document | ShadowRoot;
  index: number;
}

/** The focused option row, if one of ours has focus inside the open overlay. */
function captureOptionFocus (
  dialog: Element | null,
  isOpen: boolean,
  previousValues: string[],
  ids: Map<string, string>,
): OptionFocus | null {
  if (!isOpen || !dialog) return null;
  const root = dialog.getRootNode() as Document | ShadowRoot;
  const active = root.activeElement as HTMLElement | null;
  if (!active) return null;
  const index = previousValues.findIndex(optionValue => ids.get(optionValue) === active.id);
  return index < 0 ? null : { active, root, index };
}

const DROPDOWN_ITEMS = '[role="menuitem"], [role="menuitemradio"], #sr-only-close-button';

/**
 * Moves the dropdown's keyboard position to the row `target`, where Vue's FilterPill calls the dropdown's
 * `setHighlightId`. DtDropdown has no handle for it, so this presses the keys that move the position: Home, then
 * ArrowDown down to the row's index, which also leaves focus on it. (Vue's `clearHighlightIndex`, for a list with no
 * rows left, has no key; nothing is left to navigate to.)
 */
function syncDropdownHighlight (popup: Element | null, target: HTMLElement | null) {
  if (!popup || !target) return;
  const items = [...popup.querySelectorAll<HTMLElement>(DROPDOWN_ITEMS)]
    .filter(item => item.getAttribute('role') !== 'menuitemradio' || item.id);
  const index = items.indexOf(target);
  if (index < 0) return;
  const press = (key: string) => target.dispatchEvent(
    new KeyboardEvent('keydown', { key, code: key, bubbles: true, cancelable: true }),
  );
  press('Home');
  for (let step = 0; step < index; step++) press('ArrowDown');
}
