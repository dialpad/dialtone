import {
  Children,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { devWarn } from '../../common/dev';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { getValidationState } from '../../common/utils';
import { hasContent } from '../../common/slots';
import { useControllableState } from '../../common/hooks/useControllableState';
import { useMessages, type ChildProps, type MessagesProps } from '../../common/input';
import { DtText, type TEXT_SIZE_MODIFIERS, type TextStrength } from '../Text';
import { DtValidationMessages } from '../ValidationMessages';
import { SELECT_SIZE_MODIFIERS, SELECT_STATE_MODIFIERS, type SelectSize } from './SelectMenuConstants';
import { optionsValidator } from './SelectMenuValidators';

type LabelSize = (typeof TEXT_SIZE_MODIFIERS)['label'][number];
/** '300' → 300: Vue's validator accepts each label size as a string or a number. */
type NumericSize<S> = S extends `${infer N extends number}` ? N : never;

/** A select menu option, as the `options` prop takes it. */
export interface SelectMenuOption {
  /** The option value */
  value: number | string;
  /** The option label */
  label: string;
}

interface DtSelectMenuOwnProps extends MessagesProps {
  /**
   * Label for the select. A string is the label prop; any other content replaces it, as Vue's label slot does.
   */
  label?: ReactNode;

  /**
   * Determines visibility of select label.
   * @values true, false
   */
  showLabel?: boolean;

  /**
   * Description for the select: a string, or content as in Vue's description slot.
   */
  description?: ReactNode;

  /**
   * Select Menu Options, overridden by `children`. Each option has the following structure:
   * `{ value: number || string (required), label: string (required) }`
   */
  options?: SelectMenuOption[];

  /**
   * Controls the size of the select
   * @values 100, 200, 300, 400, 500
   */
  size?: SelectSize;

  /** Used to customize the label container */
  labelClass?: ClassValue;

  /** Used to customize the description container */
  descriptionClass?: ClassValue;

  /** Used to customize the select */
  selectClass?: ClassValue;

  /** Used to customize each option, should options be provided via prop */
  optionClass?: ClassValue;

  /** A set of props that are passed into the label container */
  labelChildProps?: ChildProps;

  /** A set of props that are passed into the description container */
  descriptionChildProps?: ChildProps;

  /** A set of props that are passed into each option, should options be provided via prop */
  optionChildProps?: ChildProps;

  /**
   * Disabled state of the select
   * @values true, false
   */
  disabled?: boolean;

  /** The value of the select menu (Vue's modelValue). Controlled when set. */
  value?: string | number;

  /** Initial value of the select menu when uncontrolled. */
  defaultValue?: string | number;

  /** Fired to sync the value with the parent component (Vue's `update:modelValue`), with the change event. */
  onValueChange?: (value: string, event: ChangeEvent<HTMLSelectElement>) => void;

  /**
   * Overrides the label text size. When not provided, the label size
   * is derived from the component size prop.
   * @values 100, 200, 300, 400
   */
  labelSize?: LabelSize | NumericSize<LabelSize> | null;

  /**
   * Overrides the label font weight.
   * @values bold, semibold, medium, normal
   */
  labelStrength?: TextStrength | null;

  /** Select menu options (Vue's default slot). Defaults to `options`. */
  children?: ReactNode;
}

/**
 * Like Vue's `$attrs`, `className` and `style` go on the root; every other attribute and handler goes on the
 * native select, and so does `ref`.
 */
export interface DtSelectMenuProps extends DtSelectMenuOwnProps,
  Omit<ComponentPropsWithRef<'select'>, keyof DtSelectMenuOwnProps> {}

const SIZE_MODIFIERS: Readonly<Partial<Record<string, string>>> = SELECT_SIZE_MODIFIERS;
const STATE_MODIFIERS: Readonly<Partial<Record<string, string>>> = SELECT_STATE_MODIFIERS;
const DESCRIPTION_SIZES: Readonly<Partial<Record<string, string>>> = {
  100: 'xs', 200: 'xs', 300: 'sm', 400: 'sm', 500: 'md',
  xs: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'md',
};

/**
 * A select menu is an input control that allows users to choose one option from a list.
 * @see https://dialtone.dialpad.com/components/select.html
 */
export function DtSelectMenu ({
  label = '',
  showLabel = true,
  description = '',
  options = [],
  size = 300,
  labelClass = '',
  descriptionClass = '',
  selectClass = '',
  optionClass = '',
  labelChildProps = {},
  descriptionChildProps = {},
  optionChildProps = {},
  disabled = false,
  value,
  defaultValue = '',
  onValueChange,
  labelSize = null,
  labelStrength = null,
  messagesClass = '',
  messagesChildProps = {},
  showMessages = true,
  messages = [],
  children,
  className,
  style,
  onChange,
  ref,
  ...selectAttrs
}: DtSelectMenuProps) {
  const [currentValue, setCurrentValue] = useControllableState<string, [ChangeEvent<HTMLSelectElement>]>({
    value: value === undefined ? undefined : String(value),
    defaultValue: String(defaultValue),
    onChange: onValueChange,
  });
  const { formattedMessages } = useMessages({ messages });
  const messagesId = useId();
  const selectKey = useId();
  const descriptionKey = `select-${selectKey}-description`;

  // `ref` is the native select, like the rest of the attributes; the component needs it too, for its selection.
  const selectRef = useRef<HTMLSelectElement>(null);
  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(ref, () => selectRef.current, []);

  const sizeKey = String(size);
  const resolvedLabelSize = labelSize ?? (
    // xl/500 exceeds label's max size — cap at lg/400
    sizeKey === 'xl' || sizeKey === '500' ? (sizeKey === '500' ? '400' : 'lg') : size
  );
  const resolvedDescriptionSize = DESCRIPTION_SIZES[sizeKey] || 'sm';
  const resolvedDescriptionDensity = sizeKey === 'xl' || sizeKey === '500' ? '300' : undefined;

  const state = getValidationState(formattedMessages);
  const ariaInvalid = state === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
  const ariaDescribedBy = showMessages && formattedMessages.length > 0 ? messagesId : undefined;

  // A string is Vue's label prop; other content is its label slot, which counts when passed at all ($slots.label)
  // and is shown when it has content. null is the absent prop.
  const labelText = typeof label === 'string' ? label : '';
  const labelPassed = typeof label === 'string' ? label !== '' : label != null;
  const labelShown = showLabel && (typeof label === 'string' ? label !== '' : hasContent(label));
  // The same for the description.
  const descriptionPassed = typeof description === 'string' ? description !== '' : description != null;
  const descriptionShown = typeof description === 'string' ? description !== '' : hasContent(description);
  const labelAriaDetails = descriptionPassed ? descriptionKey : selectAttrs['aria-details'];

  // Vue's `<slot>` fallback: the options prop renders only when no options were passed as children.
  const hasChildOptions = Children.toArray(children).length > 0;

  // A select whose value matches no option shows a blank field, as Vue's `:value` binding does; React selects the
  // first enabled option instead. Runs after every render, since React re-applies its selection on each one.
  useLayoutEffect(() => {
    const select = selectRef.current;
    if (!select) return;
    const matches = Array.from(select.options).some(option => option.value === currentValue);
    if (!matches) select.selectedIndex = -1;
  });

  // Vue checks this in mounted() and beforeUpdate(), so on every render. The render's own token keeps StrictMode's
  // second run of the same render from warning twice.
  const optionsMissing = options.length < 1 && children === undefined;
  const renderToken = {};
  const checkedRender = useRef<object | null>(null);
  useEffect(() => {
    if (checkedRender.current === renderToken) return;
    checkedRender.current = renderToken;
    if (optionsMissing) devWarn('Options are expected to be provided via prop or slot');
  });

  // Vue's prop validator for `options`, checked when they change.
  const validatedOptions = useRef<SelectMenuOption[] | null>(null);
  useEffect(() => {
    if (validatedOptions.current === options) return;
    validatedOptions.current = options;
    if (!optionsValidator(options)) devWarn('Invalid prop: custom validator check failed for prop "options".');
  }, [options]);

  // Vue checks once, in mounted(). The ref keeps it to the first run: neither a later change of label nor StrictMode's
  // second mount informs again.
  const missingLabel = !labelPassed && !selectAttrs['aria-label'];
  const checkedLabel = useRef(false);
  useEffect(() => {
    if (checkedLabel.current) return;
    checkedLabel.current = true;
    if (missingLabel) {
      console.info(
        '[Dialtone] A label is required for accessibility. Provide a label prop and use showLabel={false} to hide it visually.',
      );
    }
  }, [missingLabel]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrentValue(event.currentTarget.value, event);
    onChange?.(event);
  };

  return (
    <div className={className} style={style}>
      <label>
        {labelShown && (
          <DtText
            kind="label"
            size={resolvedLabelSize}
            strength={labelStrength}
            tone="secondary"
            as="div"
            aria-details={labelAriaDetails}
            {...labelChildProps}
            className={cx('d-select__label-text', labelClass, labelChildProps.className)}
            data-qa="dt-select-label"
          >
            {label}
          </DtText>
        )}
        {descriptionShown && (
          <DtText
            id={descriptionKey}
            kind="body"
            size={resolvedDescriptionSize}
            tone="tertiary"
            density={resolvedDescriptionDensity}
            as="div"
            {...descriptionChildProps}
            className={cx('d-description', descriptionClass, descriptionChildProps.className)}
            data-qa="dt-select-description"
          >
            {description}
          </DtText>
        )}
        <div
          className={cx(
            'd-select',
            SIZE_MODIFIERS[sizeKey],
            selectClass,
            { 'd-select--disabled': disabled },
          )}
          data-qa="dt-select-wrapper"
        >
          <select
            className={cx('d-select__input', state ? STATE_MODIFIERS[state] : undefined)}
            aria-label={!showLabel && labelText ? labelText : undefined}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            {...selectAttrs}
            ref={selectRef}
            data-qa="dt-select"
            disabled={disabled}
            value={currentValue}
            onChange={handleChange}
          >
            {hasChildOptions
              ? children
              : options.map(option => (
                <option
                  key={`select-${selectKey}-option-${option.value}`}
                  value={option.value}
                  {...optionChildProps}
                  className={cx(optionClass, optionChildProps.className)}
                >
                  {option.label}
                </option>
              ))}
          </select>
        </div>
      </label>
      <DtValidationMessages
        {...messagesChildProps}
        id={messagesId}
        validationMessages={formattedMessages}
        showMessages={showMessages}
        className={cx(messagesChildProps.className, messagesClass)}
        data-qa="dt-select-messages"
      />
    </div>
  );
}
