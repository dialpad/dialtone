import type { Meta, StoryObj } from '@storybook/react-vite';
import { DT_STACK_GAP } from '../Stack/StackConstants';
import { DtDescriptionList, type DtDescriptionListProps } from './DescriptionList';

type DescriptionListStoryArgs = DtDescriptionListProps;

// `type: object` (not in Vue's argTypes) is set on the class props react-docgen reports as a union (a string, an array
// or an object): Storybook drops a URL value for a union arg, and its object type passes every shape through.
const classType = { name: 'object', value: {} } as const;

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
    options: [...DT_STACK_GAP],
    control: {
      type: 'select',
    },
  },
  termClass: {
    control: 'object',
    type: classType,
    description: 'Additional class name for the term elements.',
  },
  descriptionClass: {
    control: 'object',
    type: classType,
    description: 'Additional class name for the description elements.',
  },
} satisfies Meta<DescriptionListStoryArgs>['argTypes'];

export const argsData = {
  direction: 'row',
  gap: '100',
  items: [
    {
      term: 'Customer Intent',
      description: 'Hello, I\'m looking to return my TV',
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
} satisfies Partial<DescriptionListStoryArgs>;

const longTextItems = [
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
];

// Story Collection
const meta = {
  title: 'Components/Description List',
  component: DtDescriptionList,
  args: argsData,
  argTypes: argTypesData,
  // Vue's decorator also sets `borderRadius: …` in a style string, which isn't a CSS property, so the browser ignores it.
  decorators: [
    Story => (
      <div
        style={{
          width: 'var(--dt-layout-500)',
          overflow: 'hidden',
          resize: 'horizontal',
          height: 'auto',
          border: '1px solid var(--dt-color-border-subtle)',
          padding: 'var(--dt-spacing-150)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  excludeStories: /.*Data$/,
} satisfies Meta<DescriptionListStoryArgs>;

export default meta;
type Story = StoryObj<DescriptionListStoryArgs>;

// DescriptionListDefault.story.vue
function DescriptionListDefault (args: DescriptionListStoryArgs) {
  return (
    <DtDescriptionList
      gap={args.gap}
      items={args.items}
      direction={args.direction}
      termClass={args.termClass}
      descriptionClass={args.descriptionClass}
    />
  );
}

// Stories
export const Default: Story = {
  render: args => <DescriptionListDefault {...args} />,
  args: {},
};

export const ColumnDirection: Story = {
  render: args => <DescriptionListDefault {...args} />,
  args: {
    direction: 'column',
  },
};

export const LongText: Story = {
  render: args => <DescriptionListDefault {...args} />,
  args: { items: longTextItems },
};

export const WithStyles: Story = {
  render: args => <DescriptionListDefault {...args} />,
  args: { termClass: ['d-fw-bold', 'd-fc-disabled'] },
};
