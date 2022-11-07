import { createTemplateFromVueFile } from '@/common/storybook_utils';
import PresenceMdx from './presence.mdx';
import Presence from './presence.vue';
import { PRESENCE_STATES_LIST } from './presence_constants';
import PresenceDefaultTemplate from './presence_default.story.vue';
import PresenceVariantsTemplate from './presence_variants.story.vue';

export const argTypesData = {
  presence: {
    table: {
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'select',
      options: [...PRESENCE_STATES_LIST],
    },
  },
  srText: {
    control: {
      type: 'text',
    },
  },
};

// Story Collection
export default {
  title: 'Components/Presence',
  component: Presence,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: PresenceMdx,
    },
    options: {
      showPanel: true,
    },
  },
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  PresenceDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  PresenceVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
