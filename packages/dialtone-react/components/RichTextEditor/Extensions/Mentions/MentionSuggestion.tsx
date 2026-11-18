import { cx } from '../../../../common/cx';
import { DtAvatar } from '../../../Avatar';
import type { AvatarPresenceState } from '../../../Avatar/AvatarConstants';
import { DtStack } from '../../../Stack';
import { DtText } from '../../../Text';
import type { SuggestionItem } from '../Suggestion/SuggestionList';

const presenceFontColors: Record<string, string> = {
  active: 'd-mention-suggestion__presence--active',
  busy: 'd-mention-suggestion__presence--busy',
  away: 'd-mention-suggestion__presence--away',
  offline: 'd-mention-suggestion__presence--busy',
};

export function MentionSuggestion ({ item }: { item: SuggestionItem }) {
  const name = item.name as string | undefined;
  const avatarSrc = item.avatarSrc as string | undefined;
  const presence = item.presence as AvatarPresenceState | undefined;
  const status = item.status as string | undefined;
  const presenceText = item.presenceText as string | undefined;
  const presenceFontColorClass = presence ? presenceFontColors[presence] : undefined;
  const showDetails = item.showDetails as boolean | undefined;

  return (
    <DtStack
      direction="row"
      className="d-mention-suggestion__container"
      gap="100"
    >
      <DtAvatar
        fullName={name}
        imageSrc={avatarSrc}
        imageAlt={name}
        // DtAvatar has no showPresence prop, so Vue's `:show-presence` falls through as an attribute.
        show-presence={showDetails ? 'true' : undefined}
        presence={presence}
        size={200}
      />
      <DtStack
        className="d-mention-suggestion__details-container"
        gap="1"
      >
        <span className="d-mention-suggestion__name">
          {name}
        </span>
        {showDetails && (
          <DtStack
            direction="row"
            gap="50"
          >
            {presenceText && (
              <DtText
                kind="label"
                size={200}
                strength="normal"
                className={cx('d-mention-suggestion__presence', presenceFontColorClass)}
              >
                {presenceText}
              </DtText>
            )}
            {status && presenceText && (
              <DtText
                kind="label"
                size={200}
                strength="normal"
                as="div"
                className="d-mention-suggestion__divider"
              >
                •
              </DtText>
            )}
            {status && (
              <DtText
                kind="label"
                size={200}
                strength="normal"
                as="div"
                className="d-mention-suggestion__status"
              >
                {status}
              </DtText>
            )}
          </DtStack>
        )}
      </DtStack>
    </DtStack>
  );
}

export default MentionSuggestion;
