import { parsePhoneNumberFromString, getCountryCallingCode, isSupportedCountry } from 'libphonenumber-js/min';

/**
 * Formats a phone number for display, following the Dialtone content guide:
 * https://dialtone.dialpad.com/guides/content/grammar-and-mechanics/#numbers
 *
 * Invalid or partial numbers are returned unchanged. Each country's own digit grouping is used.
 * To keep a number on one line, put the `d-ws-nowrap` class on the element.
 * Use fictional numbers in the 555-0100 to 555-0199 range in examples, such as `+1 415 555 0123`.
 *
 * @example
 * formatPhoneNumber('+18005551234'); // '+1 (800) 555-1234'
 * formatPhoneNumber('+14155551234', { defaultCountry: 'US' }); // '(415) 555-1234'
 * formatPhoneNumber('+442079460958'); // '+44 20 7946 0958'
 * formatPhoneNumber('+1 415 555 1234 x55555'); // '+1 (415) 555-1234 Ext. 55555'
 *
 * @param {string} value The phone number to format
 * @param {Object} [options]
 * @param {string} [options.defaultCountry] ISO 3166-1 alpha-2 country of the viewer. Numbers from this
 * country show without the country code, and national input like `415.555.1234` is read as that country's.
 * @returns {string} The formatted number, or the input unchanged if it is not a valid number
 */
export function formatPhoneNumber (value, { defaultCountry } = {}) {
  if (!value || typeof value !== 'string') return '';
  const country = isSupportedCountry(defaultCountry) ? defaultCountry : undefined;
  const phoneNumber = parsePhoneNumberFromString(value, { defaultCountry: country, extract: false });
  if (!phoneNumber?.isValid()) return value;

  const formatted = _formatWithoutExtension(phoneNumber, country);
  return phoneNumber.ext ? `${formatted} Ext. ${phoneNumber.ext}` : formatted;
}

// The content guide writes "Ext. 55555"; libphonenumber writes "ext. 55555", so it is added separately.
const _withoutExtension = { formatExtension: (number) => number };

function _formatWithoutExtension (phoneNumber, country) {
  const national = phoneNumber.formatNational(_withoutExtension);
  // Numbers sharing the viewer's calling code are shown without it.
  if (country && getCountryCallingCode(country) === phoneNumber.countryCallingCode) return national;
  // libphonenumber writes +1 numbers as "+1 800 555 1234"; the content guide wants "+1 (800) 555-1234".
  return phoneNumber.countryCallingCode === '1'
    ? `+1 ${national}`
    : phoneNumber.formatInternational(_withoutExtension);
}
