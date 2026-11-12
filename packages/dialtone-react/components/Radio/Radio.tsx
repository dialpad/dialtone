import {
  Children,
  useEffect,
  useId,
  useRef,
  type ChangeEvent,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import { cx } from '../../common/cx';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { getValidationState } from '../../common/utils';
import {
  useGroupable,
  useInput,
  useMessages,
  type CheckableProps,
  type InputProps,
  type MessagesProps,
} from '../../common/input';
import { DtText, type TEXT_SIZE_MODIFIERS, type TextStrength } from '../Text';
import { DtValidationMessages } from '../ValidationMessages';
import { RADIO_INPUT_VALIDATION_CLASSES } from './RadioConstants';

type LabelSize = (typeof TEXT_SIZE_MODIFIERS)['label'][number];
/** '300' → 300: Vue's validator accepts each label size as a string or a number. */
type NumericSize<S> = S extends `${infer N extends number}` ? N : never;

interface DtRadioOwnProps
  extends Omit<InputProps, 'value'>, Omit<CheckableProps, 'value' | 'onCheckedChange'>, MessagesProps {
  /** A provided value for the radio */
  value?: string | number;

  /**
   * Determines visibility of radio label.
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

  /** Radio label content (Vue's default slot). Defaults to `label`. */
  children?: ReactNode;
}

/**
 * Like Vue's `$attrs`, `className` and `style` go on the root; every other attribute and handler goes on the
 * native input, and so does `ref`.
 */
export interface DtRadioProps extends DtRadioOwnProps,
  Omit<ComponentPropsWithRef<'input'>, keyof DtRadioOwnProps | 'type'> {}

/** The group stores the input's string value, so compare as strings: `value={2}` matches the group's `'2'`. */
const isSelected = (groupValue: unknown, value: string | number) =>
  groupValue !== undefined && groupValue !== null && String(groupValue) === String(value);

const INPUT_VALIDATION_CLASSES: Readonly<Partial<Record<string, string>>> = RADIO_INPUT_VALIDATION_CLASSES;

/**
 * Radios are control elements that allow the user to make a single selection.
 * They are typically used in a Radio Group which allows the user to make a selection from a list of options.
 * @see https://dialtone.dialpad.com/components/radio.html
 */
export function DtRadio ({
  showLabel = true,
  labelSize = null,
  labelStrength = null,
  label = '',
  name = '',
  value = '',
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
  // Vue's CheckableMixin declares `indeterminate`, which Radio never reads. Declared so it stays off the input.
  indeterminate: _indeterminate,
  messagesClass = '',
  messagesChildProps = {},
  showMessages = true,
  messages = [],
  children,
  className,
  style,
  onChange,
  ...inputAttrs
}: DtRadioProps) {
  const input = useInput({ disabled, validationState });
  const { groupContext, setGroupValue, hasGroup, internalName, internalDisabled, internalValidationState } =
    useGroupable({ name, value }, input);
  const { formattedMessages } = useMessages({ messages });
  const messagesId = useId();

  const radioGroupValue = groupContext.selectedValue;
  // In a group, the group's selection decides (Vue's radioGroupValue watcher). Otherwise the radio is controlled by
  // `checked`, or else it keeps its own state, which is the native input's: Vue never writes `internalChecked` on
  // change, so a standalone radio is checked by the browser, and a sibling of the same name unchecks it natively.
  const isControlled = hasGroup || checked !== undefined;
  const checkedProps = isControlled
    ? { checked: hasGroup ? isSelected(radioGroupValue, value) : checked }
    : { defaultChecked };

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
  // second mount reports again.
  const missingLabel = !hasLabelContent && !inputAttrs['aria-label'];
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = event.currentTarget;
    // update provided value if injected, unless it already holds this one
    if (!isSelected(radioGroupValue, inputValue)) setGroupValue(inputValue);
    onChange?.(event);
  };

  return (
    <div className={className} style={style}>
      <label className={cx('d-radio-group', { 'd-radio-group--disabled': internalDisabled })}>
        <div className="d-radio__input">
          <input
            type="radio"
            {...checkedProps}
            name={internalName}
            value={value}
            disabled={internalDisabled}
            className={cx('d-radio', inputValidationClass, inputClass)}
            aria-label={!showLabel && label ? label : undefined}
            aria-invalid={ariaInvalid}
            aria-describedby={ariaDescribedBy}
            {...inputAttrs}
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
            className={cx(labelClass, 'd-radio__copy d-radio__label', labelChildProps.className)}
            data-qa="radio-label"
          >
            {/* Vue's <slot>{{ label }}</slot> falls back only when the slot renders nothing, comments aside: '' stays. */}
            {Children.toArray(children).length > 0 ? children : label}
          </DtText>
        )}
      </label>
      <div
        className="d-radio__messages"
        data-qa="radio-description-messages"
      >
        {hasDescription && (
          <DtText
            kind="body"
            size={200}
            tone="tertiary"
            as="div"
            {...descriptionChildProps}
            className={cx('d-description', descriptionClass, descriptionChildProps.className)}
            data-qa="radio-description"
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
          data-qa="dt-radio-validation-messages"
        />
      </div>
    </div>
  );
}
