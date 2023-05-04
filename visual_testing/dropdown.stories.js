import { argsData, argTypesData, Default, Variants } from '@/components/dropdown/dropdown.stories';

import DtDropdown from '@/components/dropdown/dropdown.vue';

export default {
  title: 'Visual Testing/Dropdown',
  component: DtDropdown,
  args: {
    ...argsData,
    transition: '',
    modal: false,
    open: true,
  },
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      inlineStories: false,
    },
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
};
export { Default, Variants };
