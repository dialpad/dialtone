import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode, type Ref } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { DtLinkTo } from '../../common/link';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import type { ButtonIconPosition, ButtonImportance, ButtonKind, ButtonSize } from '../Button/ButtonConstants';
import { DtDropdown } from '../Dropdown/Dropdown';
import type { DtPopoverCloseScope, PopoverDirection } from '../Popover';
import { SplitButtonEnd } from './SplitButtonEnd';
import { SplitButtonStart, type SplitButtonIconScope } from './SplitButtonStart';

/** The scope the icon slots pass: `size`, the icon size that matches the button's size. */
export type DtSplitButtonIconSlotScope = SplitButtonIconScope;

export interface DtSplitButtonProps {
  /**
   * Determines whether the start button should have active styling
   * @values true, false
   */
  startActive?: boolean;

  /** Descriptive label for the start button */
  startAriaLabel?: string | null;

  /**
   * The position of the icon slot within the start button.
   * @values start, end, blockStart, blockEnd, left, right, top, bottom
   */
  startIconPosition?: ButtonIconPosition;

  /** Used to customize the start button (aka left) */
  startButtonClass?: ClassValue;

  /** Used to customize the start label container */
  startLabelClass?: ClassValue;

  /** Used to customize the start button leading container */
  startLeadingClass?: ClassValue;

  /** Used to customize the start button trailing container */
  startTrailingClass?: ClassValue;

  /**
   * HTML button disabled attribute for start button only
   * @values true, false
   */
  startDisabled?: boolean;

  /**
   * Whether the start button should display a loading animation or not.
   * @values true, false
   */
  startLoading?: boolean;

  /** Text shown in tooltip when you hover the start button, required if no content is passed to default slot */
  startTooltipText?: string;

  /**
   * Determines whether a screenreader reads live updates of the button content to the user while the button is in
   * focus.
   * @values true, false
   */
  assertiveOnFocus?: boolean;

  /**
   * HTML button disabled attribute for both buttons.
   * Use startDisabled or endDisabled to disable buttons individually.
   * @values true, false
   */
  disabled?: boolean;

  /**
   * The direction the dropdown displays relative to the anchor.
   * @values top, top-start, top-end, right, right-start, right-end, left, left-start, left-end, bottom, bottom-start,
   * bottom-end, auto, auto-start, auto-end
   */
  dropdownPlacement?: PopoverDirection;

  /**
   * The fill and outline of the button associated with its visual importance.
   * @values clear, outlined, primary
   */
  importance?: ButtonImportance;

  /**
   * The color of the button.
   * The inverted value is deprecated and will be removed in the next major version.
   * @values default, unstyled, muted, critical, positive, inverted
   */
  kind?: ButtonKind;

  /**
   * Determines whether the end button should have active styling
   * @values true, false
   */
  endActive?: boolean;

  /** Descriptive label for the end button */
  endAriaLabel?: string | null;

  /** Used to customize the end button (aka right) */
  endButtonClass?: ClassValue;

  /**
   * HTML button disabled attribute for end button only
   * @values true, false
   */
  endDisabled?: boolean;

  /** Element ID, useful in case you need to reference the button as an external anchor for popover. */
  endId?: string;

  /** Text shown in tooltip when you hover the end button, required as it is an icon only button */
  endTooltipText?: string;

  /**
   * The size of the button.
   * @values 100, 200, 300, 400, 500
   */
  size?: ButtonSize;

  /** Button width, accepts CSS width attribute values */
  width?: string | null;

  /**
   * Whether to show the vertical divider between the start and end buttons.
   * Only applies when importance is "clear".
   * @values true, false
   */
  showDivider?: boolean;

  /** Router destination for the start button. When set, renders the start button through the DtLinkProvider's link. */
  startTo?: DtLinkTo | null;

  /**
   * Whether navigation via `startTo` replaces the current history entry.
   * @values true, false
   */
  startReplace?: boolean;

  /** HTML href for the start button. When set, renders the start button as an `<a>` element. */
  startHref?: string | null;

  /** HTML target attribute for the start button link. Only applies when `startHref` is set. */
  startTarget?: string | null;

  /** HTML rel attribute for the start button link. Only applies when `startHref` is set. */
  startRel?: string | null;

  /** Applied to the root, as Vue's `class` attribute. */
  className?: string;

  /** Applied to the root and to both buttons, as Vue's `style` attribute. */
  style?: CSSProperties;

  /** The root `<span>`. */
  ref?: Ref<HTMLSpanElement>;

  /** Default content slot */
  children?: ReactNode;

  /** Start (aka left) button icon slot */
  startIcon?: SlotProp<DtSplitButtonIconSlotScope>;

  /** End-positioned icon within the start button (enables dual icons on the start button) */
  startEndIcon?: SlotProp<DtSplitButtonIconSlotScope>;

  /** Leading slot, forwarded to the start button's leading slot */
  leading?: ReactNode;

  /** Trailing slot, forwarded to the start button's trailing slot */
  trailing?: ReactNode;

  /** End (aka right) content slot, overrides end button styling and functionality completely */
  end?: ReactNode;

  /** End (aka right) button icon slot */
  endIcon?: SlotProp<DtSplitButtonIconSlotScope>;

  /** Built-in dropdown content slot, use of dt-list-item is highly recommended here. */
  dropdownList?: SlotProp<DtPopoverCloseScope>;

  /** Start button click (Vue's `start-clicked`). */
  onStartClicked?: () => void;

  /** End button click (Vue's `end-clicked`). */
  onEndClicked?: () => void;
}

/**
 * A split button is a button with a dropdown menu attached to it. It allows users to select a default action or choose
 * from a list of related actions.
 * @see https://dialtone.dialpad.com/components/split-button.html
 */
export function DtSplitButton ({
  startActive = false,
  startAriaLabel = null,
  startIconPosition = 'left',
  startButtonClass = '',
  startLabelClass = '',
  startLeadingClass = '',
  startTrailingClass = '',
  startDisabled = false,
  startLoading = false,
  startTooltipText,
  assertiveOnFocus = false,
  disabled = false,
  dropdownPlacement = 'bottom-end',
  importance = 'primary',
  kind = 'default',
  endActive = false,
  endAriaLabel = null,
  endButtonClass = '',
  endDisabled = false,
  endId,
  endTooltipText,
  size = 300,
  width = null,
  showDivider = true,
  startTo = null,
  startReplace = false,
  startHref = null,
  startTarget = null,
  startRel = null,
  className,
  style,
  ref,
  children,
  startIcon,
  startEndIcon,
  leading,
  trailing,
  end,
  endIcon,
  dropdownList,
  onStartClicked,
  onEndClicked,
}: DtSplitButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Vue validates in created() and in every updated(): once per commit here. The token is new on every render, so
  // StrictMode's second run of the same commit's effect doesn't warn again.
  const validated = useRef<object | null>(null);
  const renderToken = {};
  const hasDefault = hasContent(children);
  const hasStartIcon = hasContent(renderSlot(startIcon, { size: undefined }));
  const hasEnd = hasContent(end);
  useEffect(() => {
    if (validated.current === renderToken) return;
    validated.current = renderToken;
    validateProps({ hasDefault, hasStartIcon, hasEnd, startTooltipText, endTooltipText, showDivider, importance });
  });

  const onStartClick = () => {
    onStartClicked?.();
  };

  const onEndClick = () => {
    onEndClicked?.();
  };

  const startButtonProps = {
    active: startActive,
    ariaLabel: startAriaLabel,
    assertiveOnFocus,
    disabled: disabled || startDisabled,
    iconPosition: startIconPosition,
    className: startButtonClass,
    labelClass: startLabelClass,
    leadingClass: startLeadingClass,
    trailingClass: startTrailingClass,
    loading: startLoading,
    importance,
    kind,
    size,
    tooltipText: startTooltipText,
    to: startTo,
    replace: startReplace,
    href: startHref,
    target: startTarget,
    rel: startRel,
    style,
  };

  const endButtonProps = {
    id: endId,
    active: endActive,
    ariaLabel: endAriaLabel,
    disabled: disabled || endDisabled,
    className: endButtonClass,
    importance,
    kind,
    size,
    tooltipText: endTooltipText,
    style,
  };

  // Vue's dual-icon path: with startEndIcon, the icons go to DtButton's startIcon and endIcon; otherwise startIcon is
  // DtButton's legacy icon slot, placed by iconPosition.
  const dualIcons = startEndIcon !== undefined;
  const startIconSlot = (scope: DtSplitButtonIconSlotScope) => renderSlot(startIcon, scope);
  const endIconSlot = (scope: DtSplitButtonIconSlotScope) => renderSlot(endIcon, scope);

  const renderEnd = () => {
    if (end !== undefined) return end;
    if (dropdownList !== undefined) {
      return (
        <DtDropdown
          placement={dropdownPlacement}
          // Vue listens on the popover's root element, which the dropdown's content leaves once tippy appends it to
          // the body. React's events bubble through the portal, so only clicks inside the root's DOM count.
          onClick={(event: MouseEvent<HTMLDivElement>) => {
            if (event.currentTarget.contains(event.target as Node)) setIsDropdownOpen(true);
          }}
          onOpened={open => setIsDropdownOpen(open)}
          anchor={attrs => (
            <SplitButtonEnd
              {...attrs}
              {...endButtonProps}
              active={isDropdownOpen}
              onClick={onEndClick}
              icon={endIconSlot}
            />
          )}
          list={({ close }) => renderSlot(dropdownList, { close })}
        />
      );
    }
    return (
      <SplitButtonEnd
        {...endButtonProps}
        onClick={onEndClick}
        icon={endIconSlot}
      />
    );
  };

  return (
    <span
      ref={ref}
      data-qa="dt-split-button"
      className={cx('d-split-btn', { 'd-split-btn--no-divider': !showDivider && importance === 'clear' }, className)}
      style={{ ...style, width: width ?? undefined }}
    >
      <SplitButtonStart
        {...startButtonProps}
        onClick={onStartClick}
        startIcon={dualIcons ? startIconSlot : undefined}
        endIcon={dualIcons ? (scope: DtSplitButtonIconSlotScope) => renderSlot(startEndIcon, scope) : undefined}
        icon={dualIcons ? undefined : startIconSlot}
        leading={leading}
        trailing={trailing}
      >
        {children}
      </SplitButtonStart>
      {renderEnd()}
    </span>
  );
}

interface Validation {
  hasDefault: boolean;
  hasStartIcon: boolean;
  hasEnd: boolean;
  startTooltipText: string | undefined;
  endTooltipText: string | undefined;
  showDivider: boolean;
  importance: ButtonImportance;
}

// Vue's validateProps: warnings in every build, as Vue's console.warn calls are.
function validateProps ({
  hasDefault,
  hasStartIcon,
  hasEnd,
  startTooltipText,
  endTooltipText,
  showDivider,
  importance,
}: Validation) {
  if (!hasDefault && hasStartIcon && !startTooltipText) {
    console.warn('start-tooltip-text prop must be set if start button has an icon only');
  }

  if (!hasEnd && !endTooltipText) {
    console.warn('end-tooltip-text prop is required as it is an icon-only button');
  }

  if (!showDivider && importance !== 'clear') {
    console.warn(
      'show-divider prop set to false has no effect when importance is not "clear". ' +
      'The divider is always shown for "outlined" and "primary" importances.',
    );
  }
}
