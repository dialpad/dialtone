import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtBreadcrumbItem, type DtBreadcrumbItemProps } from './BreadcrumbItem';

// Default Prop Values
export const argsData = {
  href: '#',
  label: 'Breadcrumb Item',
  selected: false,
} satisfies Partial<DtBreadcrumbItemProps>;

// `type` (not in Vue's argTypes) is set on `href`, which react-docgen reports as a union: Storybook drops a URL
// value for a union arg, so without it the comparison couldn't drive it in the React frame.
export const argTypesData = {
  // HTML attributes
  href: {
    description: 'HTML a href attribute',
    table: {
      category: 'html attributes',
    },
    control: 'text',
    type: 'string',
  },
  label: {
    control: { type: 'text' },
  },
  selected: {
    control: { type: 'boolean' },
  },
  inverted: {
    table: { category: 'Deprecated' },
    description: 'Deprecated.',
  },
} satisfies Meta<DtBreadcrumbItemProps>['argTypes'];

// Story Collection
const meta = {
  title: 'Components/Breadcrumbs',
  component: DtBreadcrumbItem,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<DtBreadcrumbItemProps>;

export default meta;
type Story = StoryObj<DtBreadcrumbItemProps>;

// BreadcrumbItemDefault.story.vue
export const BreadcrumbItem: Story = {
  render: ({ inverted, selected, label, href, className }) => (
    <ol className="d-breadcrumbs__list">
      <DtBreadcrumbItem
        inverted={inverted}
        selected={selected}
        label={label}
        href={href}
        className={className}
      />
    </ol>
  ),
  args: {},
};
