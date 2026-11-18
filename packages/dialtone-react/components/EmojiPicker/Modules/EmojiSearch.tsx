import { useEffect, useImperativeHandle, useRef, type KeyboardEvent, type Ref } from 'react';
import { DtIconClose, DtIconSearch } from '../../../icons';
import { DtButton } from '../../Button';
import { DtInput } from '../../Input';

export interface EmojiSearchHandle {
  focusSearchInput: () => void;
}

export interface EmojiSearchProps {
  searchPlaceholderLabel: string;
  /** The search query (Vue's modelValue). */
  value?: string;
  onValueChange?: (value: string) => void;
  onFocusEmojiSelector?: () => void;
  onFocusTabset?: () => void;
  onSelectFirstEmoji?: () => void;
  /** Keydown on the root, as Vue's fallthrough `@keydown` listener. */
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  ref?: Ref<EmojiSearchHandle>;
}

export function EmojiSearch ({
  searchPlaceholderLabel,
  value = '',
  onValueChange,
  onFocusEmojiSelector,
  onFocusTabset,
  onSelectFirstEmoji,
  onKeyDown,
  ref,
}: EmojiSearchProps) {
  const searchInput = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  function focusSearchInput () {
    searchInput.current?.focus();
  }

  function clearSearch () {
    onValueChange?.('');
    focusSearchInput();
  }

  // Vue's onMounted(): the search input takes focus.
  useEffect(() => {
    focusSearchInput();
  }, []);

  useImperativeHandle(ref, () => ({ focusSearchInput }), []);

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch (event.key) {
      case 'ArrowUp':
        onFocusTabset?.();
        break;
      case 'ArrowDown':
        event.preventDefault();
        onFocusEmojiSelector?.();
        break;
      case 'Enter':
        onSelectFirstEmoji?.();
        break;
    }
  };

  return (
    <div
      className="d-emoji-picker__search d-emoji-picker__alignment"
      data-qa="dt-emoji-picker-search"
      onKeyDown={onKeyDown}
    >
      <DtInput
        id="searchInput"
        ref={searchInput}
        placeholder={searchPlaceholderLabel}
        value={value}
        onValueChange={next => onValueChange?.(next as string)}
        onKeyDown={handleInputKeyDown}
        startIcon={<DtIconSearch size="200" />}
        endIcon={value.length > 0
          ? (
            <DtButton
              importance="clear"
              size={100}
              className="d-emoji-picker__search-x-button"
              circle
              kind="muted"
              onClick={clearSearch}
              icon={<DtIconClose size="200" />}
            />
          )
          : undefined}
      />
    </div>
  );
}
