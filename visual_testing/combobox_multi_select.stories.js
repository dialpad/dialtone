import {
  argsData,
  argTypesData,
  Default,
  WithMaxSelectValidation,
} from '@/recipes/comboboxes/combobox_multi_select/combobox_multi_select.stories';
import ComboboxMultiSelect from './combobox_multi_select.mdx';

import DtRecipeComboboxMultiSelect from '@/recipes/comboboxes/combobox_multi_select/combobox_multi_select';

export default {
  title: 'Visual Testing/Combobox Multi-Select',
  component: DtRecipeComboboxMultiSelect,
  parameters: {
    docs: {
      page: ComboboxMultiSelect,
    },
    options: { showPanel: false },
    a11y: {
      disable: true,
    },
  },
  args: { ...argsData, transition: '', showList: true },
  argTypes: argTypesData,
};

export { Default, WithMaxSelectValidation };
