import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { DtPopover } from '../Popover';
import { DtDatepicker, type DtDatepickerProps } from './Datepicker';
import { formatLong, formatMedium, formatNoYear, formatNumerical, formatShort } from './FormatUtils';

// `date` and `opened` are the .story.vue templates' own props; `locale` is an attribute the default template reads,
// which no arg sets.
type DatepickerStoryArgs = Omit<DtDatepickerProps, 'selectedDate'> & {
  date?: Date;
  opened?: boolean;
  locale?: string;
};

const defaultDate = new Date('2023-01-01T00:00:00');

export const argsData = {
  onSelectedDate: action('selected-date'),
  onCloseDatepicker: action('close-datepicker'),
  date: new Date(),
  opened: false,
  minDate: null,
  maxDate: null,
  weekStartsOn: 0,
} satisfies Partial<DatepickerStoryArgs>;

export const argTypesData = {
  // Action Event Handlers
  onSelectedDate: {
    table: {
      disable: true,
    },
  },
  onCloseDatepicker: {
    table: {
      disable: true,
    },
  },
  'selected-date': {
    description: 'Event fired when a date is selected',
    table: {
      type: { summary: 'event' },
    },
  },
  'close-datepicker': {
    description: 'Event fired when user presses the esc key',
    table: {
      type: { summary: 'event' },
    },
  },
  weekStartsOn: {
    control: { type: 'select' },
    options: [0, 1, 2, 3, 4, 5, 6],
    description: 'Day the week starts on. 0 = Sunday, 1 = Monday, … 6 = Saturday.',
    table: { defaultValue: { summary: 0 } },
  },
};

const meta = {
  title: 'Components/Datepicker',
  component: DtDatepicker,
  args: argsData,
  // Vue's argTypes as they are: the event entries name no prop.
  argTypes: argTypesData as unknown as Meta<DatepickerStoryArgs>['argTypes'],
  excludeStories: /.*Data$/,
} satisfies Meta<DatepickerStoryArgs>;

export default meta;
type Story = StoryObj<DatepickerStoryArgs>;

// DatepickerDefault.story.vue
function DatepickerDefault ({
  date, locale, minDate, maxDate, weekStartsOn, onSelectedDate, onCloseDatepicker,
}: DatepickerStoryArgs) {
  const [currentSelectedDate, setCurrentSelectedDate] = useState(() => date ?? new Date());
  const formatLocale = locale ?? null;

  return (
    <div>
      <p>
        Selected date: {String(currentSelectedDate)}
      </p>
      <br />
      <br />
      <table className="d-table">
        <tbody>
          <tr>
            <th>Format</th>
            <th>Result</th>
          </tr>
          <tr>
            <td>formatLong</td>
            <td>{formatLong(currentSelectedDate, formatLocale)}</td>
          </tr>
          <tr>
            <td>formatMedium</td>
            <td>{formatMedium(currentSelectedDate, formatLocale)}</td>
          </tr>
          <tr>
            <td>formatShort</td>
            <td>{formatShort(currentSelectedDate, formatLocale)}</td>
          </tr>
          <tr>
            <td>formatShort (no weekday)</td>
            <td>{formatShort(currentSelectedDate, formatLocale, false)}</td>
          </tr>
          <tr>
            <td>formatNoYear</td>
            <td>{formatNoYear(currentSelectedDate, formatLocale)}</td>
          </tr>
          <tr>
            <td>formatNoYear (abbreviated)</td>
            <td>{formatNoYear(currentSelectedDate, formatLocale, true)}</td>
          </tr>
          <tr>
            <td>formatNumerical</td>
            <td>{formatNumerical(currentSelectedDate, formatLocale)}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <br />
      <DtDatepicker
        selectedDate={currentSelectedDate}
        minDate={minDate}
        maxDate={maxDate}
        weekStartsOn={weekStartsOn}
        onSelectedDate={(selected) => {
          setCurrentSelectedDate(selected);
          onSelectedDate?.(selected);
        }}
        onCloseDatepicker={onCloseDatepicker}
      />
    </div>
  );
}

// DatepickerPopover.story.vue
function DatepickerWithPopover ({ date, opened, onSelectedDate, onCloseDatepicker }: DatepickerStoryArgs) {
  const [currentSelectedDate, setCurrentSelectedDate] = useState(() => date ?? new Date());
  const [datepickerOpened, setDatepickerOpened] = useState(opened ?? false);

  return (
    <div>
      <p>
        Selected date: {String(currentSelectedDate)}
      </p>

      <DtPopover
        open={datepickerOpened}
        initialFocusElement="#prevYearButton"
        padding="none"
        onOpened={(open) => { setDatepickerOpened(open); }}
        anchor={(
          <DtButton
            size={200}
            circle
            importance="clear"
            aria-label="Open datepicker"
            onClick={() => setDatepickerOpened(!datepickerOpened)}
            startIcon={(
              <DtIcon
                name="calendar"
                size="300"
              />
            )}
          />
        )}
        content={(
          <DtDatepicker
            selectedDate={currentSelectedDate}
            onSelectedDate={(selected) => {
              setCurrentSelectedDate(selected);
              onSelectedDate?.(selected);
            }}
            onCloseDatepicker={onCloseDatepicker}
          />
        )}
      />
    </div>
  );
}

export const Default: Story = {
  render: args => <DatepickerDefault {...args} />,
  args: {},
  parameters: {
    // @fixme The a11y tests are run before the aria-labels are being loaded
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-input-field-name',
            reviewOnFail: true,
          },
          {
            id: 'landmark-unique',
            reviewOnFail: true,
          },
        ],
      },
    },
    percy: {
      args: {
        date: defaultDate,
      },
    },
  },
};

export const WithPopover: Story = {
  render: args => <DatepickerWithPopover {...args} />,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    percy: {
      args: {
        opened: true,
        date: defaultDate,
      },
    },
  },
};
