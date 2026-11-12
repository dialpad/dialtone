import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtItemLayout, type DtItemLayoutProps } from './ItemLayout';

// The slots are string args, as in Vue (`default` is the default slot), so both Storybooks share the args.
type ItemLayoutStoryArgs = Omit<
  DtItemLayoutProps,
  'start' | 'end' | 'subtitle' | 'blockEnd' | 'selected' | 'left' | 'right' | 'bottom'
> & {
  default?: string;
  start?: string;
  end?: string;
  subtitle?: string;
  blockEnd?: string;
  selected?: string;
  left?: string;
  right?: string;
  bottom?: string;
};

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  blockEnd: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  bottom: {
    table: {
      disable: true,
    },
  },
  start: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  left: {
    table: {
      disable: true,
    },
  },
  end: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  right: {
    table: {
      disable: true,
    },
  },
  selected: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },
  subtitle: {
    control: 'text',
    table: {
      type: {
        summary: 'VNode',
      },
    },
  },

  unstyled: {
    control: { type: 'boolean' },
  },

  startClass: {
    control: 'text',
    type: 'string',
  },
  blockEndClass: {
    control: 'text',
    type: 'string',
  },
  endClass: {
    control: 'text',
    type: 'string',
  },
} satisfies Meta<ItemLayoutStoryArgs>['argTypes'];

// Set default values at the story level here.
export const argsData = {
  start: 'Start slot',
  end: 'End slot',
  default: 'Default slot',
  subtitle: 'Subtitle slot',
  blockEnd: 'Block End slot',
  selected: 'Selected slot',
} satisfies Partial<ItemLayoutStoryArgs>;

// Story Collection
const meta = {
  title: 'Components/Item Layout',
  component: DtItemLayout,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<ItemLayoutStoryArgs>;

export default meta;
type Story = StoryObj<ItemLayoutStoryArgs>;

// The Vue template passes every slot, rendering its HTML arg in a span when it isn't empty.
const htmlSlot = (html?: string) => (html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : null);

// ItemLayoutDefault.story.vue
function ItemLayoutDefault ({
  default: defaultSlot, start, end, subtitle, blockEnd, selected, ...args
}: ItemLayoutStoryArgs) {
  return (
    <DtItemLayout
      as={args.as}
      unstyled={args.unstyled}
      startClass={args.startClass}
      contentClass={args.contentClass}
      titleClass={args.titleClass}
      subtitleClass={args.subtitleClass}
      blockEndClass={args.blockEndClass}
      endClass={args.endClass}
      selectedClass={args.selectedClass}
      start={htmlSlot(start)}
      subtitle={htmlSlot(subtitle)}
      blockEnd={htmlSlot(blockEnd)}
      end={htmlSlot(end)}
      selected={htmlSlot(selected)}
    >
      {htmlSlot(defaultSlot)}
    </DtItemLayout>
  );
}

// Stories
export const Default: Story = {
  render: args => <ItemLayoutDefault {...args} />,
  args: {},
};
