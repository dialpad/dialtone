import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { action } from '@storybook/addon-actions';
import DtDatepicker from './datepicker.vue';
import DtDatepickerDefaultTemplate from './datepicker_default.story.vue';

export const argsData = {
  prevMonthLabel: 'Previous month',
  nextMonthLabel: 'Next month',
  prevYearLabel: 'Previous year',
  nextYearLabel: 'Next year',
  onSelectedDate: action('selected-date'),
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

  // Action Event Handlers
  onSelectedDate: {
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
};

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

// Stories
export const Default = {
  render: Template,
  args: {},
};
