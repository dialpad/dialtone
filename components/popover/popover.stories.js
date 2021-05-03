import {
  HsPopover,
  POPOVER_PADDING_CLASSES,
  POPOVER_HORIZONTAL_ALIGNMENT,
  POPOVER_VERTICAL_ALIGNMENT,
  POPOVER_ROLES,
} from './';
import PopoverDefault from './popover_default.story.vue';
import { createTemplateFromVueFile } from '../storybook_utils';
import PopoverMdx from './popover.mdx';

const argTypesData = {
  id: {
    defaultValue: 'HsPopover__content0',
    table: {
      defaultValue: {
        summary: 'Automatically generated unique ID',
      },
    },
  },
  padding: {
    control: {
      type: 'select',
      options: POPOVER_PADDING_CLASSES,
    },
  },
  role: {
    control: {
      type: 'select',
      options: POPOVER_ROLES,
    },
  },
  fixedAlignment: {
    control: {
      type: 'select',
      options: POPOVER_HORIZONTAL_ALIGNMENT,
    },
  },
  fixedVerticalAlignment: {
    control: {
      type: 'select',
      options: POPOVER_VERTICAL_ALIGNMENT,
    },
  },
};

export default {
  title: 'Elements/Popovers',
  component: HsPopover,
  argTypes: argTypesData,
  parameters: {
    docs: {
      page: PopoverMdx,
    },
  },
  excludeStories: /.Data$/,
};

const Template = (args, { argTypes }) => createTemplateFromVueFile(args, argTypes, PopoverDefault);

export const Default = Template.bind({});
Default.args = {};
Default.decorators = [() => ({
  template: '<div class="d-height1"><story /></div>',
})];
Default.parameters = {
  docs: {
    source: {
      code: `
<hs-popover :open.sync="open">
  <template #anchor="{ attrs }">
    <hs-button
      v-bind="attrs"
      @click="open = !open"
    >
      Click to open
    </hs-button>
  </template>
  <template #content>
    <p>I will be displayed in the popover!</p>
  </template>
</hs-popover>
    `,
    },
  },
};

export const FixedRight = Template.bind({});
FixedRight.args = { ...Default.args, fixedAlignment: 'right' };
FixedRight.decorators = [() => ({
  template: '<div class="d-height1 d-ta-right"><story /></div>',
})];
FixedRight.parameters = {
  docs: {
    source: {
      code: `
<hs-popover fixedAlignment="right">
  <template #anchor="{ attrs }"></template>
  <template #content></template>
</hs-popover>
    `,
    },
  },
};

export const NoPadding = Template.bind({});
NoPadding.args = { ...Default.args, padding: 'none', open: true };
NoPadding.parameters = {
  docs: {
    source: {
      code: `
<hs-popover padding="none">
  <template #anchor="{ attrs }"></template>
  <template #content></template>
</hs-popover>
    `,
    },
  },
};
