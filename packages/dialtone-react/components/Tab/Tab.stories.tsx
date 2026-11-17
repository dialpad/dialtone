import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtTab, type DtTabProps } from './Tab';
import { DEFAULT_TAB_GROUP_STATE, TabGroupContext } from './TabGroupContext';

// Default Prop Values
export const argsData = {
  id: '1',
  panelId: '1',
  selected: true,
} satisfies Partial<DtTabProps>;

export const argTypesData = {
} satisfies Meta<DtTabProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Tabs',
  component: DtTab,
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
} satisfies Meta<DtTabProps>;

export default meta;
type Story = StoryObj<DtTabProps>;

// Vue's story provides a fixed group context, outside any DtTabGroup: nothing in it changes, so the tab stays as
// it first rendered.
const groupContextValue = {
  groupContext: { ...DEFAULT_TAB_GROUP_STATE, selected: '', disabled: false },
  setFocus: action('setFocus'),
  setSelected: action('changeContentPanel'),
};

export const Tab: Story = {
  render: args => (
    <TabGroupContext.Provider value={groupContextValue}>
      <DtTab {...args}>
        Tab
      </DtTab>
    </TabGroupContext.Provider>
  ),
};
