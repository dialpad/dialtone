import type { Meta, StoryObj } from '@storybook/react-vite';
import { createElement, type ReactNode } from 'react';
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
// Vue's html-fragment puts the HTML straight into the list, so turn the string into nodes instead of wrapping it.
function htmlToNodes (html: string): ReactNode[] {
  const template = document.createElement('template');
  template.innerHTML = html;
  const convert = (node: Node, key: number): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const el = node as Element;
    const props: Record<string, unknown> = { key };
    for (const { name, value } of Array.from(el.attributes)) {
      if (name === 'class') props.className = value;
      else if (name === 'for') props.htmlFor = value;
      else if (name === 'style') {
        props.style = Object.fromEntries(value.split(';').filter(d => d.includes(':')).map(d => {
          const [prop, ...val] = d.split(':');
          return [prop.trim().replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), val.join(':').trim()];
        }));
      } else props[name] = value;
    }
    return createElement(el.tagName.toLowerCase(), props, ...Array.from(el.childNodes).map(convert));
  };
  return Array.from(template.content.childNodes).map(convert);
}

function BreadcrumbsDefault ({ default: defaultSlot, ...args }: BreadcrumbsStoryArgs) {
  return (
    <div className={args.inverted ? 'd-bgc-contrast' : undefined}>
      <DtBreadcrumbs {...args}>
        {defaultSlot ? htmlToNodes(defaultSlot) : undefined}
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
