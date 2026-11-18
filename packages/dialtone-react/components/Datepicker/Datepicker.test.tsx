import { fireEvent, render, type RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { formatDate, formatMonth } from './Utils';
import { DtDatepicker, type DtDatepickerProps } from './Datepicker';
import { INTL_MONTH_FORMAT } from './DatepickerConstants';

const MOCK_DAY = 21;
const MOCK_MONTH = 6; // Note: month is zero-based, so 6 represents July
const MOCK_YEAR = 2023;
const MOCK_TEST_DATE = new Date(MOCK_YEAR, MOCK_MONTH, MOCK_DAY);

const MOCK_CURRENT_LOCALE = 'en-US';
const MOCK_TODAY_YEAR = MOCK_TEST_DATE.getFullYear();
const MOCK_TODAY_MONTH = MOCK_TEST_DATE.getMonth();
const MOCK_FORMATTED_LAST_MONTH = formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE);
const MOCK_FORMATTED_TODAY_MONTH = formatMonth(MOCK_TODAY_MONTH, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE);
const MOCK_FORMATTED_NEXT_MONTH = formatMonth(MOCK_TODAY_MONTH + 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE);
const MOCK_HEADER_SELECTED_DATE = `${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR}`;
const MOCK_LOCALIZED_PREVIOUS_YEAR_LABEL = `Change to Previous year ${MOCK_TODAY_YEAR - 1}`;
const MOCK_LOCALIZED_PREVIOUS_MONTH_LABEL = `Change to Previous month ${MOCK_FORMATTED_LAST_MONTH}`;
const MOCK_LOCALIZED_NEXT_MONTH_LABEL = `Change to Next month ${MOCK_FORMATTED_NEXT_MONTH}`;
const MOCK_LOCALIZED_NEXT_YEAR_LABEL = `Change to Next year ${MOCK_TODAY_YEAR + 1}`;

const baseProps: DtDatepickerProps = {
  selectedDate: MOCK_TEST_DATE,
};

let mockProps: Partial<DtDatepickerProps> = {};

describe('DtDatepicker Tests', () => {
  let result: RenderResult | undefined;
  let root: HTMLElement;
  let datepickerHeader: HTMLElement | null;
  let datepickerBody: HTMLElement | null;
  let datepickerValue: HTMLElement;
  let prevYearButton: HTMLElement;
  let prevMonthButton: HTMLElement;
  let nextMonthButton: HTMLElement;
  let nextYearButton: HTMLElement;

  // Vue's emitted('selected-date').
  const onSelectedDate = vi.fn();

  const element = (props: Partial<DtDatepickerProps> = {}) => (
    <DtDatepicker {...baseProps} {...mockProps} {...props} onSelectedDate={onSelectedDate} />
  );

  const updateWrapper = () => {
    // Vue mounts another wrapper; the previous one isn't read again, so it's unmounted here.
    result?.unmount();
    onSelectedDate.mockClear();
    result = render(element());
    root = result.container.firstElementChild as HTMLElement;

    datepickerHeader = root.querySelector('[data-qa="dt-datepicker-header"]');
    datepickerBody = root.querySelector('[data-qa="dt-datepicker-body"]');
    datepickerValue = root.querySelector('[data-qa="dt-datepicker-heading"]')!;
    [prevYearButton, prevMonthButton, nextMonthButton, nextYearButton] =
      Array.from(datepickerHeader!.querySelectorAll<HTMLElement>('[data-qa="dt-button"]'));
  };

  const findDays = () =>
    Array.from(root.querySelectorAll<HTMLElement>('[data-qa="dt-datepicker-calendar"] [data-qa="dt-button"]'));

  const headingText = () => datepickerValue.textContent?.trim();

  beforeEach(() => {
    updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
    result?.unmount();
    result = undefined;
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(root.getAttribute('data-qa')).toBe('dt-stack');
    });

    describe('On the header', () => {
      it('should render datepicker header', () => {
        expect(datepickerHeader).not.toBeNull();
      });

      it('should render datepicker previous year button SVG', () => {
        expect(prevYearButton.querySelector('[data-qa="dt-icon"]')!.getAttribute('data-name')).toBe('Chevrons Left');
      });

      it('should render datepicker previous month button SVG', () => {
        expect(prevMonthButton.querySelector('[data-qa="dt-icon"]')!.getAttribute('data-name')).toBe('Chevron Left');
      });

      it('should render datepicker next month button SVG', () => {
        expect(nextMonthButton.querySelector('[data-qa="dt-icon"]')!.getAttribute('data-name')).toBe('Chevron Right');
      });

      it('should render datepicker next year button SVG', () => {
        expect(nextYearButton.querySelector('[data-qa="dt-icon"]')!.getAttribute('data-name')).toBe('Chevrons Right');
      });

      it('should render month and year of selected date', () => {
        expect(headingText()).toBe(MOCK_HEADER_SELECTED_DATE);
      });
    });

    describe('On the body', () => {
      it('should render datepicker body', () => {
        expect(datepickerBody).not.toBeNull();
      });

      it('should render 7 days of the week', () => {
        const weekDays = root.querySelectorAll('[data-qa="dt-datepicker-weekday"]');

        expect(weekDays.length).toBe(7);
      });

      it('should render 6 weeks', () => {
        const weeks = root.querySelectorAll('[data-qa="dt-datepicker-week"]');

        expect(weeks.length).toBe(6);
      });

      it('should render 42 days', () => {
        const days = findDays();

        expect(days.length).toBe(42);
      });

      it('days which are not of the current month should be disabled', () => {
        const days = findDays();

        expect(days[40]).toHaveClass('d-datepicker__day--disabled');
      });

      it('selected date should be highlighted', () => {
        const days = findDays();

        expect(days[26]).toHaveClass('d-datepicker__day--selected');
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('On the header', () => {
      it('previous year button should has correct aria label', () => {
        expect(prevYearButton.getAttribute('aria-label'))
          .toContain(MOCK_LOCALIZED_PREVIOUS_YEAR_LABEL);
      });

      it('previous month button should has correct aria label', () => {
        expect(prevMonthButton.getAttribute('aria-label'))
          .toContain(MOCK_LOCALIZED_PREVIOUS_MONTH_LABEL);
      });

      it('next month button should has correct aria label', () => {
        expect(nextMonthButton.getAttribute('aria-label'))
          .toContain(MOCK_LOCALIZED_NEXT_MONTH_LABEL);
      });

      it('next year button should has correct aria label', () => {
        expect(nextYearButton.getAttribute('aria-label'))
          .toContain(MOCK_LOCALIZED_NEXT_YEAR_LABEL);
      });
    });

    describe('On calendar', () => {
      it('day should has correct aria label', () => {
        const days = findDays();
        const formattedDate = formatDate(
          `${MOCK_TODAY_YEAR}, ${MOCK_FORMATTED_TODAY_MONTH}, ${MOCK_DAY}`,
          INTL_MONTH_FORMAT,
          MOCK_CURRENT_LOCALE,
        );

        expect(days[26].getAttribute('aria-label'))
          .toContain(`Select day ${formattedDate}`);
      });
    });

    describe('On mount', () => {
      it('should focus previous year button', () => {
        expect(prevYearButton).toBe(document.activeElement);
      });
    });

    describe('On keyboard navigation', () => {
      it('should focus first available day of the week when tab', () => {
        const days = findDays();

        fireEvent.keyDown(prevYearButton, { key: 'Tab' });

        expect(days[6]).toBe(document.activeElement);
      });

      it('should focus prev year button on tab from calendar', () => {
        const days = findDays();

        fireEvent.keyDown(prevYearButton, { key: 'Tab' });

        expect(days[6]).toBe(document.activeElement);

        fireEvent.keyDown(days[6], { key: 'Tab' });

        expect(prevYearButton).toBe(document.activeElement);
      });

      it('should focus next day on arrow right', () => {
        const days = findDays();

        fireEvent.keyDown(days[6], { key: 'ArrowRight' });

        expect(days[7]).toBe(document.activeElement);
      });

      it('should focus previous day on arrow left', () => {
        const days = findDays();

        fireEvent.keyDown(days[6], { key: 'ArrowRight' });

        expect(days[7]).toBe(document.activeElement);

        fireEvent.keyDown(days[7], { key: 'ArrowLeft' });

        expect(days[6]).toBe(document.activeElement);
      });

      it('should focus the day below on down arrow', () => {
        const days = findDays();

        fireEvent.keyDown(days[6], { key: 'ArrowRight' });

        expect(days[7]).toBe(document.activeElement);

        fireEvent.keyDown(days[7], { key: 'ArrowDown' });

        expect(days[14]).toBe(document.activeElement);
      });

      it('should focus the day above on up arrow', () => {
        const days = findDays();

        fireEvent.keyDown(days[6], { key: 'ArrowRight' });

        expect(days[7]).toBe(document.activeElement);

        fireEvent.keyDown(days[7], { key: 'ArrowDown' });

        expect(days[14]).toBe(document.activeElement);

        fireEvent.keyDown(days[14], { key: 'ArrowUp' });

        expect(days[7]).toBe(document.activeElement);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('should update year when previous year button is clicked', async () => {
      await userEvent.click(prevYearButton);

      expect(headingText())
        .toBe(`${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR - 1}`);
    });

    it('should update year when next year button is clicked', async () => {
      await userEvent.click(nextYearButton);

      expect(headingText())
        .toBe(`${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR + 1}`);
    });

    it('should update month when previous month button is clicked', async () => {
      await userEvent.click(prevMonthButton);

      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should update month when next month button is clicked', async () => {
      await userEvent.click(nextMonthButton);

      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH + 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to previous month on left arrow press on first day', () => {
      const days = findDays();

      fireEvent.keyDown(days[6], { key: 'ArrowLeft' });

      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to next month on right arrow press on last day', () => {
      const daysJuly = findDays();

      fireEvent.keyDown(daysJuly[6], { key: 'ArrowLeft' });

      // Should be June
      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);

      const daysJune = findDays();

      fireEvent.keyDown(daysJune[33], { key: 'ArrowRight' });

      // Should be July again
      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to prev month on up arrow press on some day of first week month', () => {
      const daysJuly = findDays();

      fireEvent.keyDown(daysJuly[6], { key: 'ArrowUp' });

      // Should be June
      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to next month on down arrow press on some day of last week month', () => {
      const daysJuly = findDays();

      fireEvent.keyDown(daysJuly[6], { key: 'ArrowUp' });

      // Should be June
      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);

      const daysJune = findDays();

      fireEvent.keyDown(daysJune[33], { key: 'ArrowDown' });

      // Should be July again
      expect(headingText())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should emit selected-date event when a day is clicked', async () => {
      const days = findDays();

      await userEvent.click(days[6]);

      expect(onSelectedDate).toHaveBeenCalled();
    });
  });

  describe('weekStartsOn prop', () => {
    it('defaults to Sunday (0) — first weekday header is "Su"', () => {
      const weekDays = root.querySelectorAll('[data-qa="dt-datepicker-weekday"]');

      expect(weekDays[0].textContent?.trim()).toBe('Su');
    });

    it('weekStartsOn=1 — first weekday header is "Mo"', () => {
      mockProps = { weekStartsOn: 1 };
      updateWrapper();

      const weekDays = root.querySelectorAll('[data-qa="dt-datepicker-weekday"]');

      expect(weekDays[0].textContent?.trim()).toBe('Mo');
      expect(weekDays[6].textContent?.trim()).toBe('Su');
    });

    it('calendar grid starts on Monday when weekStartsOn=1', () => {
      // Jan 2023: Jan 1 is a Sunday
      mockProps = {
        selectedDate: new Date(2023, 0, 15),
        weekStartsOn: 1,
      };
      updateWrapper();

      const days = findDays();

      // With Monday start, the first row starts on Mon Dec 26.
      // Jan 1 (Sunday) should be in the 7th cell (index 6) of the first week row.
      expect(days[6].textContent?.trim()).toBe('1');
    });

    it('weekStartsOn=6 — first weekday header is "Sa"', () => {
      mockProps = { weekStartsOn: 6 };
      updateWrapper();

      const weekDays = root.querySelectorAll('[data-qa="dt-datepicker-weekday"]');

      expect(weekDays[0].textContent?.trim()).toBe('Sa');
    });
  });

  describe('Min/Max Date Tests', () => {
    const MIN_DATE = new Date(MOCK_YEAR, MOCK_MONTH, 10);
    const MAX_DATE = new Date(MOCK_YEAR, MOCK_MONTH, 20);

    beforeEach(() => {
      mockProps = { minDate: MIN_DATE, maxDate: MAX_DATE };
      updateWrapper();
    });

    it('days before minDate should be disabled', () => {
      const days = findDays();
      // Day 9 (July 9) is index 14 (6 offset days from June + 9 - 1)
      const day9 = days[14];

      expect(day9).toHaveAttribute('disabled');
      expect(day9).toHaveClass('d-datepicker__day--disabled');
    });

    it('days after maxDate should be disabled', () => {
      const days = findDays();
      // Day 21 (July 21) is index 26 (6 + 21 - 1)
      const day21 = days[26];

      expect(day21).toHaveAttribute('disabled');
      expect(day21).toHaveClass('d-datepicker__day--disabled');
    });

    it('days within range should be enabled', () => {
      const days = findDays();
      // Day 15 (July 15) is index 20 (6 + 15 - 1)
      const day15 = days[20];

      expect(day15).not.toHaveAttribute('disabled');
      expect(day15).not.toHaveClass('d-datepicker__day--disabled');
    });

    it('clicking a disabled day should not emit selected-date', async () => {
      const days = findDays();
      // Day 9 is before minDate
      const day9 = days[14];

      await userEvent.click(day9);

      expect(onSelectedDate).not.toHaveBeenCalled();
    });

    it('clicking an enabled day should emit selected-date', async () => {
      const days = findDays();
      // Day 15 is within range
      const day15 = days[20];

      await userEvent.click(day15);

      expect(onSelectedDate).toHaveBeenCalled();
    });

    describe('navigation button constraints', () => {
      it('previous month button should be disabled when at min bound', () => {
        expect(prevMonthButton).toHaveAttribute('disabled');
      });

      it('next month button should be disabled when at max bound', () => {
        expect(nextMonthButton).toHaveAttribute('disabled');
      });

      it('should not navigate past minDate month', async () => {
        await userEvent.click(prevMonthButton);

        expect(headingText()).toBe(MOCK_HEADER_SELECTED_DATE);
      });

      it('should not navigate past maxDate month', async () => {
        await userEvent.click(nextMonthButton);

        expect(headingText()).toBe(MOCK_HEADER_SELECTED_DATE);
      });
    });

    it('boundary minDate day should be enabled', () => {
      const days = findDays();
      // Day 10 (July 10) is index 15 (6 + 10 - 1), the minDate itself
      const day10 = days[15];

      expect(day10).not.toHaveAttribute('disabled');
      expect(day10).not.toHaveClass('d-datepicker__day--disabled');
    });

    it('boundary maxDate day should be enabled', () => {
      const days = findDays();
      // Day 20 (July 20) is index 25 (6 + 20 - 1), the maxDate itself
      const day20 = days[25];

      expect(day20).not.toHaveAttribute('disabled');
      expect(day20).not.toHaveClass('d-datepicker__day--disabled');
    });

    it('clicking boundary minDate day should emit selected-date', async () => {
      const days = findDays();
      const day10 = days[15];

      await userEvent.click(day10);

      expect(onSelectedDate).toHaveBeenCalled();
    });

    it('clicking boundary maxDate day should emit selected-date', async () => {
      const days = findDays();
      const day20 = days[25];

      await userEvent.click(day20);

      expect(onSelectedDate).toHaveBeenCalled();
    });

    describe('reactive prop changes', () => {
      it('should update disabled days when minDate changes', () => {
        const days = findDays();
        // Day 5 (July 5) is index 10 (6 + 5 - 1), currently disabled
        const day5 = days[10];

        expect(day5).toHaveAttribute('disabled');

        // Change minDate to July 3
        result!.rerender(element({ minDate: new Date(MOCK_YEAR, MOCK_MONTH, 3) }));

        const updatedDays = findDays();
        const updatedDay5 = updatedDays[10];

        expect(updatedDay5).not.toHaveAttribute('disabled');
      });

      it('should update disabled days when maxDate changes', () => {
        const days = findDays();
        // Day 25 (July 25) is index 30 (6 + 25 - 1), currently disabled
        const day25 = days[30];

        expect(day25).toHaveAttribute('disabled');

        // Change maxDate to July 28
        result!.rerender(element({ maxDate: new Date(MOCK_YEAR, MOCK_MONTH, 28) }));

        const updatedDays = findDays();
        const updatedDay25 = updatedDays[30];

        expect(updatedDay25).not.toHaveAttribute('disabled');
      });
    });

    describe('with only minDate', () => {
      beforeEach(() => {
        mockProps = { minDate: MIN_DATE };
        updateWrapper();
      });

      it('days before minDate should be disabled', () => {
        const days = findDays();
        const day9 = days[14];

        expect(day9).toHaveAttribute('disabled');
      });

      it('days after minDate should be enabled', () => {
        const days = findDays();
        const day15 = days[20];

        expect(day15).not.toHaveAttribute('disabled');
      });

      it('next month button should not be disabled', () => {
        expect(nextMonthButton).not.toHaveAttribute('disabled');
      });
    });

    describe('with only maxDate', () => {
      beforeEach(() => {
        mockProps = { maxDate: MAX_DATE };
        updateWrapper();
      });

      it('days after maxDate should be disabled', () => {
        const days = findDays();
        const day21 = days[26];

        expect(day21).toHaveAttribute('disabled');
      });

      it('days before maxDate should be enabled', () => {
        const days = findDays();
        const day15 = days[20];

        expect(day15).not.toHaveAttribute('disabled');
      });

      it('previous month button should not be disabled', () => {
        expect(prevMonthButton).not.toHaveAttribute('disabled');
      });
    });

    describe('invalid prop combination', () => {
      it('should warn when maxDate is before minDate', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = {
          minDate: new Date(MOCK_YEAR, MOCK_MONTH, 20),
          maxDate: new Date(MOCK_YEAR, MOCK_MONTH, 10),
        };
        updateWrapper();

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('maxDate must be after or equal to minDate'),
        );

        warnSpy.mockRestore();
      });
    });
  });
});
