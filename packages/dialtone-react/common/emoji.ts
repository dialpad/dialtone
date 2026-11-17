import { emojiPattern } from 'regex-combined-emojis';
import emojiJsonLocal from 'emoji-toolkit/emoji_strategy.json' with { type: 'json' };

/** An entry of the emoji data: JoyPixels' fields, plus the ones a custom emoji adds. */
export interface EmojiData {
  name: string;
  shortname: string;
  shortname_alternates: string[];
  unicode_output?: string;
  /** The emoji's key in the data, set when it is looked up. */
  key?: string | null;
  custom?: boolean;
  date_added?: number;
  image?: string;
  [property: string]: unknown;
}

type EmojiJson = Record<string, EmojiData>;

export const emojiRegex = new RegExp(emojiPattern, 'g');
export const emojiVersion = '9.0';
export const defaultEmojiAssetUrl = 'https://cdn.jsdelivr.net/joypixels/assets/' + emojiVersion + '/png/unicode/32/';

// These are `let` exports, live bindings that the setters below reassign, as in Vue.
export let customEmojiAssetUrl: string | null = null;

// Used for emoji 16px and smaller
export let emojiImageUrlSmall = defaultEmojiAssetUrl;
export let emojiFileExtensionSmall = '.png';

// Used for emoji larger than 16px
export let emojiImageUrlLarge = defaultEmojiAssetUrl;
export let emojiFileExtensionLarge = '.png';

export const emojiJson = emojiJsonLocal as unknown as EmojiJson;

export const emojiShortCodeRegex = /(^| |(?<=:))(:\w+:)/g;

export function getEmojiData (): EmojiJson {
  return emojiJson;
}

export function setEmojiAssetUrlSmall (url: string, fileExtension = '.png') {
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  emojiImageUrlSmall = url;
  emojiFileExtensionSmall = fileExtension;
}

export function setEmojiAssetUrlLarge (url: string, fileExtension = '.svg') {
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  emojiImageUrlLarge = url;
  emojiFileExtensionLarge = fileExtension;
}

export function setCustomEmojiUrl (url: string | null) {
  customEmojiAssetUrl = url;
}

export function setCustomEmojiJson (json: unknown) {
  validateCustomEmojiJson(json);
}

/**
 * Validate custom emoji json
 */
export function validateCustomEmojiJson (json: unknown) {
  const customEmojiProps = [
    'custom',
    'date_added',
    'image',
  ];
  const customEmojiRequiredProps = [
    'date_added',
    'image',
    'unicode_output',
    'shortname',
    'shortname_alternates',
    'custom',
    'name',
  ];

  /**
   * Update single emoji properties.
   * If the property exists in emojiData, it'll add the values if the property is an array, otherwise will overwrite.
   * If not exists, will add the property to the emojiData object.
   */
  const _updateNativeEmojiData = (emojiData: EmojiData, propName: string, propValue: unknown) => {
    // Custom emoji json is external input: `__proto__` would set a prototype rather than a property.
    if (propName === '__proto__') return;

    if (!Object.hasOwn(emojiData, propName)) {
      if (!customEmojiProps.includes(propName)) {
        return;
      }

      // new property to add
      emojiData[propName] = propValue;
    } else {
      if (Array.isArray(emojiData[propName])) {
        emojiData[propName] = (emojiData[propName] as unknown[]).concat(propValue);
      } else {
        emojiData[propName] = propValue;
      }
    }
  };

  Object.entries(json as Record<string, Record<string, unknown>>).forEach((item) => {
    const [customEmojiKey, customEmojiValue] = item;

    // Own keys only, so inherited members (`constructor`, `toString`) aren't taken for native emoji, and
    // `__proto__` never reaches the assignments below, where it would replace the data's prototype.
    if (customEmojiKey === '__proto__') {
      console.error('The following custom emoji key is not allowed:', customEmojiKey);
      return;
    }

    if (Object.hasOwn(emojiJson, customEmojiKey)) {
      // custom emoji exists in emoji json which means to update some data in the native emoji
      const emojiData = emojiJson[customEmojiKey];

      for (const customEmojiPropertyName in customEmojiValue) {
        const customEmojiPropertyValue = customEmojiValue[customEmojiPropertyName];

        _updateNativeEmojiData(emojiData, customEmojiPropertyName, customEmojiPropertyValue);
      }
    } else {
      // new custom emoji
      const _validateRequiredProps = () =>
        customEmojiRequiredProps.every((val) => {
          return customEmojiValue[val] !== undefined;
        });

      if (_validateRequiredProps()) {
        emojiJson[customEmojiKey] = customEmojiValue as unknown as EmojiData;
      } else {
        console.error(
          'The following custom emoji doesn\'t contain the required properties:',
          customEmojiValue,
        );
      }
    }
  });
}

// recursively searches the emoji data object containing data for all emojis
// and returns the object with the specified shortcode.
export function shortcodeToEmojiData (shortcode: string): EmojiData | undefined {
  let reference: EmojiData | undefined;

  function f (o: unknown, key: string | null): true | undefined {
    if (!o || typeof o !== 'object') {
      return;
    }
    const data = o as EmojiData;
    if ('shortname' in data) {
      if (data.shortname === shortcode || data.shortname_alternates.includes(shortcode)) {
        data.key = key;
        reference = data;
        return true;
      }
    }
    Object.keys(o).some(function (k) {
      return f((o as Record<string, unknown>)[k], k);
    });
  }

  f(getEmojiData(), null);
  return reference;
}

export function getEmojiShortCode (emoji: string): string | undefined {
  if (emoji.startsWith(':')) return emoji;

  const unicode = unicodeToString(emoji);
  return emojiJson[unicode]?.shortname;
}

// Takes in an emoji unicode character(s) and converts it to an emoji string in the format the emoji data object expects
// as a key. There can be multiple unicode characters in an emoji to denote the emoji itself, skin tone, gender
// and such. Note that this function does NOT return variation selectors (fe0f) or zero width joiners (200d), as these
// are not included as part of the key in the emoji.json.
//
// Example:
// return value for smile emoji (no skin tone): 1f600
// return value for left facing fist (light skin tone): 1f91b-1f3fb
export function unicodeToString (emoji: string): string {
  let key = '';
  for (const codePoint of emoji) {
    const codepoint = codePoint.codePointAt(0)!.toString(16).padStart(4, '0');

    // skip 200d and fe0f as these are not included in emoji_strategy.json keys
    if (['200d', 'fe0f'].includes(codepoint)) continue;
    if (key !== '') { key = key + '-'; }
    key = key + codepoint;
  }
  return key;
}

// Takes in unicode in string form ex: '1f91b-1f3fb' and converts it to an actual unicode character.
export function stringToUnicode (str: string): string {
  const uChars = str.split('-');
  let result = '';
  uChars.forEach((uChar) => {
    result = result + String.fromCodePoint(parseInt(uChar, 16));
  });
  return result;
}

// Takes in a code (which could be unicode or shortcode) and returns the emoji data for it.
export function codeToEmojiData (code: string): EmojiData | undefined {
  code = code?.trim();
  if (code.startsWith(':') && code.endsWith(':')) {
    return shortcodeToEmojiData(code);
  } else {
    const unicodeString = unicodeToString(code);
    const result = emojiJson[unicodeString];
    if (result) result.key = unicodeString;
    return result;
  }
}

// Finds every shortcode in slot text
// filters only the existing codes in emojiJson
// removes duplicates.
export function findShortCodes (textContent: string): Set<string> {
  const shortcodes = (
    textContent.match(emojiShortCodeRegex) || []
  ).map(code => code.trim());
  return filterValidShortCodes(shortcodes);
}

export function filterValidShortCodes (shortcodes: string[] | null | undefined): Set<string> {
  const filtered = shortcodes ? shortcodes.filter(code => shortcodeToEmojiData(code)) : [];
  return new Set(filtered);
}

// Finds every emoji in slot text
// removes duplicates
export function findEmojis (textContent: string): Set<string> {
  const matches = [...textContent.matchAll(emojiRegex)];
  const emojis = matches.length ? matches.map(match => match[0]) : [];
  return new Set(emojis);
}
