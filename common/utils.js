import {
  DEFAULT_PREFIX,
  DEFAULT_VALIDATION_MESSAGE_TYPE,
  VALIDATION_MESSAGE_TYPES,
} from './constants';
import Vue from 'vue';
import fnv from 'fnv-plus';

let UNIQUE_ID_COUNTER = 0;
let TIMER;

// selector to find focusable not hidden inputs
const FOCUSABLE_SELECTOR_NOT_HIDDEN = 'input:not([type=hidden]):not(:disabled)';
// selector to find focusable not disables elements
const FOCUSABLE_SELECTOR_NOT_DISABLED = 'select:not(:disabled),textarea:not(:disabled),button:not(:disabled)';
// // selector to find focusable not hidden and disabled elements
const FOCUSABLE_SELECTOR_NOT_HIDDEN_DISABLED = `${FOCUSABLE_SELECTOR_NOT_HIDDEN},${FOCUSABLE_SELECTOR_NOT_DISABLED}`;
// selector to find focusable elements
const FOCUSABLE_SELECTOR = `a,frame,iframe,${FOCUSABLE_SELECTOR_NOT_HIDDEN_DISABLED},*[tabindex]`;

const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout;

export function getUniqueString (prefix = DEFAULT_PREFIX) {
  return `${prefix}${UNIQUE_ID_COUNTER++}`;
}

/**
 * Returns a random element from array
 * @param array - the array to return a random element from
 * @param {string} seed - use a string to seed the randomization, so it returns the same element each time
 * based on that string.
 * @returns {*} - the random element
 */
export function getRandomElement (array, seed) {
  if (seed) {
    const hash = fnv.hash(seed);
    return array[hash.value % array.length];
  } else {
    return array[getRandomInt(array.length)];
  }
}

/**
 * Generate a random integer
 * @param {number} max - max range of integer to generate
 * @returns {number} randomly generated integer between 0 and max
 */
export function getRandomInt (max) {
  return Math.floor(Math.random() * max);
}

export function formatMessages (messages) {
  if (!messages) {
    return [];
  }

  return messages.map(message => {
    if (typeof message === 'string') {
      return {
        message,
        type: DEFAULT_VALIDATION_MESSAGE_TYPE,
      };
    }

    return message;
  });
}

export function filterFormattedMessages (formattedMessages) {
  const validationState = getValidationState(formattedMessages);

  if (!formattedMessages || !validationState) {
    return [];
  }

  return formattedMessages.filter(message => !!message.message && message.type === validationState);
}

/*
 * The priority order of message types is as flows: 'error' > 'warning' > 'success'.
 * If any message of type 'error' is present in messages, the input state is considered
 * to be 'error', then 'warning' and lastly 'success'.
 */
export function getValidationState (formattedMessages) {
  if (!formattedMessages) {
    return null;
  }

  if (hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.ERROR)) {
    return VALIDATION_MESSAGE_TYPES.ERROR;
  }
  if (hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.WARNING)) {
    return VALIDATION_MESSAGE_TYPES.WARNING;
  }
  if (hasFormattedMessageOfType(formattedMessages, VALIDATION_MESSAGE_TYPES.SUCCESS)) {
    return VALIDATION_MESSAGE_TYPES.SUCCESS;
  }

  return null;
}

export function hasFormattedMessageOfType (formattedMessages, messageType) {
  if (!formattedMessages || !messageType) {
    return false;
  }

  return formattedMessages.some(message => message?.type === messageType);
}

export function findFirstFocusableNode (element) {
  return element?.querySelector(FOCUSABLE_SELECTOR);
}

/* html-fragment component:
 * To render html without wrapping in another element as when using v-html.
 * props: html
 */
export const htmlFragment = {
  name: 'html-fragment',
  functional: true,
  props: ['html'],
  render (h, ctx) {
    return new Vue({
      // eslint-disable-next-line vue/multi-word-component-names
      name: 'Inner',
      beforeCreate () { this.$createElement = h; },
      template: `<div>${ctx.props.html}</div>`,
    }).$mount()._vnode.children;
  },
};

export const flushPromises = () => {
  return new Promise((resolve) => {
    scheduler(resolve);
  });
};

/**
 * Transform a string from kebab-case to PascalCase
 * @param string
 * @returns {string}
 */
export const kebabCaseToPascalCase = (string) => {
  return string?.toLowerCase()
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

/**
 * Transform a string from PascalCase to kebab-case
 * @param string
 * @returns {string}
 */
export const pascalCaseToKebabCase = (string) => {
  return string
    .replace(/\.?([A-Z0-9]+)/g, (x, y) => '-' + y.toLowerCase())
    .replace(/^-/, '');
};

/*
* Set's a global timer to debounce the execution of a function.
* @param { object } func - the function that is going to be called after timeout
* @param { number } [timeout=300] timeout
* */
export function debounce (func, timeout = 300) {
  clearTimeout(TIMER);
  TIMER = setTimeout(func, timeout);
}

/**
 * Checks if the element is out of the viewport
 * https://gomakethings.com/how-to-check-if-any-part-of-an-element-is-out-of-the-viewport-with-vanilla-js/
 * @param  {HTMLElement} element The element to check
 * @return {Object} A set of booleans for each side of the element
 */

export function isOutOfViewPort (element) {
  const bounding = element.getBoundingClientRect();

  const isOut = {
    top: bounding.top < 0,
    left: bounding.left < 0,
    bottom: bounding.bottom > (window.innerHeight || document.documentElement.clientHeight),
    right: bounding.right > (window.innerWidth || document.documentElement.clientWidth),
  };
  isOut.any = Object.values(isOut).some(val => val);
  isOut.all = Object.values(isOut).every(val => val);
  return isOut;
}

// match valid characters for a domain name followed by a dot, e.g. "dialpad."
const domainNameRegex = /(?:(?:[^\s!@#$%^&*()_=+[\]{}\\|;:'",.<>/?]+)\.)/;

// match valid TLDs for a hostname (outdated list from ~2017)
const tldRegerx = new RegExp(
  '(?:' +
  'com|ru|org|net|de|jp|uk|br|it|pl|fr|in|au|ir|info|nl|cn|es|cz|kr|ca|eu|ua|co|gr|' +
  'za|ro|biz|ch|se|tw|mx|vn|hu|be|tr|at|dk|tv|me|ar|sk|no|us|fi|id|cl|xyz|io|pt|by|' +
  'il|ie|nz|kz|hk|lt|cc|my|sg|club|bg|edu|рф|pk|su|top|th|hr|rs|pe|pro|si|az|lv|pw|' +
  'ae|ph|online|ng|ee|ws|ve|cat' +
  ')',
);

// match valid IPv4 addresses, e.g. "192.158.1.38"
const ipv4Regex = new RegExp(
  '(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}' +
  '(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])',
);

// match hostnames OR IPv4 addresses, e.g. "dialpad.com" or "192.158.1.38"
const hostnameOrIpRegex = new RegExp(
  '(?:' +
  [
    [
      domainNameRegex.source,
      tldRegerx.source,
    ].join('+'),
    ipv4Regex.source,
  ].join('|') +
  ')',
);

// match URL paths, e.g. "/news"
const urlPathRegex = /(?:(?:[;/][^#?<>\s]*)?)/;

// match URL queries and fragments, e.g. "?cache=1&new=true" or "#heading1"
const urlQueryOrFragmentRegex = /(?:(?:\?[^#<>\s]+)?(?:#[^<>\s]+)?)/;

// match complete hostnames or IPv4 addresses without a protocol and with optional
// URL paths, queries and fragments e.g. "dialpad.com/news?cache=1#heading1"
const urlWithoutProtocolRegex = new RegExp(
  '\\b' +
  [
    hostnameOrIpRegex.source,
    urlPathRegex.source,
    urlQueryOrFragmentRegex.source,
    '(?!\\w)',
  ].join('+'),
);

// match complete hostnames with protocols and optional URL paths, queries and fragments,
// e.g. "ws://localhost:9010" or "https://dialpad.com/news?cache=1#heading1"
const urlWithProtocolRegex = /\b[a-z\d.-]+:\/\/[^<>\s]+/;

// match email addresses with an optional "mailto:" prefix and URL queries, e.g.
// "hey@dialpad.com" or "mailto:hey@dialpad.com?subject=Hi&body=Hey%20there"
const emailAddressRegex = new RegExp(
  '(?:mailto:)?' +
  '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
  [
    hostnameOrIpRegex.source,
    urlQueryOrFragmentRegex.source,
  ].join('+') +
  '(?!\\w)',
);

/**
 * Match phone numbers, e.g. "765-8813", "(778) 765-8813" or "+17787658813".
 * @param {number} minLength
 * @param {number} maxLength
 * @returns {RegExp}
 */
export function getPhoneNumberRegex (minLength = 7, maxLength = 15) {
  return new RegExp(
    '(?:^|(?<=\\W))(?![\\s\\-])\\+?(?:[0-9()\\- \\t]' +
    `{${minLength},${maxLength}}` +
    ')(?=\\b)(?=\\W(?=\\W|$)|\\s|$)',
  );
}

const phoneNumberRegex = getPhoneNumberRegex();

// match all link types
export const linkRegex = new RegExp(
  [
    urlWithoutProtocolRegex.source,
    urlWithProtocolRegex.source,
    emailAddressRegex.source,
    phoneNumberRegex.source,
  ].join('|'),
  'gi',
);

/**
 * Check if a string is a phone number. Validates only exact matches.
 * @param {string|number} input
 * @returns {boolean}
 */
export function isPhoneNumber (input) {
  if (!input || (!['string', 'number'].includes(typeof input))) return false;
  input = input.toString();
  return phoneNumberRegex.exec(input)?.[0] === input;
}

/**
 * Check if a string is an URL. Validates only exact matches.
 * @param {string} input
 * @returns {boolean}
 */
export function isURL (input) {
  if (!input || typeof input !== 'string') return false;
  return urlWithoutProtocolRegex.exec(input)?.[0] === input ||
    urlWithProtocolRegex.exec(input)?.[0] === input;
}

/**
 * Check if a string is an email address. Validates only exact matches.
 * @param {string} input
 * @returns {boolean}
 */
export function isEmailAddress (input) {
  if (!input || typeof input !== 'string') return false;
  return emailAddressRegex.exec(input)?.[0] === input;
}

export default {
  getUniqueString,
  getRandomElement,
  getRandomInt,
  formatMessages,
  filterFormattedMessages,
  hasFormattedMessageOfType,
  getValidationState,
  htmlFragment,
  flushPromises,
  kebabCaseToPascalCase,
  debounce,
  isOutOfViewPort,
  getPhoneNumberRegex,
  linkRegex,
  isEmailAddress,
  isPhoneNumber,
  isURL,
};
