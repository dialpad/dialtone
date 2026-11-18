import { useRef, useState, type HTMLAttributes, type KeyboardEvent, type Ref } from 'react';
import { cx } from '../../common/cx';
import { useI18n } from '../../common/localization';
import { DtButton } from '../Button';
import type { EmojiPickerEmoji, EmojiPickerSelectedEmoji, EmojiPickerSkinTone } from './EmojiPickerConstants';
import { EmojiDescription } from './Modules/EmojiDescription';
import { EmojiSearch, type EmojiSearchHandle } from './Modules/EmojiSearch';
import { EmojiSelector, type EmojiSelectorHandle, type SelectedTabset } from './Modules/EmojiSelector';
import { EmojiSkinSelector, type EmojiSkinSelectorHandle } from './Modules/EmojiSkinSelector';
import { EmojiTabset, type EmojiTabsetHandle } from './Modules/EmojiTabset';

interface DtEmojiPickerOwnProps {
  /**
   * The array with recently used emoji object
   * This list is necessary to fill the recently used tab
   */
  recentlyUsedEmojis?: readonly EmojiPickerEmoji[];

  /**
   * The array with custom emojis object
   * This list is necessary to fill the custom tab
   */
  customEmojis?: readonly EmojiPickerEmoji[];

  /**
   * The skin tone to show the emojis
   * This prop gives the possibility to use the skin tone selected by the user previously
   * @values 'Default', 'Light', 'MediumLight', 'Medium', 'MediumDark', 'Dark'
   */
  skinTone?: EmojiPickerSkinTone;

  /**
   * Sets the search query that filters emojis. As in Vue, the picker follows changes to it; its value on mount
   * isn't applied.
   */
  searchQuery?: string;

  /**
   * Shows the search input
   * @values true, false
   */
  showSearch?: boolean;

  /**
   * Shows the add emoji button in the footer when no emoji is highlighted
   * @values true, false
   */
  showAddEmojiButton?: boolean;

  /**
   * It will emit the selected emoji: with `shift_key` when clicked or chosen with Enter in the list, or the
   * highlighted emoji (null when none) when Enter is pressed in the search input.
   */
  onSelectedEmoji?: (emoji: EmojiPickerSelectedEmoji | EmojiPickerEmoji | null) => void;

  /** Emitted when the user reach bottom scroll */
  onScrollBottomReached?: () => void;

  /** It will emit the selected skin tone */
  onSkinTone?: (skinTone: EmojiPickerSkinTone) => void;

  /** Since the keyboard events are encapsulated, we emit this event to close the picker */
  onClose?: () => void;

  /** Emitted when the user clicks on the add emoji button */
  onAddEmoji?: () => void;

  /** The root `<div>`. */
  ref?: Ref<HTMLDivElement>;
}

/** Other attributes go on the root, as Vue's `$attrs` do. */
export type DtEmojiPickerProps = DtEmojiPickerOwnProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof DtEmojiPickerOwnProps>;

/**
 * The emoji picker lets users browse, search and select emojis, by category, with a skin tone.
 * @see https://dialtone.dialpad.com/components/emoji-picker.html
 */
export function DtEmojiPicker ({
  recentlyUsedEmojis = [],
  customEmojis,
  skinTone = 'Default',
  searchQuery = '',
  showSearch = true,
  showAddEmojiButton = false,
  onSelectedEmoji,
  onScrollBottomReached,
  onSkinTone,
  onClose,
  onAddEmoji,
  className,
  ref,
  ...attrs
}: DtEmojiPickerProps) {
  const tabsetRef = useRef<EmojiTabsetHandle>(null);
  const searchInputRef = useRef<EmojiSearchHandle>(null);
  const emojiSelectorRef = useRef<EmojiSelectorHandle>(null);
  const skinSelectorRef = useRef<EmojiSkinSelectorHandle>(null);

  // Vue starts from `props.searchQuery.value`, which is undefined for a string, so the query starts empty and only
  // later changes of searchQuery reach it.
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setInternalSearchQuery(searchQuery);
  }

  const [highlightedEmoji, setHighlightedEmoji] = useState<EmojiPickerEmoji | null>(null);
  const [selectedTabset, setSelectedTabset] = useState<SelectedTabset>({});
  const [scrollIntoTab, setScrollIntoTab] = useState(0);

  const showRecentlyUsedTab = recentlyUsedEmojis.length > 0;
  const showCustomEmojisTab = (customEmojis?.length ?? 0) > 0;

  const i18n = useI18n();

  const tabSetLabels = [
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_RECENTLY_USED_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_SMILEYS_AND_PEOPLE_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_NATURE_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_FOOD_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_ACTIVITY_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_TRAVEL_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_OBJECTS_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_SYMBOLS_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_FLAGS_LABEL'),
    i18n.$t('DIALTONE_EMOJI_PICKER_TABSET_CUSTOM_LABEL'),
  ];

  const searchPlaceholderLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_PLACEHOLDER_LABEL');
  const searchResultsLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_RESULTS_LABEL');
  const searchNoResultsLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SEARCH_NO_RESULTS_LABEL');
  const skinSelectorButtonTooltipLabel = i18n.$t('DIALTONE_EMOJI_PICKER_SKIN_SELECTOR_BUTTON_TOOLTIP_LABEL');
  const addEmojiLabel = i18n.$t('DIALTONE_EMOJI_PICKER_ADD_EMOJI_LABEL');

  /**
   * Handle the selected tabset event: a new object each time, so the selector scrolls even to the tab it last
   * scrolled to.
   */
  function scrollToSelectedTabset (tabId: number) {
    setInternalSearchQuery('');
    setSelectedTabset(previous => ({ ...previous, tabId }));
  }

  const handleEscape = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') onClose?.();
  };

  const focusSkinSelector = () => skinSelectorRef.current?.focusSkinSelector();

  return (
    <div
      className={cx('d-emoji-picker', className)}
      data-qa="dt-emoji-picker"
      {...attrs}
      ref={ref}
    >
      <div
        className="d-emoji-picker--header"
        data-qa="dt-emoji-picker-header"
      >
        <EmojiTabset
          ref={tabsetRef}
          emojiFilter={internalSearchQuery}
          showCustomEmojisTab={showCustomEmojisTab}
          showRecentlyUsedTab={showRecentlyUsedTab}
          scrollIntoTab={scrollIntoTab}
          tabSetLabels={tabSetLabels}
          onFocusSkinSelector={focusSkinSelector}
          onFocusSearchInput={() => (showSearch
            ? searchInputRef.current?.focusSearchInput()
            : emojiSelectorRef.current?.focusEmojiSelector())}
          onSelectedTabset={scrollToSelectedTabset}
          onKeyDown={handleEscape}
        />
      </div>
      <div
        className="d-emoji-picker--body"
        data-qa="dt-emoji-picker-body"
      >
        {showSearch && (
          <EmojiSearch
            ref={searchInputRef}
            value={internalSearchQuery}
            onValueChange={setInternalSearchQuery}
            searchPlaceholderLabel={searchPlaceholderLabel}
            onSelectFirstEmoji={() => onSelectedEmoji?.(highlightedEmoji)}
            onFocusTabset={() => tabsetRef.current?.focusTabset()}
            onFocusEmojiSelector={() => emojiSelectorRef.current?.focusEmojiSelector()}
            onKeyDown={handleEscape}
          />
        )}
        <EmojiSelector
          ref={emojiSelectorRef}
          emojiFilter={internalSearchQuery}
          skinTone={skinTone}
          tabsetLabels={tabSetLabels}
          searchResultsLabel={searchResultsLabel}
          searchNoResultsLabel={searchNoResultsLabel}
          recentlyUsedEmojis={recentlyUsedEmojis}
          customEmojis={customEmojis}
          selectedTabset={selectedTabset}
          onScrollIntoTab={setScrollIntoTab}
          onHighlightedEmoji={setHighlightedEmoji}
          onSelectedEmoji={emoji => onSelectedEmoji?.(emoji)}
          onFocusSkinSelector={focusSkinSelector}
          onFocusSearchInput={() => (showSearch
            ? searchInputRef.current?.focusSearchInput()
            : tabsetRef.current?.focusTabset())}
          onKeyDown={handleEscape}
          onScrollBottomReached={() => onScrollBottomReached?.()}
        />
      </div>
      <div
        className="d-emoji-picker--footer"
        data-qa="dt-emoji-picker-footer"
      >
        {showAddEmojiButton && !highlightedEmoji && (
          <DtButton
            importance="outlined"
            aria-label={addEmojiLabel}
            className="d-emoji-picker__add-emoji"
            onClick={() => onAddEmoji?.()}
          >
            {addEmojiLabel}
          </DtButton>
        )}
        <EmojiDescription emoji={highlightedEmoji} />
        <EmojiSkinSelector
          ref={skinSelectorRef}
          isHovering={!!highlightedEmoji}
          skinSelectorButtonTooltipLabel={skinSelectorButtonTooltipLabel}
          skinTone={skinTone}
          onSkinTone={skin => onSkinTone?.(skin)}
          onFocusTabset={() => tabsetRef.current?.focusTabset()}
          onFocusLastEmoji={() => emojiSelectorRef.current?.focusLastEmoji()}
          onKeyDown={handleEscape}
        />
      </div>
    </div>
  );
}
