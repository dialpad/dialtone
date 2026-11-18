import { NodeViewWrapper, type ReactNodeViewProps } from '@tiptap/react';
import { useI18n } from '../../../../common/localization';
import { DtBadge } from '../../../Badge';
import { DtButton } from '../../../Button';
import { DtInput } from '../../../Input';
import { DtPopover } from '../../../Popover';
import type { VariableItem, VariableOptions } from './Variable';

const MAX_VARIABLE_ALT_LENGTH = 100;

export function VariableComponent ({ node, extension, updateAttributes }: ReactNodeViewProps) {
  const i18n = useI18n();

  const altText: string = node?.attrs?.altText || '';
  const setAltText = (value: string) => {
    updateAttributes({ altText: value });
  };

  const variableId = node?.attrs?.id;
  const variableItems: VariableItem[] = (extension?.options as VariableOptions | undefined)?.variableItems || [];
  const variableData = variableItems.find(item => item.id === variableId);
  const placeholder = variableData?.placeholder || '';
  const enableAltText = node?.attrs?.enableAltText;
  const badgeLabel = `{} ${placeholder}`;
  const placeholderText = `Replaces ${placeholder}`;

  return (
    <NodeViewWrapper className="d-d-inline-block">
      {enableAltText
        ? (
          <DtPopover
            padding="small"
            // DtPopover has no navigationType prop, so Vue's falls through as an attribute.
            navigation-type="arrow-keys"
            placement="top-start"
            modal={false}
            anchor={({ attrs }) => (
              <DtButton
                {...attrs}
                kind="unstyled"
              >
                <DtBadge
                  text={badgeLabel}
                  contentEditable="false"
                />
              </DtButton>
            )}
            content={({ close }) => (
              <DtInput
                value={altText}
                onValueChange={value => setAltText(value as string)}
                className="d-p-100 d-w332"
                label={i18n.$t('DIALTONE_EDITOR_VARIABLE_LABEL')}
                placeholder={placeholderText}
                validate={{
                  length: {
                    description: i18n.$t('DIALTONE_EDITOR_VARIABLE_VALIDATE_DESCRIPTION'),
                    message: i18n.$t('DIALTONE_EDITOR_VARIABLE_VALIDATE_MESSAGE'),
                    max: MAX_VARIABLE_ALT_LENGTH,
                    warn: MAX_VARIABLE_ALT_LENGTH,
                    limitMaxLength: true,
                  },
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') close();
                }}
              />
            )}
          />
        )
        : (
          <DtBadge
            text={badgeLabel}
            contentEditable="false"
          />
        )}
    </NodeViewWrapper>
  );
}

export default VariableComponent;
