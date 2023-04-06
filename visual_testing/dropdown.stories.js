import {
  argsData,
  argTypesData,
  Default,
  Variants,
} from '@/components/dropdown/dropdown.stories';
import DropdownMdx from './dropdown.mdx';

import DtDropdown from '@/components/dropdown/dropdown';

export default {
  title: 'Visual Testing/Dropdown',
  component: DtDropdown,
  args: {
    ...argsData,
    transition: '',
    open: true,
  },
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    docs: {
      page: DropdownMdx,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
};
export { Default, Variants };
