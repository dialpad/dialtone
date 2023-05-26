import { getMarksBetween } from '@tiptap/core';
import {
  getPhoneNumberRegex,
  linkRegex,
} from '@/common/utils';

/**
 * Get matches in a string and return the ones that pass the extra validation.
 */
export function getRegexMatches (text, regex, validator) {
  const matches = [];

  // Reset the lastIndex since the last time this was run.
  regex.lastIndex = 0;

  let match;
  while ((match = regex.exec(text))) {
    if (validator(text, match)) {
      matches.push(match);
    }
  }

  return matches;
}

/**
 * Validate the prefix of a match in a string not to contain certain characters.
 */
export function hasValidPrefix (text, match) {
  // The string match can't start with # or @ or have either preceding the match
  // as they're reserved for mentions and hashtags.
  return !['#', '@'].includes(text.charAt(match.index)) &&
    !['#', '@'].includes(text.charAt(match.index - 1));
}

/**
 * Trim punctuation characters at the a of the string, e.g. "dialpad.com!" =>
 * "dialpad.com"
 */
export function trimEndPunctiation (string) {
  const endPunctuationRegex = new RegExp(
    '(?:' +
    [
      '[!?.,:;\'"]',
      '(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)+$',
    ].join('|'),
    'g',
  );
  return string.replace(endPunctuationRegex, '');
}

/**
 * Find the word from a string at a given index. For example for "example here"
 * - indices 0-7  => "example"
 * - indices 8-12 => "here".
 * Modified from https://stackoverflow.com/a/5174867
 */
export function getWordAt (text, index) {
  // Position of the first non-whitespace character following a possible
  // whitespace when looking from the index to the left.
  const left = text.slice(0, index + 1).search(/\S+\s*$/);

  // Position of the first whitespace when looking from the index to the right.
  const right = text.slice(index).search(/\s/);

  // If the word is at the end of the string, right is -1.
  if (right < 0) {
    const word = text.slice(left);
    return {
      text: word,
      from: left,
      to: left + word.length,
    };
  }

  return {
    text: text.slice(left, right + index),
    from: left,
    to: right + index,
  };
}

/**
 * Helper to check if a word at a given index matches a regex and if true, finds
 * the previous or next word until the regex doesn't match anymore. Useful to
 * find for example the entire phone number when it is separated by whitespace.
 */
export function getWordAtUntil (text, index, direction, regex) {
  const word = getWordAt(text, index);

  // If the word doesn't match the regex we can just return it.
  if (!regex.test(word.text)) {
    return word;
  }

  // Depending on the direction take one step to the left or right to find the
  // preceding or following word.
  const newIndex = direction === 'left' ? word.from - 1 : word.to + 1;

  // Prevent an infinite loop for the base cases.
  if (newIndex <= 0 || newIndex >= text.length || newIndex === index) {
    return word;
  }

  // Run the preceding/following word through the validator until we meet the
  // string boundaries or find a word that doesn't match the regex.
  return getWordAtUntil(text, newIndex, direction, regex);
}

/**
 * Remove marks from a range.
 */
export function removeMarks (range, doc, tr, type) {
  const from = range.from - 1;
  const to = range.to + 1;
  const marksInRange = getMarksBetween(from, to, doc);

  for (const mark of marksInRange) {
    if (mark.mark.type !== type) {
      continue;
    }

    tr.removeMark(mark.from, mark.to, type);
  }
}

// Regex to match partial phone numbers.
const partialPhoneNumberRegex = getPhoneNumberRegex(1, 15);

/**
 * Find matches from text and add marks on them.
 */
export function addMarks (text, pos, from, to, tr, type) {
  if (!text) {
    return;
  }

  // from = start index for the change
  // pos  = start index of the node
  // 1    = range uses 1-based indexing, deduct 1
  let rangeFrom = from - pos - 1;

  // If the change spans multiple nodes/paragraphs the start index can become
  // negative, so default to 0.
  rangeFrom = rangeFrom < 0 ? 0 : rangeFrom;

  // to  = end index of the change
  // pos = start index of the node
  const rangeTo = to - pos;

  // Get the first word in the range.
  const firstWordInRange = getWordAtUntil(
    text,
    rangeFrom,
    'left',
    partialPhoneNumberRegex,
  );

  // Get the last word in the range.
  const lastWordInRange = getWordAtUntil(
    text,
    rangeTo,
    'right',
    partialPhoneNumberRegex,
  );

  // Create a substring that consists of whole words only.
  const wordsInRange = text.slice(firstWordInRange.from, lastWordInRange.to);

  // Find all valid matches within the substring.
  const matches = getRegexMatches(wordsInRange, linkRegex, hasValidPrefix);

  // Loop through the matches and add marks.
  matches.forEach(match => {
    // Trim any punctuation characters at the end of the match.
    const word = trimEndPunctiation(match[0]);

    // pos                   = start index of the node
    // firstWordInRange.from = start index of the first word in range
    // match.index           = index of the regex match
    // 1                     = addMark() uses 1-based indexing, add 1
    const from = pos + firstWordInRange.from + match.index + 1;

    // Sum up the from index and the match length to get the end index.
    const to = from + word.length;

    tr.addMark(from, to, type.create());
  });
}
