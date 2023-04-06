import {
  argsData,
  argTypesData,
  Default,
} from '@/recipes/comboboxes/combobox_with_popover/combobox_with_popover.stories';
import ComboboxWithPopover from './combobox_with_popover.mdx';

import DtRecipeComboboxWithPopover from '@/recipes/comboboxes/combobox_with_popover/combobox_with_popover';

export default {
  title: 'Visual Testing/Combobox With Popover',
  component: DtRecipeComboboxWithPopover,
  parameters: {
    docs: {
      page: ComboboxWithPopover,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, transition: '', showList: true },
  argTypes: argTypesData,
};

export { Default };
