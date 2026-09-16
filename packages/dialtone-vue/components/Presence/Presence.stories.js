import { createTemplateFromVueFile } from '@/common/storybook_utils';

import DtPresence from './Presence.vue';
import { PRESENCE_STATES_LIST } from './PresenceConstants';
import PresenceDefaultTemplate from './PresenceDefault.story.vue';
import PresenceVariantsTemplate from './PresenceVariants.story.vue';

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
  showIcon: {
    description: 'Renders a state-specific glyph inside the colored circle.',
    control: 'boolean',
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
