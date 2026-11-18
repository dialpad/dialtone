import { useImperativeHandle, useLayoutEffect, useRef, useState, type KeyboardEvent, type Ref } from 'react';
import { DtTooltip } from '../../Tooltip';
import { CDN_URL, EMOJI_PICKER_SKIN_TONE_MODIFIERS, type EmojiPickerSkinTone } from '../EmojiPickerConstants';

export interface EmojiSkinSelectorHandle {
  focusSkinSelector: () => void;
}

export interface EmojiSkinSelectorProps {
  /** The skin tone to apply to the emoji list */
  skinTone: EmojiPickerSkinTone;
  isHovering?: boolean;
  skinSelectorButtonTooltipLabel: string;
  /** The skin tone that was selected */
  onSkinTone?: (skinTone: EmojiPickerSkinTone) => void;
  onFocusTabset?: () => void;
  onFocusLastEmoji?: () => void;
  /** Keydown on the root, as Vue's fallthrough `@keydown` listener. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  ref?: Ref<EmojiSkinSelectorHandle>;
}

interface Skin {
  name: string;
  unicode_output: string;
  skinTone: EmojiPickerSkinTone;
  skinCode: string;
}

const skinList: readonly Skin[] = [
  {
    name: ':wave_tone1:',
    unicode_output: '1f44b-1f3fb',
    skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.LIGHT,
    skinCode: '_tone1',
  },
  {
    name: ':wave_tone2:',
    unicode_output: '1f44b-1f3fc',
    skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.MEDIUM_LIGHT,
    skinCode: '_tone2',
  },
  {
    name: ':wave_tone3:',
    unicode_output: '1f44b-1f3fd',
    skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.MEDIUM,
    skinCode: '_tone3',
  },
  {
    name: ':wave_tone4:',
    unicode_output: '1f44b-1f3fe',
    skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.MEDIUM_DARK,
    skinCode: '_tone4',
  },
  {
    name: ':wave_tone5:',
    unicode_output: '1f44b-1f3ff',
    skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.DARK,
    skinCode: '_tone5',
  },
  {
    name: ':wave:',
    unicode_output: '1f44b',
    skinTone: EMOJI_PICKER_SKIN_TONE_MODIFIERS.DEFAULT,
    skinCode: '',
  },
];

const findSkin = (skinTone: string) => skinList.find((skin) => skin.skinTone === skinTone);

export function EmojiSkinSelector ({
  skinTone,
  isHovering = false,
  skinSelectorButtonTooltipLabel,
  onSkinTone,
  onFocusTabset,
  onFocusLastEmoji,
  onKeyDown,
  ref,
}: EmojiSkinSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const skinSelectorRef = useRef<HTMLButtonElement>(null);
  const skinsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // What Vue focuses on nextTick, once the list's visibility has been committed.
  const pendingFocus = useRef<'toggle' | 'firstSkin' | null>(null);

  // Vue's watchEffect: hovering over the emoji list closes the skin selector.
  const [prevIsHovering, setPrevIsHovering] = useState(isHovering);
  if (isHovering !== prevIsHovering) {
    setPrevIsHovering(isHovering);
    if (isHovering) setIsOpen(false);
  }

  // It will initially display skinTone. If a new skin tone is selected, it will display that until skinTone changes.
  const skinPassedIn = findSkin(skinTone);
  const [skinSelected, setSkinSelected] = useState(skinPassedIn);
  const [prevSkinPassedIn, setPrevSkinPassedIn] = useState(skinPassedIn);
  if (skinPassedIn !== prevSkinPassedIn) {
    setPrevSkinPassedIn(skinPassedIn);
    if (skinPassedIn) setSkinSelected(skinPassedIn);
  }

  function focusSkinSelector () {
    skinSelectorRef.current?.focus();
  }

  useImperativeHandle(ref, () => ({ focusSkinSelector }), []);

  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === 'toggle') focusSkinSelector();
    else skinsRef.current[0]?.focus();
  });

  function selectSkin (skin: Skin) {
    setSkinSelected(skin);
    setIsOpen(false);
    onSkinTone?.(skin.skinTone);
    pendingFocus.current = 'toggle';
  }

  function toggleSkinList () {
    setIsOpen(open => !open);
    pendingFocus.current = 'firstSkin';
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, skin?: Skin, index?: number) => {
    event.preventDefault();

    if (event.key === 'ArrowLeft' && index !== undefined) {
      if (index === 0) skinsRef.current[skinsRef.current.length - 1]?.focus();
      skinsRef.current[index - 1]?.focus();
    }

    if (event.key === 'ArrowRight' && index !== undefined) {
      skinsRef.current[index + 1]?.focus();
    }

    if (event.key === 'Enter') {
      if (skin) {
        selectSkin(skin);
      } else {
        toggleSkinList();
      }
    }

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        onFocusLastEmoji?.();
      } else {
        onFocusTabset?.();
      }
    }
  };

  return (
    <div
      data-qa="skin-selector"
      onKeyDown={onKeyDown}
    >
      <div
        className="d-emoji-picker__skin-list"
        data-qa="dt-emoji-picker-skin-list"
        style={isOpen ? undefined : { display: 'none' }}
      >
        {skinList.map((skin, index) => (
          <button
            key={skin.name}
            ref={(el) => { skinsRef.current[index] = el; }}
            data-qa="dt-emoji-picker-skin-option"
            className={skinSelected?.skinCode === skin.skinCode ? 'selected' : ''}
            onKeyDown={event => handleKeyDown(event, skin, index)}
            onClick={() => selectSkin(skin)}
          >
            <img
              className="d-icon d-icon--size-500"
              alt={skin.name}
              aria-label={skin.name}
              title={skin.name}
              src={`${CDN_URL + skin.unicode_output}.png`}
            />
          </button>
        ))}
      </div>
      <div
        className="d-emoji-picker__skin-selected"
        style={isOpen ? { display: 'none' } : undefined}
      >
        <DtTooltip
          placement="top-end"
          anchor={(
            <button
              ref={skinSelectorRef}
              data-qa="dt-emoji-picker-skin-toggle"
              aria-label={skinSelectorButtonTooltipLabel}
              tabIndex={-1}
              onClick={toggleSkinList}
              onKeyDown={event => handleKeyDown(event)}
            >
              <img
                className="d-icon d-icon--size-500"
                alt={skinSelected?.name}
                aria-label={skinSelected?.name}
                title={skinSelected?.name}
                src={`${CDN_URL + skinSelected?.unicode_output}.png`}
                data-qa="dt-emoji-picker-skin-image"
              />
            </button>
          )}
        >
          {skinSelectorButtonTooltipLabel}
        </DtTooltip>
      </div>
    </div>
  );
}
