import DtSegmentedControlItem from './SegmentedControlItem.vue';
import {
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
} from './SegmentedControlConstants';
import { action } from 'storybook/actions';

export const argsData = {
  value: 'option1',
  label: undefined,
  disabled: false,
};

export const argTypesData = {};

// Story Collection
export default {
  title: 'Components/Segmented Control',
  component: DtSegmentedControlItem,
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

export const SegmentedControlItem = {
  render: (args, { argTypes }) => ({
    components: { DtSegmentedControlItem },
    props: Object.keys(argTypes),
    provide: {
      [SEGMENTED_CONTROL_CONTEXT_KEY]: {
        selected: 'option1',
        disabled: false,
        size: SEGMENTED_CONTROL_SIZE_DEFAULT,
        labelClass: '',
      },
      [SEGMENTED_CONTROL_SELECT_KEY]: action('selectValue'),
      [SEGMENTED_CONTROL_FOCUS_KEY]: action('setFocus'),
    },
    template: '<dt-segmented-control-item v-bind="$props">Option 1</dt-segmented-control-item>',
  }),
};
