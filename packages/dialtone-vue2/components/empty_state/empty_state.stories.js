import DtEmptyState from './empty_state.vue';
import { EMPTY_STATE_SIZE_MODIFIERS } from './empty_state_constants.js';
import DtEmptyStateDefaultTemplate from './empty_state_default.story.vue';
import { createRenderConfig, getIconNames, getIllustrationNames } from '@/common/storybook_utils';

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

export const Default = {
  render: (argsData) => createRenderConfig(DtEmptyState, DtEmptyStateDefaultTemplate, argsData),

  args: {
    illustrationName: 'mind',
    size: 'lg',
    headerText: 'Nothing to see here',
    bodyText: 'Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque.',
    body: '<div class="d-mt8 d-stack d-stack--row d-stack--gap-300"><button data-qa="dt-button" type="button" class="base-button__button d-btn"><!----><span data-qa="dt-button-label" class="d-btn__label base-button__label"> Click me </span></button><button data-qa="dt-button" type="button" class="base-button__button d-btn d-btn--primary"><!----><span data-qa="dt-button-label" class="d-btn__label base-button__label">Click me</span></button></div>',
  },
};
