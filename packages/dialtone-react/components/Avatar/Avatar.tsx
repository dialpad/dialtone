import {
  useEffect,
  useEffectEvent,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import { hasContent } from '../../common/slots';
import { DtPresence, type DtPresenceProps } from '../Presence';
import {
  AVATAR_KIND_MODIFIERS,
  AVATAR_SIZE_MODIFIERS,
  AVATAR_PRESENCE_SIZE_MODIFIERS,
  AVATAR_PRESENCE_STATES,
  AVATAR_GROUP_VALIDATOR,
  getRandomFamilyVariant,
  computeAvatarHex,
  type AvatarFamily,
  type AvatarPresenceState,
  type AvatarSize,
  type AvatarVariant,
} from './AvatarConstants';
import { extractInitialsFromName } from './Utils';

// Check if browser supports oklch() - only compute hex fallback if not
function supportsOklch (): boolean {
  return typeof CSS !== 'undefined' && !!CSS.supports?.('background', 'oklch(0.5 0.1 0)');
}

interface DtAvatarOwnProps {
  /**
   * Id of the avatar content wrapper element
   */
  id?: string;

  /**
   * **Recommended.** Pass a unique identifier (e.g., user ID) to generate consistent,
   * deterministic colors for this avatar. The same seed always produces the same color.
   * This is the preferred approach for most use cases.
   */
  seed?: string;

  /**
   * **Advanced.** Avatar color family (1-12). Each family represents a different hue
   * offset from the theme's anchor. Only use this if you need explicit control over
   * the color. For most cases, use `seed` instead.
   * Families: 1=Red, 2=Orange, 3=Amber, 4=Yellow-Green, 5=Green, 6=Teal, 7=Cyan,
   * 8=Blue, 9=Indigo, 10=Purple, 11=Magenta, 12=Pink
   * @values 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
   */
  family?: AvatarFamily;

  /**
   * **Advanced.** Avatar color variant (0-9). Controls lightness/chroma within the family.
   * Only use this if you need explicit control over the color. For most cases, use `seed` instead.
   * 0 = darkest, 9 = lightest. Variants 0-5 have light text, 6-9 have dark text.
   * @values 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
   */
  variant?: AvatarVariant;

  /**
   * The size of the avatar.
   * T-shirt sizes (xs, sm, md, lg, xl) are deprecated and will be removed in the next major version.
   * Please use the numeric scale instead.
   * @values 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900
   */
  size?: AvatarSize;

  /**
   * Used to customize the avatar container
   */
  avatarClass?: ClassValue;

  /**
   * Set classes on the avatar canvas. Wrapper around the core avatar image.
   */
  canvasClass?: ClassValue;

  /**
   * Pass through classes. Used to customize the avatar icon
   */
  iconClass?: ClassValue;

  /**
   * Determines whether to show the presence indicator for
   * Avatar - accepts PRESENCE_STATES values: 'busy', 'away', 'offline',
   * 'active', or 'dnd'. By default, it's null and nothing is shown.
   * @values null, busy, away, offline, active, dnd
   */
  presence?: AvatarPresenceState | null;

  /**
   * A set of props to be passed into the presence component.
   */
  presenceProps?: DtPresenceProps;

  /**
   * Determines whether to show a group avatar.
   * Limit to 2 digits max, more than 99 will be rendered as "99+".
   * if the number is 1 or less it would just show the regular avatar as if group had not been set.
   */
  group?: number;

  /**
   * The text that overlays the avatar
   */
  overlayText?: string;

  /**
   * Used to customize the avatar overlay
   */
  overlayClass?: ClassValue;

  /**
   * Source of the image
   */
  imageSrc?: string;

  /**
   * Alt attribute of the image, required if imageSrc is provided.
   * Can be set to '' (empty string) if the image is described
   * in text nearby
   */
  imageAlt?: string;

  /**
   * Full name used to extract initials.
   */
  fullName?: string;

  /**
   * Makes the avatar focusable and interactive,
   * calls onClick when clicked.
   */
  interactive?: boolean;

  /**
   * Descriptive label for the icon.
   * To avoid a11y issues, set this prop if interactive and the icon slot are set.
   */
  iconAriaLabel?: string;

  /**
   * When true, renders the avatar with a transparent background and no color.
   * Useful for displaying icons that should not have a colored background,
   * such as channel or navigation icons.
   */
  iconOnly?: boolean;

  /**
   * When true, renders the avatar in a desaturated/washed-out state.
   * Use this to indicate that a user is deactivated or inactive.
   */
  deactivated?: boolean;

  /**
   * Slot for avatar icon. It will display if no imageSrc is provided
   */
  icon?: ReactNode;

  /**
   * Slot for overlay icon.
   */
  overlayIcon?: ReactNode;

  /**
   * Avatar click event. Called only when the avatar is interactive.
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

// The root is a <div>, or a <button> when interactive, so attributes and the ref are typed for either.
// `color` is left out: Vue's deprecated `color` prop isn't ported, and the HTML attribute would take its place.
export type DtAvatarProps = DtAvatarOwnProps
  & Omit<HTMLAttributes<HTMLElement>, keyof DtAvatarOwnProps | 'color'>
  & { ref?: Ref<HTMLElement> };

/**
 * Read the anchor hue from CSS custom property for fallback computation
 */
function readAnchorHue (): number {
  try {
    const hueValue = getComputedStyle(document.documentElement)
      .getPropertyValue('--dt-avatar-anchor-hue')
      .trim();
    return parseFloat(hueValue) || 0;
  } catch {
    return 0;
  }
}

function formatInitials (fullName: string, size: string): string | undefined {
  const initials = extractInitialsFromName(fullName);

  // xs/100 are too small for initials
  if (size === 'xs' || size === '100') return '';
  // sm/150/200 show single initial
  if (size === 'sm' || size === '150' || size === '200') return initials[0];
  return initials;
}

/**
 * An avatar is a visual representation of a user or object.
 * @see https://dialtone.dialpad.com/components/avatar.html
 */
export function DtAvatar ({
  id,
  seed,
  family,
  variant,
  size = 300,
  avatarClass = '',
  canvasClass = '',
  iconClass = '',
  presence = AVATAR_PRESENCE_STATES.NONE,
  presenceProps,
  group,
  overlayText = '',
  overlayClass = '',
  imageSrc = '',
  imageAlt,
  fullName = '',
  interactive = false,
  iconAriaLabel,
  iconOnly = false,
  deactivated = false,
  icon,
  overlayIcon,
  onClick,
  className,
  style,
  ref,
  ...rest
}: DtAvatarProps) {
  const generatedId = useId();
  const sizeKey = String(size);

  const hasOverlayIcon = hasContent(overlayIcon);
  const isIconType = hasContent(icon);

  // Vue computes family and variant separately, each with its own random draw when there's no seed. They're memoized
  // like Vue's computeds, so re-renders (an image loading) don't pick a new color.
  const computedFamily = useMemo(() => {
    // Icon-type avatars don't use color
    if (isIconType) return undefined;
    // Explicit family prop takes precedence
    if (family !== undefined) return family;
    // Random based on seed
    return getRandomFamilyVariant(seed).family;
  }, [isIconType, family, seed]);

  const computedVariant = useMemo(() => {
    if (isIconType) return undefined;
    if (variant !== undefined) return variant;
    return getRandomFamilyVariant(seed).variant;
  }, [isIconType, variant, seed]);

  // Vue resets its load state when imageSrc changes; this is that reset, made during render.
  const [imageState, setImageState] = useState<{ src: string; loaded: boolean | null }>({
    src: imageSrc,
    loaded: null,
  });
  let imageLoadedSuccessfully = imageState.loaded;
  if (imageState.src !== imageSrc) {
    imageLoadedSuccessfully = null;
    setImageState({ src: imageSrc, loaded: null });
  }
  const showImage = imageLoadedSuccessfully !== false && !!imageSrc;

  // The hex fallback is for browsers without oklch() support. It's decided after mount, so the server render and the
  // first client render agree: React doesn't patch a mismatched style attribute during hydration.
  const [hexFallback, setHexFallback] = useState(false);
  const [anchorHue, setAnchorHue] = useState(0);
  useEffect(() => {
    if (!supportsOklch()) {
      setHexFallback(true);
      setAnchorHue(readAnchorHue());
    }
  }, []);

  // Vue validates on mount and whenever imageSrc changes; the ref keeps StrictMode from repeating it.
  const validatedSrc = useRef<string | null>(null);
  const validateProps = useEffectEvent(() => {
    if (imageSrc && imageAlt === undefined) {
      console.error(
        'image-alt required if image-src is provided. ' +
        'Can be set to "" (empty string) if the image is described in text nearby',
      );
    }
  });
  useEffect(() => {
    if (validatedSrc.current === imageSrc) return;
    validatedSrc.current = imageSrc;
    validateProps();
  }, [imageSrc]);

  const showGroup = AVATAR_GROUP_VALIDATOR(group);

  // Sizes 100-250 cap at 2 digits — too small for 3
  const smallSizes = ['xs', '100', '150', '200', '250'];
  const maxDigits = smallSizes.includes(sizeKey) ? 2 : 3;
  const formattedGroup = maxDigits === 2
    ? ((group ?? 0) > 9 ? '9+' : group)
    : ((group ?? 0) > 99 ? '99+' : group);

  const formattedInitials = formatInitials(fullName, sizeKey);

  const avatarClasses = cx(
    'd-avatar',
    AVATAR_SIZE_MODIFIERS[size as keyof typeof AVATAR_SIZE_MODIFIERS],
    avatarClass,
    {
      'd-avatar--group': showGroup,
      'd-avatar--group-digits-2': showGroup && String(formattedGroup).length === 2,
      'd-avatar--group-digits-3': showGroup && String(formattedGroup).length >= 3,
      'd-avatar--clickable': interactive,
      'd-avatar--presence': presence && !showGroup,
      'd-avatar--icon-only': iconOnly,
      'd-avatar--deactivated': deactivated,
    },
    className,
  );

  // Compute inline styles for fallback color in browsers that don't support oklch()
  const avatarStyles = hexFallback && !isIconType && computedFamily && computedVariant !== undefined
    ? { '--avatar-color-background': computeAvatarHex(computedFamily, computedVariant, anchorHue) } as CSSProperties
    : undefined;
  const rootStyle = avatarStyles || style ? { ...avatarStyles, ...style } : undefined;

  const presenceSizeClass = AVATAR_PRESENCE_SIZE_MODIFIERS[size as keyof typeof AVATAR_PRESENCE_SIZE_MODIFIERS];

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (!interactive) return;
    onClick?.(event);
  };

  const Root: ElementType = interactive ? 'button' : 'div';

  return (
    <Root
      id={id ?? generatedId}
      data-avatar-family={!iconOnly ? computedFamily : undefined}
      data-avatar-variant={!iconOnly ? computedVariant : undefined}
      data-qa="dt-avatar"
      type={interactive ? 'button' : undefined}
      {...rest}
      // TypeScript checks a variable tag's ref against both elements; the ref gets whichever one renders.
      ref={ref as Ref<HTMLDivElement & HTMLButtonElement>}
      className={avatarClasses}
      style={rootStyle}
      onClick={handleClick}
    >
      <div
        className={cx(
          canvasClass,
          'd-avatar__canvas',
          { 'd-avatar--image-loaded': imageLoadedSuccessfully },
        )}
      >
        <div className="d-avatar__canvas-inner">
          {showImage
            ? (
              <img
                className="d-avatar__image"
                data-qa="dt-avatar-image"
                src={imageSrc}
                alt={imageAlt}
                onLoad={() => setImageState({ src: imageSrc, loaded: true })}
                onError={() => setImageState({ src: imageSrc, loaded: false })}
              />
            )
            : isIconType
              ? (
                <div
                  className={cx(iconClass, AVATAR_KIND_MODIFIERS.icon)}
                  aria-label={interactive ? iconAriaLabel : ''}
                  data-qa="dt-avatar-icon"
                >
                  {icon}
                </div>
              )
              : (
                <span className={AVATAR_KIND_MODIFIERS.initials}>
                  {formattedInitials}
                </span>
              )}
        </div>
      </div>
      {(hasOverlayIcon || overlayText) && (
        <div className={cx('d-avatar__overlay', overlayClass, { 'd-avatar__overlay-icon': hasOverlayIcon })}>
          {hasOverlayIcon
            ? overlayIcon
            : <p className="d-avatar__overlay-text">{overlayText}</p>}
        </div>
      )}
      {showGroup && (
        <span
          className="d-avatar__count"
          data-qa="dt-avatar-count"
          role="img"
          aria-label={`${group} participants`}
        >
          {formattedGroup}
        </span>
      )}
      {presence && !showGroup && presenceSizeClass && (
        <DtPresence
          presence={presence}
          {...presenceProps}
          className={cx('d-avatar__presence', presenceSizeClass, presenceProps?.className)}
          data-qa="dt-presence"
        />
      )}
    </Root>
  );
}
