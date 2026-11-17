import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtIcon } from '../Icon';
import { ICON_NAMES, type IconName } from '../Icon/IconConstants';
import { DtIllustration } from '../Illustration';
import { ILLUSTRATION_NAMES, type IllustrationName } from '../Illustration/IllustrationConstants';
import { DtStack } from '../Stack';
import { DtEmptyState, type DtEmptyStateProps } from './EmptyState';
import { EMPTY_STATE_SIZE_MODIFIERS } from './EmptyStateConstants';

// Slots are args named as in Vue: `body` is an HTML string (Vue's template renders it through html-fragment), and
// `icon` and `illustration` are names.
type EmptyStateStoryArgs = Omit<DtEmptyStateProps, 'icon' | 'illustration' | 'body'> & {
  body?: string;
  icon?: IconName;
  illustration?: IllustrationName;
};

// Vue's getIllustrationNames() and getIconNames(): every name, after an empty choice.
const illustrationsList = [undefined, ...ILLUSTRATION_NAMES];
const iconsList = [undefined, ...ICON_NAMES];

export const argTypesData = {
  // Slots
  body: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },
  icon: {
    options: iconsList,
    table: {
      type: { summary: 'ReactNode' },
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
      type: { summary: 'ReactNode' },
    },
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },

  // Props
  illustrationClass: {
    description: 'Pass through classes. Used to customize the illustration container',
  },
  iconClass: {
    description: 'Pass through classes. Used to customize the icon container',
  },
  bodyClass: {
    description: 'Pass through classes. Used to customize the body slot container',
  },
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
} satisfies Meta<EmptyStateStoryArgs>['argTypes'];

export const argsData = {
  icon: undefined,
  illustration: undefined,
} satisfies Partial<EmptyStateStoryArgs>;

const meta = {
  title: 'Components/Empty State',
  component: DtEmptyState,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<EmptyStateStoryArgs>;

export default meta;
type Story = StoryObj<EmptyStateStoryArgs>;

// EmptyStateDefault.story.vue
function EmptyStateDefault ({ icon, illustration, body, ...args }: EmptyStateStoryArgs) {
  return (
    <DtEmptyState
      size={args.size}
      headerText={args.headerText}
      bodyText={args.bodyText}
      icon={icon ? ({ iconSize }) => <DtIcon name={icon} size={iconSize as '800'} /> : undefined}
      illustration={illustration ? <DtIllustration name={illustration} /> : undefined}
      body={<div dangerouslySetInnerHTML={{ __html: body ?? '' }} />}
    />
  );
}

// EmptyStateVariants.story.vue
function EmptyStateVariants () {
  return (
    <DtStack gap="800">
      {/* Large */}
      <section>
        <p className="d-label-sm d-fc-tertiary d-mbe-100">
          Large (lg)
        </p>
        <DtEmptyState
          size={400}
          headerText="Nothing to see here"
          bodyText="Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque."
          illustration={<DtIllustration name="mind" />}
          body={(
            <div className="d-mbs-100 d-stack d-stack--row d-stack--gap-50">
              <button className="d-btn">
                Cancel
              </button>
              <button className="d-btn d-btn--primary">
                Get started
              </button>
            </div>
          )}
        />
      </section>

      {/* Medium */}
      <section>
        <p className="d-label-sm d-fc-tertiary d-mbe-100">
          Medium (md)
        </p>
        <DtEmptyState
          size={300}
          headerText="Nothing to see here"
          bodyText="Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque."
          illustration={<DtIllustration name="mind" />}
        />
      </section>

      {/* Small */}
      <section>
        <p className="d-label-sm d-fc-tertiary d-mbe-100">
          Small (sm)
        </p>
        <DtEmptyState
          size={200}
          headerText="Nothing to see here"
          bodyText="Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque."
          icon={({ iconSize }) => <DtIcon name="search" size={iconSize as '800'} />}
        />
      </section>
    </DtStack>
  );
}

export const Variants: Story = {
  render: () => <EmptyStateVariants />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};

export const Default: Story = {
  render: args => <EmptyStateDefault {...args} />,

  args: {
    illustration: 'mind',
    size: 400,
    headerText: 'Nothing to see here',
    bodyText: 'Lorem ipsum dolor sit amet consectetur. Diam in aliquam arcu elit pulvinar morbi lorem ac neque.',
    body: '<div class="d-mbs-100 d-stack d-stack--row d-stack--gap-50"><button class="d-btn">Click me</button><button class="d-btn d-btn--primary">Click me</button></div>',
  },
};
