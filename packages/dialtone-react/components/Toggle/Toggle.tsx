import {
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';
import {
  TOGGLE_SIZE_MODIFIERS,
  type ToggleCheckedValue,
  type ToggleSize,
} from './ToggleConstants';

interface DtToggleOwnProps {
  /**
   * The id of the toggle. Defaults to a generated one.
   */
  id?: string;

  /**
   * Disables the toggle interactions
   * @values true, false
   */
  disabled?: boolean;

  /**
   * Value of the toggle (Vue's `modelValue`). Controlled when set; `defaultChecked` is the uncontrolled start.
   * @values true, false, 'mixed'
   */
  checked?: ToggleCheckedValue;

  /** Initial value of the toggle when `checked` isn't set. */
  defaultChecked?: ToggleCheckedValue;

  /**
   * Fired with the next value when the toggle is clicked (Vue's `update:modelValue`). It fires even when
   * `toggleOnClick` is false.
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Whether the component toggles on click. If you set this to false it means you will handle the toggling manually
   * via the checked prop. Change events will still be triggered.
   * @values true, false
   */
  toggleOnClick?: boolean;

  /**
   * The size of the toggle.
   * @values 200, 300
   */
  size?: ToggleSize;

  /**
   * Determines visibility of toggle label.
   * @values true, false
   */
  showLabel?: boolean;

  /**
   * Shows the icon
   * @values true, false
   */
  showIcon?: boolean;

  /**
   * Used to customize the label container
   */
  labelClass?: ClassValue;

  /**
   * A set of props that are passed into the label container
   */
  labelChildProps?: ComponentPropsWithRef<'label'> & { [dataAttr: `data-${string}`]: string | undefined };

  /** Slot for the main content, the label (Vue's default slot). */
  children?: ReactNode;
}

/**
 * Like Vue's `$attrs`, `className` and `style` go on the root; every other attribute and handler goes on the
 * button, and so does `ref`.
 */
export interface DtToggleProps extends DtToggleOwnProps,
  Omit<ComponentPropsWithRef<'button'>, keyof DtToggleOwnProps | 'type' | 'role'> {}

/**
 * A toggle (or "switch") is a button control element that allows the user to make a binary (on/off) selection.
 * @see https://dialtone.dialpad.com/components/toggle.html
 */
export function DtToggle ({
  id: idProp,
  disabled = false,
  checked,
  defaultChecked = false,
  onCheckedChange,
  toggleOnClick = true,
  size = 300,
  showLabel = true,
  showIcon = true,
  labelClass = '',
  labelChildProps = {},
  children,
  className,
  style,
  onClick,
  ...buttonAttrs
}: DtToggleProps) {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  // Vue's modelValue only seeds `internalChecked`, which a click flips unless `toggleOnClick` is false, so this
  // isn't useControllableState: that would update the state on every click.
  const [uncontrolledChecked, setUncontrolledChecked] = useState<ToggleCheckedValue>(defaultChecked);
  const internalChecked = checked ?? uncontrolledChecked;
  const isIndeterminate = internalChecked === 'mixed';

  const toggleClasses = cx(
    'd-toggle',
    TOGGLE_SIZE_MODIFIERS[String(size) as keyof typeof TOGGLE_SIZE_MODIFIERS],
    {
      'd-toggle--checked': internalChecked === true,
      'd-toggle--disabled': disabled,
      'd-toggle--indeterminate': isIndeterminate,
    },
  );

  // Vue checks once, in mounted(). The ref keeps it to the first run: neither a later change nor StrictMode's second
  // mount repeats it.
  const hasVisibleLabel = showLabel && children !== undefined;
  const missingLabel = !hasVisibleLabel && !buttonAttrs['aria-label'];
  const checkedLabel = useRef(false);
  useEffect(() => {
    if (checkedLabel.current) return;
    checkedLabel.current = true;
    if (missingLabel) {
      console.info(
        '[Dialtone] A label is required for accessibility. Provide a label and use showLabel={false} to hide it visually.',
      );
    }
  }, [missingLabel]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // `!internalChecked` is false for 'mixed' as well as for true.
    const next = !internalChecked;
    onCheckedChange?.(next);
    if (toggleOnClick) setUncontrolledChecked(next);
    // Vue's listener replaces the consumer's onClick; here it runs too, after the toggle.
    onClick?.(event);
  };

  return (
    <div
      className={cx('d-toggle-wrapper', className)}
      style={style}
    >
      {showLabel && hasContent(children) && (
        <label
          htmlFor={id}
          {...labelChildProps}
          className={cx(labelClass, labelChildProps.className) || undefined}
          data-qa="toggle-label"
        >
          {children}
        </label>
      )}
      <button
        id={id}
        role={isIndeterminate ? 'checkbox' : 'switch'}
        type="button"
        aria-checked={String(internalChecked) as 'true' | 'false' | 'mixed'}
        disabled={disabled}
        aria-disabled={String(disabled) as 'true' | 'false'}
        className={toggleClasses}
        {...buttonAttrs}
        onClick={handleClick}
      >
        {showIcon && <span className="d-toggle__inner" />}
      </button>
    </div>
  );
}
