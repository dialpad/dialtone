import { createTemplateFromVueFile } from '@/common/storybook_utils';
import { DT_STACK_GAP } from '@/components/stack/stack_constants';
import DtDescriptionList from './description_list.vue';
import DtDescriptionListDefaultTemplate from './description_list_default.story.vue';

export const argTypesData = {
  // Props
  items: {
    control: 'object',
    table: {
      defaultValue: {
        summary: '{ term: string, description: string }[]',
      },
    },
  },
  direction: {
    options: ['row', 'column'],
    control: { type: 'radio' },
  },
  gap: {
    options: DT_STACK_GAP,
    control: {
      type: 'select',
    },
  },
};

export const argsData = {
  direction: 'row',
  gap: '400',
  items: [
    {
      term: 'Customer Intent',
      description: `Hello, I'm looking to return my TV`,
    },
    {
      term: 'Reason',
      description: 'Refound',
    },
    {
      term: 'Country',
      description: 'England',
    },
    {
      term: 'Random',
      description: 'Value',
    },
  ],
};

const argsDataLongText = {
  items: [
    {
      term: 'Customer Intent',
      description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
    },
    {
      term: 'Three word term',
      description: ` Duis aute irure dolor in reprehenderit in voluptate velit
      esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
      cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    },
    {
      term: 'Country',
      description: 'England',
    },
    {
      term: 'Random',
      description: 'Value',
    },
  ],
};

const decorator = () => ({
  template: `<div
      style="width: var(--dt-size-925);
      overflow: hidden;
      resize: horizontal;
      height: auto;
      border: 1px solid var(--dt-color-border-subtle);
      padding: var(--dt-space-450);
      borderRadius: var(--dt-size-radius-400);"
      >
      <story />
    </div>`,
});

// Story Collection
export default {
  title: 'Components/Description List',
  component: DtDescriptionList,
  args: argsData,
  argTypes: argTypesData,
  decorators: [decorator],
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtDescriptionListDefaultTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const ColumnDirection = {
  ...Default,
  args: {
    direction: 'column',
  },
};

export const LongText = {
  ...Default,
  args: { ...Default.args, items: argsDataLongText.items },
};

export const WithStyles = {
  ...Default,
  args: { ...Default.args, termClass: ['d-fw-bold', 'd-fc-disabled'] },
};
