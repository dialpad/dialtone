import type { Meta, StoryObj } from '@storybook/react-vite';
import { ICON_SIZE_MODIFIERS } from '../Icon';
import { DtStack } from '../Stack';
import { DtLoader, type DtLoaderProps } from './Loader';
import { LOADER_KIND_MODIFIERS, type LoaderKind } from './LoaderConstants';

type LoaderStoryArgs = DtLoaderProps;

export const argTypesData = {
  kind: {
    options: Object.keys(LOADER_KIND_MODIFIERS),
    control: {
      type: 'select',
    },
  },

  size: {
    options: Object.keys(ICON_SIZE_MODIFIERS),
    control: {
      type: 'select',
    },
  },
} satisfies Meta<LoaderStoryArgs>['argTypes'];

export const argsData = {};

const meta = {
  title: 'Components/Loader',
  component: DtLoader,
  args: argsData,
  argTypes: argTypesData,
  excludeStories: /.*Data$/,
} satisfies Meta<LoaderStoryArgs>;

export default meta;
type Story = StoryObj<LoaderStoryArgs>;

const kinds = Object.keys(LOADER_KIND_MODIFIERS) as LoaderKind[];
// Object.keys gives the numeric keys as strings, which IconSize accepts.
const sizes = Object.keys(ICON_SIZE_MODIFIERS) as `${keyof typeof ICON_SIZE_MODIFIERS}`[];

// LoaderDefault.story.vue
function LoaderDefault ({ ariaLabel, kind, size }: LoaderStoryArgs) {
  return <DtLoader ariaLabel={ariaLabel} kind={kind} size={size} />;
}

// LoaderVariants.story.vue
function LoaderVariants () {
  return (
    <DtStack direction="row" gap="500">
      {kinds.map(kind => (
        <DtStack key={kind} className="d-br d-pie-200" gap="200">
          <h2>Sizes ({kind})</h2>
          {sizes.map(size => (
            <DtStack key={size} direction="row" gap="200">
              {size}
              <DtLoader kind={kind} size={size} />
            </DtStack>
          ))}
        </DtStack>
      ))}
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <LoaderDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <LoaderVariants />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
