import type { ComponentPropsWithRef, ComponentType } from 'react';
import { cx } from '../../common/cx';
import {
  DtIconArrowDown,
  DtIconArrowLeft,
  DtIconArrowRight,
  DtIconArrowUp,
  DtIconCommand,
  DtIconLayoutGrid,
  DtIconOption,
  DtIconPlus,
  type DtIconProps,
} from '../../icons';
import { DtText } from '../Text';

const SHORTCUTS_ICON_ALIASES: Record<string, ComponentType<DtIconProps>> = {
  '{win}': DtIconLayoutGrid,
  '{arrow-right}': DtIconArrowRight,
  '{arrow-left}': DtIconArrowLeft,
  '{arrow-up}': DtIconArrowUp,
  '{arrow-down}': DtIconArrowDown,
  '{cmd}': DtIconCommand,
  '{opt}': DtIconOption,
};

const ICONS: Record<string, ComponentType<DtIconProps>> = {
  ...SHORTCUTS_ICON_ALIASES,
  '{plus}': DtIconPlus,
};

// Mapping of icon aliases to readable text for accessibility
const ICON_ALIAS_TO_TEXT: Record<string, string> = {
  '{cmd}': 'Command',
  '{opt}': 'Option',
  '{win}': 'Windows',
  '{arrow-right}': 'Right Arrow',
  '{arrow-left}': 'Left Arrow',
  '{arrow-up}': 'Up Arrow',
  '{arrow-down}': 'Down Arrow',
  '{plus}': 'plus',
};

// Mapping of common key abbreviations to full names for accessibility
const KEY_ABBREVIATIONS: Record<string, string> = {
  ctrl: 'Control',
  alt: 'Alt',
  esc: 'Escape',
  del: 'Delete',
  ins: 'Insert',
  pgup: 'Page Up',
  pgdn: 'Page Down',
  num: 'Number',
  caps: 'Caps Lock',
};

// The tokens aren't escaped, as in Vue: `{` that doesn't start a quantifier is a literal.
// The regexp splits on any icon alias and keeps it, case-insensitively:
// '{win} + D K + {win}' gives ['{win}', ' ', '{plus}', ' D K ', '{plus}', ' ', '{win}'].
const ALIAS_SPLIT_REGEX = new RegExp(`(${Object.keys(ICONS).join('|')})`, 'gi');

// Splits any icon based aliases into their own array items.
function splitShortcut (shortcut: string): string[] {
  return shortcut.replace(/\+/gi, '{plus}').split(ALIAS_SPLIT_REGEX).filter(Boolean);
}

// Generates accessible text for the keyboard shortcut
function generateScreenReaderText (items: string[]): string {
  return items
    .map(item => {
      const trimmedItem = item.trim();

      // Convert icon aliases to readable text
      if (Object.hasOwn(ICON_ALIAS_TO_TEXT, trimmedItem)) {
        return ICON_ALIAS_TO_TEXT[trimmedItem];
      }

      // Convert key abbreviations to full names (case-insensitive)
      const lowerItem = trimmedItem.toLowerCase();
      if (Object.hasOwn(KEY_ABBREVIATIONS, lowerItem)) {
        return KEY_ABBREVIATIONS[lowerItem];
      }

      // Return the key as-is if it's not an alias or abbreviation
      return trimmedItem;
    })
    .filter(item => item) // Remove empty strings
    .join(' ');
}

export interface DtKeyboardShortcutProps extends ComponentPropsWithRef<'kbd'> {
  /**
   * If true, applies inverted styles.
   * @values true, false
   * @deprecated Use useModeRegion instead.
   */
  inverted?: boolean;

  /**
   * Include any of these tokens in your string to render the corresponding symbol:
   * {cmd} {opt} {win} {arrow-right} {arrow-left} {arrow-up} {arrow-down}
   */
  shortcut: string;

  /**
   * Optional text to override the auto-generated accessible text for assistive technology.
   * If not provided, accessible text will be automatically generated from the shortcut.
   */
  screenReaderText?: string | null;
}

/**
 * This component displays a visual representation of a keyboard shortcut to the user.
 * @see https://dialtone.dialpad.com/components/keyboard_shortcut.html
 */
export function DtKeyboardShortcut ({
  inverted = false,
  shortcut,
  screenReaderText = null,
  className,
  ...rest
}: DtKeyboardShortcutProps) {
  const items = splitShortcut(shortcut);

  return (
    <kbd
      data-qa="dt-keyboard-shortcut"
      {...rest}
      className={cx('d-keyboard-shortcut', { 'd-keyboard-shortcut--inverted': inverted }, className)}
    >
      <span className="d-keyboard-shortcut--sr-only" data-qa="dt-keyboard-shortcut-sr-text">
        {screenReaderText || generateScreenReaderText(items)}
      </span>
      {items.map((item, i) => {
        const Icon = Object.hasOwn(ICONS, item) ? ICONS[item] : undefined;
        if (Icon) {
          return (
            <Icon
              key={`icon-${i}-${item}`}
              size="100"
              aria-hidden="true"
              className={cx('d-keyboard-shortcut__icon', { 'd-keyboard-shortcut__icon--inverted': inverted })}
            />
          );
        }
        if (item.trim()) {
          return (
            <DtText
              key={`text-${i}-${item}`}
              kind="body"
              size={200}
              numeric
              density={400}
              tone="tertiary"
              aria-hidden="true"
              className={cx('d-keyboard-shortcut__item', { 'd-keyboard-shortcut__item--inverted': inverted })}
            >
              {/* The shortcut is rendered as HTML, as in Vue's v-html. */}
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </DtText>
          );
        }
        return null;
      })}
    </kbd>
  );
}
