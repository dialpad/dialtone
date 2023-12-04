import { createLocalVue, mount } from '@vue/test-utils';
import { formatMonth } from '@/components/datepicker/utils.js';
import DtDatepicker from './datepicker.vue';
import { MONTH_FORMAT } from '@/components/datepicker/datepicker_constants.js';

const MOCK_DAY = 21;
const MOCK_MONTH = 6; // Note: month is zero-based, so 6 represents July
const MOCK_YEAR = 2023;
const MOCK_TEST_DATE = new Date(MOCK_YEAR, MOCK_MONTH, MOCK_DAY);

const MOCK_TODAY_YEAR = MOCK_TEST_DATE.getFullYear();
const MOCK_TODAY_MONTH = MOCK_TEST_DATE.getMonth();
const MOCK_FORMATTED_TODAY_MONTH = formatMonth(MOCK_TODAY_MONTH, MONTH_FORMAT);
const MOCK_HEADER_SELECTED_DATE = `${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR}`;

const baseProps = {
  changeToLabel: 'Change to',
  prevMonthLabel: 'Previous month',
  nextMonthLabel: 'Next month',
  prevYearLabel: 'Previous year',
  nextYearLabel: 'Next year',
  selectDayLabel: 'Select day',
  selectedDate: MOCK_TEST_DATE,
};

let mockProps = {};
const testContext = {};

describe('DtDatepicker Tests', () => {
  let wrapper;
  let datepickerHeader;
  let prevYearButton;
  let prevMonthButton;
  let nextMonthButton;
  let nextYearButton;

  const updateWrapper = async () => {
    wrapper = mount(DtDatepicker, {
      propsData: { ...baseProps, ...mockProps },
      localVue: testContext.localVue,
      attachTo: document.body,
    });

    await vi.dynamicImportSettled();

    datepickerHeader = wrapper.find('.d-datepicker--header');
    prevYearButton = wrapper.find('#prevYearButton');
    prevMonthButton = wrapper.find('#prevMonthButton');
    nextMonthButton = wrapper.find('#nextMonthButton');
    nextYearButton = wrapper.find('#nextYearButton');
  };

  beforeAll(() => {
    testContext.localVue = createLocalVue();
  });

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
        expect(wrapper.find('.d-datepicker--header p').text()).toBe(MOCK_HEADER_SELECTED_DATE);
      });
    });

    describe('On the body', () => {
      it('should render datepicker body', () => {
        expect(wrapper.find('.d-datepicker--body').exists()).toBe(true);
      });

      it('should render 7 days of the week', () => {
        const weekDays = wrapper.find('.d-datepicker__week-day');

        // Note: it includes the root element, that's why it is 8
        expect(weekDays.findAll('div').length).toBe(8);
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

  describe('Accessibility Tests', () => {
    describe('On the header', () => {
      it('previous year button should has correct aria label', () => {
        expect(prevYearButton.attributes('aria-label'))
          .toContain(`${baseProps.changeToLabel} ${baseProps.prevYearLabel} ${MOCK_TODAY_YEAR - 1}`);
      });

      it('previous month button should has correct aria label', () => {
        expect(prevMonthButton.attributes('aria-label'))
        // eslint-disable-next-line max-len
          .toContain(`${baseProps.changeToLabel} ${baseProps.prevMonthLabel} ${formatMonth(MOCK_TODAY_MONTH - 1, MONTH_FORMAT)}`);
      });

      it('next month button should has correct aria label', () => {
        expect(nextMonthButton.attributes('aria-label'))
        // eslint-disable-next-line max-len
          .toContain(`${baseProps.changeToLabel} ${baseProps.nextMonthLabel} ${formatMonth(MOCK_TODAY_MONTH + 1, MONTH_FORMAT)}`);
      });

      it('next year button should has correct aria label', () => {
        expect(nextYearButton.attributes('aria-label'))
          .toContain(`${baseProps.changeToLabel} ${baseProps.nextYearLabel} ${MOCK_TODAY_YEAR + 1}`);
      });
    });

    describe('On calendar', () => {
      it('day should has correct aria label', () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        expect(days.at(26).attributes('aria-label'))
          .toContain(`${baseProps.selectDayLabel} ${MOCK_DAY} ${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR}`);
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

        await prevYearButton.trigger('keydown.tab');

        expect(days.at(6).element).toBe(document.activeElement);
      });

      it('should focus prev year button on tab from calendar', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await prevYearButton.trigger('keydown.tab');

        expect(days.at(6).element).toBe(document.activeElement);

        await days.at(6).trigger('keydown.tab');

        expect(prevYearButton.element).toBe(document.activeElement);
      });

      it('should focus next day on arrow right', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.right');

        expect(days.at(7).element).toBe(document.activeElement);
      });

      it('should focus previous day on arrow left', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.right');

        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.left');

        expect(days.at(6).element).toBe(document.activeElement);
      });

      it('should focus the day below on down arrow', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.right');

        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.down');

        expect(days.at(14).element).toBe(document.activeElement);
      });

      it('should focus the day above on up arrow', async () => {
        const days = wrapper.findAll('.d-datepicker__calendar button');

        await days.at(6).trigger('keydown.right');

        expect(days.at(7).element).toBe(document.activeElement);

        await days.at(7).trigger('keydown.down');

        expect(days.at(14).element).toBe(document.activeElement);

        await days.at(14).trigger('keydown.up');

        expect(days.at(7).element).toBe(document.activeElement);
      });
    });
  });

  describe('Interactivity Tests', () => {
    it('should update year when previous year button is clicked', async () => {
      await prevYearButton.trigger('click');

      expect(wrapper.find('.d-datepicker--header p')
        .text())
        .toBe(`${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR - 1}`);
    });

    it('should update year when next year button is clicked', async () => {
      await nextYearButton.trigger('click');

      expect(wrapper.find('.d-datepicker--header p')
        .text())
        .toBe(`${MOCK_FORMATTED_TODAY_MONTH} ${MOCK_TODAY_YEAR + 1}`);
    });

    it('should update month when previous month button is clicked', async () => {
      await prevMonthButton.trigger('click');

      expect(wrapper.find('.d-datepicker--header p')
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH - 1, MONTH_FORMAT)} ${MOCK_TODAY_YEAR}`);
    });

    it('should update month when next month button is clicked', async () => {
      await nextMonthButton.trigger('click');

      expect(wrapper.find('.d-datepicker--header p')
        .text())
        .toBe(`${formatMonth(MOCK_TODAY_MONTH + 1, MONTH_FORMAT)} ${MOCK_TODAY_YEAR}`);
    });

    it('should emit selected-date event when a day is clicked', async () => {
      const days = wrapper.findAll('.d-datepicker__calendar button');

      await days.at(6).trigger('click');

      expect(wrapper.emitted('selected-date')).toBeTruthy();
    });
  });
});
