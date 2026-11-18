import {
  Children,
  useEffect,
  useEffectEvent,
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
import { useControllableState } from '../../common/hooks/useControllableState';
import { useI18n } from '../../common/localization';
import type { ContentMode } from '../../common/mode_constants';
import { renderSlot, type SlotProp } from '../../common/slots';
import { DtIconChevronDown, DtIconClose, type IconSize } from '../../icons';
import { BUTTON_ICON_SIZES, DtButton, type ButtonSize, type DtButtonIconSlotScope } from '../Button';
import { DtCheckbox } from '../Checkbox';
import { DtCheckboxGroup } from '../CheckboxGroup';
import { DtDropdown } from '../Dropdown';
import { DtListItem } from '../ListItem';
import {
  DtPopover,
  type DtPopoverCloseScope,
  type PopoverAppendTo,
  type PopoverDirection,
  type PopoverPadding,
} from '../Popover';
import { DtStack } from '../Stack';
import { useTooltipDirective } from '../Tooltip';

/** One filter: the checkbox (or list item) `name`, checked when `active`. */
export interface DtFilterPillFilter {
  name: string;
  active?: boolean;
}

/** What the default (label) slot gets. */
export interface DtFilterPillLabelScope {
  label: string | undefined;
  filters: DtFilterPillFilter[];
  activeFilters: string[];
  activeFilterList: string;
  activeFilterOverflow: string;
}

/** What the content slot gets in popover mode. */
export interface DtFilterPillContentScope extends DtPopoverCloseScope {
  /** Commits the pending selection and closes the popover (deferSelection). */
  apply: () => void;
  /** Discards the pending selection and closes the popover. */
  cancel: () => void;
  /** The selection being edited, while the popover is open with deferSelection; null otherwise. */
  pendingFilters: DtFilterPillFilter[] | null;
}

/** What the footerContent slot gets. */
export interface DtFilterPillFooterScope extends DtPopoverCloseScope {
  apply: () => void;
  cancel: () => void;
}

type NativeAttributes = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'content' | 'defaultValue'>;

export interface DtFilterPillProps extends NativeAttributes {
  /** The root element. */
  ref?: Ref<HTMLDivElement>;

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
   * Only applies to popover mode (not useDropdown).
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
   * Determines maximum width for the popover before overflow.
   * Possible units rem|px|%|em
   */
  popoverMaxWidth?: string;

  /**
   * Padding size class for the popover content.
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
   * Only applies when useDropdown is false.
   */
  popoverContentClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the outer popover header element (`d-popover__header`).
   * Only applies when useDropdown is false.
   */
  popoverHeaderClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the outer popover footer element (`d-popover__footer`).
   * Only applies when useDropdown is false.
   */
  popoverFooterClass?: ClassValue;

  /**
   * Additional CSS class(es) applied to the popover dialog element.
   * Only applies when useDropdown is false.
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

  /** Allows you to customize the label slot */
  children?: SlotProp<DtFilterPillLabelScope>;

  /** Icon displayed before the label */
  startIcon?: SlotProp<DtButtonIconSlotScope>;

  /**
   * Allows you to override the popover content, only use this if you need custom behavior. In dropdown mode, it
   * overrides the dropdown content, and its scope is `{ close }` alone.
   */
  content?: ReactNode | ((scope: DtFilterPillContentScope | DtPopoverCloseScope) => ReactNode);

  /** Allows you to customize the popover header */
  headerContent?: SlotProp<DtPopoverCloseScope>;

  /** Allows you to customize the popover footer. Receives { close, apply, cancel } bindings. */
  footerContent?: SlotProp<DtFilterPillFooterScope>;

  /** Called with the React mouse event when clicking the clear button; `event.nativeEvent` is the browser's. */
  onClear?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;

  /** Called when the popover is shown or hidden */
  onOpen?: (open: boolean) => void;

  /** Called when deferred selection is applied */
  onApply?: () => void;
}

const DEFAULT_FALLBACK_PLACEMENTS: Placement[] = ['auto'];
const EMPTY_FILTERS: DtFilterPillFilter[] = [];

/** Vue's `<slot>fallback</slot>`: the fallback only when the slot renders nothing. */
const withFallback = (node: ReactNode, fallback: ReactNode) => (Children.toArray(node).length > 0 ? node : fallback);

/** The filter without its `active` key: Vue's `delete filter.active`. */
const withoutActive = ({ active: _active, ...filter }: DtFilterPillFilter): DtFilterPillFilter => filter;

const activeNames = (filters: DtFilterPillFilter[]) =>
  filters.filter(filter => filter.active).map(filter => filter.name);

/**
 * A filter pill is a button that opens a popover or dropdown of filters, and shows which of them are active.
 * @see https://dialtone.dialpad.com/components/filter_pill.html
 */
export function DtFilterPill ({
  ref,
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
  popoverMaxWidth = '',
  popoverPadding = 'large',
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
  content,
  headerContent,
  footerContent,
  onClear,
  onOpen,
  onApply,
  className,
  ...rest
}: DtFilterPillProps) {
  const i18n = useI18n();
  const [filters, setFilters] = useControllableState<DtFilterPillFilter[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<DtFilterPillFilter[] | null>(null);
  const [primaryButton, setPrimaryButton] = useState<HTMLElement | null>(null);
  const [clearButton, setClearButton] = useState<HTMLElement | null>(null);

  // Vue's isOpen watcher: deferSelection copies the committed filters when the popover opens, and drops the copy when
  // it closes.
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (deferSelection) setPendingFilters(isOpen ? JSON.parse(JSON.stringify(filters)) : null);
  }

  // The same watcher reports every change of isOpen, which it doesn't do on mount.
  const reportedOpen = useRef(isOpen);
  const reportOpen = useEffectEvent((open: boolean) => onOpen?.(open));
  useEffect(() => {
    if (reportedOpen.current === isOpen) return;
    reportedOpen.current = isOpen;
    reportOpen(isOpen);
  }, [isOpen]);

  const activeFilters = activeNames(filters);
  const allActive = activeFilters.length === filters.length && filters.length > 1;
  const activeFilterList = allActive ? 'All' : (activeFilters[0] ?? '');
  const activeFilterOverflow = activeFilters.length <= 1 || allActive ? '' : `+${activeFilters.length - 1}`;
  const isActive = activeFilterList.length > 0;
  const hasClear = !readOnly && showClear && activeFilterList.length > 0;
  const buttonKind = isActive && !disabled ? 'default' : 'muted';
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

  // Vue checks once, in mounted(), and warns in every build.
  const checkedOnMount = useRef(false);
  const missingContent = !(filters.length || content !== undefined);
  const deferWithDropdown = deferSelection && useDropdown;
  useEffect(() => {
    if (checkedOnMount.current) return;
    checkedOnMount.current = true;
    if (missingContent) console.warn('Please provide content through the v-model or the "content" slot.');
    if (deferWithDropdown) console.warn('deferSelection has no effect when useDropdown is true.');
  }, [missingContent, deferWithDropdown]);

  const clearFilter = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setFilters(filters.map(withoutActive));
    onClear?.(event);
  };

  const openPopover = () => {
    if (readOnly) return;
    setIsOpen(true);
  };

  const onPrimaryKeyDown = (event: KeyboardEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    event.preventDefault();
    openPopover();
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

  const applySelection = () => {
    if (!pendingFilters) return;
    setFilters(filters.map((filter, i) => (pendingFilters[i]
      ? { ...filter, active: pendingFilters[i].active }
      : withoutActive(filter))));
    onApply?.();
    setIsOpen(false);
  };

  const cancelSelection = () => {
    setIsOpen(false);
  };

  const labelScope: DtFilterPillLabelScope = { label, filters, activeFilters, activeFilterList, activeFilterOverflow };

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
      onKeyDown={onPrimaryKeyDown}
      startIcon={startIcon}
      endIcon={readOnly ? undefined : ({ iconSize }: DtButtonIconSlotScope) => (
        <DtIconChevronDown
          size={iconSize}
          className="d-filter-pill__icon"
          data-qa="dt-filter-pill__icon"
        />
      )}
    >
      <span className={cx('d-filter-pill__label', labelClass)}>
        {withFallback(renderSlot(children, labelScope), (
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
                title={activeFilterList}
              >
                {activeFilterList}
              </span>
            )}
            {activeFilterOverflow && (
              <span
                className="d-filter-pill__label-end-overflow"
                title={`plus ${activeFilters.length - 1} others`}
              >
                {activeFilterOverflow}
              </span>
            )}
          </>
        ))}
      </span>
    </DtButton>
  );

  const overlayProps = {
    open: isOpen,
    onOpenChange: setIsOpen,
    appendTo: popoverAppendTo,
    fallbackPlacements: popoverFallbackPlacements,
    maxHeight: popoverMaxHeight,
    maxWidth: popoverMaxWidth,
    modal: true,
    placement: popoverPlacement,
    contentMode,
  };

  const overlay = useDropdown
    ? (
      <DtDropdown
        {...overlayProps}
        listClass={dropdownListClass}
        anchor={anchor}
        list={({ close }) => withFallback(
          renderSlot(content, { close }),
          filters.map(filter => (
            <DtListItem
              key={filter.name}
              role="menuitem"
              navigationType="arrow-keys"
              selected={filter.active}
              onClick={() => selectFilter(filter, close)}
            >
              {filter.name}
            </DtListItem>
          )),
        )}
      />
      )
    : (
      <DtPopover
        {...overlayProps}
        padding={popoverPadding}
        contentClass={popoverContentClass}
        headerWrapperClass={popoverHeaderClass}
        footerWrapperClass={popoverFooterClass}
        dialogClass={popoverDialogClass}
        anchor={({ attrs }) => anchor(attrs)}
        content={({ close }) => withFallback(
          renderSlot(content, { close, apply: applySelection, cancel: cancelSelection, pendingFilters }),
          filters.length > 0 && (
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
        )}
        headerContent={headerContent !== undefined
          ? ({ close }) => renderSlot(headerContent, { close })
          : undefined}
        footerContent={deferSelection || footerContent !== undefined
          ? ({ close }) => withFallback(
            renderSlot(footerContent, { close, apply: applySelection, cancel: cancelSelection }),
            deferSelection && (
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

  return (
    <div
      ref={ref}
      className={cx('d-filter-pill', { 'd-filter-pill--read-only': readOnly }, className)}
      data-qa="dt-filter-pill"
      {...rest}
    >
      {overlay}
      {hasClear && (
        <DtButton
          ref={setClearButton}
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
