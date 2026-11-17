import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtBreadcrumbItem } from './BreadcrumbItem';
import { DtBreadcrumbs, type DtBreadcrumbsProps } from './Breadcrumbs';

// The default slot is an arg named `default`, as in Vue. Vue's template renders it through html-fragment, so it
// is an HTML string.
type BreadcrumbsStoryArgs = Omit<DtBreadcrumbsProps, 'children'> & { default?: string };

// Default Prop Values
export const argsData = {
  breadcrumbs: [
    {
      href: '#',
      label: 'Root',
    },
    {
      href: '#',
      label: 'Section',
    },
    {
      href: '#',
      label: 'Section',
    },
    {
      href: '#',
      label: 'Section',
    },
    {
      href: '#',
      label: 'Current Page',
      selected: true,
    },
  ],
} satisfies Partial<BreadcrumbsStoryArgs>;

export const argTypesData = {
  // Slots
  default: {
    control: 'text',
    table: {
      type: {
        summary: 'ReactNode',
      },
    },
  },

  // Props
  breadcrumbs: {
    control: 'object',
    table: {
      defaultValue: {
        summary: '{ href: string, label: string }[]',
      },
    },
  },
  ariaLabel: {
    control: { type: 'text' },
  },
  inverted: {
    table: { category: 'Deprecated' },
    description: 'Deprecated.',
  },
} satisfies Meta<BreadcrumbsStoryArgs>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Breadcrumbs',
  component: DtBreadcrumbs,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<BreadcrumbsStoryArgs>;

export default meta;
type Story = StoryObj<BreadcrumbsStoryArgs>;

// Templates
// BreadcrumbsDefault.story.vue
function BreadcrumbsDefault ({ default: defaultSlot, breadcrumbs, inverted }: BreadcrumbsStoryArgs) {
  return (
    <div className={inverted ? 'd-bgc-contrast' : undefined}>
      <DtBreadcrumbs breadcrumbs={breadcrumbs} inverted={inverted}>
        {defaultSlot ? <div dangerouslySetInnerHTML={{ __html: defaultSlot }} /> : undefined}
      </DtBreadcrumbs>
    </div>
  );
}

// BreadcrumbsVariants.story.vue
function BreadcrumbsVariants ({ breadcrumbs }: BreadcrumbsStoryArgs) {
  return (
    <div>
      <DtBreadcrumbs className="d-py-200 d-px-150" breadcrumbs={breadcrumbs} />
      <DtBreadcrumbs className="d-py-200 d-px-150">
        {breadcrumbs?.map((breadcrumb, idx) => (
          <DtBreadcrumbItem key={breadcrumb.label! + idx} {...breadcrumb} />
        ))}
      </DtBreadcrumbs>
    </div>
  );
}

export const Default: Story = {
  render: args => <BreadcrumbsDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: args => <BreadcrumbsVariants {...args} />,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'landmark-unique',
            enabled: false,
          },
        ],
      },
    },
  },
};
