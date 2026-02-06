import { action } from '@storybook/addon-actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtRecipeMotionText from './motion_text.vue';
import {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
} from './motion_text_constants';

import DtRecipeMotionTextDefaultTemplate from './motion_text_default.story.vue';
import DtRecipeMotionTextModesTemplate from './motion_text_modes.story.vue';
import DtRecipeMotionTextVariantsTemplate from './motion_text_variants.story.vue';

// Default Prop Values
export const argsData = {
  text: 'Experience the magic of animated text',
  animationMode: 'gradient-in',
  speed: 'md',
  autoStart: true,
  loop: false,
  respectsReducedMotion: true,
  screenReaderText: '',
  onStart: action('start'),
  onComplete: action('complete'),
  onProgress: action('progress'),
  onPause: action('pause'),
  onResume: action('resume'),
};

export const argTypesData = {
  // Props
  text: {
    control: 'text',
    description: 'The text content to animate',
    table: {
      type: {
        summary: 'string',
      },
    },
  },
  animationMode: {
    control: {
      type: 'select',
    },
    options: MOTION_TEXT_ANIMATION_MODES,
    description: 'The animation mode to use for the text reveal',
    table: {
      type: {
        summary: MOTION_TEXT_ANIMATION_MODES.join(' | '),
      },
      defaultValue: {
        summary: 'gradient-in',
      },
    },
  },
  speed: {
    control: {
      type: 'select',
    },
    options: MOTION_TEXT_SPEEDS,
    description: 'Animation speed using t-shirt sizing (sm: fast, md: medium, lg: slow)',
    table: {
      type: {
        summary: MOTION_TEXT_SPEEDS.join(' | '),
      },
      defaultValue: {
        summary: 'md',
      },
    },
  },
  autoStart: {
    control: 'boolean',
    description: 'Whether to start animation automatically when component is mounted',
    table: {
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'true',
      },
    },
  },
  loop: {
    control: 'boolean',
    description: 'Whether to loop the animation continuously',
    table: {
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'false',
      },
    },
  },
  respectsReducedMotion: {
    control: 'boolean',
    description: 'Whether to respect the user\'s prefers-reduced-motion system setting',
    table: {
      type: {
        summary: 'boolean',
      },
      defaultValue: {
        summary: 'true',
      },
    },
  },
  screenReaderText: {
    control: 'text',
    description: 'Alternative text for screen readers',
    table: {
      type: {
        summary: 'string',
      },
    },
  },

  // Slots
  default: {
    name: 'default',
    description: 'Slot for text content when not using the text prop',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'text/html',
      },
    },
  },

  // Action Event Handlers
  start: {
    description: 'Emitted when the animation starts',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  complete: {
    description: 'Emitted when the animation completes',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  progress: {
    description: 'Emitted during animation progress with wordsComplete, totalWords, and progress percentage',
    table: {
      disable: false,
      type: {
        summary: 'event',
        detail: '{ wordsComplete: number, totalWords: number, progress: number }',
      },
    },
  },
  pause: {
    description: 'Emitted when the animation is paused',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  resume: {
    description: 'Emitted when the animation resumes',
    table: {
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  onStart: {
    table: {
      disable: true,
    },
  },
  onComplete: {
    table: {
      disable: true,
    },
  },
  onProgress: {
    table: {
      disable: true,
    },
  },
  onPause: {
    table: {
      disable: true,
    },
  },
  onResume: {
    table: {
      disable: true,
    },
  },
};

// Story Collection
export default {
  title: 'Recipes/Motion/Motion Text',
  component: DtRecipeMotionText,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeMotionTextDefaultTemplate,
);

const ModesTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeMotionTextModesTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtRecipeMotionTextVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,

  args: {
    text: 'Welcome to Dialtone Motion Text',
  },
};

export const Modes = {
  render: ModesTemplate,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};

export const Variants = {
  render: VariantsTemplate,
  args: {},
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
  },
};
