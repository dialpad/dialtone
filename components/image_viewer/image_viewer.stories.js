import { createTemplateFromVueFile } from '@/common/storybook_utils';
import DtImageViewer from './image_viewer';
import DtImageViewerMdx from './image_viewer.mdx';
import DtImageViewerDefaultTemplate from './image_viewer_default.story.vue';
import DtImageViewerVariantsTemplate from './image_viewer_variants.story.vue';
import { action } from '@storybook/addon-actions';

const defaultImage = require('./test.jpg');

// Default Prop Values
export const argsData = {
  onOpened: action('opened'),
  imageSrc: defaultImage,
  imageAlt: 'Image Alt Text',
  closeAriaLabel: 'Close',
  imageButtonClass: 'd-wmn64 d-hmn64 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
};

/**
 * example prop description decorator
 */

/*
  Controls
  ========

  Here we define any custom controls or control overrides for our components.

  By default storybook will attempt to provide an appropriate control of the same name for each property in the
  component as well as include any description provided using a prop decorator within your component (see above).

  Storybook will also attempt to provide an appropriate control for each slot in the component as well as include any
  description provided using a slot decorator within your component (see below).

  <!-- @slot example slot decorator -->
*/
export const argTypesData = {

  imageSrc: {
    description: 'Url for the image',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },

  imageAlt: {
    description: 'Alt for image',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },

  imageButtonClass: {
    description: 'Image button class',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },

  ariaLabel: {
    description: 'Aria label for image button',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },

  closeAriaLabel: {
    description: 'Aria label for close',
    table: {
      category: 'props',
      type: {
        summary: 'string',
      },
    },
    control: {
      type: 'text',
    },
  },

  // Events
  onOpened: {
    table: {
      disable: true,
    },
  },

  'update:open': {
    table: {
      disable: true,
    },
  },

  opened: {
    description: `emitted when popover is shown or hidden.`,
    table: {
      type: {
        summary: 'event',
      },
    },
  },
};

// Story Collection
export default {
  title: 'Components/Image Viewer',
  component: DtImageViewer,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
  parameters: {
    controls: {
      sort: 'requiredFirst',
    },
    docs: {
      page: DtImageViewerMdx,
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
  DtImageViewerDefaultTemplate,
);
const VariantsTemplate = (args, { argTypes }) => createTemplateFromVueFile(
  args,
  argTypes,
  DtImageViewerVariantsTemplate,
);

// Stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  imageSrc: defaultImage,
  imageAlt: 'Image Alt Text',
  closeAriaLabel: 'Close',
  imageButtonClass: 'd-wmn64 d-hmn64 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
};

export const Variants = VariantsTemplate.bind({});
Variants.args = {};
Variants.parameters = {
  controls: {
    disable: true,
  },
  actions: {
    disable: true,
  },
  options: {
    showPanel: false,
  },
  a11y: {
    config: {
      rules: [
        {
          id: 'aria-allowed-attr',
          enabled: false,
        },
      ],
    },
  },
};
