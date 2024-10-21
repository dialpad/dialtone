import { createRenderConfig, getIconNames, getIllustrationNames } from '@/common/storybook_utils';
import DtEmptyState from './empty_state.vue';
import DtEmptyStateDefaultTemplate from './empty_state_default.story.vue';
import { EMPTY_STATE_SIZE_MODIFIERS } from './empty_state_constants.js';

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
  icon: {
    options: iconsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  illustration: {
    options: illustrationsList,
    table: {
      type: { summary: 'VNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
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
};

export const argsData = {
  icon: undefined,
  illustration: undefined,
};

export default {
  title: 'Components/Empty State',
  component: DtEmptyState,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

export const Default = {
  render: (argsData) => createRenderConfig(DtEmptyState, DtEmptyStateDefaultTemplate, argsData),

  args: {
    illustration: 'mind',
    size: 'lg',
    headerText: 'Nothing to see here',
    bodyText: 'Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque.',
    body: '<div class="d-mt8 d-stack d-stack--row d-stack--gap-300"><button class="d-btn">Click me</button><button class="d-btn d-btn--primary">Click me</button></div>',
  },
};
