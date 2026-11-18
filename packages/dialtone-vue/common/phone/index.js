import { parsePhoneNumberFromString, getCountryCallingCode, isSupportedCountry } from 'libphonenumber-js/min';

/**
 * Formats a phone number for display, following the Dialtone content guide:
 * https://dialtone.dialpad.com/guides/content/grammar-and-mechanics/#numbers
 *
 * Input may use spaces, dots, dashes and parentheses, with an extension after `x`, `ext.` or `#`.
 * It needs a country code (`+44 20 7946 0958`) unless `defaultCountry` is set; then national input
 * (`(415) 555-0123`) and that country's international prefix (`011 44 …` in the US) work too.
 * A number that fails a basic check is returned unchanged: the wrong number of digits, an unused area
 * code such as 555, national input without `defaultCountry`, short codes like `911`, and letters
 * (`1-800-FLOWERS`). The check uses the small `libphonenumber-js/min` data, so some numbers that are
 * not real (wrong mobile prefix, not in service) still format.
 *
 * To show the viewer's own numbers without a country code, pass their country (from their account
 * or the request) as `defaultCountry`. The US and Canada share +1, so with `US` a Canadian number
 * also shows without it.
 *
 * Each country's own digit grouping is used. To keep a number on one line, put the `d-ws-nowrap`
 * class on the element.
 *
 * @example
 * formatPhoneNumber('+14155550123'); // '+1 (415) 555-0123'
 * formatPhoneNumber('+14155550123', { defaultCountry: 'US' }); // '(415) 555-0123'
 * formatPhoneNumber('+16045550123', { defaultCountry: 'US' }); // '(604) 555-0123'
 * formatPhoneNumber('+442079460958'); // '+44 20 7946 0958'
 * formatPhoneNumber('+1 415 555 0123 x55555'); // '+1 (415) 555-0123 Ext. 55555'
 *
 * @param {string} value The phone number to format
 * @param {Object} [options]
 * @param {string} [options.defaultCountry] Two-letter country code of the viewer, passed as
 * `{ defaultCountry: 'US' }`. Numbers that share its calling code show without it, and national input
 * like `415.555.0123` is read as that country's. Unknown codes are ignored.
 * @returns {string} The formatted number, the input unchanged if it fails the check above,
 * or an empty string if the input is empty or not a string
 */
export function formatPhoneNumber (value, { defaultCountry } = {}) {
  if (!value || typeof value !== 'string') return '';
  const country = _supportedCountry(defaultCountry);
  const phoneNumber = parsePhoneNumberFromString(value.trim(), { defaultCountry: country, extract: false });
  if (!phoneNumber?.isValid()) return value;

  const formatted = _formatWithoutExtension(phoneNumber, country);
  return phoneNumber.ext ? `${formatted} Ext. ${phoneNumber.ext}` : formatted;
}

function _supportedCountry (code) {
  const upper = typeof code === 'string' ? code.toUpperCase() : undefined;
  return isSupportedCountry(upper) ? upper : undefined;
}

// The content guide writes "Ext. 55555"; libphonenumber writes "ext. 55555", so it is added separately.
const _withoutExtension = { formatExtension: (number) => number };

function _formatWithoutExtension (phoneNumber, country) {
  const national = phoneNumber.formatNational(_withoutExtension);
  if (country && getCountryCallingCode(country) === phoneNumber.countryCallingCode) return national;
  // libphonenumber writes +1 numbers as "+1 800 555 1234"; the content guide wants "+1 (800) 555-1234".
  return phoneNumber.countryCallingCode === '1'
    ? `+1 ${national}`
    : phoneNumber.formatInternational(_withoutExtension);
}
