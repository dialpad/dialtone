import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { categories } from '@dialpad/dialtone-icons/keywords-icons.json';
import { DtButton } from '../Button';
import { DtStack } from '../Stack';
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

// Vue's <dt-button importance="clear" kind="muted" size="lg"> with only a startIcon, with v-dt-tooltip on it.
function IconButton ({ icon, copiedIcon, onClick }: { icon: string; copiedIcon: string | null; onClick: () => void }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useTooltipDirective(el, { message: copiedIcon === icon ? '✅ Copied!' : icon, delay: false });
  return (
    <DtButton
      ref={setEl}
      aria-label={`Copy ${icon} icon name`}
      importance="clear"
      kind="muted"
      size={400}
      onClick={onClick}
      startIcon={({ iconSize }) => <DtIcon name={icon as DtIconProps['name']} size={iconSize} />}
    />
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
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => { setCopiedIcon(null); }, 1200);
  };

  return (
    <div>
      {Object.entries(categories).map(([category, icons]) => [
        <h2 key={`${category}-heading`} className="d-tt-capitalize d-my-200">{category}</h2>,
        <DtStack key={category} direction="row" className="d-fw-wrap">
          {Object.keys(icons).slice(0, limit).map(icon => (
            <IconButton
              key={`${category}-${icon}`}
              icon={icon}
              copiedIcon={copiedIcon}
              onClick={() => copyIconName(icon)}
            />
          ))}
        </DtStack>,
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
