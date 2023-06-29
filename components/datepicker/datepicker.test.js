import { mount } from '@vue/test-utils';
import { formatMonth } from '@/components/datepicker/utils.js';
import DtDatepicker from './DtDatepicker.vue';
import { MONTH_FORMAT } from '@/components/datepicker/datepicker_constants.js';

const day = 21;
const month = 6; // Note: month is zero-based, so 6 represents July
const year = 2023;

const testDate = new Date(year, month, day);

// Constants
const basePropsData = {
  changeToLabel: 'Change to',
  prevMonthLabel: 'Previous month',
  nextMonthLabel: 'Next month',
  prevYearLabel: 'Previous year',
  nextYearLabel: 'Next year',
  selectDayLabel: 'Select day',
  selectedDate: testDate,
};

const todayYear = testDate.getFullYear();
const todayMonth = testDate.getMonth();
const formattedTodayMonth = formatMonth(todayMonth, MONTH_FORMAT);
const headerSelectedDate = `${formattedTodayMonth} ${todayYear}`;

describe('DtDatepicker Tests', function () {
  // Wrappers
  let wrapper;
  let datepickerHeader;
  let prevYearButton;
  let prevMonthButton;
  let nextMonthButton;
  let nextYearButton;

  // Environment
  let propsData = basePropsData;

  // Helpers
  const _setChildWrappers = () => {
    datepickerHeader = wrapper.find('.d-datepicker--header');
    prevYearButton = wrapper.find('#prevYearButton');
    prevMonthButton = wrapper.find('#prevMonthButton');
    nextMonthButton = wrapper.find('#nextMonthButton');
    nextYearButton = wrapper.find('#nextYearButton');
  };

  const _mountWrapper = async () => {
    wrapper = mount(DtDatepicker, {
      propsData,
      attachTo: document.body,
    });
    await wrapper.vm.$nextTick();
  };

  // Setup
  beforeEach(function () {
    propsData = basePropsData;
    _mountWrapper();
    _setChildWrappers();
  });

  // Teardown
  afterEach(function () {
    propsData = basePropsData;
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
        expect(wrapper.find('.d-datepicker--header p').text()).toBe(headerSelectedDate);
      });
    });

    describe('On the body', () => {
      it('should render datepicker body', () => {
        expect(wrapper.find('.d-datepicker--body').exists()).toBe(true);
      });

      it('should render 7 days of the week', () => {
        const weekDays = wrapper.find('.d-datepicker__week-day');

        expect(weekDays.findAll('div').length).toBe(7);
      });

      it('should render 6 weeks', () => {
        const weeks = wrapper.findAll('.d-datepicker__week');

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

  describe('Accessibility Tests', function () {
    describe('On the header', () => {
      it('previous year button should has correct aria label', function () {
        // eslint-disable-next-line max-len
        expect(prevYearButton.attributes('aria-label')).toContain(`${basePropsData.changeToLabel} ${basePropsData.prevYearLabel} ${todayYear - 1}`);
      });

      it('previous month button should has correct aria label', function () {
        // eslint-disable-next-line max-len
        expect(prevMonthButton.attributes('aria-label')).toContain(`${basePropsData.changeToLabel} ${basePropsData.prevMonthLabel} ${formatMonth(todayMonth - 1, MONTH_FORMAT)}`);
      });

      it('next month button should has correct aria label', function () {
        // eslint-disable-next-line max-len
        expect(nextMonthButton.attributes('aria-label')).toContain(`${basePropsData.changeToLabel} ${basePropsData.nextMonthLabel} ${formatMonth(todayMonth + 1, MONTH_FORMAT)}`);
      });

      it('next year button should has correct aria label', function () {
        // eslint-disable-next-line max-len
        expect(nextYearButton.attributes('aria-label')).toContain(`${basePropsData.changeToLabel} ${basePropsData.nextYearLabel} ${todayYear + 1}`);
      });
    });

    describe('On calendar', function () {
      it('day should has correct aria label', function () {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        // eslint-disable-next-line max-len
        expect(days.at(26).attributes('aria-label')).toContain(`${basePropsData.selectDayLabel} ${day} ${formattedTodayMonth} ${todayYear}`);
      });
    });

    describe('On mount', function () {
      it('should focus previous year button', function () {
        expect(prevYearButton.element).toBe(document.activeElement);
      });
    });

    describe('On keyboard navigation', function () {
      it('should focus first available day of the week when tab', async function () {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await prevYearButton.trigger('keydown.Tab');

        expect(days.at(6).element).toBe(document.activeElement);
      });

      it('should focus prev year button on tab from calendar', async function () {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await prevYearButton.trigger('keydown.Tab');
        expect(days.at(6).element).toBe(document.activeElement);

        await days.at(6).trigger('keydown.Tab');
        expect(prevYearButton.element).toBe(document.activeElement);
      });

      it('should focus next day on arrow right', async function () {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');
        expect(days.at(7).element).toBe(document.activeElement);
      });

      it('should focus previous day on arrow left', async function () {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');
        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.ArrowLeft');
        expect(days.at(6).element).toBe(document.activeElement);
      });

      it('should focus the day below on down arrow', async function () {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.ArrowRight');
        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.ArrowDown');
        expect(days.at(14).element).toBe(document.activeElement);
      });

      it('should focus the day above on up arrow', async function () {
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

  describe('Interactivity Tests', function () {
    it('should update year when previous year button is clicked', async function () {
      await prevYearButton.trigger('click');

      expect(wrapper.find('.d-datepicker--header p').text()).toBe(`${formattedTodayMonth} ${todayYear - 1}`);
    });

    it('should update year when next year button is clicked', async function () {
      await nextYearButton.trigger('click');

      expect(wrapper.find('.d-datepicker--header p').text()).toBe(`${formattedTodayMonth} ${todayYear + 1}`);
    });

    it('should update month when previous month button is clicked', async function () {
      await prevMonthButton.trigger('click');

      // eslint-disable-next-line max-len
      expect(wrapper.find('.d-datepicker--header p').text()).toBe(`${formatMonth(todayMonth - 1, MONTH_FORMAT)} ${todayYear}`);
    });

    it('should update month when next month button is clicked', async function () {
      await nextMonthButton.trigger('click');

      // eslint-disable-next-line max-len
      expect(wrapper.find('.d-datepicker--header p').text()).toBe(`${formatMonth(todayMonth + 1, MONTH_FORMAT)} ${todayYear}`);
    });

    it('should emit selected-date event when a day is clicked', async function () {
      const days = wrapper.findAll('.d-datepicker__calendar button');

      await days.at(6).trigger('click');
      expect(wrapper.emitted('selected-date')).toBeTruthy();
    });
  });
});
