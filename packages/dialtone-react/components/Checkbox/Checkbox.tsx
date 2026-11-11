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
import { cx } from '../../common/cx';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { getValidationState } from '../../common/utils';
import {
  useCheckable,
  useGroupable,
  useInput,
  useMessages,
  type CheckableProps,
  type InputProps,
  type MessagesProps,
} from '../../common/input';
import { DtText, type TEXT_SIZE_MODIFIERS, type TextStrength } from '../Text';
import { DtValidationMessages } from '../ValidationMessages';
import { CHECKBOX_INPUT_VALIDATION_CLASSES } from './CheckboxConstants';

type LabelSize = (typeof TEXT_SIZE_MODIFIERS)['label'][number];
/** '300' → 300: Vue's validator accepts each label size as a string or a number. */
type NumericSize<S> = S extends `${infer N extends number}` ? N : never;

interface DtCheckboxOwnProps extends Omit<InputProps, 'value'>, CheckableProps, MessagesProps {
  /**
   * Determines visibility of checkbox label.
   * @values true, false
   */
  showLabel?: boolean;

  /**
   * Overrides the label text size.
   * @values 100, 200, 300, 400
   */
  labelSize?: LabelSize | NumericSize<LabelSize> | null;

  /**
   * Overrides the label font weight.
   * @values bold, semibold, medium, normal
   */
  labelStrength?: TextStrength | null;

  /** Checkbox label content (Vue's default slot). Defaults to `label`. */
  children?: ReactNode;
}

/**
 * Like Vue's `$attrs`, `className` and `style` go on the root; every other attribute and handler goes on the
 * native input, and so does `ref`.
 */
export interface DtCheckboxProps extends DtCheckboxOwnProps,
  Omit<ComponentPropsWithRef<'input'>, keyof DtCheckboxOwnProps | 'type'> {}

const INPUT_VALIDATION_CLASSES: Readonly<Partial<Record<string, string>>> = CHECKBOX_INPUT_VALIDATION_CLASSES;

/**
 * Checkboxes are control elements that allow the user to make a selection.They are typically used in a
 * Checkbox Group which allows the user to make one or more selections from a list of options.
 * @see https://dialtone.dialpad.com/components/checkbox.html
 */
export function DtCheckbox ({
  showLabel = true,
  labelSize = null,
  labelStrength = null,
  label = '',
  name = '',
  value = null,
  description = '',
  disabled = false,
  validationState = '',
  inputClass = '',
  labelClass = '',
  descriptionClass = '',
  labelChildProps = {},
  descriptionChildProps = {},
  checked,
  defaultChecked = false,
  onCheckedChange,
  indeterminate = false,
  messagesClass = '',
  messagesChildProps = {},
  showMessages = true,
  messages = [],
  children,
  className,
  style,
  onChange,
  ref,
  ...inputAttrs
}: DtCheckboxProps) {
  const input = useInput({ disabled, validationState });
  const { groupContext, setGroupValue, hasGroup, internalName, internalDisabled, internalValidationState } =
    useGroupable({ name, value }, input);
  const { internalChecked, setInternalChecked, internalIndeterminate, setInternalIndeterminate } =
    useCheckable({ checked, defaultChecked, onCheckedChange, indeterminate });
  const { formattedMessages } = useMessages({ messages });
  const messagesId = useId();

  // `ref` is the native input, like the rest of the attributes; the component needs it too, for `indeterminate`.
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle<HTMLInputElement | null, HTMLInputElement | null>(ref, () => inputRef.current, []);
  // Vue binds `:indeterminate.prop`; React has no indeterminate attribute.
  useLayoutEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = internalIndeterminate;
  }, [internalIndeterminate]);

  // Inside a CheckboxGroup, the group's selection decides (Vue's checkboxGroupValueChecked watcher). Other groups
  // (InputGroup, RadioGroup) have no selection, so the checkbox keeps its own state.
  const checkboxGroupValueChecked = groupContext.selectedValues?.includes(value) ?? false;
  const isChecked = hasGroup && groupContext.selectedValues !== undefined ? checkboxGroupValueChecked : internalChecked;

  const resolvedLabelSize = labelSize ?? 300;
  const inputValidationClass = internalValidationState ? INPUT_VALIDATION_CLASSES[internalValidationState] : undefined;
  // Vue's `$slots.default`: label content passed at all counts, even when it renders nothing.
  const hasLabelContent = children !== undefined || !!label;
  const hasLabel = showLabel && hasLabelContent;
  // A string is Vue's description prop, shown when non-empty; anything else is its description slot, which counts when
  // passed at all (`$slots.description`), even when it renders nothing. null is the absent prop.
  const hasDescription = typeof description === 'string' ? description !== '' : description != null;
  const ariaInvalid = getValidationState(formattedMessages) === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
  const ariaDescribedBy = showMessages && formattedMessages.length > 0 ? messagesId : undefined;

  // Vue checks once, in mounted(). The ref keeps it to the first run: neither a later change of label nor StrictMode's
  // second mount warns again.
  const missingLabel = !hasLabelContent && !inputAttrs['aria-label'];
  const checkedLabel = useRef(false);
  useEffect(() => {
    if (checkedLabel.current) return;
    checkedLabel.current = true;
    if (missingLabel) {
      console.warn(
        '[Dialtone] A label is required for accessibility. Provide a label prop and use showLabel={false} to hide it visually.',
      );
    }
  }, [missingLabel]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.currentTarget;
    let nextChecked = event.currentTarget.checked;
    // Expected: Indeterminate -> unchecked, as Vue sets `target.checked`: the consumer's onChange, called last, sees
    // false. The re-render keeps the input's `checked` there.
    if (internalIndeterminate) {
      nextChecked = false;
      event.currentTarget.checked = false;
      setInternalIndeterminate(false);
    }
    // update provided value if injected
    setGroupValue(inputValue, nextChecked);
    // emit the state of the checkbox
    setInternalChecked(nextChecked);
    onChange?.(event);
  };

  return (
    <div className={className} style={style}>
      <label className={cx('d-checkbox-group', { 'd-checkbox-group--disabled': internalDisabled })}>
        <div className="d-checkbox__input">
          <input
            type="checkbox"
            checked={isChecked}
            name={internalName}
            value={value == null ? undefined : String(value)}
            disabled={internalDisabled}
            className={cx('d-checkbox', inputValidationClass, inputClass)}
            aria-label={!showLabel && label ? label : undefined}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            {...inputAttrs}
            ref={inputRef}
            onChange={handleChange}
          />
        </div>
        {hasLabel && (
          <DtText
            as="div"
            kind="label"
            size={resolvedLabelSize}
            strength={labelStrength ?? 'normal'}
            tone={internalDisabled ? 'disabled' : 'primary'}
            {...labelChildProps}
            className={cx(labelClass, 'd-checkbox__copy d-checkbox__label', labelChildProps.className)}
            data-qa="checkbox-label"
          >
            {/* Vue's <slot>{{ label }}</slot> falls back only when the slot renders nothing, comments aside: '' stays. */}
            {Children.toArray(children).length > 0 ? children : label}
          </DtText>
        )}
      </label>
      <div
        className="d-checkbox__messages"
        data-qa="checkbox-description-messages"
      >
        {hasDescription && (
          <DtText
            kind="body"
            size={200}
            tone="tertiary"
            as="div"
            {...descriptionChildProps}
            className={cx('d-description', descriptionClass, descriptionChildProps.className)}
            data-qa="checkbox-description"
          >
            {description}
          </DtText>
        )}
        <DtValidationMessages
          {...messagesChildProps}
          id={messagesId}
          validationMessages={formattedMessages}
          showMessages={showMessages}
          className={cx(messagesChildProps.className, messagesClass)}
          data-qa="dt-checkbox-validation-messages"
        />
      </div>
    </div>
  );
}
