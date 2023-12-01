import { beforeEach, vi } from 'vitest';
import { es, enUS } from 'date-fns/locale';
import {
  setDateLocale,
  getDateMedium,
  durationInHHMM,
  relativeDate,
} from './dates';

const testInputDate = new Date(2022, 8, 2);

describe('Date function tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('When locale is not set', () => {
    it('getDateMedium throws an error', () => {
      global.locale = undefined;
      expect(() => getDateMedium(testInputDate)).toThrow();
    });
  });

  describe('When locale is set to enUS', () => {
    beforeEach(() => {
      setDateLocale(enUS);
    });

    it('getDateMedium returns the expected date', () => {
      expect(getDateMedium(testInputDate)).toBe('September 2, 2022');
    });

    it.each([
      [new Date(2023, 9, 24, 10, 0, 0), null, 'Today'],
      [new Date(2023, 9, 23, 10, 0, 0), null, 'Yesterday'],
      [new Date(2023, 9, 22, 10, 0, 0), null, 'Sunday'],
      [new Date(2023, 9, 14, 10, 0, 0), null, 'Saturday, October 14'],
      [new Date(2022, 9, 14, 10, 0, 0), null, 'October 14, 2022'],
      [new Date(2022, 11, 31, 23, 59, 59), new Date(2023, 0, 1, 0, 0, 0), 'Yesterday'],
    ])('When %s is passed in to relativeDate, it returns %s', (inputDate, currentTime, expected) => {
      if (currentTime === null) {
        // Set current time to Oct 24 2023 10:30:00 AM by default.
        currentTime = new Date(2023, 9, 24, 10, 30, 0);
      }
      vi.setSystemTime(currentTime);

      expect(relativeDate(inputDate)).toBe(expected);
    });

    it.each([
      [59, 'less than a minute'],
      [29, 'less than a minute'],
      [0, 'less than a minute'],
      [60, '1 minute'],
      [55 * 60, '55 minutes'],
      [(4 * 60 * 60) + (34 * 60), '4 hours 34 minutes'],
    ])('When %d is passed in to durationInHHMM, it returns %s', (inputSeconds, expected) => {
      expect(durationInHHMM(inputSeconds)).toBe(expected);
    });
  });

  /**
   * Most functions can just be tested using just the enUS locale, but we should test a few language based
   * formats here just to make sure that i18n is working as expected.
   */

  describe('When locale is set to es', () => {
    beforeEach(() => {
      setDateLocale(es);
    });

    it('getDateMedium returns the expected date', () => {
      expect(getDateMedium(testInputDate)).toBe('septiembre 2, 2022');
    });

    it.each([
      [new Date(2023, 9, 24, 10, 0, 0), null, 'Hoy'],
      [new Date(2023, 9, 14, 10, 0, 0), null, 'sábado, octubre 14'],
    ])('When %s is passed in to relativeDate, it returns %s', (inputDate, currentTime, expected) => {
      if (currentTime === null) {
        // Set current time to Oct 24 2023 10:30:00 AM by default.
        currentTime = new Date(2023, 9, 24, 10, 30, 0);
      }
      vi.setSystemTime(currentTime);

      expect(relativeDate(inputDate)).toBe(expected);
    });

    it.each([
      [59, 'menos de un minuto'],
      [(4 * 60 * 60) + (34 * 60), '4 horas 34 minutos'],
    ])('When %d is passed in to durationInHHMM, it returns %s', (inputSeconds, expected) => {
      expect(durationInHHMM(inputSeconds)).toBe(expected);
    });
  });
});
