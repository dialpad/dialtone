import {
  argsData,
  argTypesData,
  Default,
} from '@/recipes/comboboxes/combobox_with_popover/combobox_with_popover.stories.js';

import DtRecipeComboboxWithPopover from '@/recipes/comboboxes/combobox_with_popover/combobox_with_popover.vue';

export default {
  title: 'Visual Testing/Combobox With Popover',
  component: DtRecipeComboboxWithPopover,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
  // set appendTo 'parent' or sometimes the dialog stays open even after switching page
  args: { ...argsData, transition: '', showList: true, appendTo: 'parent' },
  argTypes: argTypesData,
};

export { Default };
