import {
  argsData,
  argTypesData,
  Default,
  Variants,
} from '@/components/dropdown/dropdown.stories';
import DropdownMdx from './dropdown.mdx';

export default {
  title: 'Visual Testing/Dropdown',
  args: {
    ...argsData,
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
