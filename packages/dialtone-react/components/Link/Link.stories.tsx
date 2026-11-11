import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { StandIn } from '../../.storybook/StandIn';
import { DtLink, type DtLinkProps } from './Link';
import { LINK_VARIANTS } from './LinkConstants';

// The default slot is an arg named `default`, as in Vue, so both Storybooks share the arg. `kind` is Vue's
// deprecated alias of `tone`: it stays an arg so the stories match, but DtLink doesn't take it.
type LinkStoryArgs = DtLinkProps & { default?: string; kind?: string };

// Default Prop Values
export const argsData = {
  default: 'Default link',
  href: '#',
  to: null,
  replace: false,
  tone: '',
  kind: undefined,
  underline: true,
  rel: undefined,
  onClick: action('click'),
  onFocus: action('focusin'),
  onBlur: action('focusout'),
} satisfies Partial<LinkStoryArgs>;

// Controls. `type` (not in Vue's argTypes) is set on every prop react-docgen reports as a union: Storybook drops a
// URL value for a union arg, so without it the comparison couldn't drive these args in the React frame.
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

  // Props
  tone: {
    options: LINK_VARIANTS,
    control: {
      type: 'select',
    },
    type: 'string',
  },
  kind: {
    options: LINK_VARIANTS,
    control: {
      type: 'select',
    },
    table: { category: 'Deprecated' },
    description: 'Deprecated. Use tone instead.',
  },
  inverted: {
    table: { category: 'Deprecated' },
    description: 'Deprecated.',
  },
  href: {
    description: 'URL for anchor link navigation. Renders as a native <a> element.',
    control: 'text',
    type: 'string',
  },
  to: {
    description: 'Router destination. Renders the DtLinkProvider\'s link component. Takes precedence over href.',
    control: 'text',
    type: 'string',
  },
  replace: {
    description: 'When true, navigation replaces the current history entry. Only applies when `to` is provided.',
    control: 'boolean',
  },
  underline: {
    description: 'Determines whether the link should display an underline.',
    control: 'boolean',
  },

  // HTML attributes
  target: {
    description: 'HTML a target attribute. Where to display the linked URL.',
    type: 'string',
    table: {
      category: 'html attributes',
    },
    control: 'select',
    options: ['_self', '_blank', '_parent', '_top'],
  },
  rel: {
    description: 'HTML a rel attribute. Relationship between the location in the document containing the hyperlink and the destination resource.',
    type: 'string',
    table: {
      category: 'html attributes',
    },
    control: 'text',
  },

  // Action Event Handlers
  onClick: {
    table: {
      disable: true,
    },
  },
  onFocus: {
    table: {
      disable: true,
    },
  },
  onBlur: {
    table: {
      disable: true,
    },
  },

  click: {
    description: 'Native click event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusin: {
    description: 'Native focusin event',
    table: {
      type: { summary: 'event' },
    },
  },
  focusout: {
    description: 'Native focusout event',
    table: {
      type: { summary: 'event' },
    },
  },
} satisfies Meta<LinkStoryArgs>['argTypes'] & Record<string, object>;

// Story Collection
const meta = {
  title: 'Components/Link',
  component: DtLink,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<LinkStoryArgs>;

export default meta;
type Story = StoryObj<LinkStoryArgs>;

// LinkDefault.story.vue
function LinkDefault ({ default: defaultSlot, kind: _kind, ...args }: LinkStoryArgs) {
  return (
    <div>
      <DtLink
        href={args.href}
        to={args.to}
        replace={args.replace}
        tone={args.tone}
        inverted={args.inverted}
        underline={args.underline}
        rel={args.rel}
        onClick={args.onClick}
        onFocus={args.onFocus}
        onBlur={args.onBlur}
      >
        {defaultSlot}
      </DtLink>
    </div>
  );
}

// LinkVariants.story.vue
function LinkVariants () {
  return (
    <div>
      <StandIn for="stack">
        <div data-qa="dt-stack" className="d-stack d-stack--gap-100 d-stack--justify-start">
          <StandIn for="stack">
            <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-100 d-stack--align-baseline d-stack--justify-start d-fw-wrap">
              {LINK_VARIANTS.map(tone => (
                <DtLink key={tone} href="#" tone={tone}>
                  {tone || 'default'} link
                </DtLink>
              ))}
            </div>
          </StandIn>
          <StandIn for="stack">
            <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-400 d-stack--align-baseline d-stack--justify-start d-fw-wrap">
              <DtLink href="#" underline={false}>
                No underline link
              </DtLink>
            </div>
          </StandIn>
        </div>
      </StandIn>
    </div>
  );
}

export const Default: Story = {
  render: args => <LinkDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <LinkVariants />,
  args: {},

  parameters: {
    options: {
      showPanel: false,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};
