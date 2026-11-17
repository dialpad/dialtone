import type { Meta, StoryObj } from '@storybook/react-vite';
import { DtStack } from '../Stack';
import { DtProgressCircle, type DtProgressCircleProps } from './ProgressCircle';
import {
  PROGRESS_CIRCLE_SIZES,
  PROGRESS_CIRCLE_SIZE_DEFAULT,
  PROGRESS_CIRCLE_KINDS,
  PROGRESS_CIRCLE_KIND_DEFAULT,
  type ProgressCircleKind,
  type ProgressCircleSize,
} from './ProgressCircleConstants';

type ProgressCircleStoryArgs = Omit<DtProgressCircleProps, 'ariaLabel' | 'aria-label'> & { ariaLabel: string };

export const argsData: Partial<ProgressCircleStoryArgs> = {
  ariaLabel: 'Upload progress',
  progress: 50,
  size: PROGRESS_CIRCLE_SIZE_DEFAULT,
  kind: PROGRESS_CIRCLE_KIND_DEFAULT,
};

export const argTypesData = {
  progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  size: {
    options: Object.keys(PROGRESS_CIRCLE_SIZES),
    control: { type: 'select' },
  },
  kind: {
    options: Object.keys(PROGRESS_CIRCLE_KINDS),
    control: { type: 'select' },
  },
} satisfies Meta<ProgressCircleStoryArgs>['argTypes'];

const meta = {
  title: 'Components/Progress Circle',
  component: DtProgressCircle,
  excludeStories: /.*Data$/,
  args: argsData,
  argTypes: argTypesData,
} satisfies Meta<ProgressCircleStoryArgs>;

export default meta;
type Story = StoryObj<ProgressCircleStoryArgs>;

const sizes = Object.keys(PROGRESS_CIRCLE_SIZES) as ProgressCircleSize[];
const kinds = Object.keys(PROGRESS_CIRCLE_KINDS) as ProgressCircleKind[];

// ProgressCircleDefault.story.vue
function ProgressCircleDefault ({ ariaLabel, progress }: ProgressCircleStoryArgs) {
  return <DtProgressCircle ariaLabel={ariaLabel} progress={progress} />;
}

// ProgressCircleVariants.story.vue
function ProgressCircleVariants () {
  return (
    <DtStack direction="column" gap="200">
      <DtStack>
        <h4>Value</h4>
        <DtStack direction="row" gap="200" align="center">
          {[0, 25, 50, 75, 100].map(v => (
            <DtStack key={v} gap="50" align="center">
              <span className="d-code--sm">{v}%</span>
              <DtProgressCircle progress={v} ariaLabel={`${v}% complete`} />
            </DtStack>
          ))}
        </DtStack>
      </DtStack>
      <DtStack>
        <h4>Size</h4>
        <DtStack direction="row" gap="200" align="start">
          {sizes.map(size => (
            <DtStack key={size} gap="50" align="center">
              <span className="d-code--sm">{size}</span>
              <DtProgressCircle size={size} progress={66} ariaLabel={`size ${size}`} />
            </DtStack>
          ))}
        </DtStack>
      </DtStack>
      <DtStack>
        <h4>Kind</h4>
        <DtStack direction="row" gap="200" align="center">
          {kinds.map(kind => (
            <DtStack key={kind} gap="50" align="center">
              <span className="d-code--sm">{kind}</span>
              <DtProgressCircle kind={kind} progress={66} ariaLabel={`kind ${kind}`} />
            </DtStack>
          ))}
        </DtStack>
      </DtStack>
    </DtStack>
  );
}

export const Default: Story = {
  render: args => <ProgressCircleDefault {...args} />,
  args: {},
};

export const Variants: Story = {
  render: () => <ProgressCircleVariants />,
  parameters: { options: { showPanel: false }, controls: { disable: true } },
  args: {},
};
