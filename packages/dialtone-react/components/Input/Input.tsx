import {
  useCallback,
  useEffect,
  useEffectEvent,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { VALIDATION_MESSAGE_TYPES, type ValidationMessageType } from '../../common/constants';
import { getValidationState, type ValidationMessage } from '../../common/utils';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { useControllableState } from '../../common/hooks/useControllableState';
import { useMessages, type MessagesProps } from '../../common/input';
import { DtText, type TEXT_SIZE_MODIFIERS, type TextStrength } from '../Text';
import { DtValidationMessages } from '../ValidationMessages';
import {
  INPUT_ICON_SIZES,
  INPUT_SIZE_CLASSES,
  INPUT_SIZES,
  INPUT_STATE_CLASSES,
  INPUT_TYPES,
  type InputSize,
  type InputType,
} from './InputConstants';

type LabelSize = (typeof TEXT_SIZE_MODIFIERS)['label'][number];
/** '300' → 300: Vue's validator accepts each label size as a string or a number. */
type NumericSize<S> = S extends `${infer N extends number}` ? N : never;

/** The value the input holds: Vue's modelValue, or the file names a file input reports. */
type InputValue = string | number | string[];

/** The structure of `validate`. */
export interface InputValidation {
  length?: {
    description?: string;
    max?: number;
    warn?: number;
    message?: string;
    limitMaxLength?: boolean;
  };
}

/** The scope of the startIcon slot. */
export interface InputIconScope {
  iconSize: string | undefined;
}

/** The scope of the endIcon slot: `clear` empties the input, focuses it, and reports `onClear` and `onValueChange('')`. */
export interface InputEndIconScope extends InputIconScope {
  clear: () => void;
}

type NativeAttrs = InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>;

interface DtInputOwnProps extends MessagesProps {
  /** Name property of the input element */
  name?: string;

  /**
   * Type of the input.
   * When `textarea` a `<textarea>` element will be rendered instead of an `<input>` element.
   * @values text, password, email, number, textarea, date, time, file, tel, search, color
   * @default 'text'
   */
  type?: InputType;

  /** Value of the input (Vue's modelValue). Controlled when set. */
  value?: string | number;

  /** Initial value of the input when uncontrolled. */
  defaultValue?: string | number;

  /**
   * Fired to sync the value with the parent component (Vue's `update:modelValue`): the input's value, or a file
   * input's file names.
   */
  onValueChange?: (value: string | string[]) => void;

  /**
   * Disables the input
   * @values true, false
   */
  disabled?: boolean;

  /**
   * Label for the input. A string is the label prop; any other content replaces the label, as Vue's label slot does.
   */
  label?: ReactNode;

  /**
   * Determines visibility of input label.
   * @values true, false
   */
  showLabel?: boolean;

  /** Description for the input: a string, or content as in Vue's description slot. */
  description?: ReactNode;

  /** Used to customize the description container */
  descriptionClass?: ClassValue;

  /**
   * Size of the input.
   * @values 100, 200, 300, 400, 500
   */
  size?: InputSize;

  /** Additional class name for the input element. */
  inputClass?: ClassValue;

  /** Additional class name for the input wrapper element. */
  inputWrapperClass?: ClassValue;

  /**
   * The current character length that the user has entered into the input.
   * This will only need to be used if you are using `validate.length` and
   * the string contains abnormal characters.
   * For example, an emoji could take up many characters in the input, but should only count as 1 character.
   * If no number is provided, a built-in length calculation will be used for the length validation.
   */
  currentLength?: number | null;

  /** Whether the input will continue to display a warning validation message even if the input has lost focus. */
  retainWarning?: boolean;

  /**
   * Validation for the input. Supports maximum length validation with the structure:
   * `{ "length": {"description": string, "max": number, "warn": number, "message": string,
   * "limitMaxLength": boolean }}`
   */
  validate?: InputValidation | null;

  /** hidden allows to use input without the element visually present in DOM */
  hidden?: boolean;

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

  /** Used to customize the label container */
  labelClass?: ClassValue;

  /** Used to customize the start icon container */
  startIconClass?: ClassValue;

  /** Used to customize the end icon container */
  endIconClass?: ClassValue;

  /** Slot for start icon. A function receives `{ iconSize }`. */
  startIcon?: SlotProp<InputIconScope>;

  /** Slot for end icon. A function receives `{ iconSize, clear }`. */
  endIcon?: SlotProp<InputEndIconScope>;

  /** Input blur event: fired when focus leaves the component, not when it moves within it (to an icon's button). */
  onBlur?: (event: FocusEvent<HTMLElement>) => void;

  /** Native input focus event */
  onFocus?: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  /** Input clear event */
  onClear?: () => void;

  /** Length of the input when currentLength prop is not passed (Vue's `update:length`) */
  onLengthChange?: (length: number) => void;

  /** Result of the input validation (Vue's `update:invalid`) */
  onInvalidChange?: (invalid: boolean) => void;
}

/**
 * Like Vue's `$attrs`, `className` and `style` go on the root; every other attribute and handler goes on the
 * native input (or textarea), and so does `ref`.
 */
export interface DtInputProps extends DtInputOwnProps, Omit<NativeAttrs, keyof DtInputOwnProps> {
  ref?: Ref<HTMLInputElement | HTMLTextAreaElement | null>;
}

const ICON_SIZES: Readonly<Partial<Record<string, string>>> = INPUT_ICON_SIZES;
const SIZE_CLASSES: Readonly<Record<'input' | 'textarea', Readonly<Partial<Record<string, string>>>>> =
  INPUT_SIZE_CLASSES;
const STATE_CLASSES: Readonly<Partial<Record<string, string>>> = INPUT_STATE_CLASSES;
const DESCRIPTION_SIZES: Readonly<Partial<Record<string, string>>> = {
  100: 'xs', 200: 'xs', 300: 'sm', 400: 'sm', 500: 'md',
  xs: 'xs', sm: 'xs', md: 'sm', lg: 'sm', xl: 'md',
};

function calculateLength (value: InputValue): number {
  if (typeof value !== 'string') {
    return 0;
  }

  return [...value].length;
}

function lengthState (length: number, warn?: number, max?: number): ValidationMessageType | null {
  // Vue compares against undefined, which is never true: a missing warn or max skips its branch.
  if (warn !== undefined && length < warn) {
    return null;
  } else if (max !== undefined && length <= max) {
    return warn ? VALIDATION_MESSAGE_TYPES.WARNING : null;
  } else {
    return VALIDATION_MESSAGE_TYPES.CRITICAL;
  }
}

const domValue = (value: InputValue) => String(value ?? '');

/**
 * An input field is an input control that allows users to enter alphanumeric information.
 * It can have a range of options and supports single line and multi-line lengths,
 * as well as varying formats, including numbers, masked passwords, etc.
 * @see https://dialtone.dialpad.com/components/input.html
 */
export function DtInput ({
  name = '',
  type = INPUT_TYPES.TEXT,
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  label = '',
  showLabel = true,
  description = '',
  descriptionClass = '',
  size = 300,
  inputClass = '',
  inputWrapperClass = '',
  currentLength = null,
  retainWarning = false,
  validate = null,
  hidden = false,
  labelSize = null,
  labelStrength = null,
  labelClass = '',
  startIconClass = '',
  endIconClass = '',
  startIcon,
  endIcon,
  messagesClass = '',
  messagesChildProps = {},
  showMessages = true,
  messages = [],
  onBlur,
  onFocus,
  onClear,
  onLengthChange,
  onInvalidChange,
  className,
  style,
  ref,
  autoComplete,
  onChange,
  onCompositionStart,
  onCompositionEnd,
  ...inputAttrs
}: DtInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const isComposing = useRef(false);
  const justEndedComposition = useRef(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const messagesId = useId();
  const descriptionId = useId();
  const descriptionKey = `input-description-${descriptionId}`;

  // Vue only ever emits strings (or a file input's names); a number can only come in through `value`.
  const emitValue = (next: InputValue) => {
    if (typeof next !== 'number') onValueChange?.(next);
  };
  const [currentValue, setCurrentValue] = useControllableState<InputValue>({
    value,
    defaultValue,
    onChange: emitValue,
  });
  const { formattedMessages } = useMessages({ messages });

  const isTextarea = type === INPUT_TYPES.TEXTAREA;
  const sizeKey = String(size);
  const isDefaultSize = sizeKey === INPUT_SIZES.DEFAULT || sizeKey === '300';
  const iconSize = ICON_SIZES[sizeKey];
  const isValidSize = Object.hasOwn(INPUT_ICON_SIZES, sizeKey);

  const { description: lengthDescription, max, warn, message: lengthMessage } = validate?.length ?? {};
  const limitMaxLength = validate?.length?.limitMaxLength ?? false;
  const inputLength = currentLength ? currentLength : calculateLength(currentValue);
  const inputLengthState = lengthState(inputLength, warn, max);
  const shouldValidateLength = !!(lengthDescription && max);
  const shouldLimitMaxLength = shouldValidateLength && limitMaxLength;
  // Vue keeps isInvalid in data, set by its modelValue watcher; here it's derived from the same inputs.
  const isInvalid = shouldValidateLength && max !== undefined && inputLength > max;
  const showLengthLimitValidation = shouldValidateLength && inputLengthState !== null && !!lengthMessage &&
    (retainWarning || isInputFocused || isInvalid);

  const validationMessages: ValidationMessage[] = showLengthLimitValidation && inputLengthState && lengthMessage
    ? [...formattedMessages, { message: lengthMessage, type: inputLengthState }]
    : formattedMessages;
  const inputState = getValidationState(validationMessages);
  const ariaInvalid = inputState === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
  const ariaDescribedBy = showMessages && validationMessages.length > 0 ? messagesId : undefined;
  const stateClass = showMessages && inputState ? STATE_CLASSES[inputState] : undefined;

  const resolvedLabelSize = labelSize ?? (
    // xl/500 exceeds label's max size — cap at lg/400
    sizeKey === 'xl' || sizeKey === '500' ? (sizeKey === '500' ? '400' : 'lg') : size
  );
  const resolvedDescriptionSize = DESCRIPTION_SIZES[sizeKey] || 'sm';
  const resolvedDescriptionDensity = sizeKey === 'xl' || sizeKey === '500' ? '300' : undefined;
  const sizeModifierClass = isDefaultSize || !isValidSize ? '' : SIZE_CLASSES[isTextarea ? 'textarea' : 'input'][sizeKey];

  // A string is Vue's label prop; other content is its label slot, which replaces the label and its fallback.
  const labelIsSlot = label != null && typeof label !== 'string';
  const labelText = typeof label === 'string' ? label : '';
  // A string is Vue's description prop, shown when non-empty; other content is its description slot, which counts
  // for aria-details when passed at all ($slots.description) and is shown when it has content. null is the absent
  // prop.
  const descriptionPassed = typeof description === 'string' ? description !== '' : description != null;
  const descriptionShown = typeof description === 'string' ? description !== '' : hasContent(description);

  // One callback ref fits both elements, where a ref object is typed for one of them.
  const setInputEl = useCallback((el: HTMLInputElement | HTMLTextAreaElement | null) => {
    inputRef.current = el;
  }, []);
  // `ref` is the native input, like the rest of the attributes; Vue's focus(), blur() and select() are its own.
  useImperativeHandle<HTMLInputElement | HTMLTextAreaElement | null, HTMLInputElement | HTMLTextAreaElement | null>(
    ref,
    () => inputRef.current,
    [isTextarea],
  );

  // An <input>: Vue's `:value` binding, which writes the value back on every render where the element's differs.
  // It isn't React's controlled `value`, which would undo each keystroke of an IME composition the moment it
  // happens (the input reports nothing until the composition ends).
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (isTextarea || !el) return;
    const next = domValue(currentValue);
    // A file input's value can only be cleared.
    if (el.value !== next && (type !== INPUT_TYPES.FILE || next === '')) el.value = next;
  });

  // A <textarea>: Vue's mounted() and modelValue watcher, which leave an IME composition alone.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!isTextarea || !el || isComposing.current) return;
    const next = domValue(currentValue);
    if (el.value !== next) el.value = next;
  }, [isTextarea, currentValue]);

  // Vue's immediate modelValue watcher: the length on mount and on every change. The ref keeps StrictMode's second
  // run from reporting the same value twice.
  const lengthReportedFor = useRef<{ value: InputValue } | null>(null);
  const reportLength = useEffectEvent((next: InputValue) => {
    if (currentLength == null) onLengthChange?.(calculateLength(next));
  });
  useEffect(() => {
    if (lengthReportedFor.current && Object.is(lengthReportedFor.current.value, currentValue)) return;
    lengthReportedFor.current = { value: currentValue };
    reportLength(currentValue);
  }, [currentValue]);

  // Vue's isInvalid watcher: it starts false, so a value that's invalid on mount reports true.
  const reportedInvalid = useRef(false);
  const reportInvalid = useEffectEvent((invalid: boolean) => onInvalidChange?.(invalid));
  useEffect(() => {
    if (reportedInvalid.current === isInvalid) return;
    reportedInvalid.current = isInvalid;
    reportInvalid(isInvalid);
  }, [isInvalid]);

  // Vue checks once, in mounted(). The ref keeps it to the first run: neither a later change of label nor StrictMode's
  // second mount informs again.
  const missingLabel = !hasContent(label) && !inputAttrs['aria-label'];
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

  const handleBlurOut = (event: FocusEvent<HTMLElement>) => {
    // Do not emit a blur event if the target element is a child of this component
    if (!containerRef.current?.contains(event.relatedTarget)) {
      onBlur?.(event);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isComposing.current && !justEndedComposition.current) {
      const target = event.currentTarget;
      const next = type === INPUT_TYPES.FILE && target instanceof HTMLInputElement
        ? Array.from(target.files ?? []).map(file => file.name)
        : target.value;
      setCurrentValue(next);
    }
    onChange?.(event);
  };

  const handleCompositionStart = (event: CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isComposing.current = true;
    onCompositionStart?.(event);
  };

  const handleCompositionEnd = (event: CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    isComposing.current = false;
    justEndedComposition.current = true;
    setCurrentValue(event.currentTarget.value);
    // Clear the flag after the current synchronous event processing so
    // Firefox's post-compositionend input event is skipped, but the
    // next real user input (a separate browser task) is not.
    queueMicrotask(() => { justEndedComposition.current = false; });
    onCompositionEnd?.(event);
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsInputFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsInputFocused(false);
    handleBlurOut(event);
  };

  const clearInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.value = '';
    el.focus();
    onClear?.();
    setCurrentValue('');
  };

  const controlProps = {
    name,
    disabled,
    autoComplete: autoComplete ?? 'off',
    className: cx(
      'd-input__input',
      isTextarea ? 'd-textarea' : 'd-input',
      stateClass,
      { 'd-input-icon--left': startIcon !== undefined, 'd-input-icon--right': endIcon !== undefined },
      sizeModifierClass,
      inputClass,
    ),
    maxLength: shouldLimitMaxLength ? max : undefined,
    'aria-label': !showLabel && labelText ? labelText : undefined,
    'aria-invalid': ariaInvalid,
    'aria-describedby': ariaDescribedBy,
    'data-qa': 'dt-input-input',
    ...inputAttrs,
    ref: setInputEl,
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <div
      ref={containerRef}
      className={cx('d-input__root', { 'd-input--hidden': hidden }, className)}
      style={style}
      data-qa="dt-input"
    >
      <label
        className="d-input__label"
        aria-details={descriptionPassed ? descriptionKey : undefined}
        data-qa="dt-input-label-wrapper"
      >
        {labelIsSlot
          ? label
          : showLabel && labelText
            ? (
              <DtText
                data-qa="dt-input-label"
                kind="label"
                size={resolvedLabelSize}
                strength={labelStrength}
                tone="secondary"
                className={cx('d-input__label-text', labelClass)}
              >
                {labelText}
              </DtText>
            )
            : null}
        {(descriptionShown || shouldValidateLength) && (
          <DtText
            id={descriptionKey}
            kind="body"
            size={resolvedDescriptionSize}
            tone="tertiary"
            density={resolvedDescriptionDensity}
            as="div"
            className={cx('d-input__description', 'd-description', descriptionClass)}
            data-qa="dt-input-description"
          >
            {descriptionShown && <div>{description}</div>}
            {shouldValidateLength && (
              <div
                data-qa="dt-input-length-description"
                className="d-input__length-description"
              >
                {lengthDescription}
              </div>
            )}
          </DtText>
        )}
        <div
          className={hidden ? '' : cx('d-input__wrapper', stateClass, inputWrapperClass)}
          read-only={disabled ? 'true' : undefined}
        >
          <span
            className={cx('d-input-icon', 'd-input-icon--left', startIconClass)}
            data-qa="dt-input-left-icon-wrapper"
            onBlur={handleBlurOut}
          >
            {renderSlot(startIcon, { iconSize })}
          </span>
          {isTextarea ? <textarea {...controlProps} /> : <input {...controlProps} type={type} />}
          <span
            className={cx('d-input-icon', 'd-input-icon--right', endIconClass)}
            data-qa="dt-input-right-icon-wrapper"
            onBlur={handleBlurOut}
          >
            {renderSlot(endIcon, { iconSize, clear: clearInput })}
          </span>
        </div>
      </label>
      <DtValidationMessages
        {...messagesChildProps}
        id={messagesId}
        validationMessages={validationMessages}
        showMessages={showMessages}
        className={cx(messagesChildProps.className, messagesClass)}
        data-qa="dt-input-messages"
      />
    </div>
  );
}
