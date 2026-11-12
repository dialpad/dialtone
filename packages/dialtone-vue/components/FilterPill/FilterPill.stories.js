import { createTemplateFromVueFile } from '@/common/storybook_utils';

import DtFilterPill from './FilterPill.vue';
import { FILTER_PILL_OVERLAY_MIN_INLINE_SIZE_VALUES } from './FilterPillConstants';
import DtFilterPillDefaultTemplate from './FilterPillDefault.story.vue';
import DtFilterPillVariantsTemplate from './FilterPillVariants.story.vue';
import DtFilterPillCustomContentTemplate from './FilterPillCustomContent.story.vue';
import DtFilterPillControlledTemplate from './FilterPillControlled.story.vue';
import DtFilterPillCloseBeforeRemovalTemplate from './FilterPillCloseBeforeRemoval.story.vue';
import { action } from 'storybook/actions';
import { BUTTON_SIZE_MODIFIERS } from '@/components/Button';
import { POPOVER_DIRECTIONS, POPOVER_PADDING_CLASSES } from '@/components/Popover/index.js';
import { CONTENT_MODE_ARG_TYPE } from '@/common/mode_constants';
import { DtStack } from '@/components/Stack';

// Set default values at the story level here.
export const argsData = {
  label: 'Fruit',
  useDropdown: false,
  deferSelection: false,
  readOnly: false,
  onOpen: action('open'),
  onClear: action('clear'),
  onApply: action('apply'),
  onUpdateModelValue: action('update:modelValue'),
  modelValue: [
    { name: 'Orange', active: true },
    { name: 'Apple' },
    { name: 'Avocado' },
    { name: 'Grapefruit' },
    { name: 'Strawberry' },
  ],
};

export const argTypesData = {
  // Slots
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  contentMode: CONTENT_MODE_ARG_TYPE,
  size: {
    control: 'select',
    options: Object.keys(BUTTON_SIZE_MODIFIERS),
  },
  overlayMinInlineSize: {
    control: 'select',
    options: FILTER_PILL_OVERLAY_MIN_INLINE_SIZE_VALUES,
    table: {
      defaultValue: { summary: 'anchor' },
    },
  },
  popoverPadding: {
    table: {
      defaultValue: { summary: 'd-py-100 d-px-150' },
    },
    options: Object.keys(POPOVER_PADDING_CLASSES),
    control: {
      type: 'select',
    },
  },
  popoverPlacement: {
    options: POPOVER_DIRECTIONS,
    control: {
      type: 'select',
    },
  },

  popoverContentClass: {
    control: 'text',
  },
  popoverHeaderClass: {
    control: 'text',
  },
  popoverFooterClass: {
    control: 'text',
  },
  popoverDialogClass: {
    control: 'text',
  },
  dropdownListClass: {
    control: 'text',
  },

  startTooltipText: {
    control: 'text',
  },
  endTooltipText: {
    control: 'text',
  },

  // Events: Exclude this from the table as event names will automatically be added from the component itself.
  onClear: {
    action: 'clear',
    table: {
      disable: true,
    },
  },

  onOpen: {
    action: 'open',
    table: {
      disable: true,
    },
  },

  onApply: {
    action: 'apply',
    table: {
      disable: true,
    },
  },

  onUpdateModelValue: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Components/Filter Pill',
  component: DtFilterPill,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtFilterPillDefaultTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtFilterPillVariantsTemplate,
);

// Stories
export const Default = {
  render: DefaultTemplate,
  decorators: [
    () => ({
      template: `<div><story /></div>`,
    }),
  ],
};

export const Variants = {
  render: VariantsTemplate,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};

export const CustomContent = {
  render: () => ({
    components: { DtFilterPillCustomContentTemplate },
    template: '<dt-filter-pill-custom-content-template />',
  }),
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};

export const SelectionSummaries = {
  render: () => ({
    components: { DtFilterPill, DtStack },
    template: `
      <dt-stack direction="row" gap="400">
        <dt-filter-pill
          label="All teams"
          :model-value="[{ name: 'Support', active: true }, { name: 'Sales', active: true }]"
        />
        <dt-filter-pill
          label="Two teams"
          :model-value="[{ name: 'Support', active: true }, { name: 'Sales', active: true }, { name: 'Engineering' }]"
        />
        <dt-filter-pill
          label="Three teams"
          :model-value="[{ name: 'Support', active: true }, { name: 'Sales', active: true }, { name: 'Engineering', active: true }, { name: 'Marketing' }]"
        />
      </dt-stack>
    `,
  }),
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};


export const ControlledSelection = {
  render: () => ({
    components: { DtFilterPillControlledTemplate },
    template: '<dt-filter-pill-controlled-template />',
  }),
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};

export const ControlledOpenMenu = {
  render: () => ({
    components: { DtFilterPillControlledTemplate },
    template: '<dt-filter-pill-controlled-template initial-menu-open />',
  }),
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};

export const ControlledCloseBeforeRemoval = {
  render: () => ({
    components: { DtFilterPillCloseBeforeRemovalTemplate },
    template: '<dt-filter-pill-close-before-removal-template />',
  }),
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};

export const ControlledDropdownCloseBeforeRemoval = {
  render: () => ({
    components: { DtFilterPillCloseBeforeRemovalTemplate },
    template: '<dt-filter-pill-close-before-removal-template use-dropdown />',
  }),
  parameters: { options: { showPanel: false }, controls: { disable: true }, a11y: { context: 'body' } },
};
