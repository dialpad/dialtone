import { CDN_URL, type EmojiPickerEmoji } from '../EmojiPickerConstants';

export interface EmojiDescriptionProps {
  /** Emoji data */
  emoji?: EmojiPickerEmoji | null;
}

function getImgSrc (emoji: EmojiPickerEmoji) {
  if (emoji.date_added) { // if custom emoji
    return emoji.image;
  } else { // if regular emoji
    return `${CDN_URL + emoji.unicode_character}.png`;
  }
}

export function EmojiDescription ({ emoji = null }: EmojiDescriptionProps) {
  return (
    <div
      className="d-emoji-picker__data"
      data-qa="dt-emoji-picker-description"
    >
      {emoji && (
        <img
          className="d-icon d-icon--size-500"
          alt={emoji.name}
          aria-label={emoji.name}
          title={emoji.name}
          src={getImgSrc(emoji)}
        />
      )}
      <div>{emoji?.name}</div>
    </div>
  );
}
