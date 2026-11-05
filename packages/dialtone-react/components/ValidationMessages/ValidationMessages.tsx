import { useId, type HTMLAttributes } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import type { ValidationMessageType } from '../../common/constants';
import { filterFormattedMessages, type ValidationMessage } from '../../common/utils';
import { hasContent, renderSlot, type SlotProp } from '../../common/slots';
import { DtIconAlertCircle, DtIconAlertTriangle, DtIconCheckCircle, DtIconInfo } from '../../icons';

const kindToIcon = {
  warning: DtIconAlertTriangle,
  critical: DtIconAlertCircle,
  positive: DtIconCheckCircle,
  info: DtIconInfo,
} as const;

const messageTypeClasses: Record<ValidationMessageType, string> = {
  critical: 'base-input__message--critical d-validation-message--critical',
  warning: 'base-input__message--warning d-validation-message--warning',
  positive: 'base-input__message--positive d-validation-message--positive',
  info: 'base-input__message--info d-validation-message--info',
};

export interface DtValidationMessagesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  /** The id of the validation message container. Generated when unset. */
  id?: string;
  /** Messages shaped `{ message: "Some informative message", type: "critical|warning|positive|info" }`. */
  validationMessages?: ValidationMessage[];
  /** Show validation messages. */
  showMessages?: boolean;
  /** Additional class name for the icon. */
  iconClass?: ClassValue;
  /**
   * Replaces the default per-type icon. Must be a Dialtone icon (it carries the `d-icon` class), so the
   * CSS pseudo-element fallback is suppressed. A function receives `{ type }`.
   */
  icon?: SlotProp<{ type: ValidationMessageType }>;
}

/**
 * Validation messages convey information about the current state of an input element: critical, warning,
 * positive or info.
 * @see https://dialtone.dialpad.com/components/validation_messages.html
 */
export function DtValidationMessages ({
  id,
  validationMessages = [],
  showMessages = true,
  iconClass,
  icon,
  className,
  ...rest
}: DtValidationMessagesProps) {
  const generatedId = useId();
  const messages = filterFormattedMessages(validationMessages);

  return (
    // The live region is always present so VoiceOver can detect mutations on a stable node (DLT-3430).
    <div
      id={id ?? generatedId}
      aria-live="assertive"
      className={cx('base-input__messages d-validation-message__container', className)}
      data-qa="validation-messages-container"
      {...rest}
    >
      {showMessages && messages.map(({ message, type }, index) => {
        const Icon = kindToIcon[type];
        const custom = icon === undefined ? null : renderSlot(icon, { type });
        return (
          <div
            key={`${type}-${index}`}
            data-qa="validation-message"
            className={cx('base-input__message', 'd-validation-message', messageTypeClasses[type])}
          >
            {hasContent(custom)
              ? custom
              : Icon && <Icon className={cx('d-validation-message__icon', iconClass)} data-qa="validation-message-icon" size="300" />}
            <p dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        );
      })}
    </div>
  );
}
