import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cx } from '../../../common/cx';
import { useGroupable, useInput, type InputProps } from '../../../common/input';
import { RADIO_INPUT_VALIDATION_CLASSES } from '../../Radio';
import { DtText, type TEXT_SIZE_MODIFIERS } from '../../Text';

type LabelSize = (typeof TEXT_SIZE_MODIFIERS)['label'][number];
/** '300' → 300: Vue's validator accepts each label size as a string or a number. */
type NumericSize<S> = S extends `${infer N extends number}` ? N : never;

interface InputDecoratorOwnProps extends Omit<InputProps, 'value'> {
  /** The value of the input */
  value?: string | number | null;
  /**
   * Overrides the label text size.
   * @values 100, 200, 300, 400
   */
  labelSize?: LabelSize | NumericSize<LabelSize> | null;
  /** The label (Vue's default slot). Defaults to `label`. */
  children?: ReactNode;
  /** Vue's `update:modelValue`: called with the input's value when the group's value changes to it. */
  onValueChange?: (value: string) => void;
}

/** Like Vue's `inheritAttrs: false`, every other attribute, `className` and `ref` go on the native input. */
export interface InputDecoratorProps extends InputDecoratorOwnProps,
  Omit<ComponentPropsWithRef<'input'>, keyof InputDecoratorOwnProps | 'type'> {}

const INPUT_VALIDATION_CLASSES: Readonly<Partial<Record<string, string>>> = RADIO_INPUT_VALIDATION_CLASSES;

/**
 * Decorator used for storybook documentation and unit tests: a radio input that reports its value to its group.
 * Vue's version never sets `checked` (it has no CheckableMixin, so the `internalChecked` its group watcher writes
 * isn't reactive), and neither does this one: the native input keeps its own state.
 */
export function InputDecorator ({
  labelSize = null,
  label = '',
  name = '',
  value = null,
  disabled = false,
  validationState = '',
  inputClass = '',
  labelClass = '',
  labelChildProps = {},
  // Props of InputMixin the decorator doesn't render.
  description: _description,
  descriptionClass: _descriptionClass,
  descriptionChildProps: _descriptionChildProps,
  children,
  onValueChange,
  onChange,
  ...inputAttrs
}: InputDecoratorProps) {
  const input = useInput({ disabled, validationState });
  const { setGroupValue, groupValue, internalName, internalDisabled, internalValidationState } =
    useGroupable({ name, value }, input);

  const inputValidationClass = internalValidationState ? INPUT_VALIDATION_CLASSES[internalValidationState] : undefined;

  return (
    <div>
      <label>
        <div className="d-radio-group">
          <input
            type="radio"
            className={cx('d-radio', inputValidationClass, inputClass)}
            name={internalName}
            value={value ?? undefined}
            disabled={internalDisabled}
            {...inputAttrs}
            onChange={event => {
              const newValue = event.currentTarget.value;
              if (newValue !== groupValue) {
                // update provided value if injected
                setGroupValue(newValue);
                onValueChange?.(newValue);
              }
              onChange?.(event);
            }}
          />
          <DtText
            kind="label"
            size={labelSize ?? 300}
            strength="normal"
            tone={internalDisabled ? 'disabled' : 'primary'}
            {...labelChildProps}
            className={cx('d-radio__copy d-radio__label', labelClass, labelChildProps.className)}
            data-qa="input-decorator-label"
          >
            {children ?? label}
          </DtText>
        </div>
      </label>
    </div>
  );
}
