import { mount } from '@vue/test-utils';
import { formatDate, formatMonth } from '@/components/datepicker/utils.js';
import DtDatepicker from './datepicker.vue';
import { INTL_MONTH_FORMAT } from '@/components/datepicker/datepicker_constants.js';

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

const baseProps = {
  selectedDate: MOCK_TEST_DATE,
};

let mockProps = {};

describe('DtDatepicker Tests', () => {
  let wrapper;
  let datepickerHeader;
  let datepickerBody;
  let datepickerValue;
  let prevYearButton;
  let prevMonthButton;
  let nextMonthButton;
  let nextYearButton;

  const updateWrapper = async () => {
    wrapper = mount(DtDatepicker, {
      propsData: { ...baseProps, ...mockProps },
      attachTo: document.body,
    });

    await vi.dynamicImportSettled();

    datepickerHeader = wrapper.find('.d-datepicker__hd');
    datepickerBody = wrapper.find('.d-datepicker__bd');
    datepickerValue = wrapper.find('.d-datepicker__month-year-title');
    prevYearButton = wrapper.find('#prevYearButton');
    prevMonthButton = wrapper.find('#prevMonthButton');
    nextMonthButton = wrapper.find('#nextMonthButton');
    nextYearButton = wrapper.find('#nextYearButton');
  };

  beforeEach(async () => {
    await updateWrapper();
  });

  afterEach(() => {
    mockProps = {};
  });

  describe('Presentation Tests', () => {
    it('should render the component', () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe('On the header', () => {
      it('should render datepicker header', () => {
        expect(datepickerHeader.exists()).toBe(true);
      });

      it('should render datepicker previous year button SVG', () => {
        expect(prevYearButton.find('svg[data-name="Chevrons Left"]').exists()).toBe(true);
      });

      it('should render datepicker previous month button SVG', () => {
        expect(prevMonthButton.find('svg[data-name="Chevron Left"]').exists()).toBe(true);
      });

      it('should render datepicker next month button SVG', () => {
        expect(nextMonthButton.find('svg[data-name="Chevron Right"]').exists()).toBe(true);
      });

      it('should render datepicker next year button SVG', () => {
        expect(nextYearButton.find('svg[data-name="Chevrons Right"]').exists()).toBe(true);
      });

      it('should render month and year of selected date', () => {
        expect(datepickerValue.text()).toBe(MOCK_HEADER_SELECTED_DATE);
      });
    });

    describe('On the body', () => {
      it('should render datepicker body', () => {
        expect(datepickerBody.exists()).toBe(true);
      });

      it('should render 7 days of the week', () => {
        const weekDays = wrapper.findAll('.d-datepicker__weekday');

        expect(weekDays.length).toBe(7);
      });

      it('should render 6 weeks', () => {
        const weeks = wrapper.findAll('.d-datepicker__calendar tbody tr');

        expect(weeks.length).toBe(6);
      });

      it('should render 42 days', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        expect(days.length).toBe(42);
      });

      it('days which are not of the current month should be disabled', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        expect(days.at(40).classes('d-datepicker__day--disabled')).toBe(true);
      });

      it('selected date should be highlighted', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        expect(days.at(26).classes('d-datepicker__day--selected')).toBe(true);
      });
    });
  });

  describe('Accessibility Tests', () => {
    describe('On the header', () => {
      it('previous year button should has correct aria label', () => {
        expect(prevYearButton.attributes('aria-label'))
          .toContain(MOCK_LOCALIZED_PREVIOUS_YEAR_LABEL);
      });

      it('previous month button should has correct aria label', () => {
        expect(prevMonthButton.attributes('aria-label'))

          .toContain(MOCK_LOCALIZED_PREVIOUS_MONTH_LABEL);
      });

      it('next month button should has correct aria label', () => {
        expect(nextMonthButton.attributes('aria-label'))
          .toContain(MOCK_LOCALIZED_NEXT_MONTH_LABEL);
      });

      it('next year button should has correct aria label', () => {
        expect(nextYearButton.attributes('aria-label'))
          .toContain(MOCK_LOCALIZED_NEXT_YEAR_LABEL);
      });
    });

    describe('On calendar', () => {
      it('day should has correct aria label', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        const formattedDate = formatDate(`${MOCK_TODAY_YEAR}, ${MOCK_FORMATTED_TODAY_MONTH}, ${MOCK_DAY}`, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE);

        expect(days.at(26).attributes('aria-label'))
          .toContain(`Select day ${formattedDate}`);
      });
    });

    describe('On mount', () => {
      it('should focus previous year button', () => {
        expect(prevYearButton.element).toBe(document.activeElement);
      });
    });

    describe('On keyboard navigation', () => {
      it('should focus first available day of the week when tab', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await prevYearButton.trigger('keydown.Tab');

        expect(days.at(6).element).toBe(document.activeElement);
      });

      it('should focus prev year button on tab from calendar', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await prevYearButton.trigger('keydown.Tab');

        expect(days.at(6).element).toBe(document.activeElement);

        await days.at(6).trigger('keydown.Tab');

        expect(prevYearButton.element).toBe(document.activeElement);
      });

      it('should focus next day on arrow right', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');

        expect(days.at(7).element).toBe(document.activeElement);
      });

      it('should focus previous day on arrow left', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');

        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.ArrowLeft');

        expect(days.at(6).element).toBe(document.activeElement);
      });

      it('should focus the day below on down arrow', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');

        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.ArrowDown');

        expect(days.at(14).element).toBe(document.activeElement);
      });

      it('should focus the day above on up arrow', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');

        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.ArrowDown');

        expect(days.at(14).element).toBe(document.activeElement);

        await days.at(14).trigger('keydown.ArrowUp');

        expect(days.at(7).element).toBe(document.activeElement);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('should update year when previous year button is clicked', async () => {
      await prevYearButton.trigger('click');

      expect(datepickerValue
        .text())
        .toBe(`${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR - 1}`);
    });

    it('should update year when next year button is clicked', async () => {
      await nextYearButton.trigger('click');

      expect(datepickerValue
        .text())
        .toBe(`${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR + 1}`);
    });

    it('should update month when previous month button is clicked', async () => {
      await prevMonthButton.trigger('click');

      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should update month when next month button is clicked', async () => {
      await nextMonthButton.trigger('click');

      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH + 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to previous month on left arrow press on first day', async () => {
      const days = wrapper.findAll('.d-datepicker__day');

      await days.at(6).trigger('keydown.ArrowLeft');

      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to next month on right arrow press on last day', async () => {
      const daysJuly = wrapper.findAll('.d-datepicker__day');

      await daysJuly.at(6).trigger('keydown.ArrowLeft');

      // Should be June
      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);

      const daysJune = wrapper.findAll('.d-datepicker__day');

      await daysJune.at(33).trigger('keydown.ArrowRight');

      // Should be July again
      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to prev month on up arrow press on some day of first week month', async () => {
      const daysJuly = wrapper.findAll('.d-datepicker__day');

      await daysJuly.at(6).trigger('keydown.ArrowUp');

      // Should be June
      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should go to next month on down arrow press on some day of last week month', async () => {
      const daysJuly = wrapper.findAll('.d-datepicker__day');

      await daysJuly.at(6).trigger('keydown.ArrowUp');

      // Should be June
      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);

      const daysJune = wrapper.findAll('.d-datepicker__day');

      await daysJune.at(33).trigger('keydown.ArrowDown');

      // Should be July again
      expect(datepickerValue
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH, INTL_MONTH_FORMAT, MOCK_CURRENT_LOCALE)} ${MOCK_TODAY_YEAR}`);
    });

    it('should emit selected-date event when a day is clicked', async () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');

      await days.at(6).trigger('click');

      expect(wrapper.emitted('selected-date')).toBeTruthy();
    });
  });

  describe('weekStartsOn prop', () => {
    it('defaults to Sunday (0) — first weekday header is "Su"', async () => {
      mockProps = { locale: MOCK_CURRENT_LOCALE };
      await updateWrapper();

      const weekDays = wrapper.findAll('.d-datepicker__weekday');

      expect(weekDays.at(0).text()).toBe('Su');
    });

    it('weekStartsOn=1 — first weekday header is "Mo"', async () => {
      mockProps = { weekStartsOn: 1, locale: MOCK_CURRENT_LOCALE };
      await updateWrapper();

      const weekDays = wrapper.findAll('.d-datepicker__weekday');

      expect(weekDays.at(0).text()).toBe('Mo');
      expect(weekDays.at(6).text()).toBe('Su');
    });

    it('calendar grid starts on Monday when weekStartsOn=1', async () => {
      // Jan 2023: Jan 1 is a Sunday
      mockProps = {
        selectedDate: new Date(2023, 0, 15),
        weekStartsOn: 1,
        locale: MOCK_CURRENT_LOCALE,
      };
      await updateWrapper();

      const days = wrapper.findAll('.d-datepicker__calendar button');

      // With Monday start, the first row starts on Mon Dec 26.
      // Jan 1 (Sunday) should be in the 7th cell (index 6) of the first week row.
      expect(days.at(6).text()).toBe('1');
    });

    it('weekStartsOn=6 — first weekday header is "Sa"', async () => {
      mockProps = { weekStartsOn: 6, locale: MOCK_CURRENT_LOCALE };
      await updateWrapper();

      const weekDays = wrapper.findAll('.d-datepicker__weekday');

      expect(weekDays.at(0).text()).toBe('Sa');
    });
  });

  describe('Min/Max Date Tests', () => {
    const MIN_DATE = new Date(MOCK_YEAR, MOCK_MONTH, 10);
    const MAX_DATE = new Date(MOCK_YEAR, MOCK_MONTH, 20);

    beforeEach(async () => {
      mockProps = { minDate: MIN_DATE, maxDate: MAX_DATE };
      await updateWrapper();
    });

    it('days before minDate should be disabled', () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 9 (July 9) is index 14 (6 offset days from June + 9 - 1)
      const day9 = days.at(14);

      expect(day9.attributes('disabled')).toBeDefined();
      expect(day9.classes('d-datepicker__day--disabled')).toBe(true);
    });

    it('days after maxDate should be disabled', () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 21 (July 21) is index 26 (6 + 21 - 1)
      const day21 = days.at(26);

      expect(day21.attributes('disabled')).toBeDefined();
      expect(day21.classes('d-datepicker__day--disabled')).toBe(true);
    });

    it('days within range should be enabled', () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 15 (July 15) is index 20 (6 + 15 - 1)
      const day15 = days.at(20);

      expect(day15.attributes('disabled')).toBeUndefined();
      expect(day15.classes('d-datepicker__day--disabled')).toBe(false);
    });

    it('clicking a disabled day should not emit selected-date', async () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 9 is before minDate
      const day9 = days.at(14);

      await day9.trigger('click');

      expect(wrapper.emitted('selected-date')).toBeFalsy();
    });

    it('clicking an enabled day should emit selected-date', async () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 15 is within range
      const day15 = days.at(20);

      await day15.trigger('click');

      expect(wrapper.emitted('selected-date')).toBeTruthy();
    });

    describe('navigation button constraints', () => {
      it('previous month button should be disabled when at min bound', () => {
        expect(prevMonthButton.attributes('disabled')).toBeDefined();
      });

      it('next month button should be disabled when at max bound', () => {
        expect(nextMonthButton.attributes('disabled')).toBeDefined();
      });

      it('should not navigate past minDate month', async () => {
        await prevMonthButton.trigger('click');

        expect(datepickerValue.text()).toBe(MOCK_HEADER_SELECTED_DATE);
      });

      it('should not navigate past maxDate month', async () => {
        await nextMonthButton.trigger('click');

        expect(datepickerValue.text()).toBe(MOCK_HEADER_SELECTED_DATE);
      });
    });

    it('boundary minDate day should be enabled', () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 10 (July 10) is index 15 (6 + 10 - 1), the minDate itself
      const day10 = days.at(15);

      expect(day10.attributes('disabled')).toBeUndefined();
      expect(day10.classes('d-datepicker__day--disabled')).toBe(false);
    });

    it('boundary maxDate day should be enabled', () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      // Day 20 (July 20) is index 25 (6 + 20 - 1), the maxDate itself
      const day20 = days.at(25);

      expect(day20.attributes('disabled')).toBeUndefined();
      expect(day20.classes('d-datepicker__day--disabled')).toBe(false);
    });

    it('clicking boundary minDate day should emit selected-date', async () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      const day10 = days.at(15);

      await day10.trigger('click');

      expect(wrapper.emitted('selected-date')).toBeTruthy();
    });

    it('clicking boundary maxDate day should emit selected-date', async () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');
      const day20 = days.at(25);

      await day20.trigger('click');

      expect(wrapper.emitted('selected-date')).toBeTruthy();
    });

    describe('reactive prop changes', () => {
      it('should update disabled days when minDate changes', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        // Day 5 (July 5) is index 10 (6 + 5 - 1), currently disabled
        const day5 = days.at(10);

        expect(day5.attributes('disabled')).toBeDefined();

        // Change minDate to July 3
        await wrapper.setProps({ minDate: new Date(MOCK_YEAR, MOCK_MONTH, 3) });

        const updatedDays = wrapper.findAll('.d-datepicker__calendar button');
        const updatedDay5 = updatedDays.at(10);

        expect(updatedDay5.attributes('disabled')).toBeUndefined();
      });

      it('should update disabled days when maxDate changes', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        // Day 25 (July 25) is index 30 (6 + 25 - 1), currently disabled
        const day25 = days.at(30);

        expect(day25.attributes('disabled')).toBeDefined();

        // Change maxDate to July 28
        await wrapper.setProps({ maxDate: new Date(MOCK_YEAR, MOCK_MONTH, 28) });

        const updatedDays = wrapper.findAll('.d-datepicker__calendar button');
        const updatedDay25 = updatedDays.at(30);

        expect(updatedDay25.attributes('disabled')).toBeUndefined();
      });
    });

    describe('with only minDate', () => {
      beforeEach(async () => {
        mockProps = { minDate: MIN_DATE };
        await updateWrapper();
      });

      it('days before minDate should be disabled', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        const day9 = days.at(14);

        expect(day9.attributes('disabled')).toBeDefined();
      });

      it('days after minDate should be enabled', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        const day15 = days.at(20);

        expect(day15.attributes('disabled')).toBeUndefined();
      });

      it('next month button should not be disabled', () => {
        expect(nextMonthButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('with only maxDate', () => {
      beforeEach(async () => {
        mockProps = { maxDate: MAX_DATE };
        await updateWrapper();
      });

      it('days after maxDate should be disabled', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        const day21 = days.at(26);

        expect(day21.attributes('disabled')).toBeDefined();
      });

      it('days before maxDate should be enabled', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');
        const day15 = days.at(20);

        expect(day15.attributes('disabled')).toBeUndefined();
      });

      it('previous month button should not be disabled', () => {
        expect(prevMonthButton.attributes('disabled')).toBeUndefined();
      });
    });

    describe('invalid prop combination', () => {
      it('should warn when maxDate is before minDate', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        mockProps = {
          minDate: new Date(MOCK_YEAR, MOCK_MONTH, 20),
          maxDate: new Date(MOCK_YEAR, MOCK_MONTH, 10),
        };
        await updateWrapper();

        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining('maxDate must be after or equal to minDate'),
        );

        warnSpy.mockRestore();
      });
    });
  });
});
