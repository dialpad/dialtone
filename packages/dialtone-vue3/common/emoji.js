import emojiRegex from 'emoji-regex';
import { emojisIndexed } from '@/components/emoji_picker/emojis';

export const emojiVersion = '6.6';
export const defaultEmojiAssetUrl = 'https://cdn.jsdelivr.net/joypixels/assets/' + emojiVersion + '/png/unicode/32/';
export let customEmojiAssetUrl = null;

// Used for emoji 16px and smaller
export let emojiImageUrlSmall = defaultEmojiAssetUrl;
export let emojiFileExtensionSmall = '.png';

// Used for emoji larger than 16px
export let emojiImageUrlLarge = defaultEmojiAssetUrl;
export let emojiFileExtensionLarge = '.png';

export const emojiJson = emojisIndexed;

export function getEmojiData () {
  return emojiJson;
}

export function setEmojiAssetUrlSmall (url, fileExtension = '.png') {
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  emojiImageUrlSmall = url;
  emojiFileExtensionSmall = fileExtension;
}

export function setEmojiAssetUrlLarge (url, fileExtension = '.svg') {
  if (!url.endsWith('/')) {
    url = url + '/';
  }
  emojiImageUrlLarge = url;
  emojiFileExtensionLarge = fileExtension;
}

export function setCustomEmojiUrl (url) {
  customEmojiAssetUrl = url;
}

export function setCustomEmojiJson (json) {
  validateCustomEmojiJson(json);
}

/**
 * Validate custom emoji json
 */
export function validateCustomEmojiJson (json) {
  const customEmojiProps = ['extension', 'custom'];
  const customEmojiRequiredProps = [
    'name',
    'category',
    'shortname',
    'extension',
    'custom',
  ];

  /**
   * Update single emoji properties.
   * If the property exists in emojiData, it'll add the values if the property is an array, otherwise will overwrite.
   * If not exists, will add the property to the emojiData object.
   */
  const _updateNativeEmojiData = (emojiData, propName, propValue) => {
    if (emojiData[propName] === undefined) {
      if (!customEmojiProps.includes(propName)) {
        return;
      }

      // new property to add
      emojiData[propName] = propValue;
    } else {
      if (Array.isArray(emojiData[propName])) {
        emojiData[propName] = emojiData[propName].concat(propValue);
      } else {
        emojiData[propName] = propValue;
      }
    }
  };

  Object.entries(json).forEach((item) => {
    const [customEmojiKey, customEmojiValue] = item;

    if (customEmojiKey in emojiJson) {
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
        emojiJson[customEmojiKey] = customEmojiValue;
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
export function shortcodeToEmojiData (shortcode) {
  // eslint-disable-next-line complexity
  function f (o, key) {
    if (!o || typeof o !== 'object') {
      return;
    }
    if ('shortname' in o) {
      if (o.shortname === shortcode || o.shortname_alternates.includes(shortcode)) {
        o.key = key;
        reference = o;
        return true;
      }
    }
    Object.keys(o).some(function (k) {
      return f(o[k], k);
    });
  }

  let reference;
  f(getEmojiData(), null);
  return reference;
}

// Takes in an emoji unicode character(s) and converts it to an emoji string in the format the emoji data object expects
// as a key. There can be multiple unicode characters in an emoji to denote the emoji itself, skin tone, gender
// and such. Note that this function does NOT return variation selectors (fe0f) or zero width joiners (200d), as these
// are not included as part of the key in the emoji.json.
//
// Example:
// return value for smile emoji (no skin tone): 1f600
// return value for left facing fist (light skin tone): 1f91b-1f3fb
export function unicodeToString (emoji) {
  let key = '';
  for (const codePoint of emoji) {
    const codepoint = codePoint.codePointAt(0).toString(16);

    // skip 200d and fe0f as these are not included in emoji_strategy.json keys
    if (['200d', 'fe0f'].includes(codepoint)) continue;
    if (key !== '') { key = key + '-'; }
    key = key + codePoint.codePointAt(0).toString(16);
  }
  return key;
}

// Takes in unicode in string form ex: '1f91b-1f3fb' and converts it to an actual unicode character.
export function stringToUnicode (str) {
  const uChars = str.split('-');
  let result = '';
  uChars.forEach((uChar) => {
    result = result + String.fromCodePoint(parseInt(uChar, 16));
  });
  return result;
}

// Takes in a code (which could be unicode or shortcode) and returns the emoji data for it.
export function codeToEmojiData (code) {
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
// @returns {string[]}
export function findShortCodes (textContent) {
  const shortcodes = textContent.match(/:\w+:/g);
  return filterValidShortCodes(shortcodes);
}

export function filterValidShortCodes (shortcodes) {
  const filtered = shortcodes ? shortcodes.filter(code => shortcodeToEmojiData(code)) : [];
  return new Set(filtered);
}

// Finds every emoji in slot text
// removes duplicates
// @returns {string[]}
export function findEmojis (textContent) {
  const matches = [...textContent.matchAll(emojiRegex())];
  const emojis = matches.length ? matches.map(match => match[0]) : [];
  return new Set(emojis);
}
