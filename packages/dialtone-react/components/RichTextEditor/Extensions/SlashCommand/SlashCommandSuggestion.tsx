import { DtText } from '../../../Text';
import type { SuggestionItem } from '../Suggestion/SuggestionList';

export function SlashCommandSuggestion ({ item }: { item: SuggestionItem }) {
  const command = item.command as string | undefined;
  const description = item.description as string | undefined;
  const parametersExample = item.parametersExample as string | undefined;

  return (
    <div>
      <DtText
        kind="body"
        size={300}
        density={300}
        as="div"
      >
        <span>/{command}</span>{parametersExample && <span> {parametersExample}</span>}
      </DtText>
      <DtText
        kind="body"
        size={200}
        tone="tertiary"
        as="div"
      >
        {description}
      </DtText>
    </div>
  );
}

export default SlashCommandSuggestion;
