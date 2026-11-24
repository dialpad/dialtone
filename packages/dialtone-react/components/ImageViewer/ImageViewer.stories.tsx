import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { DtStack } from '../Stack';
import { DtImageViewer, type DtImageViewerProps } from './ImageViewer';

import { asset } from '../../.storybook/asset';
// Vue imports these files; Storybook serves Vue's assets directory at the root.
const defaultImage = asset('test.jpg');
const fryImage = asset('fry.gif');

// Default Prop Values
export const argsData = {
  onOpened: action('opened'),
  imageSrc: defaultImage,
  imageAlt: 'Image Alt Text',
  imageButtonClass: 'd-wmn-100 d-hmn-100 w-wmx332 d-hmx332',
  ariaLabel: 'Click to open image',
} satisfies Partial<DtImageViewerProps>;

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

  // Events
  onOpened: {
    table: {
      disable: true,
    },
  },

  // Vue's `update:open`.
  onOpenChange: {
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
} satisfies Meta<DtImageViewerProps>['argTypes'] & { opened: object };

// Story Collection
const meta = {
  title: 'Components/Image Viewer',
  component: DtImageViewer,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtImageViewerProps>;

export default meta;
type Story = StoryObj<DtImageViewerProps>;

// ImageViewerDefault.story.vue
function ImageViewerDefault (args: DtImageViewerProps) {
  const [isOpen, setIsOpen] = useState(args.open);

  return (
    <DtImageViewer
      open={isOpen}
      onOpenChange={setIsOpen}
      appendTo={args.appendTo}
      imageSrc={args.imageSrc}
      imageAlt={args.imageAlt}
      imageButtonClass={args.imageButtonClass}
      ariaLabel={args.ariaLabel}
      onOpened={args.onOpened}
    />
  );
}

// ImageViewerVariants.story.vue
function ImageViewerVariants () {
  return (
    <DtStack gap="200">
      <DtImageViewer
        imageSrc={defaultImage}
        imageAlt="Alt Text"
        imageButtonClass="d-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500"
        ariaLabel="Click to open image"
      />

      <DtImageViewer
        imageSrc={fryImage}
        imageAlt="Alt Text"
        imageButtonClass="d-wmn-100 d-hmn-100 d-wmx-500 d-hmx-500"
        ariaLabel="Click to open image"
      />
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <ImageViewerDefault {...args} />,

  args: {
    imageSrc: defaultImage,
    imageAlt: 'Image Alt Text',
    imageButtonClass: 'd-wmn-100 d-hmn-100 w-wmx332 d-hmx332',
    ariaLabel: 'Click to open image',
  },
};

export const Variants: Story = {
  render: () => <ImageViewerVariants />,
  args: {},

  parameters: {
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
  },
};
