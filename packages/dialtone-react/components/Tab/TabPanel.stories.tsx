import type { Meta, StoryObj } from '@storybook/react-vite';
import { DEFAULT_TAB_GROUP_STATE, TabGroupContext } from './TabGroupContext';
import { DtTabPanel, type DtTabPanelProps } from './TabPanel';

// Default Prop Values
export const argsData = {
  id: '1',
  tabId: '1',
} satisfies Partial<DtTabPanelProps>;

export const argTypesData = {
} satisfies Meta<DtTabPanelProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Tabs',
  component: DtTabPanel,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtTabPanelProps>;

export default meta;
type Story = StoryObj<DtTabPanelProps>;

// Vue's story provides a fixed group context with panel 1 selected, outside any DtTabGroup.
const groupContextValue = {
  groupContext: { ...DEFAULT_TAB_GROUP_STATE, selected: '1', disabled: false },
  setFocus: () => {},
  setSelected: () => {},
};

export const TabPanel: Story = {
  render: args => (
    <TabGroupContext.Provider value={groupContextValue}>
      <DtTabPanel {...args}>
        Tab panel content
      </DtTabPanel>
    </TabGroupContext.Provider>
  ),
};
