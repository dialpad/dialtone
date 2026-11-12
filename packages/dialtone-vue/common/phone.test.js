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
  ])('reads national input %s as the viewer\'s country', (input, expected) => {
    expect(formatPhoneNumber(input, US)).toBe(expected);
  });

  it.each([
    ['+33555512345', undefined, '+33 5 55 51 23 45'],
    ['+442079460958', undefined, '+44 20 7946 0958'],
    ['+442079460958', { defaultCountry: 'GB' }, '020 7946 0958'],
  ])('formats international number %s with %o as %s', (input, options, expected) => {
    expect(formatPhoneNumber(input, options)).toBe(expected);
  });

  it('appends the extension as "Ext."', () => {
    expect(formatPhoneNumber('+1 415 555 1234 x55555')).toBe('+1 (415) 555-1234 Ext. 55555');
  });

  it.each([
    ['+1 555 123 4567', undefined],
    ['4155551234', undefined],
  ])('returns invalid input %s unchanged', (input, options) => {
    expect(formatPhoneNumber(input, options)).toBe(input);
  });

  it.each([['', undefined], [null, undefined], [undefined, undefined]])(
    'returns an empty string for %s',
    (input, options) => {
      expect(formatPhoneNumber(input, options)).toBe('');
    },
  );
});
