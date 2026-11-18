import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtSegmentedControlItem, type DtSegmentedControlItemProps } from './SegmentedControlItem';
import {
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  type SegmentedControlGroupContext,
} from './SegmentedControlConstants';

export const argsData = {
  value: 'option1',
  label: undefined,
  disabled: false,
} satisfies Partial<DtSegmentedControlItemProps>;

export const argTypesData = {} satisfies Meta<DtSegmentedControlItemProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Segmented Control',
  component: DtSegmentedControlItem,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-required-parent',
            enabled: false,
          },
        ],
      },
    },
  },
} satisfies Meta<DtSegmentedControlItemProps>;

export default meta;
type Story = StoryObj<DtSegmentedControlItemProps>;

// Vue's story provides the group's three injection keys; here they're the contexts of the same names.
const groupContext: SegmentedControlGroupContext = {
  selected: 'option1',
  disabled: false,
  size: SEGMENTED_CONTROL_SIZE_DEFAULT,
  labelClass: '',
};

export const SegmentedControlItem: Story = {
  render: args => (
    <SEGMENTED_CONTROL_CONTEXT_KEY.Provider value={groupContext}>
      <SEGMENTED_CONTROL_SELECT_KEY.Provider value={action('selectValue')}>
        <SEGMENTED_CONTROL_FOCUS_KEY.Provider value={action('setFocus')}>
          <DtSegmentedControlItem {...args}>Option 1</DtSegmentedControlItem>
        </SEGMENTED_CONTROL_FOCUS_KEY.Provider>
      </SEGMENTED_CONTROL_SELECT_KEY.Provider>
    </SEGMENTED_CONTROL_CONTEXT_KEY.Provider>
  ),
};
