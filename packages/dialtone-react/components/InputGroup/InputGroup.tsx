import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { cx } from '../../common/cx';
import { VALIDATION_MESSAGE_TYPES } from '../../common/constants';
import { InputGroupContext } from '../../common/input';
import { useInputGroup, type InputGroupProps } from '../../common/input-group';
import { hasContent } from '../../common/slots';
import { getValidationState } from '../../common/utils';
import { DtText } from '../Text';
import { DtValidationMessages } from '../ValidationMessages';

interface DtInputGroupOwnProps extends InputGroupProps {
  /** A data qa tag for the input group */
  dataQaGroup?: string;

  /** A data qa tag for the input group legend */
  dataQaGroupLegend?: string;

  /** A data qa tag for the input group messages */
  dataQaGroupMessages?: string;

  /** The inputs in the group (Vue's default slot). */
  children?: ReactNode;
}

/**
 * Like Vue's `$attrs`, every other attribute and handler goes on the root `<fieldset>`, and so does `ref`.
 * `disabled` and `name` are the group's own props, which Vue doesn't render on the fieldset.
 */
export interface DtInputGroupProps extends DtInputGroupOwnProps,
  Omit<ComponentPropsWithRef<'fieldset'>, keyof DtInputGroupOwnProps> {}

/**
 * Input Groups are convenience components for a grouping of related inputs.
 * While each input within the group could be independent, the `value` on the group
 * provides a convenient interface for determining the current state of the group.
 * @see https://dialtone.dialpad.com/components/input_group.html
 */
export function DtInputGroup ({
  dataQaGroup = 'input-group',
  dataQaGroupLegend = 'input-group-legend',
  dataQaGroupMessages = 'input-group-messages',
  id,
  value,
  defaultValue,
  onValueChange,
  name,
  legend = '',
  disabled = false,
  messages = [],
  showMessages = true,
  legendClass = '',
  messagesClass = '',
  legendChildProps = {},
  messagesChildProps = {},
  children,
  className,
  ...fieldsetAttrs
}: DtInputGroupProps) {
  const { contextValue, formattedMessages } = useInputGroup(
    { id, value, defaultValue, onValueChange, name, legend, disabled, messages },
    { ariaLabel: fieldsetAttrs['aria-label'] },
  );
  // Vue's messagesId is generated per instance, and is not the group's `id` prop.
  const messagesId = useId();

  const ariaInvalid = getValidationState(formattedMessages) === VALIDATION_MESSAGE_TYPES.CRITICAL ? 'true' : undefined;
  const ariaDescribedBy = showMessages && formattedMessages.length > 0 ? messagesId : undefined;
  // `legend` is Vue's prop and slot in one: a string is the prop, shown when non-empty; anything else is the slot.
  const hasLegend = typeof legend === 'string' ? legend !== '' : hasContent(legend);

  return (
    <InputGroupContext value={contextValue}>
      <fieldset
        data-qa={dataQaGroup}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        {...fieldsetAttrs}
        className={cx('d-input-group__fieldset', className)}
      >
        {hasLegend && (
          <DtText
            kind="label"
            as="legend"
            tone="secondary"
            {...legendChildProps}
            className={cx('d-input-group__legend-text', legendClass, legendChildProps.className)}
            data-qa={dataQaGroupLegend}
          >
            {legend}
          </DtText>
        )}
        {children}
        <DtValidationMessages
          {...messagesChildProps}
          id={messagesId}
          validationMessages={formattedMessages}
          showMessages={showMessages}
          className={cx(messagesChildProps.className, messagesClass)}
          data-qa={dataQaGroupMessages}
        />
      </fieldset>
    </InputGroupContext>
  );
}
