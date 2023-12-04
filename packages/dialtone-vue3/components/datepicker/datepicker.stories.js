import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtDatepicker from './datepicker.vue';
import DtDatepickerDefaultTemplate from './datepicker_default.story.vue';
import DtDatepickerWithPopoverTemplate from './datepicker_popover.story.vue';

const defaultDate = new Date('2023-01-01T00:00:00');

export const argsData = {
  locale: 'en-US',
  changeToLabel: 'Change to',
  prevMonthLabel: 'Previous month',
  nextMonthLabel: 'Next month',
  prevYearLabel: 'Previous year',
  nextYearLabel: 'Next year',
  selectDayLabel: 'Select day',
  onSelectedDate: action('selected-date'),
  onCloseDatepicker: action('close-datepicker'),
  date: new Date(),
  opened: false,
};

export const argTypesData = {
  // Props
  prevMonthLabel: {
    control: 'text',
    table: {
      category: 'props',
      type: {
        summary: 'String',
      },
    },
  },
  nextMonthLabel: {
    control: 'text',
    table: {
      category: 'props',
      type: {
        summary: 'String',
      },
    },
  },
  prevYearLabel: {
    control: 'text',
    table: {
      category: 'props',
      type: {
        summary: 'String',
      },
    },
  },
  nextYearLabel: {
    control: 'text',
    table: {
      category: 'props',
      type: {
        summary: 'String',
      },
    },
  },
  selectDayLabel: {
    control: 'text',
    table: {
      category: 'props',
      type: {
        summary: 'String',
      },
    },
  },
  changeToLabel: {
    control: 'text',
    table: {
      category: 'props',
      type: {
        summary: 'String',
      },
    },
  },

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

// Story Collection
export default {
  title: 'Components/Datepicker',
  component: DtDatepicker,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const Template = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtDatepickerDefaultTemplate,
);

const WithPopoverTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtDatepickerWithPopoverTemplate,
);

export const Default = {
  render: Template,
  args: {},
  parameters: {
    percy: {
      args: {
        date: defaultDate,
      },
    },
  },
};

export const WithPopover = {
  render: WithPopoverTemplate,
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
