import { action } from 'storybook/actions';
import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtMotionText from './MotionText.vue';
import {
  MOTION_TEXT_ANIMATION_MODES,
  MOTION_TEXT_SPEEDS,
} from './MotionTextConstants';

import DtMotionTextDefaultTemplate from './MotionTextDefault.story.vue';
import DtMotionTextModesTemplate from './MotionTextModes.story.vue';
import DtMotionTextVariantsTemplate from './MotionTextVariants.story.vue';

// Default Prop Values
export const argsData = {
  // Reference sentence used by the "Motion-Text-Effects" Figma spec
  text: 'The AI platform for customer experience',
  animationMode: 'gradient-in',
  speed: '300',
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
    description: 'The text content to animate. Text is split into words and animated word by word.',
    table: {
      category: 'props',
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
    description: 'The word-by-word animation to play. gradient-in, fade-in, slide-in and slide-in-gradient reveal ' +
      'the text; gradient-sweep and shimmer play over text that is already visible.',
    table: {
      category: 'props',
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
    description: 'Animation speed. 300 plays the motion as designed; lower values are faster and higher values are slower.',
    table: {
      category: 'props',
      type: {
        summary: MOTION_TEXT_SPEEDS.join(' | '),
      },
      defaultValue: {
        summary: '300',
      },
    },
  },
  autoStart: {
    control: 'boolean',
    description: 'Whether to start animation automatically when component is mounted',
    table: {
      category: 'props',
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
    description: 'Whether to loop the animation. Each cycle holds briefly after the last word settles, ' +
      'then every word restarts together.',
    table: {
      category: 'props',
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
      category: 'props',
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
      category: 'props',
      type: {
        summary: 'string',
      },
    },
  },

  // Slots
  default: {
    name: 'default',
    description: 'Text content to animate when not using the text prop. Only the text is animated; markup is not preserved.',
    control: 'text',
    table: {
      category: 'slots',
      type: {
        summary: 'text',
      },
    },
  },

  // Action Event Handlers
  start: {
    description: 'Emitted when the animation starts, and again at the start of each looped cycle',
    table: {
      category: 'events',
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  complete: {
    description: 'Emitted when the animation completes, and at the end of each looped cycle',
    table: {
      category: 'events',
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  progress: {
    description: 'Emitted as each word finishes animating, with wordsComplete, totalWords, and progress (0 to 1)',
    table: {
      category: 'events',
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
      category: 'events',
      disable: false,
      type: {
        summary: 'event',
      },
    },
  },
  resume: {
    description: 'Emitted when the animation resumes',
    table: {
      category: 'events',
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
  title: 'Components/Motion Text',
  component: DtMotionText,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
};

// Templates
const DefaultTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtMotionTextDefaultTemplate,
);

const ModesTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtMotionTextModesTemplate,
);

const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtMotionTextVariantsTemplate,
);

export const Default = {
  render: DefaultTemplate,
  args: {},
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
