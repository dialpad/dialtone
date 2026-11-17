import type { Meta, StoryObj } from '@storybook/react-vite';
import { cx } from '../../common/cx';
import { DtButton } from '../Button';
import { DtIcon } from '../Icon';
import { DtText } from '../Text';
import { DtCard, type DtCardProps } from './Card';

// Vue's story template reads the slots from $attrs as HTML strings (v-html), so `header`, `content` and `footer`
// are strings here, and `showHeader`, `showFooter` and `variants` are story-only args.
type CardStoryArgs = Omit<DtCardProps, 'header' | 'content' | 'footer'> & {
  header?: string;
  content?: string;
  footer?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  variants?: boolean;
};

// Default Prop Values
export const argsData = {} satisfies Partial<CardStoryArgs>;

export const argTypesData = {
  // Props
  showFooter: {
    table: {
      disable: true,
    },
  },

  showHeader: {
    table: {
      disable: true,
    },
  },

  variants: {
    table: {
      disable: true,
    },
  },

  maxHeight: {
    control: { type: 'text' },
  },

  // Slots
  content: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  footer: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  header: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
} satisfies Meta<CardStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Card',
  component: DtCard,
  tags: ['!dev', '!autodocs'],
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<CardStoryArgs>;

// CardDefault.story.vue
function CardDefault ({
  showHeader = false,
  showFooter = false,
  variants = false,
  maxHeight = null,
  header,
  content,
  footer,
  className,
  headerClass,
  contentClass,
  footerClass,
}: CardStoryArgs) {
  let headerSlot;
  if (showHeader && variants) {
    headerSlot = (
      <>
        <DtText
          kind="headline"
          size={300}
          as="h3"
        >
          Header
        </DtText>
        <DtButton
          size={100}
          importance="clear"
          kind="muted"
          aria-label="Menu button"
          startIcon={(
            <DtIcon
              name="more-vertical"
              size={100}
            />
          )}
        />
      </>
    );
  } else if (header) {
    headerSlot = <span dangerouslySetInnerHTML={{ __html: header }} />;
  }

  let footerSlot;
  if (showFooter && variants) {
    footerSlot = (
      <>
        <DtButton>
          Button 1
        </DtButton>
        <DtButton>
          Button 2
        </DtButton>
      </>
    );
  } else if (footer) {
    footerSlot = <span dangerouslySetInnerHTML={{ __html: footer }} />;
  }

  return (
    <DtCard
      className={cx('d-w264', className)}
      headerClass={headerClass}
      contentClass={contentClass}
      footerClass={footerClass}
      maxHeight={maxHeight}
      header={headerSlot}
      content={content
        ? (
          <div>
            <span dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )
        : (
          <div tabIndex={0}>
            Default content slot. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec fermentum molestie semper. Morbi finibus nulla turpis, nec molestie mi rutrum.
          </div>
        )}
      footer={footerSlot}
    />
  );
}

const DefaultTemplate: Story['render'] = args => <CardDefault {...args} />;

export const Default: Story = {
  render: DefaultTemplate,
  args: {},
};

export const WithHeader: Story = {
  render: DefaultTemplate,

  args: {
    showHeader: true,
    variants: true,
  },
};

export const WithFooter: Story = {
  render: DefaultTemplate,

  args: {
    showFooter: true,
    variants: true,
  },
};

export const WithHeaderAndFooter: Story = {
  render: DefaultTemplate,

  args: {
    showHeader: true,
    showFooter: true,
    variants: true,
  },
};

export const WithScrollableContent: Story = {
  render: DefaultTemplate,

  args: {
    maxHeight: '50px',
  },
};
