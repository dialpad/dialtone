import { formatPhoneNumber } from './phone';

const US = { defaultCountry: 'US' };

describe('formatPhoneNumber', () => {
  it.each([
    ['+18005551234', undefined, '+1 (800) 555-1234'],
    ['+14155551234', US, '(415) 555-1234'],
    ['+14155551234', { defaultCountry: 'GB' }, '+1 (415) 555-1234'],
  ])('formats North American number %s with %o as %s', (input, options, expected) => {
    expect(formatPhoneNumber(input, options)).toBe(expected);
  });

  it.each([
    ['415.555.1234', '(415) 555-1234'],
    ['18005551234', '(800) 555-1234'],
    ['011 44 20 7946 0958', '+44 20 7946 0958'],
  ])('reads %s as dialled from the viewer\'s country', (input, expected) => {
    expect(formatPhoneNumber(input, US)).toBe(expected);
  });

  it.each([
    ['+33555512345', undefined, '+33 5 55 51 23 45'],
    ['+442079460958', undefined, '+44 20 7946 0958'],
    ['+442079460958', { defaultCountry: 'GB' }, '020 7946 0958'],
  ])('formats international number %s with %o as %s', (input, options, expected) => {
    expect(formatPhoneNumber(input, options)).toBe(expected);
  });

  it.each([
    ['+1 415 555 1234 x55555', '+1 (415) 555-1234 Ext. 55555'],
    ['+44 20 7946 0958 ext. 123', '+44 20 7946 0958 Ext. 123'],
  ])('writes the extension of %s as "Ext."', (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected);
  });

  it('ignores surrounding whitespace and the case of the country code', () => {
    expect(formatPhoneNumber(' +14155551234\n')).toBe('+1 (415) 555-1234');
    expect(formatPhoneNumber('415.555.1234', { defaultCountry: 'us' })).toBe('(415) 555-1234');
  });

  it.each([
    ['+1 555 123 4567', undefined],
    ['+1 415 555 123', undefined],
    ['4155551234', undefined],
    ['911', US],
    ['1-800-FLOWERS', US],
  ])('returns invalid input %s unchanged', (input, options) => {
    expect(formatPhoneNumber(input, options)).toBe(input);
  });

  it.each(['', 4155551234])('returns an empty string for %o', (input) => {
    expect(formatPhoneNumber(input)).toBe('');
  });
});
