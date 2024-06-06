import DtEmptyState from './empty_state.vue';
import { EMPTY_STATE_SIZE_MODIFIERS } from './empty_state_constants.js';
import DtEmptyStateDefaultTemplate from './empty_state_default.story.vue';
import { createTemplateFromVueFile, getIconNames, getIllustrationNames } from '@/common/storybook_utils';
import DtIllustrationDefaultTemplate from '@/components/illustration/illustration_default.story.vue';

const illustrationsList = getIllustrationNames();
const iconsList = getIconNames();

export const argTypesData = {
  // Slots
  body: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  // Props
  size: {
    options: Object.keys(EMPTY_STATE_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  illustrationName: {
    options: illustrationsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  iconName: {
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  headerText: {
    control: {
      type: 'text',
    },
  },
  bodyText: {
    control: {
      type: 'text',
    },
  },
  showIllustration: {
    control: {
      type: 'boolean',
    },
  },
};

export const argsData = {};

export default {
  title: 'Components/Empty State',
  component: DtEmptyState,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtEmptyStateDefaultTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    illustrationName: 'mind',
    size: 'lg',
    headerText: 'Nothing to see here',
    bodyText: 'Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque.',
    body: '<div class="d-mt8 d-stack d-stack--row d-stack--gap-300"><button class="d-btn">Click me</button><button class="d-btn d-btn--primary">Click me</button></div>',
  },
};
