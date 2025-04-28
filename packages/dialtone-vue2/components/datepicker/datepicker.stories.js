import { action } from '@storybook/addon-actions';
import { createRenderConfig } from '@/common/storybook_utils';
import DtDatepicker from './datepicker.vue';
import DtDatepickerDefaultTemplate from './datepicker_default.story.vue';
import DtDatepickerWithPopoverTemplate from './datepicker_popover.story.vue';

const defaultDate = new Date('2023-01-01T00:00:00');

export const argsData = {
  onSelectedDate: action('selected-date'),
  onCloseDatepicker: action('close-datepicker'),
  date: new Date(),
  opened: false,
};

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
};

export default {
  title: 'Components/Datepicker',
  component: DtDatepicker,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtDatepicker, DtDatepickerDefaultTemplate, argsData),
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

export const WithPopover = {
  render: (argsData) => createRenderConfig(DtDatepicker, DtDatepickerWithPopoverTemplate, argsData),
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
