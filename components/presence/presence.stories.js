import { createTemplateFromVueFile } from '@/common/storybook_utils';
import PresenceMdx from './presence.mdx';
import DtPresence from './presence.vue';
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
    options: [...PRESENCE_STATES_LIST],
    control: 'select',
  },
  srText: {
    description: 'Screen reader text read out whenver the presence changes',
    control: 'text',
  },
};

// Story Collection
export default {
  title: 'Components/Presence',
  component: DtPresence,
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
const DefaultTemplate = (args) => createTemplateFromVueFile(
  args,
  PresenceDefaultTemplate,
);
const VariantsTemplate = (args) => createTemplateFromVueFile(
  args,
  PresenceVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = { controls: { disable: true }, actions: { disable: true }, options: { showPanel: false } };
