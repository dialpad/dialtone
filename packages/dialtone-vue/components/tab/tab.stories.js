import DtTab from './tab.vue';
import { action } from '@storybook/addon-actions';

// Default Prop Values
export const argsData = {
  id: '1',
  panelId: '1',
  selected: true,
};

export const argTypesData = {
};

// Story Collection
export default {
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
};

export const Tab = {
  render: (args, { argTypes }) => ({
    components: { DtTab },
    props: Object.keys(argTypes),
    provide: {
      setFocus: action('setFocus'),
      changeContentPanel: action('changeContentPanel'),
      groupContext: {
        selected: '',
        disabled: false,
      },
    },
    template: `<DtTab v-bind="$props">
                Tab
               </DtTab>`,
  }),
};
