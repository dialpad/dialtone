import { DtEmoji } from '../../../Emoji';
import { DtStack } from '../../../Stack';
import type { SuggestionItem } from '../Suggestion/SuggestionList';

export function EmojiSuggestion ({ item }: { item: SuggestionItem }) {
  const code = item.code as string;

  return (
    <DtStack
      direction="row"
      gap="100"
    >
      <DtEmoji
        size="200"
        code={code}
      />
      {code}
    </DtStack>
  );
}

export default EmojiSuggestion;
