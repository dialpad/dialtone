import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtButton } from '../Button/Button';
import { DtButtonGroup, type DtButtonGroupProps } from './ButtonGroup';
import { BUTTON_GROUP_ALIGNMENT } from './ButtonGroupConstants';

type ButtonGroupStoryArgs = DtButtonGroupProps;

export const argsData = {
  alignment: 'start',
} satisfies Partial<ButtonGroupStoryArgs>;

export const argTypesData = {
  // Slots
  children: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  alignment: {
    control: 'select',
    options: Object.keys(BUTTON_GROUP_ALIGNMENT),
  },
} satisfies Meta<ButtonGroupStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Button Group',
  component: DtButtonGroup,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ButtonGroupStoryArgs>;

export default meta;
type Story = StoryObj<ButtonGroupStoryArgs>;

// ButtonGroupDefault.story.vue
function ButtonGroupDefault (args: ButtonGroupStoryArgs) {
  return (
    <DtButtonGroup alignment={args.alignment} className="d-gg8">
      {args.children ?? (
        args.alignment === 'end'
          ? (
            <>
              <DtButton importance="outlined">Cancel</DtButton>
              <DtButton importance="primary">Confirm</DtButton>
            </>
          )
          : (
            <>
              <DtButton importance="primary">Confirm</DtButton>
              <DtButton importance="outlined">Cancel</DtButton>
            </>
          )
      )}
    </DtButtonGroup>
  );
}

export const Default: Story = {
  render: args => <ButtonGroupDefault {...args} />,
  args: {},
};
