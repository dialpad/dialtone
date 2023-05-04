import {
  argsData,
  argTypesData,
  Default,
  WithMaxSelectValidation,
} from '@/recipes/comboboxes/combobox_multi_select/combobox_multi_select.stories.js';

import DtRecipeComboboxMultiSelect from '@/recipes/comboboxes/combobox_multi_select/combobox_multi_select.vue';

export default {
  title: 'Visual Testing/Combobox Multi-Select',
  component: DtRecipeComboboxMultiSelect,
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, transition: '', showList: true },
  argTypes: argTypesData,
};

export { Default, WithMaxSelectValidation };
