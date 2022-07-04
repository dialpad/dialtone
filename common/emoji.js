import emojiRegex from 'emoji-regex';

export const emojiVersion = '6.6';
export const defaultEmojiAssetUrl = 'https://cdn.jsdelivr.net/joypixels/assets/' + emojiVersion + '/png/unicode/32/';

// Used for emoji 16px and smaller
export let emojiImageUrlSmall = defaultEmojiAssetUrl;
export let emojiFileExtensionSmall = '.png';

// Used for emoji larger than 16px
export let emojiImageUrlLarge = defaultEmojiAssetUrl;
export let emojiFileExtensionLarge = '.png';

export let emojiJson = null;

export async function getEmojiJson () {
  if (emojiJson) return;

  emojiJson = await import('emoji-toolkit/emoji_strategy.json');
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
  f(emojiJson, null);
  return reference;
}

// Takes in an emoji unicode character(s) and converts it to an emoji string in the format the emoji data object expects
// as a key. There can be multiple unicode characters in an emoji to denote the emoji itself, skin tone, gender
// and such.
//
// Example:
// return value for smile emoji (no skin tone): 1f600
// return value for left facing fist (light skin tone): 1f91b-1f3fb
export function unicodeToString (emoji) {
  let key = '';
  for (const codePoint of emoji) {
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
export async function codeToEmojiData (code) {
  await getEmojiJson();
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
  const shortCodes = textContent.match(/:\w+:/g);
  const filtered = shortCodes ? shortCodes.filter(code => shortcodeToEmojiData(code)) : [];
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
