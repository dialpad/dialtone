import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';
import { StandIn } from '../../.storybook/StandIn';
import { useTooltipDirective } from '../Tooltip/TooltipDirective';
import { DtIcon, type DtIconProps } from './Icon';
import { ICON_NAMES, ICON_SIZE_MODIFIERS } from './IconConstants';

// The Variants story's `limit` and Vue's `showSkeleton` control aren't DtIcon props.
type IconStoryArgs = DtIconProps & { limit?: number; showSkeleton?: boolean };

// Vue's getIconNames(): every icon name, after an empty choice.
const iconsList = [undefined, ...ICON_NAMES];

export const argTypesData = {
  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
  name: {
    options: iconsList,
    control: {
      type: 'select',
      labels: {
        undefined: '(empty)',
      },
    },
  },
  showSkeleton: {
    control: {
      type: 'boolean',
    },
  },
} satisfies Meta<IconStoryArgs>['argTypes'];

export const argsData = {};

const meta = {
  title: 'Components/Icon',
  component: DtIcon,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<IconStoryArgs>;

export default meta;
type Story = StoryObj<IconStoryArgs>;

// dialtone-vue's IconDefault.story.vue.
function IconDefault ({ size, name, ariaLabel }: IconStoryArgs) {
  return <DtIcon size={size} name={name} ariaLabel={ariaLabel} />;
}

// Button isn't ported: Vue's <dt-button importance="clear" kind="muted" size="lg"> with only a startIcon, as it
// renders, with v-dt-tooltip on its element. Its startIcon scope's iconSize for size lg is '400'.
function IconButton ({ icon, copiedIcon, onClick }: { icon: string; copiedIcon: string | null; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useTooltipDirective(ref, { message: copiedIcon === icon ? '✅ Copied!' : icon, delay: false });
  return (
    <StandIn for="button">
      <button
        ref={ref}
        className="base-button__button d-btn d-btn--muted d-btn--lg d-btn--icon-only"
        data-qa="dt-button"
        type="button"
        onClick={onClick}
      >
        <span data-qa="dt-button-start-icon" className="base-button__icon d-btn__icon d-btn__icon--left">
          <DtIcon name={icon as DtIconProps['name']} size="400" />
        </span>
      </button>
    </StandIn>
  );
}

// dialtone-vue's IconVariants.story.vue.
function IconVariants ({ limit }: IconStoryArgs) {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);

  const copyIconName = (icon: string) => {
    navigator.clipboard.writeText(icon);
    setCopiedIcon(icon);
    timeout.current = setTimeout(() => { setCopiedIcon(null); }, 1200);
  };

  return (
    <div>
      {Object.entries(categories).map(([category, icons]) => [
        <h2 key={`${category}-heading`} className="d-tt-capitalize d-my-200">{category}</h2>,
        <StandIn for="stack" key={category}>
          <div data-qa="dt-stack" className="d-stack d-stack--row d-stack--gap-0 d-fw-wrap">
            {Object.keys(icons).slice(0, limit).map(icon => (
              <IconButton
                key={`${category}-${icon}`}
                icon={icon}
                copiedIcon={copiedIcon}
                onClick={() => copyIconName(icon)}
              />
            ))}
          </div>
        </StandIn>,
      ])}
    </div>
  );
}

export const Default: Story = {
  render: args => <IconDefault {...args} />,

  args: {
    name: 'accessibility',
  },
  parameters: {
    percy: {
      args: {
        showSkeleton: false,
      },
    },
  },
};

export const Variants: Story = {
  render: args => <IconVariants {...args} />,
  args: { limit: undefined },
  parameters: {
    percy: {
      args: {
        limit: 10,
        showSkeleton: false,
      },
    },
    options: { showPanel: false },
    controls: { disable: true },
  },
};
