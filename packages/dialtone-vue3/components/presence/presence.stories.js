import { createTemplateFromVueFile } from '@/common/storybook_utils';

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

export const Default = {
  render: DefaultTemplate,
  args: {},
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: { options: { showPanel: false }, controls: { disable: true } },
};
