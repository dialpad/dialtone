import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtListItem } from '../ListItem';
import { DtListItemGroup, type DtListItemGroupProps } from './ListItemGroup';

type ListItemGroupStoryArgs = DtListItemGroupProps;

// `type: object` (not in Vue's argTypes) is set on the class props react-docgen reports as a union (a string, an array
// or an object): Storybook drops a URL value for a union arg, and its object type passes every shape through.
const classType = { name: 'object', value: {} } as const;

// Default Prop Values
export const argsData = {
  heading: 'Example Heading',
} satisfies Partial<ListItemGroupStoryArgs>;

export const argTypesData = {
  // Slots
  children: {
    control: false,
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  // Props
  heading: {
    control: 'text',
  },
  headingClass: {
    control: 'object',
    type: classType,
  },
  listClass: {
    control: 'object',
    type: classType,
  },
} satisfies Meta<ListItemGroupStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/List Item Group',
  component: DtListItemGroup,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ListItemGroupStoryArgs>;

export default meta;
type Story = StoryObj<ListItemGroupStoryArgs>;

// ListItemGroupDefault.story.vue
function ListItemGroupDefault (args: ListItemGroupStoryArgs) {
  return (
    <div
      role="listbox"
      aria-label="list"
    >
      <DtListItemGroup
        heading={args.heading}
        headingClass={args.headingClass}
        listClass={args.listClass}
      >
        <DtListItem
          className="d-pis-100"
          role="option"
          navigationType="tab"
        >
          item1
        </DtListItem>
        <DtListItem
          className="d-pis-100"
          role="option"
          navigationType="tab"
        >
          item2
        </DtListItem>
        <DtListItem
          className="d-pis-100"
          role="option"
          navigationType="tab"
        >
          item3
        </DtListItem>
      </DtListItemGroup>
    </div>
  );
}

// Stories
export const Default: Story = {
  render: args => <ListItemGroupDefault {...args} />,
  args: {},
};
