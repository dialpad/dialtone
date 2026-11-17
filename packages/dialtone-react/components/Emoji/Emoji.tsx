import { useMemo, useState, type ComponentPropsWithRef } from 'react';
import { cx, type ClassValue } from '../../common/cx';
import {
  codeToEmojiData,
  stringToUnicode,
  emojiImageUrlSmall,
  emojiFileExtensionSmall,
  emojiImageUrlLarge,
  emojiFileExtensionLarge,
} from '../../common/emoji';
import type { IconSize } from '../../icons';
import { ICON_SIZE_MODIFIERS } from '../Icon';
import { DtSkeleton } from '../Skeleton';

interface DtEmojiOwnProps {
  /**
   * Supports shortcode ex: :smile: or unicode ex: 😄. Will display the resulting emoji.
   * JoyPixels (https://emojipedia.org/joypixels/) for all supported shortcode/unicode or the docs for setting up
   * custom emojis.
   */
  code: string;

  /**
   * The size of the emoji. Can be any of the icon size utility classes from Dialpad Icon Size
   * (https://dialtone.dialpad.com/components/icon.html)
   * @values 100, 200, 300, 400, 500, 600, 700, 800
   */
  size?: IconSize;

  /**
   * Additional class name for the emoji img element.
   * Can accept String, Object, and Array, i.e. has the
   * same API as Vue's built-in handling of the class attribute.
   */
  imgClass?: ClassValue;

  /**
   * Will be read out on a screen reader for this emoji. You must use this prop if you want your emoji to be i18n
   * Compatible as Dialtone React will not translate it by itself. If you do not set this prop the aria-label will
   * be set to the english description of the emoji. You can retrieve the description for an emoji yourself via the
   * getEmojiData() function
   */
  ariaLabel?: string | null;

  /**
   * Shows a skeleton loader while the emoji asset is loading.
   * @values true, false
   */
  showSkeleton?: boolean;
}

export type DtEmojiProps = DtEmojiOwnProps & Omit<ComponentPropsWithRef<'span'>, keyof DtEmojiOwnProps>;

const HIDDEN = { display: 'none' } as const;

/**
 * Renders an emoji from a shortcode such as :smile: or unicode character such as 😄
 * @see https://dialtone.dialpad.com/components/emoji.html
 */
export function DtEmoji ({
  code,
  size = 500,
  imgClass = '',
  ariaLabel = null,
  showSkeleton = true,
  className,
  'aria-label': ariaLabelAttribute,
  ...rest
}: DtEmojiProps) {
  // Vue looks the emoji up when `code` changes, not on every render.
  const emojiData = useMemo(() => codeToEmojiData(code), [code]);

  let emojiSrc = 'invalid';
  if (emojiData) {
    if (emojiData.custom) {
      emojiSrc = emojiData.image as string;
    } else if (['100', '200'].includes(String(size))) {
      emojiSrc = emojiImageUrlSmall + emojiData.key + emojiFileExtensionSmall;
    } else {
      emojiSrc = emojiImageUrlLarge + emojiData.key + emojiFileExtensionLarge;
    }
  }

  // Vue sets `imgLoading` when the src changes and clears it on the image's load or error. Here the src that last
  // loaded or errored is kept, so the image is loading whenever it isn't the current one.
  const [settledSrc, setSettledSrc] = useState<string | null>(null);
  const imgLoading = settledSrc !== emojiSrc;
  const imageSettled = () => setSettledSrc(emojiSrc);

  // Vue's `aria-label` attribute is the prop, as it camelizes attribute names.
  const label = ariaLabel || ariaLabelAttribute;
  const emojiLabel = emojiData ? (label || emojiData.name) : 'Invalid Emoji';
  const emojiAlt = emojiData
    ? (emojiData.unicode_output ? stringToUnicode(emojiData.unicode_output) : emojiData.name)
    : undefined;
  const emojiSize = ICON_SIZE_MODIFIERS[size];

  return (
    <span
      className={cx('d-emoji d-icon', emojiSize, className)}
      data-qa="dt-emoji"
      {...rest}
    >
      <DtSkeleton
        offset={0}
        className={cx('d-icon', emojiSize)}
        shapeOption={{ shape: 'circle', size: '100%' }}
        style={imgLoading && showSkeleton ? undefined : HIDDEN}
      />
      <img
        data-qa="dt-emoji-image"
        className={cx('d-icon', emojiSize, imgClass)}
        aria-label={emojiLabel}
        alt={emojiAlt}
        title={emojiLabel}
        src={emojiSrc}
        style={imgLoading ? HIDDEN : undefined}
        onLoad={imageSettled}
        onError={imageSettled}
      />
    </span>
  );
}
