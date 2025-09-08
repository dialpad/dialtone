import DtTabPanel from './tab_panel.vue';

// Default Prop Values
export const argsData = {
  id: '1',
  tabId: '1',
};

export const argTypesData = {
};

// Story Collection
export default {
  title: 'Components/Tabs',
  component: DtTabPanel,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const TabPanel = {
  render: (args, { argTypes }) => ({
    components: { DtTabPanel },
    props: Object.keys(argTypes),
    provide: {
      groupContext: {
        selected: '1',
        disabled: false,
      },
    },
    template: `<DtTabPanel v-bind="$props">
                Tab panel content
               </DtTabPanel>`,
  }),
};
