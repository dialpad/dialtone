// dialtone-vue's link regexes (common/utils/index.js), which the React common/utils.ts doesn't have yet. Only the
// custom link extension uses them so far; they belong in common/utils.ts once another unit needs them.

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
// e.g. "ws://localhost:9011" or "https://dialpad.com/news?cache=1#heading1"
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
 */
export function getPhoneNumberRegex (minLength = 7, maxLength = 15): RegExp {
  // Some older browser versions don't support lookbehind, so provide a RegExp
  // version without it. It fails just one test case, so IMO it's still good
  // enough to use. https://caniuse.com/js-regexp-lookbehind
  try {
    return new RegExp(
      '(?:^|(?<=\\W))' +
      '(?![\\s\\-])\\+?(?:[0-9()\\- \\t]' +
      `{${minLength},${maxLength}}` +
      ')(?=\\b)(?=\\W(?=\\W|$)|\\s|$)',
    );
  } catch {
    console.warn('This browser doesn\'t support regex lookahead/lookbehind');
  }

  return new RegExp(
    '(?![\\s\\-])\\+?(?:[0-9()\\- \\t]' +
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
