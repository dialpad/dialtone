import { DtIconHash, DtIconLock } from '../../../../icons';
import { DtStack } from '../../../Stack';
import type { SuggestionItem } from '../Suggestion/SuggestionList';

export function ChannelSuggestion ({ item }: { item: SuggestionItem }) {
  const name = item.name as string | undefined;

  return (
    <DtStack
      direction="row"
      gap="100"
    >
      {!item.locked
        ? <DtIconHash size="300" />
        : <DtIconLock size="300" />}
      <span>{name}</span>
    </DtStack>
  );
}

export default ChannelSuggestion;
